import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QrSvg from '@wojtekmaj/react-qr-svg';
import Swal from 'sweetalert2';



const EmployeeForgotPassword = () => {
  const [Eid, setEid] = useState('');
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Function to generate a random OTP
  const generateOTP = () => {
    const randomOTP = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit OTP
    setOtp(randomOTP);
  };

  useEffect(() => {
    generateOTP(); // Generate OTP on component mount
  }, []);

  const handleEidSubmit = async () => {
    try {
      const response = await axios.get(`http://localhost:8075/employeeAccount/get/${Eid}`);
      if (response.data) {
        setShowOtp(true);
        setError('');
      } else {
        setError('Employee not found. Please try again with a valid Eid.');
      }
    } catch (error) {
      setError('An error occurred while checking Eid.');
    }
  };

  const handlePasswordResetConfirmation = () => {
    if (enteredOtp !== otp) {
      setError('Invalid OTP.');
      return;
    }

    // Prompt user to reset password
    setShowOtp(false);
    setResetSuccess(true);
    setError('');
  };

  
  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    try {
      // Update the password column only
      await axios.put(`http://localhost:8075/employeeAccount/updateBy/${Eid}`, { password: newPassword });
      
      
      // Assuming the update was successful without any error
      // Password updated successfully
      setResetSuccess(true);
      setError('');
      setNewPassword('');
      setConfirmPassword('');

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Password Has Been Reset',
      }).then(() => {
        // Redirect to login page
        window.location.href = "/employee/login";
      });

    } catch (error) {
      setError('An error occurred while resetting password.');
    }
  };
  
  
  
  

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
    <div>
      
      {!showOtp && !resetSuccess && (
        
        <div>
          <h2>Password Reset</h2>
          <input style={{width:'100%', padding:'15px', marginBottom:'20px', marginTop:'20px'}} type="text" value={Eid} onChange={(e) => setEid(e.target.value)} placeholder="Enter your Eid" />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button style={{padding:'15px', backgroundColor:'black', color:'white', border:'none'}} onClick={handleEidSubmit}>Submit</button>
          </div>

          {error && <p>{error}</p>}
        </div>
      )}
      {showOtp && (
        <div>
          <h2>Scan The QR Code From Your Mobile To Get The OTP </h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop:'40px' }}> {/* Center the content horizontally */}
          <div style={{ width: '200px' }}> {/* Set the width and center the container */}
            <QrSvg value={otp} />
          </div>
        </div>
        <div style={{display:'grid', justifyContent:'center', marginTop:'40px'}}>
          <input style={{padding:'12px'}} type="text" value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value)} placeholder="Enter OTP" />
          <button style={{padding:'12px' , marginTop:'20px', border:'none', backgroundColor:'black', color:'white'}} onClick={handlePasswordResetConfirmation}>Confirm</button>
          {error && <p>{error}</p>}
          </div>

        </div>
      )}
      {resetSuccess && (
        <div style={{display:'grid'}}>
          <label> Enter New Password</label>
          <input style={{padding:'12px', marginBottom:'20px', marginTop:'10px'}} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" />
          <label> Confirm Password</label>
          <input style={{padding:'12px', marginBottom:'20px', marginTop:'10px'}} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
          <button style={{padding:'12px' , marginTop:'20px', border:'none', backgroundColor:'black', color:'white'}}onClick={updatePassword}>Reset Password</button>
          {error && <p>{error}</p>}
        </div>
      )}
    </div>
  </div>
  );
};

export default EmployeeForgotPassword;
