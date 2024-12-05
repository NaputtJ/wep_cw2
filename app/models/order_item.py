from app import db


class Order_item(db.Model):
    """Order table model"""
    __tablename__ = "order_item"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, nullable=False)
    product_id = db.Column(db.Integer, nullable=False)
    # keep log of price in case product price change in the future
    price = db.Column(db.Float, nullable=True)
    quantity = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"<Order_item id={self.id}>"

    def serialize(self):
        """serialize row into json compatible object"""
        return {
            "id": self.id,
            "product_id": self.product_id,
            "price": self.price,
            "quantity": self.quantity
        }
