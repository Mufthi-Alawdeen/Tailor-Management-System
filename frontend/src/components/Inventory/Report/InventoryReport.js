import React, { useState, useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import logo from "../Img/MSRLogo.png";
import Header from "../../Product/Header";

const InventoryReport = () => {
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8075/inventory/retrieve"
      );
      setInventoryData(response.data);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  const generateReport = () => {
    // Filter inventory data for the current month
    const currentMonth = new Date().getMonth() + 1; // Month is zero-based
    const currentYear = new Date().getFullYear();
    const filteredInventory = inventoryData.filter((item) => {
      const itemMonth = new Date(item.date).getMonth() + 1;
      const itemYear = new Date(item.date).getFullYear();
      return itemMonth === currentMonth && itemYear === currentYear;
    });

    // Group inventory data by material type and color
    const groupedInventory = {};
    filteredInventory.forEach((item) => {
      const key = `${item.raw_material_type}-${item.color}`;
      if (!groupedInventory[key]) {
        groupedInventory[key] = [];
      }
      groupedInventory[key].push(item);
    });

    // Generate report content
    let content = `
      <div style="margin: 10px auto; max-width: 800px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <img src="${logo}" alt="Logo" style="max-width: 100px; margin-left: 30px; margin-top: 20px;" />
          <div style="flex: 1; text-align: right; margin-right: 20px; margin-top: 20px;">
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
        <table style="width: 60%; border-collapse: collapse; margin: 40px auto;">

          <thead>
            <tr>
              <th style="border: 1px solid #ccc; padding: 8px;">Material Type</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Color</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Total Cost</th>
            </tr>
          </thead>
          <tbody>`;

    let totalCost = 0;

    for (const key in groupedInventory) {
      if (groupedInventory.hasOwnProperty(key)) {
        const items = groupedInventory[key];
        const [materialType, color] = key.split("-");
        let unitPrice = 0;
        if (items.length > 0) {
          unitPrice = parseFloat(items[0].unit_price);
        }
        const receivedStock = items.reduce(
          (total, item) => total + parseInt(item.received_stock),
          0
        );
        const itemTotalCost = unitPrice * receivedStock;
        totalCost += itemTotalCost;
        content += `
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px;">${
              materialType === "Other"
                ? `${materialType} (${items[0].name})`
                : materialType
            } (${receivedStock} x Rs.${unitPrice.toFixed(2)})</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${color}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${itemTotalCost.toFixed(
              2
            )}</td>
          </tr>`;
      }
    }

    content += `
        </tbody>
        </table>
        <p style="width: 60%; text-align: center; margin: 20px auto; font-weight: bold; background-color:#000000; color:#FFFFFF; padding:15px">Total Cost: Rs.${totalCost.toFixed(
          2
        )}</p>

      </div>`;

    // Generate PDF
    const element = document.createElement("div");
    element.innerHTML = content;

    html2pdf().from(element).save("Inventory_Report.pdf");
  };

  const getFormattedDate = () => {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return now.toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <Header />
      <div
        style={{
          marginTop: "80px",
          border: "1px solid #000000",
          marginLeft: "80px",
          marginRight: "40px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          Inventory Report
        </h1>
        <button
          className="Report_button"
          style={{
            display: "block",
            margin: "0 auto",
            marginTop: "20px",
            marginBottom: "30px",
            padding: "22px",
            backgroundColor: "#000000",
            color: "white",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            transition: "background-color 0.3s",
            fontWeight: "550",
          }}
          onClick={generateReport}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#333333")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#000000")}
        >
          Download Report
        </button>
      </div>
    </div>
  );
};

export default InventoryReport;
