import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {
  generateUserID,
  generateRentID,
  generateTransactionID,
} from "../../utils/genId";
import Header from "../Product/Header";

const RentAndUserForm = () => {
  const initialUserID = generateUserID();
  const initialRentID = generateRentID();
  const currentDate = new Date().toISOString().slice(0, 10);
  const initialTransactionID = generateTransactionID();

  const [userDetails, setUserDetails] = useState({
    UserID: initialUserID,
    FirstName: "",
    LastName: "",
    Email: "",
    Address: "",
    ContactNumber: "",
    Amount: "",
    Type: "offline",
  });

  const [rentDetails, setRentDetails] = useState({
    UserID: initialUserID,
    RentID: initialRentID,
    ProductID: "",
    ProductName: "",
    PickupDate: currentDate,
    ReturnDate: "",
    Status: "Rented",
    Type: "Manual",
    TransactionID: initialTransactionID,
    Amount: "",
  });

  const [transactionDetails, setTransactionDetails] = useState({
    TransactionID: initialTransactionID,
    Amount: "",
    PaymentType: "Manual",
    TransDate: new Date().toISOString().slice(0, 10),
  });

  const [products, setProducts] = useState([]);
  const [productPrice, setProductPrice] = useState("");
  const [rentedDates, setRentedDates] = useState([]);

  useEffect(() => {
    retrieveProductIDs();
    fetchRentedDates();
  }, []);

  const retrieveProductIDs = () => {
    axios
      .get("http://localhost:8075/product/rentproducts")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product IDs:", error);
      });
  };

  const fetchRentedDates = () => {
    axios
      .get("http://localhost:8075/rent/getRentedDates")
      .then((response) => {
        setRentedDates(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rented dates:", error);
      });
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevUserDetails) => ({
      ...prevUserDetails,
      [name]: value,
    }));
  };

  const handleRentChange = (e) => {
    const { name, value } = e.target;
    setRentDetails((prevRentDetails) => ({
      ...prevRentDetails,
      [name]: value,
    }));
  };

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransactionDetails((prevTransactionDetails) => ({
      ...prevTransactionDetails,
      [name]: value,
    }));
  };

  const handleProductSelect = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = products.find(
      (product) => product._id === selectedProductId
    );
    if (selectedProduct) {
      const productAmount = selectedProduct.price.toString();
      setRentDetails((prevRentDetails) => ({
        ...prevRentDetails,
        ProductID: selectedProduct._id,
        ProductName: selectedProduct.name,
        Amount: productAmount,
      }));
      setProductPrice(productAmount);
      setTransactionDetails((prevTransactionDetails) => ({
        ...prevTransactionDetails,
        Amount: productAmount,
      }));
      setUserDetails((prevUserDetails) => ({
        ...prevUserDetails,
        Amount: productAmount,
      }));
    }
  };

  const isDateRangeAvailable = () => {
    const pickupDate = new Date(rentDetails.PickupDate);
    const returnDate = new Date(rentDetails.ReturnDate);

    for (const rentedDate of rentedDates) {
      const rentedPickupDate = new Date(rentedDate.PickupDate);
      const rentedReturnDate = new Date(rentedDate.ReturnDate);

      if (
        (pickupDate >= rentedPickupDate && pickupDate <= rentedReturnDate) ||
        (returnDate >= rentedPickupDate && returnDate <= rentedReturnDate) ||
        (pickupDate <= rentedPickupDate && returnDate >= rentedReturnDate)
      ) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDateRangeAvailable()) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date Range",
        text: "The selected date range overlaps with an existing rental period.",
      });
      return;
    }
    try {
      const userResponse = await axios.post(
        "http://localhost:8075/user/addUser",
        userDetails
      );

      const rentResponse = await axios.post(
        "http://localhost:8075/rent/addRent",
        rentDetails
      );

      const transactionResponse = await axios.post(
        "http://localhost:8075/transaction/addTransaction",
        transactionDetails
      );

      // Reset form fields after successful submission
      setUserDetails({
        UserID: generateUserID(),
        FirstName: "",
        LastName: "",
        Email: "",
        Address: "",
        ContactNumber: "",
        Amount: "",
        Type: "offline",
      });

      setRentDetails({
        UserID: generateUserID(),
        RentID: generateRentID(),
        ProductID: "",
        ProductName: "",
        PickupDate: currentDate,
        ReturnDate: "",
        Status: "Rented",
        Type: "Manual",
        TransactionID: generateTransactionID(),
        Amount: "",
      });

      setTransactionDetails({
        TransactionID: generateTransactionID(),
        Amount: "",
        PaymentType: "Manual",
        TransDate: new Date().toISOString().slice(0, 10),
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User and rent added successfully.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div>
      <Header />
      <div className="container col-md-10">
        <div style={{ height: "34px" }}></div>
        <div className="row">
          <div className="col-2">
            <div className="dropdown">
              <button               className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Select Form
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/AddOrderNewUser" className="dropdown-item">
                    New User Order
                  </Link>
                </li>
                <li>
                  <Link to="/AddOrderExUser" className="dropdown-item">
                    Existing User Order
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link to="/AddRentNewUser" className="dropdown-item">
                    New User Rental
                  </Link>
                </li>
                <li>
                  <Link to="/AddRentExUser" className="dropdown-item">
                    Existing User Rental
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-8">
            <form onSubmit={handleSubmit}>
              <h3>User Details</h3>
              <div className="mb-3">
                <label className="form-label">User ID:</label>
                <input
                  type="text"
                  className="form-control"
                  name="UserID"
                  value={userDetails.UserID}
                  onChange={handleUserChange}
                  disabled
                />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">First Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="FirstName"
                      value={userDetails.FirstName}
                      onChange={handleUserChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Last Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="LastName"
                      value={userDetails.LastName}
                      onChange={handleUserChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Contact Number:</label>
                    <input
                      type="number"
                      className="form-control"
                      name="ContactNumber"
                      value={userDetails.ContactNumber}
                      onChange={handleUserChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      name="Email"
                      value={userDetails.Email}
                      onChange={handleUserChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Address:</label>
                <input
                  type="text"
                  className="form-control"
                  name="Address"
                  value={userDetails.Address}
                  onChange={handleUserChange}
                  required
                />
              </div>

              <h3>Rent Details</h3>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Product Name:</label>
                    <select
                      className="form-select"
                      value={rentDetails.ProductID}
                      onChange={handleProductSelect}
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Amount:</label>
                    <input
                      type="number"
                      className="form-control"
                      name="Amount"
                      value={transactionDetails.Amount || productPrice}
                      onChange={handleTransactionChange}
                      disabled
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Pickup Date:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="PickupDate"
                      value={rentDetails.PickupDate}
                      onChange={handleRentChange}
                      min={currentDate}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Return Date:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="ReturnDate"
                      value={rentDetails.ReturnDate}
                      onChange={handleRentChange}
                      min={rentDetails.PickupDate}
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-dark mt-3">
                Submit
              </button>
              <div style={{ height: "34px" }}></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentAndUserForm;

               
