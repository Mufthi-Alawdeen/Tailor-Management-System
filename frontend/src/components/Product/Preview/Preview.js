
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from './Productlist.module.css';
import Swal from 'sweetalert2';
import Header from "../Header";
import React, { useState, useEffect, useRef } from 'react';
import MSRLogo from '../../../res/MSRLogo.png';
import SideBar from "../Sidebar";

const PAGE_SIZE = 12; // Number of products per page

const Preview = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false); // State to track if microphone is active
  const [buttonColor, setButtonColor] = useState('#524A4E'); // Button color
  const [currentColor, setCurrentColor] = useState('#FF342B');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8075/product/all");
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filteredProducts with all products
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (productId) => {
    navigate(`/product/editproduct/${productId}`);
    console.log("Editing product with ID:", productId);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = (productId, productName) => {
    Swal.fire({
      title: `Delete ${productName}?`,
      text: "Are you sure you want to delete this product?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8075/product/delete/${productId}`)
          .then(() => {
            Swal.fire(
              'Deleted!',
              `Product "${productName}" has been deleted.`,
              'success'
            );
            // Optionally, you can refresh the product list after deletion
            // Fetch products again or update the state
            setTimeout(() => {
              window.location.reload();
            }, 3000); // Adjust the time interval as needed
          })
          .catch(error => {
            console.error("Error deleting product:", error);
            Swal.fire(
              'Error!',
              `Failed to delete product "${productName}". Please try again.`,
              'error'
            );
          });
      }
    });
  }
  const handleVoiceDelete = (command) => {
    const productName = command.toLowerCase().replace('delete', '').trim();
    const productToDelete = products.find(product => product.name.toLowerCase() === productName);
    if (productToDelete) {
      handleDelete(productToDelete._id, productName);
    } else {
      const responseText = `Sorry, there is no product named ${productName}. Please try again.`;
      speak(responseText);
    }
  };

  const startVoiceRecognition = () => {
    setIsListening(prevState => !prevState); // Toggle the isListening state
    const recognition = new window.webkitSpeechRecognition();
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript.toLowerCase();
      if (result.includes('delete')) {
        handleVoiceDelete(result);
      } else {
        handleVoiceCommand(result);
      }
    };
    recognition.start();
  };

  // Function to speak the given text
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handleVoiceCommand = (command) => {
    let responseText = '';
    const productName = command.toLowerCase().replace('i want to edit', '').trim();
    const productToEdit = products.find(product => product.name.toLowerCase() === productName);
    if (productToEdit) {
      navigate(`/product/editproduct/${productToEdit._id}`);
      responseText = `Directing to edit ${productToEdit.name}`;
    } else {
      responseText = `Sorry, there is no product named ${productName}. Please try again.`;
    }
    // Speak the response text
    speak(responseText);
  };

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
    // Filter products based on search query
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };
  
  const handleSort = (type, category = null) => {
    let sortedProducts = [];
    if (type === 'all') {
      sortedProducts = products;
    } else {
      if (category === '') {
        sortedProducts = products.filter(product => product.type === 'buy');
      } else {
        sortedProducts = products.filter(product => product.type === type);
        if (category) {
          sortedProducts = sortedProducts.filter(product => product.category === category);
        }
      }
    }
    setFilteredProducts(sortedProducts);
  };

  const truncateDescription = (description) => {
    const words = description.split(" ");
    if (words.length > 3) {
      return words.slice(0, 3).join(" ") + "...";
    } else {
      return description;
    }
  };

  const skeletonCount = 12; 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    setFilteredProducts(products.slice(startIndex, endIndex));
  }, [currentPage, products]);

  useEffect(() => {
      // Function to handle click outside of sidebar
      const handleClickOutside = (event) => {
          if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
              setIsSidebarOpen(false);
          }
      };

      // Add event listener for clicks outside of sidebar
      document.addEventListener('mousedown', handleClickOutside);

      // Cleanup function to remove event listener
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);


  return (
    <div>
      <div>
      <div style={{ position: 'relative' }}>
           <SideBar/>
            
            
            {/* Header */}
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f0f0f0', flexGrow: 1 }}>
                <div className="logo">
                    <img src={MSRLogo} alt="Logo" style={{ width: '50px', height: 'auto', marginLeft: '30px' }} />
                </div>

                <div className="header-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Your header content */}
                    {/* Input container */}
                    <div className="InputContainer" style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(255, 255, 255)', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', paddingLeft: '15px', boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.075)' }}>
                        <input type="text" name="text" className="input" id="input" value={searchQuery}
  onChange={handleChange}  placeholder="Search" style={{ width: '170px', height: '100%', border: 'none', outline: 'none', fontSize: '0.9em', caretColor: 'rgb(255, 81, 0)' }} />
                        <label htmlFor="input" className="labelforsearch" style={{ cursor: 'text', padding: '0px 12px' }}>
                            <svg viewBox="0 0 512 512" className="searchIcon" style={{ width: '13px' }}>
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                            </svg>
                        </label>
                        <div className="border" style={{ height: '40%', width: '1.3px', backgroundColor: 'rgb(223, 223, 223)' }}></div>
                        <button className="micButton" style={{ border: 'none', backgroundColor: 'transparent', height: '40px', cursor: 'pointer', transitionDuration: '.3s', width: '40px' }}>
                            <svg viewBox="0 0 384 512" className="micIcon" style={{ width: '12px' }}>
                                <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <button
                    className="Btn"
                    style={{
                        width: '100px',
                        height: '40px',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: 'black',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
                        transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s'
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
      </div>
      <div className={styles.heading}>
        <h1>Preview Products</h1>
      </div>
      <div className="sort-buttons" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button className="sort-button" onClick={() => handleSort('all')} style={{ color: 'gray', borderRadius: '5px', border: 'none', padding: '10px 20px', cursor: 'pointer', marginRight: '10px', backgroundColor: 'transparent' }}>All</button>
        <span style={{ color: 'gray', padding: '0 5px', marginTop: '10px', marginRight: '-5px' }}>|</span>
        <div className="dropdown-menu" style={{ position: 'relative', display: 'inline-block' }}>
          <button className="sort-button" onClick={() => handleSort('rent')} style={{ color: 'gray', borderRadius: '5px', border: 'none', padding: '10px 20px', cursor: 'pointer', backgroundColor: 'transparent' }}>Rent</button>
          <span style={{ color: 'gray', padding: '0 5px', marginTop: '10px' }}>|</span>
          <select className="filter-select" onChange={(e) => handleSort('buy', e.target.value)} style={{ color: 'gray', borderRadius: '5px', border: 'none', padding: '10px 20px', top: '100%', left: '0', cursor: 'pointer', backgroundColor: 'transparent' }}>
            <option style={{ color: 'gray', padding: '0 5px' }} value="">Buy</option>
            <option style={{ color: 'gray', padding: '0 5px' }} value="suit">Suit</option>
            <option style={{ color: 'gray', padding: '0 5px' }} value="shirt">Shirt</option>
            <option style={{ color: 'gray', padding: '0 5px' }} value="trousers">Trousers</option>
            <option style={{ color: 'gray', padding: '0 5px' }} value="tie">Tie</option>
            <option style={{ color: 'gray', padding: '0 5px' }} value="bow">Bow</option>
           
          </select>
        </div>
      </div>
  
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
        onClick={startVoiceRecognition} // Change onClick handler to startVoiceRecognition
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
  
      <div className={styles.container}>
        {loading ? (
          Array.from({ length: skeletonCount }, (_, i) => (
            <div key={i} className={styles.box}>
              <div className={styles.skeleton}>
                <div className={styles.skeletonBox}></div>
                <div className={styles.skeletonText}></div>
                <div className={styles.skeletonText}></div>
                <div className={styles.skeletonText}></div>
                <div className={styles.skeletonText}></div>
                <div className={styles.skeletonText}></div>
              </div>
              <div className={styles.skeletonOptions}>
                <button className={styles.skeletonButton}></button>
                <button className={styles.skeletonButton}></button>
              </div>
            </div>
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div key={index} className={styles.box}>
              <div className={styles.boxImg}>
                {product.images && product.images.length > 0 && (
                  <img src={`data:image/jpeg;base64,${product.images[0]}`} alt="Product Image" />
                )}
              </div>
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Description: {truncateDescription(product.description)}</p>
              <p>Category: {product.category}</p>
              <p>Type: {product.type}</p>
              <div className={styles.boxOptions}>
                <button onClick={() => handleEdit(product._id)}>Update</button>
                <button onClick={() => handleDelete(product._id, product.name)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
  
      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(products.length / PAGE_SIZE) }, (_, i) => i + 1).map((pageNumber) => (
          <button key={pageNumber} onClick={() => paginate(pageNumber)} className={pageNumber === currentPage ? styles.active : ''}>
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Preview;
