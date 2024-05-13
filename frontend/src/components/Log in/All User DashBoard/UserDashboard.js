import React from 'react';
import { Link } from 'react-router-dom';
import styleUser from '../All User DashBoard/UserDashboard.module.css';
import Header from '../../Product/Header'

const UserDashboard = () => {
    return (
        <div>
            <div>
                <Header/>
            </div>
            <div className={styleUser.heading_2}>
            <h1>User Dashboard</h1>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop:'90px' }}>
                <Link to="/user/all" style={{ textDecoration: 'none' }}>
                    <button className={styleUser.button_2} >All User Accounts</button>
                </Link>
                <Link to="/employee/allAccounts" style={{ textDecoration: 'none' }}>
                    <button className={styleUser.button_2}  >All Employee Accounts</button>
                </Link>
            </div>
        </div>
    );
};



export default UserDashboard;
