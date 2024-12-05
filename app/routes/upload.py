from app import middleware
from flask import request, g
from . import root_bp
import os
import random
import string

FILE_PATH = "./temp/file/"
TEMP_FILE_PATH = "./temp/file/temp/"


@root_bp.route("/upload", methods=["POST"])
@middleware.user_login
def post_upload():
    if 'image' not in request.files:
        return {"status": False, "err": {"msg": "no image uploaded"}}
    file = request.files['image']

    if file.content_type not in ['image/jpeg', 'image/jpg', 'image/png']:
        return {"status": False,
                "err": {"msg": f"Invalid image type: {file.content_type}"}}

    fileExtension = ''
    if file.content_type == 'image/png':
        fileExtension += '.png'
    else:
        fileExtension += '.jpeg'

    fullFilePath = ''
    while True:
        random_string = ''.join(random.choice(
            string.ascii_letters) for i in range(20))

        fullFilePath = f"{g.user_id}-{random_string}{fileExtension}"

        filePath = os.path.join(FILE_PATH, fullFilePath)
        if not os.path.exists(filePath):
            file.save(filePath)
            break

    return {
        "status": True,
        "data": {
            "filename": fullFilePath,
        }
    }
