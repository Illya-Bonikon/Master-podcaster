package com.example

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.example.services.GenerateAudioSummaryRequest
import com.example.services.GenerateImageRequest
import com.example.services.GenerateImageResponse
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.plugins.calllogging.*
import io.ktor.server.plugins.compression.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.hsts.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import java.time.Duration
import kotlin.time.Duration.Companion.seconds
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Database
import org.slf4j.event.*
import com.example.services.PythonAiService

fun Application.configureRouting(database: Database) {
    configureAuthRouting(database)

    val aiService = PythonAiService()

    routing {

        authenticate("auth-jwt") {
            get("/me/podcasts") {
                val principal = call.principal<JWTPrincipal>()
                val userId = principal!!.payload.getClaim("userId").asInt()
                call.respond("та йди ти нафіг користувач")
            }
        }
    }
}
