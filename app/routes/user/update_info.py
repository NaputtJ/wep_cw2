from app import app, middleware, db, utils, models
from flask import jsonify, g
from . import form


@app.route('/api/user/profile', methods=['POST'])
@middleware.user_login
def post_update_info():
    userForm = form.UserForm()
    if not userForm.validate_on_submit():
        return utils.logFormError(userForm)

    user = models.User.query.get(g.user_id)
    if not user:
        return {"status": False}, 500

    user.name = userForm.name.data
    user.email = userForm.email.data
    user.phone_number = userForm.phone_number.data
    user.address = userForm.address.data
    user.city = userForm.city.data
    user.zip_code = userForm.zip_code.data

    try:
        db.session.commit()
    except Exception as error:
        print("Error: ", error)
        return {"status": False, "err": {"msg": "failed to update user"}}, 500

    return jsonify({
        "status": True,
    })
