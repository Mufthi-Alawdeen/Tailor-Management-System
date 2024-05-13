import React, { useState, useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

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
      // Fetch orders
      const ordersResponse = await axios.get(
        "http://localhost:8075/order/getAllOrders"
      );
      const orders = ordersResponse.data;

      // Get current month's orders
      const currentMonthOrders = orders.filter((order) => {
        const orderDate = new Date(order.OrderDate);
        const currentDate = new Date();
        return (
          orderDate.getMonth() === currentDate.getMonth() &&
          orderDate.getFullYear() === currentDate.getFullYear()
        );
      });

      // Count new, pending, and finished orders
      const newOrders = currentMonthOrders.filter(
        (order) => order.Status === "New"
      );
      const pendingOrders = currentMonthOrders.filter(
        (order) => order.Status === "Pending"
      );
      const finishedOrders = currentMonthOrders.filter(
        (order) => order.Status === "Finished"
      );

      // Count online and manual orders
      const onlineOrders = currentMonthOrders.filter(
        (order) => order.Type === "Online"
      );
      const manualOrders = currentMonthOrders.filter(
        (order) => order.Type === "Manual"
      );

      // Calculate total profit from finished orders
      const totalOrderProfit = finishedOrders.reduce(
        (acc, order) => acc + order.TotalAmount,
        0
      );

      // Set state for order-related data
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
      // Fetch rentals
      const rentalsResponse = await axios.get(
        "http://localhost:8075/rent/getAllRents"
      );
      const rentals = rentalsResponse.data;

      // Get current month's rentals
      const currentMonthRentals = rentals.filter((rental) => {
        const rentalDate = new Date(rental.RentDate);
        const currentDate = new Date();
        return (
          rentalDate.getMonth() === currentDate.getMonth() &&
          rentalDate.getFullYear() === currentDate.getFullYear()
        );
      });

      // Count rented and returned cloths
      const rentedCloths = currentMonthRentals.filter(
        (rental) => rental.Status === "Rented"
      );
      const returnedCloths = currentMonthRentals.filter(
        (rental) => rental.Status === "returned"
      );

      // Count online and manual rentals
      const onlineRentals = currentMonthRentals.filter(
        (rental) => rental.Type === "Online"
      );
      const manualRentals = currentMonthRentals.filter(
        (rental) => rental.Type === "Manual"
      );

      // Calculate total rent profit from returned cloths
      const totalRentProfit = returnedCloths.reduce(
        (acc, rental) => acc + rental.Payment,
        0
      );

      // Set state for rental-related data
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
    const filename = "Order_and_Rental_Report.pdf"; // Specify the filename here
    html2pdf().from(element).save(filename);
  };

  return (
    <div className="container col-md-8">
      <div className="row" id="report">
        <div style={{ height: "34px" }}></div>
        <h1 className="text-center mb-3">Order and Rental Report</h1>
        <div className="text-center mb-4"> Date : {currentDate}</div>
        <div className="col-md-12">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">Order Summary</h2>
              <p className="card-text h5">Total New Orders: {newOrdersCount}</p>
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
                Total Profit for This Month (Finished Orders):{" "}
                {totalOrderProfit}
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
            style={{ borderRadius: 0 }}
          >
            Download Report
          </button>
        </div>
      </div>
      <div style={{ height: "34px" }}></div>
    </div>
  );
};

export default Report;
