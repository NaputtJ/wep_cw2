from app import app, middleware, db
from flask import jsonify, g
from sqlalchemy import text


@app.route('/api/user/orders')
@middleware.user_login
def get_user_orders():
    basket = db.session.execute(
        text("""
select
    o.id,
    o.status,
    p.user_id as seller_id,
    u.name as seller_name,
    u.email as seller_email,
    json_group_array(
        json_object(
            'id', item.id,
            'quantity', item.quantity,
            'product', json_object(
                'id', p.id,
                'name', p.name,
                'price', p.price,
                'stock', p.stock,
                'imgs',p.imgs
            )
        )
    ) as items
from "order" as o
left join order_item as item on item.order_id = o.id
left join product as p on p.id = item.product_id
left join user as u on u.id = p.user_id
where
    o.user_id = :user_id and
    o.status != 0
group by o.id, o.seller_id;"""), {
            "user_id": g.user_id,
        }).all()
    if basket is None:
        return {"status": False}

    orderList = []
    for order in basket:
        items = eval(order.items)
        for item in items:
            item["product"]["imgs"] = eval(item["product"]["imgs"])

        orderList.append({
            "id": order.id,
            "status": order.status,
            "seller_id": order.seller_id,
            "seller_name": order.seller_name,
            "seller_email": order.seller_email,
            "items": items,
        })

    return jsonify({
        "status": True,
        "data": {
            "order": orderList
        }
    })
