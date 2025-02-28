// // ManagerContext.jsx

import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "../Admin/utils/axiosConfig";
import { jwtDecode } from "jwt-decode";
import ClipLoader from "react-spinners/ClipLoader";
import { useNotification } from "../NotificationContext";

export const ManagerContext = createContext();

export const ManagerProvider = ({ children }) => {
	const [dashboardData, setDashboardData] = useState({
		managerInfo: null,
		metrics: {
			totalEmployees: 0,
			totalCustomers: 0,
			totalServices: 0,
			totalQueries: 0,
			queryDistribution: { pending: 0, responded: 0, resolved: 0 },
		},
		employees: [],
	});
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const { showNotification, setCurrentPage } = useNotification();

	// Form-related state
	const [formData, setFormData] = useState({});
	const [originalData, setOriginalData] = useState({});
	const [updatedFields, setUpdatedFields] = useState({});
	const [persistedChanges, setPersistedChanges] = useState(() => {
		const saved = localStorage.getItem("managerFormChanges");
		return saved ? JSON.parse(saved) : {};
	});

	// Format dates helper function
	const formatUserDates = (userData) => {
		const dateFields = [
			"dob",
			"dateOfJoining",
			"currentOrgRelieveDate",
			"previousOrgFromDate",
			"previousOrgToDate",
			"passingMonthYear",
		];

		return {
			...userData,
			...Object.fromEntries(
				dateFields.map((field) => [
					field,
					userData[field]
						? new Date(userData[field]).toISOString().split("T")[0]
						: "",
				])
			),
		};
	};

	// Handle field updates
	const handleFieldUpdate = (name, value) => {
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		setUpdatedFields((prev) => ({
			...prev,
			[name]: true,
		}));
	};

	// Persist changes effect
	useEffect(() => {
		const changes = {};
		Object.keys(formData).forEach((key) => {
			if (formData[key] !== originalData[key]) {
				changes[key] = formData[key];
			}
		});
		localStorage.setItem("managerFormChanges", JSON.stringify(changes));
		setPersistedChanges(changes);
	}, [formData, originalData]);

	// Fetch dashboard data
	const fetchManagerDash = useCallback(async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem("managerToken");
			if (!token) throw new Error("No token found");

			const response = await axios.get(
				"https://195-35-45-82.sslip.io:8000/api/managers/mandashboard",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			const { data } = response.data;
			setDashboardData(data);
			console.log("managerData", data);
			// Format the manager info data with proper dates
			const formattedManagerInfo = formatUserDates(data.managerInfo);
			setUser(formattedManagerInfo);

			// Set original data for form change tracking
			setOriginalData(formattedManagerInfo);
			setFormData(formattedManagerInfo);
		} catch (error) {
			console.error("Error fetching dashboard:", error);
			setError("Failed to fetch dashboard data");
			showNotification("Failed to fetch dashboard data", "error");
		} finally {
			setLoading(false);
		}
	}, [showNotification]);

	// Auto-fetch dashboard when authenticated
	useEffect(() => {
		if (isAuthenticated) {
			fetchManagerDash();
		}
		setCurrentPage("manager");
	}, [isAuthenticated, fetchManagerDash, setCurrentPage]);

	// Login function
	const login = async (email, password) => {
		setLoading(true);
		try {
			const response = await axios.post(
				"https://195-35-45-82.sslip.io:8000/api/managers/login",
				{ email, password }
			);

			const { token } = response.data;
			if (token) {
				localStorage.setItem("managerToken", token);
				const decodedToken = jwtDecode(token);
				console.log("Decoded Token:", decodedToken);
				setIsAuthenticated(true);
				await fetchManagerDash();
				showNotification("Login successful", "success");
				return true;
			}
		} catch (err) {
			setError(err.response?.data?.message || "Login failed");
			showNotification("Login failed", "error");
			return false;
		} finally {
			setLoading(false);
		}
	};

	// Save profile function
	const handleSaveProfile = async () => {
		try {
			const token = localStorage.getItem("managerToken");
			if (!token) {
				showNotification("Session expired. Please log in again.", "error");
				return false;
			}
			setLoading(true);

			// Only send fields that have been updated
			const changedFields = Object.keys(updatedFields).reduce((acc, key) => {
				if (formData[key] !== originalData[key]) {
					acc[key] = formData[key];
				}
				return acc;
			}, {});

			const response = await axios.put(
				"https://195-35-45-82.sslip.io:8000/api/managers/update-manager-profile",
				changedFields,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			// Update original data with new values
			setOriginalData((prev) => ({
				...prev,
				...changedFields,
			}));

			// Clear persisted changes after successful save
			localStorage.removeItem("managerFormChanges");
			setPersistedChanges({});

			// Update user data and refresh dashboard
			setUser(response.data.user);
			await fetchManagerDash();

			showNotification("Profile updated successfully!", "success");
			return true;
		} catch (error) {
			console.error("Error updating profile:", error);
			showNotification(
				error.response?.data?.message || "Error updating profile",
				"error"
			);
			return false;
		} finally {
			setLoading(false);
		}
	};

	// Logout function
	const logout = () => {
		localStorage.removeItem("managerToken");
		setDashboardData({
			managerInfo: null,
			metrics: {
				totalEmployees: 0,
				totalCustomers: 0,
				totalServices: 0,
				totalQueries: 0,
				queryDistribution: { pending: 0, responded: 0, resolved: 0 },
			},
			employees: [],
		});
		setIsAuthenticated(false);
		setUser(null);
		setFormData({});
		setOriginalData({});
		setUpdatedFields({});
		setPersistedChanges({});
		showNotification("Logged out successfully", "success");
	};

	const contextValue = {
		dashboardData,
		isAuthenticated,
		setIsAuthenticated,
		loading,
		setLoading,
		error,
		login,
		logout,
		fetchManagerDash,
		user,
		setUser,
		formData,
		setFormData,
		handleFieldUpdate,
		handleSaveProfile,
		updatedFields,
		originalData,
		persistedChanges,
	};

	return (
		<ManagerContext.Provider value={contextValue}>
			{loading && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 9999,
					}}>
					<ClipLoader size={50} color='#ffffff' />
				</div>
			)}
			{children}
		</ManagerContext.Provider>
	);
};

export default ManagerProvider;
