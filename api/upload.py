from google.cloud import storage
import base64

def upload_blob(bucket_name, file, destination_blob_name, type):
    """Uploads a file to the bucket."""
    # bucket_name = "your-bucket-name"
    # source_file_name = "local/path/to/file"
    # destination_blob_name = "storage-object-name"

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    
    result_bites = base64.b64decode(str(file).split(',')[1])
    blob.upload_from_string(result_bites, content_type=type)
    blob.make_public()

    print(
        "File uploaded to {}.".format(
            destination_blob_name
        )
    )
    return (blob.public_url)