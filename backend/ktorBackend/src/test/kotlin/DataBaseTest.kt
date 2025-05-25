import com.example.configureDatabases
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.Test
import kotlin.test.assertEquals

class DatabaseConfigTest {

    @Test
    fun `test database connection with SELECT 1`() {
        val db: Database = configureDatabases()

        transaction(db) {
            val result = exec("SELECT 1") { rs ->
                if (rs.next()) rs.getInt(1) else null
            }

            assertEquals(1, result)
        }
    }
}