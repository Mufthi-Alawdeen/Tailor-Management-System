
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import MSR from '../Img/MSRLogo.png';
import Header from '../../Product/Header';

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

const InventoryReport = () => {
  const [inventoryData, setInventoryData] = useState([]);

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

  const generateReport = () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const filteredInventory = inventoryData.filter(item => {
      const itemMonth = new Date(item.date).getMonth() + 1;
      const itemYear = new Date(item.date).getFullYear();
      return itemMonth === currentMonth && itemYear === currentYear;
    });

    const groupedInventory = {};
filteredInventory.forEach(item => {
  const key = `${item.raw_material_type}-${item.color}`;
  if (!groupedInventory[key]) {
    groupedInventory[key] = [];
  }
  groupedInventory[key].push(item);
});


    let content = `
      <div style="margin: 10 auto; max-width: 800px;">
      <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px;">
      <img src="${MSR}" alt="Logo" style="max-width: 100px; margin-left: 30px; margin-top: 20px" />
      <div style="flex: 1; text-align: right; margin-right: 20px; margin-top: 20px">
        <h1>MSR Tailors</h1>
        <p>Address: 271 A9, Kandy 20000</p>
        <p>Phone: 0812 205 454</p>
    </div>
    </div>
        <hr style="color:#000000">
        <div style="margin-top: 40px;">
          <h1 style="text-align: center">Inventory Report</h1>
          <div style="text-align: center; margin-top: 10px; margin-bottom: 25px ">
            <p>Date: ${getFormattedDate()}</p>

            </div>

            
            <div style="margin-top: 50px; text-align: center;margin-right: 30px;margin-left: 30px;">
            <h5>This report includes the total cost of received raw materials in the past 30 days or in the last month.</h5>
            </div>
            <h3 style="text-align: center;margin-top: 60px; text-decoration: underline;">Total Cost of this Month</h3>
          <div style="margin-top: 20px; text-align: center;margin-right: 30px;margin-left: 30px;">
          <h6 style="margin-bottom: 5px; text-align: center;">This table shows the total cost of each item by multiplying the unit price and received stock, and the total stock is calculated accordingly.</h6>
          </div>

          <table style="width: 60%; border-collapse: collapse; margin: 40px auto;">
            <thead>
              <tr>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center; background-color:#ccc;">Material Type</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;background-color:#ccc;">Color</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: center;background-color:#ccc;">Total Cost</th>
              </tr>
            </thead>
            <tbody>`;

    let totalCost = 0;
    const lowStockItems = [];

    for (const key in groupedInventory) {
      if (groupedInventory.hasOwnProperty(key)) {
        const items = groupedInventory[key];
        const [materialType, color] = key.split('-');
        let unitPrice = 0;
        let totalReceivedStock = 0;

        items.forEach(item => {
          totalReceivedStock += parseInt(item.received_stock);
          unitPrice = parseFloat(item.unit_price);
        });

        const totalItemCost = totalReceivedStock * unitPrice;
        totalCost += totalItemCost;

        content += `
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px;">${materialType}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${color}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${totalItemCost.toFixed(2)}</td>
          </tr>`;

        if (isLowStock(materialType, totalReceivedStock)) {
          lowStockItems.push({ materialType, color, unitPrice, totalReceivedStock, totalItemCost });
        }
      }
    }

    content += `
          </tbody>
        </table>
        <h3 style="text-align: center;">Total Cost: ${totalCost.toFixed(2)}</h3>
        <div style="margin-top: 80px; text-align: center;margin-right: 30px;margin-left: 30px;">
          <h6 style="margin-top: 10px; margin-bottom: 20px; text-align: center;">This table shows the total cost of each item by multiplying the unit price and received stock, and the total stock is calculated accordingly.</h6>
          </div>
          <h3 style="text-align: center;margin-top: 20px; text-decoration: underline;">Low Stock Items</h3>
        <table style="width: 50%; border-collapse: collapse; margin: 40px auto;">
          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 8px; text-align: center;background-color:#ccc;">Material Type</th>
              <th style="border: 1px solid #ccc; padding: 8px; text-align: center;background-color:#ccc;">Color</th>
            </tr>
          </thead>
          <tbody>`;

    lowStockItems.forEach(item => {
      content += `
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.materialType}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.color}</td>
            </tr>`;
    });

    content += `
          </tbody>
        </table>

        <div class="clarification" style="text-align: center;margin-top:185px;">
        <p>All information provided in this report are true and accurate to the best of our knowledge.</p> 
      </div>
      <div class="signature" style="text-align: center; margin-top:20px;">
        <p>--------------</p>
        <p>Manager</p>
      </div>

      </div>
    </div>`;

   

    html2pdf().from(content).save('Inventory_Report.pdf');
  };

const getFormattedDate = () => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
};


  return (
    <div>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button onClick={generateReport} style={{ padding: '10px 20px', backgroundColor: 'black', color: 'white', border: 'none', cursor: 'pointer' }}>
          Generate Inventory Report
        </button>
      </div>
    </div>
  );
};

export default InventoryReport;
