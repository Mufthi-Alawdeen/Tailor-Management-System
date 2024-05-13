import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import style0 from '../Inquiry Dashboard/InquiryDashboard.module.css';
import Header from '../../Product/Header';
import axios from 'axios';

const InquiryDashboard = () => {
    const [inquiries, setInquiries] = useState([]);
    const [totalInquiries, setTotalInquiries] = useState(0);
    const [repliedCount, setRepliedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const response = await axios.get("http://localhost:8075/inquiry/retrieve");
            setInquiries(response.data);
            const currentDate = new Date();
            const currentDateString = currentDate.toISOString().slice(0, 10); // Get the current date in YYYY-MM-DD format
            const filteredInquiries = response.data.filter(inquiry => inquiry.createdAt.slice(0, 10) === currentDateString);
            setTotalInquiries(filteredInquiries.length);
            const repliedInquiries = filteredInquiries.filter(inquiry => inquiry.Reply !== "PENDING");
            setRepliedCount(repliedInquiries.length);
            setPendingCount(filteredInquiries.length - repliedInquiries.length);
        } catch (error) {
            console.error("Error fetching inquiries:", error);
        }
    };

    return (
        <div>
            <div>
                <Header />
            </div>
            <div className={style0.heading1}>
                <h1>Inquiry Dashboard</h1>
            </div>

            <div className={style0.button_container}>
                    <Link style={{textDecoration:'none'}} to="/inquiry/hradmin/inquiries" className={style0.dashboard_button1}>
                        View and Reply To Inquiries
                    </Link>
                    <Link style={{textDecoration:'none', marginLeft:'150px'}} to="/inquiry/report" className={style0.dashboard_button1}>
                        Summary Report
                    </Link>
            </div>

            <div className={style0.inquiry_summary_container}>
                <h2>Today's Summary</h2>
                <div className={style0.summary_item}>
                    <div className={style0.item}>
                        <h3>Total Received </h3>
                        <div className={style0.item_value}>
                            <p style={{ margin: '0' ,fontWeight:'650',fontSize:'22px'}}>{totalInquiries}</p>
                        </div>
                    </div>
                    <div className={style0.item} style={{marginLeft:'35px'}}>
                        <h3>Replied Inquiries</h3>
                        <div className={style0.item_value}>
                            <p style={{ margin: '0' ,fontWeight:'650',fontSize:'22px'}}>{repliedCount}</p>
                        </div>
                    </div>
                    <div className={style0.item}>
                        <h3>Pending Inquiries</h3>
                        <div className={style0.item_value}>
                            <p style={{ margin: '0' ,fontWeight:'650',fontSize:'22px'}}>{pendingCount}</p>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default InquiryDashboard;
