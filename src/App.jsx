import "./App.css";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Header from "./components/Header/Header";
import Section1 from "./components/Section1/Section1";
import About from "./components/AboutUs/About";
import ContactUs from "./components/ContactUs/ContactUs";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import LoginPage from "./Admin/utils/LoginPage";
import AdminDashboard from "./Admin/AdminDashboard";
import ProtectedRoute from "./Admin/utils/ProtectedRoute";

import ServicePage from "./components/Services/ServicePage";

import { useState } from "react";
import CustomerDashboard from "./Customer/CustomerDashboard";
import CustomerLoginPage from "./Customer/CustomerLoginPage";
import { CustomerAuthProvider } from "./Customer/CustomerAuthContext";
import { useNavigate } from "react-router-dom";
import CustomerProtectedRoute from "./Customer/CustomerProtectedRoute";
import CDashSection from "./Customer/CDashSection";
import { EmployeeContext, EmployeeProvider } from "./Employee/EmployeeContext";
import EmployeeLoginPage from "./Employee/EmLoginPage";
import EmLoginPage from "./Employee/EmLoginPage";
import EmployeeProtectedRoute from "./Employee/EmployeeProtectedRoute";
import EmployeeDashboard from "./Employee/EmployeeDashboard";
import { NotificationProvider } from "./NotificationContext";
import { AdminDashboardProvider } from "./Admin/AdminDashboardContext";
import ServiceProgress from "./Customer/ServiceProgress";
import { ManagerProvider } from "./Manager/ManagerContext";
import { ManagerContext } from "./Manager/ManagerContext";
import ManLogin from "./Manager/ManLogin";
import ManagerProtectedRoute from "./Manager/ManagerProtectedRoute";
import ManagerDashboard from "./Manager/ManagerDashboard";
import CategoryPage from "./components/Services/CategoryPage";
import FlexiCustomerForm from "./components/Services/FlexiCustomerForm";
import LifeInsurancePage from "./components/Services/Category2";
import PersonalLoanPage from "./components/Services/Category3";

function App() {
	return (
		<NotificationProvider>
			<AdminDashboardProvider>
				<ManagerProvider>
					<EmployeeProvider>
						<CustomerAuthProvider>
							<Router>
								{/* <Header /> */}
								<Routes>
									<Route
										path='/'
										element={
											<>
												<Header />
												<Home />
											</>
										}
									/>

									<Route
										path='/section1'
										element={
											<>
												<Section1 />
											</>
										}
									/>

									<Route
										path='/about'
										element={
											<>
												<Header />
												<About />
											</>
										}
									/>
									<Route
										path='/services/:serviceId'
										element={
											<>
												<Header />
												<ServicePage />
											</>
										}
									/>
									<Route
										path='/category/:categoryName'
										element={
											<>
												<Header />
												<CategoryPage />
											</>
										}
									/>
									<Route
										path='/contact'
										element={
											<>
												<Header />
												<ContactUs />
											</>
										}
									/>
									<Route
										path='/admin/login'
										element={
											<>
												<Header />
												<LoginPage />
											</>
										}
									/>
									<Route
										path='/lifeinsurance'
										element={
											<>
												<Header />
												<LifeInsurancePage />
											</>
										}
									/>
									<Route
										path='/personalLoan'
										element={
											<>
												<Header />
												<PersonalLoanPage />
											</>
										}
									/>
									<Route
										path='/admin/dashboard'
										element={<ProtectedRoute element={<AdminDashboard />} />}
									/>
									<Route
										path='/admin/*'
										element={<Navigate to='/admin/login' replace />}
									/>
									<Route path='*' element={<Navigate to='/' replace />} />
									{/* Customer Routes */}

									<Route
										path='/customers/login'
										element={
											<>
												<Header />
												<CustomerLoginPage />
											</>
										}
									/>

									<Route
										path='/register'
										element={
											<>
												<Header />
												<FlexiCustomerForm />
											</>
										}
									/>

									<Route
										path='/customers/dashboard/:email'
										element={
											<CustomerProtectedRoute element={<CustomerDashboard />} />
										}
									/>

									<Route
										path='/customers/*'
										element={<Navigate to='/customers/login' replace />}
									/>
									<Route
										path='/employees/login'
										element={
											<>
												<Header />
												<EmLoginPage />
											</>
										}
									/>
									<Route
										path='/employees/dashboard/:email'
										element={
											<EmployeeProtectedRoute element={<EmployeeDashboard />} />
										}
									/>
									<Route
										path='/employees/*'
										element={<Navigate to='/employees/login' replace />}
									/>
									<Route
										path='/managers/login'
										element={
											<>
												<Header />
												<ManLogin />
											</>
										}
									/>
									<Route
										path='/managers/dashboard/:email'
										element={
											<ManagerProtectedRoute element={<ManagerDashboard />} />
										}
									/>
									<Route
										path='/managers/*'
										element={<Navigate to='/managers/login' replace />}
									/>
								</Routes>
								<Footer />
							</Router>
						</CustomerAuthProvider>
					</EmployeeProvider>
				</ManagerProvider>
			</AdminDashboardProvider>
		</NotificationProvider>
	);
}

export default App;
