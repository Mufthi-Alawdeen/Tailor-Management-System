import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {
  generateOrderID,
  generateUserID,
  generateTransactionID,
} from "../../utils/genId";
import Header from "../Product/Header";

const OrderAndUserForm = () => {
  const initialOrderID = generateOrderID();
  const initialUserID = generateUserID();
  const initialTransactionID = generateTransactionID();

  const [formDetails, setFormDetails] = useState({
    orderDetails: {
      OrderID: initialOrderID,
      UserID: initialUserID,
      MaterialID: "",
      Status: "New",
      Type: "Manual",
      OrderDate: new Date().toISOString().slice(0, 10),
      PickupDate: "",
      TransactionID: initialTransactionID,
      Amount: "", // Added here
      Description: "",
    },
    userDetails: {
      UserID: initialUserID,
      FirstName: "",
      LastName: "",
      Email: "",
      Address: "",
      ContactNumber: "",
      Type: "offline",
    },
    transactionDetails: {
      TransactionID: initialTransactionID,
      Amount: "", // Added here
      PaymentType: "Manual",
      TransDate: new Date().toISOString().slice(0, 10),
    },
    measurementDetails: {
      chest: "",
      waist: "",
      hips: "",
      shoulders: "",
      sleeveLength: "",
      jacketLength: "",
      inseam: "",
      outseam: "",
      rise: "",
      neck: "",
      shirtLength: "",
    },
    productIDs: [],
    filteredProductIDs: [],
  });

  useEffect(() => {
    retrieveProductIDs();
  }, []);

  const retrieveProductIDs = () => {
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
        setFormDetails((prevFormDetails) => ({
          ...prevFormDetails,
          productIDs,
          filteredProductIDs: productIDs,
        }));
      })
      .catch((error) => {
        console.error("Error fetching product IDs:", error);
      });
  };

  const handleInputChange = (e, category) => {
    const { name, value } = e.target;
    setFormDetails((prevFormDetails) => ({
      ...prevFormDetails,
      [category]: {
        ...prevFormDetails[category],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const userResponse = await axios.post(
      "http://localhost:8075/user/addUser",
      formDetails.userDetails
    );

    const orderResponse = await axios.post(
      "http://localhost:8075/order/addOrder",
      {
        ...formDetails.orderDetails,
        Measurement: formDetails.measurementDetails,
      }
    );

    const transactionResponse = await axios.post(
      "http://localhost:8075/transaction/addTransaction",
      formDetails.transactionDetails
    );

    console.log("Form submitted successfully");
    
    // Reset the form
    resetForm();
    
    console.log("Form reset successful");
    
    // Show success message
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Order, user, and transaction added successfully.",
      showConfirmButton: false,
      timer: 2000,
    });
  } catch (error) {
    console.error("Error:", error.message);
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Order, user, and transaction added successfully.",
      showConfirmButton: false,
      timer: 2000,
      
    },resetForm());
  }
};


  const resetForm = () => {
    setFormDetails({
      orderDetails: {
        ...formDetails.orderDetails,
        MaterialID: "",
        PickupDate: "",
        Description: "",
        Amount: "",
      },
      userDetails: {
        ...formDetails.userDetails,
        FirstName: "",
        LastName: "",
        Email: "",
        Address: "",
        ContactNumber: "",
      },
      transactionDetails: {
        ...formDetails.transactionDetails,
        Amount: "",
      },
      measurementDetails: {
        chest: "",
        waist: "",
        hips: "",
        shoulders: "",
        sleeveLength: "",
        jacketLength: "",
        inseam: "",
        outseam: "",
        rise: "",
        neck: "",
        shirtLength: "",
      },
      filteredProductIDs: formDetails.productIDs,
    });
  };

  return (
    <div>
      <Header />
      <div className="container col-md-10">
        <div style={{ height: "34px" }}></div>
        <div className="row">
          <div className="col-sm-2">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
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

          <div className="col-sm-8">
            <form onSubmit={handleSubmit}>
              <h3>User Details</h3>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="form-label">User ID:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="UserID"
                    value={formDetails.userDetails.UserID}
                    onChange={(e) => handleInputChange(e, "userDetails")}
                    disabled
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">First Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="FirstName"
                      value={formDetails.userDetails.FirstName}
                      onChange={(e) => handleInputChange(e, "userDetails")}
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
                      value={formDetails.userDetails.LastName}onChange={(e) => handleInputChange(e, "userDetails")}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Contact Number:</label>
                    <input
                      type="number"
                      className="form-control"
                      name="ContactNumber"
                      value={formDetails.userDetails.ContactNumber}
                      onChange={(e) => handleInputChange(e, "userDetails")}
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
                      value={formDetails.userDetails.Email}
                      onChange={(e) => handleInputChange(e, "userDetails")}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="form-label">Address:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Address"
                      value={formDetails.userDetails.Address}
                      onChange={(e) => handleInputChange(e, "userDetails")}
                      required
                    />
                  </div>
                </div>
              </div>
              <h3>Order Details</h3>
              <div className="row">
                <div className="col-md-12">
                  <div className="mb-3">
                    <label htmlFor="ProductID" className="form-label">
                      Material ID:
                    </label>
                    <select
                      className="form-select"
                      name="MaterialID"
                      value={formDetails.orderDetails.MaterialID}
                      onChange={(e) => handleInputChange(e, "orderDetails")}
                      required
                    >
                      <option value="" disabled>
                        Select Material ID
                      </option>
                      {formDetails.filteredProductIDs.map((productID) => (
                        <option key={productID} value={productID}>
                          {productID}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Total Payment:</label>
                    <input
                      type="number"
                      className="form-control"
                      name="Amount"
                      value={formDetails.orderDetails.Amount}
                      onChange={(e) =>
                        handleInputChange(e, "orderDetails")
                      }
                      required
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
                      value={formDetails.orderDetails.PickupDate}
                      onChange={(e) => handleInputChange(e, "orderDetails")}
                      min={new Date().toISOString().split("T")[0]} // Set min date to today
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="form-label">Description:</label>
                    <textarea
                      type="text"
                      className="form-control"
                      name="Description"
                      value={formDetails.orderDetails.Description}
                      onChange={(e) => handleInputChange(e, "orderDetails")}
                    />
                  </div>
                </div>
              </div>
              <h3>Measurement Details</h3>
              <div className="row">
                <div className="col-md-4">
                  {Object.entries(formDetails.measurementDetails)
                    .slice(0, 4)
                    .map(([key, value]) => (
                      <div className="mb-3" key={key}>
                        <label className="form-label">{key}:</label>
                        <input
                          type="number"
                          className="form-control"
                          name={key}
                          value={value}
                          onChange={(e) =>
                            handleInputChange(e, "measurementDetails")
                          }
                          
                        />
                      </div>
                    ))}
                </div>
                <div className="col-md-4">
                  {Object.entries(formDetails.measurementDetails)
                    .slice(4, 8)
                    .map(([key, value]) => (
                      <div className="mb-3" key={key}>
                        <label className="form-label">{key}:</label>
                        <input
                          type="number"
                          className="form-control"
                          name={key}
                          value={value}
                          onChange={(e) =>
                            handleInputChange(e, "measurementDetails")
                          }
                          
                        />
                      </div>
                    ))}
                </div>
                <div className="col-md-4">
                  {Object.entries(formDetails.measurementDetails)
                    .slice(8)
                    .map(([key, value]) => (
                      <div className="mb-3" key={key}>
                        <label className="form-label">{key}:</label>
                        <input
                          type="number"
                          className="form-control"
                          name={key}
                          value={value}
                          onChange={(e) =>
                            handleInputChange(e, "measurementDetails")
                          }
                          
                        />
                      </div>
                    ))}
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

export default OrderAndUserForm;


