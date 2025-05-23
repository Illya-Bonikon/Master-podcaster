package com.example.services

import com.example.models.domain.ExposedModerator
import com.example.models.domain.Moderators
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

class ModeratorService(private val database: Database) {

    init {
        transaction(database) {
            SchemaUtils.create(Moderators)
        }
    }

    fun getModeratorByEmail(email: String): ExposedModerator? = transaction(database) {
        Moderators.selectAll().where { Moderators.email eq email }
            .map {
                ExposedModerator(
                    id = it[Moderators.id].value,
                    email = it[Moderators.email],
                    passwordHash = it[Moderators.passwordHash],
                    displayName = it[Moderators.displayName]
                )
            }
            .singleOrNull()
    }
}
