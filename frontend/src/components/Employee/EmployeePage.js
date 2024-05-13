import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeHeader"; // Assuming this imports styles for the header
import Em_Header from "./Employee Home/EmployeeHeader";

// This is the page to submit leaves

export default function EmployeesPage() {
  const initialFormState = {
    Eid: "",
    leaveType: "",
    dateFrom: "",
    dateTo: "",
    description: "",
    leaveStatus: "Pending",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    // Retrieve user details from local storage
    const loggedInUserDetails = localStorage.getItem("userDetails");
    if (loggedInUserDetails) {
      const userDetails = JSON.parse(loggedInUserDetails);
      setFormData({ ...formData, Eid: userDetails.Eid });
      console.log("Eid value:", userDetails.Eid);
    }
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  function sendData(e) {
    e.preventDefault();

    const newLeave = { ...formData }; // Create a copy of formData to avoid mutation

    axios
      .post("http://localhost:8075/leave/add", newLeave)
      .then(() => {
        alert("Leave added");
        setFormData(initialFormState); // Reset form state to clear fields
      })
      .catch((err) => {
        console.error(err);
        alert("Error adding leave: " + err.message);
      });
  }

  return (
    <div>
      <Em_Header/>
      <div id="Leaves_container" className="container" style={{marginTop:'20px', marginBottom:'50px', padding:'20px'}}>
        <h2 style={{textAlign:'center', textDecoration:'underline', marginBottom:'30px'}}>Add Leave</h2>
        <form onSubmit={sendData} style={{ maxWidth: "500px", margin: "0 auto" }}>
          <input
            type="hidden"
            className="form-control"
            id="empId"
            placeholder="Enter Employee ID"
            value={formData.Eid} // Bind value from state
            readOnly // Prevent editing
          />
          <div className="form-group">
            <label htmlFor="dateFrom" style={{ marginBottom: "5px", display: "block" }}>Date From</label>
            <input
              type="date"
              className="form-control"
              id="dateFrom"
              placeholder="Enter Date"
              value={formData.dateFrom} // Bind value from state
              onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateTo" style={{ marginBottom: "5px", display: "block" }}>Date To</label>
            <input
              type="date"
              className="form-control"
              id="dateTo"
              placeholder="Enter Date"
              value={formData.dateTo} // Bind value from state
              onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="leaveType" style={{ marginBottom: "5px", display: "block" }}>Leave type</label>
            <select
              className="form-control"
              id="leaveType"
              value={formData.leaveType} // Bind value from state
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            >
              <option value="">Select Leave Type</option>
              <option value="Personal Emergency">Personal Emergency</option>
              <option value="Medical Leave">Medical Leave</option>
              <option value="Work Related">Work Related</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description" style={{ marginBottom: "5px", display: "block" }}>Description</label>
            <textarea
              type="text"
              className="form-control"
              id="description"
              placeholder="Enter Leave description"
              value={formData.description} // Bind value from state
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
          </div>
          <div className="form-group">
            <input
              type="hidden"
              className="form-control"
              id="leaveStatus"
              value="Pending"
              readOnly
            />
          </div>
          <button type="submit" className="btn btn-primary btn-dark" style={{ width: "100%", padding: "10px", fontSize: "16px" }}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
