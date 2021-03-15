to run the code in examples/lstm_example.py, cd into the examples folder and run:
python3 lstm_example.py

Folder contents:
dataset: audio files
examples: actual code, implementation of models
speechemotionrecognition: definition of models


The model is saved in examples/LSTM_best_model.h5 (I already trained it)
The model is loaded into examples/lstm_example.py
Put a .wav file in the folder
On line 63, enter the path to the .wav file
The code will split the .wav file into chunks and predict the emotion of each chunk (currently a chunk = 2000 ms)

The model is a LSTM model. (From Wikipedia:) Long short-term memory (LSTM) is an artificial recurrent neural network (RNN) architecture[1] used in the field of deep learning. Unlike standard feedforward neural networks, LSTM has feedback connections. It can not only process single data points (such as images), but also entire sequences of data (such as speech or video). For example, LSTM is applicable to tasks such as unsegmented, connected handwriting recognition,[2] speech recognition[3][4] and anomaly detection in network traffic or IDSs (intrusion detection systems).