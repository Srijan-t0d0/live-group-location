const express = require("express");
const cookieParser = require("cookie-parser");

const checkUserID = require("../middleware/checkUserID.js");
const router = express.Router();

router.use(cookieParser("secretkey"));

router.get("/", checkUserID, (req, res) => {
  res.send("hey user" + req.signedCookies.userId);
});

module.exports = router;
