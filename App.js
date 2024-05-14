
import './App.css';
import Navbar from "./components/Order (Admin)/navbar";
import "bootstrap/dist/css/bootstrap.min.css";

// Product Managment

import ProductUpload from './components/Product/ProductUpload/ProductUpload';
import GenerateReportButton from './components/Product/GenerateReportButton/GenerateReportButton';
import Preview from './components//Product/Preview/Preview';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BuyProduct from './components/Product/BuyProduct';
import RentProduct from './components/Product/RentProduct';
import ProductDashboard from './components/Product/ProductDashboard/ProductDashboard';
import EditProduct from './components/Product/EditProduct/EditProduct';
import Sidebar from './components/Product/Sidebar';
import Header from './components/Product/Header';



// Inventory Managment

import AddInventoryForm from "./components/Inventory/Add_Raw_Material/Add_Raw_Material"; // Import AddInventoryForm component
import AddInventoryRequestForm from "../src/components/Inventory/Inventory_Request";
import InventoryTable from "./components/Inventory/All_Inventory/All_Inventory";
import InventoryDashboard from './components/Inventory/inventoryDashboard/inventoryDashboard';
import InventoryRecord from './components/Inventory/Inventory_Records';
import InventoryReport from './components/Inventory/Report/InventoryReport';
import AdminInventoryRequestForm from './components/Inventory/Admin_Request/AdminRequest';





// Inquiry Managment 

import InquiryForm from './components/Inquiry/Contact Us/Add_Inquirey';
import InquiryList from './components/Inquiry/Sent Inquiries and Admin Inq/All_Inquiries';
import AdminInquiryList from './components/Inquiry/Sent Inquiries and Admin Inq/Admin_Inq';
import HRAdminDashboard from './components/Inquiry/HR Dashboard/HR_Admin';
import AboutUsPage from './components/Inquiry/About Us/AboutUs'; 
import Report from './components/Inquiry/Report/Report'; 
import InquiryDashboard from './components/Inquiry/Inquiry Dashboard/InquiryDashboard';


// Employee Managment

import AddEmployee from './components/Employee/Add Employee/AddEmployee';
import AllEmployees from './components/Employee/All Employees/AllEmployees';
import AllLeaves from './components/Employee/All Leaves/AllLeaves';
import EmployeesPage from './components/Employee/EmployeePage';
import EmployeeDashboard from './components/Employee/Employee Dashboard/EmployeesDashboard'
import AdminLeaves from './components/Employee/AdminLeaves';
import EmployeeDetails from './components/Log in/Employee Log in/EmployeeProfile';
import AddEmployeeBonus from './components/Employee/Employee Bonus/Employee_bonus';



import Ad_Dashboard from './components/Admin/Sidebar';

// User Login and Employee Log in
import UserForm from './components/Log in/SignIn';
import LoginForm from './components/Log in/LogIn';
import UserProfile from './components/Log in/UserProfile';
import ResetPassword from './components/Log in/User_Forgot_pw';
import AddEmployeeForm from './components/Log in/Employee Log in/Employee_SignIn';
import DeleteAccount from './components/Log in/Delete_profile';
import Login from './components/Log in/Employee Log in/Employee_LogIn';
import PasswordReset from './components/Log in/Employee Log in/Employee_Forgot_pss';
import UserTable from './components/Log in/All_UserTable';
import EmployeeTable from './components/Log in/Employee Log in/Employee_All';
import UserDashboard from './components/Log in/All User DashBoard/UserDashboard';


// Home page 
import HomePage from './components/User/Home/Home';


// Order User Side
import ProductListCustom from './components/Order/ProductList/ProductListCustom';
import ProductListSuit from './components/Order/ProductList/ProductListSuit';
import ProductListShirt from './components/Order/ProductList/ProductListShirt';
import ProductListTrouser from './components/Order/ProductList/ProductListTrouser';
import ProductDetails from './components/Order/ProductDetails/ProductDetails';
import CustomSuit from './components/Order/Customization/CustomSuit';
import CustomShirt from './components/Order/Customization/CustomShirt';
import CustomTrouser from './components/Order/Customization/CustomTrouser';
import Cart from './components/Order/Cart/Cart';
import Checkout from './components/Order/Checkout/Checkout';
import ProductListAccessories from './components/Order/Accessories/Accessories';


//Order Admin
import OrderAndUserForm from "./components/Order (Admin)/NewUserOrder";
import OrderExUserForm from "./components/Order (Admin)/ExUserOrder";
import RentAndUserForm from "./components/Order (Admin)/NewUserRent";
import RentExUserForm from "./components/Order (Admin)/ExUserRent";
import OrderList from "./components/Order (Admin)/ViewOrder";
import RentList from "./components/Order (Admin)/ViewRent";
import AllOrders from "./components/Order (Admin)/AllOrders";
import AllRentals from "./components/Order (Admin)/AllRentals";
import ReportOrder from "./components/Order (Admin)/Report";


function App() {
  return (
    <div>
    <Router>
        <Routes>
        <Route path="/" element={<HomePage/>}/>

        <Route path="/product/dashboard" element={<ProductDashboard/>} />
        <Route path="/product/add"  element={<ProductUpload />} />
        <Route path="/product/generate-report"  element={<GenerateReportButton />} />
        <Route path="/product/all"  element={<Preview/>} />
        <Route path="/product/buyproducts"  element={<BuyProduct/>} />
        <Route path="/product/rentproducts"  element={<RentProduct/>} />
        <Route path="/product/editproduct/:productId" element={<EditProduct />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path='/header' element={<Header/>}/>



        <Route path="/inventory/dashboard" element={<InventoryDashboard/>}/>
        <Route path="/inventory/addinventory" element={<AddInventoryForm />} /> {/* Route for AddInventoryForm */}
        <Route path='/inventory/request' element={<AddInventoryRequestForm/>} />
        <Route path='/inventory/all' element={<InventoryTable/>} />
        <Route path='/inventory/records' element={<InventoryRecord/>} />
        <Route path='/inventory/report' element={<InventoryReport/>} />
        <Route path='/order/inventoryRequest' element={<AdminInventoryRequestForm/>} />

        <Route path='/productlistCustom/buyproducts' exact element={<ProductListCustom />} />
        <Route path='/productlistsuit/buyproducts' exact element={<ProductListSuit />} />
        <Route path='/productlistshirt/buyproducts' exact element={<ProductListShirt />} />
        <Route path='/productlisttrouser/buyproducts' exact element={<ProductListTrouser />} />
        <Route path='/buyproducts/accessories' exact element={<ProductListAccessories />} />
        <Route path="/order/products/:productId" exact element={<ProductDetails />} />
        <Route path='/order/customsuit/:productId' exact element={<CustomSuit />} />
        <Route path='/order/customshirt/:productId' exact element={<CustomShirt />} />
        <Route path='/order/customtrouser/:productId' exact element={<CustomTrouser />} />
        <Route path='/order/cart' exact element={<Cart />} />
        <Route path='/order/Checkout' exact element={<Checkout />} />

        <Route path="/OrderAdmin" element={<OrderAndUserForm />} />
        <Route path="/AddOrderExUser" element={<OrderExUserForm />} />
        <Route path="/AddRentNewUser" element={<RentAndUserForm />} />
        <Route path="/AddRentExUser" element={<RentExUserForm />} />
        <Route path="/ManageOrder" element={<OrderList />} />
        <Route path="/ManageRent" element={<RentList />} />
        <Route path="/AllOrders" element={<AllOrders />} />
        <Route path="/AllRentals" element={<AllRentals />} />
        <Route path="/ReportOrder" element={<ReportOrder />} />

        <Route path='/contactus' element={<InquiryForm/>}/>
        <Route path='/aboutus' element={<AboutUsPage/>}/>
        <Route path='/inquiry/sent' element={<InquiryList/>}/>
        <Route path='/inquiry/hradmin/inquiries' element={<AdminInquiryList/>}/>
        <Route path='/inquiry/hradmin' element={<HRAdminDashboard/>}/>
        <Route path='/inquiry/report' element={<Report/>}/>
        <Route path='/inquiry/dashboard' element={<InquiryDashboard/>}/>



        <Route path="/employee/add" exact element={<AddEmployee />} />
        <Route path="/employee/all" exact element={<AllEmployees />} />
        <Route path='/employee/leave' exact element={<AllLeaves/>}/>
        <Route path='/employee/leaveRequest' exact element={<EmployeesPage/>}/>
        <Route path='/employee/dashboard' exact element={<EmployeeDashboard/>}/>
        <Route path='/employee/admin/leave' exact element={<AdminLeaves/>}/>
        <Route path='/employee/profile' exact element={<EmployeeDetails/>}/>
        <Route path='/employee/bonus' exact element={<AddEmployeeBonus/>}/>

        <Route path='/user/all' exact element={<UserTable/>}/>
        <Route path='/user/dashboard' exact element={<UserDashboard/>}/>
        <Route path='/AdminDashboard' exact element={<Ad_Dashboard/>}/>
        <Route path='/signup' exact element={<UserForm/>}/>
        <Route path='/login' exact element={<LoginForm/>}/>
        <Route path='/profile' exact element={<UserProfile/>}/>
        <Route path='/delete' exact element={<DeleteAccount/>}/>
        <Route path='/resetPW' exact element={<ResetPassword/>}/>

        <Route path='/employee/signin' exact element={<AddEmployeeForm/>}/>
        <Route path='/employee/login' exact element={<Login/>}/>
        <Route path='/employee/resetpassword' exact element={<PasswordReset/>}/>
        <Route path='/employee/allAccounts' exact element={<EmployeeTable/>}/>
        </Routes>
        </Router>
    </div>
  );
}

export default App;
