const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// Create a new transaction
router.post("/addTransaction", (req, res) => {
  const {
    TransactionID,
    Amount,
    PaymentType,
    CardNo,
    CardCVVno,
    CardExpDate,
    TransDate,
  } = req.body;

  const newTransaction = new Transaction({
    TransactionID,
    Amount,
    PaymentType,
    CardNo,
    CardCVVno,
    CardExpDate,
    TransDate,
  });

  newTransaction
    .save()
    .then(() => res.status(200).json({ status: "New Transaction Added" }))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Get all transactions
router.get("/getAllTransactions", (req, res) => {
  Transaction.find()
    .then((transactions) => res.status(200).json(transactions))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Update a transaction by ID
router.put("/updateTransaction/:id", (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  Transaction.findByIdAndUpdate(id, updateData, { new: true })
    .then((updatedTransaction) => res.status(200).json(updatedTransaction))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Delete a transaction by ID
router.delete("/deleteTransaction/:id", (req, res) => {
  const { id } = req.params;

  Transaction.findByIdAndDelete(id)
    .then(() =>
      res.status(200).json({ status: "Transaction deleted successfully" })
    )
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Get a transaction by ID
router.get("/getTransactionById/:id", (req, res) => {
  const { id } = req.params;

  Transaction.findById(id)
    .then((transaction) => res.status(200).json(transaction))
    .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = router;
