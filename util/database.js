const env = require("dotenv").config().parsed;
/**
 * ENV keys: MONGODB_PASSWORD
 */
const database_password = env["MONGODB_PASSWORD"];

const mongoose = require("mongoose");

let _db;

const mongooseConnect = (cb) =>
  mongoose
    .connect(
      `mongodb+srv://sanjarcode-nodejscompleteguide:${database_password}@cluster-nodejscompleteg.nuohpop.mongodb.net/?retryWrites=true&w=majority`
    )
    .then((mongooseObject) => {
      const mongoDbClient = mongooseObject.connection.getClient();
      _db = mongoDbClient.db();
    })
    .then(cb)
    .catch(console.log);

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

const prepopulateIrrelevantSampleData = async () => {
  const db = getDb();
  const result = await db.collection("trial-collection").findOne();

  const exists = !!result;

  if (!exists) {
    const createdResult = await db
      .collection("trial-collection")
      .insertOne({ name: "Woods", friendName: "Mason" });
    console.log("Database was empty, added sample irrelevant data");
    console.log(createdResult);
  } else {
    console.log("Database has data, no changes made");
    // console.log(result);
  }
};

const deleteAllCollections = async () => {
  const db = getDb();
  // delete the users and products collections

  // await db.collection("products").drop();
  // await db.collection("users").drop();
  // await db.collection("trial-collection").drop();
  // await db.collection("carts").drop();
  // await db.collection("orders").drop();

  // dynamic collection names
  const collectionObjects = await db.listCollections().toArray();
  const collectionNames = collectionObjects.map((obj) => obj.name);
  Promise.all(
    collectionNames.map(async (collectionName) => {
      console.log("Dropping collection", collectionName);
      await db.collection(collectionName).drop();
    })
  );

  console.log("Database cleared!");
};

module.exports = {
  mongooseConnect,
  getDb,
  prepopulateIrrelevantSampleData,
  deleteAllCollections,
};

// Note: Code below is not being used, left for comparison
// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;

// let _db;

// const mongoConnect = (callback = () => {}) => {
//   MongoClient.connect(
//     `mongodb+srv://sanjarcode-nodejscompleteguide:${database_password}@cluster-nodejscompleteg.nuohpop.mongodb.net/?retryWrites=true&w=majority`
//   ) // Copied from the site (SRV address)
//     .then((client) => {
//       console.log("Connected to MongoDB cloud!");
//       _db = client.db();
//       callback(client);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// const getDb = () => {
//   if (_db) {
//     return _db;
//   }
//   throw "No database found!";
// };

// /**
//  * irrelevant to the shop, just for check
//  * Is idempotent, makes change only if database is empty
//  */
// //
// const prepopulateIrrelevantSampleData = async () => {
//   const db = getDb();
//   const result = await db.collection("trial-collection").findOne();

//   const exists = !!result;

//   if (!exists) {
//     const createdResult = await db
//       .collection("trial-collection")
//       .insertOne({ name: "Woods", friendName: "Mason" });
//     console.log("Database was empty, added sample irrelevant data");
//     console.log(createdResult);
//   } else {
//     console.log("Database has data, no changes made");
//     // console.log(result);
//   }
// };

// module.exports = {
//   getDb,
//   prepopulateIrrelevantSampleData,
//   mongooseConnect,
// };
