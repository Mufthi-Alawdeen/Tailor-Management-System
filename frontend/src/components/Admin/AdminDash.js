import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminDash.module.css";

export default function DashBoard() {
  const [totalInquiries, setTotalInquiries] = useState(0);
  const [repliedInquiries, setRepliedInquiries] = useState(0);
  const [pendingInquiries, setPendingInquiries] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [onlineOrders, setOnlineOrders] = useState(0);
  const [newOrders, setNewOrders] = useState(0);
  const [totalRents, setTotalRents] = useState(0);
  const [onlineRentals, setOnlineRentals] = useState(0);
  const [manualRentals, setManualRentals] = useState(0);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    fetchInquiries();
    fetchOrders();
    fetchRents();
    setCurrentDate(getFormattedDate());
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8075/inquiry/retrieve"
      );
      const inquiries = response.data;
      setTotalInquiries(inquiries.length);

      const repliedCount = inquiries.filter(
        (inquiry) => inquiry.Reply !== "PENDING"
      ).length;
      setRepliedInquiries(repliedCount);

      const pendingCount = inquiries.filter(
        (inquiry) => inquiry.Reply === "PENDING"
      ).length;
      setPendingInquiries(pendingCount);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8075/order/getAllOrders"
      );
      const orders = response.data;
      setTotalOrders(orders.length);

      const pendingCount = orders.filter(
        (order) => order.Status === "Pending"
      ).length;
      setPendingOrders(pendingCount);

      const onlineCount = orders.filter(
        (order) => order.Type === "online"
      ).length;
      setOnlineOrders(onlineCount);

      const newCount = orders.filter((order) => order.Status === "New").length;
      setNewOrders(newCount);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchRents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8075/rent/getAllRents"
      );
      const rents = response.data;
      setTotalRents(rents.length);

      const onlineCount = rents.filter((rent) => rent.Type === "Online").length;
      setOnlineRentals(onlineCount);

      const manualCount = rents.filter((rent) => rent.Type === "Manual").length;
      setManualRentals(manualCount);
    } catch (error) {
      console.error("Error fetching rents:", error);
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

  const calculatePercentage = (value, total) => {
    return total !== 0 ? (value / total) * 100 : 0;
  };

  const renderCircle = (value, total, color) => {
    const percentage = calculatePercentage(value, total);
    const circleStyle = {
      border: `5px solid ${color}`,
      borderRadius: "50%",
      width: "80px",
      height: "80px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: "20px",
    };

    return (
      <div style={circleStyle}>
        <span>{percentage.toFixed(0)}%</span>
      </div>
    );
  };

  return (
    <div>
      <div
        className="header-content"
        style={{
          display: "flex",
          fontWeight: "700",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "0px",
          fontFamily: "serif",
          backgroundColor: "#f8f9fa",
          padding: "12px",
          width: "100%",
        }}
      >
        {/* Your header content */}
        <div style={{ textAlign: "center", display: "flex" }}>
          <p style={{ color: "#d11002", fontSize: "26px", margin: 0 }}> MSR </p>
          <p
            style={{
              color: "black",
              fontSize: "26px",
              margin: 0,
              marginLeft: "6px",
            }}
          >
            {" "}
            TAILORS{" "}
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "80%" }}>
            {/* Inquiry Section */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "30%" }}>
                <div className={`${styles.box}`}>
                  <div>
                    <h3 style={{ marginTop: "10px", fontSize: "27px" }}>
                      Total Inquiries
                    </h3>
                  </div>
                  <div>
                    <h1 style={{ marginBottom: "16px" }}>{totalInquiries}</h1>
                  </div>
                </div>
              </div>
              <div style={{ width: "30%" }}>
                <div className={`${styles.box}`}>
                  <div>
                    <h3 style={{ marginBottom: "15px" }}>Replied Inquiries</h3>
                  </div>
                  <div style={{ display: "flex" }}>
                    {renderCircle(repliedInquiries, totalInquiries, "green")}
                    <h1 style={{ marginLeft: "40px", marginTop: "5px" }}>
                      {repliedInquiries}
                    </h1>
                  </div>
                </div>
              </div>
              <div style={{ width: "30%" }}>
                <div className={`${styles.box}`}>
                  <div>
                    <h3 style={{ marginBottom: "15px" }}>Pending Inquiries</h3>
                  </div>
                  <div style={{ display: "flex" }}>
                    {renderCircle(pendingInquiries, totalInquiries, "orange")}
                    <h1 style={{ marginLeft: "40px", marginTop: "5px" }}>
                      {pendingInquiries}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <br />
            {/* Order Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <div style={{ width: "20%" }}>
                <div className={`${styles.box}`}>
                  <div>
                    <h3 style={{ marginTop: "10px", fontSize: "27px" }}>
                      Total Orders
                    </h3>
                  </div>
                  <div>
                    <h1 style={{ marginBottom: "16px" }}>{totalOrders}</h1>
                  </div>
                </div>
              </div>
              <div style={{ width: "20%" }}>
                <div className={`${styles.box}`}>
                  <div>
                    <h3 style={{ marginBottom: "15px" }}>Pending Orders</h3>
                  </div>
                  <div style={{ display: "flex" }}>
                    {renderCircle(pendingOrders, totalOrders, "orange")}
                    <h1 style={{ marginLeft: "40px", marginTop: "5px" }}>
                      {pendingOrders}
                    </h1>
                  </div>
                </div>
              </div>
              <div style={{ width: "20%" }}>
                <div className={`${styles.box}`}>
                  <div>
                    <h3 style={{ marginBottom: "15px" }}>Online Orders</h3>
                  </div>
                  <div style={{ display: "flex" }}>
                    {renderCircle(onlineOrders, totalOrders, "blue")}
                    <h1 style={{ marginLeft: "40px", marginTop: "5px" }}>
                      {onlineOrders}
                    </h1>
                  </div>
                </div>
              </div>
              <div style={{ width: "20%" }}>
                <div className={`${styles.box}`}>
                  <div>
                    <h3 style={{ marginBottom: "15px" }}>New Orders</h3>
                  </div>
                  <div style={{ display: "flex" }}>
                    {renderCircle(newOrders, totalOrders, "green")}
                    <h1 style={{ marginLeft: "40px", marginTop: "5px" }}>
                      {newOrders}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <br />

            {/* Rental Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <div style={{ width: "30%" }}>
                <div className={`${styles.box}`}>
                  <div>
                    <h3 style={{ marginTop: "10px", fontSize: "27px" }}>
                      Total Rentals
                    </h3>
                  </div>
                  <div>
                    <h1 style={{ marginBottom: "16px" }}>{totalRents}</h1>
                  </div>
                </div>
              </div>
              <div style={{ width: "30%" }}>
                <div className={`${styles.box}`}>
                  <div>
                    <h3 style={{ marginBottom: "15px" }}>Online Rentals</h3>
                  </div>
                  <div style={{ display: "flex" }}>
                    {renderCircle(onlineRentals, totalRents, "blue")}
                    <h1 style={{ marginLeft: "40px", marginTop: "5px" }}>
                      {onlineRentals}
                    </h1>
                  </div>
                </div>
              </div>
              <div style={{ width: "30%" }}>
                <div className={`${styles.box}`}>
                  <div>
                    <h3 style={{ marginBottom: "15px" }}>Manual Rentals</h3>
                  </div>
                  <div style={{ display: "flex" }}>
                    {renderCircle(manualRentals, totalRents, "gray")}
                    <h1 style={{ marginLeft: "40px", marginTop: "5px" }}>
                      {manualRentals}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
