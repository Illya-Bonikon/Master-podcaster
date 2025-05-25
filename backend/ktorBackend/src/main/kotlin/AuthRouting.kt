package com.example

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.example.config.JwtConfig
import com.example.models.domain.ExposedUser
import com.example.models.dto.LoginRequest
import com.example.models.dto.RegisterRequest
import com.example.services.UserService
import com.example.services.ModeratorService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.mindrot.jbcrypt.BCrypt
import org.jetbrains.exposed.sql.Database

fun Application.configureAuthRouting(database: Database) {
    val userService = UserService(database)
    val moderatorService = ModeratorService(database)

    routing {
        route("/auth") {
            post("/register") {
                val request = call.receive<RegisterRequest>()
                val hashed = BCrypt.hashpw(request.password, BCrypt.gensalt())
                val id = userService.addUser(ExposedUser(0, request.email, hashed, request.displayName))
                if (id == null) {
                    call.respond(HttpStatusCode.Conflict, "User with this email already exists.")
                } else {
                    call.respond(HttpStatusCode.Created, mapOf("id" to id))
                }
            }

            post("/login") {
                val request = call.receive<LoginRequest>()

                val user = userService.getUserByEmail(request.email)
                if (user != null && BCrypt.checkpw(request.password, user.passwordHash)) {
                    val token = JWT.create()
                        .withAudience(JwtConfig.audience)
                        .withIssuer(JwtConfig.domain)
                        .withClaim("userId", user.id)
                        .withClaim("role", "user")
                        .sign(Algorithm.HMAC256(JwtConfig.secret))
                    call.respond(mapOf("token" to token))
                    return@post
                }

                val moderator = moderatorService.getModeratorByEmail(request.email)
                if (moderator != null && BCrypt.checkpw(request.password, moderator.passwordHash)) {
                    val token = JWT.create()
                        .withAudience(JwtConfig.audience)
                        .withIssuer(JwtConfig.domain)
                        .withClaim("moderatorId", moderator.id)
                        .withClaim("role", "moderator")
                        .sign(Algorithm.HMAC256(JwtConfig.secret))
                    call.respond(mapOf("token" to token))
                    return@post
                }

                call.respond(HttpStatusCode.Unauthorized, "Invalid credentials")
            }
        }
    }
}
