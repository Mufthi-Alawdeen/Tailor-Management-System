import React, { useState, useEffect } from "react";
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import SideBar from '../Product/Header';
import MSRLogo from '../../res/MSRLogo.png';

const SalaryReport = () => {
  const [employeeBonuses, setEmployeeBonuses] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState([]);
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

      const employeeResponse = await axios.get('http://localhost:8075/employee/');
      const employees = employeeResponse.data;

      console.log('Employees:', employees);

      setEmployeeBonuses(bonuses);
      setEmployeeDetails(employees);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching employee bonuses or details:', error);
      setIsLoading(false);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handlePrintReport = () => {
    const reportContent = generateReportContent();
    printReport(reportContent);
  };

  const generateReportContent = () => {
    let totalSalary = 0;
    let totalBonus = 0;

    let content = `
    <div style="text-align: center;">
    <img src="${MSRLogo}" alt="MSR Logo" style="width: 100px; height: auto;" />
    </div>
    <hr style="border: 2px solid red;" />
    <h2 style="text-align: center;">Salary Report for ${selectedMonth}</h2>
    <table style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th style="border-bottom: 1px solid black; padding: 8px;">EID</th>
          <th style="border-bottom: 1px solid black; padding: 8px;">Salary</th>
          <th style="border-bottom: 1px solid black; padding: 8px;">Bonuses</th>
        </tr>
      </thead>
      <tbody>`;

    employeeDetails.forEach(employee => {
      const bonuses = getEmployeeBonuses(employee.Eid, selectedMonth);
      const salary = employee.salary || 0;
      totalSalary += salary;
      totalBonus += bonuses.reduce((sum, bonus) => sum + parseFloat(bonus) || 0, 0);
      content += `<tr>
      <td style="padding: 8px;">${employee.Eid}</td>
      <td style="padding: 8px;">${salary}</td>
      <td style="padding: 8px;">${bonuses.join('<br>')}</td>
      </tr>`;    });

      const totalAmount = totalSalary + totalBonus;

    content += `
    <tr>
      <td style="border-top: 1px solid black; padding: 8px;">&nbsp;</td>
      <td style="border-top: 1px solid black; padding: 8px;"><strong>Salary Total:</strong> ${totalSalary}</td>
      <td style="border-top: 1px solid black; padding: 8px;"><strong>Bonus Total:</strong> ${totalBonus}</td>
    </tr>
    </tbody>
      </table>
      <p style="margin-left: 50px; margin-top: 50px;"><strong>Total amount spent in salaries:</strong> Rs. ${totalAmount}</p>
      `;
    return content;
  };

  const printReport = (content) => {
    html2pdf().set({
      filename: 'salary_report.pdf',
    }).from(content).save();
  };

  const getEmployeeBonuses = (Eid, selectedMonth) => {
    const bonuses = employeeBonuses.filter(bonus => {
      return bonus.Eid === Eid && bonus.month.toLowerCase() === selectedMonth.toLowerCase();
    });
    return bonuses.length > 0 ? bonuses.map(bonus => bonus.bonus) : ['No Bonus'];
  };

  return (
    <div>
      <SideBar/>
      <div style={{ marginLeft: 150 }}>
        <h2 style={{textAlign: "center"}}>Salary Report</h2>
        <hr />
        <h5>
          This report generates the total amount spent on employee salaries, including<br />
          bonuses, for the selected month. Please choose a month from the dropdown<br />
          menu and click 'Generate Report' to view the details.
        </h5>
        <br />
        <hr />
        <h6>Please choose the month:</h6>
        <select className="form-select mb-3" value={selectedMonth} onChange={handleMonthChange}>
          <option value="">Select Month</option>
          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
            <option key={index} value={month}>{month}</option>
          ))}
        </select>
        <button className="btn" onClick={handlePrintReport} disabled={!selectedMonth}
          style={{
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '4px'
          }}>
          Print Report
        </button>
      </div>
    </div>
  );
}

export default SalaryReport;
