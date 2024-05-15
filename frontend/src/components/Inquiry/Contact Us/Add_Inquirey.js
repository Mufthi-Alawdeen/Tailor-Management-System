import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for routing
import styles1 from "../Contact Us/Add_Inquirey.module.css";
import axios from "axios";
import Swal from 'sweetalert2';
import Video from '../Img/suits.mp4';
import { EmailIcon, MapLocation, PhoneIcon } from "../Icons/icons";
import Header from "./UserHeader";
import info from "../../../res/info.gif";
import Footer from "./UserFooter";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

export default function InquiryForm() {
    const [loggedIn, setLoggedIn] = useState(false); // State to track login status
    const [formData, setFormData] = useState({
        UserID: "",
        First_Name: "",
        Last_Name: "",
        Type: "",
        Email: "",
        Contact_number: "",
        Description: "",
        Order_ID: "",
        Rent_ID: "",
        Reply: "PENDING", // Initialize reply as PENDING
        createdAt: new Date(),
    });

    useEffect(() => {
        // Function to retrieve user details from local storage and set them into form state
        const loggedInUserDetails = localStorage.getItem("loggedInUser");
        if (loggedInUserDetails) {
            try {
                const user = JSON.parse(loggedInUserDetails);
                console.log(user);
                setFormData(prevState => ({
                    ...prevState,
                    UserID: user.UserID,
                    First_Name: user.FirstName,
                    Last_Name: user.LastName,
                    Email: user.Email,
                    Contact_number: user.ContactNumber,
                    // Add other user details here based on your data structure
                }));
                setLoggedIn(true); // Set loggedIn to true if user details are found
            } catch (error) {
                console.error("Error parsing user details:", error);
                // Handle error gracefully, e.g., show a message to the user
            }
        }
    }, []);

    // Function to handle form submission
    function sendData(e) {
        e.preventDefault();

        axios.post("http://localhost:8075/inquiry/add", formData)
            .then(() => {
                // Show success message using SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: 'Thank you for your inquiry! We will get back to you as soon as possible.',
                    showConfirmButton: false,
                    timer: 1700, // Auto close after 1.7 seconds
                    customClass: {
                        title: styles1.my_title_class
                    }
                });

                // Reset form after successful submission
                setFormData({
                    First_Name: "",
                    Last_Name: "",
                    Type: "",
                    Email: "",
                    Contact_number: "",
                    Description: "",
                    Order_ID: "",
                    Rent_ID: "",
                    Reply: "PENDING", // Set reply to PENDING
                    createdAt: new Date(),
                });
            })
            .catch(error => {
                console.error("Error submitting inquiry:", error);
                // Handle error feedback to user if necessary
            });
    }

    // Function to handle form input changes
    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    // Function to clear form fields
    function clearForm() {
        setFormData({
            First_Name: "",
            Last_Name: "",
            Type: "",
            Email: "",
            Contact_number: "",
            Description: "",
            Order_ID: "",
            Rent_ID: "",
            Reply: "PENDING",
            createdAt: new Date(),
        });
    }

    function displayEmptyPopup() {
        Swal.fire({
            title: 'Submitting Inquiries By Type',
            html: `
                <p><span style="font-weight: bold; text-decoration: underline;">Order Issue</span></p>
                <p>If you are experiencing issues with your orders, select "Order Issue" as the type. You can optionally provide your order ID.</p>
                <br>
                <p><span style="font-weight: bold; text-decoration: underline;">Rent Issue</span></p>
                <p>If you are experiencing issues with your rentals, select "Rent Issues" as the type. You can optionally provide your rent ID.</p>
                <br>
                <p><span style="font-weight: bold; text-decoration: underline;">General</span></p>
                <p>If you are experiencing issues other than rental and orders, select "General" type.</p>
                <br>
                <p><span style="font-weight: bold; text-decoration: underline;">Other</span></p>
                <p>If your issue does not fall into the above categories, select "Other" and provide details.</p>
            `,
            showConfirmButton: false
        });
    }

    return (
        <div>
            <Header />
            <div className={styles1.videoBackground}>
                <video src={Video} autoPlay loop muted></video>
                <div className={styles1.overlayContent}>
                    <p style={{fontWeight:'650', fontSize:'55px', marginBottom:'50px'}}>Contact Us</p>
                    <div className={styles1.contactIcons}>
                        <div className={styles1.contactIcon}>
                            <MdEmail/>
                            <span>rilwanmsr@gmail.com</span>
                        </div>
                        <div className={styles1.contactIcon}>
                            <FaPhone/>
                            <span>077 719 3049</span>
                        </div>
                        <div className={styles1.contactIcon}>
                            <FaLocationDot/>
                            <span>No. 280A, D.S. Senanayaka Veediya, Kandy</span>
                        </div>
                    </div>
                </div>
            </div>
            <hr style={{ width: '50%', margin: '0px auto', border:'1px solid #000000' }} />
            {loggedIn ? (
                <div>
                    <div style={{ marginBottom: '60px', marginTop: '80px' }}>
                        <Link to="/inquiry/sent"><button className={styles1.btn2}>Sent Inquiries</button></Link>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        padding: 45,
                        width: '85%',
                        height: 'fit-content',
                        margin: 'auto',
                        backgroundColor: 'white',
                        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                        marginBottom: '90px'
                    }}>
                        <div style={{ width: '55%', padding: 30, borderRight: '1.5px solid #ccc', backgroundColor: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <a onClick={displayEmptyPopup}>
                                    <img src={info} style={{ marginLeft: '-30px', width: '180%', height: '35%', marginTop: '10px', cursor: 'pointer' }} alt="Description of GIF" />
                                </a>
                                <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                                    <h2 style={{
                                        marginLeft: '-40px',
                                        fontFamily: 'sans-serif',
                                        fontWeight: 'bold',
                                        textDecoration: 'underline',
                                        marginTop: '10px',
                                        fontSize: '30px',
                                        marginRight: '70px'
                                    }}>
                                        Submit an Inquiry
                                    </h2>
                                </div>
                            </div>
                            <form onSubmit={sendData}>
                                <input type="hidden" id="UserID" name="UserID" value={formData.UserID} />
                                <div className={styles1.formGroup}>
                                    <label style={{ fontWeight: 'bold' }} htmlFor="First_Name">First Name:</label>
                                    <input style={{ padding: '7px', width: '125%' }} type="text" id="First_Name" name="First_Name" value={formData.First_Name} onChange={handleInputChange} />
                                </div>
                                <div className={styles1.formGroup}>
                                    <label style={{ fontWeight: 'bold' }} htmlFor="Last_Name">Last Name:</label>
                                    <input style={{ padding: '7px', width: '125%' }} type="text" id="Last_Name" name="Last_Name" value={formData.Last_Name} onChange={handleInputChange} />
                                </div>
                                <div className={styles1.formGroup} style={{ width: '50%' }}>
                                    <label style={{ fontWeight: 'bold', marginBottom: '4px' }} htmlFor="Type">Type:</label>
                                    <select id="Type" name="Type" value={formData.Type} onChange={handleInputChange} style={{ padding: '9px', width: '115%' }}>
                                        <option value="">Select</option>
                                        <option value="Order Issue">Order Issue</option>
                                        <option value="General">General</option>
                                        <option value="Rent Issue">Rent Issue</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Additional input field for Order ID */}
                                {formData.Type === "Order Issue" && (
                                    <div className={styles1.formGroup} style={{ width: '85%' }}>
                                        <label style={{ fontWeight: 'bold' }} htmlFor="Order_ID">Order ID:</label>
                                        <input type="text" id="Order_ID" name="Order_ID" value={formData.Order_ID} onChange={handleInputChange} style={{ padding: '7px', width: '103%' }} />
                                    </div>
                                )}

                                {/* Additional input field for Rent ID */}
                                {formData.Type === "Rent Issue" && (
                                    <div className={styles1.formGroup} style={{ width: '85%' }}>
                                        <label style={{ fontWeight: 'bold' }} htmlFor="Rent_ID">Rent ID:</label>
                                        <input type="text" id="Rent_ID" name="Rent_ID" value={formData.Rent_ID} onChange={handleInputChange} style={{ padding: '7px', width: '103%' }} />
                                    </div>
                                )}

                                <div className={styles1.formGroup} style={{ width: '85%' }}>
                                    <label style={{ fontWeight: 'bold' }} htmlFor="Email">Email:</label>
                                    <input type="email" id="Email" name="Email" value={formData.Email} onChange={handleInputChange} style={{ padding: '7px', width: '103%' }} />
                                </div>
                                <div className={styles1.formGroup}>
                                    <label style={{ fontWeight: 'bold' }} htmlFor="Contact_number">Contact Number:</label>
                                    <input type="text" id="Contact_number" name="Contact_number" value={formData.Contact_number} onChange={handleInputChange} style={{ padding: '7px', width: '125%' }} />
                                </div>
                                <div className={styles1.formGroup}>
                                    <label style={{ fontWeight: 'bold' }} htmlFor="Description">Description:</label>
                                    <textarea id="Description" name="Description" value={formData.Description} onChange={handleInputChange} style={{ padding: '15px', width: '125%' }} ></textarea>
                                </div>

                                {/* Hidden input field for current date */}
                                <input type="hidden" id="createdAt" name="createdAt" value={formData.createdAt.toISOString()} />
                                {/* Hidden input field for reply */}
                                <input type="hidden" id="Reply" name="Reply" value={formData.Reply} />
                                <br />
                                <div style={{ display: "flex", justifyContent: 'space-between', marginRight: 68 }}>
                                    <button className={styles1.button1} type="submit">Submit</button>
                                    <button className={styles1.button1} type="button" onClick={clearForm}>Clear</button>
                                </div>
                            </form>
                        </div>
                        <div style={{ width: '58%', padding: 35, margin: 'auto' }}>
                            <iframe
                                src="https://www.chatbase.co/chatbot-iframe/k6CpkT-ufUD0yJRIjLbPi"
                                title="Chatbot"
                                width="105%"
                                style={{ height: '90vh', minHeight: '550px', border: '1px solid #ccc', padding: '10px' }} // Updated style attribute
                                frameBorder="0" // Updated frameBorder attribute
                            />
                        </div>
                    </div>
                    <Footer />
                </div>
            ) : (
                <div>
                    <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '22px', fontWeight: '650', textDecoration: 'underline', marginBottom: '60px' }}>
                        <p>You Have To Login To Submit An Inquiry. Or Use Our Chat Box To Get Quick Answers For Your Questions</p>
                        <div style={{ width: '55%', padding: 35, margin: 'auto' }}>
                            <iframe
                                src="https://www.chatbase.co/chatbot-iframe/k6CpkT-ufUD0yJRIjLbPi"
                                title="Chatbot"
                                width="105%"
                                style={{ height: '80vh', minHeight: '500px', border: '1px solid #ccc', padding: '10px', marginTop: '40px' }} // Updated style attribute
                                frameBorder="0" // Updated frameBorder attribute
                            />
                        </div>
                    </div>
                    <Footer />
                </div>
            )}
        </div>
    );
};
