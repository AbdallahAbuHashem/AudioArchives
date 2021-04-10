# Audio Archives CS 206 Demo
This repo is a ReactJS + Flask demo of a tool to index and search through audio files. It was built for Stanford CS 206: Exploring Computational Journalism. Instructions here include set up, features and ways to fit the prototype to your needs

## Setting up cloud services
The app relies on a number of Google services. You need to go to Google Cloud Services, create a project, and from the left burger menu head to IAM & Admin > Service Accounts, create a service account, and create a key for the service account and download it. The path for this key is important since we will set/export it as an environment variable. You can add this to your bash profile, or you can set/export it everytime you wanna run the backend. Use `export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key"`

From your Google Cloud Console, make sure to select the project. Go to bucket storage, and create a bucket named `audio-bucket-206`. If you wanna change the name, update the code in the `api` folder. Make sure that your service key has complete permissions to the bucket.

You also need to add Firestore to the project. From the search bar in Google Cloud Console, lookup Firestore, and make sure it is enabled. Set up Firestore for testing, which makes sure that your security rules allows the app to read and write. From the Firebase Console, obtain the config information for your project, and put them in `src/firebase.js` file within this directory

### Explanation of why we use buckets and Firestore
The storage flow for this app is as follows: A user uploads an audio file with some preliminary metadata. We store the metadata in Firestore, and we upload the audio file to the bucket. Following this, we trigger indexing to happen in our backend, which is in the `api` folder of this repo. Once indexing is done, a file of `.json` is uploaded to the bucket, and a reference to the file is added to Firestore. When a user adds the final metadata to the file (speakers names, location, date), we update the Firestore with the finalized metadata. Essentially, Firestore keeps track of the metadata and points to the audio file and the indexing file `.json`.


## Local setup
First, make sure that you have whatever is needed to run a React app and a Flask app.

Second, clone and run `npm install` in this directory. Also, install all Python libraries required by the `api` code

Third, make sure that you have completed all the cloud service steps mentioned above

Fourth, run `npm start` to run the frontend. run `npm start-api` to run the backend

## Features
The frontend currently allows you to upload, search and browse through an audio archive. In the transcript page, the only drop down that works is the emotions dropdown. However, all indexing necessary for the other dropdowns already happens on the backend. In specific, each word is tagged with a sound, and an emotion. In terms of timeline, every 4 seconds are also assigned a sound, so if a sound is not a word (e.g. laughter), it is included in the `.json` indexed file.

## Issues you may face
This prototype was built for a specific demo in mind, so some config is hardcoded. When transcribing, if your audio uses more than 1 channel, we highly recommend converting it to 1 channel for the current implementation to work. If you want to work by default with more than a channel, look into `api/transcribe.py`, and play more with the config. Simply changing the number of channels to 2 will break diarization (identification of speakers). We weren't able to find a solution that takes advantage of the multiple channels and do diarization within the timeframe we had, so we stuck with using mono sound. Checkout `librosa` library for Python, which converts things to mono quite easily.

Navigation between pages is sometimes broken. If that's the case, just refresh the page, and you will get the correct page. We may push a solution to this soon.

## Contact
Feel free to email me at aabuhash@stanford.edu
