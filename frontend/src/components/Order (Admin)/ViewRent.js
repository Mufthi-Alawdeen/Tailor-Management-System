import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../Product/Header";

const RentalList = () => {
  const [rentals, setRentals] = useState([]);
  const [selectedRental, setSelectedRental] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = () => {
    axios
      .get("http://localhost:8075/rent/getAllRents")
      .then((response) => {
        setRentals(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rentals:", error);
      });
  };

  const handleStatusChange = (id, status) => {
    axios
      .put(`http://localhost:8075/rent/updateRent/${id}`, { Status: status })
      .then(() => {
        // Refresh rentals after updating status
        fetchRentals();
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  const handleViewDetails = async (rental) => {
    setSelectedRental(rental);
    try {
      const response = await axios.get(
        `http://localhost:8075/user/getUserByUserID/${rental.UserID}`
      );
      const userData = response.data;
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRentals = rentals.filter((rental) =>
    rental.RentID.includes(searchQuery)
  );

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2>Rentals</h2>
        <div style={{ height: "10px" }}></div>

        <div className="row">
          <div className="col-10">
            <Form.Group controlId="formBasicSearch">
              <Form.Control
                type="text"
                placeholder="Search by Rental ID"
                value={searchQuery}
                onChange={handleSearch}
              />
            </Form.Group>
          </div>
          <div className="col-2">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle btn-box"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Select Table
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/ManageOrder" className="dropdown-item">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link to="/ManageRent" className="dropdown-item">
                    Rentals
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link to="/AllOrders" className="dropdown-item">
                    All Orders
                  </Link>
                </li>
                <li>
                  <Link to="/AllRentals" className="dropdown-item">
                    All Rentals
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ height: "34px" }}></div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Rental ID</th>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>User ID</th>
              <th>Rental Date</th>
              <th>Return Date</th>

              <th>Status</th>
              <th>Actions</th>
              <th>View More</th>
            </tr>
          </thead>
          <tbody>
            {filteredRentals.map(
              (rental) =>
                rental.Status !== "returned" && (
                  <tr key={rental._id}>
                    <td>{rental.RentID}</td>
                    <td>{rental.ProductID}</td>
                    <td>{rental.ProductName}</td>
                    <td>{rental.UserID}</td>
                    <td>{formatDate(rental.PickupDate)}</td>
                    <td>{formatDate(rental.ReturnDate)}</td>

                    <td>{rental.Status}</td>
                    <td>
                      {rental.Status !== "returned" && (
                        <Button
                          variant="warning"
                          onClick={() =>
                            handleStatusChange(rental._id, "returned")
                          }
                        >
                          Return
                        </Button>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleViewDetails(rental)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </Table>

        <Modal show={showUserModal} onHide={handleCloseUserModal}>
          <Modal.Header closeButton>
            <Modal.Title>User Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && selectedRental && (
              <div>
                <p>
                  <strong>User ID:</strong> {selectedUser.UserID}
                </p>
                <p>
                  <strong>User Name:</strong> {selectedUser.FirstName}{" "}
                  {selectedUser.LastName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.Email}
                </p>
                <p>
                  <strong>Address:</strong> {selectedUser.Address}
                </p>
                <p>
                  <strong>Contact Number:</strong> {selectedUser.ContactNumber}
                </p>
                <p>
                  <strong>Customer Type:</strong> {selectedUser.Type}
                </p>
                <p>
                  <strong>Description</strong> {selectedRental.Description}
                </p>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default RentalList;
