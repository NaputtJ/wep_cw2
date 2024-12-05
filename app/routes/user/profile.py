from app import app, middleware, db
from flask import jsonify, g
from sqlalchemy import text


@app.route('/api/user/profile')
@middleware.user_login
def get_profile():
    user = db.session.execute(
        text("""SELECT * FROM user where id = :user_id;"""), {
            "user_id": g.user_id,
        }).one()
    if user is None:
        return {"status": False}

    return jsonify({
        "status": True,
        "data": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "phone_number": user.phone_number,
            "address": user.address,
            "city": user.city,
            "zip_code": user.zip_code,
        }
    })
