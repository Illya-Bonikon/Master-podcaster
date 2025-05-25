import org.mindrot.jbcrypt.BCrypt

fun main() {
    val password = "123"
    val hashed = BCrypt.hashpw(password, BCrypt.gensalt(10))
    println("Hashed password for '$password':")
    println(hashed)
}
