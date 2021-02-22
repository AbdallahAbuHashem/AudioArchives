import time
import upload
import transcribe
from flask import Flask
from flask import request
from google.cloud import speech_v1p1beta1 as speech

app = Flask(__name__)

@app.route('/upload', methods = ['POST'])
def upload_file():
    # here we want to get the value of file_path and name (i.e. ?file_path=some-value&name=name)
    if request.method == 'POST':
        # print(request.data)
        file = request.data
        name = request.args.get('name')
        type = request.args.get('type')
        speakers_num = request.args.get('speakers')
        ext = request.args.get('ext')
        uri = upload.upload_blob('audio-bucket-206', file, name, type)
        encoding = speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED
        if ext == 'flac':
            encoding = speech.RecognitionConfig.AudioEncoding.FLAC
        elif ext == 'mp3':
            encoding = speech.RecognitionConfig.AudioEncoding.MP3
        transcribe.transcribe_gcs(uri, speakers_num, encoding)
        return {'uri': uri}