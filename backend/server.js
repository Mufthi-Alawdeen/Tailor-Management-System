const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
require("dotenv").config();

// Load environment variables from .env file
dotenv.config();

const app = express();

// Use bodyParser middleware to parse JSON bodies
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// MongoDB connection
const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error("MongoDB connection error:", error);
});

db.once('open', () => {
  console.log("MongoDB connected successfully");
});


const productRouter = require('./routes/products.js'); // check done
const inventoryRouter = require("./routes/inventory");
const inventoryRequestRouter = require("./routes/inventory_request");
const inquiryRouter = require("./routes/inquiry");
const emploeeRouter =require("./routes/employees");
const leaveRouter =require("./routes/leaves");
const onlineUserRouter =require("./routes/onlineUser.js");
const employeeAccountRouter =require("./routes/employee_account.js");
const employeeBonusRouter =require("./routes/employee_bonus.js");
const orderRouter = require("./routes/order");
const rentRouter = require("./routes/RentDetails.js");
const userRouter = require("./routes/UserDetails.js");
const transectionRouter = require("./routes/TransDetails.js");
const rentCart = require("./routes/rentCart.js");

app.use("/order", orderRouter);
app.use("/rent", rentRouter);
app.use("/user", userRouter);
app.use("/transaction", transectionRouter);
app.use("/inventory", inventoryRouter);
app.use("/inventoryRequest", inventoryRequestRouter);
app.use("/inquiry/", inquiryRouter);
app.use("/product" ,productRouter);
app.use("/employee",emploeeRouter);  //using "use" function in express
app.use("/leave",leaveRouter);  //using "use" function in express
app.use("/onlineUser",onlineUserRouter);
app.use("/employeeAccount",employeeAccountRouter);
app.use("/employeeBonus",employeeBonusRouter);
app.use("/rentCart", rentCart);
 
// Define routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
const PORT = process.env.PORT || 8075;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
