package com.example.models.dto

import kotlinx.serialization.Serializable

@Serializable
data class CreateEpisodeRequest(
    val prompt: String
)
