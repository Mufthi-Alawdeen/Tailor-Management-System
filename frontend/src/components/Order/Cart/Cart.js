import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';
import Header from '../../Inquiry/Contact Us/UserHeader';

const Cart = () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const UserId = loggedInUser ? loggedInUser._id : null;
    const [cartItems, setCartItems] = useState([]);
    const [updatedQuantity, setUpdatedQuantity] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [updateMessage, setUpdateMessage] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");

    useEffect(() => {
        if (!loggedInUser) {
            window.location.href = "/signup";
            return;
        }
        // Fetch cart items when the component mounts
        fetchCartItems();
    }, []);

    useEffect(() => {
        // Calculate total price whenever cart items or updated quantities change
        const totalPrice = cartItems.reduce((total, item) => {
            const quantity = updatedQuantity[item._id] || item.quantity;
            return total + item.product.price * quantity;
        }, 0);
        setTotalPrice(totalPrice);
    }, [cartItems, updatedQuantity]);

    const fetchCartItems = () => {
        axios.get(`http://localhost:8075/order/carts/${UserId}`)
            .then(response => {
                // Handle successful response
                setCartItems(response.data);
            })
            .catch(error => {
                // Handle error
                console.error('Error fetching cart items:', error);
            });
    };

    const handleUpdateClick = (id, change) => {
        const currentQuantity = updatedQuantity[id] || cartItems.find(item => item._id === id).quantity;
        const newQuantity = currentQuantity + change;
        setUpdatedQuantity({ ...updatedQuantity, [id]: newQuantity });
        setUpdateMessage(`Quantity updated for ${cartItems.find(item => item._id === id).product.name}`);
        
        // Clear update message after 3 seconds
        setTimeout(() => {
            setUpdateMessage("");
        }, 3000);
    };

    const handleDeleteItem = (id) => {
        // Make a DELETE request to delete the cart item
        axios.delete(`http://localhost:8075/order/carts/${id}`)
            .then(response => {
                // Remove the deleted item from the state
                setCartItems(cartItems.filter(item => item._id !== id));
                setDeleteMessage("Item deleted successfully");

                // Clear delete message after 3 seconds
                setTimeout(() => {
                    setDeleteMessage("");
                }, 3000);
            })
            .catch(error => {
                // Handle error
                console.error('Error deleting cart item:', error);
            });
    };

    const handleCheckout = () => {
        console.log('Checkout clicked');
        window.location.href = "/order/Checkout";
    };

    return (
        <div>
            <Header />

            <div className="container">
                <h2 className="mt-4 mb-3">Cart Items</h2>
                {updateMessage && <div className="alert alert-success">{updateMessage}</div>}
                {deleteMessage && <div className="alert alert-success">{deleteMessage}</div>}
                <table className="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(item => {
                            const { product } = item; // Access product from cart item
                            return (
                                <tr key={item._id}>
                                    <td className="align-middle">
                                        <img 
                                            src={`data:image/jpeg;base64,${product.images}`} 
                                            alt="Product" 
                                            style={{ width: '100px', height: 'auto' }} 
                                        />
                                        <p className="mb-0"style={{margin: '10px'}}>{product.name}</p>
                                    </td>
                                    <td className="align-middle">${product.price.toFixed(2)}</td>
                                    <td className="align-middle">
                                        <div className="btn-group" role="group">
                                            <button 
                                                type="button" 
                                                className="btn btn-secondary" 
                                                onClick={() => handleUpdateClick(item._id, -1)}
                                            >
                                                -
                                            </button>
                                            <span className="btn" style={{ backgroundColor: '#bf1e2d' }}>{updatedQuantity[item._id] || item.quantity}</span>
                                            <button 
                                                type="button" 
                                                className="btn btn-secondary" 
                                                onClick={() => handleUpdateClick(item._id, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="align-middle">${(product.price * (updatedQuantity[item._id] || item.quantity)).toFixed(2)}</td>
                                    <td className="align-middle">
                                        <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="cart-footer">
                    <table className='carttot'>
                        <tr>
                            <th>Cart Total</th>
                        </tr>
                        <tr>
                            <td>
                            <div className="total-price mt-3"><span className='totprice'>Total Price: </span><span className='totdata'>${totalPrice.toFixed(2)}</span></div>
                            <hr></hr>
                            <button onClick={handleCheckout} className="btn btn-success">Checkout</button>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Cart;
