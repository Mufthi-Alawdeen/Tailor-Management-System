import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InventoryCss from './All_Inventory.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import MSR from '../Img/MSRLogo.png';

const InventoryTable = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [editItemId, setEditItemId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('all'); // Default search type is all
    const [filterType, setFilterType] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [editFormData, setEditFormData] = useState({
        color: '',
        received_stock: '',
        date: '',
        unit_price: '',
        retailer_name: '',
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchInventoryData();
    }, []);

    const fetchInventoryData = async () => {
        try {
            const response = await axios.get('http://localhost:8075/inventory/retrieve');
            setInventoryData(response.data);
        } catch (error) {
            console.error('Error fetching inventory data:', error);
        }
    };

    

    const handleEdit = (id) => {
        const selectedItem = inventoryData.find(item => item._id === id);
        setEditItemId(id);
        setEditFormData({
            color: selectedItem.color,
            received_stock: selectedItem.received_stock,
            date: selectedItem.date,
            unit_price: selectedItem.unit_price,
            retailer_name: selectedItem.retailer_name,
            name: selectedItem.name,
            description: selectedItem.description
        });
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (id) => {
        try {
            await axios.put(`http://localhost:8075/inventory/update/${id}`, editFormData);
            setEditItemId(null); // Close the popup after updating
            fetchInventoryData(); // Refresh data after update
            console.log('Item updated successfully');
            // Show success message after update
            Swal.fire({
                icon: 'success',
                title: 'Updated Successfully',
                text: 'Your item has been updated successfully.',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // Change the locale as per your requirement
    };

    const isLowStock = (type, availableStock) => {
        switch (type) {
            case 'Material':
                return availableStock < 100;
            case 'Button':
                return availableStock < 100;
            case 'Threads':
                return availableStock < 50;
            case 'Other':
                return availableStock < 30;
            default:
                return false;
        }
    };

    const handleNotificationIconClick = async () => {
        try {
            const response = await axios.get('http://localhost:8075/inventoryRequest/retrieve');
            const inventoryRequests = response.data.filter(request => request.status === 'Insufficient');
    
            if (inventoryRequests.length > 0) {
                const messages = inventoryRequests.map(request => {
                    return ` Need to restock ${request.material_type}, Color: ${request.color}, Requested by: ${request.requested_by} <span id="restock-${request._id}" style="cursor: pointer; color: red; font-weight: bold;">&#128465;</span>`;
                });
    
                const message = messages.join('<br>');
    
                Swal.fire({
                    title: 'Inventory Requests',
                    html: message,
                    showCancelButton: false,
                    showConfirmButton: false,
    
                    customClass: {
                        container: 'custom-swal-container',
                        content: 'custom-swal-content'
                    },
                    style: {
                        fontFamily: 'Arial, sans-serif',
                        padding: '40px'
                    }
                });
    
                // Add event listeners to the restock icons
                inventoryRequests.forEach(request => {
                    const restockIcon = document.getElementById(`restock-${request._id}`);
                    if (restockIcon) {
                        restockIcon.addEventListener('click', () => {
                            confirmRestock(request._id);
                        });
                    }
                });
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'No Inventory Requests',
                    text: 'There are no insufficient inventory requests at the moment.',
                    confirmButtonText: 'OK',
                    customClass: {
                        container: 'custom-swal-container',
                        content: 'custom-swal-content',
                        confirmButton: 'custom-swal-confirm-button'
                    },
                    style: {
                        fontFamily: 'Arial, sans-serif',
                        padding: '20px'
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching inventory requests:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch inventory requests. Please try again later.',
                confirmButtonText: 'OK',
                customClass: {
                    container: 'custom-swal-container',
                    content: 'custom-swal-content',
                    confirmButton: 'custom-swal-confirm-button'
                },
                style: {
                    fontFamily: 'Arial, sans-serif',
                    padding: '20px'
                }
            });
        }
    };
    
    const confirmRestock = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure the product is restocked?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            });
    
            if (result.isConfirmed) {
                await restockRequest(id);
            }
        } catch (error) {
            console.error('Error confirming restock:', error);
            Swal.fire('Error', 'Failed to confirm restock. Please try again later', 'error');
        }
    };
    
    const restockRequest = async (id) => {
        try {
            await fetch(`http://localhost:8075/inventoryRequest/delete/${id}`, { method: 'DELETE' });
            Swal.close();
            // Optionally, you can add more actions after the request is restocked
        } catch (error) {
            console.error('Error restocking request:', error);
            Swal.fire('Error', 'Failed to restock request. Please try again later', 'error');
        }
    };
    
    
    

    const truncateDescription = (description) => {
        const words = description.split(' ');
        if (words.length > 2) {
          return `${words.slice(0, 2).join(' ')} ...`;
        }
        return description;
    };



    const handleDelete = async (id) => {
        try {
            const confirmation = await Swal.fire({
                title: 'Are you sure?',
                text: 'Once deleted, you will not be able to recover this item!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });

            if (confirmation.isConfirmed) {
                await axios.delete(`http://localhost:8075/inventory/delete/${id}`);
                Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
                fetchInventoryData();
                console.log('Item deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
            const year = date.getFullYear().toString();
        
            return `${day}/${month}/${year}`;
        };
        
    };

    const [selectedDescription, setSelectedDescription] = useState('');

    const handleDescriptionClick = (description) => {
            setSelectedDescription(description);
    };

    
    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
    };

    const handleSearchTypeChange = (event) => {
        const selectedSearchType = event.target.value;
        setSearchType(selectedSearchType);
        if (selectedSearchType === 'all') {
            setSearchTerm('');
            setSearchResults([]);
        }
    };

    const handleSearch = () => {
        let filteredData = [...inventoryData];
        if (searchType !== 'all') {
            filteredData = inventoryData.filter(item => {
                const fieldValue = item[searchType];
                if (searchType === 'date') {
                    // Handle date search differently
                    const formattedDate = formatDate(fieldValue);
                    return formattedDate.toLowerCase().includes(searchTerm.toLowerCase());
                } else {
                    return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
                }
            });
        }
        setSearchResults(filteredData);
    };
    
    const filteredInventoryData = filterType
        ? inventoryData.filter(item => item.raw_material_type === filterType)
        : inventoryData;

    // Sort inventory by date in descending order
    const sortedInventoryData = searchResults.length > 0 ? searchResults : filteredInventoryData.sort((a, b) => new Date(b.date) - new Date(a.date));

    

    return (
        <div>
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f0f0f0'}}>
                <div className="logo">
                    <img src={MSR} alt="Logo" style={{ width: '70px', height: 'auto', marginLeft:'20px' }} />
                </div>

                <div style={{ display: 'flex', fontWeight:'700',alignItems: 'center',justifyContent: 'center' , marginTop:'5px', fontFamily:'serif', marginLeft:'40px'}}>
                    <p style={{color:'#d11002', fontSize:'26px' }}> MSR </p>
                    <p style={{color:'black', fontSize:'26px', marginLeft:'7px'}}> TAILORS </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={handleNotificationIconClick}>
                        <FontAwesomeIcon icon={faBell} style={{ color: 'white' }} />
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
                            marginLeft: '10px'
                        }}>
                        Logout
                    </button>
            
                </div>
                
            </div>

        <h1 style={{textAlign:'center', marginTop:'40px', marginBottom:'20px', textDecoration:'underline', fontWeight:'675'}}>Current Stocks</h1>

           
           

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', color: 'gray' , marginTop:'50px' }}>
        <div style={{ display: 'flex', alignContent: 'center', gap:'10px' }}>

        <input

                type="text"
                placeholder={`Search by ${searchType}`}
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch();}}
                style={{width:'210%' , padding:'7px', height:'100%'}}
            />
        
        <select value={searchType} onChange={handleSearchTypeChange} style={{ padding: '8px', border: '1px solid #ccc', cursor: 'pointer', fontSize: '14px' }}>
            <option value="all">All</option>
            <option value="date">Date</option>
            <option value="productId">Product ID</option>
            <option value="color">Color</option>
        </select>
    </div>

    <p style={{marginLeft:'10px', marginTop:'10px'}}> | </p>
     <select value={filterType} onChange={handleFilterChange} style={{ width:'150px', padding: '8px', border: '1px solid #ccc', cursor: 'pointer', fontSize: '14px', marginLeft: '10px' }}>
        <option value="">Filter by type</option>
        <option value="Material">Material</option>
        <option value="Button">Button</option>
        <option value="Threads">Threads</option>
        <option value="Other">Other</option>
        </select>
    </div>

    <div style={{display:'flex', justifyContent:'center', marginBottom:'65px'}}>
            <Link to="/inventory/addinventory" style={{ textDecoration: 'none' }}>
                    <button
                        className="Btn"
                        style={{
                            width: '200px',
                            height: '40px',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: 'black',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
                            marginLeft: '10px',
                        }}
                    >
                        + Add New Stock
                    </button>
                </Link>
                        
                <Link to="/inventory/records" style={{ textDecoration: 'none' }}>
                    <button
                        className="Btn"
                        style={{
                            width: '200px',
                            height: '40px',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: 'black',
                            color: 'white',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
                            marginLeft: '20px'
                        }}
                    >
                         All Records
                    </button>
                </Link>
            </div>
                

                {['Material', 'Button', 'Threads', 'Other'].map(type => (
                    <div key={type} style={{marginLeft:'10px', marginRight:'10px'}}>
                        <h2 style={{marginTop:'30px' , marginBottom:'25px' , marginLeft:'10px' , textDecoration:'underline' , textAlign:'center'}}>{type} Stocks</h2>
                        <table className={InventoryCss.all_table} >
                        <thead>
                            <tr >
                                <th className={InventoryCss.table_head}>Product ID</th>
                                <th className={InventoryCss.table_head}>Raw Material Type</th>
                                <th className={InventoryCss.table_head}>Color</th>
                                {type === 'Other' && <th className={InventoryCss.table_head}>Type</th>}
                                <th className={InventoryCss.table_head}>Received Stock {type === 'Material' ? '(in meters)' : type === 'Button' ? '(count)' : type === 'Threads' ? '(Rolls)' : ''}</th>
                                <th className={InventoryCss.table_head}>Used Stock</th>
                                <th className={InventoryCss.table_head}>Available Stock</th>
                                <th className={InventoryCss.table_head}>Date</th>
                                <th className={InventoryCss.table_head}>Unit Price</th>
                                <th className={InventoryCss.table_head}>Retailer Name</th>
                                <th className={InventoryCss.table_head}>Description</th>
                                <th className={InventoryCss.table_head}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                {sortedInventoryData.map(item => (
                    item.raw_material_type === type && item.received_stock - item.used_stock > 0 && (
                        <tr key={item._id} style={{ backgroundColor: isLowStock(type, item.received_stock - item.used_stock) ? '#ffadad' : 'inherit' }}>
                            <td className={InventoryCss.table_details}>{item.productId}</td>
                            <td className={InventoryCss.table_details}>{item.raw_material_type}</td>
                            <td className={InventoryCss.table_details}>{item.color}</td>
                            {type === 'Other' && <td className={InventoryCss.table_details} >{item.name}</td>}
                            <td className={InventoryCss.table_details}>{item.received_stock} </td>
                            <td className={InventoryCss.table_details}>{item.used_stock}</td>
                            <td className={InventoryCss.table_details}>{item.received_stock - item.used_stock}</td>
                            <td className={InventoryCss.table_details}>{formatDate(item.date)}</td>
                            <td className={InventoryCss.table_details}>{item.unit_price}</td>
                            <td className={InventoryCss.table_details}>{item.retailer_name}</td>
                            <td className={InventoryCss.table_details} style={{ cursor: 'pointer' }} onClick={() => handleDescriptionClick(item.description)}>
                                {truncateDescription(item.description)}
                            </td>
                            <td className={InventoryCss.table_details}>
                                <div style={{ display: 'flex' }}>
                                    <button type="submit" style={{ border: 'none', backgroundColor: 'black', color: 'white', padding: '7px', marginLeft: '2px' }} onClick={() => handleEdit(item._id)}>Update</button>
                                    <button onClick={() => handleDelete(item._id)} style={{ backgroundColor: 'white', color: 'black', marginLeft: '8px', padding: '6px' }}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    )
                ))}
            </tbody>

                        </table>
                        {selectedDescription && (
                            <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '1000' }}>
                                <div className="modal-content" style={{ backgroundColor: 'white', padding: '20px', width: '30%' , textAlign:'center'}}>
                                    <h3 style={{fontSize:'23px' , marginBottom:'10px'}}>Description</h3>
                                    <p style={{fontSize:'18px', marginBottom:'20px'}}>{selectedDescription}</p>
                                    <button onClick={() => setSelectedDescription('')} style={{ backgroundColor: 'black', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>Close</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            
            {editItemId && (
            <div className={InventoryCss.popup} >
                <div className={InventoryCss.popup_content}>
                    <h2 className={InventoryCss.headtext} >Edit Item</h2>
                        <form onSubmit={() => handleUpdate(editItemId)} style={{ display: 'grid', gap: '5px' }}>
                            <div style={{display:'flex', gap:'10px'}}>
                                <label style={{ fontWeight: 'bold' }}>Color:</label>
                                <select name="color" value={editFormData.color} onChange={handleEditChange} required style={{ width: '60%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }}>
                                    <option value="">Select a color</option>
                                    <option value="Red">Red</option>
                                    <option value="Blue">Blue</option>
                                    <option value="Green">Green</option>
                                    <option value="Yellow">Yellow</option>
                                    <option value="Orange">Orange</option>
                                    <option value="Purple">Purple</option>
                                    <option value="Pink">Pink</option>
                                    <option value="Brown">Brown</option>
                                    <option value="Gray">Gray</option>
                                    <option value="Black">Black</option>
                                </select>

                                <label style={{ fontWeight: 'bold' }}>Received Stock:</label>
                                <input type="text" name="received_stock" value={editFormData.received_stock} onChange={handleEditChange} required style={{ width: '60%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }} />
                            </div>
                        
                            <div>
                                <label style={{ fontWeight: 'bold' }}>Date:</label>
                                <input type="date" name="date" onChange={handleEditChange} required style={{ width: '50%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none'  }} />
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>Unit Price:</label>
                                <input type="text" placeholder='Rs.' name="unit_price" value={editFormData.unit_price} onChange={handleEditChange} required style={{ width: '50%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>Retailer Name:</label>
                                <input type="text" name="retailer_name" value={editFormData.retailer_name} onChange={handleEditChange} required style={{ width: '60%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }} />
                            </div>
                            {editFormData.name && (
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>Name:</label>
                                    <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }} />
                                </div>
                            )}
                            <div>
                                <label style={{ fontWeight: 'bold' }}>Description:</label>
                                <textarea type="text" name="description" value={editFormData.description} onChange={handleEditChange} style={{ width: '80%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-around' , marginTop:'10px' }}>
                            <button onClick={() => handleUpdate(editItemId)} type="submit" style={{ width: '45%', padding: '10px 0', borderRadius: '1px', border: 'none', backgroundColor: 'black', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Update</button>

                                <button onClick={() => setEditItemId(null)} style={{ width: '45%', padding: '10px 0', borderRadius: '1px', border: 'none', backgroundColor: 'gray', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
            </div>
            )}
        </div>
    );
};

export default InventoryTable;
