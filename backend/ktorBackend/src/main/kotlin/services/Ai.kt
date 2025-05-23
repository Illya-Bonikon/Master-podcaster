package com.example.services
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

@Serializable
data class GenerateImageRequest(val text: String)

@Serializable
data class GenerateImageResponse(val imagePath: String)

@Serializable
data class GenerateAudioSummaryRequest(val prompt: String)

@Serializable
data class GenerateAudioSummaryResponse(val summary: String, val audioPath: String)

class PythonAiService(
    private val baseUrl: String = "http://localhost:5000"
) {
    private val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    suspend fun generateImage(text: String): String {
        val response = client.post("$baseUrl/generate-image") {
            contentType(ContentType.Application.Json)
            setBody(GenerateImageRequest(text))
        }.body<GenerateImageResponse>()
        return response.imagePath
    }

    suspend fun generateAudioSummary(prompt: String): GenerateAudioSummaryResponse {
        return client.post("$baseUrl/generate-audio-summary") {
            contentType(ContentType.Application.Json)
            setBody(GenerateAudioSummaryRequest(prompt))
        }.body()
    }
}
