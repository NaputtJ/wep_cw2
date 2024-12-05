from app import db


class Product_category(db.Model):
    """Product_category table model"""
    __tablename__ = "product_category"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"<Product_category id={self.id}>"

    def serialize(self):
        """serialize row into json compatible object"""
        return {
            "id": self.id,
            "name": self.name,
        }
