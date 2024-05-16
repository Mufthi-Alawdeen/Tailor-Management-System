import React, { useState, useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import Header from "../Product/Header";

const Report = () => {
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [finishedOrdersCount, setFinishedOrdersCount] = useState(0);
  const [totalOrderProfit, setTotalOrderProfit] = useState(0);
  const [rentedClothsCount, setRentedClothsCount] = useState(0);
  const [returnedClothsCount, setReturnedClothsCount] = useState(0);
  const [totalRentProfit, setTotalRentProfit] = useState(0);
  const [totalMonthlyProfit, setTotalMonthlyProfit] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [onlineOrdersCount, setOnlineOrdersCount] = useState(0);
  const [manualOrdersCount, setManualOrdersCount] = useState(0);
  const [onlineRentalsCount, setOnlineRentalsCount] = useState(0);
  const [manualRentalsCount, setManualRentalsCount] = useState(0);

  useEffect(() => {
    fetchData();
    fetchRent();
    setCurrentDate(getFormattedDate());
  }, []);

  useEffect(() => {
    const totalProfit = totalOrderProfit + totalRentProfit;
    setTotalMonthlyProfit(totalProfit);
  }, [totalOrderProfit, totalRentProfit]);

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

  const fetchData = async () => {
    try {
      const ordersResponse = await axios.get(
        "http://localhost:8075/order/getAllOrders"
      );
      const orders = ordersResponse.data;

      const currentMonthOrders = orders.filter((order) => {
        const orderDate = new Date(order.OrderDate);
        const currentDate = new Date();
        return (
          orderDate.getMonth() === currentDate.getMonth() &&
          orderDate.getFullYear() === currentDate.getFullYear()
        );
      });

      const newOrders = currentMonthOrders.filter(
        (order) => order.Status === "New"
      );
      const pendingOrders = currentMonthOrders.filter(
        (order) => order.Status === "Pending"
      );
      const finishedOrders = currentMonthOrders.filter(
        (order) => order.Status === "Finished"
      );

      const onlineOrders = currentMonthOrders.filter(
        (order) => order.Type === "Online"
      );
      const manualOrders = currentMonthOrders.filter(
        (order) => order.Type === "Manual"
      );

      const totalOrderProfit = finishedOrders.reduce((acc, order) => {
        return acc + order.Amount;
      }, 0);
      

      setNewOrdersCount(newOrders.length);
      setPendingOrdersCount(pendingOrders.length);
      setFinishedOrdersCount(finishedOrders.length);
      setTotalOrderProfit(totalOrderProfit);
      setOnlineOrdersCount(onlineOrders.length);
      setManualOrdersCount(manualOrders.length);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchRent = async () => {
    try {
      const rentalsResponse = await axios.get(
        "http://localhost:8075/rent/getAllRents"
      );
      const rentals = rentalsResponse.data;

      const currentMonthRentals = rentals.filter((rental) => {
        const rentalDate = new Date(rental.PickupDate);
        const currentDate = new Date();
        return (
          rentalDate.getMonth() === currentDate.getMonth() &&
          rentalDate.getFullYear() === currentDate.getFullYear()
        );
      });

      const rentedCloths = currentMonthRentals.filter(
        (rental) => rental.Status === "Rented"
      );
      const returnedCloths = currentMonthRentals.filter(
        (rental) => rental.Status === "returned"
      );

      const onlineRentals = currentMonthRentals.filter(
        (rental) => rental.Type === "Online"
      );
      const manualRentals = currentMonthRentals.filter(
        (rental) => rental.Type === "Manual"
      );

      const totalRentProfit = returnedCloths.reduce((acc, rental) => {
        return acc + rental.Amount;
      }, 0);
      

      setRentedClothsCount(rentedCloths.length);
      setReturnedClothsCount(returnedCloths.length);
      setTotalRentProfit(totalRentProfit);
      setOnlineRentalsCount(onlineRentals.length);
      setManualRentalsCount(manualRentals.length);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("report");
    const filename = "Order_and_Rental_Report.pdf";
    html2pdf().from(element).save(filename);
  };

  return (
    <div>
      <Header />
      <div className="container col-md-8">
      <div className="row" id="report">
          <div style={{ height: "34px" }}></div>
          <h1 className="text-center mb-3">Order and Rental Report</h1>
          <div className="text-center mb-4"> Date : {currentDate}</div>
          <div className="col-md-12">
            <div className="card mb-4">
              <div className="card-body">
                <h2 className="card-title">Order Summary</h2>
                <p className="card-text h5">
                  Total New Orders: {newOrdersCount}
                </p>
                <p className="card-text h5">
                  Total Pending Orders: {pendingOrdersCount}
                </p>
                <p className="card-text h5">
                  Total Finished Orders: {finishedOrdersCount}
                </p>
                <p className="card-text h5">
                  Total Online Orders: {onlineOrdersCount}
                </p>
                <p className="card-text h5">
                  Total Manual Orders: {manualOrdersCount}
                </p>
                <p className="card-text h4 text-success">
                  Total Profit for This Month (Finished Orders): {totalOrderProfit}
                </p>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-body">
                <h2 className="card-title">Rental Summary</h2>
                <p className="card-text h5">
                  Total Rented Cloths: {rentedClothsCount}
                </p>
                <p className="card-text h5">
                  Total Returned Cloths: {returnedClothsCount}
                </p>
                <p className="card-text h5">
                  Total Online Rentals: {onlineRentalsCount}
                </p>
                <p className="card-text h5">
                  Total Manual Rentals: {manualRentalsCount}
                </p>
                <p className="card-text h4 text-success">
                  Total Profit for This Month (Returned Cloths): {totalRentProfit}
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-body bg-secondary text-white">
                <h2 className="card-title">Total Monthly Profit</h2>
                <p className="card-text h3">{totalMonthlyProfit}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-end">
          <div className="col-md-2">
            <button
              onClick={handleDownloadPDF}
              className="btn btn-primary float-right mt-3"
            >
              Download Report
            </button>
          </div>
        </div>
        <div style={{ height: "34px" }}></div>
      </div>
    </div>
  );
};

export default Report;

