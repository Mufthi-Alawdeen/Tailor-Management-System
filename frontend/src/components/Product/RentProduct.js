// rentproduct.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RentProduct = () => {
  const [rentProducts, setRentProducts] = useState([]);

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

  return (
    <div>
      <h2>Rent Products</h2>
      <div className="products-container">
        {rentProducts.map((product, index) => (
          <div key={index} className="product">
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Description: {product.description}</p>
            <p>Category: {product.category}</p>
            <p>Type: {product.type}</p>
            <p>Size:{product.size}</p>
            
            <div className="images">
              {product.images && product.images.length > 0 && (
                product.images.slice(0, 5).map((image, i) => (
                  <img key={i} src={`data:image/jpeg;base64,${image}`} alt="Product Image" />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentProduct;
