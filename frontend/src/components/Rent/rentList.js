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
      <br />
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
                  <label style={{ color: "#000000" , marginBottom: "10px" }}>Price Range:</label>
                  
                  <input type="number" className="form-control" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                  <br />
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
                        <p className="card-text" style={{ color: "#000000" }}>LKR {product.price}.00</p>
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