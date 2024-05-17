import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCcMastercard, FaCcVisa, FaArrowLeft } from 'react-icons/fa';
import './Checkout.css';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userObjectId = loggedInUser ? loggedInUser._id : null;
  const UserId = loggedInUser ? loggedInUser.UserID : null;
  const [transactionData, setTransactionData] = useState({
    paymentType: 'Credit Card',
    cardNumber: '',
    cardCVV: '',
    cardExpiryDate: ''
  });
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (!loggedInUser) {
      window.location.href = "/login";
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:8075/order/carts/${userObjectId}`);
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    if (userObjectId) {
      fetchCartItems();
    }
  }, [userObjectId]);

  useEffect(() => {
    let total = 0;
    cartItems.forEach(item => {
      const itemTotal = item.quantity * item.product.price;
      total += itemTotal;
    });
    setTotalAmount(total);
  }, [cartItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const newValue = value.replace(/\D/g, '');
      const formattedValue = newValue.replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) {
        return;
      }
      setTransactionData(prevData => ({
        ...prevData,
        [name]: formattedValue
      }));
      return;
    }

    if (name === 'cardCVV') {
      if (!/^\d{0,3}$/.test(value)) {
        return;
      }
    }

    if (name === 'cardExpiryDate') {
      const currentDate = new Date();
      const inputDate = new Date(value);
      if (inputDate < currentDate) {
        alert('Expiry date is expired.');
      }
    }

    setTransactionData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { cardNumber, cardExpiryDate } = transactionData;
      const postData = {
        userId: UserId,
        userObjectId: userObjectId,
        PaymentType: 'Credit Card',
        CardNo: cardNumber,
        CardExpDate: cardExpiryDate,
        Amount: totalAmount
      };

      console.log('Transaction Data before submitting:', postData);

      const response = await axios.post('http://localhost:8075/order/createorder', postData);

      console.log('Response from backend:', response.data);

      if (response.status === 201) {
        setTransactionData({
          paymentType: 'Credit Card',
          cardNumber: '',
          cardCVV: '',
          cardExpiryDate: ''
        });

        navigate('/order/orderdetails', {
          state: {
            orders: response.data.orders,
            transactionId: response.data.transaction.TransactionID,
            amount: totalAmount,
          }
        });
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className='maincont card'>
      <button
        className="btn-back"
        onClick={handleBackClick}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'black',
          color: 'white',
          padding: '10px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <FaArrowLeft style={{ marginRight: '5px' }} />
      </button>
      <div className="container" id='containercheck'>
        <h2>Checkout</h2><br />
        <div>Total Amount: {totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}</div><br />
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Card Number:</label>
            <input type="text" className="form-control" name="cardNumber" value={transactionData.cardNumber} onChange={handleChange} placeholder="Enter card number" required />
            <div className="mt-2">
              <label className="form-label">Card Type:</label><br />
              <FaCcVisa size={40} color="#1a1aff" style={{ marginRight: '10px' }} />
              <FaCcMastercard size={40} color="#ff4d4d" />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">CVV:</label>
            <input type="text" className="form-control" name="cardCVV" value={transactionData.cardCVV} onChange={handleChange} placeholder="Enter CVV" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Expiry Date:</label>
            <input type="date" className="form-control" name="cardExpiryDate" value={transactionData.cardExpiryDate} onChange={handleChange} placeholder="MM/YYYY" required />
          </div>
          <button type="submit" className="btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
