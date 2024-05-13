import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs'; // Import bcrypt library
import Header from "../Inquiry/Contact Us/UserHeader";
import { Link } from "react-router-dom";

// The page won't render without a login user

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState(null); // State to hold updated details
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (loggedInUser) {
          const userId = loggedInUser.UserID;
          const response = await axios.get(`http://localhost:8075/onlineuser/getUserByUserID/${userId}`);
          setUserDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Error fetching user details");
      }
    };
    
    fetchUserDetails();
  }, []);
  
  if (!userDetails) {
    return null; // Do not render anything if userDetails is null
  }
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({ ...updatedDetails, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleUpdatePassword = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const userId = loggedInUser.UserID;

      // Verify if current password matches the hashed password
      const { currentPassword, newPassword, confirmPassword } = passwords;
      const isPasswordMatch = await bcrypt.compare(currentPassword, userDetails.Password);

      if (!isPasswordMatch) {
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Current password is incorrect.',
        });
      }

      // Check if new password and confirm password match
      if (newPassword !== confirmPassword) {
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'New password and confirm password must match.',
        });
      }

      // Hash the new password before updating
      const hashedPassword = await bcrypt.hash(newPassword, 10); // Adjust the saltRounds as needed

      // Update the password
      await axios.put(`http://localhost:8075/onlineuser/updateUserByUserID/${userId}`, {
        Password: hashedPassword, // Assuming server expects 'Password' field for password update
      });

      // Clear the input fields
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      // Show success notification
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Your password has been updated.',
      });

    } catch (error) {
      console.error("Error updating password:", error);
      setError("Error updating password");
    }
  };

  const handleUpdateDetails = async () => {
    try {
      // Implement updating other details here
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const userId = loggedInUser.UserID;

      await axios.put(`http://localhost:8075/onlineuser/updateUserByUserID/${userId}`, updatedDetails);
       
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Your details have been updated.',
      });
    } catch (error) {
      console.error("Error updating details:", error);
      setError("Error updating details");
    }
  };

  const handlePasswordChangeRequest = () => {
    setShowPasswordFields(true);
  };

  return (
    <div>
      <Header/>
    <div className="container mt-5"style={{marginBottom:'40px'}}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card" style={{borderRadius:'0px',padding:'13px'}}>
            <div className="card-body">
              <h2 className="mb-4" style={{textAlign:'center', marginBottom:'20px', marginTop:'10px'}}>User Profile</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {userDetails && (
                <>
                  <div className="mb-3">
                    <label className="form-label">First Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="FirstName"
                      value={updatedDetails?.FirstName || userDetails.FirstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="LastName"
                      value={updatedDetails?.LastName || userDetails.LastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3" style={{display:'grid'}}>
                    <label className="form-label">Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      name="Email"
                      value={updatedDetails?.Email || userDetails.Email}
                      onChange={handleInputChange}
                      style={{width:'100%'}}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Address"
                      value={updatedDetails?.Address || userDetails.Address}
                      onChange={handleInputChange}
                    />

                  <hr />
                  <div style={{display:'flex', justifyContent:'space-between'}}> 
                  <button className="btn btn-primary" 
                  style={{backgroundColor:'black', color:'white', padding:'10px', border:'none', borderRadius:'0px'}}
                  onClick={handleUpdateDetails}>
                    Update Details
                  </button>

                  <Link to="/delete"><button style={{backgroundColor:'black', color:'white', padding:'13px', border:'none', borderRadius:'0px'}}>Delete Account</button></Link>
                  </div>
                  </div>

                 
                  
                  {/* Add more fields as needed */}
                  {showPasswordFields && (
                    <div className="mt-4">
                      <h4>Change Password</h4>
                      <div className="mb-3">
                        <label className="form-label">Current Password:</label>
                        <input
                          type="password"
                          className="form-control"
                          name="currentPassword"
                          value={passwords.currentPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">New Password:</label>
                        <input
                          type="password"
                          className="form-control"
                          name="newPassword"
                          value={passwords.newPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Confirm New Password:</label>
                        <input
                          type="password"
                          className="form-control"
                          name="confirmPassword"
                          value={passwords.confirmPassword}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      <button className="btn btn-primary" 
                      style={{backgroundColor:'black', color:'white', padding:'10px', border:'none', borderRadius:'0px'}}
                      onClick={handleUpdatePassword}>
                        Update Password
                      </button>
                    </div>
                  )}
                  {!showPasswordFields && (
                    <button className="btn btn-primary"
                    style={{backgroundColor:'black', color:'white', padding:'10px', border:'none', borderRadius:'0px'}}
                    onClick={handlePasswordChangeRequest}>
                      Update Password
                    </button>
                  )}
                  
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserProfile;
