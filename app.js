//jshint esversion:6

//---- Modules ----//
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
//

//---- Connecting MongoDB ----//
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/blogDB');
//

//---- Creating Schema & Model -----//
const composeSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Compose = mongoose.model('Compose', composeSchema);
//

//---- Get Route ----//
app.get("/", function (req, res) {
  // res.render("home", {
  //   startingContent: homeStartingContent,
  //   posts: posts
  // });
  Compose.find({}, function (err, composeDocs) {
      if (!err) {
        res.render("home", {
          startingContent: homeStartingContent,
          posts: composeDocs
        });
      };
  });

});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:postId", function (req, res) {

  const requestedID = req.params.postId;

  Compose.findById(requestedID, function (err, composeDoc) {
    if(!err){
      res.render("post", {
        title: composeDoc.title,
        content: composeDoc.content
      });
    };
  });

  // posts.forEach(function (post) {
  //   const storedTitle = _.lowerCase(post.title);

  //   if (storedTitle === requestedTitle) {
  //     res.render("post", {
  //       title: post.title,
  //       content: post.content
  //     });
  //   }
  // });

});
//

//---- Post Route ----//
app.post("/compose", function (req, res) {
  
  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postBody
  // };

  // posts.push(post);

  const compose = new Compose ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  compose.save(function(err){
    if(!err){
      res.redirect("/");
    };
  });

});
//

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
