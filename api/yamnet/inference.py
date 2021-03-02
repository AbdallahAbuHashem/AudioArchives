# Copyright 2019 The TensorFlow Authors All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================

"""Inference demo for YAMNet."""
from __future__ import division, print_function

import sys

import numpy as np
import resampy
import soundfile as sf
import tensorflow as tf
from urllib.request import urlopen
import io

from . import params as yamnet_params
from . import yamnet as yamnet_model


def run_yamnet(url):
  params = yamnet_params.Params()
  yamnet = yamnet_model.yamnet_frames_model(params)
  yamnet.load_weights('yamnet/yamnet.h5')
  yamnet_classes = yamnet_model.class_names('yamnet/yamnet_class_map.csv')


  wav_data, sr = sf.read(io.BytesIO(urlopen(url).read()), dtype=np.int16)
  snippets = np.array_split(wav_data, (wav_data.shape[0] / sr) / 4)
  result = []
  for snippet in snippets:

    assert snippet.dtype == np.int16, 'Bad sample type: %r' % snippet.dtype
    waveform = snippet / 32768.0  # Convert to [-1.0, +1.0]
    waveform = waveform.astype('float32')

    # Convert to mono and the sample rate expected by YAMNet.
    if len(waveform.shape) > 1:
      waveform = np.mean(waveform, axis=1)
    if sr != params.sample_rate:
      waveform = resampy.resample(waveform, sr, params.sample_rate)

    # Predict YAMNet classes.
    scores, embeddings, spectrogram = yamnet(waveform)
    # Scores is a matrix of (time_frames, num_classes) classifier scores.
    # Average them along time to get an overall classifier output for the clip.
    prediction = np.mean(scores, axis=0)
    # Report the highest-scoring classes and their scores.
    top5_i = np.argsort(prediction)[::-1][:5]
    snippet_result = []
    for i in top5_i:
      snippet_result.append(yamnet_classes[i])
    result.append(snippet_result)
  return result