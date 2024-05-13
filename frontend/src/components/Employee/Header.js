import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import LOGO from "../assets/logo.webp";


function Header() {
    return (
        <div
            id="side_nav"
            className="d-flex flex-column flex-shrink-0 p-3 text-black" // Changed text color to black
        >
            {/* logo */}
            <a className="navbar-brand mx-3" href="/">
            <img id="logo-img"
                src={LOGO}
                alt="Emerald Bay" className="box"     />
            </a>

            <hr id="my-horizontal-line" className="my-horizontal-line" />

            <ul className="nav flex-column">
                <li id="option-link" className="nav-item mx-2 align-self-left">
                    <Link id="nav-link" to="/" className="nav-link option-link">
                        Employee Summary
                    </Link>
                </li>
                <li id="option-link" className="nav-item mx-2 align-self-left">
                    <Link id="nav-link" to="/Add" className="nav-link option-link">
                        Add Employee
                    </Link>
                </li>
                <li id="option-link" className="nav-item mx-2 align-self-left">
                    <Link  id="nav-link" to="/AdminLeaves" className="nav-link option-link">
                        Leaves
                    </Link>
                </li>
                <li id="option-link" className="nav-item mx-2 align-self-left">
                    <Link id="nav-link" to="/salaryreport" className="nav-link option-link">
                        Report
                    </Link>
                </li>
                <li><br/></li>
                <li><br/></li>
                <li><br/></li>
                <li><br/></li>
                <li><br/></li>
                <li><br/></li>
                <li><br/></li>
                <li><br/></li>
                <li><br/></li>
                <li><br/></li>
                <li><br/></li>
                <li className="nav-item mx-2 align-self-center">
                    <button
                        id="logout_btn"
                        className="btn "
                        // Add your logout function here
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Header;
