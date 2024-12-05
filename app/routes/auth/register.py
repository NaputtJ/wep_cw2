from app import app, db, models, utils
from flask import jsonify, make_response
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    create_refresh_token,
    set_refresh_cookies
)
from sqlalchemy import text
import bcrypt
from . import form


@app.route("/api/register", methods=["POST"])
def post_register():
    """post register user"""

    authForm = form.AuthForm()
    if not authForm.validate_on_submit():
        return utils.logFormError(authForm)

    user = db.session.execute(
        text("SELECT ID FROM USER WHERE EMAIL = :email;"), {
            "email": authForm.username.data
        }).first()
    if user is not None:
        return {"status": False, "err": {"msg": "Duplicate email"}}

    hashed = bcrypt.hashpw(
        authForm.password.data.encode('utf-8'), bcrypt.gensalt())

    new_user = models.User(
        email=authForm.username.data,
        password=hashed.decode('utf-8'),
    )
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as error:
        print("Error: ", error)
        return {"status": False, "err": {"msg": "failed to add user"}}, 500

    jwt = create_access_token(identity=new_user.id)
    refresh_token = create_refresh_token(identity=new_user.id)

    res = make_response(jsonify({"status": True}))
    set_access_cookies(res, jwt)
    set_refresh_cookies(res, refresh_token)

    return res
