from app import app, db, middleware, utils, models
from flask import g
from . import form
import json


@app.route("/api/seller/product/new", methods=["POST"])
@middleware.user_login
def post_seller_new_product():

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

    newProduct = models.Product(
        user_id=g.user_id,
        name=productForm.name.data,
        product_category_id=productForm.product_category_id.data,
        price=round(productForm.price.data, 2),
        stock=productForm.stock.data,
        desc=productForm.desc.data,
        imgs=productForm.imgs.data,
    )

    try:
        db.session.add(newProduct)
        db.session.commit()
    except Exception as error:
        print("Error: ", error)
        return {"status": False, "err": {"msg": "failed to add Product"}}, 500

    return {"status": True}
