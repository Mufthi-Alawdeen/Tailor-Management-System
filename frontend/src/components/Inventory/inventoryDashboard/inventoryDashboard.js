import React from 'react';
import { Link } from 'react-router-dom';
import style from './inventoryDashboard.module.css';
import Header from '../../Product/Header';

const InventoryDashboard = () => {
    return (
        <div>
            <div>
                <Header/>
            </div>
            <div className={style.heading}>
            <h1>Inventory Dashboard</h1>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop:'90px' }}>
                <Link to="/inventory/addinventory" style={{ textDecoration: 'none' }}>
                    <button className={style.dashboard_button} >Add Inventory</button>
                </Link>
                <Link to="/inventory/all" style={{ textDecoration: 'none' }}>
                    <button className={style.dashboard_button} >Manage Inventory</button>
                </Link>
                <Link to="/inventory/report" style={{ textDecoration: 'none' }}>
                    <button className={style.dashboard_button}  >Generate Report</button>
                </Link>
            </div>
        </div>
    );
};



export default InventoryDashboard;
