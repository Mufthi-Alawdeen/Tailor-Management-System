import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../Inquiry/Img/MSR.png"

const LoginForm = () => {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(
            "http://localhost:8075/onlineuser/login",
            formData
        );
        if (response.data.success && response.data.user) {
            // Save user details in local storage
            localStorage.setItem("loggedInUser", JSON.stringify(response.data.user));
            
            // Redirect to specific page based on user type
            if (response.data.user.Role === "Admin") {
                window.location.href = "/AdminDashboard"; // Redirect to admin dashboard page
            } else {
                window.location.href = "/Home"; // Redirect to default page for non-admin users
            }
        } else {
            setError("Invalid email or password");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        setError("An error occurred while logging in");
    }
};


  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="container mt-5" >
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card" style={{borderRadius:'0px', marginBottom:'30px' , padding:'20px' }}>
          <img src={Logo} style={{ width: '80px', margin: '0 auto', display: 'block', marginTop:'5px'}}></img>
          <hr></hr>
            <div className="card-body">
              <h2 className="mb-4" style={{textAlign:'center', textDecoration:'underline', marginTop:'-10px'}}>Login</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3" style={{display:'grid', marginLeft:'20px', marginTop:'40px'}}>
                  <label style={{fontWeight:'600', fontSize:'17px'}} className="form-label">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    required
                    style={{width:'95%', padding:'8px'}}
                  />
                </div>
                <div className="mb-3" style={{marginLeft:'20px', marginTop:'20px'}}>
                  <label style={{fontWeight:'600', fontSize:'17px'}} className="form-label">Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    name="Password"
                    value={formData.Password}
                    onChange={handleChange}
                    required
                    style={{width:'95%', padding:'8px'}}
                  />
                </div>
                <div style={{marginBottom:'30px'}}> 
                <button type="submit" className="btn btn-primary" style={{border:'none',display: 'block', margin: '0 auto', width:'26%', padding:'13px',backgroundColor:'black', borderRadius:'0px', fontWeight:'650', fontSize:'19px', marginTop:'35px'}}>
                  Login
                </button>
                </div>
              </form>
              <p className="mt-3" style={{textAlign:'center', marginTop:'25px'}}>
                Don't have an account? <Link to="/signin">Sign Up</Link>
              </p>
              <p className="mt-3" style={{textAlign:'center', marginTop:'25px'}}>
                Forgot your password? <Link to="/resetPW">Reset</Link>
              </p>
              <div style={{ marginTop:'35px'}}>
              <p className="mt-3" style={{textAlign:'center', fontWeight:'600', fontSize:'17px'}}>
                 <Link to="/employee/login"> Log In As An Employee</Link>
              </p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
 