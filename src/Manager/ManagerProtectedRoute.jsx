// EmployeeProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ManagerContext } from "./ManagerContext";

const ManagerProtectedRoute = ({ element }) => {
	const token = localStorage.getItem("managerToken");

	if (!token) {
		return <Navigate to='/managers/login' replace />;
	}

	return element; // Show the protected element if authenticated
};

export default ManagerProtectedRoute;
