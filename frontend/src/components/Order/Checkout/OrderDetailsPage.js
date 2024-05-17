import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import html2pdf from 'html2pdf.js';

const OrderDetailsPage = () => {
  const location = useLocation();
  const { orders, transactionId, amount, pickupDate } = location.state || {};
  const componentRef = useRef();
  const [buttonsVisible, setButtonsVisible] = useState(true);

  const handlePrint = () => {
    setButtonsVisible(false);

    const opt = {
      margin:       1,
      filename:     'order_details.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(componentRef.current).set(opt).save();
    
    // Set the state to true after the PDF is generated and saved
    setButtonsVisible(true);
  };

  return (
    <div className='container mt-5' ref={componentRef}>
      <h2>Order Details</h2>
      <div className="mb-3">
        <strong>Transaction ID:</strong> {transactionId}
      </div>
      <div className="mb-3">
        <strong>Amount:</strong> ${amount}
      </div>
      <div className="mb-3">
        <strong>Pickup Date:</strong> {pickupDate}
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
      {/* Render buttons based on state */}
      {buttonsVisible && (
        <>
          <button onClick={handlePrint} className="btn btn-primary d-print-none">Print Report</button>
          <Link to="/" className="btn btn-secondary ml-2 d-print-none">Home</Link>
        </>
      )}
    </div>
  );
};

export default OrderDetailsPage;
