from app import app
from flask import jsonify
from flask_jwt_extended import (
    set_access_cookies,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from . import token_bp


@token_bp.route('/token/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)

    resp = jsonify({'status': True})
    set_access_cookies(resp, access_token)
    return resp
