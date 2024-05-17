import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import html2pdf from 'html2pdf.js';

const OrderDetailsPage = () => {
  const location = useLocation();
  const { orders, transactionId, amount, pickupDate } = location.state || {};
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
    <div className='container mt-5' >
      <div ref={componentRef}>
      <h2>Order Details</h2>
      <div className="mb-3">
        <strong>Transaction ID:</strong> {transactionId}
      </div>
      <div className="mb-3">
        <strong>Amount:</strong> ${amount}
      </div>
      <h3>Order IDs:</h3>
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
              <td>{order._id}</td>
              <td>{order.PickupDate}</td>
              <td>${order.Amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <button onClick={handlePrint} className="btn btn-primary d-print-none">Print Report</button>
      <Link to="/" className="btn btn-secondary ml-2 d-print-none">Home</Link>
    </div>
  );
};

export default OrderDetailsPage;
