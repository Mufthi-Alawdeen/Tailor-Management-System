const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../images')); // Set the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Set the file name
  }
});

// Upload middleware
const upload = multer({ storage: storage });

// Function to convert an image file to base64 string
function imageToBase64(filePath) {
  const fileContent = fs.readFileSync(filePath);
  return fileContent.toString('base64');
}

// Add a new product with image upload
router.post('/add', upload.array('images', 5), async (req, res) => {
  try {
    // Extract product data from request body
    const { name, price, description, category, type, size } = req.body;

    // Ensure size is an array of strings
    const sizesArray = Array.isArray(size) ? size : [size];

    // Extract file paths of uploaded images
    const imagePaths = req.files ? req.files.map(file => file.path) : [];

    // Ensure imagePaths is an array before mapping over it
    const images = Array.isArray(imagePaths) ? imagePaths.map(imageToBase64) : [];

    // Create a new product instance
    const product = new Product({
      name,
      price,
      description,
      category,
      type,
      images,
      size: sizesArray // Assign the sizes array
    });

    // Save the product to the database
    const savedProduct = await product.save();

    // Redirect based on product type
    if (type === 'rent') {
      res.redirect('/product/rentproducts'); // Redirect to rentproducts route
    } else if (type === 'buy') {
      res.redirect('/product/buyproducts'); // Redirect to buyproducts route
    } else {
      res.status(400).json({ message: 'Invalid product type' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// Route for fetching rent products
router.get('/rentproducts', async (req, res) => {
  try {
    // Fetch rent products from the database
    const rentProducts = await Product.find({ type: 'rent' });
    res.json(rentProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get details of a specific rental product by ID
router.get('/rentproducts/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      size: product.size,
      images: product.images,
      // Add any other necessary details here
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route for fetching buy products
router.get('/buyproducts', async (req, res) => {
  try {
    // Fetch buy products from the database
    const buyProducts = await Product.find({ type: 'buy' });
    res.json(buyProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Route to get all products
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get a single product by ID
router.get('/:id', getProduct, (req, res) => {
  res.json(res.product);
});

// Middleware function to get a product by ID from the database
async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.product = product;
  next();
}

// Multer configuration for file uploads
const updateStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../editImages')); // Set the destination folder for editing images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Set the file name
  }
});

// Upload middleware for update route checked done
const update = multer({ storage: updateStorage });

// Update product with image upload
router.patch('/update/:productId', update.array('images', 5), async (req, res) => {
  try {
    // Extract product data from request body
    const { name, price, description, category, type } = req.body;
    const productId = req.params.productId;

    // Extract file paths of uploaded images
    const imagePaths = req.files ? req.files.map(file => file.path) : [];

    // Ensure imagePaths is an array before mapping over it
    const images = Array.isArray(imagePaths) ? imagePaths.map(imageToBase64) : [];

    // Find the product by ID and update its details
    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      name,
      price,
      description,
      category,
      type,
      images
    }, { new: true });

    // Check if the product was updated successfully
    if (updatedProduct) {
      res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// Route to delete a product by ID
router.delete('/delete/:id', getProduct, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;