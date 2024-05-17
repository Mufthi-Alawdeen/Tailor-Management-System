const router = require("express").Router();
const Inventory = require("../models/Inventory");

const rawMaterialCount = {
    Material: 0,
    Button: 0,
    Threads: 0,
    Other: 0
};

// Route to add a new inventory item
router.post("/upload", async (req, res) => {
    const { raw_material_type, color, received_stock, used_stock, date, unit_price, retailer_name, name, description } = req.body;

    try {
        // Generate productId
        let productId;
        if (raw_material_type !== 'Other') {
            productId = `MSR-P-${raw_material_type.charAt(0)}${rawMaterialCount[raw_material_type]}`;
        } else {
            productId = `MSR-P-O${rawMaterialCount.Other}`;
        }

        // Increment rawMaterialCount
        if (raw_material_type !== 'Other') {
            rawMaterialCount[raw_material_type]++;
        } else {
            rawMaterialCount.Other++;
        }

        // Calculate available stock
        const available_stock = received_stock - used_stock;

        // Create new inventory item with productId
        const newInventoryItem = new Inventory({ 
            productId,
            raw_material_type, 
            color, 
            received_stock, 
            used_stock, 
            available_stock, 
            date, 
            unit_price, 
            retailer_name, 
            name, 
            description 
        });

        await newInventoryItem.save();
        res.json({ message: "Inventory Item Added", productId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



// Route to retrieve all inventory items
router.get("/retrieve", (req, res) => {
    Inventory.find()
        .select("-__v") // Exclude the __v field from the returned data
        .then(inventoryItems => res.json(inventoryItems))
        .catch(err => res.status(400).json({ error: err.message }));
});

// Route to retrieve a specific inventory item by ID
router.get("/retrieve/:id", (req, res) => {
    const inventoryItemId = req.params.id;

    Inventory.findById(inventoryItemId)
        .select("-__v") // Exclude the __v field from the returned data
        .then(inventoryItem => {
            if (!inventoryItem) {
                return res.status(404).json({ error: "Inventory Item not found" });
            }
            res.json(inventoryItem);
        })
        .catch(err => res.status(400).json({ error: err.message }));
});



// Route to update an inventory item by ID
router.put("/update/:id", (req, res) => {
    const inventoryItemId = req.params.id;
    const { raw_material_type, color, received_stock, used_stock, available_stock, date, unit_price, retailer_name, name, description } = req.body;
    const updatedInventoryItem = { raw_material_type, color, received_stock, used_stock, available_stock, date, unit_price, retailer_name, name, description };

    Inventory.findByIdAndUpdate(inventoryItemId, updatedInventoryItem, { new: true }) // Set { new: true } to return the updated document
        .then(inventoryItem => {
            if (!inventoryItem) {
                return res.status(404).json({ error: "Inventory Item not found" });
            }
            res.json({ message: "Inventory Item updated", inventoryItem }); // Return the updated inventory item in the response
        })
        .catch(err => res.status(400).json({ error: err.message }));
});


// Route to delete an inventory item by ID
router.delete("/delete/:id", (req, res) => {
    const inventoryItemId = req.params.id;

    Inventory.findByIdAndDelete(inventoryItemId)
        .then(() => res.json({ message: "Inventory Item deleted" }))
        .catch(err => res.status(400).json({ error: err.message }));
});

// Route to get an inventory item by ID
router.get("/get/:id", (req, res) => {
    const inventoryItemId = req.params.id;

    Inventory.findById(inventoryItemId)
        .then(inventoryItem => res.json(inventoryItem))
        .catch(err => res.status(400).json({ error: err.message }));
});

// Update an inventory item by ProductID
router.put("/updateInventoryItemByProductId/:productId", (req, res) => {
    const { productId } = req.params;
    const {
      raw_material_type,
      color,
      received_stock,
      used_stock,
      date,
      unit_price,
      retailer_name,
      name,
      description,
    } = req.body;
    const updatedInventoryItem = {
      raw_material_type,
      color,
      received_stock,
      used_stock,
      date,
      unit_price,
      retailer_name,
      name,
      description,
    };
  
    Inventory.findOneAndUpdate({ productId }, updatedInventoryItem, { new: true }) // Set { new: true } to return the updated document
      .then((inventoryItem) => {
        if (!inventoryItem) {
          return res.status(404).json({ error: "Inventory Item not found" });
        }
        res
          .status(200)
          .json({ message: "Inventory Item updated", inventoryItem }); // Return the updated inventory item in the response
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });
  
  // Route to update an inventory item by ID
  router.put("/update/:id", (req, res) => {
    const inventoryItemId = req.params.id;
    const {
      raw_material_type,
      color,
      received_stock,
      used_stock,
      available_stock,
      date,
      unit_price,
      retailer_name,
      name,
      description,
    } = req.body;
    const updatedInventoryItem = {
      raw_material_type,
      color,
      received_stock,
      used_stock,
      available_stock,
      date,
      unit_price,
      retailer_name,
      name,
      description,
    };
  
    Inventory.findByIdAndUpdate(inventoryItemId, updatedInventoryItem, {
      new: true,
    }) // Set { new: true } to return the updated document
      .then((inventoryItem) => {
        if (!inventoryItem) {
          return res.status(404).json({ error: "Inventory Item not found" });
        }
        res.json({ message: "Inventory Item updated", inventoryItem }); // Return the updated inventory item in the response
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });
  
  // Get an inventory item by ProductID
  router.get("/getInventoryItemByProductId/:productId", (req, res) => {
    const { productId } = req.params;
  
    Inventory.findOne({ productId })
      .then((inventoryItem) => {
        if (!inventoryItem) {
          return res.status(404).json({ error: "Inventory Item not found" });
        }
        res.status(200).json(inventoryItem);
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });
  

module.exports = router;
