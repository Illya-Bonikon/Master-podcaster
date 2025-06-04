import com.example.configureDatabases
import com.example.models.domain.Moderators
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.mindrot.jbcrypt.BCrypt

fun main() {
    val db: Database = configureDatabases()

    val email = promptEmail()
    val displayName = prompt("Введи ім’я для відображення")
    val plainPassword = prompt("Введи пароль")

    val hashedPassword = BCrypt.hashpw(plainPassword, BCrypt.gensalt(10))

    transaction(db) {
        val existing = Moderators.selectAll().where { Moderators.email eq email }.singleOrNull()
        if (existing != null) {
            println("❌ Користувач із такою поштою вже існує.")
            return@transaction
        }

        val id = Moderators.insert {
            it[Moderators.email] = email
            it[passwordHash] = hashedPassword
            it[Moderators.displayName] = displayName
        } get Moderators.id

        println("✅ Модератор створений з ID: $id")
    }
}

fun prompt(promptText: String): String {
    print("$promptText: ")
    val input = readlnOrNull()?.trim()
    if (input.isNullOrEmpty()) {
        error("Поле не може бути порожнім.")
    }
    return input
}

fun promptEmail(): String {
    while (true) {
        val email = prompt("Введи email")
        if (isValidEmail(email)) return email
        println("❌ Email некоректний. Має містити '@' та '.'")
    }
}

fun isValidEmail(email: String): Boolean {
    return email.contains("@") &&
            email.contains(".") &&
            email.indexOf("@") > 0 &&
            email.indexOf(".") > email.indexOf("@") + 1 &&
            email.lastIndexOf(".") < email.length - 1
}