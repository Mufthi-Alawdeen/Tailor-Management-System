import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductDashboard.module.css';
import Header from '../Header';
import Sidebar from '../Sidebar';


function ProductDashboard() {
    const [voiceCommand, setVoiceCommand] = useState('');
    const [buttonColor, setButtonColor] = useState('#1b1b1cde');
    const [currentColor, setCurrentColor] = useState('#FF342B');
    const [isListening, setIsListening] = useState(false); // State to track if microphone is active

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
            case 'open buy products':
                window.location.href = '/product/buyproducts'; // Redirect to buy products page
                responseText = 'Directing to buy products';
                break;
            case 'open rent products':
                window.location.href = '/product/rentproducts'; // Redirect to rent products page
                responseText = 'Directing to rent products';
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

    return (
        <div style={{  }}>
            <div>
                <Header/>
            </div>
            <div className={styles.heading}>
           
  <h1>Welcome to Product Dashboard</h1>
</div>
<div className="buttonlinkcontainer">
  <Link to="/product/add" className={styles.buttonlink}>Upload Product</Link>
  <br />
  <Link to="/product/generate-report" className={styles.buttonlink}>Generate Report</Link>
  <br />
  <Link to="/product/all" className={styles.buttonlink}>Preview All Products</Link>
  <br />
  <Link to="/product/buyproducts" className={styles.buttonlink}>Buy Products</Link>
  <br />
  <Link to="/product/rentproducts" className={styles.buttonlink}>Rent Products</Link>
  <br />
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
                    background: isListening ? 'red' : buttonColor, // Change color to red when listening
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
