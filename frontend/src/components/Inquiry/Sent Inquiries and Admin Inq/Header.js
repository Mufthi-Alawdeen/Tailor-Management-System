import React, { useState, useEffect, useRef } from 'react';
import MSRLogo from '../Img/MSR.png';


function Header() {
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        // Function to handle click outside of sidebar
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };

        // Add event listener for clicks outside of sidebar
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup function to remove event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={toggleSidebar}
                style={{
                    position: 'absolute',
                    top: '15px',
                    left: '10px',
                    zIndex: '999',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer'
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#333"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
            {isSidebarOpen && (
                <div  ref={sidebarRef}  style={{ fontFamily: 'Arial', backgroundColor: 'rgba(240, 240, 240, 0.9)'
                , padding: '10px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', width: '200px', position: 'absolute', top: '0', left: '0' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <br></br>
                        <br></br>
                    </div>
                    <select
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                            outline: 'none',
                            appearance: 'none',
                            cursor: 'pointer',
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            color: '#333',
                            marginBottom: '10px' // Add margin bottom
                        }}
                        onChange={(e) => window.location.href = e.target.value}
                    >
                      
                            <option value="">Dashboard</option>
                       
                    </select>     
                    
                    <select
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                            outline: 'none',
                            appearance: 'none',
                            cursor: 'pointer',
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            color: '#333',
                            marginBottom: '10px' // Add margin bottom
                        }}
                        onChange={(e) => window.location.href = e.target.value}
                    >
                        <optgroup label="Inquiries">
                            <option value="">Inquiry</option>
                            <option value="/inquiry/hradmin/inquiries">Received Inquiry</option>
                            <option value="/inquiry/report">Generate Report</option>
                        </optgroup>
                    </select>
                    
                    
                    <select
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            backgroundColor: '#fff',
                            outline: 'none',
                            appearance: 'none',
                            cursor: 'pointer',
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            color: '#333',
                            marginBottom: '10px' // Add margin bottom
                        }}
                        onChange={(e) => window.location.href = e.target.value}
                    >
                        <optgroup label="Employees">
                            <option value="">Employees</option>
                            <option value="/employees/list">Employee List</option>
                            <option value="/employees/add">Add Employee</option>
                            <option value="/employees/payroll">Payroll</option>
                        </optgroup>
                    </select>
                    
               
                </div>
            )}
            {/* Header */}
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f0f0f0', flexGrow: 1 }}>
                <div className="logo">
                    <img src={MSRLogo} alt="Logo" style={{ width: '50px', height: 'auto', marginLeft: '30px' }} />
                </div>

                <div className="header-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Your header content */}
                    {/* Input container */}
                    <div className="InputContainer" style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(255, 255, 255)', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', paddingLeft: '15px', boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.075)' }}>
                        <input type="text" name="text" className="input" id="input" placeholder="Search" style={{ width: '170px', height: '100%', border: 'none', outline: 'none', fontSize: '0.9em', caretColor: 'rgb(255, 81, 0)' }} />
                        <label htmlFor="input" className="labelforsearch" style={{ cursor: 'text', padding: '0px 12px' }}>
                            <svg viewBox="0 0 512 512" className="searchIcon" style={{ width: '13px' }}>
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                            </svg>
                        </label>
                        <div className="border" style={{ height: '40%', width: '1.3px', backgroundColor: 'rgb(223, 223, 223)' }}></div>
                        <button className="micButton" style={{ border: 'none', backgroundColor: 'transparent', height: '40px', cursor: 'pointer', transitionDuration: '.3s', width: '40px' }}>
                            <svg viewBox="0 0 384 512" className="micIcon" style={{ width: '12px' }}>
                                <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <button
                    className="Btn"
                    style={{
                        width: '100px',
                        height: '40px',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: 'black',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
                        transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s'
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Header;