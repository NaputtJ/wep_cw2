from . import product
# from . import upload
from . import file
from . import new_product
from . import seller_product
from . import single_product
from . import user
from . import seller_info
from . import search
# from . import static
import os
from flask import Blueprint, send_from_directory

root_bp = Blueprint('root', __name__)
api_bp = Blueprint('api', __name__)

# fmt: off
from . import seller, auth, upload 

api_bp.register_blueprint(seller.seller_bp, url_prefix="/seller")
api_bp.register_blueprint(auth.auth_bp, url_prefix="/")

root_bp.register_blueprint(auth.token_bp)
