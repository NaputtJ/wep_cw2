import subprocess
import sys
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from . import utils
import os

app = Flask(__name__)
CORS(app, supports_credentials=True, origins="http://localhost:3000")
app.config.from_object("config")
app.config["JWT_SECRET_KEY"] = "super-secret"
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = True
app.config['JWT_ACCESS_COOKIE_NAME'] = 'user_jwt'
# app.config['JWT_COOKIE_DOMAIN'] = "localhost:3000"
app.config['JWT_COOKIE_SAMESITE'] = "None"
app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
app.config['JWT_REFRESH_COOKIE_PATH'] = '/token/refresh'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False

jwt = JWTManager(app)

db_file = "./temp/database.sqlite"

if not os.path.isfile(db_file):
    os.makedirs(os.path.dirname(db_file), exist_ok=True)
    with open(db_file, "w") as f:
        pass
# try:
#     result = subprocess.run(["./db_setup.sh"], check=True)
# except subprocess.CalledProcessError as e:
#     print(f"failed to setup db: {e}")
#     sys.exit(1)

db = SQLAlchemy(app)

# fmt: off
# from app import view
from app import routes
