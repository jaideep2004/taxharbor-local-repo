import React, { useState, useContext, useRef, useMemo } from "react";
import axios from "./utils/axiosConfig";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";

const EmployeesSection = () => {
	// ... keep existing state variables ...
	const [showEmployeeForm, setShowEmployeeForm] = useState(false);
	const [showAssignCustomerForm, setShowAssignCustomerForm] = useState(false);
	const [promotingEmployee, setPromotingEmployee] = useState(null);
	const [showPromoteModal, setShowPromoteModal] = useState(false);
	const [dateFilter, setDateFilter] = useState({ fromDate: "", toDate: "" });
	const [searchTerm, setSearchTerm] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [filterOption, setFilterOption] = useState("newest");
	// Add new state for row editing
	const [editingRow, setEditingRow] = useState(null);
	const [editedData, setEditedData] = useState({});
	const [originalData, setOriginalData] = useState({});
	const [openDialog, setOpenDialog] = useState(false);

	const [showAssignOrderForm, setShowAssignOrderForm] = useState(false);
	// const [assignOrder, setAssignOrder] = useState({
	// 	orderId: "",
	// 	employeeId: "",
	// });

	const [selectedServices, setSelectedServices] = useState([]);

	const {
		users,
		customers,
		setUsers,
		services,
		employees,
		newEmployee,
		setNewEmployee,
		assignCustomer,
		assignService,
		setAssignService,
		setAssignCustomer,
		handleCreateEmployee,
		handleAssignCustomer,
		handleActivateUser,
		handleDeactivateUser,
		handleDeleteUser,

		updateUsers,
		orders,
		setOrders,
		assignOrder,
		setAssignOrder,
		handleAssignOrderToEmployee,
	} = useContext(AdminDashboardContext);

	// Start editing row
	const handleStartEdit = (employee) => {
		setEditingRow(employee._id);
		const initialData = {
			name: employee.name,
			email: employee.email,
			username: employee.username,
			phoneNumber: employee.phoneNumber || "",
			gender: employee.gender || "",
			L1EmpCode: employee.L1EmpCode || "",
			L1Name: employee.L1Name || "",
			L2EmpCode: employee.L2EmpCode || "",
			L2Name: employee.L2Name || "",
			employeeStatus: employee.employeeStatus || "",
			pan: employee.pan || "",
			tan: employee.tan || "",
			gst: employee.gst || "",
			address: employee.fulladdress || employee.address || "",
			city: employee.city || "",
			state: employee.state || "",
			country: employee.country || "",
			postalCode: employee.postalCode || "",
			departmentName: employee.departmentName || "",
			designation: employee.designation || "",
			education: employee.educationQualification || employee.education || "",
			university: employee.university || "",
			certifications: employee.certifications || "",
		};
		setEditedData(initialData);
		setOriginalData(initialData);
	};

	const formatDate = (dateStr) => {
		if (!dateStr) return "Not available";
		const date = new Date(dateStr);
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
	};

	// Handle field change
	const handleFieldChange = (field, value) => {
		setEditedData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	// Get changed fields
	const getChangedFields = () => {
		const changes = {};
		Object.keys(editedData).forEach((key) => {
			if (editedData[key] !== originalData[key]) {
				changes[key] = editedData[key];
			}
		});
		return changes;
	};

	// Handle save
	const handleSave = async () => {
		const changes = getChangedFields();
		if (Object.keys(changes).length === 0) {
			setEditingRow(null);
			return;
		}
		setOpenDialog(true);
	};

	// Handle confirm save
	const handleConfirmSave = async () => {
		const changes = getChangedFields();
		try {
			const response = await axios.patch(
				`https://195-35-45-82.sslip.io:8000/api/admin/users/${editingRow}`,
				changes
			);

			if (response.status === 200) {
				const updatedUsers = users.map((user) => {
					if (user._id === editingRow) {
						return { ...user, ...changes };
					}
					return user;
				});
				updateUsers(updatedUsers);
				alert("Updated successfully");
			}
		} catch (error) {
			console.error("Error updating employee:", error);
			alert("Error updating employee");
		}
		setEditingRow(null);
		setOpenDialog(false);
	};

	// Handle cancel
	const handleCancel = () => {
		setEditingRow(null);
		setEditedData({});
		setOriginalData({});
	};

	const normalizeDate = (dateStr) => {
		const date = new Date(dateStr);
		date.setHours(0, 0, 0, 0);
		return date;
	};

	const filteredEmployees = useMemo(() => {
		return employees
			.filter((employee) => {
				// Combined search for ID, name, and email
				const lowerSearchTerm = searchTerm.toLowerCase();
				return (
					employee._id.toLowerCase().includes(lowerSearchTerm) ||
					employee.name.toLowerCase().includes(lowerSearchTerm) ||
					employee.email.toLowerCase().includes(lowerSearchTerm) ||
					(employee.username &&
						employee.username.toLowerCase().includes(lowerSearchTerm))
				);
			})
			.filter((employee) => {
				const employeeDate = new Date(employee.createdAt);
				const fromDate = dateFilter.fromDate
					? normalizeDate(dateFilter.fromDate)
					: null;
				const toDate = dateFilter.toDate
					? normalizeDate(dateFilter.toDate)
					: null;

				return (
					(fromDate === null || employeeDate >= fromDate) &&
					(toDate === null || employeeDate <= toDate)
				);
			})
			.sort((a, b) => {
				if (filterOption === "newest") {
					return new Date(b.createdAt) - new Date(a.createdAt);
				} else if (filterOption === "alphabetical") {
					return a.name.localeCompare(b.name);
				}
				return 0;
			});
	}, [employees, searchTerm, dateFilter, filterOption]);

	//promote
	const handlePromoteToManager = async () => {
		const token = localStorage.getItem("adminToken");
		if (!promotingEmployee) return;

		setLoading(true);
		try {
			const response = await axios.post(
				"https://195-35-45-82.sslip.io:8000/api/admin/promote-to-manager",
				{
					employeeId: promotingEmployee._id,
				},
				{ headers: { Authorization: ` Bearer ${token}` } }
			);

			if (response.status === 200) {
				// Update the local state
				const updatedUsers = users.map((user) => {
					if (user._id === promotingEmployee._id) {
						return { ...user, role: "manager" };
					}
					return user;
				});
				updateUsers(updatedUsers);
				alert(
					response.data.message || "Employee promoted to manager successfully"
				);
			}
		} catch (error) {
			console.error("Error promoting employee:", error);
			alert(error.response?.data?.message || "Failed to promote employee");
		} finally {
			setLoading(false);
			setShowPromoteModal(false);
			setPromotingEmployee(null);
		}
	};

	const handleDownloadCSV = () => {
		const csvData = employees.map((employee) => ({
			"Employee Code": employee._id,
			"Full Name": employee.name,
			"Email ID": employee.email,
			Username: employee.username,
			"Phone Number": employee.phoneNumber || "-",
			"Date of Birth": formatDate(employee.dob),
			Gender: employee.gender || "-",
			"L1 Employee Code": employee.L1EmpCode || "-",
			"L1 Name": employee.L1Name || "-",
			"L2 Employee Code": employee.L2EmpCode || "-",
			"L2 Name": employee.L2Name || "-",
			// "Department Code": employee.departmentCode || "-",
			"Department Name": employee.departmentName || "-",
			"Position Code": employee.positionCode || "-",
			"Position Description": employee.positionDescription || "-",
			Designation: employee.designation || "-",
			"Employee Status": employee.employeeStatus || "-",
			"Date of Joining": formatDate(employee.dateOfJoining),
			PAN: employee.pan || "-",
			TAN: employee.tan || "-",
			GSTIN: employee.gst || "-",
			"Full Address": employee.fulladdress || employee.address || "-",
			City: employee.city || "-",
			State: employee.state || "-",
			Country: employee.country || "-",
			"Postal Code": employee.postalCode || "-",
			"Education Qualification":
				employee.educationQualification || employee.education || "-",
			University: employee.university || "-",
			"Passing Month & Year": formatDate(employee.passingMonthYear),
			"Total Experience": employee.totalExperience || "-",
			"Previous Organization": employee.previousOrganization || "-",
			"Previous Org From Date": formatDate(employee.previousOrgFromDate),
			"Previous Org To Date": formatDate(employee.previousOrgToDate),
			"Reason For Leaving": employee.reasonForLeaving || "-",
			"Bank Account Number": employee.bankDetails?.accountNumber || "-",
			"Account Holder Name": employee.bankDetails?.accountHolderName || "-",
			"Bank Name": employee.bankDetails?.bankName || "-",
			"IFSC Code": employee.bankDetails?.ifscCode || "-",
			"Account Type": employee.bankDetails?.accountType || "-",
			"Services Handled":
				employee.servicesHandled?.map((service) => service.name).join(", ") ||
				"No services handled",
			"Assigned Service":
				services.find((service) => service._id === employee.serviceId)?.name ||
				"No service assigned",
			"Assigned Customers": employee.assignedCustomers?.length || 0,
			"Download Access": employee.downloadAccess ? "Yes" : "No",
			"Created At": formatDate(employee.createdAt),
			"Last Updated": formatDate(employee.updatedAt),
		}));

		const csv = Papa.unparse(csvData);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		saveAs(blob, "employees_detailed.csv");
	};

	const handleDownloadPDF = () => {
		const doc = new jsPDF();
		const tableColumn = [
			"ID",
			"Name",
			"Email",
			"Service",
			"Assigned Customers",
			"Status",
		];
		const tableRows = employees.map((employee) => [
			employee._id,
			employee.name,
			employee.email,
			services.find((service) => service._id === employee.serviceId)?.name ||
				"No service assigned",
			employee.assignedCustomers?.length || 0,
			employee.isActive ? "Active" : "Inactive",
		]);

		doc.text("Employee Data", 14, 15);
		doc.autoTable({
			head: [tableColumn],
			body: tableRows,
			startY: 20,
		});

		doc.save("employees_detailed.pdf");
	};

	const handleToggleDownloadAccess = async (employeeId, allowDownload) => {
		setLoading(true);
		try {
			const response = await axios.post(
				"https://195-35-45-82.sslip.io:8000/api/admin/update-download-access",
				{
					employeeId,
					allowDownload,
				}
			);
			alert(response.data.message);
			setUsers((prevUsers) =>
				prevUsers.map((employee) =>
					employee._id === employeeId
						? { ...employee, downloadAccess: allowDownload }
						: employee
				)
			);
		} catch (error) {
			console.error("Error updating download access:", error);
			alert("Failed to update download access.");
		}
	};

	const renderCell = (employee, field, value) => {
		if (editingRow === employee._id) {
			return (
				<input
					type='text'
					value={editedData[field] || ""}
					onChange={(e) => handleFieldChange(field, e.target.value)}
					style={{
						border: "1px solid var(--accent)",
						padding: "12px",
						borderRadius: "15px",
						fontSize: "16px",
					}}
				/>
			);
		}
		return (
			<div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
				<span>{value}</span>
				<button
					onClick={() => handleStartEdit(employee)}
					style={{ border: "none", cursor: "pointer" }}>
					{/* <i className='fa-solid fa-pencil'></i> */}
				</button>
			</div>
		);
	};

	const clearAllFilters = () => {
		setSearchTerm("");
		setFilterOption("newest");
		setDateFilter({ fromDate: "", toDate: "" });
		setFilterCriteria("name");
	};

	// Add a function to handle service selection in multi-select
	const handleServiceSelection = (e) => {
		const selectedOptions = Array.from(
			e.target.selectedOptions,
			(option) => option.value
		);
		setSelectedServices(selectedOptions);
		// Update newEmployee state with selected services
		setNewEmployee({ ...newEmployee, services: selectedOptions });
	};

	return (
		<div className='tax-dashboard-employee'>
			{/* ... keep existing filter and buttons section ... */}
			<div className='filter-div'>
				<input
					type='text'
					placeholder='Search by Name or ID'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<div>
					<input
						type='date'
						placeholder='From Date'
						value={dateFilter.fromDate}
						onChange={(e) =>
							setDateFilter({ ...dateFilter, fromDate: e.target.value })
						}
					/>
					<input
						type='date'
						placeholder='To Date'
						value={dateFilter.toDate}
						onChange={(e) =>
							setDateFilter({ ...dateFilter, toDate: e.target.value })
						}
					/>
				</div>
				<div className='table-bottom-btns'>
					<button
						className='tax-service-btn'
						onClick={clearAllFilters}
						style={{ backgroundColor: "var(--accent)" }}>
						<i class='fa-solid fa-rotate-left'></i>
					</button>
					<button
						className='tax-service-btn'
						onClick={() => setShowEmployeeForm(true)}>
						Add Employee
					</button>
					<button className='tax-service-btn' onClick={handleDownloadCSV}>
						<i class='fa-solid fa-file-csv fa-2xl'></i>
					</button>
					<button className='tax-service-btn' onClick={handleDownloadPDF}>
						<i class='fa-solid fa-file-pdf fa-2xl'></i>
					</button>
				</div>
			</div>
			<div className='tax-services-wrap-table'>
				<table>
					{/* ... keep existing table header ... */}
					<thead>
						<tr>
							<th>Employee Code</th>
							<th>Date of Joining</th>
							<th>Full Name</th>
							<th>Email ID</th>
							<th>Username</th>
							<th>Phone Number</th>
							<th>Date of Birth</th>
							<th>Gender</th>
							<th>L1 Employee Code</th>
							<th>L1 Name</th>
							<th>L2 Employee Code</th>
							<th>L-1 Code</th>
							<th>L2 Name</th>
							<th>Employee Status</th>
							<th>Reason For Leaving</th>

							<th>PAN</th>
							<th>TAN</th>
							<th>GSTIN</th>
							<th>Full Address</th>
							<th>City</th>
							<th>State</th>
							<th>Country</th>
							<th>Postal Code</th>
							{/* <th>Department Code</th> */}
							<th>Department Name</th>
							{/* <th>Position Code</th>
							<th>Position Description</th> */}
							<th>Designation</th>

							<th>Previous Organization</th>
							<th>Previous Org From Date</th>
							<th>Previous Org To Date</th>

							<th>Total Experience</th>
							<th>Education Qualification</th>
							<th>University</th>
							<th>Passing Month & Year</th>
							<th>Certifications</th>
							<th>Institute</th>

							<th>Bank Account Number</th>
							<th>Account Holder Name</th>
							<th>Bank Name</th>
							<th>IFSC Code</th>
							<th>Account Type</th>
							<th>Assigned Service</th>
							<th>Assigned Orders</th>
							<th>Download Access</th>
							<th>Created At</th>
							<th>Last Updated</th>
							<th>Download Access</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredEmployees.map((employee) => (
							<tr key={employee._id}>
								{/* ... keep existing static cells ... */}
								<td>{employee._id}</td>
								<td>{formatDate(employee.dateOfJoining)}</td>
								<td>{renderCell(employee, "name", employee.name)}</td>
								<td>{renderCell(employee, "email", employee.email)}</td>
								<td>{renderCell(employee, "username", employee.username)}</td>
								<td>
									{renderCell(
										employee,
										"phoneNumber",
										employee.phoneNumber || "-"
									)}
								</td>
								<td>{formatDate(employee.dob)}</td>
								<td>
									{renderCell(employee, "gender", employee.gender || "-")}
								</td>
								<td>
									{renderCell(employee, "L1EmpCode", employee.L1EmpCode || "-")}
								</td>
								<td>
									{renderCell(employee, "L1Name", employee.L1Name || "-")}
								</td>
								<td>
									{renderCell(employee, "L2EmpCode", employee.L2EmpCode || "-")}
								</td>
								<td>
									{renderCell(
										employee,
										"Lminus1code",
										employee.Lminus1code || "-"
									)}
								</td>
								<td>
									{renderCell(employee, "L2Name", employee.L2Name || "-")}
								</td>
								<td>
									{renderCell(
										employee,
										"employeeStatus",
										employee.employeeStatus || "-"
									)}
								</td>
								<td>
									{renderCell(
										employee,
										"reasonForLeaving",
										employee.reasonForLeaving || "-"
									)}
								</td>
								<td>{renderCell(employee, "pan", employee.pan || "-")}</td>
								<td>{renderCell(employee, "tan", employee.tan || "-")}</td>
								<td>{renderCell(employee, "gst", employee.gst || "-")}</td>
								<td>
									{renderCell(
										employee,
										"address",
										employee.fulladdress || employee.address || "-"
									)}
								</td>
								<td>{renderCell(employee, "city", employee.city || "-")}</td>
								<td>{renderCell(employee, "state", employee.state || "-")}</td>
								<td>
									{renderCell(employee, "country", employee.country || "-")}
								</td>
								<td>
									{renderCell(
										employee,
										"postalCode",
										employee.postalCode || "-"
									)}
								</td>

								<td>
									{renderCell(
										employee,
										"departmentName",
										employee.departmentName || "-"
									)}
								</td>

								<td>
									{renderCell(
										employee,
										"designation",
										employee.designation || "-"
									)}
								</td>
								<td>
									{renderCell(
										employee,
										"previousOrganization",
										employee.previousOrganization || "-"
									)}
								</td>
								<td>{formatDate(employee.previousOrgFromDate)}</td>
								<td>{formatDate(employee.previousOrgToDate)}</td>
								<td>
									{renderCell(
										employee,
										"totalExperience",
										employee.totalExperience || "-"
									)}
								</td>
								<td>
									{renderCell(
										employee,
										"education",
										employee.educationQualification || employee.education || "-"
									)}
								</td>
								<td>
									{renderCell(
										employee,
										"university",
										employee.university || "-"
									)}
								</td>
								<td>{formatDate(employee.passingMonthYear)}</td>
								<td>
									{renderCell(
										employee,
										"certifications",
										employee.certifications || "-"
									)}
								</td>
								<td>
									{renderCell(employee, "institute", employee.institute || "-")}
								</td>
								<td>
									{renderCell(
										employee,
										"accountNumber",
										employee.bankDetails?.accountNumber || "-"
									)}
								</td>
								<td>
									{renderCell(
										employee,
										"accountHolderName",
										employee.bankDetails?.accountHolderName || "-"
									)}
								</td>
								<td>
									{renderCell(
										employee,
										"bankName",
										employee.bankDetails?.bankName || "-"
									)}
								</td>
								<td>
									{renderCell(
										employee,
										"ifscCode",
										employee.bankDetails?.ifscCode || "-"
									)}
								</td>
								<td>
									{renderCell(
										employee,
										"accountType",
										employee.bankDetails?.accountType || "-"
									)}
								</td>

								<td>
									{employee.servicesHandled &&
									employee.servicesHandled.length > 0 ? (
										<select
											style={{
												border: "1px solid var(--accent)",
												borderRadius: "15px",
												padding: "15px",
												fontSize: "16px",
											}}>
											{employee.servicesHandled.map((serviceId) => {
												const service = services.find(
													(s) => s._id === serviceId
												);
												return (
													<option key={serviceId} value={serviceId}>
														{service ? service.name : "Unknown Service"}
													</option>
												);
											})}
										</select>
									) : (
										"No services assigned"
									)}
								</td>

								<td>
									{employee.assignedCustomers &&
									employee.assignedCustomers.length > 0 ? (
										<select
											style={{
												border: "1px solid var(--accent)",
												borderRadius: "15px",
												padding: "15px",
												fontSize: "16px",
											}}>
											{employee.assignedCustomers.map((customer) =>
												customer.services.length > 0 ? (
													customer.services.map((service) => (
														<option key={service.orderId}>
															{service.orderId}
														</option>
													))
												) : (
													<option key={customer._id}>No Orders</option>
												)
											)}
										</select>
									) : (
										"No customers assigned"
									)}
								</td>
								<td>{employee.downloadAccess ? "Yes" : "No"}</td>
								<td>{formatDate(employee.createdAt)}</td>
								<td>{formatDate(employee.updatedAt)}</td>
								<td>{employee.downloadAccess ? "Yes" : "No"}</td>
								<td className='tax-btn-cont'>
									{editingRow === employee._id ? (
										<>
											<button className='tax-service-btn' onClick={handleSave}>
												Save
											</button>
											<button
												className='tax-service-btn'
												onClick={handleCancel}>
												Cancel
											</button>
										</>
									) : (
										<button
											className='tax-service-btn'
											onClick={() => handleStartEdit(employee)}>
											<i class='fa-solid fa-pencil'></i>
										</button>
									)}
									{/* ... keep existing action buttons ... */}
									<button
										onClick={() =>
											employee.isActive
												? handleDeactivateUser(employee._id)
												: handleActivateUser(employee._id)
										}
										className={
											employee.isActive ? "userDeactivate" : "userActivate"
										}>
										{employee.isActive ? "Deactivate" : "Activate"}
									</button>

									<button
										className={`tax-service-btn ${
											employee.downloadAccess
												? "access-granted"
												: "access-revoked"
										}`}
										onClick={() =>
											handleToggleDownloadAccess(
												employee._id,
												!employee.downloadAccess
											)
										}>
										{employee.downloadAccess ? "Revoke Access" : "Grant Access"}
									</button>
									{/* {employee.role === "employee" && (
										<button
											className='tax-service-btn'
											onClick={() => openPromoteModal(employee)}
											disabled={!employee.isActive}>
											Promote
										</button>
									)} */}
									<button
										className='serviceDelete'
										onClick={() => handleDeleteUser(employee._id)}
										disabled={employee.isActive}>
										<i class='fa-solid fa-trash'></i>
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Add the confirmation dialog */}
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogTitle>Confirm Changes</DialogTitle>
				<DialogContent>
					<DialogContentText>
						You have modified the following fields:
						<ul>
							{Object.entries(getChangedFields()).map(([field, value]) => (
								<li key={field}>
									{field}: {originalData[field]} → {value}
								</li>
							))}
						</ul>
						Do you want to save these changes?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>Cancel</Button>
					<Button onClick={handleConfirmSave} autoFocus>
						Save Changes
					</Button>
				</DialogActions>
			</Dialog>

			{/* ... keep existing modals ... */}
			{showEmployeeForm && (
				<div className='smodal'>
					<h3>Add Employee</h3>
					<input
						type='text'
						placeholder='Employee Full Name'
						value={newEmployee.name}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, name: e.target.value })
						}
					/>
					<input
						type='email'
						placeholder='Email ID'
						value={newEmployee.email}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, email: e.target.value })
						}
					/>
					{/* <select
						value={newEmployee.serviceId}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, serviceId: e.target.value })
						}>
						<option value=''>Select Service</option>
						{services.map((service) => (
							<option key={service._id} value={service._id}>
								{service.name}
							</option>
						))}
					</select> */}
					<select
						multiple
						value={selectedServices}
						onChange={handleServiceSelection}
						style={{ height: "100px" }} // Add some height for multiple selections
					>
						{services.map((service) => (
							<option key={service._id} value={service._id}>
								{service.name}
							</option>
						))}
					</select>
					<small>Hold Ctrl/Cmd to select multiple services</small>

					<input
						type='text'
						placeholder='Username'
						value={newEmployee.username}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, username: e.target.value })
						}
					/>
					<input
						type='password'
						placeholder='Password'
						value={newEmployee.password}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, password: e.target.value })
						}
					/>

					<input
						type='text'
						placeholder='L-1 Code'
						value={newEmployee.Lminus1code}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, Lminus1code: e.target.value })
						}
					/>
					<input
						type='text'
						placeholder='L+1 Code'
						value={newEmployee.L1EmpCode}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, L1EmpCode: e.target.value })
						}
					/>

					<div id='modal-div'>
						<button onClick={handleCreateEmployee}>Create</button>
						<button onClick={() => setShowEmployeeForm(false)}>Cancel</button>
					</div>
				</div>
			)}

			{showPromoteModal && promotingEmployee && (
				<div className='smodal' style={{ color: "white" }}>
					<h3>Promote Employee to Manager</h3>
					<p>
						Are you sure you want to promote{" "}
						<strong>{promotingEmployee.name}</strong> to a Manager role?
					</p>
					<p>This action will:</p>
					<ul style={{ textAlign: "left", marginLeft: "20px" }}>
						<li>Change their role from employee to manager</li>
						<li>Allow them to manage other employees</li>
						<li>Grant them additional dashboard access</li>
					</ul>
					<div id='modal-div'>
						<button onClick={handlePromoteToManager} disabled={loading}>
							{loading ? "Processing..." : "Confirm Promotion"}
						</button>
						<button onClick={() => setShowPromoteModal(false)}>Cancel</button>
					</div>
				</div>
			)}

			{/* {showAssignCustomerForm && (
				<div className='smodal'>
					<h3>Assign Customer to Employee</h3>
					<select
						value={assignCustomer.customerId}
						onChange={(e) =>
							setAssignCustomer({
								...assignCustomer,
								customerId: e.target.value,
							})
						}>
						<option value=''>Select Customer</option>
						{users
							.filter((user) => user.role === "customer")
							.map((customer) => (
								<option key={customer._id} value={customer._id}>
									{customer.name}
								</option>
							))}
					</select>
					<select
						value={assignCustomer.employeeId}
						onChange={(e) =>
							setAssignCustomer({
								...assignCustomer,
								employeeId: e.target.value,
							})
						}>
						<option value=''>Select Employee</option>
						{employees.map((employee) => (
							<option key={employee._id} value={employee._id}>
								{employee.name}
							</option>
						))}
					</select>
					<div id='modal-div'>
						<button onClick={handleAssignCustomer}>Assign</button>
						<button onClick={() => setShowAssignCustomerForm(false)}>
							Cancel
						</button>
					</div>
				</div>
			)} */}

			{showAssignOrderForm && (
				<div className='smodal'>
					<h3>Assign Order to Employee</h3>
					<select
						value={assignOrder.orderId}
						onChange={(e) =>
							setAssignOrder({
								...assignOrder,
								orderId: e.target.value,
							})
						}>
						<option value=''>Select Order</option>
						{orders.map((order) => (
							<option key={order["Order ID"]} value={order["Order ID"]}>
								{order["Order ID"]} - {order["Service Name"]} -{" "}
								{order["Customer Name"]}
							</option>
						))}
					</select>
					<select
						value={assignOrder.employeeId}
						onChange={(e) =>
							setAssignOrder({
								...assignOrder,
								employeeId: e.target.value,
							})
						}>
						<option value=''>Select Employee</option>
						{employees.map((employee) => (
							<option key={employee._id} value={employee._id}>
								{employee.name} - Handles: {employee.servicesHandled.length}{" "}
								services
							</option>
						))}
					</select>
					<div id='modal-div'>
						<button onClick={handleAssignOrderToEmployee} disabled={loading}>
							{loading ? "Assigning..." : "Assign"}
						</button>
						<button onClick={() => setShowAssignOrderForm(false)}>
							Cancel
						</button>
					</div>
				</div>
			)}
			<div className='table-bottom-btns'>
				{/* <button
					className='tax-service-btn'
					onClick={() => setShowAssignCustomerForm(true)}>
					Assign Order to Employee
				</button> */}
				<button
					className='tax-service-btn'
					onClick={() => setShowAssignOrderForm(true)}>
					Assign Order to Employee
				</button>
			</div>
		</div>
	);
};

export default EmployeesSection;
