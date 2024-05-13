const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const Inventory = require('./Inventory'); // Import the Inventory model

const inventoryRequestSchema = new Schema({
    status: {
        type: String,
        default: 'Insufficient' // Default status
    },
    requested_by: {
        type: String,
        required: true
    },
    material_type: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    required_quantity: {
        type: Number,
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

// Define pre-save middleware to calculate and update the status based on available stock
inventoryRequestSchema.pre('save', async function (next) {
    const inventoryRequest = this;

    try {
        // Query the Inventory collection to find the available stock for the requested material type and color
        const inventoryItem = await Inventory.findOne({ raw_material_type: inventoryRequest.material_type, color: inventoryRequest.color });

        // If no inventory item found or available stock is less than required quantity, set status to 'Insufficient'
        if (!inventoryItem || inventoryItem.available_stock < inventoryRequest.required_quantity) {
            inventoryRequest.status = 'Insufficient';
        } else {
            // If available stock is sufficient, set status to 'sufficient'
            inventoryRequest.status = 'sufficient';
        }

        next();
    } catch (error) {
        // Handle any errors
        console.error('Error calculating inventory request status:', error);
        next(error);
    }
});

const InventoryRequest = model("InventoryRequest", inventoryRequestSchema);

module.exports = InventoryRequest;
