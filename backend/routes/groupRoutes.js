const { v4: uuidv4 } = require("uuid");
const checkUserID = require("../middleware/checkUserID.js");
const util = require("util");

const {
  getGroupLocation,
  setGroupLocation,
} = require("../state/groupLocation.js");
const express = require("express");
const router = express.Router();

router.get("/join-group/:groupId", checkUserID, (req, res) => {
  const { groupId } = req.params; // Retrieve groupId from URL parameters
  const userId = req.signedCookies.userId;
  const groupLocation = getGroupLocation();

  if (!userId) {
    return res.status(400).send("User ID not found. Please set a user ID.");
  }

  if (!groupId) {
    return res.status(400).send("Group ID is required to join a group.");
  }

  // If the group doesn't exist, return an error
  if (!groupLocation[groupId]) {
    return res
      .status(404)
      .send("Group not found. Please create the group first.");
  }

  // Set the groupId as a cookie to associate the user with the group
  res.cookie("groupId", groupId, {
    signed: true,
    maxAge: 900000,
    httpOnly: true,
  });

  // Add the user to the group
  groupLocation[groupId].members[userId] = {
    location: null, // Default location
    lastUpdated: new Date().toISOString(),
  };

  setGroupLocation(groupLocation); // Update the modified groupLocation

  console.log(util.inspect(getGroupLocation(), { depth: Infinity }));
  res.send(userId + " successfully joined group " + groupId);
});

router.get("/create-group", checkUserID, (req, res) => {
  let groupId = req.signedCookies.groupId;
  let userId = req.signedCookies.userId;
  const groupLocation = getGroupLocation();
  console.log(`got get with groupId ${groupId}`);

  // If the user doesn't have a groupId cookie, generate a new one
  if (!groupId) {
    do {
      groupId = uuidv4();
    } while (groupLocation[groupId]);

    // Set groupId as a cookie
    res.cookie("groupId", groupId, {
      signed: true,
      maxAge: 900000,
      httpOnly: true,
    });

    // Initialize the group with an array of members (starting with the user)
    groupLocation[groupId] = {
      members: {
        [userId]: {
          location: null, // Default location
          lastUpdated: new Date().toISOString(),
        },
      },
    };
    setGroupLocation(groupLocation); // Update the modified groupLocation
    console.log(util.inspect(groupLocation, { depth: Infinity }));
    res.send(userId + " identified with new ID: " + groupId);
  } else {
    console.log("else" + util.inspect(getGroupLocation(), { depth: Infinity }));
    res.send(userId + " is in group " + groupId);
  }
});

module.exports = router;
