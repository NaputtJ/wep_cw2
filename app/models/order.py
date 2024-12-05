from app import db
from enum import Enum
from datetime import datetime


class Order_status(Enum):
    CREATED = 0  # buyer created order in their basket
    PAID = 1  # buyer paid for order
    TO_PACK = 2  # selller to print and pack
    TO_DELIVER = 3  # seller to delived to delivery service
    DELIVERED = 4  # order delivered to customer
    CANCEL = 5  # order canceled


class Order(db.Model):
    """Order table model"""
    __tablename__ = "order"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    seller_id = db.Column(db.Integer, nullable=False)
    status = db.Column(db.Integer, nullable=False)
    paid_at = db.Column(db.DateTime, nullable=True)
    create_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Order id={self.id}>"

    def serialize(self):
        """serialize row into json compatible object"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "status": self.status,
            "paid_at": self.paid_at,
            "create_at": self.create_at
        }
