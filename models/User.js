const path = require("path");
const rootDir = require("../util/path");
const { getDb } = require(path.join(rootDir, "util", "database.js"));
const mongodb = require("mongodb");
const Product = require("./Product");

class User {
  constructor({ _id = null, name = "", email = "", cart = { items: [] } }) {
    this._id = _id ? new mongodb.ObjectId(_id) : null;
    this.name = name;
    this.email = email;
    this.cart = cart;
  }
  // Note: omitting try-catch deliberately, for less clutter
  static async fetchAll() {
    const db = getDb();

    const users = await db.collection("users").find().toArray();

    return users.map((u) => new User(u));
  }
  static async findById(userId) {
    const db = getDb();

    const user = await db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) });

    if (user) return new User(user);
    return user;
  }
  async create() {
    const db = getDb();

    const { insertedId = null } = await db.collection("users").insertOne(this);

    // have to make an extra call to get the created document, it's just how MongoDB works
    const newlyCreatedUser = await User.findById(insertedId);

    // return as class instance
    if (newlyCreatedUser) return new User(newlyCreatedUser);
    return null;
  }
  async update() {
    const db = getDb();

    const result = await db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: this });
    return result;
  }
  async delete() {
    const db = getDb();

    const result = await db.collection("users").deleteOne({ _id: this._id });
    return result;
  }

  // cart stuff
  async addProductToCart(prodId, quantityDelta = 1) {
    const cartItems = this.cart.items;

    const productThatExists = await Product.findById(prodId);

    if (!productThatExists) return null;

    // product exists in cart
    const matchingCartItem = cartItems.find(
      (cartItem) => cartItem.productId?.toString() === prodId
    );

    // add
    if (matchingCartItem) matchingCartItem.quantity += 1;
    else
      cartItems.push({
        productId: productThatExists._id,
        quantity: quantityDelta,
      });

    await this.update();
  }

  async decrementProductFromCart(prodId, quantityDelta = 1) {
    const cartItems = this.cart.items;

    // product exists in cart
    const matchingCartItem = cartItems.find(
      (cartItem) => cartItem.productId?.toString() === prodId
    );

    matchingCartItem.quantity -= quantityDelta;

    if (matchingCartItem.quantity <= 0) await this.deleteItemFromCart(prodId);
    else await this.update();
  }

  async deleteItemFromCart(prodId) {
    this.cart.items = this.cart.items.filter(
      (cartItem) => cartItem.productId?.toString() !== prodId
    );

    await this.update();
  }

  // order stuff
  async createOrder() {
    // aka add an Order
    const db = getDb();

    const orderToBeCreated = { userId: this._id, items: this.cart.items };
    await db.collection("orders").insertOne(orderToBeCreated);

    return null;
  }
  async getOrders() {
    return [];
  }

  // pre-population
  static SAMPLE_USERS = [
    {
      name: "SanjarOne",
      email: "SanjarOne@gmail.com",
    },
  ];
  static async prepopulateUsers() {
    const db = getDb();

    const existingUser = await db.collection("users").findOne();
    if (existingUser) {
      console.log("No sample user added, since some exist");
      return existingUser;
    } else {
      const [defaultSampleUser = null] = await Promise.all(
        User.SAMPLE_USERS.map(async (sampleUser, idx) => {
          const newUser = new User(sampleUser); // on RAM

          const newlyCreatedUser = await newUser.create(); // from db

          return newlyCreatedUser;
        })
      );
      console.log("Sample user/s added!");
      return defaultSampleUser;
    }
  }
}

module.exports = User;
