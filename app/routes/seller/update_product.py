from app import app, db, middleware, utils, models
from flask import g
from . import form
import json


@app.route("/api/seller/product/<int:product_id>", methods=["POST"])
@middleware.user_login
def post_seller_update_product(product_id):

    productForm = form.ProductForm()
    if not productForm.validate_on_submit():
        return utils.logFormError(productForm)

    try:
        imgs = json.loads(productForm.imgs.data)
        if type(imgs) is not list:
            raise ValueError("imgs malform json array")
        if len(imgs) < 1 or len(imgs) > 9:
            raise ValueError("imgs invalid length need to be between 1 and 9")

        for img in imgs:
            if type(img) is not str:
                raise ValueError("imgs invalid array element")

    except ValueError as err:
        return {"status": False, "err": {"fields": [{
            "error": [
                str(err)
            ],
            "field": "imgs"
        }]}}
    except Exception as e:
        print(e)
        return {"status": False, "err": {"fields": [{
            "error": [
                "faild to parse json array"
            ],
            "field": "imgs"
        }]}}

    product = models.Product.query.get(product_id)
    if not product or product.user_id != g.user_id:
        return {"status": False, "err": {"msg": "Product not found"}}

    product.name = productForm.name.data
    product.product_category_id = productForm.name.data
    product.price = round(productForm.price.data, 2)
    product.stock = productForm.stock.data
    product.desc = productForm.desc.data
    product.imgs = productForm.imgs.data

    try:
        db.session.commit()
    except Exception as error:
        print("Error: ", error)
        return {"status": False,
                "err": {"msg": "failed to update Product"}}, 500

    return {"status": True}
