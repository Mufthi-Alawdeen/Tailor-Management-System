import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import logo from '../../../res/MSRLogo.png';
import Header from '../Header';
import style from './GenerateReportButton.module.css';

const GenerateReportButton = () => {
    const [products, setProducts] = useState([]);
    const [duration, setDuration] = useState('');
    const [isResponsible, setIsResponsible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const chartRef = useRef(null); // Initialize chartRef
    const [voiceCommand, setVoiceCommand] = useState('');
    const [buttonColor, setButtonColor] = useState('#524A4E');
    const [currentColor, setCurrentColor] = useState('#FF342B');
    
    const [isListening, setIsListening] = useState(false); 
    const handleVoiceCommand = (command) => {
        console.log("Command received:", command); // Add this line to log the received command
    
        let responseText = '';
        switch (command) {
            case 'month':
                setDuration('month');
                responseText = "Duration set to month. Please confirm to generate the report.";
                setIsResponsible(true);
                generateReport();
                responseText = "Generating report...";
                break;
            case 'week':
                setDuration('week');
                responseText = "Duration set to week. Please confirm to generate the report.";
                setIsResponsible(true);
                generateReport();
                responseText = "Generating report...";
                break;
           
            default:
                responseText = "sorry, I could not understand that. please try again.";
                break;
        }
        // Speak the response text
        speak(responseText);
    };
    
    
      
    
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
    
            // Initial voice prompt
            speak("Please select the duration");
        }
    };
    
    
    // Function to speak the given text
    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    };
    useEffect(() => {
        fetchProducts(duration);
    }, [duration]);

    const fetchProducts = async (duration) => {
        setIsLoading(true);
        setError(null);
    
        try {
            const currentDate = new Date();
            const startDate = new Date();
    
            if (duration === 'week') {
                startDate.setDate(currentDate.getDate() - 7);
            } else if (duration === 'month') {
                startDate.setDate(currentDate.getDate() - 30);
            }
    
            const response = await axios.get(`http://localhost:8075/product/all?startDate=${startDate.toISOString()}&endDate=${currentDate.toISOString()}`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError('Error fetching products');
        } finally {
            setIsLoading(false);
        }
    };
    

    const getFormattedDate = () => {
        const now = new Date();
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return now.toLocaleDateString(undefined, options);
    };

    const generateReport = () => {
        if (!duration) {
            setError("Please select a duration.");
            return;
        }

        if (!isResponsible) {
            setError("Please confirm your responsibility for the report.");
            return;
        }

        setIsLoading(true);
        setError(null);
        const rentProducts = products.filter(product => product.type === 'rent');
        const buyProducts = products.filter(product => product.type === 'buy');

        const formattedDate = getFormattedDate(); // Get the current date in the desired format

        const reportContent = `
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            margin: 20px auto;
            max-width: 800px;
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .logo {
            max-width: 100px;
            margin-left: 20px;
        }
        .company-info {
            flex: 1;
            text-align: right;
            margin-right: 20px;
        }
        hr {
            border: none;
            border-top: 1px solid #ccc;
            margin: 20px 0;
        }
        .report-heading {
            text-align: center;
            margin-bottom: 20px;
        }
        .date {
            text-align: center;
            margin-bottom: 20px;
        }
        .product-counts {
            margin-bottom: 20px;
        }
        .products {
            margin-bottom: 20px;
        }
        .product {
            padding: 10px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-bottom: 10px;
        }
        h1, h2 {
            color: #333;
        }
        p {
            margin: 5px 0;
        }
        .signature {
            text-align: right;
            margin-top: 50px;
        }
        .clarification {
            text-align: left;
            margin-bottom: 20px;
        }
    </style>
    <div class="container">
        <div class="header">
            <img src="${logo}" alt="Logo" class="logo" />
            <div class="company-info">
                <h1>MSR Tailors</h1>
                <p>Address: 271 A9, Kandy 20000</p>
                <p>Phone: 0812 205 454</p>
            </div>
        </div>
        <hr>
        <div class="report-heading">
            <h1>${duration === 'week' ? 'Weekly' : 'Monthly'} Product Details Report</h1>
        </div>
        <div class="date">
            <p>Date: ${formattedDate}</p>
        </div>
        <div class="product-counts">
            <p>Rent Products Count: ${rentProducts.length}</p>
            <p>Buy Products Count: ${buyProducts.length}</p>
        </div>
        <div class="products">
            <h2>Rent Products:</h2>
            ${rentProducts.map((product, index) => `
                <div class="product">
                    <p><strong>Product ${index + 1}:</strong></p>
                    <p><strong>Name:</strong> ${product.name}</p>
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Description:</strong> ${product.description}</p>
                    <p><strong>Category:</strong> ${product.category}</p>
                </div>
            `).join('')}
        </div>
        <div class="products">
            <h2>Buy Products:</h2>
            ${buyProducts.map((product, index) => `
                <div class="product">
                    <p><strong>Product ${index + 1}:</strong></p>
                    <p><strong>Name:</strong> ${product.name}</p>
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Description:</strong> ${product.description}</p>
                    <p><strong>Category:</strong> ${product.category}</p>
                </div>
            `).join('')}
        </div> 
        <div class="clarification">
            <p>All information provided in this report are true and accurate to the best of our knowledge.</p> 
        </div>
        <div class="signature">
            <p>--------------</p>
            <p>Product Manager</p>
        </div>
    </div>
`;


        const element = document.createElement("div");
        element.innerHTML = reportContent;

        html2pdf().from(element).save("report.pdf").then(() => {
            setIsLoading(false);
        }).catch((error) => {
            setError("An error occurred while generating the report.");
            setIsLoading(false);
        });
    };

    const handleDurationChange = (e) => {
        setDuration(e.target.value);
        setError(null);
    };

    const handleResponsibilityChange = (e) => {
        setIsResponsible(e.target.checked);
        setError(null);
    };

    return (
        <div>
            <div>
                <Header />
            </div>
            <div className={style.heading} style={{ marginBottom: '30px', textAlign: 'center' }}>
                <h1 >Generate Report</h1>
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
            <div style={{ margin: '0 auto', width: '50%', padding: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ marginBottom: '20px', color: 'black', textAlign: 'justify' }}>
                    <p>MSR Tailors generates weekly and monthly reports for decision-making purposes. These reports provide valuable insights into the performance of products over specific durations, helping stakeholders make informed decisions. With detailed information on product details, trends, and average prices, these reports empower product managers and decision-makers to optimize strategies and drive business growth.</p>
                </div>
                <div style={{ marginBottom: '10px', textAlign: 'left' }}>
                    <label htmlFor="duration" style={{ marginRight: '10px' }}>Please Select Duration:</label>
                    <select
                        id="duration"
                        name="duration"
                        value={duration}
                        onChange={handleDurationChange}
                        style={{ padding: '5px' }}
                    >
                        <option value="">Select</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                    </select>
                </div>
                <div style={{ marginBottom: '10px', textAlign: 'left' }}>
                    <label htmlFor="responsibility" style={{ marginRight: '10px' }}>As a product manager, I am responsible for the report.</label>
                    <input
                        type="checkbox"
                        id="responsibility"
                        name="responsibility"
                        checked={isResponsible}
                        onChange={handleResponsibilityChange}
                        style={{ marginRight: '5px' }}
                    />
                </div>
                <p style={{ marginBottom: '10px', textAlign: 'left' }}>Click the button below to generate the report.</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <button onClick={generateReport} disabled={isLoading} style={{ padding: '10px', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '1px' }}>
                        {isLoading ? 'Generating...' : 'Generate Report'}
                    </button>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default GenerateReportButton;