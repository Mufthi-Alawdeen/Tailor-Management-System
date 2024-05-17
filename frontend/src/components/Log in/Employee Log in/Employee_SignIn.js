import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../../Inquiry/Img/MSR.png";
import Swal from 'sweetalert2';

const AddEmployeeForm = () => {
  const [formData, setFormData] = useState({
    Eid: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    eid: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { Eid } = formData;
  
    try {
      // Check if Eid exists in the Employee database
      const employeeResponse = await axios.get(`http://localhost:8075/employee/getby/${Eid}`);
  
      if (!employeeResponse.data.exists) {
        // Eid doesn't exist in the Employee database
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Employee ID does not exist.',
        });
      } else {
        // No account exists, proceed with creating the account
        await axios.post('http://localhost:8075/employeeAccount/add', formData);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Employee account created successfully',
        }).then(() => {
          // Redirect to the login page after clicking OK in the SweetAlert
          window.location.href = '/employee/login';
        });
  
        setFormData({
          Eid: '',
          firstName: '',
          lastName: '',
          password: '',
          confirmPassword: '',
        });
        setErrors({
          eid: '',
          password: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while adding the employee',
      });
    }
  };
  
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateEid = (eid) => {
    const regex = /^[eE][\d]{3}$/;
    return regex.test(eid);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';

    if (name === 'Eid' && !validateEid(value)) {
      errorMessage = 'Eid must start with E digits';
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
          <div className="card" style={{padding:'10px', borderRadius:'0px'}}>
            <div className="card-body">
            <img src={Logo} style={{ width: '80px', margin: '0 auto', display: 'block', marginTop:'10px'}}></img>
          <hr></hr>
              <h2 className="mb-4"style={{textAlign:'center'}}>Create Account</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Employee ID:</label>
                  <input
                    type="text"
                    className={`form-control ${errors.eid && 'is-invalid'}`}
                    name="Eid"
                    value={formData.Eid}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    placeholder='Must Starts With "EID with Following Digits"'
                  />
                  {errors.eid && <div className="invalid-feedback">{errors.eid}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">First Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder='Must be more than 6 characters'
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{border:'none',marginBottom:'30px',display: 'block', margin: '0 auto', width:'40%', padding:'15px',backgroundColor:'black', borderRadius:'5px', fontWeight:'650', fontSize:'18px', marginTop:'30px'}}>
                 Create Account
                </button>
              </form>
              <p className="mt-3" style={{textAlign:'center'}}>
                Already have an account? <Link to="/employee/login">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
