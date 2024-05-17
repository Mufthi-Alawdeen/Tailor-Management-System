const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const axios = require("axios");
const bcrypt = require("bcrypt");

//models
const Rating = require("../models/Rating");
const User = require("../models/OnlineUser");
const OnlineUsers = require("../models/OnlineUser");
const Inventory = require("../models/Inventory");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const Order = require("../models/Order");

// order client

const {
  generateOrderID,
  generateTransactionID,
} = require("../utils/generator");

// Define the directory path where your images are stored
const imagesDirectory = path.join(__dirname, "../../backend/images");

// Route to fetch carousel images
router.get("/carousel-images", async (req, res) => {
  try {
    // Read the filenames of images from the directory
    const imageFiles = fs.readdirSync(imagesDirectory);

    // Map the filenames to an array of image URLs
    const imageUrls = imageFiles.map((filename) => {
      return `${req.protocol}://${req.get("host")}/images/${filename}`;
    });

    // Send the image URLs as a response
    res.json(imageUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/buyproducts", async (req, res) => {
  try {
    // Fetch buy products from the database
    const buyProducts = await Product.find({ type: "buy" });
    res.json(buyProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/buyproducts/suits", async (req, res) => {
  try {
    // Fetch buy products of category 'suit' from the database
    const buySuitProducts = await Product.find({
      type: "buy",
      category: "suit",
    });
    res.json(buySuitProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/buyproducts/shirts", async (req, res) => {
  try {
    // Fetch buy products of category 'suit' from the database
    const buySuitProducts = await Product.find({
      type: "buy",
      category: "shirt",
    });
    res.json(buySuitProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/buyproducts/trousers", async (req, res) => {
  try {
    // Fetch buy products of category 'suit' from the database
    const buySuitProducts = await Product.find({
      type: "buy",
      category: "trousers",
    });
    res.json(buySuitProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/buyproducts/accessories", async (req, res) => {
  try {
    // Fetch buy products of category 'bow' or 'tie' from the database
    const buyAccessoryProducts = await Product.find({
      type: "buy",
      category: { $in: ["bow", "tie"] },
    });
    res.json(buyAccessoryProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/products/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId).populate({
      path: "ratings",
      populate: {
        path: "user", // Update from 'users' to 'user'
        select: "FirstName", // Assuming the user schema has a 'FirstName' field
      },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Simulating additional data retrieval or processing
    // Modify this part based on your actual requirements
    // For demonstration purposes, I'm simply sending back the product object
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to submit a new review for a product
router.post("/products/:productId/reviews", async (req, res) => {
  const { productId } = req.params;
  const { starRating, review, userId } = req.body;

  // Check if starRating is provided
  if (!starRating) {
    return res.status(400).json({ message: "Star rating is required" });
  }

  try {
    // Create a new rating
    const newRating = new Rating({
      user: userId,
      starRating: starRating,
      review: review,
    });

    // Save the new rating to the database
    await newRating.save();

    // Find the product by ID
    const product = await Product.findById(productId);

    // Add the new rating to the product's ratings array
    product.ratings.push(newRating);

    // Save the updated product to the database
    await product.save();

    res.status(201).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to add cart item
router.post("/products/cart/add", async (req, res) => {
  const { productId, userId, fabric, color, type, measurements, quantity } =
    req.body;

  // Validation
  if (
    !productId ||
    !userId ||
    !fabric ||
    !color ||
    !type ||
    !measurements ||
    !quantity
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (quantity < 1 || quantity > 10) {
    return res
      .status(400)
      .json({ message: "Quantity must be between 1 and 10" });
  }

  try {
    // Find the correct inventory item based on the received color and description
    const inventoryItem = await Inventory.findOne({
      color: { $regex: new RegExp(color, "i") },
      raw_material_type: "Material",
      description: { $regex: "just plain", $options: "i" }, // Case-insensitive regex match for "plain" in description
    });

    if (!inventoryItem) {
      return res
        .status(404)
        .json({ message: "No inventory item found matching the criteria" });
    }

    const { productId: materialId } = inventoryItem; // Using productId from the inventory item as materialId

    // Create a new cart item
    const cart = new Cart({
      user: userId,
      product: productId,
      fabric,
      color,
      type,
      measurements,
      quantity,
      materialId,
    });

    // Save the cart item to the database
    await cart.save();

    res
      .status(201)
      .json({ message: "Customized item added to cart successfully" });
  } catch (error) {
    console.error("Error adding customized item to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to add cart item for accessories
router.post("/products/cart/addaccess", async (req, res) => {
  const { productId, userId, quantity } = req.body;

  // Validation
  if (!productId || !userId || !quantity) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (quantity < 1 || quantity > 10) {
    return res
      .status(400)
      .json({ message: "Quantity must be between 1 and 10" });
  }

  try {
    // Create a new cart item
    const cart = new Cart({
      user: userId,
      product: productId,
      quantity,
    });

    // Save the cart item to the database
    await cart.save();

    res
      .status(201)
      .json({ message: "Customized item added to cart successfully" });
  } catch (error) {
    console.error("Error adding customized item to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//retrieve all carts
router.get("/carts", async (req, res) => {
  try {
    // Fetch cart items and populate with user details
    const carts = await Cart.find().populate("user");

    // Fetch and format product details for each cart item
    const formattedCarts = await Promise.all(
      carts.map(async (cart) => {
        const product = await Product.findById(cart.product);
        return {
          _id: cart._id,
          user: cart.user,
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            images: product.images[0], // Assuming images is an array
          },
          fabric: cart.fabric,
          color: cart.color,
          type: cart.type,
          measurements: cart.measurements,
          quantity: cart.quantity,
          materialId: cart.materialId,
        };
      })
    );

    res.json(formattedCarts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Retrieve carts for a specific user
router.get("/carts/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch cart items for the specified user and populate with product details
    const carts = await Cart.find({ user: userId }).populate("user");

    // Fetch and format product details for each cart item
    const formattedCarts = await Promise.all(
      carts.map(async (cart) => {
        const product = await Product.findById(cart.product);
        return {
          _id: cart._id,
          user: cart.user,
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            images: product.images[0], // Assuming images is an array
          },
          fabric: cart.fabric,
          color: cart.color,
          type: cart.type,
          measurements: cart.measurements,
          quantity: cart.quantity,
          materialId: cart.materialId,
        };
      })
    );

    res.json(formattedCarts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update cart item quantity
router.post("/products/cart/update/:cartItemId", async (req, res) => {
  const cartItemId = req.params.cartItemId;
  const { quantity } = req.body;

  if (!quantity) {
    return res.status(400).json({ message: "Quantity is required" });
  }

  try {
    const updatedCartItem = await Cart.findByIdAndUpdate(
      cartItemId,
      { quantity: quantity },
      { new: true }
    );

    if (!updatedCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json(updatedCartItem);
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//delete cart item
router.delete("/carts/:cartItemId", async (req, res) => {
  const cartItemId = req.params.cartItemId;

  try {
    const deletedCartItem = await Cart.findByIdAndDelete(cartItemId);

    if (!deletedCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create order
router.post("/createorder", async (req, res) => {
  try {
    // Extract UserID from the request body
    const { userId, userObjectId } = req.body;

    if (!userObjectId) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate the new transaction ID
    const newTransactionId = await generateTransactionID();

    // Extract other data from the request body
    const { Amount, CardNo, CardExpDate } = req.body;

    // Encrypt the CardNo using bcrypt
    const hashedCardNo = await bcrypt.hash(CardNo, 10);

    // Create a new transaction object
    const newTransaction = new Transaction({
      TransactionID: newTransactionId,
      Amount,
      CardNo: hashedCardNo, // Store the hashed card number
      CardExpDate,
      PaymentType: "Online",
      TransDate: new Date(),
    });

    // Save the new transaction to the database
    await newTransaction.save();

    // Save object id for transaction
    const transactionId = newTransaction._id;

    // Call the '/carts' endpoint to get cart data
    const cartResponse = await axios.get(
      `http://localhost:8075/order/carts/${userObjectId}`
    );
    const cartData = cartResponse.data;

    // Calculate pickup date
    const pickupDate = calculatePickupDate(cartData);

    // Map cart items to orders
    const orders = [];
    const orderIds = []; // Array to store the IDs of the newly created orders
    for (const cartItem of cartData) {
      // Call order ID gen
      const orderID = await generateOrderID();

      const order = new Order({
        UserID: userId,
        OrderID: orderID,
        Quantity: cartItem.quantity,
        MaterialID: cartItem.materialId, // Assuming materialId is the product ID
        ProductID: cartItem.product, // Assuming cartItem.product is the product ID reference
        Measurement: cartItem.measurements,
        Status: "New",
        Fabric: cartItem.fabric,
        Design: cartItem.type,
        Type: "Online",
        OrderDate: new Date(), // Record the current date
        PickupDate: pickupDate,
        TransactionID: transactionId,
        Amount: cartItem.product.price * cartItem.quantity
      });
      await order.save();
      orders.push(order);
      orderIds.push(order._id); // Push the ID of the newly created order to the array

      // Update the new transaction with the order ID
      await Transaction.findByIdAndUpdate(
        transactionId,
        { $push: { orderId: order._id } }, // Push the order ID directly
        { new: true }
      );
    }

    // Respond with the newly created transaction data, cart data, and a success message
    res.status(201).json({
      transaction: newTransaction,
      orders: orders,
      message: "Orders created successfully",
    });
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const calculatePickupDate = (carts) => {
  // Filter cart items based on category
  const suitItems = carts.filter((item) => item.product.category === "suit");
  const shirtItems = carts.filter((item) => item.product.category === "shirt");
  const trousersItems = carts.filter(
    (item) => item.product.category === "trousers"
  );

  // Count the number of items in each category
  const suitCount = suitItems.length;
  const shirtCount = shirtItems.length;
  const trousersCount = trousersItems.length;

  // Calculate the total number of days based on item counts
  const totalDays = suitCount * 14 + shirtCount * 14 + trousersCount * 14;

  // Get the current date
  const currentDate = new Date();

  // Calculate the pickup date by adding totalDays to the current date
  const pickupDate = new Date(
    currentDate.getTime() + totalDays * 24 * 60 * 60 * 1000
  );

  return pickupDate;
};

// Route to fetch user object ID by UserID
router.get("/users", async (req, res) => {
  try {
    const { UserID } = req.query;

    // Find the user by UserID and return only the _id field
    const user = await User.findOne({ UserID }, "_id");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user object ID
    res.json(user);
  } catch (error) {
    console.error("Error fetching user object ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//order admin

// Create a new order
router.post("/addOrder", (req, res) => {
  const {
    OrderID,
    UserID,
    Quantity,
    MaterialID,
    ProductID,
    Measurement,
    Status,
    Fabric,
    Design,
    Type,
    OrderDate,
    PickupDate,
    TransactionID,
    Amount,
    Description,
  } = req.body;

  const newOrder = new Order({
    OrderID,
    UserID,
    Quantity,
    MaterialID,
    ProductID,
    Measurement,
    Status,
    Fabric,
    Design,
    Type,
    OrderDate,
    PickupDate,
    TransactionID,
    Amount,
    Description,
  });

  newOrder
    .save()
    .then(() => res.status(200).json({ status: "New Order Added" }))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Get all orders
router.get("/getAllOrders", (req, res) => {
  Order.find()
    .then((orders) => res.status(200).json(orders))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Update an order by ID
router.put("/updateOrder/:id", (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  Order.findByIdAndUpdate(id, updateData, { new: true })
    .then((updatedOrder) => res.status(200).json(updatedOrder))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Delete an order by ID
router.delete("/deleteOrder/:id", (req, res) => {
  const { id } = req.params;

  Order.findByIdAndDelete(id)
    .then(() => res.status(200).json({ status: "Order deleted successfully" }))
    .catch((err) => res.status(400).json({ error: err.message }));
});

// Get an order by ID
router.get("/getOrderById/:id", (req, res) => {
  const { id } = req.params;

  Order.findById(id)
    .then((order) => res.status(200).json(order))
    .catch((err) => res.status(400).json({ error: err.message }));
});

module.exports = router;
