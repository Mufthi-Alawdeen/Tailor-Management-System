import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Header from '../Header';
import styles from "./ProductUpload.module.css";
import LoadingMessage from "../LoadingMessage";

const ProductUpload = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    type: "",
    images: [],
    size: "" // String for sizes separated by commas or spaces
  });
  const [loading, setLoading] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');
  const [buttonColor, setButtonColor] = useState('#524A4E');
  const [currentColor, setCurrentColor] = useState('#FF342B');
  
  const [isListening, setIsListening] = useState(false); 
  // Function to parse voice command and redirect accordingly
  const handleVoiceCommand = (command) => {
    let responseText = '';
    switch (command) {
      default:
        responseText = "Sorry, You have to upload manually.";
        break;
    }
    // Speak the response text
    speak(responseText);
  };
  

// Function to start or stop voice recognition
const toggleVoiceRecognition = () => {
    if (isListening) {
        // Stop voice recognition
        setIsListening(false);
    } else {
        // Start voice recognition
        setIsListening(true);
        const recognition = new window.webkitSpeechRecognition();
        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript.toLowerCase();
            setVoiceCommand(result);
            handleVoiceCommand(result);
            setIsListening(false); // Turn off microphone after task is completed
        };
        recognition.start();
    }
};

// Function to speak the given text
const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: [...formData.images, ...e.target.files] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (
  formData.images.length < 4 ||
  !formData.name ||
  !formData.price ||
  !formData.category ||
  !formData.type ||
  !formData.description ||
  formData.images.length === 0
) {
  Swal.fire({
    icon: "error",
    title: "Validation Error",
    text:
      "Please select at least 4 images, fill all required fields, and upload at least one image.",
    confirmButtonColor: "#000000",
  });
  return;
}

// If category is "tie" or "bow", remove the Size field from the required fields
const requiredFields = ["name", "price", "category", "type", "description"];
if (formData.category !== "tie" && formData.category !== "bow") {
  requiredFields.push("size");
}

// Check if all required fields are filled
for (const field of requiredFields) {
  if (field === "size" && (formData.category === "tie" || formData.category === "bow")) {
    // Skip size validation if category is "tie" or "bow"
    continue;
  }

  if (!formData[field]) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: `Please fill ${field} field.`,
      confirmButtonColor: "#000000",
    });
    return;
  }
}
  
    try {
      setLoading(true);
  
      const formDataWithImages = new FormData();
      for (let key in formData) {
        if (key === "images") {
          formData[key].forEach((file) => {
            formDataWithImages.append("images", file);
          });
        } else if (key === "size") {
          // Split the size string into an array of sizes
          formDataWithImages.append(key, formData[key].split(/\s*,\s*|\s+/));
        } else {
          formDataWithImages.append(key, formData[key]);
        }
      }
  
      await axios.post("http://localhost:8075/product/add", formDataWithImages, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      setLoading(false);
  
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Product uploaded successfully!",
        confirmButtonColor: "#000000",
      });
  
      // Reset form data and file inputs after successful submission
      setTimeout(() => {
        setFormData({
          name: "",
          price: "",
          description: "",
          category: "",
          type: "",
          images: [],
          size: "",
        });
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input) => {
          input.value = null;
        });
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error("Error uploading product:", error);
    }
  };
  

  const handleClear = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      type: "",
      images: [],
      size: ""
    });
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.value = null;
    });
  };

  return (
    <div>
      <Header />
      <div className={styles.heading}>
        <h1>Add products</h1>
      </div>
      <div>
        
      <button
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '6px 10px',
                    gap: '8px',
                    height: '30px',
                    width: '100px',
                    border: 'none',
                    background: isListening ? 'black' : buttonColor, // Change color to red when listening
                    borderRadius: '20px',
                    cursor: 'pointer',
                    animation: 'scale 1s infinite', // Apply animation
                    transition: 'background-color 0.3s' // Apply transition
                }}
                onClick={toggleVoiceRecognition}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    viewBox="0 0 24 24"
                    height="24"
                    fill="none"
                    className="svg-icon"
                    style={{ stroke: '#ffff' }}
                >
                    <g strokeWidth="2" strokeLinecap="round">
                        <rect y="3" x="9" width="6" rx="3" height="11"></rect>
                        <path d="m12 18v3"></path>
                        <path d="m8 21h8"></path>
                        <path d="m19 11c0 3.866-3.134 7-7 7-3.86599 0-7-3.134-7-7"></path>
                    </g>
                </svg>
                <span
                    className="label"
                    style={{
                        lineHeight: '20px',
                        fontSize: '17px',
                        color: currentColor,
                        fontFamily: 'sans-serif',
                        letterSpacing: '1px'
                    }}
                >
                    Speak
                </span>
            </button>
      </div>
      <div className={styles.container}>
        <div className={styles.uploadImages}>
          <h2>Upload Images</h2>
          <div>
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index}>
                <label htmlFor={`image${index}`}>Image {index}:</label>
                <input
                  type="file"
                  className={styles.uploadInputFirst}
                  id={`image${index}`}
                  name={`image${index}`}
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.productDetails}>
          <h2>Product Details</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter product name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
            />
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
                  <option value="">Select Type</option>
                  <option value="rent">Rent</option>
                  <option value="buy">Buy</option>
                </select>
              </div>
              <div className={styles.inputWrapper} style={{ marginLeft: '20px' }}>
                <label style={{ marginLeft: '-30px' }} htmlFor="category">Category:</label>
                <select
                  id="category"
                  name="category"
                  className={styles.input}
                  value={formData.category}
                  onChange={handleChange}
                  style={{ marginLeft: '-30px' }}
                >
                  <option value="">Select Category</option>
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
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Enter product price"
              className={styles.input}
              value={formData.price}
              onChange={handleChange}
            />
           <label htmlFor="size">Size:</label>
<input
  type="text"
  id="size"
  name="size"
  placeholder={
    formData.category === "bow" || formData.category === "tie"
      ? "Size (optional)"
      : "Enter sizes (e.g., 32, 34, 36)"
  }
  className={styles.input}
  value={formData.size}
  onChange={handleChange}
  disabled={formData.category === "bow" || formData.category === "tie"}
/>

            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter product description"
              className={styles.textarea}
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            <div className={styles.buttons}>
              <button type="submit" className={styles.submitButton} disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
              <button type="button" onClick={handleClear} className={styles.cancelButton}>Cancel</button>
            </div>
            <br/>
          </form>
        </div>
      </div>
      {loading && <LoadingMessage />}
    </div>
  );
};

export default ProductUpload;
