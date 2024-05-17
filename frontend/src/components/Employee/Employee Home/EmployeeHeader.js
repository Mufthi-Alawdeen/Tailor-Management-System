import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../res/MSRLogo.png"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Em_Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userDetails"));
  

    const handleLogout = () => {
        // Clear user details from local storage
        localStorage.removeItem("userDetails");
        // Redirect to the home page
        window.location.href = "/employee/login";
    };
    

    const handleLogin = () => {
        // Redirect back to the same path
        window.location.href = "/employee/login";
    };

    

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/">
                <img style={{marginLeft:'30px'}} src={logo} alt="Logo" width="60" />
            </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-center" id="navbarNavDropdown">
            <ul className="navbar-nav">

                    <li style={{marginLeft:'8px'}} className="nav-item">
                        <a className="nav-link" href="/employee/leaveRequest">Request Leave</a>
                    </li>
                    <li style={{marginLeft:'6px'}} className="nav-item">
                        <a className="nav-link" href="/employee/inventoryRequest">Inventory Request</a>
                    </li>
                    <li style={{marginLeft:'8px'}} className="nav-item">
                        <a className="nav-link" href="/employee/leave">Leaves</a>
                    </li>
            </ul>  
            </div>

            

            <div className="navbar-nav ml-auto" style={{marginRight:'10px'}}>

            <a style={{marginRight:'13px', fontSize:'20px'}} className="nav-link" href="/employee/profile">
                    <FontAwesomeIcon icon={faUser} />
            </a>

                {isLoggedIn ? (
                    <button className="logout" style={{marginRight:'15px', padding:'12px', backgroundColor:'black', color:'white', border:'none', fontWeight:'650'}} onClick={handleLogout}>
                        Log Out
                    </button>
                ) : (
                    <Link to="/employee/login">
                        <button className="login" style={{marginRight:'15px', padding:'12px', backgroundColor:'black', color:'white', border:'none', fontWeight:'650'}} onClick={handleLogin}>
                            Log In
                        </button>
                    </Link>
                )}
            
           
            </div>
        </nav>
    );
}

export default Em_Header;
