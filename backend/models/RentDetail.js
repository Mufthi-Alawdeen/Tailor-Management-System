const mongoose = require("mongoose");

const { Schema } = mongoose;

const rentSchema = new Schema({
  RentID: {
    type: String,
    required: true,
  },
  UserID: {
    type: String,
    required: true,
  },
  ProductID: {
    type: String,
    required: true,
  },
  ProductName: {
    type: String,
    required: true,
  },
  PickupDate: {
    type: Date,
    required: true,
  },
  ReturnDate: {
    type: Date,
    required: true,
  },
  Status: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  Amount: {
    type: Number,
    required: true,
  },
  TransactionID: {
    type: String,
    required: true,
  },
});

const Rent = mongoose.model("Rent1", rentSchema);

module.exports = Rent;
