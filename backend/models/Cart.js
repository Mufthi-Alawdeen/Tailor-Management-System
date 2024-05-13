const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
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
    type: {
        type: String,
    },
    fabric: {
        type: String,
    },
    color: {
        type: String,
    },
    size: {
        type: String,
    },
    measurements: {
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
        shirtLength: Number
      },
    quantity: {
        type: Number,
        default: 1
    },
    materialId: {
        type: String
    }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
