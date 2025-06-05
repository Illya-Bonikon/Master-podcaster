package com.example

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.compression.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.hsts.*

fun Application.configureHTTP() {
    install(HSTS) {
        includeSubDomains = true
    }
    install(Compression)
    install(CORS) {
        allowHost("localhost:5173", schemes = listOf("http"))
        allowHost("0d2f-91-235-225-85.ngrok-free.app", schemes = listOf("https"))
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)

        allowHeader(HttpHeaders.Authorization)
        allowHeader("ngrok-skip-browser-warning")
        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Accept)

        allowCredentials = true
    }
}
