import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Inquiry/Contact Us/UserHeader'; // Import your Header component
import { Link } from 'react-router-dom';
import cardImage from "../../res/card-image.jpg";

const RentList = () => {
  const [rentProducts, setRentProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchRentProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8075/product/rentproducts");
        setRentProducts(response.data);
      } catch (error) {
        console.error("Error fetching rent products:", error);
      }
    };

    fetchRentProducts();
  }, []);

  const filteredProducts = rentProducts.filter((product) => {
    const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const withinPriceRange = (!minPrice || product.price >= minPrice) && (!maxPrice || product.price <= maxPrice);
    return matchesSearchTerm && withinPriceRange;
  });

  return (
    <div>
      <Header />
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-lg-12 p-0">
            <div className="card bg-dark text-white" style={{ height: "100vh", position: "relative" }}>
              <img className="card-img" src={cardImage} alt="Rent card" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
              <div className="card-img-overlay d-flex flex-column justify-content-end">
                <div className="align-text-left">
                  <p className="text-left" style={{ fontSize: "48px", fontWeight: "bold", color: "#FFFFFF" }}>
                    Discover Exquisite<br />
                    Pieces for Every<br />
                    Occasion
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br/>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title" style={{ color: "#000000" }}>Filters</h5>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label style={{ color: "#000000" }}>Price Range:</label>
                  <input type="number" className="form-control" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                  <input type="number" className="form-control" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-9 mb-4">
            <div className="row">
              {filteredProducts.map((product, index) => (
                <div key={index} className="col-lg-4 mb-4">
                  <Link to={`http://localhost:3000/product/${product._id}`} style={{ textDecoration: 'none' }}>
                    <div className="card h-100">
                      <img className="card-img-top" src={`data:image/jpeg;base64,${product.images[0]}`} alt="Product" style={{ height: '300px', objectFit: 'cover' }} />
                      <div className="card-body">
                        <h5 className="card-title" style={{ color: "#000000" }}>{product.name}</h5>
                        <p className="card-text" style={{ color: "#000000" }}>Description: {product.description}</p>
                        <p className="card-text" style={{ color: "#000000" }}>Price: ${product.price}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentList;