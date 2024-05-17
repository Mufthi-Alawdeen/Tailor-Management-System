import React, { useState, useEffect } from "react";
import axios from 'axios';
import Header from "../../Inquiry/Contact Us/UserHeader";
import Footer from "../../Inquiry/Contact Us/UserFooter";
import { MdFiberNew, MdHourglassEmpty, MdCheckCircle } from 'react-icons/md'; // Import Material Icons
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const UserId = loggedInUser ? loggedInUser.UserID : null;

  useEffect(() => {
    if (!loggedInUser) {
        window.location.href = "/login";
        return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8075/order/client/getorderbyid/${UserId}`);
      setOrders(response.data);
      setIsLoading(false);
      console.log(response.data); // Add this line to print orders to the console log
    } catch (error) {
      console.error('Error fetching orders:', error);
      setIsLoading(false);
    }
  };

  // Function to format date to MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Function to render status icon based on order status
  const renderStatusIcon = (status) => {
    switch (status) {
      case 'New':
        return <MdFiberNew size={24} color="black" />;
      case 'Pending':
        return <MdHourglassEmpty size={24} color="black" />;
      case 'Finished':
        return <MdCheckCircle size={24} color="black" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-4" id="histcont">
        <h2>Order History</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {orders.map(order => (
              <div key={order.OrderID} className="col">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Order ID: {order.OrderID}</h5>
                    <p className="card-text">Amount: {order.Amount.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}</p>
                    <p className="card-text">Status: {renderStatusIcon(order.Status)} {order.Status}</p>
                    <p className="card-text">Pickup Date: {formatDate(order.PickupDate)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default OrderHistory;