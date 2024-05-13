const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OnlineUsers",
    required: true
  },
  starRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  review: {
    type: String
  }
});

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
