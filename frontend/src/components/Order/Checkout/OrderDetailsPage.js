import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import html2pdf from 'html2pdf.js';
import './Checkout.css';

const OrderDetailsPage = () => {
  const location = useLocation();
  const { orders, transactionId, amount } = location.state || {};
  const componentRef = useRef();

  const handlePrint = () => {
    const opt = {
      margin:       1,
      filename:     'order_details.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(componentRef.current).set(opt).save();
  };

  return (
    <div className='container mt-5' id='orderdet' >
      <div ref={componentRef}>
      <h2>Transaction Details</h2>
      <div className="mb-3">
        <strong>Transaction ID:</strong> {transactionId}
      </div>
      <div className="mb-3">
        <strong>Amount:</strong> ${amount}
      </div>
      <h3>Orders</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Pickup Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{order.OrderID}</td>
              <td>{new Date(order.PickupDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              <td>${order.Amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <button onClick={handlePrint} className="btn">Print Report</button>
      <Link to="/" className="btn">Home</Link>
    </div>
  );
};

export default OrderDetailsPage;
