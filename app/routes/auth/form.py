from wtforms.validators import DataRequired
from flask_wtf import FlaskForm
from wtforms import StringField


class AuthForm(FlaskForm):
    """Auth Form"""
    username = StringField("username", validators=[DataRequired()])
    password = StringField("password", validators=[DataRequired()])
