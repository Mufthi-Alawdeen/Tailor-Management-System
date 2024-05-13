import React, { useState } from "react";
import axios from "axios";
import SideBar from '../../Product/Header'

export default function AddEmployee() {
  const [fname, setfName] = useState("");
  const [lname, setlName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setpNumber] = useState("");
  const [DOB, setDOB] = useState("");
  const [jobrole, setjobrole] = useState("");
  const [hireDate, sethireDate] = useState("");
  const [salary, setsalary] = useState("");

  function sendData(e) {
    // sending data to backend
    e.preventDefault();
    const newEmployee = {
      fname,
      lname,
      address,
      email,
      phoneNumber,
      DOB,
      jobrole,
      hireDate,
      salary,
    };

    axios
      .post("http://localhost:8075/employee/add", newEmployee)
      .then(() => {
        alert("Employee added");

        // Clear form fields after successful submission
        setfName("");
        setlName("");
        setAddress("");
        setEmail("");
        setpNumber("");
        setDOB("");
        setjobrole("");
        sethireDate("");
        setsalary("");
      })
      .catch((err) => {
        console.error(err);
        alert("Error adding employee: " + err.message);
      });
  }

  // Function to get today's date in yyyy-mm-dd format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Add leading zero if month/day is single digit
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }

    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <SideBar />

      <div
        id="Add_Employees_container"
        className="container"
        style={{
          backgroundColor: "white",
          width: "50%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          display: "flex",
          marginBottom: "40px",
          marginTop: "80px",
          boxShadow: "0px 5px 13px rgba(0, 0, 0, 0.1)",
          marginLeft: "330px",
        }}
      >
        <h3
          align="center"
          style={{ marginBottom: "40px", marginTop: "40px", textDecoration: "underline" }}
        >
          {" "}
          Add An Employee
        </h3>
        <form onSubmit={sendData} style={{ width: "80%", padding: "10px", marginLeft: "40px" }}>
          {/*//fname,lname,address,phoneNumber,Email,*/}
          <div className="form-group" style={{ marginBottom: "25px" }}>
            <label for="fname" style={{ marginBottom: "8px" }}>
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="fname"
              placeholder="Enter First Name"
              value={fname}
              onChange={(e) => setfName(e.target.value)}
              style={{ width: "85%" }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: "25px" }}>
            <label for="lname" style={{ marginBottom: "8px" }}>
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="lname"
              placeholder="Enter last Name"
              value={lname}
              onChange={(e) => setlName(e.target.value)}
              style={{ width: "85%" }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: "25px" }}>
            <label for="address" style={{ marginBottom: "8px" }}>
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="address"
              placeholder="Enter Employee address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "85%" }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: "25px", display: "grid" }}>
            <label for="email" style={{ marginBottom: "8px" }}>
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter Employee Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "85%" }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: "25px" }}>
            <label for="phoneNumber" style={{ marginBottom: "8px" }}>
              Phone Number
            </label>
            <input
              type="number"
              className="form-control"
              id="phoneNumber"
              placeholder="Enter Employee phone"
              value={phoneNumber}
              onChange={(e) => setpNumber(e.target.value)}
              style={{ width: "85%" }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "25px" }}>
            <label for="DOB" style={{ marginBottom: "8px" }}>
              Date of Birth
            </label>
            <input
              type="date"
              className="form-control"
              id="DOB"
              placeholder="Enter join date"
              max={getCurrentDate()} // Restrict future dates
              value={DOB}
              onChange={(e) => setDOB(e.target.value)}
              style={{ width: "85%" }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: "25px" }}>
            <label htmlFor="jobrole" style={{ marginBottom: "8px" }}>
              Employee Role
            </label>
            <select
              className="form-control"
              id="jobrole"
              value={jobrole} // Bind the current value of jobrole
              style={{ width: "85%" }}
              onChange={(e) => setjobrole(e.target.value)}
            >
              <option value="">Select Employee Role</option>{" "}
              {/* Placeholder option */}
              <option value="Tailor">Tailor</option>
              <option value="Admin Staff">Admin Staff</option>
              <option value="Delivery Driver">Delivery Driver</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Cashier">Cashier</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: "25px" }}>
            <label for="hireDate" style={{ marginBottom: "8px" }}>
              Employee Hire Date
            </label>
            <input
              type="date"
              className="form-control"
              id="hireDate"
              placeholder="Enter Hire Date"
              value={hireDate}
              onChange={(e) => sethireDate(e.target.value)}
              style={{ width: "85%" }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: "25px" }}>
            <label for="salary" style={{ marginBottom: "8px" }}>
              Employee Salary
            </label>
            <input
              type="number"
              className="form-control"
              id="salary"
              placeholder="Enter Employee salary"
              value={salary}
              onChange={(e) => setsalary(e.target.value)}
              style={{ width: "85%" }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-dark"
            style={{ borderRadius: "0px", backgroundColor: "black", padding: "10px", width: "20%" }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
