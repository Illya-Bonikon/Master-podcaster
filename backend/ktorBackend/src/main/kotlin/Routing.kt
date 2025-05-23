package com.example

import com.example.models.dto.UpdateUserRequest
import com.example.models.dto.toExposedUser
import com.example.models.dto.CreatePodcastRequest
import com.example.models.dto.CreateEpisodeRequest
import com.example.models.domain.ExposedEpisode
import com.example.models.domain.ExposedPodcast
import com.example.services.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.Database
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit

val aiSemaphore = Semaphore(1)

fun Application.configureRouting(database: Database) {
    configureAuthRouting(database)

    val podcastService = PodcastService(database)
    val episodeService = EpisodeService(database)
    val userService = UserService(database)
    val aiService = PythonAiService()

    routing {
        get("/podcasts/public") {
            val publicPodcasts = podcastService.getAll().filter { it.isPublic }
            call.respond(publicPodcasts)
        }

        get("/podcasts/search") {
            val query = call.request.queryParameters["query"] ?: ""
            if (query.isBlank()) {
                call.respond(HttpStatusCode.BadRequest, errorResponse("Missing or empty 'query' parameter"))
                return@get
            }

            val results = podcastService.searchPublicPodcasts(query)
            call.respond(results)
        }

        authenticate("auth-jwt") {
            route("/podcasts") {
                post {
                    val principal = call.principal<JWTPrincipal>() ?: return@post
                    val creatorId = principal.getUserId() ?: return@post
                    val request = call.receive<CreatePodcastRequest>()

                    val imagePath = aiSemaphore.withPermit {
                        aiService.generateImage(request.prompt)
                    }

                    val podcast = ExposedPodcast(
                        id = 0,
                        title = request.title,
                        prompt = request.prompt,
                        isPublic = request.isPublic,
                        imagePath = imagePath,
                        creatorId = creatorId
                    )
                    val podcastId = podcastService.insert(podcast)
                    call.respond(HttpStatusCode.Created, mapOf("id" to podcastId))
                }

                patch("/{id}") {
                    val principal = call.principal<JWTPrincipal>() ?: return@patch
                    val userId = principal.getUserId() ?: return@patch
                    val id = call.parameters["id"]?.toIntOrNull() ?: return@patch call.respond(HttpStatusCode.BadRequest, errorResponse("Invalid podcast ID"))
                    val podcast = podcastService.getById(id) ?: return@patch call.respond(HttpStatusCode.NotFound, errorResponse("Podcast not found"))
                    if (podcast.creatorId != userId) return@patch call.respond(HttpStatusCode.Forbidden, errorResponse("Unauthorized"))
                    val updated = podcastService.update(id, podcast.copy(isPublic = !podcast.isPublic))
                    call.respond(if (updated) HttpStatusCode.OK else HttpStatusCode.InternalServerError)
                }

                post("/{id}/episodes") {
                    val principal = call.principal<JWTPrincipal>() ?: return@post
                    val userId = principal.getUserId() ?: return@post
                    val id = call.parameters["id"]?.toIntOrNull()
                        ?: return@post call.respond(HttpStatusCode.BadRequest, errorResponse("Invalid podcast ID"))
                    val podcast = podcastService.getById(id)
                        ?: return@post call.respond(HttpStatusCode.NotFound, errorResponse("Podcast not found"))
                    if (podcast.creatorId != userId) {
                        return@post call.respond(HttpStatusCode.Forbidden, errorResponse("Unauthorized"))
                    }
                    val request = call.receive<CreateEpisodeRequest>()
                    val fullPrompt = podcast.prompt + "\n" + request.prompt

                    val audioResponse = aiSemaphore.withPermit {
                        aiService.generateAudioSummary(fullPrompt)
                    }

                    val episode = ExposedEpisode(
                        id = 0,
                        podcastId = id,
                        summary = audioResponse.summary,
                        audioPath = audioResponse.audioPath
                    )
                    val episodeId = episodeService.insert(episode)
                    call.respond(HttpStatusCode.Created, mapOf("id" to episodeId))
                }

                get("/{id}/episodes") {
                    val principal = call.principal<JWTPrincipal>() ?: return@get
                    val userId = principal.getUserId() ?: return@get
                    val id = call.parameters["id"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest, errorResponse("Invalid podcast ID"))
                    val podcast = podcastService.getById(id) ?: return@get call.respond(HttpStatusCode.NotFound, errorResponse("Podcast not found"))
                    if (!podcast.isPublic && podcast.creatorId != userId) return@get call.respond(HttpStatusCode.Forbidden, errorResponse("Unauthorized"))
                    val episodes = episodeService.getByPodcastId(id)
                    call.respond(episodes)
                }
            }

            get("/episodes/{id}") {
                val principal = call.principal<JWTPrincipal>() ?: return@get
                val userId = principal.getUserId() ?: return@get
                val id = call.parameters["id"]?.toIntOrNull() ?: return@get call.respond(HttpStatusCode.BadRequest, errorResponse("Invalid episode ID"))
                val episode = episodeService.getById(id) ?: return@get call.respond(HttpStatusCode.NotFound, errorResponse("Episode not found"))
                val podcast = podcastService.getById(episode.podcastId) ?: return@get call.respond(HttpStatusCode.NotFound, errorResponse("Podcast not found"))
                if (!podcast.isPublic && podcast.creatorId != userId) return@get call.respond(HttpStatusCode.Forbidden, errorResponse("Unauthorized"))
                call.respond(episode)
            }

            route("/users") {
                get {
                    val principal = call.principal<JWTPrincipal>() ?: return@get
                    val userId = principal.getUserId() ?: return@get call.respond(HttpStatusCode.Forbidden, errorResponse("🔒 Немає доступу"))

                    val user = userService.getUserById(userId)
                    if (user == null) call.respond(HttpStatusCode.NotFound, errorResponse("😕 Користувача не знайдено"))
                    else call.respond(user)
                }

                patch {
                    val principal = call.principal<JWTPrincipal>() ?: return@patch
                    val userId = principal.getUserId() ?: return@patch call.respond(HttpStatusCode.Forbidden, errorResponse("🔒 Немає доступу"))

                    val request = call.receive<UpdateUserRequest>()
                    val updated = userService.updateUser(userId, request.toExposedUser(userId))

                    if (updated) call.respond(HttpStatusCode.OK, successResponse("✅ Профіль оновлено"))
                    else call.respond(HttpStatusCode.NotFound, errorResponse("😕 Користувача не знайдено"))
                }

                get("/podcasts") {
                    val principal = call.principal<JWTPrincipal>() ?: return@get
                    val userId = principal.getUserId() ?: return@get call.respond(HttpStatusCode.Forbidden, errorResponse("🔒 Немає доступу"))

                    val podcasts = podcastService.getByCreatorId(userId)
                    call.respond(podcasts)
                }

                get("/search") {
                    val principal = call.principal<JWTPrincipal>() ?: return@get
                    val userId = principal.getUserId() ?: return@get call.respond(HttpStatusCode.Forbidden, errorResponse("🔒 Немає доступу"))

                    val query = call.request.queryParameters["query"]?.trim() ?: ""
                    if (query.isBlank()) {
                        call.respond(HttpStatusCode.BadRequest, errorResponse("❌ Введіть пошуковий запит"))
                        return@get
                    }

                    val allUserPodcasts = podcastService.getByCreatorId(userId)
                    val filtered = allUserPodcasts.filter {
                        it.title.contains(query, ignoreCase = true) ||
                                it.prompt.contains(query, ignoreCase = true)
                    }

                    call.respond(filtered)
                }
            }

            delete("/users/{id}") {
                val principal = call.principal<JWTPrincipal>() ?: return@delete
                if (principal.getRole() != "moderator") {
                    call.respond(HttpStatusCode.Forbidden, errorResponse("🛡 Доступ лише для модераторів"))
                    return@delete
                }

                val userId = call.validateUserId() ?: return@delete

                val deleted = userService.deleteUser(userId)
                if (deleted) call.respond(HttpStatusCode.OK, successResponse("Користувач видалений"))
                else call.respond(HttpStatusCode.NotFound, errorResponse("Користувача не знайдено"))
            }

            delete("/podcasts/{id}") {
                val principal = call.principal<JWTPrincipal>() ?: return@delete
                if (principal.getRole() != "moderator") {
                    call.respond(HttpStatusCode.Forbidden, errorResponse("🛡 Доступ лише для модераторів"))
                    return@delete
                }

                val podcastId = call.parameters["id"]?.toIntOrNull()
                if (podcastId == null) {
                    call.respond(HttpStatusCode.BadRequest, errorResponse("Невалідний ID"))
                    return@delete
                }

                val deleted = podcastService.delete(podcastId)
                if (deleted) call.respond(HttpStatusCode.OK, successResponse("Подкаст видалено"))
                else call.respond(HttpStatusCode.NotFound, errorResponse("Подкаст не знайдено"))
            }
        }
    }
}

private suspend fun ApplicationCall.validateUserId(): Int? {
    val userId = parameters["id"]?.toIntOrNull()
    if (userId == null) {
        respond(HttpStatusCode.BadRequest, errorResponse("❌ Невалідний ID"))
        return null
    }
    return userId
}

private fun JWTPrincipal.getUserId(): Int? = payload.getClaim("userId").asInt()
private fun JWTPrincipal.getRole(): String? = payload.getClaim("role").asString()

private fun errorResponse(message: String) = mapOf("error" to message)
private fun successResponse(message: String) = mapOf("message" to message)
