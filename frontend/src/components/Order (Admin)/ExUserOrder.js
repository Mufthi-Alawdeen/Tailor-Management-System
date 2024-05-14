import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { generateOrderID, generateTransactionID } from "../../utils/genId";

import { Link } from "react-router-dom";
import Header from "../Product/Header";

const OrderForm = () => {
  const initialOrderID = generateOrderID();
  const initialTransactionID = generateTransactionID();

  const [formData, setFormData] = useState({
    orderDetails: {
      OrderID: initialOrderID,
      ProductID: "",
      UserID: "",
      OrderDate: new Date().toISOString().slice(0, 10),
      PickupDate: "",
      Status: "New",
      Type: "Manual",
      TransactionID: initialTransactionID,
      Description: "",
    },
    transactionDetails: {
      TransactionID: initialTransactionID,
      Amount: "",
      PaymentType: "Manual",
      TransDate: new Date().toISOString().slice(0, 10),
    },
  });

  const [userIDs, setUserIDs] = useState([]);
  const [filteredUserIDs, setFilteredUserIDs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [productIDs, setProductIDs] = useState([]);
  const [filteredProductIDs, setFilteredProductIDs] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:8075/user/getAllUsers")
      .then((response) => {
        const users = response.data;
        const onlineUserIDs = users.map((user) => user.UserID);
        setUserIDs(onlineUserIDs);
        setFilteredUserIDs(onlineUserIDs);
      })
      .catch((error) => {
        console.error("Error fetching user IDs:", error);
      });

    axios
      .get("http://localhost:8075/inventory/retrieve")
      .then((response) => {
        const products = response.data;
        const filteredProducts = products.filter(
          (product) =>
            product.raw_material_type === "Material" ||
            product.raw_material_type === "Other"
        );
        const productIDs = filteredProducts.map((product) => product.productId);
        setProductIDs(productIDs);
        setFilteredProductIDs(productIDs);
      })
      .catch((error) => {
        console.error("Error fetching product IDs:", error);
      });
  }, []);

  useEffect(() => {
    if (formData.orderDetails.UserID) {
      axios
        .get(
          `http://localhost:8075/user/getUserByUserID/${formData.orderDetails.UserID}`
        )
        .then((response) => {
          setSelectedUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, [formData.orderDetails.UserID]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filteredIDs = userIDs.filter((userID) =>
      userID.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUserIDs(filteredIDs);
  };

  const handleUserIDChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      orderDetails: {
        ...prevState.orderDetails,
        UserID: e.target.value,
      },
    }));
  };

  const handleProductIDChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      orderDetails: {
        ...prevState.orderDetails,
        ProductID: e.target.value,
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      orderDetails: {
        ...prevState.orderDetails,
        [name]: value,
      },
    }));
  };

  function handleSubmit(e) {
    e.preventDefault();

    // Post transaction details
    axios
      .post(
        "http://localhost:8075/transaction/addTransaction",
        formData.transactionDetails
      )
      .then(() => {
        // Once transaction is successfully posted, post order details
        axios
          .post("http://localhost:8075/order/addOrder", formData.orderDetails)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Thank you for your order! We have received your request.",
              showConfirmButton: false,
              timer: 1700,
              customClass: {
                title: "my-title-class",
              },
            });

            setFormData({
              orderDetails: {
                OrderID: "",
                ProductID: "",
                UserID: "",
                OrderDate: "",
                PickupDate: "",
                Status: "",
                Type: "",
                TransactionID: "",
                Description: "",
              },
              transactionDetails: {
                TransactionID: "",
                Amount: "",
                PaymentType: "Manual",
                TransDate: new Date().toISOString().slice(0, 10),
              },
            });
          })
          .catch((error) => {
            console.error("Error submitting order:", error);
          });
      })
      .catch((error) => {
        console.error("Error submitting transaction:", error);
      });
  }

  return (
    <div>
      <Header />
      <div className="container col-md-10">
        <div style={{ height: "34px" }}></div>
        <div className="row">
          <div className="col-2">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ borderRadius: 0 }}
              >
                Select Form
              </button>
              <ul className="dropdown-menu" style={{ borderRadius: 0 }}>
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
              <h2>Add User Details</h2>
              <div className="mb-3">
                <label htmlFor="UserID" className="form-label">
                  User ID:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="UserID"
                  name="UserID"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search or Select User ID"
                  style={{ borderRadius: 0 }} // Apply CSS for border radius
                />
                <select
                  className="form-select mt-2"
                  onChange={handleUserIDChange}
                  value={formData.orderDetails.UserID}
                  style={{ borderRadius: 0 }} // Apply CSS for border radius
                >
                  <option value="" disabled>
                    Select User ID
                  </option>
                  {filteredUserIDs.map((userID) => (
                    <option key={userID} value={userID}>
                      {userID}
                    </option>
                  ))}
                </select>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="mb-3">
                    <label className="form-label">First Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="FirstName"
                      value={selectedUser.FirstName || ""}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="mb-3">
                    <label className="form-label">Last Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="LastName"
                      value={selectedUser.LastName || ""}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="mb-3">
                    <label className="form-label">Conatct Number:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="PhoneNumber"
                      value={selectedUser.ContactNumber || ""}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="mb-3">
                    <label className="form-label">Address:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Address"
                      value={selectedUser.Address || ""}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <h2>Add New Order</h2>
              <div className="mb-3">
                <label htmlFor="ProductName" className="form-label">
                  Product ID:
                </label>
                <select
                  className="form-select"
                  onChange={handleProductIDChange}
                  value={formData.orderDetails.ProductID}
                  style={{ borderRadius: 0 }}
                >
                  <option value="" disabled>
                    Select Product ID
                  </option>
                  {filteredProductIDs.map((productID) => (
                    <option
                      key={productID}
                      value={productID}
                      style={{ borderRadius: 0 }}
                    >
                      {productID}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="PickupDate" className="form-label">
                    Pickup Date:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="PickupDate"
                    value={formData.orderDetails.PickupDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]} // Set min date to today
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="TotalAmount" className="form-label">
                    Total Amount:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="TotalAmount"
                    name="TotalAmount"
                    value={formData.transactionDetails.Amount}
                    onChange={(e) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        transactionDetails: {
                          ...prevState.transactionDetails,
                          Amount: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-12">
                  <label htmlFor="Description" className="form-label">
                    Description:
                  </label>
                  <textarea
                    className="form-control"
                    id="Description"
                    name="Description"
                    value={formData.orderDetails.Description}
                    onChange={handleChange}
                    style={{ borderRadius: 0 }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-dark"
                style={{ borderRadius: 0 }}
              >
                Submit
              </button>
            </form>
            <div style={{ height: "34px" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
