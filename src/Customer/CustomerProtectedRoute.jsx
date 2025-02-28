import React from "react";
import { Navigate } from "react-router-dom";
import { useCustomerAuth } from "./CustomerAuthContext"; // Import the custom hook to access login state

const CustomerProtectedRoute = ({ element }) => {
	const token = localStorage.getItem("customerToken");

	if (!token) {
		return <Navigate to='/customers/login' replace />;
	}

	return element; // If logged in, render the protected element
};

export default CustomerProtectedRoute;

