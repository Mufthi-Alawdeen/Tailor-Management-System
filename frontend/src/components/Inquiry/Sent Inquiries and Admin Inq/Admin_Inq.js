import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import styles from '../Sent Inquiries and Admin Inq/All_Inquiries.module.css';
import Header from '../../Product/Header'


export default function AdminInquiryList() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("");
    const [showReplyPopup, setShowReplyPopup] = useState(false);
    const [replyMessage, setReplyMessage] = useState("");
    const [selectedInquiryId, setSelectedInquiryId] = useState(null);
    const [originalReplyStatus, setOriginalReplyStatus] = useState("");
    const [lastEditTime, setLastEditTime] = useState(null);

    useEffect(() => {
        fetchInquiries();
    }, []);

    function fetchInquiries() {
        axios.get("http://localhost:8075/inquiry/retrieve")
            .then(response => {
                const sortedInquiries = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setInquiries(sortedInquiries);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Customize date format as needed
    }

    function handleDeleteClick(inquiryId) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`http://localhost:8075/inquiry/delete/${inquiryId}`)
                    .then(() => {
                        fetchInquiries();
                        Swal.fire(
                            'Deleted!',
                            'Your inquiry has been deleted.',
                            'success'
                        );
                    })
                    .catch(error => {
                        console.error("Error deleting inquiry:", error);
                        Swal.fire(
                            'Error!',
                            'An error occurred while deleting the inquiry.',
                            'error'
                        );
                    });
            }
        });
    }

    function handleSearchQueryChange(e) {
        setSearchQuery(e.target.value);
    }

    function handleSearchTypeChange(e) {
        setSearchType(e.target.value);
    }

    function handleReplyClick(inquiryId, reply, updatedAt) {
        setSelectedInquiryId(inquiryId);
        setReplyMessage(reply || "");
        setOriginalReplyStatus(reply || "");
        const now = new Date();
        const differenceInMinutes = Math.round((now - new Date(updatedAt)) / (1000 * 60));

        if (reply !== "PENDING" && differenceInMinutes > 15) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'It has been more than 15 minutes since the last edit. You cannot edit the reply anymore.'
            });
        } else {
            setShowReplyPopup(true);
        }
    }

    function handleClosePopup() {
        setShowReplyPopup(false);
        setReplyMessage("");
        setSelectedInquiryId(null);
        setOriginalReplyStatus("");
    }
    

function handleReplySubmit(replyMessage, selectedInquiryId, inquiries, setInquiries, setLastEditTime, handleClosePopup) {
    // Update inquiries with the new reply message
    const updatedInquiries = inquiries.map(inquiry => {
        if (inquiry._id === selectedInquiryId) {
            return {
                ...inquiry,
                Reply: replyMessage,
                updatedAt: new Date() // Adding updatedAt field
            };
        }
        return inquiry;
    });

    // Update the reply value in the database
    axios.put(`http://localhost:8075/inquiry/update/${selectedInquiryId}`, {
        Reply: replyMessage,
        updatedAt: new Date() // Including updatedAt field in the request payload
    })
    .then(response => {
        if (response.status === 200) {
            // If reply update is successful, set the updated inquiries
            setInquiries(updatedInquiries);
            setLastEditTime(new Date()); // Update the last edit time
            handleClosePopup();
            alert("Reply Submitted Successfully! & Text Message Sent For The User");

        } else {
            console.error("Error replying to inquiry:", response.statusText);
            alert("Failed to submit reply. Please try again later.");
        }
    })
    .catch(error => {
        console.error("Error replying to inquiry:", error);
        alert("Failed to submit reply. Please try again later.");
    });
}

async function sendSMS(inquiry, replyMessage) {
    try {
        // Format the submission date using the formatDate function
        const formattedSubmittedDate = formatDate(inquiry.createdAt);

        // Construct the SMS message body with formatted date
        const smsMessageBody = `Reply for your inquiry: ${replyMessage}`;

        // Send the SMS with the formatted message body
        const response = await axios.post('http://localhost:8075/inquiry/sendsms', { message: smsMessageBody });
        
        console.log("SMS sent successfully:", response.data); // Log the response from the /sendsms endpoint
    } catch (error) {
        console.error("Failed to send SMS:", error);
        // Handle SMS sending error
    }
}



// Inside your component function
// Inside handleReplySubmitAndSend function
async function handleReplySubmitAndSend() {
    // Call handleReplySubmit to update reply value in the database
    await handleReplySubmit(replyMessage, selectedInquiryId, inquiries, setInquiries, setLastEditTime, handleClosePopup);

    // Call sendSMS to send SMS with the updated reply message and additional information
    await sendSMS(selectedInquiryId, replyMessage);
}
    
    const pendingReplies = inquiries.filter(inquiry => inquiry.Reply === "PENDING");
    const repliesSent = inquiries.filter(inquiry => inquiry.Reply !== "PENDING");

    // Inside your component function
    function filterInquiries(inquiry) {
        // Filter by search query
        const queryMatches = inquiry.First_Name.toLowerCase().includes(searchQuery.toLowerCase()) || inquiry.Last_Name.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by search type
        const typeMatches = searchType === "" || inquiry.Type === searchType;

        return queryMatches && typeMatches;
    }

    const filteredPendingReplies = pendingReplies.filter(filterInquiries);
    const filteredRepliesSent = repliesSent.filter(filterInquiries);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            
            <Header/>


            <h1 style={{ textAlign: "center", fontFamily: "sans-serif", textDecoration: "underline" , marginTop:'50px', marginBottom:'30px', fontWeight:'550' }}>All Inquiries</h1>
            <div style={{display:'flex', justifyContent:'center'}}>
            <p style={{marginTop:'32px', fontSize:'18px'}}>Sort By</p>
            <div>
                <select value={searchType} className={styles.search0} onChange={handleSearchTypeChange}>
                    <option value="">All Types</option>
                    <option value="Order Issue">Order Issue</option>
                    <option value="General">General</option>
                    <option value="Rent Issue">Rent Issue</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div>
                <input
                    className={styles.search2}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    placeholder="Search by first or last name..."
                />
            </div>
            </div>
    
            <h2 style={{ textAlign: "center", fontFamily: "sans-serif", textDecoration: 'underline', fontSize: "30px", marginTop:'50px', marginBottom:'35px', fontWeight:'550', }}>Recent Inquiries</h2>

            {filteredPendingReplies.map(inquiry => (
                <div key={inquiry._id} className={styles.conatiner_all}>
                    <button className={styles.Admin_buttons} onClick={() => handleReplyClick(inquiry._id, inquiry.Reply, inquiry.updatedAt)}>Reply</button>
                    <br /><br />
                    <button className={styles.Admin_buttons} onClick={() => handleDeleteClick(inquiry._id)}>Delete</button>

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
                    <div>
                    <h4>Reply:</h4>
                    <p>{inquiry.Reply}</p>
                </div>
            )}
        </div>
    </div>
))}

            <br /><br />
            <h2 style={{ textAlign: "center", fontFamily: "sans-serif", textDecoration: 'underline', fontSize: "30px" , marginTop:'50px', marginBottom:'25px', fontWeight:'550' }}>Submitted Replies</h2>
            <br />
            {filteredRepliesSent.map(inquiry => (
                <div key={inquiry._id} className={styles.conatiner_all}>

                    <button className={styles.Admin_buttons} onClick={() => handleReplyClick(inquiry._id, inquiry.Reply, inquiry.updatedAt)}>Reply</button>
                    <br /><br />
                    <button className={styles.Admin_buttons} onClick={() => handleDeleteClick(inquiry._id)}>Delete</button>

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
                            <div>
                                <h4>Reply:</h4>
                                <p>{inquiry.Reply}</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {showReplyPopup && (
                <div className={styles.popup1}>
                    <div className={styles.popupcontent1}>
                        <h2 style={{ marginBottom:'15px', fontSize:'32px', color: "white", fontWeight: "bold", fontFamily: "Helvetica", textShadow: "0 0 5px black, 0 0 5px black, 0 0 5px black", textAlign: "center" }}>Reply to Inquiry</h2>
                        <textarea style={{ width: "200%" , padding:'20px' }}
                            defaultValue={originalReplyStatus === "PENDING" ? "" : replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                        />
                        <div style={{ display: "flex", justifyContent: 'space-between', marginRight: 68, marginTop: '20px'}}>
                        <button className={styles.Admin_buttons1} style={{ marginLeft: "-207px", marginTop: "2px" }} onClick={handleReplySubmitAndSend}>Send</button>
                        <button className={styles.Admin_buttons1} style={{ marginRight: "-274px" }} onClick={handleClosePopup}>Cancel</button>    
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    );
}






/* function handleReplySubmit() {
    const updatedInquiries = inquiries.map(inquiry => {
        if (inquiry._id === selectedInquiryId) {
            return {
                ...inquiry,
                Reply: replyMessage,
                updatedAt: new Date() // Adding updatedAt field
            };
        }
        return inquiry;
    });

    axios
        .put(`http://localhost:8075/inquiry/update/${selectedInquiryId}`, {
            Reply: replyMessage,
            updatedAt: new Date() // Including updatedAt field in the request payload
        })
        .then(response => {
            if (response.status === 200) {
                setInquiries(updatedInquiries);
                setLastEditTime(new Date()); // Update the last edit time
                handleClosePopup();
                alert("Reply submitted successfully!");
            } else {
                console.error("Error replying to inquiry:", response.statusText);
                alert("Failed to submit reply. Please try again later.");
            }
        })
        .catch(error => {
            console.error("Error replying to inquiry:", error);
            alert("Failed to submit reply. Please try again later.");
        });
} */