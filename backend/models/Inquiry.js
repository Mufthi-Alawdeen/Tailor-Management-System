const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const inquirySchema = new Schema({
    UserID: {
        type: String,
    },
    First_Name: {
        type: String,
        required: true
    },
    Last_Name: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Contact_number: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },

    Order_ID: {
        type: String,
        required: false
    },

    Rent_ID: {
        type: String,
        required: false
    },


    Reply: {
       type: String
    },

    createdAt: { type: Date, default: Date.now },

    updatedAt: { type: Date, default: Date.now }

});

const Inquiry = model("Inquiry", inquirySchema);

module.exports = Inquiry;