const mongoose = require("mongoose");

const { Schema } = mongoose;

const transactionSchema = new Schema({
  TransactionID: {
    type: String,
    required: true,
  },
  Amount: {
    type: Number,
    required: true,
  },
  PaymentType: {
    type: String,
    required: true,
  },
  CardNo: {
    type: String,
    required: false,
  },
  CardExpDate: {
    type: Date,
    required: false,
  },
  TransDate: {
    type: Date,
    required: true,
  },
});

const Transaction = mongoose.model("Transaction1", transactionSchema);

module.exports = Transaction;
