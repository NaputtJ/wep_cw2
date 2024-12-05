

def logFormError(form):
    if form.errors:
        fields = []
        for field, errors in form.errors.items():
            fields.append({
                "field": field,
                "error": errors[0]
            })
            for error in errors:
                print(f"""Error in {getattr(form, field).label.text}:
                {error}""", 'danger')

        return {"status": False, "err": {
            "msg": "validation errro",
            "fields": fields
        }}
