from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from . import utils
import os

app = Flask(__name__)
cors_origin = os.getenv('CORS_ORIGIN_URL', 'http://localhost:3000/')
print(cors_origin)
CORS(app, supports_credentials=True, resources={
     r"/*": {
         "origins": cors_origin,
         "allow_headers": "*"
         # "allow_headers": ["Content-Type", "Authorization",
         #                   "Cache-Control", "X-Requested-With", "Pragma",
         #                   "Expires"]
     }})
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

app.register_blueprint(routes.root_bp)
app.register_blueprint(routes.api_bp, url_prefix="/api")


@app.route('/assets/<path:path>')
def get_assets(path):
    """get: js/css file"""
    return send_from_directory(
        os.path.join(os.getcwd(), 'static/dist/assets'), path)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """get: static"""
    return send_from_directory(
        os.path.join(os.getcwd(), 'static/dist/'), 'index.html')
