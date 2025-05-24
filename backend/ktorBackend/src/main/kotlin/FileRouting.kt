package com.example

import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.http.content.*
import java.io.File

fun Application.configureFileRouting() {
    routing {
        staticFiles("/media", File("D:/kpi/Master-podcaster/backend/media"))
    }
}
