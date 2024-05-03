const { v4: uuidv4 } = require("uuid");

const checkUserID = (req, res, next) => {
  let userId = req.signedCookies.userId;
  console.log(`got get with userid ${userId}`);

  // If the user doesn't have a userId cookie, generate a new one
  if (!userId) {
    userId = uuidv4(); // Generate a unique identifier
    res.cookie("userId", userId, {
      signed: true,
      maxAge: 900000,
      httpOnly: true,
    }); // Set userId as a cookie
    res.send("User identified with new ID: " + userId);
  } else {
    next();
  }
};
module.exports = checkUserID;
