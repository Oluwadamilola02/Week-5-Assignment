const express = require("express");
const path = require("path");
const fs = require("fs");

const userJson = path.join(__dirname, "db", "users.json");

const userRouter = express.Router();

userRouter.post("/", (req, res) => {
  const user = req.body;
  fs.readFile(userJson, "utf-8", (err, data) => {
    if (err) {
      res.status(404).json({
        message: "errror occurred while createing a user",
        error: true,
      });
    }
    const parsedUsers = JSON.parse(data);
    // !checking if user is present in the database
    const isUserPresent = parsedUsers.find(
      (parseduser) => parseduser.username === user.username
    );
    if (isUserPresent) {
      res.status(400).json({
        message: "username exist before",
        error: true,
      });
    } else {
      user.id = parsedUsers.length + 1;
      const newUsers = [...parsedUsers, user];
      fs.writeFile(userJson, JSON.stringify(newUsers), (err) => {
        if (err) {
          res.status(500).json({
            message:
              "Internal Server Error. Could not save Product to database.",
            error: true,
          });
        }
        res.status(201).json({
          data: user,
          message: "user created successfully",
          error: null,
        });
      });
    }
  });
});

userRouter.get("/", (req, res) => {
  console.log(userJson);
  fs.readFile(userJson, "utf-8", (err, data) => {
    if (err) {
      res.status(404).json({
        message: "errror occurred: unauthourized",
        error: true,
      });
    }
    res.status(200).send(data);
  });
});

module.exports = {
  userRouter,
};
