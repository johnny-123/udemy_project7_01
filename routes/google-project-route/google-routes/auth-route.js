const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
  return res.render("login", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return res.send(err);
    } else {
      return res.redirect("/api/googleProject/");
    }
  });
});

router.get("/signup", (req, res) => {
  return res.render("signup", { user: req.user });
});

router.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;
  if (password.length < 8) {
    req.flash("error_msg", "密碼長度過短，至少需要8個數字或英文字。");
    return res.redirect("/api/googleProject/auth/signup");
  }

  const foundEmail = await User.findOne({ email }).exec();
  if (foundEmail) {
    req.flash(
      "error_msg",
      "信箱已經被註冊過，請用其他信箱註冊，或用嘗試用此信箱登入"
    );
    return res.redirect("/api/googleProject/auth/signup");
  }

  let hashPassword = await bcrypt.hash(password, 12);
  let newUser = new User({ name, email, password: hashPassword });
  await newUser.save();
  req.flash("success_msg", "註冊成功，現在已經可以登入系統了");
  return res.redirect("/api/googleProject/auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/api/googleProject/auth/login",
    failureFlash: "登入失敗，帳號或密碼不正確", //自動套到flash.locaks.error
  }),
  (req, res) => {
    return res.redirect("/api/googleProject/profile");
  }
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// router.get("");

// router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
//   console.log("進入redirect區域");
//   return res.redirect("/api/googleProject/profile");
// });

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  console.log("進入redirect區域");
  return res.redirect("/api/googleProject/profile");
});

module.exports = router;
