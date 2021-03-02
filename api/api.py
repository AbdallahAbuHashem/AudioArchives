import time
from . import upload
from . import transcribe
from .yamnet import inference
from flask import Flask
from flask import request
from google.cloud import speech_v1p1beta1 as speech

def align_sound_speech(sounds, speech_output):
    for word_obj in speech_output:
        idx = word_obj['start_time'] / 4 
        word_obj['sound'] = sounds[int(idx)][0]


app = Flask(__name__)

@app.route('/upload', methods = ['POST'])
def upload_file():
    # here we want to get the value of file_path and name (i.e. ?file_path=some-value&name=name)
    if request.method == 'POST':
        # print(request.data)
        file = request.data
        name = request.args.get('name')
        type = request.args.get('type')
        speakers_num = int(request.args.get('speakers'))
        ext = request.args.get('ext')
        uri = upload.upload_blob('audio-bucket-206', file, name, type)
        sounds = inference.run_yamnet(uri)
        encoding = speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED
        if ext == 'flac':
            encoding = speech.RecognitionConfig.AudioEncoding.FLAC
        elif ext == 'mp3':
            encoding = speech.RecognitionConfig.AudioEncoding.MP3
        output = transcribe.transcribe_gcs('gs://audio-bucket-206/{}'.format(name), speakers_num, encoding)
        align_sound_speech(sounds, output)
        output_uri = upload.upload_output('audio-bucket-206', {'output': output, 'sounds': sounds}, name)
        return {'file_output': output, 'output_uri': output_uri}