from gtts import gTTS
import uuid
import os

def generate_audio(text):
    filename = f"tts_{uuid.uuid4()}.mp3"
    path = os.path.join("data", filename)
    tts = gTTS(text=text, lang="mg")
    tts.save(path)
    return filename
