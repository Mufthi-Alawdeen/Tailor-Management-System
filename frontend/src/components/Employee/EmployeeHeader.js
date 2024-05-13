import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import LOGO from "../Inquiry/Img/MSR.png";


function EmployeeHeader() {
    return (
        <div
            id="side_nav"
            className="d-flex flex-column flex-shrink-0 p-3 text-black" //Changed text color to black
        >
            {/* logo */}
            <a className="navbar-brand mx-3" href="/">
            <img id="logo-img"
                src={LOGO}
                alt="Emerald Bay" className="box"     />
            </a>

            <hr id="my-horizontal-line" className="my-horizontal-line" />

            <ul className="nav flex-column">
                <div class="dropdown show">
                <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Dropdown link
                </a>

                <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <Link id="nav-link" to="/EmployeePage" className="nav-link option-link">
                        Submit Leave
                    </Link>
                </div>
                </div>
            
                {/*<li id="option-link" className="nav-item mx-2 align-self-left">
                    <Link id="nav-link" to="/EmployeePage" className="nav-link option-link">
                        Submit Leave
                    </Link>
                </li>*/}
                
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

export default EmployeeHeader;
