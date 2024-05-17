import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
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
  const [dailyProfits, setDailyProfits] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  const orderChartRef = useRef(null);
  const rentChartRef = useRef(null);
  const inquiryChartRef = useRef(null);
  const profitChartRef = useRef(null);

  useEffect(() => {
    fetchInquiries();
    fetchOrders();
    fetchRents();
    fetchDailyProfits();
    setCurrentDate(getFormattedDate());
  }, []);

  useEffect(() => {
    if (
      totalOrders > 0 ||
      totalRents > 0 ||
      totalInquiries > 0 ||
      dailyProfits.length > 0
    ) {
      createOrderChart();
      createRentChart();
      createInquiryChart();
      createProfitChart();
    }
  }, [
    onlineOrders,
    totalOrders,
    onlineRentals,
    totalRents,
    totalInquiries,
    repliedInquiries,
    pendingInquiries,
    dailyProfits,
  ]);

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

  const fetchDailyProfits = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8075/transaction/getMonthlyProfits"
      );
      const profits = response.data;
      setDailyProfits(profits);
    } catch (error) {
      console.error("Error fetching daily profits:", error);
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

  const createOrderChart = () => {
    if (orderChartRef.current) {
      orderChartRef.current.destroy();
    }
    const ctx = document.getElementById("orderChart").getContext("2d");
    orderChartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Manual Orders", "Online Orders"],
        datasets: [
          {
            data: [onlineOrders, totalOrders - onlineOrders],
            backgroundColor: ["#333", "#d11002"], // Red and Black
          },
        ],
      },
    });
  };

  const createRentChart = () => {
    if (rentChartRef.current) {
      rentChartRef.current.destroy();
    }
    const ctx = document.getElementById("rentChart").getContext("2d");
    rentChartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Online Rentals", "Manual Rentals"],
        datasets: [
          {
            data: [onlineRentals, totalRents - onlineRentals],
            backgroundColor: ["#d11002", "#333"], // Red and Black
          },
        ],
      },
    });
  };

  const createInquiryChart = () => {
    if (inquiryChartRef.current) {
      inquiryChartRef.current.destroy();
    }
    const ctx = document.getElementById("inquiryChart").getContext("2d");
    inquiryChartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Replied ", "Pending "],
        datasets: [
          {
            data: [repliedInquiries, pendingInquiries],
            backgroundColor: ["#d11002", "#333"], // Red and Black
          },
        ],
      },
    });
  };

  const createProfitChart = () => {
    if (profitChartRef.current) {
      profitChartRef.current.destroy();
    }
    const ctx = document.getElementById("profitChart").getContext("2d");
    const labels = dailyProfits.map((profit) => profit.date);
    const data = dailyProfits.map((profit) => profit.amount);

    profitChartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Daily Profit",
            data: data,
            backgroundColor: "rgba(209, 16, 2, 0.2)", // Transparent red
            borderColor: "#d11002",
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            title: {
              display: true,
              text: "Profit",
            },
            beginAtZero: true,
          },
        },
      },
    });
  };

  return (
    <div>
      <div className={styles["header-content"]}>
        <div style={{ textAlign: "center", display: "flex" }}>
          <p style={{ color: "#d11002" }}>MSR</p>
          <p style={{ color: "black", marginLeft: "6px" }}>TAILORS</p>
        </div>
      </div>

      <div className={styles.container}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "80%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: "30%" }}>
                <div className={styles.box}>
                  <h3>Orders Under Process</h3>
                  <h1>{pendingOrders}</h1>
                </div>
              </div>
              <div style={{ width: "30%" }}>
                <div className={styles.box}>
                  <h3>New Orders</h3>
                  <h1>{newOrders}</h1>
                </div>
              </div>
              <div style={{ width: "30%" }}>
                <div className={styles.box}>
                  <h3>Pending Inquiries</h3>
                  <h1>{pendingInquiries}</h1>
                </div>
              </div>
            </div>

            <br />

            <div className={styles["chart-container"]}>
              <div className={styles["chart-box"]}>
                <div className={styles["chart-title"]}>Order Distribution</div>
                <canvas id="orderChart"></canvas>
              </div>

              <div className={styles["chart-box"]}>
                <div className={styles["chart-title"]}>Rental Distribution</div>
                <canvas id="rentChart"></canvas>
              </div>

              <div className={styles["chart-box"]}>
                <div className={styles["chart-title"]}>Inquiry Status</div>
                <canvas id="inquiryChart"></canvas>
              </div>
            </div>
            <div className={styles["chart-container"]}>
              <div
                className={`${styles["chart-box"]} ${styles["profit-chart"]}`}
              >
                <div className={styles["chart-title"]}>Daily Profits</div>
                <canvas id="profitChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
