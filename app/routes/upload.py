from app import app, db, middleware
from flask import jsonify, request, g
from sqlalchemy import text
import os
from PIL import Image
import imagehash
import base64
import shutil

FILE_PATH = "./temp/file/"
TEMP_FILE_PATH = "./temp/file/temp/"


@app.route("/upload", methods=["POST"])
@middleware.user_login
def post_upload():
    if 'image' not in request.files:
        return {"status": False, "err": {"msg": "no image uploaded"}}
    file = request.files['image']

    if file.content_type not in ['image/jpeg', 'image/jpg', 'image/png']:
        return {"status": False,
                "err": {"msg": f"Invalid image type: {file.content_type}"}}

    tempFilePath = os.path.join(TEMP_FILE_PATH, file.filename)
    file.save(tempFilePath)

    image = Image.open(tempFilePath)
    phash = imagehash.phash(image)

    sanatiseHash = base64.b32encode(bytes.fromhex(
        str(phash))).decode('utf-8').rstrip("=")
    if file.content_type == 'image/png':
        sanatiseHash += '.png'
    else:
        sanatiseHash += '.jpeg'

    fullFilePath = f"{g.user_id}-{sanatiseHash}"

    filePath = os.path.join(FILE_PATH, fullFilePath)
    if os.path.exists(filePath):
        try:
            os.remove(tempFilePath)
        except Exception as e:
            print(f"Error trying to remove temp file: {e}")

        return {
            "status": True,
            "data": {
                "filename": fullFilePath,
            }
        }

    shutil.move(tempFilePath, filePath)

    return {
        "status": True,
        "data": {
            "filename": fullFilePath,
        }
    }
