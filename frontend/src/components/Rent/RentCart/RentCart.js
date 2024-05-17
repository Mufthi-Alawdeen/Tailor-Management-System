import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Inquiry/Contact Us/UserHeader';
import './RentCart.css';
import CartMenu from '../../Header/CartMenu';
import Swal from 'sweetalert2';

const RentCart = () => {
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userId = loggedInUser._id;
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchRentCartItems();
  }, []);

  useEffect(() => {
    const totalPrice = cartItems.reduce((total, item) => total + item.product.price, 0);
    setTotalPrice(totalPrice);
  }, [cartItems]);

  const fetchRentCartItems = async () => {
    try {
      const response = await axios.get(`http://localhost:8075/rentCart/${userId}`);
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching rent cart items:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8075/rentCart/delete/${itemId}`);
      setCartItems(cartItems.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  const handlePickupDateChange = (itemId, newPickupDate) => {
    const updatedCartItems = cartItems.map(item => {
      if (item._id === itemId) {
        return { ...item, pickupDate: newPickupDate };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Cart is empty',
        text: 'Please add items to your cart before proceeding to checkout.'
      });
    } else {
      navigate('/rentCheckout');
    }
  };

  const calculateReturnDate = (pickupDate) => {
    const returnDate = new Date(pickupDate);
    returnDate.setDate(returnDate.getDate() + 2); // Adding 2 days
    return returnDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  return (
    <div>
      <Header />
      <CartMenu />

      <div className="container">
        <h2 className="mt-4 mb-3">Rent Cart</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Pickup Date</th>
              <th>Return Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => {
              const { _id, product, pickupDate } = item;
              const returnDate = calculateReturnDate(pickupDate);
              return (
                <tr key={_id}>
                  <td className="align-middle">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={`data:image/jpeg;base64,${product.images[0]}`}
                        alt="Product"
                        style={{ width: '100px', height: 'auto' }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                    <p className="mb-0">{product.name}</p>
                  </td>
                  <td className="align-middle">${product.price.toFixed(2)}</td>
                  <td className="align-middle">
                    <input
                      type="date"
                      value={pickupDate} // Display the selected pickup date
                      onChange={e => handlePickupDateChange(_id, e.target.value)}
                    />
                  </td>
                  <td className="align-middle">{returnDate}</td>
                  <td className="align-middle">
                    <button className="btn btn-danger" onClick={() => handleDeleteItem(_id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="cart-footer">
          <div className="total-price mt-3">Total Price: ${totalPrice.toFixed(2)}</div>
          <button className="btn btn-success" onClick={handleCheckout}>Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default RentCart;
