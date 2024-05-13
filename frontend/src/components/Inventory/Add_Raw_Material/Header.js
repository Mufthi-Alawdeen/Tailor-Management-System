import React, { useState, useEffect, useRef } from 'react';
import MSRLogo from '../Img/MSRLogo.png';


function Header2() {
    
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
                        <optgroup label="Products">
                            <option value="">Product</option>
                            <option value="/product/dashboard">Dashboard</option>
                            <option value="/product/add">Upload Product</option>
                            <option value="/product/generate-report">Generate Report</option>
                            <option value="/product/all">Preview All Products</option>
                            <option value="/product/buyproducts">Buy Products</option>
                            <option value="/product/rentproducts">Rent Products</option>
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
                        <optgroup label="Inquiries">
                            <option value="">Inquiry</option>
                            <option value="/inquiry/dashboard">Dashboard</option>
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
                        <optgroup label="Orders">
                            <option value="">Orders</option>
                            <option value="/orders/received">Received Orders</option>
                            <option value="/orders/processed">Processed Orders</option>
                            <option value="/orders/completed">Completed Orders</option>
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
                        <optgroup label="Retail">
                            <option value="">Retail</option>
                            <option value="/retail/sales">Sales</option>
                            <option value="/retail/inventory">Inventory</option>
                            <option value="/retail/reports">Reports</option>
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
                        <optgroup label="Inventory">
                            <option value="">Inventory</option>
                            <option value="/inventory/dashboard">Dashboard</option>
                            <option value="/inventory/addinventory">Add new Inventory</option>
                            <option value="/inventory/request">Manage Inventory Request</option>
                            <option value="/inventory/all">Manage Inventory</option>

                            
                        </optgroup>
                    </select>
               
                </div>
            )}
            {/* Header */}
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#f0f0f0'}}>
                <div className="logo">
                <img src={MSRLogo} alt="Logo" style={{ width: '70px', height: 'auto', marginLeft:'40px' }} />
                </div>

                <div><h2 style={{textAlign:'center' , fontSize:'30px' , fontFamily:' sans-serif', fontWeight:'600'}}>Inventory</h2></div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer' }}>
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
                            marginLeft: '10px'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Header2;