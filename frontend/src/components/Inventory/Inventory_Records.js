import React, { useState, useEffect } from 'react';
import axios from 'axios';
import inventoryCss from '../Inventory/All_Inventory/All_Inventory.module.css';
import MSR from '../Inventory/Img/MSRLogo.png';

const InventoryRecord = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('all'); // Default search type is all
    const [filterType, setFilterType] = useState('');
    const [searchResults, setSearchResults] = useState([]);

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // Change the locale as per your requirement
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

    const filteredInventoryData = filterType
        ? inventoryData.filter(item => item.raw_material_type === filterType)
        : inventoryData;

    // Sort inventory by date in descending order
    const sortedInventoryData = searchResults.length > 0 ? searchResults : filteredInventoryData.sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div>

            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f0f0f0'}}>
                <div className="logo">
                    <img src={MSR} alt="Logo" style={{ width: '70px', height: 'auto', marginLeft:'10px' }} />
                </div>

                <div style={{ display: 'flex', fontWeight:'700',alignItems: 'center',justifyContent: 'center' , marginTop:'5px', fontFamily:'serif', marginLeft:'40px'}}>
                    <p style={{color:'#d11002', fontSize:'26px' }}> MSR </p>
                    <p style={{color:'black', fontSize:'26px', marginLeft:'7px'}}> TAILORS </p>
                </div>

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
            
      
      <h2 style={{textAlign:'center' , marginBottom:'35px' , marginTop:'35px', fontSize:'30px' , textDecoration:'underline', fontWeight:'700'}}>All Records</h2>
  
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', color: 'gray' , marginTop:'30px' }}>
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
     <select value={filterType} onChange={handleFilterChange} style={{ width:'150px', padding: '8px', border: '1px solid #ccc', cursor: 'pointer', fontSize: '14px', marginLeft: '10px' }}>
        <option value="">Filter by type</option>
        <option value="Material">Material</option>
        <option value="Button">Button</option>
        <option value="Threads">Threads</option>
        <option value="Other">Other</option>
        </select>
    </div>


            <div style={{marginLeft:'15px', marginRight:'15px', marginTop:'50px'}}> 
            <table className={inventoryCss.all_table}>
                <thead>
                    <tr>
                        <th className={inventoryCss.table_head} >Product ID</th>
                        <th className={inventoryCss.table_head}>Raw Material Type</th>
                        <th className={inventoryCss.table_head}>Color</th>
                        <th className={inventoryCss.table_head}>Received Stock</th>
                        <th className={inventoryCss.table_head}>Used Stock</th>
                        <th className={inventoryCss.table_head}>Date</th>
                        <th className={inventoryCss.table_head}>Unit Price</th>
                        <th className={inventoryCss.table_head}>Retailer Name</th>
                        <th className={inventoryCss.table_head}>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedInventoryData.map(item => (
                        <tr key={item._id}>
                            <td className={inventoryCss.table_details}>{item.productId}</td>
                            <td className={inventoryCss.table_details}>{item.raw_material_type}</td>
                            <td className={inventoryCss.table_details}>{item.color}</td>
                            <td className={inventoryCss.table_details}>{item.received_stock}</td>
                            <td className={inventoryCss.table_details}>{item.used_stock}</td>
                            <td className={inventoryCss.table_details}>{formatDate(item.date)}</td>
                            <td className={inventoryCss.table_details}>{item.unit_price}</td>
                            <td className={inventoryCss.table_details}>{item.retailer_name}</td>
                            <td className={inventoryCss.table_details}>{item.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default InventoryRecord;
