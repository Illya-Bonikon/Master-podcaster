package com.example.services

import com.example.models.domain.ExposedUser
import com.example.models.domain.Users
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class UserService(database: Database) {

    init {
        transaction(database) {
            SchemaUtils.create(Users)
        }
    }

    suspend fun getAllUsers(): List<ExposedUser> = dbQuery {
        Users.selectAll().map {
            it.toExposedUser()
        }
    }

    suspend fun addUser(user: ExposedUser): Int? = dbQuery {
        val existingUser = Users.selectAll().where { Users.email eq user.email }.singleOrNull()
        if (existingUser != null) {
            null
        } else {
            Users.insertAndGetId {
                it[displayName] = user.displayName
                it[email] = user.email
                it[passwordHash] = user.passwordHash
            }.value
        }
    }


    suspend fun getUserByEmail(email: String): ExposedUser? = dbQuery {
        Users.selectAll().where { Users.email eq email }
            .map { it.toExposedUser() }
            .singleOrNull()
    }

    suspend fun getUserById(id: Int): ExposedUser? = dbQuery {
        Users.selectAll().where { Users.id eq id }
            .map { it.toExposedUser() }
            .singleOrNull()
    }

    suspend fun updateUser(id: Int, updatedUser: ExposedUser): Boolean = dbQuery {
        Users.update({ Users.id eq id }) {
            it[email] = updatedUser.email
            it[passwordHash] = updatedUser.passwordHash
            it[displayName] = updatedUser.displayName
        } > 0
    }

    suspend fun deleteUser(id: Int): Boolean = dbQuery {
        Users.deleteWhere { Users.id eq id } > 0
    }

    private fun ResultRow.toExposedUser() = ExposedUser(
        id = this[Users.id].value,
        email = this[Users.email],
        passwordHash = this[Users.passwordHash],
        displayName = this[Users.displayName]
    )

    private suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}
