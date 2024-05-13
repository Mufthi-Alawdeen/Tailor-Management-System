const router = require("express").Router();
const User = require("../models/UserDetail"); // Assuming your schema file is named "User.js"

// Create a new user
router.route("/addUser").post((req, res) => {
  const { UserID, FirstName, LastName, Email, Address, ContactNumber, Type } =
    req.body;

  const newUser = new User({
    UserID,
    FirstName,
    LastName,
    Email,
    Address,
    ContactNumber,
    Type,
  });

  newUser
    .save()
    .then(() => res.status(200).json({ status: "New User Added" }))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Get all users
router.route("/getAllUsers").get((req, res) => {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Update a user by ID
router.route("/updateUser/:id").put((req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  User.findByIdAndUpdate(id, updateData, { new: true })
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Delete a user by ID
router.route("/deleteUser/:id").delete((req, res) => {
  const { id } = req.params;

  User.findByIdAndDelete(id)
    .then(() => res.status(200).json({ status: "User deleted successfully" }))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Get a user by ID
router.route("/getUserById/:id").get((req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Get a user by UserID
router.route("/getUserByUserID/:userID").get((req, res) => {
  const { userID } = req.params;

  User.findOne({ UserID: userID })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = router;
