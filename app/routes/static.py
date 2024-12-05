from flask import send_from_directory
import os
from . import root_bp


@root_bp.route('/assets/<path:path>')
def get_assets(path):
    """get: js/css file"""
    return send_from_directory(
        os.path.join(os.getcwd(), 'static/dist/assets'), path)


@root_bp.route('/<path:path>')
def index(path):
    """get: static"""
    return send_from_directory(
        os.path.join(os.getcwd(), 'static/dist/'), 'index.html')
