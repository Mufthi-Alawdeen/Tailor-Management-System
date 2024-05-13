import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CheckoutForm = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userObjectId = loggedInUser._id;
  const UserId = loggedInUser.UserID;
  const [transactionData, setTransactionData] = useState({
    paymentType: 'Credit Card',
    cardNumber: '',
    cardCVV: '',
    cardExpiryDate: ''
  });
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Fetch cart items using the user object ID
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
    // Calculate total amount based on cart items
    let total = 0;
    cartItems.forEach(item => {
      const itemTotal = item.quantity * item.product.price;
      total += itemTotal;
    });
    setTotalAmount(total);
  }, [cartItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Validations for Card Number (only numbers and maximum length of 16)
    if (name === 'cardNumber') {
      // Remove any non-digit characters from the value
      const newValue = value.replace(/\D/g, '');
  
      // Group the digits into sets of four with spaces
      const formattedValue = newValue.replace(/(.{4})/g, '$1 ').trim();
  
      // Enforce maximum length of 16 after formatting
      if (formattedValue.length > 19) {
        return; // Do not update state if card number exceeds maximum length
      }
  
      // Update the state with the formatted value
      setTransactionData(prevData => ({
        ...prevData,
        [name]: formattedValue
      }));
      return;
    }
  
    // Validations for CVV (only numbers and 3 length)
    if (name === 'cardCVV') {
      if (!/^\d{0,3}$/.test(value)) {
        return; // Do not update state if CVV doesn't match the pattern
      }
    }
  
    // Validations for Expiry Date (check if the expiry date is expired)
    if (name === 'cardExpiryDate') {
      const currentDate = new Date();
      const inputDate = new Date(value);
      if (inputDate < currentDate) {
        alert('Expiry date is expired.');
      }
    }
  
    // Update other fields as usual
    setTransactionData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Extracting only the required data to be sent to the backend
      const { cardNumber, cardExpiryDate } = transactionData;
  
      // Constructing the data object to be sent
      const postData = {
        userId: UserId,
        userObjectId: userObjectId,
        PaymentType: 'Credit Card',
        CardNo: cardNumber,
        CardExpDate: cardExpiryDate,
        Amount: totalAmount
      };
  
      // Log the transaction data before sending it to the backend
      console.log('Transaction Data before submitting:', postData);
  
      // Send POST request using axios
      const response = await axios.post('http://localhost:8075/order/createorder', postData);
  
      // Check if response is successful
      if (response.status === 201) {
        // Reset form fields after successful submission
        setTransactionData({
          paymentType: 'Credit Card',
          cardNumber: '',
          expiryDate: '',
        });
  
        // Optionally, you can handle the response from the backend here
        console.log('Response from backend:', response.data);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error:front:', error.message);
      // Handle error (e.g., display error message to the user)
    }
  };
  
   

  return (
    <div className="container mt-5">
      <h2>Checkout</h2><br />
      <div>Total Amount: ${totalAmount}</div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Card Number:</label>
          <input type="text" className="form-control" name="cardNumber" value={transactionData.cardNumber} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">CVV:</label>
          <input type="text" className="form-control" name="cardCVV" value={transactionData.cardCVV} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Expiry Date:</label>
          <input type="date" className="form-control" name="cardExpiryDate" value={transactionData.cardExpiryDate} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default CheckoutForm;
