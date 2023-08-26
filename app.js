//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true

}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema ( {
  email: String,
  password: String
});
// Level 2 authentication: this is deal with the encryption of our user password and use mongoose encrytion method.

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema)

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  //callback function are no more applicable to mongodb so the code below is not valid anymore
  //newUser.save(function(err){
  //if (err){
  //console.log(err);
  //}else{
  //res.render('secrets');
  //}
  //})

  //so insted we use this insted
  newUser.save().then(() => {
    res.render("secrets");
  }).catch((err) => {
    console.log(err);
  });
});


//Level one authentication (this level invole the use of Password and Username)
app.post("/login", async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username })
    .then((foundUser) => {
     if (foundUser) {
      if (foundUser.password === password) {
         res.render("secrets");
      }
   }
    }).catch((err) => {
     console.log(err);
  });
  });












app.listen(3000, function() {
  console.log("server started running at port 3000.");
});
