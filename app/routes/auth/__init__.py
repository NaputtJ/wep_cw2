from flask import Blueprint


auth_bp = Blueprint('auth', __name__)
token_bp = Blueprint('token', __name__)

# fmt: off
from . import login, register, refresh, logout, check_login

