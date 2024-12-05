from functools import wraps
from flask import g
from flask_jwt_extended import jwt_required, get_jwt_identity


def user_login(func):
    """middleware to check if use is login"""
    @wraps(func)
    @jwt_required(locations=['cookies'])
    def decorated_function(*args, **kwargs):
        g.user_id = int(get_jwt_identity())
        return func(*args, **kwargs)

    return decorated_function
