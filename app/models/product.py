from app import db
from datetime import datetime


class Product(db.Model):
    """Product table model"""
    __tablename__ = "product"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    product_category_id = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False, default=0)
    desc = db.Column(db.Text, nullable=False)
    sold_amount = db.Column(db.Integer, nullable=False, default=0)

    # json_array of string: path to img
    imgs = db.Column(db.Text, default="[]")
    create_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Product id={self.id}>"

    def serialize(self):
        """serialize row into json compatible object"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "price": self.price,
            "stock": self.stock,
            "desc": self.desc,
            "imgs": self.imgs,
            "sold_amount": self.sold_amount,
            "create_at": self.create_at
        }
