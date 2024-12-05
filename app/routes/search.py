from app import app, db
from flask import jsonify, request
from sqlalchemy import text


@app.route("/api/search")
def get_search_products():
    p_limit = request.args.get('limit')
    limit = 20
    if p_limit is not None:
        limit = int(p_limit)

    p_offset = request.args.get('offset')
    offset = 0
    if p_offset is not None:
        offset = int(p_offset) * limit

    params = {
        "offset": offset,
        "limit": limit
    }

    nameWhere = ''
    name = request.args.get('name')
    if name is not None:
        nameWhere = "where name like '%' || :name || '%'"
        params["name"] = name

    product_list = db.session.execute(
        text(f"""SELECT * FROM PRODUCT {nameWhere}
            ORDER BY create_at, id DESC
            LIMIT :limit OFFSET :offset ;"""), params).all()
    if product_list is None:
        return {"status": False, "err": {"msg": "User don't exist"}}

    return jsonify({
        "status": True,
        "data": {
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
