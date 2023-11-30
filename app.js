// jshint esversion:6
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";
import 'dotenv/config'

const app = express();
console.log(process.env.API_KEY);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
  email: String,
  password: String
})


userSchema.plugin(encrypt, {secret: process.env.SECRET , encryptedFields:['password']  });


const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  // newUser.save(function(err) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.render("secrets");
  //   }
  // });
  newUser
    .save()
    .then(() => {
      res.render("secrets");
    })
    .catch((err) => {
      console.error(err);
    });
});
// app.post("/login", function (req, res) {
//   const username = req.body.username;
//   const password = req.body.password;
//   User.findOne({ email: username }, function (err, foundUser) {
//     if (err) {
//       console.log(err);
//     } else {
//       if (foundUser) {
//         if (foundUser.password === password) {
//           res.render("secrets");
//         }
//       }
//     }
//   });
// });
app.post("/login", function(req, res) {
  User.findOne({ email: req.body.username })
    .then((foundUser) => {
      if (foundUser) {
        if (foundUser.password === req.body.password) {
          res.render("secrets");
        } else {
          res.send("Incorrect password.");
        }
      }app.post("/login", function(req, res) {
        User.findOne({ email: req.body.username })
          .then((foundUser) => {
            if (foundUser) {
              if (foundUser.password === req.body.password) {
                res.render("secrets");
              } else {
                res.send("Incorrect password.");
              }
            } else {
              res.send("User not found.");
            }
          })
          .catch((err) => {
            console.error(err);
          });
      });
      
    })
    .catch((err) => {
      console.error(err);
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
