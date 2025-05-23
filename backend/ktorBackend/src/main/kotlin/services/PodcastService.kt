package com.example.services

import com.example.models.domain.ExposedPodcast
import com.example.models.domain.Podcasts
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

class PodcastService(database: Database) {
    init {
        transaction(database) {
            SchemaUtils.create(Podcasts)
        }
    }

    suspend fun getAll(): List<ExposedPodcast> = dbQuery {
        Podcasts.selectAll().map {
            it.toExposedPodcast()
        }
    }

    suspend fun getById(id: Int): ExposedPodcast? = dbQuery {
        Podcasts.selectAll().where { Podcasts.id eq id }
            .map { it.toExposedPodcast() }
            .singleOrNull()
    }

    suspend fun getByCreatorId(creatorId: Int): List<ExposedPodcast> = dbQuery {
        Podcasts.selectAll().where { Podcasts.creatorId eq creatorId }
            .map { it.toExposedPodcast() }
    }

    suspend fun insert(podcast: ExposedPodcast): Int = dbQuery {
        Podcasts.insertAndGetId {
            it[title] = podcast.title
            it[prompt] = podcast.prompt
            it[isPublic] = podcast.isPublic
            it[imagePath] = podcast.imagePath
            it[creatorId] = podcast.creatorId
        }.value
    }

    suspend fun update(id: Int, podcast: ExposedPodcast): Boolean = dbQuery {
        Podcasts.update({ Podcasts.id eq id }) {
            it[title] = podcast.title
            it[prompt] = podcast.prompt
            it[isPublic] = podcast.isPublic
            it[imagePath] = podcast.imagePath
        } > 0
    }

    suspend fun delete(id: Int): Boolean = dbQuery {
        Podcasts.deleteWhere { Podcasts.id eq id } > 0
    }

    private fun ResultRow.toExposedPodcast() = ExposedPodcast(
        id = this[Podcasts.id].value,
        title = this[Podcasts.title],
        prompt = this[Podcasts.prompt],
        isPublic = this[Podcasts.isPublic],
        imagePath = this[Podcasts.imagePath],
        creatorId = this[Podcasts.creatorId].value
    )

    private suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}
