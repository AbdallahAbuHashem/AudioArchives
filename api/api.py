import time
from . import upload
from . import transcribe
from .yamnet import inference
from flask import Flask
from flask import request
from google.cloud import speech_v1p1beta1 as speech
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from .emotion.examples import lstm_example
import threading
import sys
import json


# Use a service account
cred = credentials.Certificate('./caroline_key.json')
firebase_admin.initialize_app(cred)

db = firestore.client()


def align_sound_speech(sounds, speech_output):
    for word_obj in speech_output:
        idx = word_obj['start_time'] / 4
        if (int(idx) < len(sounds)):
            word_obj['sound'] = sounds[int(idx)][0]


def align_emotion_speech(emotions, speech_output):
    for word_obj in speech_output:
        idx = int(round(word_obj['start_time'],0))
        emotion_chunk = emotions[idx]
        word_obj['emotion'] = emotion_chunk[2]


app = Flask(__name__)

@app.route('/upload', methods = ['POST'])
def upload_file():
    # here we want to get the value of file_path and name (i.e. ?file_path=some-value&name=name)
    if request.method == 'POST':
        file = request.data
        name = request.args.get('name')
        type = request.args.get('type')
        speakers_num = int(request.args.get('speakers'))
        ext = request.args.get('ext')
        key = request.args.get('key')
        uri = upload.upload_blob('audio-bucket-206', file, "{}.{}".format(name, ext), type)
        doc_ref = db.collection('audioarchives').document(key)
        doc_ref.update({
            'audioLink': uri,
        })
        sounds = inference.run_yamnet(uri)
        encoding = speech.RecognitionConfig.AudioEncoding.LINEAR16
        if ext == 'flac':
            encoding = speech.RecognitionConfig.AudioEncoding.FLAC
        elif ext == 'mp3':
            encoding = speech.RecognitionConfig.AudioEncoding.MP3
        output = transcribe.transcribe_gcs('gs://audio-bucket-206/{}.{}'.format(name, ext), speakers_num, encoding)
        align_sound_speech(sounds, output)

        # emotions = lstm_example.lstm_get_emotion(request.args.get('file_path'))
        # align_emotion_speech(emotions, output)

        output_uri = upload.upload_output('audio-bucket-206', {'output': output, 'sounds': sounds}, "{}.json".format(name))
        doc_ref.update({
            'jsonLink': output_uri,
            'status': 'Processed',
        })
        return {'file_output': output, 'output_uri': output_uri}

@app.route('/update_json', methods = ['POST'])
def update_json():
    if request.method == 'POST':
        # print(request.json)
        file = json.loads(request.data)
        name = request.args.get('name')
        uri = upload.upload_output('audio-bucket-206', file, "{}_updated.json".format(name))
        return uri