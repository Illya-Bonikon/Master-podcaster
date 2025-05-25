package com.example.services

import com.example.models.domain.Episodes
import com.example.models.domain.ExposedEpisode
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.Database

class EpisodeService(database: Database) {
    init {
        transaction(database) {
            SchemaUtils.create(Episodes)
        }
    }

    suspend fun getByPodcastId(podcastId: Int): List<ExposedEpisode> = dbQuery {
        Episodes.selectAll().where { Episodes.podcastId eq podcastId }
            .map { it.toExposedEpisode() }
    }

    suspend fun getById(id: Int): ExposedEpisode? = dbQuery {
        Episodes.selectAll().where { Episodes.id eq id }
            .map { it.toExposedEpisode() }
            .singleOrNull()
    }

    suspend fun insert(episode: ExposedEpisode): Int = dbQuery {
        Episodes.insertAndGetId {
            it[podcastId] = episode.podcastId
            it[summary] = episode.summary
            it[audioPath] = episode.audioPath
        }.value
    }

    private fun ResultRow.toExposedEpisode() = ExposedEpisode(
        id = this[Episodes.id].value,
        podcastId = this[Episodes.podcastId].value,
        summary = this[Episodes.summary],
        audioPath = this[Episodes.audioPath]
    )

    private suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}
