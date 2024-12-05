from flask import Blueprint
# from . import addProduct
# from . import update_product
# from . import order


seller_bp = Blueprint('seller', __name__)

# fmt: off
from . import addProduct, update_product, order
