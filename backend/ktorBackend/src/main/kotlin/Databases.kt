    package com.example

    import org.jetbrains.exposed.sql.*
    import com.example.config.DatabaseConfig

    fun configureDatabases(): Database {
        return Database.connect(
            url = DatabaseConfig.url,
            user = DatabaseConfig.user,
            driver = DatabaseConfig.driver,
            password = DatabaseConfig.password,
        )
    }
