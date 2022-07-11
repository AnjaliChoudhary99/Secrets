//jshint esversion:6
require('dotenv').config();

const express= require('express');
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const md5 = require("md5");
// const encrypt = require("mongoose-encryption");
const saltRounds = 10;

const port = 3000;
const app = express();

console.log(process.env.SECRET);
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});

const userSchema= new mongoose.Schema({
  email: String,
  password: String
});

// userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:['password']});


const User = new mongoose.model("User", userSchema);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended:true
}));

app.get("/", function(req,res){
  res.render("home");
});;
app.get("/login", function(req,res){
  res.render("login");
});
app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req, res){

  bcrypt.hash(req.body.password, saltRounds,function(err, hash){

    const newUser = new User({
      email : req.body.username,
      // password: md5(req.body.password)
      password:hash
    });
  newUser.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.render("secrets");
      }
    });
  });
//   const newUser = new User({
//     email : req.body.username,
//     password: md5(req.body.password)
//   });
// newUser.save(function(err){
//     if(err){
//       console.log(err);
//     }else{
//       res.render("secrets");
//     }
//   });
});

app.post("/login", function(req,res){
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({email: username}, function(err, foundUser){
    if(err){console.log(err);}
    else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  })
})

app.listen(port, function(){
  console.log("server started on port"+port);
})
