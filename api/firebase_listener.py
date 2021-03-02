import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import threading

# Use a service account
cred = credentials.Certificate('./service_account_key.json')
firebase_admin.initialize_app(cred)

db = firestore.client()
doc_ref = db.collection('users').document('alovelace')
doc_ref.set({
    'first': 'Ada',
    'last': 'Lovelace',
    'born': 1815
})

# Create an Event for notifying main thread.
callback_done = threading.Event()

# Create a callback on_snapshot function to capture changes
def on_snapshot(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        print(f'Received document snapshot: {doc.id}')
    # callback_done.set()

doc_ref = db.collection(u'users')

# Watch the document
doc_watch = doc_ref.on_snapshot(on_snapshot)
callback_done.wait()