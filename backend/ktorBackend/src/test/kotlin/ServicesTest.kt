import com.example.models.domain.*
import com.example.services.*
import kotlinx.coroutines.runBlocking
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import kotlin.test.*

class EpisodeServiceTest {

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

class ModeratorServiceTest {

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

class PodcastServiceTest {

    private lateinit var db: Database
    private lateinit var service: PodcastService
    private var creatorId: Int = -1

    @BeforeTest
    fun setup() {
        db = Database.connect("jdbc:h2:mem:test_podcast;DB_CLOSE_DELAY=-1;", driver = "org.h2.Driver")
        transaction(db) {
            SchemaUtils.drop(Podcasts, Users) // 🔄 Скидаємо схему перед кожним запуском
            SchemaUtils.create(Users, Podcasts)

            // Створюємо юзера
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
        val podcast2 = ExposedPodcast(0, "title2", "prompt2", true, "img.png", creatorId + 1) // 👈 інший creatorId
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

class UserServiceTest {

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
