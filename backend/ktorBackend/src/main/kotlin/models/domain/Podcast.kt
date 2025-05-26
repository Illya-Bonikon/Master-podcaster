package com.example.models.domain

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.ReferenceOption

object Podcasts : IntIdTable() {
    val title = varchar("title", 200).index()
    val prompt = varchar("prompt", 500).index()
    val isPublic = bool("is_public")
    val imagePath = varchar("image_path", 255)
    val creatorId = reference("creator_id", Users, onDelete = ReferenceOption.CASCADE)
}

@Serializable
data class ExposedPodcast(
    val id: Int,
    val title: String,
    val prompt: String,
    val isPublic: Boolean,
    val imagePath: String,
    val creatorId: Int
)
