const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema({
  OrderID: {
    type: String,
    required: true,
  },
  UserID: {
    type: String,
    required: true,
  },
  Quantity: {
    type: Number,
    required: false,
  },
  MaterialID: {
    type: String,
    required: false,
  },
  ProductID: {
    type: String,
    required: false,
  },
  Measurement: {
    chest: Number,
    waist: Number,
    hips: Number,
    shoulders: Number,
    sleeveLength: Number,
    jacketLength: Number,
    inseam: Number,
    outseam: Number,
    rise: Number,
    neck: Number,
    shirtLength: Number,
  },
  Status: {
    type: String,
    required: true,
  },
  Fabric: {
    type: String,
    required: false,
  },
  Design: {
    type: String,
    required: false,
  },
  Type: {
    type: String,
    required: true,
  },
  OrderDate: {
    type: Date,
    required: true,
  },
  PickupDate: {
    type: Date,
    required: true,
  },
  TransactionID: {
    type: String,
    required: true,
  },
  Amount: {
    type: Number,
    required: true,
  },
  Description: {
    type: String,
    required: false,
  },
});

const Order = mongoose.model("Order1", orderSchema);

module.exports = Order;