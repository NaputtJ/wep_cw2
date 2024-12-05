from app import app, db, middleware
from flask import jsonify, request, g
from sqlalchemy import text


@app.route("/api/seller/products")
@middleware.user_login
def get_cur_seller_products():
    return get_all_seller_products(g.user_id)


@app.route("/api/<int:seller_id>/products")
def get_all_seller_products(seller_id):
    name = request.args.get('name')
    category = request.args.get('category')

    p_limit = request.args.get('limit')
    limit = 20
    if p_limit is not None:
        limit = int(p_limit)

    p_offset = request.args.get('offset')
    offset = 0
    if p_offset is not None:
        offset = int(p_offset) * limit

    params = {
        "user_id": seller_id,
        "offset": offset,
        "limit": limit
    }

    name_where = ""
    if name is not None:
        name_where = " and name like '%' || :name || '%'"
        params["name"] = name

    category_where = ""
    if category is not None:
        name_where = " and product_category_id = :category"
        params["category"] = category

    product_list = db.session.execute(
        text(f"""SELECT * FROM PRODUCT
            WHERE user_id = :user_id {name_where} {category_where}
            LIMIT :limit OFFSET :offset;"""), params).all()
    if product_list is None:
        return {"status": False, "err": {"msg": "User don't exist"}}

    product_count = db.session.execute(
        text("""SELECT COUNT(*) FROM PRODUCT
            WHERE user_id = :user_id;"""), {"user_id": seller_id}).first()

    return jsonify({
        "status": True,
        "data": {
            "count": product_count[0] if product_count is not None else 0,
            "products": [
                {
                    "id": product.id,
                    "user_id": product.user_id,
                    "name": product.name,
                    "product_category_id": product.product_category_id,
                    "price": product.price,
                    "stock": product.stock,
                    "desc": product.desc,
                    "sold_amount": product.sold_amount,
                    "imgs": eval(product.imgs)
                }
                for product in product_list
            ]
        }
    })
