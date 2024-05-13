import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from 'react-modal'; // Import your preferred modal library
import "./AllLeaves.css";
import Em_Header from "../Employee Home/EmployeeHeader";

// This is the page where employee can view submitted leaves 

export default function AllLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isLeaveDetailsModalOpen, setIsLeaveDetailsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [Eid, setEid] = useState("");

// Fetch leaves based on Eid from local storage
useEffect(() => {
  const loggedInUserDetails = localStorage.getItem("userDetails");
  if (loggedInUserDetails) {
    const userDetails = JSON.parse(loggedInUserDetails);
    const loggedInEmployeeId = userDetails.Eid;
    if (loggedInEmployeeId) {
      setEid(loggedInEmployeeId);
    }
  }
}, []);

// Fetch leaves based on Eid
useEffect(() => {
  async function getLeavesByEid() {
    try {
      if (Eid) {
        // Fetch leaves based on Eid
        const res = await axios.get(`http://localhost:8075/leave/getByEid/${Eid}`);
        setLeaves(res.data.leaves);
      }
    } catch (err) {
      
    }
  }
  // Call the function to fetch leaves by Eid
  getLeavesByEid();
}, [Eid]); // Ensure to include Eid in the dependency array




  // Configure modal styles (optional)
  Modal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  Modal.defaultStyles.content.backgroundColor = '#fff';

  // Update leave function
  const handleUpdate = (leave) => {
    openUpdateModal();
    // Perform the update operation on the leave data
    // After updating, refresh the list of leaves and close the modal
  };

  // Define state variables for the update form
  const [leaveType, setleaveType] = useState("");
  const [dateFrom, setdateFrom] = useState("");
  const [dateTo, setdateTo] = useState("");
  const [description, setdescription] = useState("");


  

  const handleLeaveClick = (leave) => {
    setSelectedLeave(leave);
    openLeaveDetailsModal();
  };

  // Open the update modal and populate the form fields
  const openUpdateModal = () => {
    if (selectedLeave) {
      setleaveType(selectedLeave.leaveType);
      setdateFrom(selectedLeave.dateFrom);
      setdateTo(selectedLeave.dateTo);
      setdescription(selectedLeave.description);
      setIsUpdateModalOpen(true);
    }
  };

  // Close the update modal
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  // Handle form submission and update Leave details
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Create an object with updated Leave details
    const updatedLeave = {
      leaveType,
      dateFrom,
      dateTo,
      description,
    };
    try {
      // Make a PUT request to update the leave data
      await axios.put(`http://localhost:8075/leave/update/${selectedLeave._id}`, updatedLeave);

      // Refresh the list of Leaves
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave1) =>
          leave1._id === selectedLeave._id ? { ...leave1, ...updatedLeave } : leave1
        )
      );

      // Close the modal
      closeUpdateModal();

      // Notify the user of successful update
      alert(`Leave has been successfully updated.`);
    } catch (err) {
      console.error("Error updating leave data:", err);
      alert("An error occurred while updating the leave data. Please try again later.");
    }
  };

  ///delete leaves
const handleDelete = async (leave) => {
  // Confirmation dialog before deleting
  const confirmDelete = window.confirm(`Are you sure you want to delete leave ${leave.empId}?`);

  if (confirmDelete) {
    try {
      // Make a DELETE request to the server
      await axios.delete(`http://localhost:8070/leave/delete/${leave._id}`);
      
      // Remove the deleted leave from the state
      setLeaves((prevLeaves) => prevLeaves.filter(leave1 => leave1._id !== leave._id));
      
      // Close the modal after deletion
      setSelectedLeave(null);
      
      // Notify the user of successful deletion
      alert(`Leave ${leave.empId} has been successfully deleted.`);
    } catch (err) {
      console.error("Error deleting leave:", err);
      alert("An error occurred while deleting the leave. Please try again later.");
    }
  }
};

  const openLeaveDetailsModal = () => {
    setIsLeaveDetailsModalOpen(true);
  };

  const closeLeaveDetailsModal = () => {
    setIsLeaveDetailsModalOpen(false);
    setSelectedLeave(null);
  };

  // Function to format date in yyyy-mm-dd format
  const formatDate = (dateString) => {
    if (dateString) {
      return dateString.slice(0, 10); // Extract yyyy-mm-dd
    } else {
      // Handle the case where dateString is undefined (e.g., return an empty string)
      return "";
    }
  }; 
  // Truncate description to show only first 3 words followed by "..."
const truncateDescription = (description) => {
  const words = description.split(' ');
  if (words.length > 3) {
    return words.slice(0, 3).join(' ') + '...';
  }
  return description;
};

  return (
    <div> 
      <Em_Header/>
    
    <div id="All_details_container" className="container">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center">
              <h3 className="card-title m-b-0">Your Leave Requests </h3>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col" onClick={() => {}}>Leave Type</th>
                    <th scope="col" onClick={() => {}}>Date From</th>
                    <th scope="col">Date To</th>
                    <th scope="col">Description</th>
                    <th scope="col">Leave Status</th>
                    {/*  <th scope="col">Rejection Reason</th>*/}
                    
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((leave, index) => (
                    <tr key={leave._id}>
                      <td onClick={() => handleLeaveClick(leave)}>{index + 1}</td>
                      <td onClick={() => handleLeaveClick(leave)}>{leave.leaveType}</td>
                      <td>{formatDate(leave.dateFrom)}</td>
                      <td>{formatDate(leave.dateTo)}</td>
                      <td>{truncateDescription(leave.description)}</td> 
                      <td>{leave.leaveStatus}</td>
                    {/*  <td>{leave.rejectionReason}</td>*/}
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isLeaveDetailsModalOpen}
        onRequestClose={closeLeaveDetailsModal}
        style={Modal.defaultStyles}
        contentLabel="Leave Details"
      >
        <div className="modal-content">
          <h2 id="Headeremp2">{selectedLeave?.leaveType} Details</h2>
          <table id="leave-details" className="leave-details-table">
            <tbody>
              <tr>
                <td id="table-row"><b>Leave Type:</b></td>
                <td id="table-row2">{selectedLeave?.leaveType}</td>
              </tr>
              <tr>
                <td id="table-row"><b>Date From:</b></td>
                <td id="table-row2">{formatDate(selectedLeave?.dateFrom)}</td>
              </tr>
              <tr>
                <td id="table-row"><b>Date To:</b></td>
                <td id="table-row2">{formatDate(selectedLeave?.dateTo)}</td>
              </tr>
              <tr>
                <td id="table-row"><b>Description:</b></td>
                <td id="table-row2">{selectedLeave?.description}</td>
              </tr>
              <tr>
                <td id="table-row"><b>Leave Status:</b></td>
                <td id="table-row2">{selectedLeave?.leaveStatus}</td>
              </tr>
            {/*}  <tr>
                <td id="table-row"><b>Rejection Reason:</b></td>
                <td id="table-row2">{selectedLeave?.rejectionReason}</td>
              </tr>*/}
              
            </tbody>
          </table>
        </div>
        {/* Button group at the bottom */}
        <div id="button-group" className="button-group">
          <button id="button-4" onClick={() => closeLeaveDetailsModal(null)} className="btn btn-secondary">
            <b>Cancel</b>
          </button>
          <button id="button-27" onClick={() => handleUpdate(selectedLeave)} className="btn btn-primary">
              Update
          </button>
          <button id="button-27" onClick={() => handleDelete(selectedLeave)} className="btn btn-danger">
              Delete
          </button>
        </div>
      </Modal>
      {/* Update leave Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={closeUpdateModal}
        style={Modal.defaultStyles}
        contentLabel="Update Leave"
      >
        <div className="modal-content">
          <h3 id="Headeremp" >Update Leave</h3>
          {/* Add form fields here for updating the leave */}
          {/* Form to update leave details */}
          
          <form onSubmit={handleFormSubmit} className="form-control">
            
            {/* leaveType */}
            <div className="form-group">
              <label htmlFor="leaveType">Leave Type</label>
              <select
                        className="form-control"
                        id="leaveType"
                        value={leaveType} // Bind the current value of leaveType
                        onChange={(e) => setleaveType(e.target.value)}
                    >
                        <option value="">Select Leave Type</option> {/* Placeholder option */}
                        <option value="Personal Emergency">Personal Emergency</option>
                        <option value="Medical Leave">Medical Leave</option>
                        <option value="Work Related">Work Related</option>
                        <option value="Other">Other</option>
                    </select>
            </div>
            {/* dateFrom */}
            <div className="form-group">
              <label htmlFor="dateFrom">Date From</label>
              <input type="date" id="dateFrom" value={dateFrom}
                onChange={(e) => setdateFrom(e.target.value)}
                className="form-control" placeholder={formatDate(selectedLeave?.dateFrom)}
              />
            </div>
            {/* Date to */}
            <div className="form-group">
              <label htmlFor="dateTo">Date To</label>
              <input type="date" id="dateTo" value={dateTo}
                onChange={(e) => setdateTo(e.target.value)}
                className="form-control" placeholder={formatDate(selectedLeave?.dateTo)}
              />
            </div>
            {/* description */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input type="text" id="description" value={description}
                onChange={(e) => setdescription(e.target.value)}
                className="form-control" placeholder={selectedLeave?.description}
              />
            </div>
            
            {/* Submit button */}
            <div className="form-group">
              <button id="button-27" type="submit" className="btn btn-primary">
                Update
              </button>
            </div>
          </form>

          {/*Button to close the update modal */}
              <button id="button-44" onClick={closeUpdateModal} className="btn">
               <b>Cancel</b>
              </button>
            </div>
      </Modal>
    </div>
    </div>
  );
}
