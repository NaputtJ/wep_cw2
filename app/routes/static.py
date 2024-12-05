from app import app
from flask import request, send_from_directory
import os


@app.route('/')
def index():
    """get: static"""
    return send_from_directory(
        os.path.join(os.getcwd(), 'static/dist/'), 'index.html')


@app.route('/assets/<path:path>')
def get_assets(path):
    """get: js/css file"""
    return send_from_directory(
        os.path.join(os.getcwd(), 'static/dist/assets'), path)
