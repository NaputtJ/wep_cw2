from wtforms.validators import DataRequired, NumberRange
from flask_wtf import FlaskForm
from wtforms import (StringField, IntegerField,
                     FloatField, FieldList)


def log_field(_form, field):
    """custom integer valadation"""
    print(field)
    print(field.data)
    if field.data and (not isinstance(field.data, str) or field.data.strip()):
        return

    if not field.data:
        print("not filed, data")

    if field.data.strip():
        print(
            "strp"
        )
    if not isinstance(field.data, str):
        print("not isinstance")

    print("error")


class ProductForm(FlaskForm):
    """Produc Form"""
    name = StringField("name", validators=[DataRequired()])
    product_category_id = IntegerField(
        "product_category_id", validators=[DataRequired()])
    price = FloatField("price", validators=[
        NumberRange(min=0.01)])
    stock = IntegerField("stock", validators=[
        NumberRange(min=0)])
    desc = StringField("desc", validators=[DataRequired()])
    imgs = StringField("desc", validators=[DataRequired()])
