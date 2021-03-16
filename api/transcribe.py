import json
import time

def transcribe_gcs(gcs_uri, speakers_num, encoding):
    """Asynchronously transcribes the audio file specified by the gcs_uri."""
    from google.cloud import speech_v1p1beta1 as speech
    import spacy
    # import paralleldots
    import operator

    output = []
    
    client = speech.SpeechClient()

    audio = speech.RecognitionAudio(uri=gcs_uri)
    config = speech.RecognitionConfig(
        encoding=encoding, #speech.RecognitionConfig.AudioEncoding.FLAC,
        sample_rate_hertz=48000,
        language_code="en-US",
        audio_channel_count=1,
        enable_automatic_punctuation=True,
        enable_speaker_diarization=True,
        diarization_speaker_count=speakers_num,
    )

    operation = client.long_running_recognize(config=config, audio=audio)

    # print("Waiting for operation to complete...")
    response = operation.result(timeout=6000)
    speaker_tagged_result_1 = response.results[len(response.results) - 1]
    print(speaker_tagged_result_1.alternatives[0].words)
    for wordObj in speaker_tagged_result_1.alternatives[0].words:
        speaker_tag = str(wordObj.speaker_tag)
        output_item = {"word": wordObj.word, "start_time": wordObj.start_time.total_seconds(), "end_time": wordObj.end_time.total_seconds(), "speaker_tag": speaker_tag}
        output.append(output_item)

    output = sorted(output, key=lambda x: x['start_time'], reverse=False)
    return output
    # print(output)
