package com.example.services

import com.example.models.domain.ExposedModerator
import com.example.models.domain.Moderators
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction

class ModeratorService(private val database: Database) {

    fun addModerator(moderator: ExposedModerator): Int = transaction(database) {
        Moderators.insert {
            it[email] = moderator.email
            it[passwordHash] = moderator.passwordHash
        } get Moderators.id
    }.value

    fun getModeratorByEmail(email: String): ExposedModerator? = transaction(database) {
        Moderators.selectAll().where { Moderators.email eq email }
            .map {
                ExposedModerator(
                    id = it[Moderators.id].value,
                    email = it[Moderators.email],
                    passwordHash = it[Moderators.passwordHash]
                )
            }
            .singleOrNull()
    }

    fun getAllModerators(): List<ExposedModerator> = transaction(database) {
        Moderators.selectAll().map {
            ExposedModerator(
                id = it[Moderators.id].value,
                email = it[Moderators.email],
                passwordHash = it[Moderators.passwordHash]
            )
        }
    }
}
