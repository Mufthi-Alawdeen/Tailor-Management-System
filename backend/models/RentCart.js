const mongoose = require("mongoose");

const rentCartSchema = new mongoose.Schema({
  user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'OnlineUsers', 
        required: true 
    },
  product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
  pickupDate: { 
        type: Date, 
        required: true 
    },
  returnDate: { 
        type: Date, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model("RentCart", rentCartSchema);
