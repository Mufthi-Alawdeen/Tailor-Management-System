import React from 'react';
import { Link } from 'react-router-dom';

const OrderDetailsPage = ({ orderId, transactionId, amount, pickupDate }) => {
  console.log("Order ID:", orderId);
  console.log("Transaction ID:", transactionId);
  console.log("Amount:", amount);
  console.log("Pickup Date:", pickupDate);

  return (
    <div className='maincont'>
      <h2>Order Details</h2>
      <div>Order ID: {orderId}</div>
      <div>Transaction ID: {transactionId}</div>
      <div>Amount: ${amount}</div>
      <div>Pickup Date: {pickupDate}</div>
      <Link to="/" className="btn">Home</Link>
    </div>
  );
};

export default OrderDetailsPage;
