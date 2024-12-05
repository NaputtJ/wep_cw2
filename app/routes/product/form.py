from wtforms.validators import DataRequired, NumberRange
from flask_wtf import FlaskForm
from wtforms import IntegerField


class BasketForm(FlaskForm):
    """buy Form"""
    id = IntegerField("id", validators=[DataRequired()])
    quantity = IntegerField("quantity", validators=[
                            DataRequired(), NumberRange(min=1)])
