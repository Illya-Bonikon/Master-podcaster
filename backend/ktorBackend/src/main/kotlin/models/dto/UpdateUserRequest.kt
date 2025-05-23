package com.example.models.dto

import com.example.models.domain.ExposedUser

@kotlinx.serialization.Serializable
data class UpdateUserRequest(
    val email: String,
    val passwordHash: String,
    val displayName: String
)

fun UpdateUserRequest.toExposedUser(id: Int) = ExposedUser(
    id = id,
    email = email,
    passwordHash = passwordHash,
    displayName = displayName
)
