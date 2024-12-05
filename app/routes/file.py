from app import app
from flask import send_from_directory
import os


@app.route('/files/<path:path>', strict_slashes=False)
def assets(path):
    """get: js/css file"""
    return send_from_directory(os.path.join(os.getcwd(), 'temp/file'), path)
