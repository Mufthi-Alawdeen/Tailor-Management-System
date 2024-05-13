const router = require("express").Router();
const InventoryRequest = require("../models/InventoryRequest");

// Route to add a new inventory request
router.post("/add", async (req, res) => {
    const { requested_by, material_type, color, required_quantity } = req.body;
    try {
        // Create a new inventory request instance
        const newInventoryRequest = new InventoryRequest({ requested_by, material_type, color, required_quantity });

        // Save the new inventory request
        await newInventoryRequest.save();

        res.json({ message: "Inventory Request Added" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to retrieve all inventory requests
router.get("/retrieve", async (req, res) => {
    try {
        const inventoryRequests = await InventoryRequest.find();
        res.json(inventoryRequests);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Route to retrieve a single inventory request by ID
router.get("/retrieve/:id", async (req, res) => {
    const inventoryRequestId = req.params.id;
    try {
        const inventoryRequest = await InventoryRequest.findById(inventoryRequestId);
        if (!inventoryRequest) {
            return res.status(404).json({ error: "Inventory Request not found" });
        }
        res.json(inventoryRequest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to update an inventory request by ID
router.put("/update/:id", async (req, res) => {
    const inventoryRequestId = req.params.id;
    const { requested_by, material_type, color, required_quantity } = req.body;
    try {
        const updatedInventoryRequest = await InventoryRequest.findByIdAndUpdate(
            inventoryRequestId,
            { requested_by, material_type, color, required_quantity },
            { new: true }
        );
        if (!updatedInventoryRequest) {
            return res.status(404).json({ error: "Inventory Request not found" });
        }
        res.json({ message: "Inventory Request updated", inventoryRequest: updatedInventoryRequest });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to delete an inventory request by ID
router.delete("/delete/:id", async (req, res) => {
    const inventoryRequestId = req.params.id;
    try {
        await InventoryRequest.findByIdAndDelete(inventoryRequestId);
        res.json({ message: "Inventory Request deleted" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to get an inventory request by ID
router.get("/get/:id", async (req, res) => {
    const inventoryRequestId = req.params.id;
    try {
        const inventoryRequest = await InventoryRequest.findById(inventoryRequestId);
        if (!inventoryRequest) {
            return res.status(404).json({ error: "Inventory Request not found" });
        }
        res.json(inventoryRequest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;
