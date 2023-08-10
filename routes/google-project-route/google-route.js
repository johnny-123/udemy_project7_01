const router = require("express").Router();
const authRoutes = require("./google-routes/auth-route");
const profileRoutes = require("./google-routes/profile-route");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
require("./config/passport");
const session = require("express-session");
const flash = require("connect-flash");

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
router.use(passport.initialize());
router.use(passport.session());

router.use(flash());
router.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);

router.get("/", async (req, res) => {
  try {
    console.log(2);
    return res.render("index", { user: req.user });
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
