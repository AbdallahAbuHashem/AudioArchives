"""
This example demonstrates how to use `LSTM` model from
`speechemotionrecognition` package
"""

from keras.utils import np_utils
from tensorflow import keras
from pydub import AudioSegment
import os
import numpy as np
from .common import extract_data
from .speechemotionrecognition.dnn import LSTM
from .speechemotionrecognition.dnn import DNN
from .speechemotionrecognition.utilities import get_feature_vector_from_mfcc
import sys
import pathlib


# split an audio file into segments and apply the model segment by segment
def section_by_section_analysis(model, audio_file, to_flatten):
    class_labels= ["Neutral", "Angry", "Happy", "Sad"]
    neutralCount = 0
    angryCount = 0
    happyCount = 0
    sadCount = 0
    emotions = []

    entireAudio = AudioSegment.from_wav(audio_file)
    chunkSize = 1000 #this means a chunk is 1 second
    numChunks = len(entireAudio) / chunkSize
    temporaryFileName = 'tempFile.wav'
    previousEndTime = 0
    for endTime in range(chunkSize, len(entireAudio)+chunkSize, chunkSize):
        if (endTime > len(entireAudio)):
            lastBit = (len(entireAudio) - previousEndTime)*-1
            newAudio = entireAudio[lastBit:]
        else:
            newAudio = entireAudio[previousEndTime:endTime]
        newAudio.export(temporaryFileName, format="wav") #Exports to a wav file in the current path.
        predicted_value = model.predict_one(
            get_feature_vector_from_mfcc(temporaryFileName, flatten=to_flatten))

        # general_predict = model.predict([
        #     get_feature_vector_from_mfcc(temporaryFileName, flatten=to_flatten)])
        #
        # print(np.array(general_predict))
        if predicted_value == 0:
            neutralCount+=1
        elif predicted_value == 1:
            angryCount+=1
        elif predicted_value == 2:
            happyCount+=1
        elif predicted_value == 3:
            sadCount+=1

        emotions.append((previousEndTime/chunkSize, predicted_value, class_labels[predicted_value]))
        os.remove(temporaryFileName)
        previousEndTime = endTime
    print('neutral: ' + str(neutralCount))
    print('angry: ' + str(angryCount))
    print('happy: ' + str(happyCount))
    print('sad: ' + str(sadCount))
    print(emotions)
    return emotions



def lstm_get_emotion(audio_file):
    to_flatten = False
    x_train, x_test, y_train, y_test, num_labels = extract_data(
        flatten=to_flatten)
    y_train = np_utils.to_categorical(y_train)
    y_test_train = np_utils.to_categorical(y_test)
    #train the model
    sys.stderr.write('Starting LSTM \n')
#    model = LSTM(input_shape=x_train[0].shape,
#                 num_classes=num_labels)
#    print('x shape', x_train[0].shape)
#    print('num labels',num_labels)
#
#    model.train(x_train, y_train, x_test, y_test_train, n_epochs=50)
#    model.evaluate(x_test, y_test)
#    model.save_model()


    newmodel = LSTM(input_shape=x_train[0].shape,num_classes=num_labels)
    sys.stderr.write('Trained LSTM \n')
    path = str(pathlib.Path(__file__).parents[1].absolute()) + '/examples/LSTM_best_model.h5'
    sys.stderr.write(path + '\n')
    newmodel.load_model(to_load=path)
    newmodel.train(x_train, y_train, x_test, y_test_train, n_epochs=0)
    audio_file = str(pathlib.Path(__file__).parents[1].absolute()) + "/dataset/laughter_test_track.wav"
    sys.stderr.write('Looking for audio file ' + audio_file)


    emotions = section_by_section_analysis(model=newmodel, audio_file=audio_file, to_flatten=to_flatten)
    return emotions

if __name__ == '__main__':
    lstm_example()
