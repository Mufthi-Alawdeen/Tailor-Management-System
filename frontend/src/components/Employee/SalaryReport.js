import React, { useState, useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

function SalaryReport() {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8070/employee/salaryreport").then((res) => {
      setReportData(res.data);
    });
  }, []);

  const generateReport = () => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const content = `
      <div style="margin: 10 auto; max-width: 800px;">
        <h2 style="text-align: center; margin-bottom: 20px;">Salary Report - ${currentDate}</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 10px;">Employee Type</th>
              <th style="border: 1px solid #ddd; padding: 10px;">Total Salary</th>
              <th style="border: 1px solid #ddd; padding: 10px;">Total Bonus</th>
              <th style="border: 1px solid #ddd; padding: 10px;">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            ${reportData
              .map(
                (entry) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px;">${entry.employeeType}</td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${entry.totalSalary}</td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${entry.totalBonus}</td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${entry.totalPaid}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    const element = document.createElement("div");
    element.innerHTML = content;

    html2pdf().from(element).save("SalaryReport.pdf");
  };

  return (
    <div style={{ marginLeft: 450 }}>
      <h2>Salary Report</h2>
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "#ffffff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
        onClick={generateReport}
      >
        Generate PDF Report
      </button>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Employee Type</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Total Salary</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Total Bonus</th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>Total Paid</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((entry) => (
            <tr key={entry.employeeType}>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{entry.employeeType}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{entry.totalSalary}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{entry.totalBonus}</td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>{entry.totalPaid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalaryReport;
