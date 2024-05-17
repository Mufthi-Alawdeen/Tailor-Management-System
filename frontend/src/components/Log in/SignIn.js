import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "./img/logo.png";
import Swal from 'sweetalert2';
import bgImage from "./img/signup.jpg";

const UserForm = () => {
  const [formData, setFormData] = useState({
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
      await axios.post("http://localhost:8075/onlineUser/addUser", formData);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Account created successfully!',
      }).then(() => {
        window.location.href = '/login';
      });
      setFormData({
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
      alert("An error occurred while adding the user. Check The Entered Contact Number and Password");
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
    <div
      className="position-relative d-flex align-items-center justify-content-center vh-500"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover' }}
    >
      <div className="position-absolute w-100 h-100" style={{ zIndex: -1 }}>
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        ></div>
      </div>
      <div className="container mt-5" style={{ marginBottom: '30px' }}>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card" style={{ padding: '15px', borderRadius: '0px', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className="card-body">
                <img src={Logo} style={{ width: '90px', margin: '0 auto', display: 'block', marginTop: '10px' }} alt="Logo" />
                <hr></hr>
                <h2 className="mb-4" style={{ textAlign: 'center' , color:'white'}}>Create Account</h2>
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label"style={{ color:'white'}} ><b>First Name:</b></label>
                      <input
                        type="text"
                        className="form-control"
                        name="FirstName"
                        value={formData.FirstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ color:'white'}}><b>Last Name:</b></label>
                      <input
                        type="text"
                        className="form-control"
                        name="LastName"
                        value={formData.LastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label" style={{ color:'white'}}><b>Email:</b></label>
                      <input
                        type="email"
                        className={`form-control ${errors.email && 'is-invalid'}`}
                        name="Email"
                        placeholder="example@g.com"
                        value={formData.Email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>
                    <div className="col-md-6">
  <label className="form-label" style={{ color:'white' }}><b>Contact Number:</b></label>
  <input
    type="text"
    className={`form-control ${errors.contactNumber && 'is-invalid'}`}
    placeholder="Must be 10 digits"
    name="ContactNumber"
    value={formData.ContactNumber}
    onChange={handleChange}
    onBlur={handleBlur}
    maxLength="10"
    pattern="\d*"
    required
  />
  {errors.contactNumber && (
    <div className="invalid-feedback">{errors.contactNumber}</div>
  )}
</div>

                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{ color:'white'}}><b>Address:</b></label>
                    <input
                      type="text"
                      className="form-control"
                      name="Address"
                      value={formData.Address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label" style={{ color:'white'}}><b>Password:</b></label>
                      <input
                        type="password"
                        className={`form-control ${errors.password && 'is-invalid'}`}
                        name="Password"
                        placeholder="Must be at least 6 characters long"
                        value={formData.Password}
                        onChange={handleChange}
                        required
                      />
                      {errors.password && (
                        <div className="invalid-feedback" style={{ color:'white'}}>{errors.password}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ color:'white'}}><b>Confirm Password:</b></label>
                      <input
                        type="password"
                        className={`form-control ${errors.confirmPassword && 'is-invalid'}`}
                        name="ConfirmPassword"
                        value={formData.ConfirmPassword}
                        onChange={handleChange}
                        required
                      />
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        border: 'none',
                        marginBottom: '30px',
                        display: 'block',
                        margin: '0 auto',
                        width: '40%',
                        padding: '17px',
                        backgroundColor: '#a60202',
                        borderRadius: '5px',
                        fontWeight: '650',
                        fontSize: '18px',
                        marginTop: '35px'
                      }}
                    >
                      Create Account
                    </button>
                  </div>
                </form>
                <p className="mt-3" style={{ textAlign: 'center', marginTop: '25px', color: 'white' }}>
                  Already have an account? <Link to="/login" style={{ color: 'white' }}><b>Sign In</b></Link>
                </p>
                <div style={{ marginTop: '30px' }}>
                  <p className="mt-3" style={{ textAlign: 'center', fontWeight: '600', fontSize: '17px', color: 'black' }}>
                    <Link to="/employee/signin" style={{ color: 'white' }}><b>Create An Employee Account</b></Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
