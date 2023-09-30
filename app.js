//jshint esversion:6
require('dotenv').config()
//console.log(process.env)

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

//console.log(process.env.SECRET);


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//For connecting on Localhost

mongoose.connect('mongodb://127.0.0.1:27017/userDB', {useNewUrlParser: true})
  .then(() => {  
    console.log('Connected to MongoDB');
  })
  .catch(err => {  
    console.error('Error connecting to MongoDB:', err);
  });


/* For connecting with Colud (change Adress first)
mongoose.connect("mongodb+srv://admin-abdulhaadi:haadi0303@atlascluster.uflmigm.mongodb.net/BlogDB", {useNewUrlParser: true})
  .then(() => {  console.log('Connected to MongoDB');  })
  .catch(err => {  console.error('Error connecting to MongoDB:', err); });
*/



const userSchema = new mongoose.Schema ({
    email:String,
    password:String
});

userSchema.plugin(encrypt,{ secret: process.env.SECRET , encryptedFields: ['password'] });

const User = new mongoose.model("User",userSchema);

app.get("/", function(req, res){
    res.render("home");
  });

  app.get("/login", function(req, res){
    res.render("login");
  });

  app.get("/register", function(req, res){
    res.render("register");
  });



  app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save();
    console.log("New user got registered ")
    res.render("home");
  });

  app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
  
    // Find the user with the provided email
    User.findOne({ email: username })
      .then(foundUser => {
        if (!foundUser) {
          console.log("User does not exist");
          res.render("register"); // Render the registration page
        } else {
          // User with the provided email is found
          // Now, you should compare the password
          if (foundUser.password === password) {
            console.log("Email and password matched");
            res.render("secrets"); // Render the secrets page
          } else {
            console.log("Password does not match");
            res.render("login"); // Render the login page with an error message
          }
        }
      })
      .catch(err => {
        console.error("Error:", err);
        res.render("error"); // Handle any errors appropriately
      });
  });
  
  




app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  
