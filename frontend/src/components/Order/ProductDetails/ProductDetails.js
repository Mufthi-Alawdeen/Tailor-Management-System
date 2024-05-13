import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import styles from './ProductDetails.module.css'; // Import CSS module
import '@fortawesome/fontawesome-free/css/all.css';

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const UserId = loggedInUser._id;
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [allReviews, setAllReviews] = useState([]);
    const [submittedMessage, setSubmittedMessage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchProductDetails();
    }, []);

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8075/order/products/${productId}`);
            setProduct(response.data);
            setAllReviews(response.data.ratings);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    const handleSubmitReview = async () => {
        try {
            const response = await axios.post(`http://localhost:8075/order/products/${productId}/reviews`, {
                review: review,
                starRating: rating,
                userId: UserId
            });
            console.log('Review submitted successfully:', response.data);
            // Fetch all reviews after submitting a review
            fetchProductDetails();
            // Show submitted message
            setSubmittedMessage('Rating submitted successfully!');
            // Clear review and rating inputs
            setReview('');
            setRating(0);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };
    

    const handleCustomizationRedirect = () => {
        if (product) {
            const { category } = product;
            switch (category) {
                case 'suit':
                    return `http://localhost:3000/order/customsuit/${productId}`;
                case 'shirt':
                    return `http://localhost:3000/order/customshirt/${productId}`;
                case 'trousers':
                    return `http://localhost:3000/order/customtrouser/${productId}`;
                case 'bow':
                    return null;
                case 'tie':
                    return null;
                default:
                    return '/';
            }
        }
    };

    const handleAddToCart = async () => {
        if (Object.keys(errors).length === 0) {
            try {
                // Send data to the backend using Axios
                const response = await axios.post('http://localhost:8075/order/products/cart/addaccess', {
                    userId: UserId,
                    productId: productId, // Include productId in the request body
                    quantity,
                });
                // Show success alert
                alert('Item added to cart!');
                // Refresh page
                window.location.reload();
            } catch (error) {
                console.error('Error: frontend', error);
            }
        } else {
            setErrors(errors);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={`${styles.heading} mt-5 mb-4`}>Product Details</h1>
            {submittedMessage && <div className={styles.submittedMessage}>{submittedMessage}</div>}
            {product && (
                <div className="row">
                    <div className="col-md-6">
                        <div id="productCarousel" className={`carousel slide ${styles.carousel}`} data-bs-ride="carousel">
                            <div className="carousel-inner">
                                {product.images.map((image, index) => (
                                    <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                                        <img src={`data:image/jpeg;base64,${image}`} className="d-block w-100" alt={`Product ${index}`} />
                                    </div>
                                ))}
                            </div>
                            <button className={`carousel-control-prev ${styles.controlPrev}`} type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                                <span className={`carousel-control-prev-icon ${styles.controlIcon}`} aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className={`carousel-control-next ${styles.controlNext}`} type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                                <span className={`carousel-control-next-icon ${styles.controlIcon}`} aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h2 className={`mb-3 ${styles.productName}`}>{product.name}</h2>
                        <p className={`mb-3 ${styles.price}`}>Price: ${product.price}</p>
                        <p className={`mb-3 ${styles.description}`}>Description: {product.description}</p>
                        {handleCustomizationRedirect() ? (
                            <Link to={handleCustomizationRedirect()} className={`${styles.customizationButton}`}>Customization</Link>
                        ) : (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Quantity:</label>
                                    <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
                                </div>
                                <button className={`${styles.addToCartButton} btn btn-primary`} onClick={handleAddToCart}>Add to Cart</button>
                            </>
                        )}
                    </div>
                </div>
            )}
            {/* HR Line */}
            <hr className={`${styles.hrLine} mt-5`} />
            {/* Review Section */}
            <div className="mt-4">
                <h3>Rating and Review</h3>
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Your Review"
                        value={review}
                        onChange={e => setReview(e.target.value)}
                    />
                </div>
                {/* Star Rating Component */}
                <div className={styles.starRating}>
                    <span>Rating: </span>
                    {[...Array(5)].map((_, index) => {
                        const value = index + 1;
                        return (
                            <span
                                key={index}
                                className={`btnrating btn btn-default btn-sm ${value <= rating ? 'btn-warning' : ''}`}
                                data-attr={value}
                                onClick={() => setRating(value)}
                            >
                                <i className={`fa fa-star ${value <= rating ? 'selected' : ''}`} aria-hidden="true"></i>
                            </span>
                        );
                    })}
                </div>
                <button className={`${styles.submitButton} btn btn-primary mt-3`} onClick={handleSubmitReview}>
                    Submit Review
                </button>
            </div>
            {/* Display All Reviews Section */}
            <div className="mt-4">
                <h3>All Reviews</h3>
                {allReviews.map((review, index) => (
                    <div key={index} className={`mb-3 ${styles.review}`}>
                        <p className={`${styles.userName}`}>Name: {review.user.FirstName}</p>
                        <p className={`${styles.rating}`}>Rating: {review.starRating}</p>
                        <p className={`${styles.reviewContent}`}>Review: {review.review}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductDetails;
