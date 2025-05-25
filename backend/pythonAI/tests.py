import os
import unittest
from unittest.mock import MagicMock, patch

from AudioService import BASE_MEDIA_PATH as AUDIO_BASE_MEDIA_PATH
from AudioService import OUTPUT_DIR as AUDIO_OUTPUT_DIR
from AudioService import synthesize_audio
from ImageService import BASE_MEDIA_PATH as IMAGE_BASE_MEDIA_PATH
from ImageService import OUTPUT_DIR as IMAGE_OUTPUT_DIR
from ImageService import generate_image
from TextService import generate_image_caption, generate_text, summarize_text


class TestSynthesizeAudio(unittest.TestCase):
    @patch('AudioService.tts')
    @patch('AudioService.uuid.uuid4')
    def test_synthesize_audio(self, mock_uuid4, mock_tts):
        mock_uuid4.return_value.hex = 'abc123'
        mock_tts.tts_to_file = MagicMock()

        text = "Тестовий текст"

        result = synthesize_audio(text)

        expected_file_name = "abc123.wav"
        expected_file_path = os.path.join(AUDIO_OUTPUT_DIR, expected_file_name)
        expected_url_path = f"/media/{os.path.relpath(expected_file_path, AUDIO_BASE_MEDIA_PATH).replace(os.sep, '/')}"

        self.assertEqual(result, expected_url_path)
        mock_tts.tts_to_file.assert_called_once_with(text=text, file_path=expected_file_path)


class TestGenerateImage(unittest.TestCase):
    @patch('ImageService.pipe')
    @patch('ImageService.uuid.uuid4')
    def test_generate_image(self, mock_uuid4, mock_pipe):
        mock_uuid4.return_value.hex = 'img123'
        mock_image = MagicMock()
        mock_pipe.return_value.images = [mock_image]

        text_prompt = "Test prompt"

        result = generate_image(text_prompt)

        expected_file_name = "img123.png"
        expected_file_path = os.path.join(IMAGE_OUTPUT_DIR, expected_file_name)
        expected_url_path = f"/media/{os.path.relpath(expected_file_path, IMAGE_BASE_MEDIA_PATH).replace(os.sep, '/')}"

        mock_image.save.assert_called_once_with(expected_file_path)
        self.assertEqual(result, expected_url_path)


class TestGenerateText(unittest.TestCase):
    @patch('TextService.client')
    def test_generate_text(self, mock_client):
        mock_response = MagicMock()
        mock_response.choices = [MagicMock(message=MagicMock(content="Result text"))]
        mock_client.chat.completions.create.return_value = mock_response

        prompt = "Тест"

        result = generate_text(prompt)

        self.assertEqual(result, "Result text")
        mock_client.chat.completions.create.assert_called_once()


class TestGenerateImageCaption(unittest.TestCase):
    @patch('TextService.generate_text')
    def test_generate_image_caption(self, mock_generate_text):
        mock_generate_text.return_value = "Short image description"

        text = "Example text for caption"
        result = generate_image_caption(text, max_length=70)

        expected_prompt = (
            f"Write a very short description in English (up to 70 characters) to generate an image based on the text:\n\n"
            f"{text}\n\n"
            "The description should be concise and vivid."
        )

        mock_generate_text.assert_called_once_with(prompt=expected_prompt, max_tokens=50)
        self.assertEqual(result, "Short image description")


class TestSummarizeText(unittest.TestCase):
    @patch('TextService.generate_text')
    def test_summarize_text(self, mock_generate_text):
        mock_generate_text.return_value = "Короткий опис тексту"

        text = "Довгий текст для резюме"
        result = summarize_text(text)

        expected_prompt = (
            "Напиши максимально короткий (до 50 слів) опис українською, про що йдеться в наступному тексті:\n\n"
            f"{text}"
        )

        mock_generate_text.assert_called_once_with(prompt=expected_prompt, max_tokens=500)
        self.assertEqual(result, "Короткий опис тексту")