package com.example.services

import com.example.models.domain.ExposedUser
import com.example.models.domain.Users
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.Database

class UserService(database: Database) {

    init {
        transaction(database) {
            SchemaUtils.create(Users)
        }
    }

    suspend fun getAllUsers(): List<ExposedUser> = dbQuery {
        Users.selectAll().map {
            ExposedUser(
                id = it[Users.id].value,
                email = it[Users.email],
                passwordHash = it[Users.passwordHash],
                displayName = it[Users.displayName]
            )
        }
    }

    suspend fun addUser(user: ExposedUser): Int = dbQuery {
        Users.insertAndGetId {
            it[email] = user.email
            it[passwordHash] = user.passwordHash
            it[displayName] = user.displayName
        }.value
    }

    suspend fun getUserByEmail(email: String): ExposedUser? = dbQuery {
        Users.select { Users.email eq email }
            .map {
                ExposedUser(
                    id = it[Users.id].value,
                    email = it[Users.email],
                    passwordHash = it[Users.passwordHash],
                    displayName = it[Users.displayName]
                )
            }
            .singleOrNull()
    }

    private suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}
