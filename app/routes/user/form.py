from wtforms.validators import Optional, DataRequired
from flask_wtf import FlaskForm
from wtforms import StringField


class BuyForm(FlaskForm):
    """buy Form"""
    data = StringField("data", validators=[Optional()])


class UserForm(FlaskForm):
    """User Form"""
    name = StringField("name", validators=[DataRequired()])
    email = StringField("email", validators=[DataRequired()])
    phone_number = StringField("phone_number", validators=[DataRequired()])
    address = StringField("address", validators=[DataRequired()])
    city = StringField("city", validators=[DataRequired()])
    zip_code = StringField("zip_code", validators=[DataRequired()])
