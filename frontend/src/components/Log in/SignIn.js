import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../Inquiry/Img/MSR.png"

const UserForm = () => {
  const [formData, setFormData] = useState({
    UserID: "",
    FirstName: "",
    LastName: "",
    Email: "",
    Address: "",
    ContactNumber: "",
    Type: "Online",
    Role: "User",
    Password: "",
    ConfirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.Password !== formData.ConfirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }
    try {
      await axios.post("http://localhost:8075/onlineuser/addUser", formData);
      alert("User added successfully");
      setFormData({
        UserID: "",
        FirstName: "",
        LastName: "",
        Email: "",
        Address: "",
        ContactNumber: "",
        Type: "Online",
        Role: "User",
        Password: "",
        ConfirmPassword: "",
      });
      setErrors({
        email: "",
        contactNumber: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      alert("An error occurred while adding the user. Check The Entered Conatct Number and Password");
    }
  };

  const handleChange = (e) => {
  const { name, value } = e.target;
  let errorMessage = "";

  if (name === "Email" && !validateEmail(value)) {
    errorMessage = "Invalid email address";
  } else if (name === "ContactNumber" && !validateContactNumber(value)) {
    errorMessage = "Contact number must be 10 digits";
  } else if (name === "Password" && value.length < 6) {
    errorMessage = "Password must be at least 6 characters long";
  } else if (name === "ConfirmPassword" && value !== formData.Password) {
    errorMessage = "Passwords do not match";
  }

  setFormData((prevFormData) => ({
    ...prevFormData,
    [name]: value,
  }));

  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: errorMessage,
  }));
};


  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateContactNumber = (contactNumber) => {
    const regex = /^\d{10}$/;
    return regex.test(contactNumber);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";
  
    if (name === "Email" && !validateEmail(value)) {
      errorMessage = "Invalid email address";
    } else if (name === "ContactNumber" && !validateContactNumber(value)) {
      errorMessage = "Contact number must be 10 digits";
    } else if (name === "Password" && value.length < 6) {
      errorMessage = "Password must be at least 6 characters long";
    }
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };
  

  return (
    <div className="container mt-5" style={{marginBottom:'30px'}}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card" style={{padding:'10px', borderRadius:'0px', padding:'15px'}}>
            <div className="card-body">
            <img src={Logo} style={{ width: '80px', margin: '0 auto', display: 'block', marginTop:'10px'}}></img>
          <hr></hr>
              <h2 className="mb-4" style={{textAlign:'center'}}>Create Account</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">First Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3" style={{display:'grid'}}>
                  <label className="form-label">Email:</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email && "is-invalid"}`}
                    name="Email"
                    placeholder="example@g.com"
                    value={formData.Email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    style={{width:'100%'}}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Address:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Address"
                    value={formData.Address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contact Number:</label>
                  <input
                    type="number"
                    className={`form-control ${
                      errors.contactNumber && "is-invalid"
                    }`}
                    placeholder="Must be 10 digits"
                    name="ContactNumber"
                    value={formData.ContactNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {errors.contactNumber && (
                    <div className="invalid-feedback">
                      {errors.contactNumber}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Password:</label>
                  <input
                    type="password"
                    className={`form-control ${
                      errors.password && "is-invalid"
                    }`}
                    name="Password"
                    placeholder="Must be at least 6 characters long"
                    value={formData.Password}
                    onChange={handleChange}
                    required
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password:</label>
                  <input
                    type="password"
                    className={`form-control ${
                      errors.confirmPassword && "is-invalid"
                    }`}
                    name="ConfirmPassword"
                    value={formData.ConfirmPassword}
                    onChange={handleChange}
                    required
                  />
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
                <div> 
                <button type="submit" className="btn btn-primary" style={{border:'none',marginBottom:'30px',display: 'block', margin: '0 auto', width:'40%', padding:'17px',backgroundColor:'black', borderRadius:'0px', fontWeight:'650', fontSize:'18px', marginTop:'35px'}}>
                  Create Account
                </button>
                </div>
              </form>
              <p className="mt-3" style={{textAlign:'center', marginTop:'25px'}}>
                Already have an account? <Link to="/">Sign In</Link>
              </p>
              <div style={{ marginTop:'30px'}}>
              <p className="mt-3" style={{textAlign:'center', fontWeight:'600', fontSize:'17px'}}>
              <Link to="/employee/signin"> Create An Employee Account</Link>
              </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
