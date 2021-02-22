import json
import time

def transcribe_gcs(gcs_uri, speakers_num, encoding):
    """Asynchronously transcribes the audio file specified by the gcs_uri."""
    from google.cloud import speech_v1p1beta1 as speech
    import spacy
    import paralleldots
    import operator

    output = []
    paralleldots_api = "ojoSV02rEhEwhHJxhbG0zUl221gzcSojzo6o5dtmx2w"
    paralleldots.set_api_key(paralleldots_api)

    nlp = spacy.load("en_core_web_sm")

    client = speech.SpeechClient()

    audio = speech.RecognitionAudio(uri=gcs_uri)
    config = speech.RecognitionConfig(
        encoding=encoding, #speech.RecognitionConfig.AudioEncoding.FLAC,
        sample_rate_hertz=44100,
        language_code="en-US",
        audio_channel_count=2,
        enable_automatic_punctuation=True,
        enable_speaker_diarization=True,
        diarization_speaker_count=speakers_num,
    )

    operation = client.long_running_recognize(config=config, audio=audio)

    # print("Waiting for operation to complete...")
    response = operation.result(timeout=6000)
    # print("this was the response")
    # print(response)
    # Each result is for a consecutive portion of the audio. Iterate through
    # them to get the transcripts for the entire audio file.

    # print(len(response.results))
    overall_word_count = 0
    counter = 1
    speaker_tagged_result = response.results[len(response.results) - 1]
    for result in response.results:
        # The first alternative is the most likely one for this portion.
        # print(u"Transcript: {}".format(result.alternatives[0].transcript))
        # print("Confidence: {}".format(result.alternatives[0].confidence))
        doc = nlp(result.alternatives[0].transcript)
        word_count = 0
        for sent in doc.sents:
            sentence_text = sent.text.split()
            emotions = paralleldots.emotion(sentence_text)['emotion']
            top_emotion = max(emotions.items(), key=operator.itemgetter(1))[0]
            for word in sentence_text:
                word_stt = result.alternatives[0].words[word_count]
                speaker_tag = speaker_tagged_result.alternatives[0].words[overall_word_count].speaker_tag
                # print(word_stt)
                output_item = {"word": word, "start_time": word_stt.start_time.total_seconds(), "end_time": word_stt.end_time.total_seconds(), "speaker_tag": speaker_tag, "emotion": top_emotion}
                output.append(output_item)
                word_count += 1
                overall_word_count +=1
            counter += 1
            if counter % 20 == 0:
                time.sleep(60)
    return output
    with open('output.json', 'w') as outfile:
        json.dump(output, outfile)
    # print(output)
