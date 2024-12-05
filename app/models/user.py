from app import db


class User(db.Model):
    """User table model"""
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20), nullable=True, unique=True)
    address = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(50), nullable=True)
    zip_code = db.Column(db.String(32), nullable=True)

    def __repr__(self):
        return f"<User id={self.id}>"

    def serialize(self):
        """serialize row into json compatible object"""
        return {
            "id": self.id,
            "email": self.email,
            "password": self.password,
        }
