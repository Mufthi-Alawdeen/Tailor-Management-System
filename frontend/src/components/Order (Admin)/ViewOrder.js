import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const OrderList = () => {
  const [newOrders, setNewOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios
      .get("http://localhost:8075/order/getAllOrders")
      .then((response) => {
        const newOrders = response.data.filter(
          (order) => order.Status === "New"
        );
        const pendingOrders = response.data.filter(
          (order) => order.Status === "Pending"
        );
        setNewOrders(newOrders);
        setPendingOrders(pendingOrders);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  const fetchUserDetails = (userId) => {
    axios
      .get(`http://localhost:8075/user/getUserByUserID/${userId}`)
      .then((response) => {
        setSelectedUser(response.data);
        setShowModal(true);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  };

  const handleStatusChange = (id, status) => {
    axios
      .put(`http://localhost:8075/order/updateOrder/${id}`, { Status: status })
      .then(() => {
        fetchOrders();
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  const handleStatusChangePendding = (id, status, productID) => {
    axios
      .put(`http://localhost:8075/order/updateOrder/${id}`, { Status: status })
      .then(() => {
        // Fetch current inventory item
        axios
          .get(
            `http://localhost:8075/inventory/getInventoryItemByProductId/${productID}`
          )
          .then((response) => {
            const currentUsedStock = response.data.used_stock;
            const newUsedStock = currentUsedStock + 5; // Increment by 5
            // Update used stock
            axios
              .put(
                `http://localhost:8075/inventory/updateInventoryItemByProductId/${productID}`,
                { used_stock: newUsedStock }
              )
              .then(() => {
                fetchOrders();
              })
              .catch((error) => {
                console.error("Error updating used stock:", error);
              });
          })
          .catch((error) => {
            console.error("Error fetching current used stock:", error);
          });
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  const handleViewDetails = async (order) => {
    setSelectedOrder(order);
    const userId = order.UserID;
    await fetchUserDetails(userId);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredNewOrders = newOrders.filter((order) =>
    order.OrderID.includes(searchQuery)
  );

  const filteredPendingOrders = pendingOrders.filter((order) =>
    order.OrderID.includes(searchQuery)
  );

  return (
    <div className="container mt-5">
      <h2>New Orders</h2>
      <div style={{ height: "10px" }}></div>

      <div className="row">
        <div className="col-10">
          <Form.Group controlId="formBasicSearch">
            <Form.Control
              type="text"
              placeholder="Search by Order ID"
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
              style={{ borderRadius: 0 }}
            >
              Select Table
            </button>
            <ul className="dropdown-menu" style={{ borderRadius: 0 }}>
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
            <th>Order ID</th>
            <th>Product ID</th>
            <th>User ID</th>
            <th>Order Date</th>
            <th>Delivery Date</th>

            <th>Description</th>
            <th>Type</th>
            <th>Actions</th>
            <th>View More</th>
          </tr>
        </thead>
        <tbody>
          {filteredNewOrders.map((order) => (
            <tr key={order.OrderID}>
              <td>{order.OrderID}</td>
              <td>{order.ProductID}</td>
              <td>{order.UserID}</td>
              <td>{formatDate(order.OrderDate)}</td>
              <td>{formatDate(order.PickupDate)}</td>

              <td>{order.Description}</td>
              <td>{order.Type}</td>
              <td>
                {order.Status !== "Finished" && (
                  <Button
                    variant="warning"
                    onClick={() =>
                      handleStatusChangePendding(
                        order._id,
                        "Pending",
                        order.ProductName
                      )
                    }
                    style={{ borderRadius: 0 }} // Apply CSS for border radius
                  >
                    Pending
                  </Button>
                )}
              </td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleViewDetails(order)}
                  style={{ borderRadius: 0 }} // Apply CSS for border radius
                >
                  More
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{ height: "10px" }}></div>
      <h2>Pending Orders</h2>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product ID</th>
            <th>User ID</th>
            <th>Order Date</th>
            <th>Delivery Date</th>

            <th>Description</th>
            <th>Type</th>
            <th>Actions</th>
            <th>View More</th>
          </tr>
        </thead>
        <tbody>
          {filteredPendingOrders.map((order) => (
            <tr key={order.OrderID}>
              <td>{order.OrderID}</td>
              <td>{order.ProductID}</td>
              <td>{order.UserID}</td>
              <td>{formatDate(order.OrderDate)}</td>
              <td>{formatDate(order.PickupDate)}</td>

              <td>{order.Description}</td>
              <td>{order.Type}</td>
              <td>
                {order.Status !== "Finished" && (
                  <Button
                    variant="success"
                    onClick={() => handleStatusChange(order._id, "Finished")}
                    style={{ borderRadius: 0 }} // Apply CSS for border radius
                  >
                    Finish
                  </Button>
                )}
              </td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleViewDetails(order)}
                  style={{ borderRadius: 0 }} // Apply CSS for border radius
                >
                  More
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <div style={{ height: "20px" }}></div>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && selectedUser && (
            <div>
              <p>
                <strong>User ID:</strong> {selectedOrder.UserID}
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
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default OrderList;
