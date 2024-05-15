import React, { useState, useEffect } from "react";
import axios from "axios";
import '../Sent Inquiries and Admin Inq/All_Inquiries.module.css';
import Swal from 'sweetalert2';
import styles from '../Sent Inquiries and Admin Inq/All_Inquiries.module.css';
import Header from "../Contact Us/UserHeader";
import Footer from "../Contact Us/UserFooter";

// This is the page where user view / update / delete their inquiries

export default function InquiryList() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        First_Name: "",
        Last_Name: "",
        Type: "",
        Email: "",
        Contact_number: "",
        Description: "",
        Order_ID:"",
        Rent_ID:""
    });
    
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("");

    useEffect(() => {
        fetchInquiries();
    }, []);

    function fetchInquiries() {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const userId = loggedInUser ? loggedInUser.UserID : null; // Assuming the user ID is stored as UserID
    
        if (userId) {
            axios.get(`http://localhost:8075/inquiry/retrieve/${userId}`)
                .then(response => {
                    setInquiries(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    setError(error.message);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Customize date format as needed
    }

    // Inside the handleDeleteClick function
function handleDeleteClick(inquiryId) {
    const creationDate = new Date(
        inquiries.find(inquiry => inquiry._id === inquiryId).createdAt
    );
    const now = new Date();
    const differenceInMinutes = Math.round(
        (now - creationDate) / (1000 * 60)
    ); // Calculate difference in minutes

    if (differenceInMinutes <= 15) {
        // Display SweetAlert confirmation
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this inquiry? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                title: 'swal-title',
                content: 'swal-text',
                confirmButton: 'swal-confirm-button',
                cancelButton: 'swal-cancel-button'
            }
        
        }).then((result) => {
            if (result.isConfirmed) {
                // If confirmed, proceed with deletion
                axios
                    .delete(`http://localhost:8075/inquiry/delete/${inquiryId}`)
                    .then(() => {
                        fetchInquiries(); // Refresh the inquiries list after deletion
                    })
                    .catch(error => {
                        console.error("Error deleting inquiry:", error);
                        // Handle error feedback to user if necessary
                    });
            }
        });
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'You can only delete inquiries within 15 minutes of creation.',
        });
    }
}

function handleEditClick(inquiry) {
    const creationDate = new Date(inquiry.createdAt);
    const now = new Date();
    const differenceInMinutes = Math.round(
        (now - creationDate) / (1000 * 60)
    ); // Calculate difference in minutes

    if (differenceInMinutes <= 15) {
        setSelectedInquiry(inquiry);
        setUpdatedData(inquiry); // Set initial values for the edit form
    } else {
        // Use SweetAlert for better UI/UX
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'You can only edit inquiries within 15 minutes of creation.',
        });
    }
}

    function handleUpdateClick(e) {
        e.preventDefault();
        const inquiryId = selectedInquiry._id;
        axios
            .put(
                `http://localhost:8075/inquiry/update/${inquiryId}`,
                updatedData
            )
            .then(() => {
                fetchInquiries(); // Refresh the inquiries list after updating
                setSelectedInquiry(null); // Close the popup or reset the edit form
                // Display SweetAlert notification
                Swal.fire({
                    icon: 'success',
                    title: 'Inquiry Updated',
                    text: 'The inquiry has been successfully updated.',
                    customClass: {
                        title: 'swal-title',
                        content: 'swal-text',
                        confirmButton: 'swal-confirm-button'
                    }
                });
            })
            .catch(error => {
                console.error("Error updating inquiry:", error);
                // Handle error feedback to user if necessary
            });
    }
    

    function handleInputChange(e) {
        const { name, value } = e.target;
        setUpdatedData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function handleSearchQueryChange(e) {
        setSearchQuery(e.target.value);
    }

    function handleSearchTypeChange(e) {
        setSearchType(e.target.value);
    }

    const filteredInquiries = inquiries.filter(inquiry => {
        const fullName = `${inquiry.First_Name} ${inquiry.Last_Name}`;
        const typeMatch = searchType ? inquiry.Type === searchType : true;
        const nameMatch = fullName.toLowerCase().includes(searchQuery.toLowerCase());
        return typeMatch && nameMatch;
    });

    const sortedFilteredInquiries = filteredInquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Header/>
            <h1 style={{ textAlign: "center", fontFamily: "sans-serif" , textDecoration:"underline" , marginTop:'50px' , marginBottom:'40px', fontWeight:'600' }}>Your Sent Inquiries</h1>
            <div style={{ width: "300px" , display:'flex'}}>
                <p style={{margin:'30px', marginTop:'38px' }}>Sort By</p>
                <select value={searchType} className={styles.search1} onChange={handleSearchTypeChange}>
                    <option value="">All Types</option>
                    <option value="Order Issue">Order Issue</option>
                    <option value="General">General</option>
                    <option value="Rent Issues">Rent Issues</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {sortedFilteredInquiries.map(inquiry => (
               <div key={inquiry._id} className={styles.conatiner_all}>
               <button className={styles.button2} onClick={() => handleEditClick(inquiry)}>Edit</button>
               <br/><br/>
               <button className={styles.button2} onClick={() => handleDeleteClick(inquiry._id)}>Delete</button>
               
               <div className={styles.details}>
                   <h3 className={styles.marginBottom10}>{inquiry.First_Name} {inquiry.Last_Name}</h3>
                   <p className={styles.marginBottom10}>Type: {inquiry.Type}</p>
                   {inquiry.Type === "Order Issue" && (
                       <p className={styles.marginBottom10}>Order ID: {inquiry.Order_ID}</p>
                   )}
                   {inquiry.Type === "Rent Issue" && (
                       <p className={styles.marginBottom10}>Rent ID: {inquiry.Rent_ID}</p>
                   )}
                   <p className={styles.marginBottom10}>Email: {inquiry.Email}</p>
                   <p className={styles.marginBottom10}>Contact Number: {inquiry.Contact_number}</p>
                   <p className={styles.marginBottom10}>Description: {inquiry.Description}</p>
                   <p className={styles.marginBottom10}>Date: {formatDate(inquiry.createdAt)}</p>
                   {inquiry.Reply && (
                       <div style={{display:'flex' }}>
                           <h3 style={{fontSize:'24px'}}>Reply:</h3><h3 style={{marginLeft:'9px', fontSize:'24px'}}>{inquiry.Reply}</h3>
                       </div>
                   )}
               </div>
           </div>
           
                
            ))}
            
            {selectedInquiry && (
    <div className={styles.popup}>
        <div className={styles.editform1}>
            <h2 style={{ textAlign: "center", color:"white" , fontFamily: "Helvetica" , fontSize:"px" }}>Edit Inquiry</h2>
            <br/>

            <form onSubmit={handleUpdateClick}>
                <div>
                    <label htmlFor="First_Name">First Name:</label>
                    <input type="text" id="First_Name" name="First_Name" value={updatedData.First_Name} onChange={handleInputChange} />
                </div>
                <br/>
                <div>
                    <label htmlFor="Last_Name">Last Name:</label>
                    <input type="text" id="Last_Name" name="Last_Name" value={updatedData.Last_Name} onChange={handleInputChange} />
                </div>
                <br/>
                <div>
                    <label htmlFor="Type">Type:</label>
                    <select style={{width:"45%", padding:"5.5px"}} id="Type" name="Type" value={updatedData.Type} onChange={handleInputChange}>
                        <option value="Order Issue">Order Issue</option>
                        <option value="General">General</option>
                        <option value="Rent Issue">Rent Issue</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <br/>
                {updatedData.Type === "Order Issue" && (
                    <div>
                        <label htmlFor="Order_ID">Order ID:</label>
                        <input type="text" id="Order_ID" name="Order_ID" value={updatedData.Order_ID} onChange={handleInputChange} />
                    </div>
                )}
                {updatedData.Type === "Rent Issue" && (
                    <div>
                        <label htmlFor="Rent_ID">Rent ID:</label>
                        <input type="text" id="Rent_ID" name="Rent_ID" value={updatedData.Rent_ID} onChange={handleInputChange} />
                    </div>
                )}
                <br/>
                <div>
                    <label htmlFor="Email">Email:</label>
                    <input type="email" style={{width:"70%", padding:"6px"}} id="Email" name="Email" value={updatedData.Email} onChange={handleInputChange} />
                </div>
                <br/>
                <div>
                    <label htmlFor="Contact_number">Contact Number:</label>
                    <input type="text" style={{width:"67%", padding:"6px"}} id="Contact_number" name="Contact_number" value={updatedData.Contact_number} onChange={handleInputChange} />
                </div>
                <br/>
                <div>
                    <label htmlFor="Description">Description:</label>
                    <textarea id="Description" name="Description" value={updatedData.Description} onChange={handleInputChange} style={{padding:"10px"}}></textarea>
                </div>

                <div style={{display:'flex' , justifyContent:'space-between'}}>
                    <button className={styles.popup_button} type="submit">Update</button>
                    <button className={styles.popup_button} type="button" onClick={() => setSelectedInquiry(null)}>Cancel</button>
                </div>
            </form>
                </div>
        </div>
        )}
        <Footer/>

        </div>
    );
}