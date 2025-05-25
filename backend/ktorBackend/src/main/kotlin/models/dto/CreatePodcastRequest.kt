package com.example.models.dto

import kotlinx.serialization.Serializable

@Serializable
data class CreatePodcastRequest(
    val title: String,
    val prompt: String,
    val isPublic: Boolean
)
