import React, { useContext, useState, useRef, useMemo } from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import ClipLoader from "react-spinners/ClipLoader";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "./utils/axiosConfig";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";

const ManagersSection = () => {
	const [showManagerForm, setShowManagerForm] = useState(false);
	const [showAssignEmployeeForm, setShowAssignEmployeeForm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [dateFilter, setDateFilter] = useState({ fromDate: "", toDate: "" });
	const [searchTerm, setSearchTerm] = useState("");
	const [editingRow, setEditingRow] = useState(null);
	const [editedData, setEditedData] = useState({});
	const [originalData, setOriginalData] = useState({});
	const [openDialog, setOpenDialog] = useState(false);
	const [filterOption, setFilterOption] = useState("newest");
	const {
		managers,
		assignEmployee,
		users,
		services,
		newManager,
		setNewManager,
		handleCreateManager,
		handleAssignEmployee,
		handleActivateUser,
		handleDeactivateUser,
		handleDeleteUser,
		setAssignEmployee,
		updateUsers,
	} = useContext(AdminDashboardContext);

	const formatDate = (dateStr) => {
		if (!dateStr) return "Not available";
		const date = new Date(dateStr);
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
	};

	// Start editing row
	const handleStartEdit = (manager) => {
		setEditingRow(manager._id);
		const initialData = {
			name: manager.name,
			email: manager.email,
			username: manager.username,
			phoneNumber: manager.phoneNumber || "",
			gender: manager.gender || "",
			L1EmpCode: manager.L1EmpCode || "",
			L1Name: manager.L1Name || "",
			L2EmpCode: manager.L2EmpCode || "",
			L2Name: manager.L2Name || "",
			employeeStatus: manager.employeeStatus || "",
			pan: manager.pan || "",
			tan: manager.tan || "",
			gst: manager.gst || "",
			address: manager.fulladdress || manager.address || "",
			city: manager.city || "",
			state: manager.state || "",
			country: manager.country || "",
			postalCode: manager.postalCode || "",
			departmentName: manager.departmentName || "",
			designation: manager.designation || "",
			education: manager.educationQualification || manager.education || "",
			university: manager.university || "",
			certifications: manager.certifications || "",
		};
		setEditedData(initialData);
		setOriginalData(initialData);
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
				const updatedUsers = managers.map((user) => {
					if (user._id === editingRow) {
						return { ...user, ...changes };
					}
					return user;
				});
				updateUsers(updatedUsers);
				alert("Updated successfully");
			}
		} catch (error) {
			console.error("Error updating manager:", error);
			alert("Error updating manager");
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

	// const filteredManagers = managers.filter((manager) => {
	// 	const matchesSearch =
	// 		manager._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
	// 		manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
	// 		manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
	// 		(manager.username &&
	// 			manager.username.toLowerCase().includes(searchTerm.toLowerCase()));

	// 	const createdAt = new Date(manager.createdAt);
	// 	const matchesDate =
	// 		(!dateFilter.fromDate || createdAt >= new Date(dateFilter.fromDate)) &&
	// 		(!dateFilter.toDate || createdAt <= new Date(dateFilter.toDate));

	// 	return matchesSearch && matchesDate;
	// });

	const normalizeDate = (dateStr) => {
		const date = new Date(dateStr);
		date.setHours(0, 0, 0, 0);
		return date;
	};

	const filteredManagers = useMemo(() => {
		return managers
			.filter((manager) => {
				// Combined search for ID, name, and email
				const lowerSearchTerm = searchTerm.toLowerCase();
				return (
					manager._id.toLowerCase().includes(lowerSearchTerm) ||
					manager.name.toLowerCase().includes(lowerSearchTerm) ||
					manager.email.toLowerCase().includes(lowerSearchTerm) ||
					(manager.username &&
						manager.username.toLowerCase().includes(lowerSearchTerm))
				);
			})
			.filter((manager) => {
				const managerDate = new Date(manager.createdAt);
				const fromDate = dateFilter.fromDate
					? normalizeDate(dateFilter.fromDate)
					: null;
				const toDate = dateFilter.toDate
					? normalizeDate(dateFilter.toDate)
					: null;

				return (
					(fromDate === null || managerDate >= fromDate) &&
					(toDate === null || managerDate <= toDate)
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
	}, [managers, searchTerm, dateFilter, filterOption]);

	const renderCell = (manager, field, value) => {
		if (editingRow === manager._id) {
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
			</div>
		);
	};

	// Download handlers from the previous implementation remain the same
	const handleDownloadCSV = () => {
		const csvData = managers.map((manager) => ({
			"Employee Code": manager._id,
			"Full Name": manager.name,
			"Email ID": manager.email,
			Username: manager.username,
			"Phone Number": manager.phoneNumber || "-",
			"Date of Birth": formatDate(manager.dob),
			Gender: manager.gender || "-",
			"L1 Employee Code": manager.L1EmpCode || "-",
			"L1 Name": manager.L1Name || "-",
			"L2 Employee Code": manager.L2EmpCode || "-",
			"L2 Name": manager.L2Name || "-",
			"Department Name": manager.departmentName || "-",
			Designation: manager.designation || "-",
			"Employee Status": manager.employeeStatus || "-",
			"Date of Joining": formatDate(manager.dateOfJoining),
			PAN: manager.pan || "-",
			TAN: manager.tan || "-",
			GSTIN: manager.gst || "-",
			"Full Address": manager.fulladdress || manager.address || "-",
			City: manager.city || "-",
			State: manager.state || "-",
			Country: manager.country || "-",
			"Postal Code": manager.postalCode || "-",
			"Education Qualification":
				manager.educationQualification || manager.education || "-",
			University: manager.university || "-",
			"Passing Month & Year": formatDate(manager.passingMonthYear),
			"Total Experience": manager.totalExperience || "-",
			"Previous Organization": manager.previousOrganization || "-",
			"Previous Org From Date": formatDate(manager.previousOrgFromDate),
			"Previous Org To Date": formatDate(manager.previousOrgToDate),
			"Reason For Leaving": manager.reasonForLeaving || "-",
			"Bank Account Number": manager.bankDetails?.accountNumber || "-",
			"Account Holder Name": manager.bankDetails?.accountHolderName || "-",
			"Bank Name": manager.bankDetails?.bankName || "-",
			"IFSC Code": manager.bankDetails?.ifscCode || "-",
			"Account Type": manager.bankDetails?.accountType || "-",
			"Assigned Employees": manager.assignedEmployees?.length || 0,
			"Created At": formatDate(manager.createdAt),
			"Last Updated": formatDate(manager.updatedAt),
		}));

		const csv = Papa.unparse(csvData);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		saveAs(blob, "managers_detailed.csv");
	};
	const handleDownloadPDF = () => {
		const doc = new jsPDF("landscape", "pt", "a3"); // Use landscape for more columns

		// Define table columns matching CSV fields
		const tableColumn = [
			"Emp Code",
			"Full Name",
			"Email ID",
			"Username",
			"Phone",
			"DOB",
			"Gender",
			"L1 Code",
			"L1 Name",
			"L2 Code",
			"L2 Name",
			"Dept Name",
			"Designation",
			"Emp Status",
			"Join Date",
			"PAN",
			"TAN",
			"GSTIN",
			"Address",
			"City",
			"State",
			"Country",
			"Postal",
			"Education",
			"University",
			"Pass Date",
			"Experience",
			"Prev Org",
			"Prev From",
			"Prev To",
			"Reason",
			"Bank Acc",
			"Acc Holder",
			"Bank Name",
			"IFSC",
			"Acc Type",
			"Employees",
			"Created",
			"Updated",
		];

		// Prepare table rows with matching CSV data
		const tableRows = managers.map((manager) => [
			manager._id,
			manager.name,
			manager.email,
			manager.username || "-",
			manager.phoneNumber || "-",
			formatDate(manager.dob),
			manager.gender || "-",
			manager.L1EmpCode || "-",
			manager.L1Name || "-",
			manager.L2EmpCode || "-",
			manager.L2Name || "-",
			manager.departmentName || "-",
			manager.designation || "-",
			manager.employeeStatus || "-",
			formatDate(manager.dateOfJoining),
			manager.pan || "-",
			manager.tan || "-",
			manager.gst || "-",
			manager.fulladdress || manager.address || "-",
			manager.city || "-",
			manager.state || "-",
			manager.country || "-",
			manager.postalCode || "-",
			manager.educationQualification || manager.education || "-",
			manager.university || "-",
			formatDate(manager.passingMonthYear),
			manager.totalExperience || "-",
			manager.previousOrganization || "-",
			formatDate(manager.previousOrgFromDate),
			formatDate(manager.previousOrgToDate),
			manager.reasonForLeaving || "-",
			manager.bankDetails?.accountNumber || "-",
			manager.bankDetails?.accountHolderName || "-",
			manager.bankDetails?.bankName || "-",
			manager.bankDetails?.ifscCode || "-",
			manager.bankDetails?.accountType || "-",
			manager.assignedEmployees?.length || 0,
			formatDate(manager.createdAt),
			formatDate(manager.updatedAt),
		]);

		// Add title
		doc.text("Managers Detailed Report", 14, 15);

		// Configure and generate the table
		doc.autoTable({
			head: [tableColumn],
			body: tableRows,
			startY: 20,
			styles: {
				fontSize: 6, // Reduce font size to fit more columns
				cellPadding: 1,
				overflow: "linebreak",
			},
			columnStyles: {
				0: { cellWidth: 15 }, // Employee Code
				1: { cellWidth: 15 }, // Full Name
				2: { cellWidth: 20 }, // Email ID
				// Add more specific widths if needed
			},
			margin: { top: 20, left: 5, right: 5 },
			theme: "grid",
			headStyles: {
				fillColor: [41, 128, 185],
				textColor: 255,
				fontSize: 7,
			},
		});

		doc.save("managers_detailed.pdf");
	};

	const clearAllFilters = () => {
		setSearchTerm("");
		setFilterOption("newest");
		setDateFilter({ fromDate: "", toDate: "" });
		setFilterCriteria("name");
	};

	return (
		<div className='tax-dashboard-employee'>
			{loading && (
				<div className='loading-overlay'>
					<ClipLoader size={50} color='#ffffff' />
				</div>
			)}

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
						onClick={() => setShowManagerForm(true)}>
						Add Manager
					</button>
					<button className='tax-service-btn' onClick={handleDownloadCSV}>
						<i className='fa-solid fa-file-csv fa-2xl'></i>
					</button>
					<button className='tax-service-btn' onClick={handleDownloadPDF}>
						<i className='fa-solid fa-file-pdf fa-2xl'></i>
					</button>
				</div>
			</div>

			<div className='tax-services-wrap-table'>
				<table>
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
							<th>Department Name</th>
							<th>Designation</th>
							<th>Previous Organization</th>
							<th>Previous Org From Date</th>
							<th>Previous Org To Date</th>
							<th>Total Experience</th>
							<th>Education Qualification</th>
							<th>University</th>
							<th>Passing Month & Year</th>
							<th>Certifications</th>
							<th>Bank Account Number</th>
							<th>Account Holder Name</th>
							<th>Bank Name</th>
							<th>IFSC Code</th>
							<th>Account Type</th>
							<th>Assigned Employees</th>
							<th>Created At</th>
							<th>Last Updated</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredManagers.map((manager) => (
							<tr key={manager._id}>
								<td>{manager._id}</td>
								<td>{formatDate(manager.dateOfJoining)}</td>
								<td>{renderCell(manager, "name", manager.name)}</td>
								<td>{renderCell(manager, "email", manager.email)}</td>
								<td>{renderCell(manager, "username", manager.username)}</td>
								<td>
									{renderCell(
										manager,
										"phoneNumber",
										manager.phoneNumber || "-"
									)}
								</td>
								<td>{formatDate(manager.dob)}</td>
								<td>{renderCell(manager, "gender", manager.gender || "-")}</td>
								<td>
									{renderCell(manager, "L1EmpCode", manager.L1EmpCode || "-")}
								</td>
								<td>{renderCell(manager, "L1Name", manager.L1Name || "-")}</td>
								<td>
									{renderCell(manager, "L2EmpCode", manager.L2EmpCode || "-")}
								</td>
								<td>{renderCell(manager, "L2Name", manager.L2Name || "-")}</td>
								<td>
									{renderCell(
										manager,
										"employeeStatus",
										manager.employeeStatus || "-"
									)}
								</td>
								<td>
									{renderCell(
										manager,
										"reasonForLeaving",
										manager.reasonForLeaving || "-"
									)}
								</td>
								<td>{renderCell(manager, "pan", manager.pan || "-")}</td>
								<td>{renderCell(manager, "tan", manager.tan || "-")}</td>
								<td>{renderCell(manager, "gst", manager.gst || "-")}</td>
								<td>
									{renderCell(
										manager,
										"address",
										manager.fulladdress || manager.address || "-"
									)}
								</td>
								<td>{renderCell(manager, "city", manager.city || "-")}</td>
								<td>{renderCell(manager, "state", manager.state || "-")}</td>
								<td>
									{renderCell(manager, "country", manager.country || "-")}
								</td>
								<td>
									{renderCell(manager, "postalCode", manager.postalCode || "-")}
								</td>
								<td>
									{renderCell(
										manager,
										"departmentName",
										manager.departmentName || "-"
									)}
								</td>
								<td>
									{renderCell(
										manager,
										"designation",
										manager.designation || "-"
									)}
								</td>
								<td>
									{renderCell(
										manager,
										"previousOrganization",
										manager.previousOrganization || "-"
									)}
								</td>
								<td>{formatDate(manager.previousOrgFromDate)}</td>
								<td>{formatDate(manager.previousOrgToDate)}</td>
								<td>
									{renderCell(
										manager,
										"totalExperience",
										manager.totalExperience || "-"
									)}
								</td>
								<td>
									{renderCell(
										manager,
										"education",
										manager.educationQualification || manager.education || "-"
									)}
								</td>
								<td>
									{renderCell(manager, "university", manager.university || "-")}
								</td>
								<td>{formatDate(manager.passingMonthYear)}</td>
								<td>
									{renderCell(
										manager,
										"certifications",
										manager.certifications || "-"
									)}
								</td>
								<td>
									{renderCell(
										manager,
										"accountNumber",
										manager.bankDetails?.accountNumber || "-"
									)}
								</td>
								<td>
									{renderCell(
										manager,
										"accountHolderName",
										manager.bankDetails?.accountHolderName || "-"
									)}
								</td>
								<td>
									{renderCell(
										manager,
										"bankName",
										manager.bankDetails?.bankName || "-"
									)}
								</td>
								<td>
									{renderCell(
										manager,
										"ifscCode",
										manager.bankDetails?.ifscCode || "-"
									)}
								</td>
								<td>
									{renderCell(
										manager,
										"accountType",
										manager.bankDetails?.accountType || "-"
									)}
								</td>
								<td>{manager.assignedEmployees?.length || 0}</td>
								<td>{formatDate(manager.createdAt)}</td>
								<td>{formatDate(manager.updatedAt)}</td>
								<td className='tax-btn-cont'>
									{editingRow === manager._id ? (
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
											onClick={() => handleStartEdit(manager)}>
											<i class='fa-solid fa-pencil'></i>
										</button>
									)}
									{/* <button
										className='tax-service-btn'
										onClick={() => handleAssignEmployee(manager)}>
										Assign Employee
									</button> */}
									<button
										onClick={() =>
											manager.isActive
												? handleDeactivateUser(manager._id)
												: handleActivateUser(manager._id)
										}
										className={
											manager.isActive ? "userDeactivate" : "userActivate"
										}>
										{manager.isActive ? "Deactivate" : "Activate"}
									</button>
									<button
										className='serviceDelete'
										onClick={() => handleDeleteUser(manager._id)}>
										<i class='fa-solid fa-trash'></i>
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Confirmation Dialog */}
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

			{showManagerForm && (
				<div className='smodal'>
					<h3>Add Manager</h3>
					<input
						type='text'
						placeholder='Manager Name'
						value={newManager.name}
						onChange={(e) =>
							setNewManager({ ...newManager, name: e.target.value })
						}
					/>
					<input
						type='email'
						placeholder='Manager Email'
						value={newManager.email}
						onChange={(e) =>
							setNewManager({ ...newManager, email: e.target.value })
						}
					/>
					<input
						type='text'
						placeholder='Username'
						value={newManager.username}
						onChange={(e) =>
							setNewManager({ ...newManager, username: e.target.value })
						}
					/>
					<input
						type='password'
						placeholder='Password'
						value={newManager.password}
						onChange={(e) =>
							setNewManager({ ...newManager, password: e.target.value })
						}
					/>
					<div id='modal-div'>
						<button onClick={handleCreateManager}>Create</button>
						<button onClick={() => setShowManagerForm(false)}>Cancel</button>
					</div>
				</div>
			)}

			{showAssignEmployeeForm && (
				<div className='smodal'>
					<h3>Assign Employee to Manager</h3>
					<select
						value={assignEmployee.employeeId}
						onChange={(e) =>
							setAssignEmployee({
								...assignEmployee,
								employeeId: e.target.value,
							})
						}>
						<option value=''>Select Employee</option>
						{users
							.filter((user) => user.role === "employee")
							.map((employee) => (
								<option key={employee._id} value={employee._id}>
									{employee.name}
								</option>
							))}
					</select>
					<select
						value={assignEmployee.managerId}
						onChange={(e) =>
							setAssignEmployee({
								...assignEmployee,
								managerId: e.target.value,
							})
						}>
						<option value=''>Select Manager</option>
						{users
							.filter((user) => user.role === "manager")
							.map((manager) => (
								<option key={manager._id} value={manager._id}>
									{manager.name}
								</option>
							))}
					</select>
					<div id='modal-div'>
						<button onClick={handleAssignEmployee}>Assign Employee</button>
						<button onClick={() => setShowAssignEmployeeForm(false)}>
							Cancel
						</button>
					</div>
				</div>
			)}
			<div className='table-bottom-btns'>
				<button
					className='tax-service-btn'
					onClick={() => setShowAssignEmployeeForm(true)}>
					Assign Employee to Manager
				</button>
			</div>
		</div>
	);
};

export default ManagersSection;
