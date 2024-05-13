// buyproduct.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BuyProduct = () => {
  const [buyProducts, setBuyProducts] = useState([]);

  useEffect(() => {
    const fetchBuyProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/product/buyproducts");
        setBuyProducts(response.data);
      } catch (error) {
        console.error("Error fetching buy products:", error);
      }
    };

    fetchBuyProducts();
  }, []);

  return (
    <div>
      <h2>Buy Products</h2>
      <div className="products-container">
        {buyProducts.map((product, index) => (
          <div key={index} className="product">
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Description: {product.description}</p>
            <p>Category: {product.category}</p>
            <p>Type: {product.type}</p>
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

export default BuyProduct;
