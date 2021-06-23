const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "afabfhabfhaf";
const aboutContent = "ahaisufhsaihf";
const contactContent = "dhaiudhqu";
let posts = [];

  const today = new Date();
  const options = {day: "numeric", month: "long"};
  const day = today.toLocaleDateString("en-US", options);

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("home", {startingContent: homeStartingContent, posts: posts, day: day});
});

app.get("/about", function(req, res){
  res.render("about", {startingContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {startingContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {section: req.body.postSection, title: req.body.postTitle, content: req.body.postBody};
  posts.push(post);
  res.redirect("/");
});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle){
      res.render("post", {section: post.section, title: post.title, day: day, content: post.content});
    }
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
