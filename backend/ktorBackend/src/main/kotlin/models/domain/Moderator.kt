package com.example.models.domain

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.id.IntIdTable

object Moderators : IntIdTable() {
    val passwordHash = varchar("password_hash", 255)
    val email = varchar("email", 100).uniqueIndex()
    val displayName = varchar("display_name", 100)
}

@Serializable
data class ExposedModerator(
    val id: Int,
    val email: String,
    val passwordHash: String,
    val displayName: String
)
