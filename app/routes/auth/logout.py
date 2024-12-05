from app import app
from flask import jsonify
from flask_jwt_extended import (
    unset_jwt_cookies
)
from . import auth_bp


@auth_bp.route('/logout', methods=['POST'])
def logout():
    resp = jsonify({'status': True})
    unset_jwt_cookies(resp)
    return resp, 200
