const express = require("express");
const router = express.Router();
const Post = require("../models/post-model");

const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/api/googleProject/auth/login");
  }
};

router.get("/", authCheck, async (req, res) => {
  console.log("進入/profile");
  let postfound = await Post.find({ author: req.user._id }).exec();
  return res.render("profile", { user: req.user, posts: postfound }); //deserializeUser()
});

router.get("/post", (req, res) => {
  return res.render("post", { user: req.user });
});

router.post("/post", async (req, res) => {
  let { title, content } = req.body;
  let newPost = new Post({ title, content, author: req.user._id });
  try {
    await newPost.save();
    return res.redirect("/api/googleProject/profile");
  } catch (e) {
    req.flash("error_msg", "標題與內容都需要填寫");
    return res.redirect("/api/googleProject/profile/post");
  }
});

module.exports = router;
