package com.example.models.dto

import com.example.models.domain.ExposedUser
import org.mindrot.jbcrypt.BCrypt

@kotlinx.serialization.Serializable
data class UpdateUserRequest(
    val email: String,
    val password: String,
    val displayName: String
)

fun UpdateUserRequest.toExposedUser(id: Int) = ExposedUser(
    id = id,
    email = email,
    passwordHash = BCrypt.hashpw(password, BCrypt.gensalt()),
    displayName = displayName
)