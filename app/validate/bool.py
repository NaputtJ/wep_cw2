from wtforms.validators import ValidationError


def validate_bool(_form, field):
    """custom integer valadation"""
    if field in (0, 1):
        raise ValidationError("status must be 0 or 1")
