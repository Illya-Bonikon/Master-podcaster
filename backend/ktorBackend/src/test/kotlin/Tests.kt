import com.example.*
import com.example.services.*
import kotlinx.coroutines.runBlocking
import kotlin.test.*
import com.example.models.domain.Episodes
import com.example.models.domain.Moderators
import com.example.models.domain.Podcasts
import com.example.models.domain.Users
import com.example.models.dto.CreateEpisodeRequest
import com.example.models.dto.CreatePodcastRequest
import com.example.models.dto.LoginRequest
import com.example.models.dto.RegisterRequest
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.transactions.transaction
import com.example.models.domain.*
import org.jetbrains.exposed.sql.*
import org.mindrot.jbcrypt.BCrypt

class PythonAiServiceIntegrationTest1 {

    private val service = PythonAiService("http://localhost:5000")

    @Test
    fun testGenerateImage() = runBlocking {
        val inputText = "a cat in a spacesuit on Mars"
        val imagePath = service.generateImage(inputText)

        println("Generated image path: $imagePath")

        assertTrue(imagePath.isNotBlank(), "Image path should not be blank")
        assertTrue(imagePath.endsWith(".png"), "Image path should be a valid image file")
    }

    @Test
    fun testGenerateAudioSummary() = runBlocking {
        val prompt = "Explain quantum computing in simple terms"
        val response = service.generateAudioSummary(prompt)

        println("Generated summary: ${response.summary}")
        println("Generated audio path: ${response.audioPath}")

        assertTrue(response.summary.isNotBlank(), "Summary should not be blank")
        assertTrue(response.audioPath.isNotBlank(), "Audio path should not be blank")
        assertTrue(response.audioPath.endsWith(".wav"), "Audio path should be a valid audio file")
    }
}

class RoutingTest1 {
    @Test
    fun testAuthEndpoints() = testApplication {
        application {
            configureSerialization()
            configureHTTP()
            configureSecurity()
            configureRouting(testDb())
            configureFileRouting()
        }

        val client = createClient {
            install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
                json()
            }
        }

        transaction(testDb()) {
            Episodes.deleteAll()
            Podcasts.deleteAll()
            Moderators.deleteAll()
            Users.deleteAll()
        }

        val registerResponse = client.post("/auth/register") {
            contentType(ContentType.Application.Json)
            setBody(RegisterRequest("test@example.com", "test1234", "Test User"))
        }
        assertEquals(HttpStatusCode.Created, registerResponse.status)

        val registerDuplicate = client.post("/auth/register") {
            contentType(ContentType.Application.Json)
            setBody(RegisterRequest("test@example.com", "test1234", "Test User 2"))
        }
        assertEquals(HttpStatusCode.Conflict, registerDuplicate.status)

        val loginResponse = client.post("/auth/login") {
            contentType(ContentType.Application.Json)
            setBody(LoginRequest("test@example.com", "test1234"))
        }
        assertEquals(HttpStatusCode.OK, loginResponse.status)
        val token = loginResponse.bodyAsText().substringAfter(":\"").substringBefore("\"")

        val loginFail = client.post("/auth/login") {
            contentType(ContentType.Application.Json)
            setBody(LoginRequest("test@example.com", "wrongpass"))
        }
        assertEquals(HttpStatusCode.Unauthorized, loginFail.status)

        val loginNoUser = client.post("/auth/login") {
            contentType(ContentType.Application.Json)
            setBody(LoginRequest("nouser@example.com", "anyPass"))
        }
        assertEquals(HttpStatusCode.Unauthorized, loginNoUser.status)

        val publicResponse = client.get("/podcasts/public")
        assertEquals(HttpStatusCode.OK, publicResponse.status)

        val searchFail = client.get("/podcasts/search")
        assertEquals(HttpStatusCode.BadRequest, searchFail.status)

        val searchEmptyQuery = client.get("/podcasts/search?query=")
        assertEquals(HttpStatusCode.BadRequest, searchEmptyQuery.status)

        val searchValid = client.get("/podcasts/search?query=test")
        assertEquals(HttpStatusCode.OK, searchValid.status)

        val authHeaders: HttpRequestBuilder.() -> Unit = {
            header(HttpHeaders.Authorization, "Bearer $token")
            contentType(ContentType.Application.Json)
        }

        val createPodcastResponse = client.post("/podcasts") {
            authHeaders()
            setBody(CreatePodcastRequest("My Podcast", "funny cats", true))
        }
        assertEquals(HttpStatusCode.Created, createPodcastResponse.status)
        val podcastId = createPodcastResponse.bodyAsText().substringAfter(":").substringBefore("}").toInt()


        val getPodcastResponse = client.get("/podcasts/$podcastId") {
            authHeaders()
        }
        assertEquals(HttpStatusCode.OK, getPodcastResponse.status)

        val getPodcastInvalidId = client.get("/podcasts/999999") {
            authHeaders()
        }
        assertEquals(HttpStatusCode.NotFound, getPodcastInvalidId.status)

        val getPodcastBadId = client.get("/podcasts/abc") {
            authHeaders()
        }
        assertEquals(HttpStatusCode.BadRequest, getPodcastBadId.status)

        val patchPodcast = client.patch("/podcasts/$podcastId") {
            authHeaders()
        }
        assertEquals(HttpStatusCode.OK, patchPodcast.status)

        val patchPodcastInvalidId = client.patch("/podcasts/abc") {
            authHeaders()
        }
        assertEquals(HttpStatusCode.BadRequest, patchPodcastInvalidId.status)

        val patchPodcastNotOwner = run {
            val registerOther = client.post("/auth/register") {
                contentType(ContentType.Application.Json)
                setBody(RegisterRequest("other@example.com", "pass5678", "Other User"))
            }
            assertEquals(HttpStatusCode.Created, registerOther.status)

            val loginOther = client.post("/auth/login") {
                contentType(ContentType.Application.Json)
                setBody(LoginRequest("other@example.com", "pass5678"))
            }
            assertEquals(HttpStatusCode.OK, loginOther.status)
            val tokenOther = loginOther.bodyAsText().substringAfter(":\"").substringBefore("\"")

            val response = client.patch("/podcasts/$podcastId") {
                header(HttpHeaders.Authorization, "Bearer $tokenOther")
            }
            response.status
        }
        assertEquals(HttpStatusCode.Forbidden, patchPodcastNotOwner)

        val episodeResponse = client.post("/podcasts/$podcastId/episodes") {
            authHeaders()
            setBody(CreateEpisodeRequest("cat news"))
        }
        assertEquals(HttpStatusCode.Created, episodeResponse.status)
        val episodeId = episodeResponse.bodyAsText().substringAfter(":").substringBefore("}").toInt()

        val episodeInvalidPodcastId = client.post("/podcasts/abc/episodes") {
            authHeaders()
            setBody(CreateEpisodeRequest("some prompt"))
        }
        assertEquals(HttpStatusCode.BadRequest, episodeInvalidPodcastId.status)

        val episodeNotOwner = client.post("/podcasts/$podcastId/episodes") {
            header(HttpHeaders.Authorization, "Bearer ")
            contentType(ContentType.Application.Json)
            setBody(CreateEpisodeRequest("try to add episode"))
        }
        assert(episodeNotOwner.status == HttpStatusCode.Forbidden || episodeNotOwner.status == HttpStatusCode.Unauthorized)

        val getEpisodes = client.get("/podcasts/$podcastId/episodes") {
            authHeaders()
        }
        assertEquals(HttpStatusCode.OK, getEpisodes.status)

        val getEpisodesInvalidPodcast = client.get("/podcasts/999999/episodes") {
            authHeaders()
        }
        assertEquals(HttpStatusCode.NotFound, getEpisodesInvalidPodcast.status)

        val getEpisode = client.get("/episodes/$episodeId") {
            authHeaders()
        }
        assertEquals(HttpStatusCode.OK, getEpisode.status)

        val getEpisodeInvalidId = client.get("/episodes/abc") {
            authHeaders()
        }
        assertEquals(HttpStatusCode.BadRequest, getEpisodeInvalidId.status)

        val getEpisodeNotFound = client.get("/episodes/999999") {
            authHeaders()
        }
        assertEquals(HttpStatusCode.NotFound, getEpisodeNotFound.status)

        val getUser = client.get("/users") {
            authHeaders()
        }
        assertEquals(HttpStatusCode.OK, getUser.status)

        val patchUser = client.patch("/users") {
            authHeaders()
            contentType(ContentType.Application.Json)
            setBody(
                mapOf(
                    "email" to "newemail@example.com",
                    "password" to "newpassword123",
                    "displayName" to "New Name"
                )
            )
        }
        assertEquals(HttpStatusCode.OK, patchUser.status)

        val userPodcasts = client.get("/users/podcasts") {
            authHeaders()
        }
        assertEquals(HttpStatusCode.OK, userPodcasts.status)

        val searchFailUser = client.get("/users/search") {
            authHeaders()
        }
        assertEquals(HttpStatusCode.BadRequest, searchFailUser.status)

        val searchValidUser = client.get("/users/search?query=My") {
            authHeaders()
        }
        assertEquals(HttpStatusCode.OK, searchValidUser.status)

        val forbiddenResponse = client.get("/podcasts/$podcastId") {
            header(HttpHeaders.Authorization, "Bearer ")
        }
        assertEquals(HttpStatusCode.Unauthorized, forbiddenResponse.status)

        transaction(testDb()) {
            Moderators.insert {
                it[email] = "moderator@example.com"
                it[passwordHash] = BCrypt.hashpw("moderatorPass123", BCrypt.gensalt())
                it[displayName] = "Moderator Name"
            }
        }

        val loginMod = client.post("/auth/login") {
            contentType(ContentType.Application.Json)
            setBody(LoginRequest("moderator@example.com", "moderatorPass123"))
        }
        assertEquals(HttpStatusCode.OK, loginMod.status)
        val tokenMod = loginMod.bodyAsText().substringAfter(":\"").substringBefore("\"")

        val modDeletePodcast = client.delete("/podcasts/$podcastId") {
            header(HttpHeaders.Authorization, "Bearer $tokenMod")
        }
        assertEquals(HttpStatusCode.OK, modDeletePodcast.status)

        val modDeleteUser = client.delete("/users/1") {
            header(HttpHeaders.Authorization, "Bearer $tokenMod")
        }
        assert(modDeleteUser.status == HttpStatusCode.NoContent || modDeleteUser.status == HttpStatusCode.NotFound)
    }

    private fun testDb(): Database {
        val db = Database.connect(
            url = "jdbc:mysql://localhost:3306/test",
            driver = "com.mysql.cj.jdbc.Driver",
            user = "root",
            password = "new_password"
        )

        transaction(db) {
            SchemaUtils.create(Users, Podcasts, Episodes, Moderators)
        }

        return db
    }
}

class EpisodeServiceTest1 {

    private lateinit var db: Database
    private lateinit var service: EpisodeService
    private var podcastId: Int = -1

    @BeforeTest
    fun setup() {
        db = Database.connect("jdbc:h2:mem:test_episode;DB_CLOSE_DELAY=-1;", driver = "org.h2.Driver")
        transaction(db) {
            SchemaUtils.create(Users, Podcasts, Episodes)

            Users.deleteAll()
            Podcasts.deleteAll()

            val userId = Users.insertAndGetId {
                it[email] = "user@example.com"
                it[passwordHash] = "someHash"
                it[displayName] = "name"
            }

            podcastId = Podcasts.insertAndGetId {
                it[title] = "My Podcast"
                it[prompt] = "A great podcast about tech"
                it[isPublic] = true
                it[imagePath] = "/images/podcast.jpg"
                it[creatorId] = userId
            }.value
        }
        service = EpisodeService(db)
    }

    @Test
    fun testInsert() = runBlocking {
        val episode = ExposedEpisode(0, podcastId, "summary", "audioPath")
        val id = service.insert(episode)
        assertTrue(id > 0)
    }

    @Test
    fun testGetById() = runBlocking {
        val episode = ExposedEpisode(0, podcastId, "summary", "audioPath")
        val id = service.insert(episode)
        val fetched = service.getById(id)
        assertNotNull(fetched)
        assertEquals(id, fetched.id)
        assertEquals("summary", fetched.summary)
    }

    @Test
    fun testGetByPodcastId() = runBlocking {
        val episode1 = ExposedEpisode(0, podcastId, "s1", "a1")
        val episode2 = ExposedEpisode(0, podcastId, "s2", "a2")
        service.insert(episode1)
        service.insert(episode2)
        val list = service.getByPodcastId(podcastId)
        assertEquals(2, list.size)
        assertTrue(list.any { it.summary == "s1" })
        assertTrue(list.any { it.summary == "s2" })
    }
}

class ModeratorServiceTest1 {

    private lateinit var db: Database
    private lateinit var service: ModeratorService

    @BeforeTest
    fun setup() {
        db = Database.connect("jdbc:h2:mem:test_moderator;DB_CLOSE_DELAY=-1;", driver = "org.h2.Driver")
        transaction(db) {
            SchemaUtils.create(Moderators)
            Moderators.deleteAll()
            Moderators.insert {
                it[email] = "test@example.com"
                it[passwordHash] = "hash"
                it[displayName] = "Mod"
            }
        }
        service = ModeratorService(db)
    }

    @Test
    fun testGetModeratorByEmail() {
        val mod = service.getModeratorByEmail("test@example.com")
        assertNotNull(mod)
        assertEquals("Mod", mod.displayName)
    }

    @Test
    fun testGetModeratorByEmailNotFound() {
        val mod = service.getModeratorByEmail("no@user.com")
        assertNull(mod)
    }
}

class PodcastServiceTest1 {

    private lateinit var db: Database
    private lateinit var service: PodcastService
    private var creatorId: Int = -1

    @BeforeTest
    fun setup() {
        db = Database.connect("jdbc:h2:mem:test_podcast;DB_CLOSE_DELAY=-1;", driver = "org.h2.Driver")
        transaction(db) {
            SchemaUtils.drop(Podcasts, Users)
            SchemaUtils.create(Users, Podcasts)

            creatorId = Users.insertAndGetId {
                it[email] = "user@example.com"
                it[passwordHash] = "hash"
                it[displayName] = "test user"
            }.value
        }
        service = PodcastService(db)
    }

    @Test
    fun testInsertAndGetById() = runBlocking {
        val podcast = ExposedPodcast(0, "title", "prompt", true, "img.png", creatorId)
        val id = service.insert(podcast)
        val fetched = service.getById(id)
        assertNotNull(fetched)
        assertEquals("title", fetched.title)
    }

    @Test
    fun testGetAll() = runBlocking {
        val podcast = ExposedPodcast(0, "titleAll", "promptAll", true, "img.png", creatorId)
        service.insert(podcast)
        val all = service.getAll()
        assertTrue(all.isNotEmpty())
    }

    @Test
    fun testGetByCreatorId() = runBlocking {
        val podcast1 = ExposedPodcast(0, "title1", "prompt1", true, "img.png", creatorId)
        val podcast2 = ExposedPodcast(0, "title2", "prompt2", true, "img.png", creatorId + 1)
        service.insert(podcast1)
        transaction(db) {
            Users.insert {
                it[email] = "other@example.com"
                it[passwordHash] = "hash"
                it[displayName] = "other user"
            }
        }
        service.insert(podcast2)
        val list = service.getByCreatorId(creatorId)
        assertEquals(1, list.size)
    }

    @Test
    fun testUpdate() = runBlocking {
        val podcast = ExposedPodcast(0, "titleOld", "promptOld", true, "img.png", creatorId)
        val id = service.insert(podcast)
        val updatedPodcast = ExposedPodcast(id, "titleNew", "promptNew", false, "img2.png", creatorId)
        val updated = service.update(id, updatedPodcast)
        assertTrue(updated)
        val fetched = service.getById(id)
        assertEquals("titleNew", fetched?.title)
        assertEquals(false, fetched?.isPublic)
    }

    @Test
    fun testDelete() = runBlocking {
        val podcast = ExposedPodcast(0, "titleDel", "promptDel", true, "img.png", creatorId)
        val id = service.insert(podcast)
        val deleted = service.delete(id)
        assertTrue(deleted)
        val fetched = service.getById(id)
        assertNull(fetched)
    }

    @Test
    fun testSearchPublicPodcasts() = runBlocking {
        val podcast1 = ExposedPodcast(0, "Kotlin podcast", "Learn Kotlin", true, "img.png", creatorId)
        val podcast2 = ExposedPodcast(0, "Java podcast", "Learn Java", false, "img.png", creatorId)
        service.insert(podcast1)
        service.insert(podcast2)
        val results = service.searchPublicPodcasts("Kotlin")
        assertEquals(1, results.size)
        assertEquals("Kotlin podcast", results.first().title)
    }
}

class UserServiceTest1 {

    private lateinit var db: Database
    private lateinit var service: UserService

    @BeforeTest
    fun setup() {
        db = Database.connect("jdbc:h2:mem:test_user;DB_CLOSE_DELAY=-1;", driver = "org.h2.Driver")
        transaction(db) { SchemaUtils.create(Users) }
        service = UserService(db)
    }

    @Test
    fun testAddUserAndGetByEmail() = runBlocking {
        val user = ExposedUser(0, "test@example.com", "hash", "Test User")
        val id = service.addUser(user)
        assertNotNull(id)
        val fetched = service.getUserByEmail("test@example.com")
        assertNotNull(fetched)
        assertEquals("Test User", fetched.displayName)
    }

    @Test
    fun testAddUserDuplicate() = runBlocking {
        val user = ExposedUser(0, "dup@example.com", "hash", "Dup User")
        val id1 = service.addUser(user)
        val id2 = service.addUser(user)
        assertNotNull(id1)
        assertNull(id2)
    }

    @Test
    fun testGetUserById() = runBlocking {
        val user = ExposedUser(0, "iduser@example.com", "hash", "ID User")
        val id = service.addUser(user)
        val fetched = service.getUserById(id!!)
        assertNotNull(fetched)
        assertEquals("ID User", fetched.displayName)
    }

    @Test
    fun testUpdateUser() = runBlocking {
        val user = ExposedUser(0, "update@example.com", "hash", "Old Name")
        val id = service.addUser(user)
        val updatedUser = ExposedUser(id!!, "update@example.com", "newhash", "New Name")
        val updated = service.updateUser(id, updatedUser)
        assertTrue(updated)
        val fetched = service.getUserById(id)
        assertEquals("New Name", fetched?.displayName)
    }

    @Test
    fun testDeleteUser() = runBlocking {
        val user = ExposedUser(0, "delete@example.com", "hash", "ToDelete")
        val id = service.addUser(user)
        val deleted = service.deleteUser(id!!)
        assertTrue(deleted)
        val fetched = service.getUserById(id)
        assertNull(fetched)
    }

    @Test
    fun testGetAllUsers() = runBlocking {
        val user = ExposedUser(0, "all@example.com", "hash", "All User")
        service.addUser(user)
        val all = service.getAllUsers()
        assertTrue(all.isNotEmpty())
    }
}

class DatabaseConfigTest1 {

    @Test
    fun `test database connection with SELECT 1`() {
        val db: Database = configureDatabases()

        transaction(db) {
            val result = exec("SELECT 1") { rs ->
                if (rs.next()) rs.getInt(1) else null
            }

            assertEquals(1, result)
        }
    }
}
