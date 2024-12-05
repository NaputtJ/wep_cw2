from app import app, db
from flask import jsonify
from sqlalchemy import text


@app.route("/api/product/<int:product_id>")
def get_seller_single_product(product_id):
    product = db.session.execute(
        text("""SELECT product.*, user.name as seller_name,
            user.email as seller_email FROM PRODUCT
            left join user on user.id = product.user_id
            WHERE product.id = :product_id"""), {
            "product_id": product_id,
        }).one()
    if product is None:
        return {"status": False, "err": {"msg": "Product don't exist"}}

    return jsonify({
        "status": True,
        "data": {
            "id": product.id,
            "user_id": product.user_id,
            "seller_name": product.seller_name,
            "seller_email": product.seller_email,
            "name": product.name,
            "product_category_id": product.product_category_id,
            "price": product.price,
            "stock": product.stock,
            "desc": product.desc,
            "sold_amount": product.sold_amount,
            "imgs": eval(product.imgs)
        }
    })
