const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const googleRoute = require("./routes").google;
dotenv.config();
const cors = require("cors");

mongoose
  .connect("mongodb://127.0.0.1:27017/GoogleDB")
  .then(() => {
    console.log("成功連接mongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.use("/api/user", authRoute);
// app.use(
//   "/api/courses",
//   passport.authenticate("jwt", { session: false }),
//   courseRoute
// );
app.use("/api/googleProject", googleRoute);
console.log(3);
app.listen(port, () => {
  console.log("後端伺服器正在聆聽port 8080...");
});
