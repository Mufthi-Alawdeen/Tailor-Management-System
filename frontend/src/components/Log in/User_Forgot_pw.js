import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Logo from "../Inquiry/Img/MSR.png"

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false); // Flag to track OTP verification
  const [error, setError] = useState('');

  const handleCheckEmail = async () => {
    try {
      const response = await axios.post('http://localhost:8075/onlineuser/check-email', { Email: email });
      setEmailExists(response.data.exists);
      if (response.data.exists) {
        setError('');
      } else {
        setError('Email does not exist. Please enter a valid email.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  const handleSendOTP = async () => {
    try {
      const otpResponse = await axios.post('http://localhost:8075/onlineuser/send-otp', { email });
      if (otpResponse.status === 200) {
        setOtpSent(true);
        setError('');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post('http://localhost:8075/onlineuser/verify-otp', { otp, email });
      if (response.data && response.data.success) {
        // OTP verified successfully, allow password update
        setOtpVerified(true); // Set the flag to true after OTP verification
        setError('');
      } else {
        setError('Failed to verify OTP. Please try again.');
      }
    } catch (error) {
      setError('Failed to verify OTP. Please try again.');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await axios.put(`http://localhost:8075/onlineuser/update-password/${email}`, { newPassword });
      if (response.status === 200) {
        // Password updated successfully
        setError('');
        // Display SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your password has been reset.',
        }).then(() => {
          // Redirect to login page
          window.location.href = '/login'; // Modify this to your login page URL
        });
      } else {
        setError('Failed to update password. Please try again.');
      }
    } catch (error) {
      setError('Failed to update password. Please try again.');
    }
  };

  return (
    <div >
      <div class="container" style={{display:'grid',marginBottom:'35px', width:'35%', border:'1px solid #ccc', padding:'30px', marginTop:'90px'}}> 
      <div>
      <img src={Logo} style={{ width: '80px', margin: '0 auto', display: 'block', marginTop:'5px',marginBottom:'10px' }}></img>
      </div>    
          <hr></hr>
      <h2 style={{textAlign:'center', marginBottom:'35px',textDecoration:'underline', marginTop:'10px'}}>Reset Password</h2>
      { !otpSent && (
        <div>
          <div class="form-group" style={{display:'grid',width:'100%'}} >
            <input style={{width:'100%', padding:'12px', marginBottom:'15px'}} type="email" class="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
          </div>
          <div style={{justifyContent:'center', display:'flex'}}>        
            <button style={{width:'30%',padding:'12px', fontWeight:'600', backgroundColor:'black', borderRadius:'0px', border:'none', marginTop:'10px'}} class="btn btn-primary" onClick={handleCheckEmail}>Check Email</button>
          </div>
        </div>
      )}
      {emailExists && !otpSent && (
        <div class="form-group" style={{justifyContent:'center', display:'flex'}}>
          <button style={{width:'30%',padding:'12px', fontWeight:'600', backgroundColor:'black', borderRadius:'0px', border:'none', marginTop:'15px'}}  class="btn btn-success" onClick={handleSendOTP}>Send OTP</button>
        </div>
      )}
      {emailExists && otpSent && !otpVerified && (
        <div class="form-group" style={{ display:'grid'}}>
          <input style={{width:'100%', padding:'12px', marginBottom:'15px'}} type="text" class="form-control" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
          <div style={{ display:'grid', justifyContent:'center'}}>
            <button style={{width:'100%',padding:'12px', fontWeight:'600', backgroundColor:'black', borderRadius:'0px', border:'none', marginTop:'15px'}} class="btn btn-primary" onClick={handleVerifyOTP}>Verify OTP</button>
          </div>
        </div>
      )}
      {emailExists && otpSent && otpVerified && (
        <div class="form-group"  style={{justifyContent:'center'}}>
          <label style={{marginBottom:'15px', fontWeight:'600'}}>Enter New Password </label>
          <input style={{width:'100%', padding:'12px', marginBottom:'15px'}} type="password" class="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Should be more than 6 characters" />
          <input style={{width:'100%', padding:'12px', marginBottom:'15px'}}type="password" class="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
          <div style={{ display:'grid', justifyContent:'center'}}>
            <button style={{width:'100%',padding:'12px', fontWeight:'600', backgroundColor:'black', borderRadius:'0px', border:'none', marginTop:'15px'}} class="btn btn-success" onClick={handleUpdatePassword}>Update Password</button>
          </div>
        </div>
      )}
      {error && <p class="text-danger">{error}</p>}
    </div>
    </div>

  );
};

export default ResetPassword;
