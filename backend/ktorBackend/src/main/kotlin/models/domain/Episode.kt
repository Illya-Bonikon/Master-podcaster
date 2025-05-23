package com.example.models.domain

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.id.IntIdTable

object Episodes : IntIdTable() {
    val podcastId = reference("podcast_id", Podcasts)
    val summary = varchar("summary", 10000)
    val audioPath = varchar("audio_path", 255)
}

@Serializable
data class ExposedEpisode(
    val id: Int,
    val podcastId: Int,
    val summary: String,
    val audioPath: String,
)
