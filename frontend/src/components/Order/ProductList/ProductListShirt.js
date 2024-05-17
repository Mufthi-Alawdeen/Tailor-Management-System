import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './ProductList.module.css'; // Import CSS module
import Header from "../../Inquiry/Contact Us/UserHeader";
import Footer from "../../Inquiry/Contact Us/UserFooter";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8075/order/buyproducts/shirts');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!minPrice || product.price >= minPrice) &&
      (!maxPrice || product.price <= maxPrice)
    );
  });

  return (
    <div>
      <Header />
    
    <div className={styles.container}>
    <h2 className="h2 text-center">Custom Shirts</h2>
      <div className="row mt-4">
        <div className="col">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="number"
            className="form-control mb-3"
            placeholder="Min Price"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="number"
            className="form-control mb-3"
            placeholder="Max Price"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        {filteredProducts.map(product => (
          <div className={`col-md-4 mb-4 ${styles.productCard}`} key={product._id}>
            <div className={`card ${styles.cardWithHover} shadow`}>
              <Link to={`http://localhost:3000/order/products/${product._id}`} className={styles.link}>
                <div className={styles.imageWrapper}>
                  <img
                    src={`data:image/jpeg;base64,${product.images[0]}`}
                    className={`card-img-top ${styles.cardImage}`}
                    alt={product.name}
                  />
                </div>
                <div className="card-body">
                  <h5 className={`card-title ${styles.cardTitle}`}>{product.name}</h5>
                  <p className={`card-text ${styles.cardText}`}>{product.price.toLocaleString('en-US', { style: 'currency', currency: 'LKR' })}</p>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default ProductList;
