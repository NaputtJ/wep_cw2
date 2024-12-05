from app import app, middleware, db, models, utils
from flask import jsonify, g
from sqlalchemy import text
from . import form


@app.route('/api/user/basket', methods=["POST"])
@middleware.user_login
def post_user_basket():
    basketForm = form.BasketForm()
    if not basketForm.validate_on_submit():
        return utils.logFormError(basketForm)

    product = models.Product.query.filter_by(id=basketForm.id.data).first()
    if not product:
        return {"status": False,
                "err": {"msg": "failed to get product"}}, 500

    if product.stock < basketForm.quantity.data:
        return {"status": False,
                "err": {"msg": "order item quantity is more than stock"}}

    oi_id = db.session.execute(
        text("""
select oi.id, o.id as order_id from order_item as oi
left join "order" as o on oi.order_id = o.id
where
    o.user_id = :user_id and
    oi.product_id = :product_id and
    o.status = 0
limit 1
"""), {
            "user_id": g.user_id,
            "product_id": basketForm.id.data
        }).first()
    if oi_id:
        print("found old")
        item = models.Order_item.query.get(oi_id.id)
        if not item:
            return {"status": False}, 500

        if product.stock < item.quantity + basketForm.quantity.data:
            return {"status": False,
                    "err": {"msg": "order item quantity is more than stock"}}

        item.quantity += basketForm.quantity.data
        try:
            db.session.commit()
            return {"status": True, "data": {"order_id": oi_id.order_id}}
        except Exception as error:
            print("Error: ", error)
            return {"status": False,
                    "err": {"msg": "failed to update order"}}, 500

    check_order = models.Order.query.filter_by(
        user_id=g.user_id,
        seller_id=product.user_id,
        status=0
    ).first()

    if not check_order:
        check_order = models.Order(
            user_id=g.user_id,
            seller_id=product.user_id,
            status=models.Order_status.CREATED.value
        )

        try:
            db.session.add(check_order)
            db.session.commit()
        except Exception as error:
            print("Error: ", error)
            return {"status": False,
                    "err": {"msg": "failed to add order"}}, 500
    else:
        check_order_item = models.Order_item.query.filter_by(
            order_id=check_order.id, product_id=product.id).first()
        if check_order_item:
            check_order_item.quantity += basketForm.quantity

            try:
                db.session.commit()
                return {"status": True}
            except Exception as error:
                print("Error: ", error)
                return {"status": False,
                        "err": {"msg": "failed to add order"}}, 500

    order_item = models.Order_item(
        order_id=check_order.id,
        product_id=basketForm.id.data,
        quantity=basketForm.quantity.data
    )

    try:
        db.session.add(order_item)
        db.session.commit()
    except Exception as error:
        print("Error: ", error)
        return {"status": False, "err": {"msg": "failed to add order"}}, 500

    return jsonify({
        "status": True,
        "data": {
            "id": check_order.id
        }
    })
