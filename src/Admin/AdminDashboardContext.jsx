import React, { createContext, useState, useEffect, useMemo } from "react";
import axios from "./utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ClipLoader from "react-spinners/ClipLoader";
import { useNotification } from "../NotificationContext";
import { useRef } from "react";
const AdminDashboardContext = createContext();

const AdminDashboardProvider = ({ children }) => {
	const [servicesCount, setServicesCount] = useState(0);
	const [usersCount, setUsersCount] = useState(0);
	const [managersCount, setManagersCount] = useState(0);
	const [employeesCount, setEmployeesCount] = useState(0);
	const [customersCount, setCustomersCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [services, setServices] = useState([]);
	const [users, setUsers] = useState([]);
	const [messages, setMessages] = useState([]);
	const [orders, setOrders] = useState([]);

	const [assignOrder, setAssignOrder] = useState({
		orderId: "",
		employeeId: "",
	});
	const [showAssignOrderForm, setShowAssignOrderForm] = useState(false);

	const { showNotification, setCurrentPage } = useNotification();
	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
	};

	useEffect(() => {
		setCurrentPage("admin");
	}, [setCurrentPage]);
	//login
	const [isAuthenticated, setIsAuthenticated] = useState(
		!!localStorage.getItem("adminToken")
	);

	const [newService, setNewService] = useState({
		category: "",
		name: "",
		description: "",
		actualPrice: "",
		salePrice: "",
		hsncode: "",
		requiredDocuments: [],
		processingDays: 7,
	});

	// const [newService, setNewService] = useState({
	// 	category: "",
	// 	name: "",
	// 	description: "",
	// 	hsncode: "",
	// 	packages: [
	// 		{
	// 			name: "",
	// 			description: "",
	// 			actualPrice: "",
	// 			salePrice: "",
	// 			features: [],
	// 			processingDays: 7,
	// 		},
	// 	],
	// 	requiredDocuments: [],
	// });

	const [newEmployee, setNewEmployee] = useState({
		name: "",
		email: "",
		role: "",
		serviceId: "",
		username: "",
		password: "",
	});
	const [newManager, setNewManager] = useState({
		name: "",
		email: "",
		role: "",
		serviceId: "",
		username: "",
		password: "",
	});
	const [newUser, setNewUser] = useState({
		role: "",
		name: "",
		email: "",
		serviceId: "",
		username: "",
		password: "",
	});
	const [assignCustomer, setAssignCustomer] = useState({
		customerId: "",
		employeeId: "",
	});
	//assign employee
	const [assignEmployee, setAssignEmployee] = useState({
		employeeId: "",
		managerId: "",
	});
	const [assignService, setAssignService] = useState({
		customerId: "",
		serviceId: "",
		employeeId: "",
	});
	const [showUserForm, setShowUserForm] = useState(false);
	const [showEmployeeForm, setShowEmployeeForm] = useState(false);
	// const [showAssignCustomerForm, setShowAssignCustomerForm] = useState(false);
	// Fetch Dashboard Data
	const isInitialLoad = useRef(true);

	useEffect(() => {
		const token = localStorage.getItem("adminToken");
		console.log("Fetching dashboard data...");
		if (token) {
			fetchDashboardData();
		}
		fetchAllOrders();
	}, []);

	const fetchDashboardData = async () => {
		const token = localStorage.getItem("adminToken");
		if (!token) {
			setError("Session expired.Please log in again.");
			// setLoading(false);
			setIsAuthenticated(false);
			showNotification(
				"Session expired. Please log in again.",
				"error",
				"admin"
			);
			return;
		}

		const headers = { Authorization: `Bearer ${token}` };

		try {
			const { data } = await axios.get(
				"http://localhost:8000/api/admin/dashboard",
				{ headers }
			);
			// setLoading(true);
			console.log("admin data", data);
			const { services, users } = data;
			setServices(services);
			setUsers(users);

			setServicesCount(services.length);
			setUsersCount(users.length);
			// console.log("admin users", users);
			setEmployeesCount(
				users.filter((user) => user.role === "employee").length
			);
			setCustomersCount(
				users.filter((user) => user.role === "customer").length
			);
			setManagersCount(users.filter((user) => user.role === "manager").length);

			// Only show success notification on the first load
			// if (isInitialLoad.current) {
			showNotification(
				"Admin Dashboard loaded successfully.",
				"success",
				"admin"
			);

			// }
		} catch (err) {
			console.error("Dashboard fetch error:", err);
			const errorMessage =
				err.response?.data?.message || "Failed to load dashboard data.";
			showNotification(errorMessage, "error");
			setError(errorMessage);

			if (err.response && err.response.status === 401) {
				setIsAuthenticated(false);
				localStorage.removeItem("adminToken");
				// Show notification and prevent automatic redirect for a session-expired error
				showNotification(
					"Session expired. Please log in again.",
					"error",
					"admin"
				);
				setError("Session expired. Please log in again.");
			}
		}
	};

	const resetError = () => {
		setError(null);
		setLoading(false);
	};

	//login
	const login = async (email, password) => {
		setLoading(true);
		try {
			// Send login request
			const response = await axios.post(
				"http://localhost:8000/api/admin/login",
				{
					email,
					password,
				}
			);
			const token = response.data.token;
			if (token) {
				// Debugging: Log received token
				console.log("Received Token:", token);
				// Validate and decode token
				try {
					const decodedToken = jwtDecode(token);
					console.log("Decoded Token:", decodedToken); // Check token structure
					// Save token and update state
					localStorage.setItem("adminToken", token);
					setIsAuthenticated(true);
					await fetchDashboardData();
					return true; // Successful login
				} catch (decodeError) {
					console.error("Error decoding token:", decodeError);
					throw new Error("Invalid token structure received.");
				}
			} else {
				throw new Error("Token not received from server.");
			}
		} catch (err) {
			console.error("Login error:", err.response?.data?.message || err.message);
			showNotification("Login error", "error", "admin");
			return false; // Login failed
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		localStorage.removeItem("adminToken"); // Clear the token
		showNotification("Logged Out Successfully", "success");
		setIsAuthenticated(false); // Update authentication state
	};

	// const handleCreateService = async () => {
	// 	setLoading(true);
	// 	const {
	// 		category,
	// 		name,
	// 		description,
	// 		hsncode,
	// 		packages,
	// 		requiredDocuments,
	// 	} = newService;

	// 	if (!category || !name || !description || !hsncode || !packages?.length) {
	// 		showNotification(
	// 			"Please fill in all required fields and add at least one package.",
	// 			"error"
	// 		);
	// 		setLoading(false);
	// 		return;
	// 	}

	// 	try {
	// 		const token = localStorage.getItem("adminToken");
	// 		const { data } = await axios.post(
	// 			"http://localhost:8000/api/admin/services",
	// 			{
	// 				category,
	// 				name,
	// 				description,
	// 				hsncode,
	// 				packages,
	// 				requiredDocuments,
	// 			},
	// 			{ headers: { Authorization: `Bearer ${token}` } }
	// 		);
	// 		setServices((prevServices) => [...prevServices, data.service]);
	// 		showNotification("Service created successfully", "success", "admin");
	// 		setLoading(false);
	// 		setServicesCount(services.length);
	// 		fetchDashboardData();
	// 		setNewService({
	// 			category: "",
	// 			name: "",
	// 			description: "",
	// 			hsncode: "",
	// 			packages: [],
	// 			requiredDocuments: [],
	// 		});
	// 	} catch (err) {
	// 		showNotification(
	// 			err.response?.data?.message || "Error creating service.",
	// 			"error",
	// 			"admin"
	// 		);
	// 		setLoading(false);
	// 	}
	// };

	const handleCreateService = async () => {
		setLoading(true);
		const {
			category,
			name,
			description,
			actualPrice,
			salePrice,
			hsncode,
			processingDays,
			requiredDocuments,
		} = newService;
		if (
			!category ||
			!name ||
			!description ||
			!actualPrice ||
			!salePrice ||
			!hsncode ||
			!processingDays
		) {
			showNotification("Please fill in all fields.", "error");
			setLoading(false);
			return;
		}
		try {
			const token = localStorage.getItem("adminToken");
			const { data } = await axios.post(
				"http://localhost:8000/api/admin/services",
				{
					category,
					name,
					description,
					actualPrice,
					salePrice,
					hsncode,
					processingDays,
					requiredDocuments,
				},
				{ headers: { Authorization: ` Bearer ${token}` } }
			);
			setServices((prevServices) => [...prevServices, data.service]);
			showNotification("Service created successfully", "success");
			setLoading(false);
			setServicesCount(services.length);
			fetchDashboardData();
			setNewService({
				category: "",
				name: "",
				description: "",
				actualPrice: "",
				salePrice: "",
				hsncode: "",
				processingDays: 7,
				requiredDocuments: [],
			});
		} catch (err) {
			showNotification(
				err.response?.data?.message || "Error creating service.",
				"error",
				"admin"
			);
			setLoading(false);
		}
	};

	// Other functions follow the same error handling pattern
	const handleCreateManager = async () => {
		setLoading(true);
		const { name, email, username, password } = newManager;

		if (!name || !email || !username || !password) {
			showNotification("Please provide all fields.", "error");
			setLoading(false);
			return;
		}

		try {
			const token = localStorage.getItem("adminToken");
			const response = await axios.post(
				"http://localhost:8000/api/admin/manager",
				{ name, email, role: "manager", username, password },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			showNotification("Manager created successfully", "success");
			// Wait for the dashboard data to refresh
			// await fetchDashboardData();

			setLoading(false);
			fetchDashboardData();
			setNewManager({
				name: "",
				email: "",

				username: "",
				password: "",
			});
		} catch (err) {
			showNotification("Error creating manager.", "error");
			setLoading(false);
		}
	};

	// const handleCreateEmployee = async () => {
	// 	setLoading(true);
	// 	const {
	// 		name,
	// 		email,
	// 		serviceId,
	// 		username,
	// 		password,
	// 		Lminus1code,
	// 		L1EmpCode,
	// 	} = newEmployee;

	// 	// Validate required fields
	// 	if (
	// 		!name ||
	// 		!email ||
	// 		!serviceId ||
	// 		!username ||
	// 		!password ||
	// 		!Lminus1code ||
	// 		!L1EmpCode
	// 	) {
	// 		showNotification("Please provide all fields", "error");
	// 		setLoading(false);
	// 		return;
	// 	}

	// 	try {
	// 		const token = localStorage.getItem("adminToken");
	// 		const { data } = await axios.post(
	// 			"http://localhost:8000/api/admin/employee",
	// 			{
	// 				name,
	// 				email,
	// 				role: "employee",
	// 				serviceId,
	// 				username,
	// 				password,
	// 				Lminus1code,
	// 				L1EmpCode,
	// 			},
	// 			{ headers: { Authorization: `Bearer ${token}` } }
	// 		);

	// 		setUsers((prevUsers) => [...prevUsers, data.employee]);
	// 		showNotification("Employee created successfully.", "success");
	// 		setLoading(false);
	// 		fetchDashboardData();
	// 		setNewEmployee({
	// 			name: "",
	// 			email: "",
	// 			serviceId: "",
	// 			username: "",
	// 			password: "",
	// 			Lminus1code: "",
	// 			L1EmpCode: "",
	// 		});
	// 	} catch (err) {
	// 		showNotification("Error creating employee.", "error");
	// 		setLoading(false);
	// 		console.error("Error creating employee:", err);
	// 	}
	// };

	const handleCreateEmployee = async () => {
		setLoading(true);
		const {
			name,
			email,
			services, // Changed from serviceId to services array
			username,
			password,
			Lminus1code,
			L1EmpCode,
		} = newEmployee;

		// Validate required fields
		if (
			!name ||
			!email ||
			!services ||
			!Array.isArray(services) ||
			services.length === 0 ||
			!username ||
			!password ||
			!Lminus1code ||
			!L1EmpCode
		) {
			showNotification(
				"Please provide all fields. Make sure to select at least one service.",
				"error"
			);
			setLoading(false);
			return;
		}

		try {
			const token = localStorage.getItem("adminToken");
			const { data } = await axios.post(
				"http://localhost:8000/api/admin/employee",
				{
					name,
					email,
					role: "employee",
					services, // Send the array of service IDs
					username,
					password,
					Lminus1code,
					L1EmpCode,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			setUsers((prevUsers) => [...prevUsers, data.employee]);
			showNotification("Employee created successfully.", "success");
			setLoading(false);
			fetchDashboardData();

			// Reset form fields including the services array
			setNewEmployee({
				name: "",
				email: "",
				services: [], // Reset services array instead of serviceId
				username: "",
				password: "",
				Lminus1code: "",
				L1EmpCode: "",
			});
		} catch (err) {
			showNotification("Error creating employee.", "error");
			setLoading(false);
			console.error("Error creating employee:", err);
		}
	};

	const handleActivateUser = async (userId) => {
		setLoading(true);
		// Optimistically update the state
		setUsers((prevUsers) =>
			prevUsers.map((user) =>
				user._id === userId ? { ...user, isActive: true } : user
			)
		);

		try {
			const token = localStorage.getItem("adminToken");
			await axios.put(
				`http://localhost:8000/api/admin/user/activate/${userId}`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			showNotification("User activated successfully.", "success");
			setLoading(false);
			fetchDashboardData();
		} catch (err) {
			console.error("Error activating user:", err);
			// Revert state if the API call fails
			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user._id === userId ? { ...user, isActive: false } : user
				)
			);

			showNotification(
				"Failed to activate user. Please try again.",
				"error",
				"admin"
			);
			setLoading(false);
		}
	};

	const handleDeactivateUser = async (userId) => {
		setLoading(true);
		try {
			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user._id === userId ? { ...user, isActive: true } : user
				)
			);
			const token = localStorage.getItem("adminToken");
			await axios.put(
				`http://localhost:8000/api/admin/user/deactivate/${userId}`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			showNotification("User deactivated successfully.", "success");
			setLoading(false);
			fetchDashboardData();
			setUsers(
				users.map((user) =>
					user._id === userId ? { ...user, isActive: false } : user
				)
			);
		} catch (err) {
			console.error("Error deactivating user:", err);
			showNotification("Error deactivating user", "error");
			setLoading(false);
		}
	};

	const handleDeleteUser = async (userId) => {
		setLoading(true);
		try {
			const token = localStorage.getItem("adminToken");
			await axios.delete(`http://localhost:8000/api/admin/user/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			showNotification("User deleted successfully.", "success");
			setLoading(false);
			fetchDashboardData();
			setUsers(users.filter((user) => user._id !== userId));
		} catch (err) {
			console.error("Error deleting user:", err);
			showNotification("Error deleting user", "error");
		}
	};

	const handleAssignOrderToEmployee = async () => {
		setLoading(true);
		const { orderId, employeeId } = assignOrder; // Changed from assignCustomer to assignOrder
		if (!orderId || !employeeId) {
			showNotification("Please provide all fields.", "error");
			setLoading(false);
			return;
		}
		try {
			const token = localStorage.getItem("adminToken");
			console.log("Assign Order Payload:", { orderId, employeeId });
			await axios.post(
				"http://localhost:8000/api/admin/assign-order",
				{ orderId, employeeId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			showNotification("Order assigned to employee successfully.", "success");
			setLoading(false);
			setShowAssignOrderForm(false);
			setAssignOrder({ orderId: "", employeeId: "" });
			// Refresh data
			fetchAllOrders();
		} catch (err) {
			console.error("Error assigning order:", err.response?.data || err);
			showNotification("Error assigning order", "error");
			setLoading(false);
		}
	};

	const handleAssignEmployee = async () => {
		setLoading(true);
		const { employeeId, managerId } = assignEmployee;

		if (!employeeId || !managerId) {
			showNotification("Please provide all fields.", "error");
			setLoading(false);
			return;
		}

		try {
			const token = localStorage.getItem("adminToken");
			await axios.post(
				"http://localhost:8000/api/admin/assign-employee",
				{ employeeId, managerId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			showNotification("Employee assigned to Manager successfully.", "success");
			setShowAssignEmployeeForm(false);
			setLoading(false);
			setAssignEmployee({ employeeId: "", managerId: "" });
		} catch (err) {
			showNotification("Error assigning employee.", "error");
			setLoading(false);
			console.error("Error assigning employee:", err);
		}
	};

	const handleUpdateService = async (updatedService, extensionDays = 0) => {
		setLoading(true);
		try {
			const token = localStorage.getItem("adminToken");

			// Add extension days to the request if provided
			const requestData = {
				...updatedService,
				extensionDays: extensionDays,
			};

			const response = await axios.put(
				`http://localhost:8000/api/admin/services/${updatedService._id}`,
				requestData,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setServices((prevServices) =>
				prevServices.map((service) =>
					service._id === updatedService._id ? response.data.service : service
				)
			);

			showNotification("Service updated successfully!", "success");
			setLoading(false);
			await fetchDashboardData();
			return true;
		} catch (error) {
			console.error("Error updating service:", error);
			showNotification(
				error.response?.data?.message ||
					"Failed to update service. Please try again.",
				"error",
				"admin"
			);
			setLoading(false);
			return false;
		}
	};

	const handleDeleteService = async (serviceId) => {
		setLoading(true);
		try {
			const token = localStorage.getItem("adminToken");
			await axios.delete(
				`http://localhost:8000/api/admin/services/${serviceId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setServices((prevServices) =>
				prevServices.filter((service) => service._id !== serviceId)
			);

			showNotification("Service deleted successfully!", "success");
			fetchDashboardData();
			setLoading(false);
		} catch (error) {
			console.error("Error deleting service:", error);
			showNotification(
				"Failed to delete service. Please try again.",
				"error",
				"admin"
			);
			setLoading(false);
		}
	};

	const employees = useMemo(() => {
		return users.filter((user) => user && user.role === "employee");
	}, [users]);
	// console.log("employees", employees);
	const managers = useMemo(() => {
		return users.filter((user) => user && user.role === "manager");
	}, [users]);

	const customers = useMemo(() => {
		return users.filter((user) => user && user.role === "customer");
	}, [users]);
	// console.log("customers", customers);
	// Add the update service status function here
	const updateServiceStatusByAdmin = async (userId, serviceId, status) => {
		try {
			setLoading(true);

			// Retrieve the admin token from localStorage
			const token = localStorage.getItem("adminToken");
			console.log("Admin Token:", token); // Log the token

			// Check if token exists, if not, handle the error (e.g., redirect to login or show a message)
			if (!token) {
				setError("Authorization token is missing.");
				console.log("Authorization token is missing."); // Log the error
				return;
			}

			// Make the API request with the Authorization header
			console.log("Making API request to update service status..."); // Log before making the request
			const response = await axios.put(
				`http://localhost:8000/api/admin/update-service-status/${userId}`,
				{ serviceId, status }, // Pass serviceId and status
				{
					headers: {
						Authorization: `Bearer ${token}`, // Add the token to the headers
					},
				}
			);

			// Log the response to check if the status is updated correctly
			console.log("API Response:", response.data);

			// Update the state with the new service status
			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user._id === userId
						? {
								...user,
								services: user.services.map((service) =>
									service.serviceId === serviceId // Compare by serviceId
										? { ...service, status: response.data.status } // Update the status
										: service
								),
						  }
						: user
				)
			);

			return response.data; // Return the updated data if needed
		} catch (err) {
			setError("Failed to update service status.");
			console.error("Error:", err); // Log the full error for debugging
		} finally {
			setLoading(false);
		}
	};

	const fetchAllOrders = async () => {
		try {
			const token = localStorage.getItem("adminToken");
			const { data } = await axios.get(
				"http://localhost:8000/api/admin/orders",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			setOrders(data.orders);
			console.log("Oorders:", data.orders);
		} catch (error) {
			console.error("Error fetching orders:", error);
			showNotification(
				error.response?.data?.message || "Error fetching orders",
				"error",
				"admin"
			);
		}
	};

	const [filters, setFilters] = useState({
		customerId: "",
		serviceId: "",
		orderId: "",
	});

	const fetchMessages = async () => {
		try {
			// setLoading(true);
			const response = await axios.get("http://localhost:8000/api/messages", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
				},
				params: filters,
			});
			setMessages(response.data.messages);
		} catch (err) {
			console.error("Error fetching messages:", err);
			setError("Failed to load messages");
		} finally {
			// setLoading(false);
		}
	};

	useEffect(() => {
		fetchMessages();

		const interval = setInterval(fetchMessages, 1000);
		return () => clearInterval(interval);
	}, [filters]);

	const reduceUnreadCount = (messageId) => {
		setMessages((prevMessages) =>
			prevMessages.map((msg) =>
				msg._id === messageId ? { ...msg, isReplied: true } : msg
			)
		);
	};

	const [assigningService, setAssigningService] = useState(false);

	// AdminDashboardContext.js
	const handleAssignService = async (userId, serviceId) => {
		try {
			setAssigningService(true);
			const response = await axios.post(
				`http://localhost:8000/api/admin/users/${userId}/assign-service`,
				{ serviceId }
			);
			if (response.status === 200) {
				const updatedUsers = users.map((user) =>
					user._id === userId
						? {
								...user,
								services: [
									...(user.services || []),
									{
										serviceId,
										name: services.find((s) => s._id === serviceId).name,
										status: "In Process",
									},
								],
						  }
						: user
				);
				updateUsers(updatedUsers);
				showNotification("Service assigned successfully", "success");
			}
		} catch (error) {
			showNotification("Error assigning service", "error");
		} finally {
			setAssigningService(false);
		}
	};

	const updateUsers = (newUsers) => {
		setUsers(newUsers);
	};

	return (
		<AdminDashboardContext.Provider
			value={{
				servicesCount,
				usersCount,
				employeesCount,
				managersCount,
				customersCount,
				// loading,
				setError,
				services,
				setServices,
				users,
				setUsers,
				newService,
				setNewService,
				newEmployee,
				setNewEmployee,
				newManager,
				setNewManager,
				newUser,
				setNewUser,
				fetchDashboardData,
				handleCreateService,
				resetError,
				handleCreateManager,
				handleActivateUser,
				handleDeactivateUser,
				// handleCreateUser,
				handleDeleteUser,
				assignCustomer,
				assignService,
				setAssignService,
				setAssignCustomer,
				handleCreateEmployee,
				// handleAssignCustomer,
				// handleAssignService,
				handleUpdateService,
				handleDeleteService,
				//login
				isAuthenticated,
				login,
				logout,
				employees,
				managers,
				customers,
				handleAssignEmployee,
				assignEmployee,
				setAssignEmployee,
				updateServiceStatusByAdmin,

				assigningService,
				setAssigningService,
				handleAssignService,

				messages,
				setMessages,
				error,
				filters,
				setFilters,
				fetchMessages,
				reduceUnreadCount,
				fetchAllOrders,
				updateUsers,
				orders,
				setOrders,
				assignOrder,
				setAssignOrder,
				handleAssignOrderToEmployee,
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
		</AdminDashboardContext.Provider>
	);
};

export { AdminDashboardContext, AdminDashboardProvider };
