import com.example.services.*
import kotlinx.coroutines.runBlocking
import kotlin.test.*

class PythonAiServiceIntegrationTest {

    private val service = PythonAiService("http://localhost:5000")

    @Test
    fun testGenerateImage() = runBlocking {
        val inputText = "a cat in a spacesuit on Mars"
        val imagePath = service.generateImage(inputText)

        println("Generated image path: $imagePath")

        assertTrue(imagePath.isNotBlank(), "Image path should not be blank")
        assertTrue(imagePath.endsWith(".png"), "Image path should be a valid image file")
    }

    @Test
    fun testGenerateAudioSummary() = runBlocking {
        val prompt = "Explain quantum computing in simple terms"
        val response = service.generateAudioSummary(prompt)

        println("Generated summary: ${response.summary}")
        println("Generated audio path: ${response.audioPath}")

        assertTrue(response.summary.isNotBlank(), "Summary should not be blank")
        assertTrue(response.audioPath.isNotBlank(), "Audio path should not be blank")
        assertTrue(response.audioPath.endsWith(".wav"), "Audio path should be a valid audio file")
    }
}
