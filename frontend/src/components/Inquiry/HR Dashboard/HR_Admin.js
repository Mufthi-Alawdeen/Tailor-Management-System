import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import styleAdmin from '../HR Dashboard/HR_Admin.module.css'; // CSS file
import Header from './Header';

function HRAdminDashboard() {
  return (
    <div>
        <Header/>
        <h2 className={styleAdmin.heading}>Human Resources</h2>
      <div className={styleAdmin.content}>
        <Link to="/inquiry/dashboard" ><button className={styleAdmin.btn1}> Inquiries </button> </Link> {/* Assuming "/admin" is the target route */}
        <Link to="/employee/dashboard" > <button className={styleAdmin.btn1}>Employees</button></Link>
      </div>
    </div>
  );
}

export default HRAdminDashboard;














