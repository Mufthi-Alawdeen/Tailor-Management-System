const mongoose = require("mongoose");

// Define the schema for the Product model
const productSchema = new mongoose.Schema({
  images: {
    type: [String], // Array of image URLs with base sixty four
    required: true
  },
  name: {
    type: String,  // name of the product
    required: true
  },
  price: {
    type: Number,  // price
    required: true
  },
  description: {
    type: String, //description
    required: true
  },
  category: {
    type: String,
    enum: ["suit", "shirt", "trousers", "tie","bow"], // Allowed values for categories
    required: true
  },
  type: {
    type: String,
    enum: ["rent", "buy"], // Allowed values for types
    required: true
  },
  size: {
    type: [String], // Define size as a single number fields
  
    required: true
  },
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rating" // Reference to the Rating model 
  }]
});

// Create the Product model using the schema // will be the table name
const Product = mongoose.model("Product", productSchema);

// Export the Product model
module.exports = Product;