const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Define a map to store the current counts for each raw material type
const rawMaterialCount = {
    Material: 0,
    Button: 0,
    Threads: 0,
    Other: 0
};

const inventorySchema = new Schema({
    productId: {
        type: String,
        required: true,
        unique: true
    },
    raw_material_type: {
        type: String,
        enum: ['Material', 'Button', 'Threads', 'Other'],
        required: true
    },
    color: {
        type: String,
        required: true
    },
    received_stock: {
        type: Number,
        required: true
    },
    available_stock: {
        type: Number,
    },
    used_stock: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        required: true
    },
    unit_price: {
        type: Number,
        required: true
    },
    retailer_name: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    createdAt: { type: Date, default: Date.now }
});

// Define pre-save middleware to generate product ID based on raw material type
inventorySchema.pre('save', async function (next) {
    const inventory = this;

    try {
        // Retrieve the latest inventory item with the same raw_material_type
        const latestItem = await Inventory.findOne({ raw_material_type: inventory.raw_material_type }).sort({ createdAt: -1 });

        // If no previous item found or its productId doesn't follow the pattern, set count to 1
        let count = 1;
        if (latestItem && latestItem.productId) {
            const match = latestItem.productId.match(/MSR-P-[A-Z](\d+)$/);
            if (match) {
                count = parseInt(match[1]) + 1;
            }
        }

        // Generate product ID based on the type and count
        let productId;
        if (inventory.raw_material_type !== 'Other') {
            productId = `MSR-P-${inventory.raw_material_type.charAt(0)}${count}`;
        } else {
            productId = `MSR-P-O${count}`;
        }

        // Assign the generated product ID to the inventory item
        inventory.productId = productId;

        console.log('Generated Product ID:', productId); // Check if the product ID is generated correctly

        // Update available stock based on received and used stock
        inventory.available_stock = inventory.received_stock - inventory.used_stock;

        next();
    } catch (error) {
        console.error('Error generating product ID:', error);
        next(error);
    }
});

const Inventory = model("Inventory", inventorySchema);

module.exports = Inventory;
