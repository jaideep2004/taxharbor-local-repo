import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "../Admin/utils/axiosConfig";
import { jwtDecode } from "jwt-decode";
import ClipLoader from "react-spinners/ClipLoader";
import { useNotification } from "../NotificationContext";

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
	const [assignedCustomers, setAssignedCustomers] = useState([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [queries, setQueries] = useState([]);
	const [dashboardData, setDashboardData] = useState(null);
	const [user, setUser] = useState(null);
	const [leads, setLeads] = useState([]);

	const { showNotification, setCurrentPage } = useNotification();

	const [formData, setFormData] = useState({});
	const [originalData, setOriginalData] = useState({}); // Keep track of original data
	const [updatedFields, setUpdatedFields] = useState({});

	const [persistedChanges, setPersistedChanges] = useState(() => {
		// Load persisted changes from localStorage on initial render
		const saved = localStorage.getItem("employeeFormChanges");
		return saved ? JSON.parse(saved) : {};
	});

	useEffect(() => {
		if (isAuthenticated) {
			fetchAssignedCustomers();
			fetchEmployeeDashboard();
			fetchAssignedLeads();
		}
		setCurrentPage("employee");
	}, [isAuthenticated, setCurrentPage]);

	useEffect(() => {
		const changes = {};
		Object.keys(formData).forEach((key) => {
			if (formData[key] !== originalData[key]) {
				changes[key] = formData[key];
			}
		});
		localStorage.setItem("employeeFormChanges", JSON.stringify(changes));
		setPersistedChanges(changes);
	}, [formData, originalData]);

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

	const [employeeInfo, setEmployeeInfo] = useState(null);
	const [metrics, setMetrics] = useState(null);
	const [status, setStatus] = useState(null);

	const login = async (email, password) => {
		setLoading(true);
		setError(null);

		try {
			const response = await axios.post(
				"https://195-35-45-82.sslip.io:8000/api/employees/login",
				{ email, password }
			);
			const token = response.data.token;

			if (token) {
				localStorage.setItem("employeeToken", token);
				const decodedToken = jwtDecode(token);
				console.log("Decoded Token:", decodedToken);
				setIsAuthenticated(true);
				// Set user data from decoded token or response if available
				setUser({
					email: decodedToken.email || email,
					downloadAccess: response.data.employee?.downloadAccess || false, // Adjust based on API response
				});
				return true;
			} else {
				throw new Error("Token not received from server.");
			}
		} catch (err) {
			showNotification("Login failed", "error");
			setError(err.response?.data?.message || "Login failed");
			return false;
		} finally {
			setLoading(false);
		}
	};

	// Update fetchEmployeeDashboard function
	const fetchEmployeeDashboard = useCallback(async () => {
		// setLoading(true);
		setError(null);
		try {
			const token = localStorage.getItem("employeeToken");
			if (!token) {
				throw new Error("No token found");
			}

			const response = await axios.get(
				"https://195-35-45-82.sslip.io:8000/api/employees/emdashboard",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const { employeeInfo, metrics, status } = response.data.data;

			setEmployeeInfo(employeeInfo);
			setMetrics(metrics);
			setStatus(status);
			// Set user data from employeeInfo
			setUser({
				email: employeeInfo.email,
				downloadAccess: employeeInfo.downloadAccess,
				// Add other fields as needed
			});

			console.log("employeeInfo", employeeInfo);
			console.log("metrics", metrics);
			console.log("status", status);
			return { employeeInfo, metrics, status };
		} catch (error) {
			console.error("Error fetching dashboard:", error);
			setError(error.message || "Failed to fetch dashboard data");
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchAssignedCustomers = async () => {
		// setLoading(true);
		setError(null);

		try {
			const response = await axios.get(
				"https://195-35-45-82.sslip.io:8000/api/employees/assigned-customers",
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("employeeToken")}`,
					},
				}
			);

			if (response.data.success) {
				setAssignedCustomers(response.data.customers); // Set only the customers array
			} else {
				setAssignedCustomers([]); // Handle no customers
			}

			console.log("Customers", response.data.customers);
		} catch (err) {
			console.error("Error fetching assigned customers:", err);
			setError("Failed to fetch customers.");
			setAssignedCustomers([]); // Ensure it defaults to empty array
		} finally {
			// setLoading(false);
		}
	};

	useEffect(() => {
		let interval;
		fetchQueries();
		interval = setInterval(fetchQueries, 1000);
		return () => clearInterval(interval);
	}, []);

	const fetchQueries = async () => {
		try {
			const response = await axios.get(
				"https://195-35-45-82.sslip.io:8000/api/employees/queries",
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("employeeToken")}`,
					},
				}
			);

			// Set the latest query data in the state
			setQueries(response.data.queries.reverse());
			console.log("employeequeries", response.data.queries);
		} catch (err) {
			console.error("Error fetching queries:", err);
		}
	};

	const updateServiceStatus = async (serviceId, status, customerId) => {
		setLoading(true);
		try {
			const response = await axios.put(
				`https://195-35-45-82.sslip.io:8000/api/employees/update-service-status/${serviceId}`,
				{ status, customerId }, // Pass customerId along with serviceId and status
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("employeeToken")}`,
					},
				}
			);

			// Update the local state correctly for the specific customer and service
			setAssignedCustomers((prevCustomers) =>
				prevCustomers.map((customer) =>
					customer._id === customerId
						? {
								...customer,
								services: customer.services.map((service) =>
									service.serviceId === serviceId
										? { ...service, status }
										: service
								),
						  }
						: customer
				)
			);

			return response.data;
		} catch (err) {
			setError("Error updating service status");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const handleSaveProfile = async () => {
		try {
			const token = localStorage.getItem("employeeToken");
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
				"https://195-35-45-82.sslip.io:8000/api/employees/update-employee-profile",
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
			localStorage.removeItem("employeeFormChanges");
			setPersistedChanges({});

			// Update user data
			setUser(response.data.user);
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

	const logout = () => {
		localStorage.removeItem("employeeToken"); // Clear the token
		showNotification("Logged Out Successfully", "success");
		setIsAuthenticated(false); // Update authentication state
	};

	const reduceUnreadCount = (queryId) => {
		setQueries((prevQueries) =>
			prevQueries.map((qry) =>
				qry._id === queryId
					? { ...qry, status: "responded", isReplied: true }
					: qry
			)
		);
	};

	// Function to fetch assigned leads
	const fetchAssignedLeads = async () => {
		// Only show loading indicator if leads array is empty
		const isInitialLoad = leads.length === 0;
		if (isInitialLoad) setLoading(true);
		setError(null);

		try {
			const response = await axios.get(
				"https://195-35-45-82.sslip.io:8000/api/employees/assigned-leads",
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("employeeToken")}`,
					},
				}
			);

			if (response.data.success) {
				setLeads(response.data.leads || []);
			} else {
				setLeads([]);
			}
		} catch (err) {
			console.error("Error fetching assigned leads:", err);
			setError("Failed to fetch leads.");
			setLeads([]);
			showNotification("Failed to fetch assigned leads", "error");
		} finally {
			if (isInitialLoad) setLoading(false);
		}
	};

	// Function to approve a lead
	const approveLead = async (leadId) => {
		setLoading(true);
		setError(null);

		try {
			const response = await axios.post(
				`https://195-35-45-82.sslip.io:8000/api/employees/approve-lead/${leadId}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("employeeToken")}`,
					},
				}
			);

			if (response.data.success) {
				// Update the local state to reflect the changes
				setLeads((prevLeads) =>
					prevLeads.map((lead) =>
						lead._id === leadId ? { ...lead, status: "approved" } : lead
					)
				);

				showNotification("Lead approved successfully", "success");
				// Refresh leads list
				fetchAssignedLeads();
				return true;
			} else {
				throw new Error(response.data.message || "Failed to approve lead");
			}
		} catch (err) {
			console.error("Error approving lead:", err);
			setError(err.response?.data?.message || "Failed to approve lead");
			showNotification(
				err.response?.data?.message || "Failed to approve lead",
				"error"
			);
			return false;
		} finally {
			setLoading(false);
		}
	};

	// Reject a lead
	const rejectLead = async (leadId, reason) => {
		try {
			setLoading(true);
			const token = localStorage.getItem("employeeToken");

			const response = await axios.put(
				`https://195-35-45-82.sslip.io:8000/api/employees/leads/${leadId}/reject`,
				{ reason },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			// Update the lead in the UI
			setLeads((prevLeads) =>
				prevLeads.map((lead) =>
					lead._id === leadId
						? {
								...lead,
								status: "rejected",
								rejectReason: reason,
								rejectedAt: new Date(),
						  }
						: lead
				)
			);

			showNotification("Lead rejected successfully", "success");
			return true;
		} catch (error) {
			console.error("Error rejecting lead:", error);
			showNotification(
				error.response?.data?.message || "Failed to reject lead",
				"error"
			);
			return false;
		} finally {
			setLoading(false);
		}
	};

	// Upload documents for a lead
	const uploadLeadDocuments = async (leadId, files, note, paymentDetails) => {
		try {
			setLoading(true);
			const token = localStorage.getItem("employeeToken");

			// Create form data
			const formData = new FormData();

			// Add files
			for (let i = 0; i < files.length; i++) {
				formData.append("documents", files[i]);
			}

			// Add note and payment details
			if (note) formData.append("note", note);
			if (paymentDetails) {
				if (paymentDetails.amount)
					formData.append("paymentAmount", paymentDetails.amount);
				if (paymentDetails.method)
					formData.append("paymentMethod", paymentDetails.method);
				if (paymentDetails.reference)
					formData.append("paymentReference", paymentDetails.reference);
			}

			const response = await axios.post(
				`https://195-35-45-82.sslip.io:8000/api/employees/leads/${leadId}/documents`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			// Update the lead in the UI
			setLeads((prevLeads) =>
				prevLeads.map((lead) =>
					lead._id === leadId
						? {
								...lead,
								documents: [
									...(lead.documents || []),
									...response.data.lead.documents,
								],
								employeeNotes: [
									...(lead.employeeNotes || []),
									...(response.data.lead.employeeNotes || []),
								],
								paymentDetails: response.data.lead.paymentDetails,
						  }
						: lead
				)
			);

			showNotification("Documents uploaded successfully", "success");
			return true;
		} catch (error) {
			console.error("Error uploading documents:", error);
			showNotification(
				error.response?.data?.message || "Failed to upload documents",
				"error"
			);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const updateServiceDelayReason = async (
		serviceId,
		delayReason,
		customerId
	) => {
		setLoading(true);
		try {
			const response = await axios.post(
				"https://195-35-45-82.sslip.io:8000/api/employees/update-delay-reason",
				{ serviceId, delayReason, customerId },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("employeeToken")}`,
					},
				}
			);

			showNotification("Delay reason updated successfully", "success");
			return response.data;
		} catch (error) {
			console.error("Error updating delay reason:", error);
			showNotification(
				error.response?.data?.message || "Error updating delay reason",
				"error"
			);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	return (
		<EmployeeContext.Provider
			value={{
				login,
				assignedCustomers,
				loading,
				setLoading,
				error,
				isAuthenticated,
				setIsAuthenticated,
				fetchAssignedCustomers,
				updateServiceStatus,
				queries,
				setQueries,
				// fetchQueries,
				dashboardData,
				user,

				formData,
				setFormData,
				handleFieldUpdate,
				handleSaveProfile,
				updatedFields,
				originalData,
				persistedChanges,

				employeeInfo,
				metrics,
				status,
				fetchEmployeeDashboard,
				logout,
				reduceUnreadCount,
				leads,
				setLeads,
				fetchAssignedLeads,
				approveLead,
				rejectLead,
				uploadLeadDocuments,
				updateServiceDelayReason,
			}}>
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
		</EmployeeContext.Provider>
	);
};
