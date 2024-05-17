import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Button } from 'react-bootstrap'; // Importing Button component from react-bootstrap
import html2pdf from 'html2pdf.js'; // Import html2pdf

const SalaryReport = () => {
  const [employeeBonuses, setEmployeeBonuses] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetchEmployeeBonuses();
  }, []);

  const fetchEmployeeBonuses = async () => {
    try {
      const bonusResponse = await axios.get('http://localhost:8075/employeeBonus/all');
      const bonuses = bonusResponse.data;

      console.log('Bonuses:', bonuses);

      const employeeDetailsMap = {};
      await Promise.all(
        bonuses.map(async (bonus) => {
          const { Eid } = bonus;
          if (!employeeDetailsMap[Eid]) {
            const employeeResponse = await axios.get(`http://localhost:8075/employee/getbyEid/${Eid}`);
            if (employeeResponse.data.exists) {
              employeeDetailsMap[Eid] = employeeResponse.data.employee;
            } else {
              employeeDetailsMap[Eid] = null;
            }
          }
        })
      );

      console.log('Employee Details Map:', employeeDetailsMap);

      setEmployeeBonuses(bonuses);
      setEmployeeDetails(employeeDetailsMap);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching employee bonuses or details:', error);
      setIsLoading(false);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const bonusMonths = [...new Set(employeeBonuses.map(bonus => bonus.month))];

  const handlePrintReport = () => {
    // Filter bonuses for the selected month
    const bonusesForSelectedMonth = employeeBonuses.filter(bonus => bonus.month === selectedMonth);
    // Create HTML content for the PDF
    const content = `
      <h2>Salary Report - ${selectedMonth}</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Eid</th>
            <th>Salary</th>
            <th>Bonus</th>
          </tr>
        </thead>
        <tbody>
          ${bonusesForSelectedMonth.map(bonus => `
            <tr>
              <td>${bonus.Eid}</td>
              <td>${employeeDetails[bonus.Eid]?.salary || 'N/A'}</td>
              <td>${bonus.bonus}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    // Options for html2pdf
    const options = {
      margin:       1,
      filename:     'salary_report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    // Generate PDF and print
    html2pdf().from(content).set(options).save();
  };

  return (
    <div style={{ marginLeft: 450 }}>
      <h2>Salary Report</h2>
      <p>Please choose the month:</p>
      {/* Dropdown to select month */}
      <select className="form-select mb-3" value={selectedMonth} onChange={handleMonthChange}>
        <option value="">Select Month</option>
        {bonusMonths.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
      {/* Print button */}
      <Button className="btn" onClick={handlePrintReport} disabled={!selectedMonth}>Print Report</Button>
      {/* You can render the fetched data here */}
    </div>
  );
}

export default SalaryReport;
