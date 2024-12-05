from app import app, db
from sqlalchemy import text


@app.route("/api/product_category")
def get_product_category():
    """get: get all product category"""

    categories = db.session.execute(
        text("SELECT * FROM PRODUCT_CATEGORY ")).all()
    if categories is None:
        return {"status": False, "err": {"msg": "database errro"}}, 500

    return {
        "status": True,
        "data": [
            {"id": category.id,
             "name": category.name} for category in categories],
    }
