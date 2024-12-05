const Database = require('better-sqlite3');
const db = new Database('../temp/database.sqlite');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker')

const NUM_SELLER = 20;
const MAX_PRODUCT_COUNT = 20
const NUM_PRODUCT_IMG = 9
const MAX_PRODUCT_STOCK = 1000
const MAX_PRODUCT_SOLD_AMOUNT = 1000

async function encodePassword(password) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(password);

  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    dataBuffer,
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(
    2,
    '0',
  )).join('');
}


// id = db.Column(db.Integer, primary_key=True)
// user_id = db.Column(db.Integer, nullable=False)
// name = db.Column(db.String(255), nullable=False)
// product_category_id = db.Column(db.Integer, nullable=False)
// price = db.Column(db.Float, nullable=False)
// stock = db.Column(db.Integer, nullable=False, default=0)
// desc = db.Column(db.Text, nullable=False)
// sold_amount = db.Column(db.Integer, nullable=False, default=0)
//
// # json_array of string: path to img
// imgs = db.Column(db.Text, default="[]")

const ecommerceCategories = [
  "Fashion",
  "Food",
  "Technology",
  "Business",
  "Furniture",
  "Sports",
  "Beauty",
  "Jewelry",
  "Toys",
  "Automotive"
];

async function insert(hashpass) {
  for (let i = 0; i < NUM_SELLER; i++) {
    const numProducts = Math.floor(Math.random() * MAX_PRODUCT_COUNT);

    const insertSeller = db.prepare("INSERT INTO USER (name, email, password, phone_number, address, city, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?)")
    const seller = insertSeller.run(faker.person.fullName(), faker.internet.email(), hashpass, faker.phone.number({ style: 'international' }), faker.location.streetAddress({ useFullAddress: true }), faker.location.city(), faker.location.zipCode())
    const id = seller.lastInsertRowid

    for (let j = 0; j < numProducts; j++) {
      const categoryName = faker.commerce.department()

      const categorySelect = db.prepare("select id from product_category where name = ? limit 1;")
      const category = categorySelect.get(categoryName)

      let categoryID

      if (!category) {
        const categoryInsert = db.prepare("insert into product_category (name) values (?);")
        const temp = categoryInsert.run(categoryName)
        categoryID = temp.lastInsertRowid
      } else {
        categoryID = category.id
      }

      const productImg = new Array(NUM_PRODUCT_IMG)
      const imgCatI = Math.floor(Math.random() * (ecommerceCategories.length - 1))
      for (let k = 0; k < NUM_PRODUCT_IMG; k++) {
        productImg[k] = faker.image.url({ width: 500, height: 500 })
      }

      const insertProduct = db.prepare("INSERT INTO product (user_id, name, product_category_id, price, stock, desc, sold_amount, imgs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      insertProduct.run(
        id,
        faker.commerce.productName(),
        categoryID,
        faker.commerce.price(),
        Math.floor(Math.random() * MAX_PRODUCT_STOCK),
        faker.commerce.productDescription(),
        Math.floor(Math.random() * MAX_PRODUCT_SOLD_AMOUNT),
        JSON.stringify(productImg)
      )
    }
  }
}

async function main() {
  const password = await encodePassword("password")
  bcrypt.hash(password, 12, (err, hashpass) => {
    if (err != null) {
      console.log(err)
      return
    }

    insert(hashpass)
  });
}

main()
