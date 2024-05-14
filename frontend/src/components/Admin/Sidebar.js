import React from "react";
import DashBoard from "./AdminDash";
import { FaCartPlus, FaRegUser } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { BsPeopleFill, BsClipboardPlusFill } from "react-icons/bs";
import { BiSolidSpreadsheet } from "react-icons/bi";
import { GoHomeFill } from "react-icons/go";
import { LuMessagesSquare } from "react-icons/lu";
import logo from "../../res/MSRLogo.png";

function handleSignOut() {
  // Remove the loggedInUser details from local storage
  localStorage.removeItem("loggedInUser");
}

function Ad_Dashboard() {
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-light">
          <div
            style={{ marginTop: "15px" }}
            className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100"
          >
            <a
              href="/AdminDashboard"
              className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-black text-decoration-none"
            >
              <img
                src={logo}
                alt="Logo"
                style={{ width: "60px", height: "auto", marginTop: "-5px" }}
              />
            </a>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <a
                href="/AdminDashboard"
                data-bs-toggle="collapse"
                className="nav-link px-0 align-middle text-black"
              >
                <div
                  style={{
                    display: "flex",
                    marginTop: "15px",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  <i className="fs-4 bi-speedometer2"></i>
                  <GoHomeFill />
                  <div style={{ marginLeft: "5px" }}>
                    {" "}
                    <span className="ms-1 d-none d-sm-inline">
                      Dashboard
                    </span>{" "}
                  </div>
                </div>
                <hr></hr>
              </a>

              <li>
                <a
                  href="#submenu2"
                  data-bs-toggle="collapse"
                  className="nav-link px-0 align-middle text-black"
                >
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "8px",
                      fontWeight: "600",
                      marginTop: "-10px",
                    }}
                  >
                    <i className="fs-4 bi-speedometer2"></i>
                    <FaRegUser />
                    <div style={{ marginLeft: "5px" }}>
                      {" "}
                      <span className="ms-1 d-none d-sm-inline">
                        Users
                      </span>{" "}
                    </div>
                  </div>
                  <hr></hr>
                </a>
                <ul
                  className="collapse nav flex-column ms-1"
                  id="submenu2"
                  data-bs-parent="#menu"
                  style={{ marginTop: "-15px" }}
                >
                  <li className="w-100">
                    <a
                      href="/user/dashboard"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">User Dashboard</span>
                    </a>
                  </li>
                  <li className="w-100">
                    <a href="/user/all" className="nav-link px-0 text-danger">
                      <span className="d-none d-sm-inline">User Details</span>
                    </a>
                  </li>
                  <li>
                    <a
                      style={{ marginBottom: "10px" }}
                      href="/employee/allAccounts"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">
                        Employee Accounts
                      </span>
                    </a>
                    <hr></hr>
                  </li>
                </ul>
              </li>
              <li>
                <a
                  href="#submenu3"
                  data-bs-toggle="collapse"
                  className="nav-link px-0 align-middle text-black"
                >
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "8px",
                      fontWeight: "600",
                      marginTop: "-10px",
                    }}
                  >
                    <i className="fs-4 bi-speedometer2"></i>
                    <BsClipboardPlusFill />
                    <div style={{ marginLeft: "5px" }}>
                      {" "}
                      <span className="ms-1 d-none d-sm-inline">
                        Product
                      </span>{" "}
                    </div>
                  </div>
                  <hr></hr>
                </a>
                <ul
                  className="collapse nav flex-column ms-1"
                  id="submenu3"
                  data-bs-parent="#menu"
                  style={{ marginTop: "-15px" }}
                >
                  <li className="w-100">
                    <a
                      href="/product/dashboard"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">
                        Products Dashboard
                      </span>
                    </a>
                  </li>
                  <li className="w-100">
                    <a
                      href="/product/add"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">Add Product</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/product/all"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">
                        Preview Products
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      style={{ marginBottom: "10px" }}
                      href="/product/generate-report"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">Report</span>
                    </a>
                    <hr></hr>
                  </li>
                </ul>
              </li>
              <li>
                <a
                  href="#submenu4"
                  data-bs-toggle="collapse"
                  className="nav-link px-0 align-middle text-black"
                >
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "8px",
                      fontWeight: "600",
                      marginTop: "-10px",
                    }}
                  >
                    <i className="fs-4 bi-speedometer2"></i>
                    <FaCartPlus />
                    <div style={{ marginLeft: "5px" }}>
                      {" "}
                      <span className="ms-1 d-none d-sm-inline">
                        Orders & Rentals
                      </span>{" "}
                    </div>
                  </div>
                  <hr></hr>
                </a>
                <ul
                  className="collapse nav flex-column ms-1"
                  id="submenu4"
                  data-bs-parent="#menu"
                  style={{ marginTop: "-15px" }}
                >
                  <li className="w-100">
                    <a
                      href="/AddOrderNewUser"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">Add</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/ManageOrder"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">Manage</span>
                    </a>
                  </li>
                  <li>
                    <a
                      style={{ marginBottom: "10px" }}
                      href="/ReportOrder"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">Report</span>
                    </a>
                    <hr></hr>
                  </li>
                </ul>
              </li>
              <li>
                <a
                  href="#submenu5"
                  data-bs-toggle="collapse"
                  className="nav-link px-0 align-middle text-black"
                >
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "8px",
                      fontWeight: "600",
                      marginTop: "-10px",
                    }}
                  >
                    <i className="fs-4 bi-speedometer2"></i>
                    <BiSolidSpreadsheet />
                    <div style={{ marginLeft: "5px" }}>
                      {" "}
                      <span className="ms-1 d-none d-sm-inline">
                        Inventory
                      </span>{" "}
                    </div>
                  </div>
                  <hr></hr>
                </a>
                <ul
                  className="collapse nav flex-column ms-1"
                  id="submenu5"
                  data-bs-parent="#menu"
                  style={{ marginTop: "-15px" }}
                >
                  <li className="w-100">
                    <a
                      href="/inventory/dashboard"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">
                        Inventory Dashboard
                      </span>
                    </a>
                  </li>
                  <li className="w-100">
                    <a
                      href="/inventory/addinventory"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">Add New Stock</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/inventory/all"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">
                        Manage Inventory
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      style={{ marginBottom: "10px" }}
                      href="/inventory/report"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">Report</span>
                    </a>
                    <hr></hr>
                  </li>
                </ul>
              </li>
              <li>
                <a
                  href="#submenu6"
                  data-bs-toggle="collapse"
                  className="nav-link px-0 align-middle text-black"
                >
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "8px",
                      fontWeight: "600",
                      marginTop: "-10px",
                    }}
                  >
                    <i className="fs-4 bi-speedometer2"></i>
                    <LuMessagesSquare />
                    <div style={{ marginLeft: "5px" }}>
                      {" "}
                      <span className="ms-1 d-none d-sm-inline">
                        Inquiry
                      </span>{" "}
                    </div>
                  </div>
                  <hr></hr>
                </a>
                <ul
                  className="collapse nav flex-column ms-1"
                  id="submenu6"
                  data-bs-parent="#menu"
                  style={{ marginTop: "-15px" }}
                >
                  <li className="w-100">
                    <a
                      href="/inquiry/dashboard"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">
                        Inquiry Dashboard
                      </span>
                    </a>
                  </li>
                  <li className="w-100">
                    <a
                      href="/inquiry/hradmin/inquiries"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">
                        Manage Inquiries
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      style={{ marginBottom: "10px" }}
                      href="/inquiry/report"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">Report</span>
                    </a>
                    <hr></hr>
                  </li>
                </ul>
              </li>
              <li>
                <a
                  href="#submenu7"
                  data-bs-toggle="collapse"
                  className="nav-link px-0 align-middle text-black"
                >
                  <div
                    style={{
                      display: "flex",
                      fontWeight: "600",
                      marginTop: "-10px",
                    }}
                  >
                    <i className="fs-4 bi-speedometer2"></i>
                    <BsPeopleFill />
                    <div style={{ marginLeft: "5px" }}>
                      {" "}
                      <span className="ms-1 d-none d-sm-inline">
                        Employees
                      </span>{" "}
                    </div>
                  </div>
                  <hr></hr>
                </a>
                <ul
                  className="collapse nav flex-column ms-1"
                  id="submenu7"
                  data-bs-parent="#menu"
                  style={{ marginTop: "-15px" }}
                >
                  <li className="w-100">
                    <a
                      href="/employee/dashboard"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">
                        Employee Dashboard
                      </span>
                    </a>
                  </li>
                  <li className="w-100">
                    <a
                      href="/employee/add"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">Add Employees</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/employee/all"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">Employees List</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/employee/admin/leave"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">Manage Leaves</span>
                    </a>
                  </li>
                  <li>
                    <a
                      style={{ marginBottom: "10px" }}
                      href="#"
                      className="nav-link px-0 text-danger"
                    >
                      <span className="d-none d-sm-inline">Report</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            <hr />
            <div className="dropdown pb-4">
              <a
                href="#"
                className="d-flex align-items-center text-white text-decoration-none "
                id="dropdownUser1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div
                  style={{
                    display: "flex",
                    fontWeight: "650",
                    marginBottom: "20px",
                    color: "black",
                    fontSize: "25px",
                  }}
                >
                  <FaCircleUser />
                  <div
                    style={{
                      marginLeft: "3px",
                      color: "black",
                      fontSize: "18px",
                      marginTop: "3px",
                    }}
                  >
                    {" "}
                    <span className="d-none d-sm-inline mx-1">ADMIN</span>{" "}
                  </div>
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                <a className="dropdown-item" href="/" onClick={handleSignOut}>
                  Log out
                </a>
              </ul>
            </div>
          </div>
        </div>
        <div className="col py-3">
          <DashBoard />
        </div>
      </div>
    </div>
  );
}

export default Ad_Dashboard;
