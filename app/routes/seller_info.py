from app import app,  db
from flask import jsonify
from sqlalchemy import text


@app.route('/api/seller/<int:seller_id>')
def get_seller_info(seller_id):
    seller = db.session.execute(
        text("""
select
    u.id,
    u.name,
    u.email,
    u.phone_number,
    u.address,
    u.city,
    u.zip_code,
    COUNT(*) as product_count
from "user" as u
left join product as p on p.user_id = u.id
where
    u.id = :seller_id
group by u.id;"""), {
            "seller_id": seller_id,
        }).first()
    if seller is None:
        return {"status": False}

    return jsonify({
        "status": True,
        "data": {
            "seller": {
                "id": seller.id,
                "name": seller.name,
                "email": seller.email,
                "phone_number": seller.phone_number,
                "address": seller.address,
                "city": seller.city,
                "zip_code": seller.zip_code,
                "product_count": seller.product_count,
            }
        }
    })
