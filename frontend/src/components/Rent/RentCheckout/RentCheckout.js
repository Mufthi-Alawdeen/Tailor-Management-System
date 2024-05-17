import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

export const generateRentID = () => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const randomNumber = Math.floor(100 + Math.random() * 900);
  return `${year}${month}${day}MR${randomNumber}`;
};

const RentCheckout = () => {
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
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:8075/rentCart/${userObjectId}`);
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
    const total = cartItems.reduce((total, item) => total + item.product.price, 0);
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

    if (name === 'cardCVV' && !/^\d{0,3}$/.test(value)) {
      return;
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
      const generateTransactionID = () => {
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        return `MT${randomNumber}`;
      };
  
      const { cardNumber, cardExpiryDate, cardCVV } = transactionData;
      const transactionID = generateTransactionID();
  
      const postData = {
        TransactionID: transactionID,
        Amount: totalAmount,
        PaymentType: 'Online',
        CardNo: cardNumber,
        CardCVVno: cardCVV,
        CardExpDate: cardExpiryDate,
        TransDate: new Date().toISOString()
      };
  
      console.log('Transaction Data before submitting:', postData);
  
      const response = await axios.post('http://localhost:8075/transaction/addTransaction', postData);
  
      if (response.status === 200) {
        for (const item of cartItems) {
          const rentID = generateRentID();
  
          const rentData = {
            RentID: rentID,
            UserID: UserId,
            ProductID: item.product._id,
            ProductName: item.product.name,
            PickupDate: new Date().toISOString(),
            ReturnDate: new Date().toISOString(), // You need to specify the actual return date
            Status: 'Pending', // Set status according to your requirement
            Type: 'Online', // Set type according to your requirement
            Amount: item.product.price,
            TransactionID: transactionID
          };
  
          // Add rent data
          const rentResponse = await axios.post('http://localhost:8075/rent/addRent', rentData);
          if (rentResponse.status !== 200) {
            throw new Error('Failed to create rent');
          }
  
          console.log('Rent created successfully:', rentResponse.data);
        }

        // Clear the cart
        await axios.delete(`http://localhost:8075/rentCart/clearCart/${userObjectId}`);

        // Generate and download the invoice as a PDF
        const invoiceData = {
          user: loggedInUser,
          transaction: postData,
          cartItems: cartItems
        };
        generateInvoice(invoiceData);

        setTransactionData({
          paymentType: 'Credit Card',
          cardNumber: '',
          cardCVV: '',
          cardExpiryDate: ''
        });
  
        console.log('Response from backend:', response.data);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const generateInvoice = (invoiceData) => {
    const { user, transaction, cartItems } = invoiceData;

    const invoiceHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
        <h2 style="text-align: center;">Invoice</h2>
        <p><strong>User:</strong> ${user.username}</p>
        <p><strong>Transaction ID:</strong> ${transaction.TransactionID}</p>
        <p><strong>Transaction Date:</strong> ${new Date(transaction.TransDate).toLocaleDateString()}</p>
        <h3>Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Pickup Date</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Return Date</th>
            </tr>
          </thead>
          <tbody>
            ${cartItems.map(item => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.product.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">$${item.product.price.toFixed(2)}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${new Date(item.pickupDate).toLocaleDateString()}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${new Date(item.returnDate).toLocaleDateString()}</td>
              </tr>`).join('')}
          </tbody>
        </table>
        <p><strong>Total Amount:</strong> $${transaction.Amount.toFixed(2)}</p>
        <p style="color: red; font-weight: bold;">Please pick up your items from the store on the pickup date and keep your NIC at the store until returning the products.</p>
      </div>
    `;

    const options = {
      margin: 1,
      filename: 'invoice.pdf',
      html2canvas: {},
      jsPDF: { orientation: 'portrait' }
    };

    html2pdf().from(invoiceHtml).set(options).save();
  };

  return (
    <div className="container mt-5">
      <h2>Checkout</h2><br />
      <div>Total Amount: ${totalAmount.toFixed(2)}</div>
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

export default RentCheckout;
