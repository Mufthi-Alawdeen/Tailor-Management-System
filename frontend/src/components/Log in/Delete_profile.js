import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Logo from "../Inquiry/Img/MSR.png"

const DeleteAccount = () => {
  const [reason, setReason] = useState('');
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    setLoggedInUser(user);
  }, []);

  const handleDeleteAccount = async () => {
    // Show confirmation prompt
    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover your account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
    });

    // If user confirms deletion
    if (confirmed.isConfirmed) {
      try {
        // Get user ID from local storage
        const userId = loggedInUser._id; // Get the object ID of the user

        // Send request to delete user account
        const response = await axios.delete(`http://localhost:8075/onlineuser/deleteUser/${userId}`);

        // Check response status and show message
        if (response.status === 200) {
          // Remove user from local storage
          localStorage.removeItem("loggedInUser");

          // Show success alert
          await Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'User account deleted successfully',
          });

          // Redirect to login page or homepage
          window.location.href = '/login'; // Replace with actual URL
        } else {
          // Show error alert
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete user account',
          });
        }
      } catch (error) {
        console.error('Error deleting user account:', error);
        // Show error alert
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred. Please try again later.',
        });
      }
    }
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    setShowDeleteButton(e.target.value !== '');
  };

  // Don't render the component if there is no logged-in user
  if (!loggedInUser) {
    return null;
  }

  return (
    <div class="container" style={{width:'40%', justifyContent:'center', display:'grid', border:'1px solid #ccc', marginTop:'120px'}}>
    <div class="row justify-content-center">
    <img src={Logo} style={{ width: '100px', margin: '0 auto', display: 'block', marginTop:'20px',marginBottom:'10px' }}></img>
          <hr></hr>
      <div class="containerDelete">
        <h2 style={{marginBottom:'20px', marginTop:'5px', textAlign:'center', textDecoration:'underline'}}>Delete Account</h2>
        <form>
          <label style={{marginBottom:'15px', marginTop:'10px', fontWeight:'600', fontSize:'17px'}}for="reason">Reason For Deletion:</label>
          <select style={{width:'100%',marginBottom:'30px'}} id="reason" class="form-control" value={reason} onChange={handleReasonChange}>
            <option value="">Select a reason</option>
            <option value="No longer using the service">No longer using the service</option>
            <option value="Privacy concerns">Privacy concerns</option>
            <option value="Other">Other</option>
          </select>
          <div style={{justifyContent:'center', display:'flex'}}> 
          {showDeleteButton && <button style={{marginBottom:'20px', marginTop:'-8px', padding:'12px', fontWeight:'600', backgroundColor:'black', borderRadius:'0px'}} type="button" class="btn btn-danger" onClick={handleDeleteAccount}>Delete Account</button>} 
          </div>
          
        </form>
      </div>
    </div>
  </div>
  
  );
};

export default DeleteAccount;
