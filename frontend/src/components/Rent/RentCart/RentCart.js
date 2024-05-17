import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../Inquiry/Contact Us/UserHeader';
import './RentCart.css';
import CartMenu from '../../Header/CartMenu';

const RentCart = () => {
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
              const { _id, product, pickupDate, returnDate } = item;
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
                  <td className="align-middle">{pickupDate}</td>
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
          <Link to="/rentCheckout" className="btn btn-success">Checkout</Link>
        </div>
      </div>
    </div>
  );
}

export default RentCart;
