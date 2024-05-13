const mongoose = require("mongoose");

const schema = mongoose.Schema;

const usersSchema = new schema({
  UserID: {
    type: String,
    required: true,
  },
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  ContactNumber: {
    type: Number,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
});

const ManualUsers = mongoose.model("ManualUsers", usersSchema);

module.exports = ManualUsers;
