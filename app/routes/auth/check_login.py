from app import middleware, db
from flask import jsonify, g
from sqlalchemy import text
from . import auth_bp


@auth_bp.route('/user')
@middleware.user_login
def get_check_login():
    user = db.session.execute(
        text("""SELECT * FROM user where id = :user_id;"""), {
            "user_id": g.user_id,
        }).one()
    if user is None:
        return {"status": True, "data": {"login": False}}

    return jsonify({
        "status": True,
        "data": {
            "login": True,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
            }
        }
    })
