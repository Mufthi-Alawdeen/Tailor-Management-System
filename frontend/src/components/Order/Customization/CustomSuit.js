import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests
import './CustomSuit.css'; // Import CSS file for custom styling
import Header from "../../Inquiry/Contact Us/UserHeader";
import Footer from "../../Inquiry/Contact Us/UserFooter";

const SuitCustomizationForm = () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const UserId = loggedInUser ? loggedInUser._id : null; // Using loggedInUser.UserID
    const { productId } = useParams();

    const [fabric, setFabric] = useState('');
    const [color, setColor] = useState('');
    const [type, setType] = useState('');
    const [measurements, setMeasurements] = useState({
        chest: 0,
        waist: 0,
        hips: 0,
        shoulders: 0,
        sleeveLength: 0,
        jacketLength: 0,
    });
    const [quantity, setQuantity] = useState(1);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!loggedInUser) {
            window.location.href = "/login"; // Redirect to login page if not logged in
        }
    }, [loggedInUser]);

    const handleFabricChange = (e) => {
        setFabric(e.target.value);
    };

    const handleColorChange = (e) => {
        setColor(e.target.value);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'quantity') {
            setQuantity(parseInt(value));
        } else {
            const measurementName = e.target.getAttribute('data-measurement-name');
            const measurementValue = parseInt(value);
            setMeasurements(prevMeasurements => ({
                ...prevMeasurements,
                [measurementName]: measurementValue,
            }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateInputs();
        if (Object.keys(errors).length === 0) {
            try {
                // Send data to the backend using Axios
                const response = await axios.post('http://localhost:8075/order/products/cart/add', {
                    userId: UserId,
                    productId: productId, // Include productId in the request body
                    fabric,
                    color,
                    type,
                    measurements,
                    quantity,
                });
                if (response.status === 201) {
                    setSuccessMessage('Cart item added successfully');
                    setTimeout(() => {
                        setSuccessMessage('');
                        window.location.href = '/productlistcustom/buyproducts'; // Redirect after 3 seconds
                    }, 3000);
                }
            } catch (error) {
                console.error('Error: frontend', error);
            }
        } else {
            setErrors(errors);
        }
    };

    const validateInputs = () => {
        const errors = {};
        if (!fabric) {
            errors.fabric = 'Fabric is required';
        }
        if (!color) {
            errors.color = 'Color is required';
        }
        if (!type) {
            errors.type = 'Type is required';
        }
        if (quantity < 1 || quantity > 10) {
            errors.quantity = 'Quantity must be between 1 and 10';
        }
        // Add more validations for measurements if needed
        return errors;
    };

    return (
        <div>
            <Header />
        
        <div className="suit-customization-form">
            <h1>Suit Customization Form</h1>
            {successMessage && <div className="success-message">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="fabric">Fabric:</label>
                    <select id="fabric" name="fabric" value={fabric} onChange={handleFabricChange} className="form-control">
                        <option value="">Select Fabric</option>
                        <option value="wool">Wool</option>
                        <option value="cashmere">Cashmere</option>
                        <option value="silk">Silk</option>
                    </select>
                    {errors.fabric && <div className="error-message">{errors.fabric}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="color">Color:</label>
                    <select id="color" name="color" value={color} onChange={handleColorChange} className="form-control">
                        <option value="">Select Color</option>
                        <option value="black">Black</option>
                        <option value="navy">Navy</option>
                        <option value="gray">Gray</option>
                        <option value="charcoal">Charcoal</option>
                    </select>
                    {errors.color && <div className="error-message">{errors.color}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="type">Type:</label>
                    <select id="type" name="type" value={type} onChange={handleTypeChange} className="form-control">
                        <option value="">Select Type</option>
                        <option value="plain">Plain</option>
                        <option value="striped">Striped</option>
                    </select>
                    {errors.type && <div className="error-message">{errors.type}</div>}
                </div>
                <div className="form-group">
                    <label>Measurements(inches):</label>
                    <div className="measurements-group">
                        <div>
                            <label htmlFor="chest">Chest:</label>
                            <input type="number" id="chest" name="measurements" data-measurement-name="chest" data-measurement-value={measurements.chest} onChange={handleChange} className="form-control" />
                        </div>
                        <div>
                            <label htmlFor="waist">Waist:</label>
                            <input type="number" id="waist" name="measurements" data-measurement-name="waist" data-measurement-value={measurements.waist} onChange={handleChange} className="form-control" />
                        </div>
                        <div>
                            <label htmlFor="hips">Hips:</label>
                            <input type="number" id="hips" name="measurements" data-measurement-name="hips" data-measurement-value={measurements.hips} onChange={handleChange} className="form-control" />
                        </div>
                        <div>
                            <label htmlFor="shoulders">Shoulders:</label>
                            <input type="number" id="shoulders" name="measurements" data-measurement-name="shoulders" data-measurement-value={measurements.shoulders} onChange={handleChange} className="form-control" />
                        </div>
                        <div>
                            <label htmlFor="sleeveLength">Sleeve Length:</label>
                            <input type="number" id="sleeveLength" name="measurements" data-measurement-name="sleeveLength" data-measurement-value={measurements.sleeveLength} onChange={handleChange} className="form-control" />
                        </div>
                        <div>
                            <label htmlFor="jacketLength">Jacket Length:</label>
                            <input type="number" id="jacketLength" name="measurements" data-measurement-name="jacketLength" data-measurement-value={measurements.jacketLength} onChange={handleChange} className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity:</label>
                    <input type="number" id="quantity" name="quantity" value={quantity} onChange={handleChange} className="form-control" />
                    {errors.quantity && <div className="error-message">{errors.quantity}</div>}
                </div>
                <button type="submit" className="btn" id="submit">Submit</button>
            </form>
            <div className="instructions">
                <h3>Instructions:</h3>
                <p>Please provide the following details for your customized suit:</p>
                <ul>
                    <li>Fabric: Select the fabric type for your suit.</li>
                    <li>Color: Select the color you prefer for your suit.</li>
                    <li>Type: Select the type of suit (plain or striped).</li>
                    <li>Measurements: Provide accurate body measurements for a perfect fit.</li>
                    <li>Quantity: Select the quantity of suits you want to order (between 1 and 10).</li>
                </ul>
            </div>
        </div>
        <Footer />
        </div>
    );
};

export default SuitCustomizationForm;