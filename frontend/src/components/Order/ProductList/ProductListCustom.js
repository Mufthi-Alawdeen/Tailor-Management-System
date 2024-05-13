import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Header from '../../Inquiry/Contact Us/UserHeader'; // Import your Header component
import Carousel from 'react-bootstrap/Carousel'; // Import Carousel component from Bootstrap
import { Link } from 'react-router-dom';
import './ProductCustom.css'; // Import CSS for styling

const ProductListCustom = () => {
    const [carouselImages, setCarouselImages] = useState([]);

    useEffect(() => {
        fetchCarouselImages();
    }, []);

    const fetchCarouselImages = async () => {
        try {
            const response = await axios.get('http://localhost:8075/order/carousel-images');
            // Filter out only the images we need: first-slide.jpg, second-slide.jpg, third-slide.jpg
            const filteredImages = response.data.filter(image =>
                ['first-slide.jpg', 'second-slide.jpg', 'third-slide.jpg'].includes(image.filename)
            );
            setCarouselImages(filteredImages);
        } catch (error) {
            console.error('Error fetching carousel images:', error);
        }
    };


    return (
        <div>
            <Header />

            <div className="container mt-4">
                {/* Carousel */}
                <Carousel>
                    {carouselImages.slice(0, 3).map((image, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100"
                                src={`http://localhost:8075/images/${image.filename}`}
                                alt={`Slide ${index + 1}`}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>


                {/* Horizontal tiles */}
                <div className="row mt-4">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Suits</h5>
                                <p className="card-text">Elevate your style with a meticulously tailored custom suit designed to fit you perfectly.</p>
                                <Link to="/productlistsuit/buyproducts" className="shop-btn">Shop</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Shirts</h5>
                                <p className="card-text">Experience the epitome of sartorial elegance with our custom shirts tailored to your exact measurements and preferences.</p>
                                <Link to="/productlistshirt/buyproducts" className="shop-btn">Shop</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Trousers</h5>
                                <p className="card-text">Elevate your wardrobe with our custom trousers meticulously crafted to fit you flawlessly.</p>
                                <Link to="/productlisttrouser/buyproducts" className="shop-btn">Shop</Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductListCustom;
