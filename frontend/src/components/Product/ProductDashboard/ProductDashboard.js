import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductDashboard.module.css';
import Header from '../Header';
import Sidebar from '../Sidebar';
import axios from 'axios'; // Import axios for making HTTP requests

function ProductDashboard() {
    const [voiceCommand, setVoiceCommand] = useState('');
    const [buttonColor, setButtonColor] = useState('#524A4E');
    const [currentColor, setCurrentColor] = useState('#FF342B');
    const [isListening, setIsListening] = useState(false); // State to track if microphone is active
    const [productCounts, setProductCounts] = useState({
        shirts: 0,
        trousers: 0,
        suits: 0,
        bows: 0,
        ties: 0
    });
    // Function to parse voice command and redirect accordingly
    const handleVoiceCommand = (command) => {
        let responseText = '';
        switch (command) {
            case 'open upload product':
                window.location.href = '/product/add'; // Redirect to upload products page
                responseText = 'Directing to upload products';
                break;
            case 'open generate report':
                window.location.href = '/product/generate-report'; // Redirect to generate report page
                responseText = 'Directing to generate report';
                break;
            case 'open preview all products':
                window.location.href = '/product/all'; // Redirect to preview all products page
                responseText = 'Directing to preview all products';
                break;
            default:
                responseText = "Sorry, I couldn't understand that. Please try again.";
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
    useEffect(() => {
        // Fetch product counts from the server
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8075/product/all");
                // Assuming the response data is an array of products
                const products = response.data;

                // Calculate counts for different product types
                const counts = {
                    shirts: products.filter(product => product.category === 'shirt').length,
                    trousers: products.filter(product => product.category === 'trousers').length,
                    suits: products.filter(product => product.category === 'suit').length,
                    bows: products.filter(product => product.category === 'bow').length,
                    ties: products.filter(product => product.category === 'tie').length
                };

                setProductCounts(counts);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchData();
    }, []);
     // Utility function to generate random colors
     const fixedColors = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#ccd5ae'];

    return (
        <div style={{}}>
            <div>
                <Header />
            </div>
            <div className={styles.heading}>
                <h1>Welcome to Product Dashboard</h1>
            </div>
            <div className="buttonlinkcontainer">
                {/* Links to different product pages */}
            </div>

            <div style={{ margin: '20px auto', width: '100%', maxWidth: '600px', height: '300px', border: '3px solid #000', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {/* Bars */}
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '100%', position: 'relative' }}>
        {Object.entries(productCounts).map(([productType, count], index) => (
            <div key={productType} style={{ width: 'calc(100% / 5)', textAlign: 'center', position: 'relative' }}>
                <div style={{ backgroundColor: fixedColors[index % fixedColors.length], width: '50%', height: `${(count / Math.max(...Object.values(productCounts))) * 100}%`, margin: '0 auto', position: 'absolute', bottom: '0', left: '25%' }}></div>
                <div style={{ marginTop: '300px', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>{productType}</div>
                <div style={{ marginTop: '10px' }}>{count}</div>
            </div>
        ))}
    </div>
</div>

<div className="buttonlinkcontainer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop : "5%" }}>
  <Link to="/product/add" className={styles.buttonlink}>Upload Product</Link>
  
  <Link to="/product/generate-report" className={styles.buttonlink}>Generate Report</Link>

  <Link to="/product/all" className={styles.buttonlink}>Preview All Products</Link>
</div>



            {/* Voice recognition button */}
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
    );
}

export default ProductDashboard;
