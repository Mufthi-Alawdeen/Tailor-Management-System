import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { generateRentID, generateTransactionID } from "../../utils/genId";
import { Link } from "react-router-dom";
import Headers from "../Product/Header";

const RentForm = () => {
  const initialRentID = generateRentID();
  const initialTransactionID = generateTransactionID();
  const currentDate = new Date().toISOString().slice(0, 10);

  const [formData, setFormData] = useState({
    UserID: "",
    RentID: initialRentID,
    ProductID: "",
    ProductName: "",
    PickupDate: currentDate,
    ReturnDate: "",
    Status: "Rented",
    Type: "Manual",
    TransactionID: initialTransactionID,
  });

  const [transactionDetails, setTransactionDetails] = useState({
    TransactionID: initialTransactionID,
    Amount: "",
    PaymentType: "Manual",
    TransDate: currentDate,
  });

  const [userIDs, setUserIDs] = useState([]);
  const [filteredUserIDs, setFilteredUserIDs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState({});
  const [products, setProducts] = useState([]);
  const [productPrice, setProductPrice] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null); // Define setSelectedProduct

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

    retrieveProductIDs();
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

  const handleProductSelect = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = products.find(
      (product) => product._id === selectedProductId
    );
    if (selectedProduct) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        ProductID: selectedProduct._id,
        ProductName: selectedProduct.name,
      }));
      setProductPrice(selectedProduct.price);
      setTransactionDetails((prevTransactionDetails) => ({
        ...prevTransactionDetails,
        Amount: selectedProduct.price.toString(),
      }));
      setSelectedProduct(selectedProduct); // Set selected product
    }
  };

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
      UserID: e.target.value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Automatically adjust pickup date when return date is selected
    if (name === "ReturnDate") {
      const pickupDate = new Date(value);
      pickupDate.setDate(pickupDate.getDate() - 2); // Set pickup date 2 days before return date
      setFormData((prevFormData) => ({
        ...prevFormData,
        PickupDate: pickupDate.toISOString().slice(0, 10),
      }));
    }
    // Set product price in transactionDetails
    if (name === "ProductID") {
      const selectedProduct = products.find(
        (product) => product.ProductID === value
      );
      if (selectedProduct) {
        setTransactionDetails((prevTransactionDetails) => ({
          ...prevTransactionDetails,
          Amount: selectedProduct.Amount,
        }));
        setSelectedProduct(selectedProduct);
      }
    }
  };

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransactionDetails((prevTransactionDetails) => ({
      ...prevTransactionDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formData.UserID) {
      axios
        .get(`http://localhost:8075/user/getUserByUserID/${formData.UserID}`)
        .then((response) => {
          setSelectedUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, [formData.UserID]);

  useEffect(() => {
    const selectedProduct = products.find(
      (product) => product.ProductID === formData.ProductID
    );
    if (selectedProduct) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        ProductName: selectedProduct.ProductName,
      }));
      setSelectedProduct(selectedProduct);
    }
  }, [formData.ProductID, products]);

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post("http://localhost:8075/rent/addRent", formData)
      .then(() => {
        // Submit transaction data
        axios
          .post(
            "http://localhost:8075/transaction/addTransaction",
            transactionDetails
          )
          .then(() => {
            Swal.fire({
              icon: "success",
              title:
                "Thank you for your rental request! We have received your request.",
              showConfirmButton: false,
              timer: 1700,
            });

            setFormData({
              UserID: "",
              RentID: generateRentID(),
              ProductID: "",
              ProductName: "",
              PickupDate: currentDate,
              ReturnDate: "",
              Status: "Rented",
              Type: "Manual",
              TransactionID: generateTransactionID(),
            });

            setTransactionDetails({
              TransactionID: generateTransactionID(),
              Amount: "",
              PaymentType: "Manual",
              TransDate: currentDate,
            });
          })
          .catch((error) => {
            console.error("Error submitting transaction:", error);
          });
      })
      .catch((error) => {
        console.error("Error submitting rental:", error);
      });
  }

  return (
    <div>
      <Headers />
      <div className="container col-md-10">
        <div style={{ height: "34px" }}></div>
        <div className="row">
          <div className="col-2">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle btn-box"
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
            <h2>Existing User Details</h2>
            <form onSubmit={handleSubmit}>
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
                />
                <select
                  className="form-select mt-2"
                  onChange={handleUserIDChange}
                  value={formData.UserID}
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
                    <label className="form-label">Contact Number:</label>
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

              <h2>Add New Rental</h2>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Product Name:</label>
                    <select
                      className="form-select"
                      value={formData.ProductID}
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
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="ProductID"
                  name="ProductID"
                  value={formData.ProductID}
                  onChange={handleChange}
                  hidden
                />
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
                    value={formData.PickupDate}
                    onChange={handleChange}
                    min={currentDate}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="ReturnDate" className="form-label">
                    Return Date:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="ReturnDate"
                    value={formData.ReturnDate}
                    onChange={handleChange}
                    min={formData.PickupDate}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-dark">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentForm;
