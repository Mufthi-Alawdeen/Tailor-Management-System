import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from './Editproduct.module.css';
import Swal from "sweetalert2";
import Header from '../Header';
import LoadingMessage from "../LoadingMessage";

const EditProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    type: "",
    size: "",
    images: [] // Initialize images as an empty array
  });
  const [initialFormData, setInitialFormData] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8075/product/${productId}`);
        setProduct(response.data);
        setFormData({
          name: response.data.name,
          price: response.data.price,
          description: response.data.description,
          category: response.data.category,
          type: response.data.type,
          size: response.data.size, // Set size in formData
          images: response.data.images // Set images in formData
        });
        setInitialFormData({
          name: response.data.name,
          price: response.data.price,
          description: response.data.description,
          category: response.data.category,
          type: response.data.type,
          size: response.data.size, // Set size in initialFormData
          images: response.data.images // Set images in initialFormData
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setFormData({ ...formData, images: selectedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading when form is submitted
    
    // Validation
    if (!formData.name || formData.price <= 0 || !formData.category || !formData.type || !formData.size) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill all required fields and ensure price is a positive number.",
        confirmButtonColor: "#000000" 
      });
      setIsLoading(false); // Stop loading after validation error
      return;
    }
  
    // Check if at least 4 images are selected
    if (formData.images.length < 4) {
      Swal.fire({
        icon: "error",
        title: "Image Selection Error",
        text: "Please select at least 4 images.",
        confirmButtonColor: "#000000" 
      });
      setIsLoading(false); // Stop loading after image selection error
      return;
    }
  
    // Check if formData is the same as initialFormData
    const isFormDataChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    const isImageChanged = JSON.stringify(formData.images) !== JSON.stringify(initialFormData.images);
    
    // If formData is unchanged, display message and return
    if (!isFormDataChanged) {
      Swal.fire({
        icon: "info",
        title: "No Changes",
        text: "No changes were made.",
        confirmButtonColor: "#000000" // Black color for confirm button
      });
      setIsLoading(false); // Stop loading after no changes made
      return;
    }
  
    // If formData is changed but images remain unchanged, display alert
    if (!isImageChanged) {
      Swal.fire({
        icon: "warning",
        title: "Image Update Required",
        text: "According to company policy, please update the images along with other changes.",
        confirmButtonColor: "#000000" // Black color for confirm button
      });
      setIsLoading(false); // Stop loading after image update alert
      return;
    }
  
    try {
      const formDataWithImages = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images") {
          value.forEach((image) => {
            formDataWithImages.append("images", image);
          });
        } else {
          formDataWithImages.append(key, value);
        }
      });
  
      await axios.patch(`http://localhost:8075/product/update/${productId}`, formDataWithImages, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
  
      console.log("Product updated!");
  
      // SweetAlert for successful upload
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Product updated successfully!",
        confirmButtonColor: "#000000" // Black color for confirm button
      }).then(() => {
        // Reload the page after success message
        window.location.reload();
      });
  
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false); // Stop loading after form submission completes
    }
  };
  

  const handleClear = () => {
    setFormData({ ...initialFormData });
  };

  return (
    <div> 
      <div>
        <Header/>
      </div>
      <div className={styles.heading}> 
        <h1>Edit products</h1>
      </div>
      <div className={styles.container}>
        <div className={`${styles.uploadImages} ${styles.imageContainer}`}>
             {/* Render loading spinner when isLoading is true */}
             {isLoading && <LoadingMessage />}
          <h2 className={styles.imageTitle}>Images</h2>
          {product.images && product.images.length > 0 ? (
            <div className={styles.imageGrid}>
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={`data:image/jpeg;base64,${image}`}
                  alt={`Product Image ${index + 1}`}
                  style={index === 0 ?  { marginLeft: '25px', width: '500px' } : {  width: '100px'  }}
                  className={`${styles.productImage} ${index >= 1 && index <= 4 ? styles.productImage1 : ""}`}
                />
              ))}
            </div>
          ) : (
            <p className={styles.noImagesMessage}>No images found</p>
          )}
        </div>
        <div className={styles.productDetails}>
          <h2>Product Details</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputRow}>
              <div className={styles.label}>
                <label>Name:</label>
              </div>
              <div className={styles.input}>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={styles.inputField} />
              </div>
            </div>
          <div className={styles.inlineInputs}>
  <div className={styles.inputWrapper}>
    <label htmlFor="type">Type:</label>
    <select
      id="type"
      name="type"
      className={styles.input}
      value={formData.type}
      onChange={handleChange}
    >
      <option value={formData.type}>{formData.type}</option>
      <option value="rent">Rent</option>
      <option value="buy">Buy</option>
    </select>
  </div>

  <div className={styles.inputWrapper} style={{ marginLeft: '20px' }}>
    <label  style={{ marginLeft: '-30px' }}htmlFor="category">Category:</label>
    <select
      id="category"
      name="category"
      className={styles.input}
      value={formData.category}
      onChange={handleChange}
      style={{ marginLeft: '-30px' }}
      disabled={formData.type === "rent"} // Disable category selection if type is rent
    >
      {formData.type === "rent" ? ( // Render options based on type
        <option value="suit">Suit</option>
      ) : (
        <>
          <option value="suit">Suit</option>
          <option value="shirt">Shirt</option>
          <option value="trousers">Trousers</option>
          <option value="tie">Tie</option>
           <option value="bow">Bow</option>
        </>
      )}
    </select>
  </div>
</div>

            <div className={styles.inputRow}>
              <div className={styles.label}>
                <label>Size:</label>
              </div>
              <div className={styles.input}>
                <input type="text" name="size" value={formData.size} onChange={handleChange} className={styles.inputField} />
              </div>
            </div>
            <div className={styles.inputRow}>
              <div className={styles.label}>
                <label>Description:</label>
              </div>
              <div className={styles.input}>
                <textarea name="description" value={formData.description} onChange={handleChange} className={styles.inputField}></textarea>
              </div>
            </div>
            <div className={styles.inputRow}>
              <div className={styles.label}>
                <label>Price:</label>
              </div>
              <div className={styles.input}>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className={styles.inputField} />
              </div>
            </div>
            {/* Add file input for updating images */}
            <div className={styles.inputRow}>
              <div className={styles.label}>
                <label>Update Images:</label>
              </div>
              
              
              <div className={styles.uploadImages}>
                <input type="file" name="images" onChange={handleImageChange} multiple className={styles.inputField} />
              </div>
            </div>
            <div className={styles.buttons}>
            <br/>
              <button type="submit" className={styles.submitButton}>Update</button>
              <button type="button" onClick={handleClear} className={styles.cancelButton}>Cancel</button>
            </div>
            <br></br>
            <br></br>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
