from app import app, db, utils
from flask import jsonify, make_response
from flask_jwt_extended import (
    set_access_cookies,
    create_access_token,
    create_refresh_token,
    set_refresh_cookies
)
from sqlalchemy import text
from . import form, auth_bp
import bcrypt


@auth_bp.route("/login", methods=["POST"])
def post_login():
    """get: get all assessments"""

    authForm = form.AuthForm()
    if not authForm.validate_on_submit():
        return utils.logFormError(authForm)

    user = db.session.execute(
        text("SELECT ID, PASSWORD FROM USER WHERE EMAIL = :email;"), {
            "email": authForm.username.data
        }).first()
    if user is None:
        return {"status": False, "err": {"msg": "User don't exist"}}

    if not bcrypt.checkpw(authForm.password.data.encode('utf-8'),
                          user.password.encode('utf-8')):
        return {"status": False, "err": {"msg": "Incorrect password"}}

    jwt = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    res = make_response(jsonify({"status": True}))
    set_access_cookies(res, jwt)
    set_refresh_cookies(res, refresh_token)

    return res
