import React, { useState, useEffect } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import CustomerSidebar from "./CustomerSidebar";
import CustomerTopbar from "./CustomerTopbar";
import CDashSection from "./CDashSection";
import PaymentHistory from "./PaymentHistory";
import CProfileSection from "./CProfileSection";
import { Navigate, useParams } from "react-router-dom";
import CServiceStatus from "./CServiceStatus";
import CMessageCenter from "./CMessageCenter";
import CDocumentUpload from "./CDocumentUpload";
import ClipLoader from "react-spinners/ClipLoader"; // Make sure to install react-spinners
import { useNotification } from "../NotificationContext";
import ServiceProgress from "./ServiceProgress";
import WalletDash from "./WalletDash";

const CustomerDashboard = () => {
	const { isLoggedIn, error, loading, user, fetchCustomerDashboard } =
		useCustomerAuth();

	const [activeSection, setActiveSection] = useState("Dashboard");
	const { email } = useParams(); // Get email from the URL

	console.log("Email from URL params:", email);
	console.log("Is user logged in:", isLoggedIn);

	const { showNotification, setCurrentPage } = useNotification();

	useEffect(() => {
		if (isLoggedIn) {
			fetchCustomerDashboard();
		}
		setCurrentPage("customer");
	}, [isLoggedIn, setCurrentPage]);

	if (loading) {
		return (
			<div
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					background: "rgba(0,0,0,0.5)",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<ClipLoader size={50} color='#ffffff' />
			</div>
		);
	}

	if (!isLoggedIn) return <Navigate to='/customers/login' replace />;
	if (error) {
		return (
			<div className='error-message'>
				<p>{error}</p>
				<button onClick={() => <Navigate to='/customers/login' replace />}>
					Login Again
				</button>
			</div>
		);
	}

	return (
		<div className='customer-dashboard'>
			<CustomerSidebar
				activeSection={activeSection}
				setActiveSection={setActiveSection}
			/>
			<div className='content1'>
				{/* <CustomerTopbar activeSection={activeSection} /> */}
				<div className='content'>
					{activeSection === "Dashboard" && <CDashSection />}
					{activeSection === "Order History" && <CServiceStatus />}
					{activeSection === "Documents Upload" && <CDocumentUpload />}
					{activeSection === "Payment History" && <PaymentHistory />}
					{activeSection === "Profile" && <CProfileSection />}
					{activeSection === "Message Center" && <CMessageCenter />}
					{activeSection === "Wallet" && <WalletDash />}
				</div>
			</div>
		</div>
	);
};

export default CustomerDashboard;
