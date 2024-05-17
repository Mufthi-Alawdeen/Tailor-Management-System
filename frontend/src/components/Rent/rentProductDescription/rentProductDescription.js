import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../Inquiry/Contact Us/UserHeader';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Swal from 'sweetalert2';
import '../rentProductDescription/rentProductDescription.css'; // Import CSS file for custom styles

const RentProductDescription = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8075/product/rentproducts/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError('Error fetching product');
      }
    };
  
    fetchProduct();
  }, [productId]);

  const handlePickupDateChange = (date) => {
    setPickupDate(date);
    const returnDateObj = new Date(date);
    returnDateObj.setDate(returnDateObj.getDate() + 2); // Set return date 2 days after pickup date
    setReturnDate(returnDateObj.toISOString().split('T')[0]); // Format return date as YYYY-MM-DD
  };

  const handleAddToCart = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const userId = loggedInUser._id;
      await axios.post('http://localhost:8075/rentCart/add', {
        userId: userId,
        productId: productId,
        description: description,
        pickupDate: pickupDate,
        returnDate: returnDate
      });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product added to cart successfully',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setError('Error adding product to cart');
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <Header />
      <br/>
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <Slider {...settings}>
              {product.images.map((image, index) => (
                <div key={index}>
                  <img src={`data:image/jpeg;base64,${image}`} alt={`Product ${index + 1}`} className="img-fluid" />
                </div>
              ))}
            </Slider>
          </div>
          <div className="col-md-4">
            <div className="product-details">
              <h2>{product.name}</h2>
              <p>Description: {product.description}</p>
              <p style={{fontSize: '20px' , fontWeight:'bold'}}>LKR {product.price}.00</p>
              <div className="form-group">
                <label htmlFor="startDate">PickUp Date:</label>
                <input type="date" id="startDate" name="startDate" className="form-control" value={pickupDate} min={today} onChange={(e) => handlePickupDateChange(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">Return Date:</label>
                <input type="date" id="endDate" name="endDate" className="form-control" value={returnDate} min={pickupDate} readOnly={!!returnDate} />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Renting purpose"></textarea>
              </div>
              {error && <p className="text-danger">{error}</p>}
              <div>
                <button className="btn btn-dark btn-block" onClick={handleAddToCart} style={{ backgroundColor: '#000000', borderRadius: '0px' }}>Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentProductDescription;
