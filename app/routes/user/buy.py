from app import app, middleware, db, models, utils
from flask import g
from . import form
import json
from datetime import datetime


json_type = {
    "id": int,
    "quantity": int
}


def validate_element(data):
    for element in data:
        for key, element_type in json_type.items():
            if not isinstance(element.get(key), element_type):
                return False
    return True


@app.route('/api/user/buy/<int:order_id>', methods=["POST"])
@middleware.user_login
def post_user_buy(order_id):
    buyForm = form.BuyForm()
    if not buyForm.validate_on_submit():
        return utils.logFormError(buyForm)

    db.session.begin()

    order = models.Order.query.filter_by(user_id=g.user_id,
                                         id=order_id).first()
    if not order:
        return {"status": False, "err": {"msg": "order don't exist"}}

    order_change = False
    change_data = []
    if buyForm.data.data:
        order_change = True
        change_data = json.loads(buyForm.data.data)
        print(change_data)
        if not validate_element(change_data):
            return {"status": False, "err": {"msg": "malform change data"}}

    if order_change:
        for item in change_data:
            print(item)
            order = models.Order_item.query.filter_by(
                order_id=order_id, product_id=item['id']).first()
            if order:
                order.quantity = item['quantity']

    orders = models.Order_item.query.filter_by(
        order_id=order_id).all()
    if not orders:
        return {"status": False,
                "err": {"msg": "failed to get order items"}}, 500

    for order in orders:
        product = models.Product.query.filter_by(id=order.product_id).first()
        if not product:
            return {"status": False,
                    "err": {"msg": "failed to get product"}}, 500

        if product.stock < order.quantity:
            return {"status": False,
                    "err": {"msg": "order item quantity is more than stock"}}

        order.price = product.price
        product.stock -= order.quantity
        product.sold_amount += order.quantity

    order = models.Order.query.get(order_id)
    if not order:
        return {"status": False, "err": {"msg": "order not found"}}

    order.status = models.Order_status.PAID.value
    order.paid_at = datetime.utcnow()
    try:
        db.session.commit()
    except Exception as error:
        print("Error: ", error)
        return {"status": False, "err": {"msg": "failed to update order"}}, 500

    return {"status": True}
