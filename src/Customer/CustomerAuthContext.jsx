import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../Admin/utils/axiosConfig";
import { jwtDecode } from "jwt-decode";
import ClipLoader from "react-spinners/ClipLoader";
import { useNotification } from "../NotificationContext";
import { useRef } from "react";
const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [services, setServices] = useState([]);
	const [serviceMap, setServiceMap] = useState({});
	const [employeeMap, setEmployeeMap] = useState({});
	const [error, setError] = useState(null);
	const [message, setMessage] = useState("");
	const [queries, setQueries] = useState([]);

	const [formData, setFormData] = useState({
		pan: "",
		gst: "",
		address: "",
		city: "",
		state: "",
		country: "",
		postalcode: "",
		natureEmployement: "",
		annualIncome: "",
		education: "",
		certifications: "",
		institute: "",
		completiondate: "",
	});

	const { showNotification, setCurrentPage } = useNotification();

	const isInitialLoad = useRef(true);

	useEffect(() => {
		setCurrentPage("customer");
	}, [setCurrentPage]);

	const [isEditing, setIsEditing] = useState(
		Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: false }), {})
	);

	useEffect(() => {
		const validateTokenAndFetchData = async () => {
			const token = localStorage.getItem("customerToken");
			setLoading(true);

			if (!token) {
				setIsLoggedIn(false);
				setLoading(false);
				return;
			}

			try {
				const decodedToken = jwtDecode(token);
				const isTokenValid = decodedToken.exp * 1000 > Date.now();

				if (!isTokenValid) {
					throw new Error("Token expired");
				}

				setIsLoggedIn(true);
				await fetchCustomerDashboard();
			} catch (err) {
				console.error("Token validation failed:", err.message);
				setIsLoggedIn(false);
				setError("Session expired. Please log in again.");
				localStorage.removeItem("customerToken");
			} finally {
				setLoading(false);
			}
		};

		validateTokenAndFetchData();
	}, []);

	const login = async (email, password) => {
		setLoading(true);
		setError(null);

		try {
			const { data } = await axios.post(
				"https://195-35-45-82.sslip.io:8000/api/customers/user-login",
				{ email, password }
			);

			const { token, user } = data;
			if (!token) throw new Error("Token not received from server.");

			localStorage.setItem("customerToken", token);
			setIsLoggedIn(true);
			setUser(user);
			setServices(user.services || []);
			await fetchCustomerDashboard();
			return { success: true };
		} catch (err) {
			handleErrorResponse(err, "Login failed");
			return { success: false, message: err.message };
		} finally {
			setLoading(false);
		}
	};

	const fetchCustomerDashboard = async () => {
		const token = localStorage.getItem("customerToken");

		if (!token) {
			showNotification(
				"Session expired. Please log in again.",
				"error",
				"customer"
			);
			setError("Session expired. Please log in again.");
			logout();
			return;
		}

		try {
			setLoading(true);
			const { data } = await axios.get(
				"https://195-35-45-82.sslip.io:8000/api/customers/cdashboard",
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			setUser(data.user);
			console.log("user", data.user);

			// Add the formatted services mapping
			const formattedServices = data.user.services.map((service) => ({
				orderId: service.orderId,
				serviceId: service.serviceId,
				serviceName: service.serviceName || service.name,
				serviceDescription: service.description || "N/A", // Include description
				purchasedAt: service.purchasedAt || null,
				dueDate: service.dueDate || null,
				status: service.status || "N/A",
				activationStatus: service.activated ? "Active" : "Inactive", // Include activation status
				managedBy: service.managedBy || "Not Assigned", // Include managedBy
				requiredDocuments:
					service.serviceId?.requiredDocuments ||
					service.requiredDocuments ||
					[],
				documents: service.documents || [],
			}));

			setServices(formattedServices);
			console.log("servcies", formattedServices);
			setFormData((prev) => ({
				...prev,
				pan: data.user.pan || "",
				// Update other fields similarly
			}));

			await fetchServiceAndEmployeeMaps(token);

			await fetchQueries();

			// showNotification(
			// 	"Customer Dashboard loaded successfully.",
			// 	"success",
			// 	"customer"
			// );
		} catch (error) {
			showNotification("Failed to load dashboard data", "error");
			handleErrorResponse(error, "Failed to load dashboard data");
		} finally {
			setLoading(false);
		}
	};

	const fetchServiceAndEmployeeMaps = async (token) => {
		try {
			const serviceResponse = await axios.get(
				"https://195-35-45-82.sslip.io:8000/api/customers/user-services",
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			const services = serviceResponse.data.services || [];
			console.log("Fetched services:", services); // Add this line to debug

			const serviceData = services.reduce((map, service) => {
				map[service.serviceId] = service.name;
				return map;
			}, {});
			console.log("Service Map:", serviceData); // Debug the serviceMap

			setServiceMap(serviceData);
		} catch (error) {
			console.error("Error fetching service or employee mappings:", error);
		}
	};

	const logout = () => {
		localStorage.removeItem("customerToken");
		showNotification("Logged Out Successfully", "success");
		setIsLoggedIn(false);
	};

	const handleErrorResponse = (error, defaultMessage) => {
		if (error.response?.status === 401) {
			logout();
			showNotification(
				"Unauthorized access. Please log in again",
				"error",
				"customer"
			);
			setError("Unauthorized access. Please log in again");
		} else {
			setError(error.response?.data?.message || defaultMessage);
		}
	};

	const getAllServicesForCDash = async () => {
		const token = localStorage.getItem("customerToken");

		try {
			const { data } = await axios.get(
				"https://195-35-45-82.sslip.io:8000/api/customers/user-services",
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			return data.services || [];
		} catch (error) {
			showNotification("Failed to fetch services", "error");
			handleErrorResponse(error, "Failed to fetch services");
			return [];
		}
	};

	const uploadDocuments = async (serviceId, files) => {
		const token = localStorage.getItem("customerToken");
		if (!token) {
			showNotification(
				"Session expired. Please log in again.",
				"error",
				"customer"
			);
			throw new Error("No authentication token found");
		}

		const formData = new FormData();
		formData.append("serviceId", serviceId);

		// Convert files object to array and append to formData
		Object.values(files).forEach((file) => {
			formData.append("files", file);
		});

		try {
			const { data } = await axios.post(
				"https://195-35-45-82.sslip.io:8000/api/customers/upload-documents",
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			// Fetch updated dashboard data
			await fetchCustomerDashboard();

			showNotification(
				"Documents uploaded successfully",
				"success",
				"customer"
			);
			return data;
		} catch (error) {
			const errorMessage = error.response?.data?.message || "Upload failed";
			showNotification(errorMessage, "error");
			throw error;
		}
	};

	const fetchQueries = async () => {
		try {
			const response = await axios.get(
				"https://195-35-45-82.sslip.io:8000/api/customers/queries",
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("customerToken")}`,
					},
				}
			);

			if (response.data?.queries) {
				setQueries(response.data.queries);

				console.log("Queries fetched successfully", response.data.queries);
				return response.data.queries; // Return the fetched queries
			} else {
				showNotification("Failed to fetch queries", "error");
				console.error("Unexpected API response format", response.data);
				return []; // Return empty array if data is not in expected format
			}
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || "Failed to fetch queries";
			showNotification(errorMessage, "error");
			console.error("Error fetching queries:", errorMessage);
			return []; // Return empty array on error
		}
	};

	const sendQuery = async (formData) => {
		try {
			const response = await axios.post(
				"https://195-35-45-82.sslip.io:8000/api/customers/sendQuery",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			showNotification(response.data.message, "success");
			setMessage(response.data.message);
			await fetchQueries();
			return true;
		} catch (err) {
			const errorMessage =
				err.response?.data?.message || "Something went wrong";
			showNotification(errorMessage, "error");
			setError(errorMessage);
			return false;
		}
	};

	//customer auth context functions
	// Add these to your existing state in CustomerAuthContext
	const [wallet, setWallet] = useState(null);
	const [referralStats, setReferralStats] = useState(null);

	// Add these functions to your context value
	const fetchWalletDetails = async () => {
		try {
			const response = await axios.get(
				"https://195-35-45-82.sslip.io:8000/api/customers/wallet",
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("customerToken")}`,
					},
				}
			);
			setWallet(response.data.wallet);
			return response.data.wallet;
		} catch (error) {
			showNotification("Failed to fetch wallet details", "error");
			throw error;
		}
	};

	const requestWithdrawal = async (amount) => {
		try {
			const response = await axios.post(
				"https://195-35-45-82.sslip.io:8000/api/customers/wallet/withdraw",
				{ amount },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("customerToken")}`,
					},
				}
			);
			await fetchWalletDetails(); // Refresh wallet data
			showNotification(
				"Withdrawal request submitted successfully",
				"success",
				"customer"
			);
			return response.data;
		} catch (error) {
			showNotification(
				error.response?.data?.message || "Failed to process withdrawal",
				"error",
				"customer"
			);
			throw error;
		}
	};

	const fetchReferralStats = async () => {
		try {
			const response = await axios.get(
				"https://195-35-45-82.sslip.io:8000/api/customers/wallet/referral/stats",
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("customerToken")}`,
					},
				}
			);
			console.log("Referral Stats Response:", response.data.stats); // Add this log
			setReferralStats(response.data.stats);
			return response.data.stats;
		} catch (error) {
			showNotification("Failed to fetch referral stats", "error");
			throw error;
		}
	};

	const [messages, setMessages] = useState([]);

	useEffect(() => {
		let interval;
		fetchMessages();
		interval = setInterval(fetchMessages, 1000);
		return () => clearInterval(interval);
	}, []);

	const fetchMessages = async () => {
		try {
			// setLoading(true);
			const token = localStorage.getItem("customerToken");
			if (!token) {
				setError("No token found. Please log in again.");
				setLoading(false);
				return;
			}
			const response = await axios.get(
				"https://195-35-45-82.sslip.io:8000/api/messages",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setMessages(response.data.messages);
			console.log("messages", response.data.messages);
		} catch (err) {
			console.error("Error fetching messages:", err);
			setError("Failed to load messages.");
		}
	};

	return (
		<CustomerAuthContext.Provider
			value={{
				messages,
				setMessages,
				fetchMessages,

				wallet,
				referralStats,
				fetchWalletDetails,
				requestWithdrawal,
				fetchReferralStats,
				fetchQueries,
				sendQuery,
				uploadDocuments,

				message,
				isLoggedIn,
				user,

				loading,
				setLoading,

				services,
				serviceMap,
				employeeMap,
				formData,
				isEditing,
				login,
				logout,
				fetchCustomerDashboard,
				getAllServicesForCDash,
				setFormData,
				handleInputChange: (e) =>
					setFormData({ ...formData, [e.target.name]: e.target.value }),
				handleEditClick: (field) =>
					setIsEditing((prev) => ({ ...prev, [field]: true })),
				handleSaveProfile: async () => {
					setLoading(true);
					const token = localStorage.getItem("customerToken");

					if (!token) {
						showNotification(
							"Session expired. Please log in again.",
							"error",
							"customer"
						);
						logout();
						return;
					}

					try {
						const { data } = await axios.put(
							"https://195-35-45-82.sslip.io:8000/api/customers/update-profile",
							formData,
							{ headers: { Authorization: `Bearer ${token}` } }
						);
						setLoading(true);
						setUser(data.user);
						await fetchCustomerDashboard();
						setIsEditing(
							Object.keys(isEditing).reduce(
								(acc, key) => ({ ...acc, [key]: false }),
								{}
							)
						);
						showNotification("Profile updated successfully!", "success");
						setLoading(false);
					} catch (err) {
						handleErrorResponse(
							err,
							"An error occurred while updating the profile."
						);
						showNotification("Profile updation error", "error");
						setLoading(false);
					}
				},
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
		</CustomerAuthContext.Provider>
	);
};

export const useCustomerAuth = () => useContext(CustomerAuthContext);
