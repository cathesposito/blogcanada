const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent = "Take it all one day at a time and enjoy the journey. - Kristi Bartlett";
const aboutContent = "I'm a mechanical engineer that are moving to Canada with my husband and dog. I'm also changing careers and countries. So I'll have a lot new things to experience and I want to share them with you.";
const contactContent = "Feel free to contact me and let's share ours experiences.";


const today = new Date();
const options = {
  day: "numeric",
  month: "long"
};
const day = today.toLocaleDateString("en-US", options);

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postSchema = {
  section: String,
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res) {

  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
      day: day
    });
  })
});

app.get("/about", function(req, res) {
  res.render("about", {
    startingContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    startingContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {

  const post = new Post({
    section: req.body.postSection,
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });

});

app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({
    _id: requestedPostId
  }, function(err, post) {
    res.render("post", {
      section: post.section,
      title: post.title,
      day: day,
      content: post.content
    });
  })

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
