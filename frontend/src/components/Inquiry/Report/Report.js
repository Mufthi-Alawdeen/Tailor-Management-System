import React, { useState, useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import logo from "../Img/MSR.png";
import Header from "../../Product/Header";

export default function Report() {
  const [inquiries, setInquiries] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [lastMonthInquiryCount, setLastMonthInquiryCount] = useState(0);
  const [twoMonthsAgoInquiryCount, setTwoMonthsAgoInquiryCount] = useState(0);

  useEffect(() => {
    fetchInquiries();
    setCurrentDate(getFormattedDate());
    fetchLastMonthInquiries();
    fetchTwoMonthsAgoInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await axios.get("http://localhost:8075/inquiry/retrieve");
      setInquiries(response.data);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  };

  const fetchLastMonthInquiries = async () => {
    try {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const response = await axios.get(`http://localhost:8075/inquiry/retrieve?month=${lastMonth.getMonth() + 1}&year=${lastMonth.getFullYear()}`);
      setLastMonthInquiryCount(response.data.length);
    } catch (error) {
      console.error("Error fetching last month's inquiries:", error);
    }
  };

  const fetchTwoMonthsAgoInquiries = async () => {
    try {
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      const response = await axios.get(`http://localhost:8075/inquiry/retrieve?month=${twoMonthsAgo.getMonth() + 1}&year=${twoMonthsAgo.getFullYear()}`);
      setTwoMonthsAgoInquiryCount(response.data.length);
    } catch (error) {
      console.error("Error fetching two months ago inquiries:", error);
    }
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

  const generateReport = () => {
    if (!inquiries) {
      console.error("No inquiries data available.");
      return;
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentDay = new Date().getDate();

    const filteredInquiries = inquiries.filter(inquiry => {
      const inquiryDate = new Date(inquiry.createdAt);
      const inquiryMonth = inquiryDate.getMonth();
      const inquiryYear = inquiryDate.getFullYear();
      return inquiryMonth === currentMonth && inquiryYear === currentYear && inquiryDate.getDate() <= currentDay;
    });

    const repliedCount = filteredInquiries.filter(inquiry => inquiry.Reply !== "PENDING").length;
    const pendingCount = filteredInquiries.filter(inquiry => inquiry.Reply === "PENDING").length;

    // Types
    const types = ["Order Issue", "General", "Rent Issues", "Other"];

    const typeCounts = types.reduce((acc, type) => {
      const count = filteredInquiries.filter(inquiry => inquiry.Type === type).length;
      acc[type] = count;
      return acc;
    }, {});

    const totalInquiriesCount = filteredInquiries.length;

    const content = `
    <div style="margin: 10 auto; max-width: 800px;">
      <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px;">
        <img src="${logo}" alt="Logo" style="max-width: 100px; margin-left: 30px; margin-top: 20px" />
        <div style="flex: 1; text-align: right; margin-right: 20px; margin-top: 20px">
          <h1>MSR Tailors</h1>
          <p>Address: 271 A9, Kandy 20000</p>
          <p>Phone: 0812 205 454</p>
      </div>
      </div>
      <hr style="color:#000000"></hr>
      <div style="margin-top: 40px;">
        <h1 style="text-align: center">Summary Report</h1>
          <div style="text-align: center; margin-top: 10px; margin-bottom: 25px ">
           <p>Date: ${currentDate}</p>
          </div>
  
          <div style="margin-top: 30px; text-align: center;margin-right: 30px;margin-left: 30px;">
          <h5>This comprehensive report provides an insightful overview of inquiries received by MSR Tailors categorized according to their nature and presents a detailed summary of all inquiries within a 30-day period.</h5>
            </div>

            <h6 style="margin-right: 30px;margin-left: 30px; margin-top: 50px; margin-bottom: 10px; text-align: center;">This table shows the count of received inquiries according to the type. The count is calculated only for the inquiries received this month.</h6>
        <div style="border: 1px solid #ccc; padding: 20px; margin-bottom: 20px; margin-top: 20px; margin-left: 35px; margin-right:35px">
          <p style="font-size:22px; font-weight:600; margin-bottom: 20px">Received According To Type</p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 8px; border-bottom: 1px solid #ccc;text-align: left;">Type</th>
                <th style="padding: 8px; border-bottom: 1px solid #ccc;text-align: left;">Inquiries</th>
              </tr>
            </thead>
            <tbody>
              ${types.map(type => `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ccc; text-align: left;">${type}</td>
                  <td style="padding: 8px; border-bottom: 1px solid #ccc; text-align: left;">${typeCounts[type] || 0}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <h6 style="margin-right: 30px;margin-left: 30px; margin-top: 50px; margin-bottom: 25px; text-align: center;">This details shows the no of received inquiries and the summary. The count is calculated only for the inquiries received this month.</h6>
        <div style="border: 1px solid #ccc; padding: 20px; margin-bottom: 20px; margin-left: 35px; margin-right:35px">
          <p style="font-size:22px; font-weight:600; margin-bottom: 20px">Inquiries Summary</p>
          <p style="font-size:20px; margin-left: 15px;">Total Inquiries Received: ${totalInquiriesCount}</p>
          <p style="font-size:20px; margin-left: 15px;">Total Inquiries Replied: ${repliedCount}</p>
          <p style="font-size:20px; margin-left: 15px;">Total Inquiries To Be Replied: ${pendingCount}</p>
        </div>
  
        <div style="border: 1px solid #ccc; padding: 20px;margin-top:150px; margin-bottom: 20px; margin-left: 35px; margin-right:35px">
          <p style="font-size:22px; font-weight:600; margin-bottom: 20px">Monthly Inquiry Metrics</p>
          <p style="font-size:20px; margin-left: 15px;">Inquiries Received Last Month: ${lastMonthInquiryCount}</p>
          <p style="font-size:20px; margin-left: 15px;">Inquiries Received Two Months Ago: ${twoMonthsAgoInquiryCount}</p>
          <!-- Include additional metrics as needed -->
        </div>
        <p style="font-size:20px; margin-left: 35px;margin-right: 35px;margin-top: 0px;">According to the report, a total of ${totalInquiriesCount} inquiries were received this month. This indicates a significant level of customer engagement and highlights the importance of prompt and effective inquiry management.</p>
        <div style="margin-top: 60px; border: 1px solid #ccc; padding: 10px; margin-bottom: 20px; margin-left: 30px; margin-right:30px">
          <p style="font-size:22px; font-weight:600; margin-bottom: 20px">Suggestions</p>
          <p style="font-size:20px; margin-left: 15px;">1. Implement automated response systems to handle common inquiries more efficiently.</p>
          <p style="font-size:20px; margin-left: 15px;">2. Offer incentives for customers to provide feedback on their inquiry handling experience.</p>
          <!-- Add more suggestions here -->
        </div>
        <div class="clarification" style="text-align: center;margin-top:35px;">
          <p>All information provided in this report are true and accurate to the best of our knowledge.</p> 
        </div>
        <div class="signature" style="text-align: center; margin-top:40px;">
          <p>--------------</p>
          <p>Manager</p>
        </div>
      </div>
    </div>
  `;
  
  

    const element = document.createElement("div");
    element.innerHTML = content;

    html2pdf().from(element).save("Inquiry Summary Report.pdf");
  };

  const getWeeksInMonth = (month, year) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const numDays = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();
    const days = numDays + firstDayOfWeek;
    return Math.ceil(days / 7);
  };

  return (
    <div>
      <Header/>
      <div style={{ marginTop:'80px' ,  border: '1px solid #000000' ,marginLeft:'70px', marginRight:'40px' }} >
        <h1 style={{textAlign:'center' , marginTop:'30px', marginBottom:'30px'}}>Summary Report</h1>
        <p style={{textAlign:'center', marginTop:'20px' , marginLeft:'50px', marginRight:'50px' , fontSize:'20px',marginBottom:'30px'}} >
        This comprehensive report provides an insightful overview of inquiries received by MSR Tailors categorized according
         to their nature and presents a detailed summary of all inquiries within a 30-day period. 
         By meticulously analyzing the types and volume of inquiries, this report offers valuable insights into customer 
         engagement and satisfaction levels, aiding in strategic decision-making and enhancing overall operational efficiency.</p>

        <button className="Report_button"
            style={{ 
              display: 'block',
              margin: '0 auto', 
              marginTop:'20px', 
              marginBottom:'30px',
              padding:'22px', 
              backgroundColor:'#000000', 
              color:'white', 
              border:'none', 
              fontSize:'18px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              fontWeight:'550'
            }} 
            onClick={generateReport}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#333333'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}>

              Download Report
       </button>
      </div>
    </div>
  );
}
