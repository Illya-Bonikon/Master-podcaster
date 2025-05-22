package com.example

import io.ktor.server.application.*
import com.example.configureDatabases
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.Test
import kotlin.test.assertNotNull

class DatabaseTest {
    @Test
    fun testDatabaseConnection() {
        val db: Database = configureDatabases()

        transaction(db) {
            val result = exec("SELECT 1") { rs ->
                if (rs.next()) rs.getInt(1) else null
            }
            assertNotNull(result, "Database did not return a result")
        }
    }
}