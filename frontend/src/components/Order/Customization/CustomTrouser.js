import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests
import './CustomTrouser.css'; // Import CSS file for custom styling
import Header from "../../Inquiry/Contact Us/UserHeader";
import Footer from "../../Inquiry/Contact Us/UserFooter";

const TrouserCustomizationForm = () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const UserId = loggedInUser ? loggedInUser._id : null; // Using loggedInUser.UserID
    const { productId } = useParams();
    const [fabric, setFabric] = useState('');
    const [color, setColor] = useState('');
    const [type, setType] = useState('');
    const [measurements, setMeasurements] = useState({
        waist: 0,
        inseam: 0,
        outseam: 0,
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
        if (measurements.waist <= 0) {
            errors.waist = 'Waist measurement must be greater than 0';
        }
        if (measurements.inseam <= 0) {
            errors.inseam = 'Inseam measurement must be greater than 0';
        }
        if (measurements.outseam <= 0) {
            errors.outseam = 'Outseam measurement must be greater than 0';
        }
        if (quantity < 1 || quantity > 10) {
            errors.quantity = 'Quantity must be between 1 and 10';
        }
        return errors;
    };

    return (
        <div>
            <Header />
        
        <div className='trouser-customization-form'>
            <h1>Trouser Customization Form</h1>
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
                    <label>Measurements:</label>
                    <div className="measurements-group">
                        <div>
                            <label htmlFor="waist">Waist:</label>
                            <input type="number" id="waist" name="measurements" data-measurement-name="waist" data-measurement-value={measurements.waist} onChange={handleChange} className="form-control"/>
                            {errors.waist && <div className="error-message">{errors.waist}</div>}
                        </div>
                        <div>
                            <label htmlFor="inseam">Inseam:</label>
                            <input type="number" id="inseam" name="measurements" data-measurement-name="inseam" data-measurement-value={measurements.inseam} onChange={handleChange} className="form-control"/>
                            {errors.inseam && <div className="error-message">{errors.inseam}</div>}
                        </div>
                        <div>
                            <label htmlFor="outseam">Outseam:</label>
                            <input type="number" id="outseam" name="measurements" data-measurement-name="outseam" data-measurement-value={measurements.outseam} onChange={handleChange} className="form-control"/>
                            {errors.outseam && <div className="error-message">{errors.outseam}</div>}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity:</label>
                    <input type="number" id="quantity" name="quantity" value={quantity} onChange={handleChange} className="form-control"/>
                    {errors.quantity && <div className="error-message">{errors.quantity}</div>}
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
        <Footer />
        </div>
    );
};

export default TrouserCustomizationForm;
