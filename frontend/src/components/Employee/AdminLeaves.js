import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from '../Product/Header';

// This will display all leaves in admin

export default function AdminLeaves() {
    const [leaves, setLeaves] = useState([]);
    const [selectedDescription, setSelectedDescription] = useState("");

    useEffect(() => {
        async function getLeaves() {
            try {
                const res = await axios.get("http://localhost:8075/leave");
                setLeaves(res.data);
            } catch (err) {
                console.error("Error fetching leaves data:", err);
                alert("An error occurred while fetching leaves data. Please try again later.");
            }
        }
        getLeaves();
    }, []);

    // Handle click on description to show popup with full description
    const handleDescriptionClick = (description) => {
        setSelectedDescription(description);
        // Show popup here (e.g., using a modal)
        // You can implement a modal component to show the full description
        // For example, using a library like Bootstrap modal
        // You can manage the visibility state of the modal using another state variable
    };

    // Truncate description to show only first 3 words followed by "..."
    const truncateDescription = (description) => {
        const words = description.split(' ');
        if (words.length > 3) {
            return words.slice(0, 3).join(' ') + '...';
        }
        return description;
    };

    // Function to format date in yyyy-mm-dd format
    const formatDate = (dateString) => {
        return dateString.slice(0, 10); // Extract yyyy-mm-dd
    };

    // Approve leave function
    const handleApproveLeave = async (leaveId, Eid) => {
        try {
            await axios.put(`http://localhost:8075/leave/update/${leaveId}`, {
                leaveStatus: "Approved",
                Eid:Eid
            });

            setLeaves(prevLeaves =>
                prevLeaves.map(leave =>
                    leave._id === leaveId ? { ...leave, leaveStatus: "Approved" } : leave
                )
            );
        } catch (err) {
            console.error("Error approving leave:", err);
            alert("An error occurred while approving leave. Please try again later.");
        }
    };

    // Reject leave function
    const handleRejectLeave = async (leaveId, Eid) => {
        try {
            await axios.put(`http://localhost:8075/leave/update/${leaveId}`, {
                leaveStatus: "Rejected",
                Eid:Eid
            });

            setLeaves(prevLeaves =>
                prevLeaves.map(leave =>
                    leave._id === leaveId ? { ...leave, leaveStatus: "Rejected" } : leave
                )
            );
        } catch (err) {
            console.error("Error rejecting leave:", err);
            alert("An error occurred while rejecting leave. Please try again later.");
        }
    };

    return (
        <div> 
            <Header/>
        <div id="All_details_container" className="container">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body text-center" style={{marginTop:'15px'}}>
                            <h4 style={{textDecoration:'underline'}} className="card-title m-b-0">Pending Leaves</h4>
                        </div>
                        <div className="table-responsive">
                            <table id="pending_table" className="table">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Employee ID</th>
                                        <th scope="col">Leave Reason</th>
                                        <th scope="col">Date From</th>
                                        <th scope="col">Date To</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Leave Status</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves
                                        .filter(leave => leave.leaveStatus === "Pending")
                                        .map((leave, index) => (
                                            <tr key={leave._id}>
                                                <td>{index + 1}</td>
                                                <td>{leave.Eid}</td>
                                                <td>{leave.leaveType}</td>
                                                <td>{formatDate(leave.dateFrom)}</td>
                                                <td>{formatDate(leave.dateTo)}</td>
                                                <td>
                                                    {/* Show truncated description and handle click */}
                                                    <span
                                                        style={{ cursor: "pointer", textDecoration: "underline" }}
                                                        onClick={() => handleDescriptionClick(leave.description)}
                                                    >
                                                        {truncateDescription(leave.description)}
                                                    </span>
                                                </td>
                                                <td>{leave.leaveStatus}</td>
                                                <td>
                                                    {/* Approve button */}
                                                    <button
                                                        style={{ width: 95 }}
                                                        onClick={() => handleApproveLeave(leave._id, leave.Eid)}
                                                        className="btn btn-primary btn-dark"
                                                    >
                                                        Approve
                                                    </button>
                                                    {/* Reject button */}
                                                    <button
                                                        style={{ width: 95, marginLeft: 6 }}
                                                        onClick={() => handleRejectLeave(leave._id, leave.Eid)}
                                                        className="btn btn-primary btn-danger"
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                        <hr></hr>
                        <div className="card-body text-center">
                            <h4 style={{textDecoration:'underline'}} className="card-title m-b-0">Approved Leaves</h4></div>
                        <div className="table-responsive">
                            <table id="Approved_table" className="table">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Employee ID</th>
                                        <th scope="col">Leave Reason</th>
                                        <th scope="col">Date From</th>
                                        <th scope="col">Date To</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Leave Status</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves
                                        .filter(leave => leave.leaveStatus === "Approved")
                                        .map((leave, index) => (
                                            <tr key={leave._id}>
                                                <td>{index + 1}</td>
                                                <td>{leave.Eid}</td>
                                                <td>{leave.leaveType}</td>
                                                <td>{formatDate(leave.dateFrom)}</td>
                                                <td>{formatDate(leave.dateTo)}</td>
                                                <td>
                                                    {/* Show truncated description and handle click */}
                                                    <span
                                                        style={{ cursor: "pointer", textDecoration: "underline" }}
                                                        onClick={() => handleDescriptionClick(leave.description)}
                                                    >
                                                        {truncateDescription(leave.description)}
                                                    </span>
                                                </td>
                                                <td>{leave.leaveStatus}</td>
                                                <td>
                                                    {/* Reject button */}
                                                    {leave.leaveStatus !== "Rejected" && (
                                                        <button style={{width:95}} onClick={() => handleRejectLeave(leave._id, leave.Eid)} className="btn btn-primary btn-danger">Reject</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                        <hr></hr>
                        <div className="card-body text-center">
                            <h4 style={{textDecoration:'underline'}} className="card-title m-b-0">Rejected Leaves</h4></div>
                        <div style={{marginTop:20}} className="table-responsive">
                            <table id="Rejected_table" className="table">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Employee ID</th>
                                        <th scope="col">Leave Reason</th>
                                        <th scope="col">Date From</th>
                                        <th scope="col">Date To</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Leave Status</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves
                                        .filter(leave => leave.leaveStatus === "Rejected")
                                        .map((leave, index) => (
                                            <tr key={leave._id}>
                                                <td>{index + 1}</td>
                                                <td>{leave.Eid}</td>
                                                <td>{leave.leaveType}</td>
                                                <td>{formatDate(leave.dateFrom)}</td>
                                                <td>{formatDate(leave.dateTo)}</td>
                                                <td>
                                                    {/* Show truncated description and handle click */}
                                                    <span
                                                        style={{ cursor: "pointer", textDecoration: "underline" }}
                                                        onClick={() => handleDescriptionClick(leave.description)}
                                                    >
                                                        {truncateDescription(leave.description)}
                                                    </span>
                                                </td>
                                                <td>{leave.leaveStatus}</td>
                                                <td>
                                                    {/*  Approve button */}
                                                    {leave.leaveStatus !== "Approved" && (
                                                        <button style={{width:95}} onClick={() => handleApproveLeave(leave._id, leave.Eid)} className="btn btn-primary btn-dark">Approve</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal or Popup to show full description */}
            {selectedDescription && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Full Description</h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={() => setSelectedDescription("")}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>{selectedDescription}</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedDescription("")}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal backdrop */}
            {selectedDescription && <div className="modal-backdrop fade show"></div>}
        </div>
        </div>
    );
}
