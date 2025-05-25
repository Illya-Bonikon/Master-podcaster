package com.example

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
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.mindrot.jbcrypt.BCrypt
import kotlin.test.*

class RoutingTest {
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
