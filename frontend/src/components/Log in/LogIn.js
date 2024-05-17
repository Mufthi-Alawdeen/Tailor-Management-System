import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "./img/logo.png";
import bgImage from "./img/loginbg.jpg";

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
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify(response.data.user)
        );
        if (response.data.user.Role === "Admin") {
          window.location.href = "/AdminDashboard";
        } else {
          window.location.href = "/";
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
    <div
      className="position-relative d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover" }}
    >
      <div className="position-absolute w-100 h-100" style={{ zIndex: -1 }}>
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.002)",
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        ></div>
      </div>
      <div
        className="card shadow-lg border-0 rounded p-4"
        style={{
          maxWidth: "400px",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          marginTop: "50px",
          marginBottom: "50px",
        }}
      >
        <div className="card-body text-white">
          <img
            src={Logo}
            alt="Logo"
            className="mb-3 mx-auto d-block"
            style={{ width: "75px" }}
          />
          <h2 className="text-center mb-3">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control shadow-sm bg-transparent text-white"
                id="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                placeholder="Email"
                style={{ borderBottom: "1px solid white", color: "white" }}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control shadow-sm bg-transparent text-white"
                id="password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                placeholder="Password"
                style={{ borderBottom: "1px solid white", color: "white" }}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                border: "1px solid white",
              }}
            >
              Login
            </button>
          </form>
          <div style={{ marginTop: "30px" }}>
            <p className="text-center mt-3">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-white"
                style={{ textDecoration: "none" }}
              >
                <b>Sign Up</b>
              </Link>
            </p>
            <p className="text-center">
              Forgot your password?{" "}
              <Link
                to="/resetPW"
                className="text-white"
                style={{ textDecoration: "none" }}
              >
                <b>Reset</b>
              </Link>
            </p>
            <div style={{ marginTop: "30px" }}>
              <p className="text-center mt-3">
                <Link
                  to="/employee/login"
                  className="text-white"
                  style={{ textDecoration: "none" }}
                >
                  <b>Log In As An Employee</b>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
