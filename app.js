const path = require("path");

const {
  mongooseConnect,
  getDb,
  prepopulateIrrelevantSampleData,
  deleteAllCollections,
  // mongoConnect,
} = require("./util/database.js");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const { User, prepopulateUsers } = require("./models/User");
const { Product, prepopulateProducts } = require("./models/Product");

// app.set('view engine', 'pug');
// app.set('views', 'views'); // not needed for this case, actually
app.set("view engine", "ejs");
app.set("views", "views"); // not needed for this case, actually

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// mock authentication, i.e. get user who's making the request
app.use(async (req, res, next) => {
  // req.user = await User.findById(1);
  const [firstUser = null] = await User.find(); // as of now, this is the sample user
  req.user = firstUser;
  console.log("Mock authentication success", {
    email: firstUser?.email,
    id: firstUser?._id,
  });
  next();
});

app.get("/try", async (req, res, next) => {
  await new Promise((r) => setTimeout(r, 1000));
  return res.json({ time: new Date().toLocaleTimeString() });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.post("/delete-all-data", async (req, res, next) => {
  await deleteAllCollections();
  res.redirect("/");
});

app.use(errorController.get404);

// express code

// // start express from inside the mongoConnect callback
// mongoConnect(async (client) => {
//   await prepopulateIrrelevantSampleData();
//   const firstSampleUser = await User.prepopulateUsers();
//   await Product.prepopulateProducts(firstSampleUser);
//   console.log("Pre-scripts finished execution");
//   console.log("------------------------------");

//   app.listen(3000);
// });

let ranOnceAlready = false;
mongooseConnect(async (mongooseObject) => {
  await prepopulateIrrelevantSampleData();
  const firstSampleUser = await prepopulateUsers();
  await prepopulateProducts(firstSampleUser);

  let dropEverything = false;
  // dropEverything = true; // uncomment and comment to wipe database
  if (dropEverything) deleteAllCollections();

  let runOnce = false;
  // runOnce = true; // for running custom startup code - uncomment and comment to run
  if (runOnce && !ranOnceAlready) {
    // run custom startup code here

    ranOnceAlready = true;
    console.log("runOnce ran!");
  }

  console.log("Pre-scripts finished execution");
  console.log("------------------------------");
  app.listen(3000);
});
