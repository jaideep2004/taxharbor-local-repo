import React, { useContext, useState, useEffect } from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useNotification } from "../NotificationContext";
import DocumentRequirements from "./DocumentRequirements";
import DashboardCharts from "./DashboardCharts";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import {
	DialogContentText,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	FormHelperText,
	Checkbox,
	ListItemText,
} from "@mui/material";

const DashboardSection = () => {
	const navigate = useNavigate();
	const { showNotification } = useNotification();

	// Move all useState declarations to the top level
	const [showServiceForm, setShowServiceForm] = useState(false);
	const [showEmployeeForm, setShowEmployeeForm] = useState(false);
	const [showManagerForm, setShowManagerForm] = useState(false);
	const [showUserForm, setShowUserForm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showDocuments, setShowDocuments] = useState(false);
	const [showDocRequirements, setShowDocRequirements] = useState(false);

	const {
		servicesCount,
		usersCount,
		employeesCount,
		customersCount,
		managersCount,
		services,
		newService,
		setNewService,
		handleCreateService,
		users,
		newUser,
		setNewUser,
		handleActivateUser,
		handleDeactivateUser,
		handleDeleteUser,
		showAssignCustomerForm,
		setShowAssignCustomerForm,
		newManager,
		setNewManager,
		newEmployee,
		setNewEmployee,
		handleCreateEmployee,
		handleCreateManager,
		isAuthenticated,
		fetchDashboardData,
		error,
		setError,
		handleCreateUser,
	} = useContext(AdminDashboardContext);

	useEffect(() => {
		if (isAuthenticated) {
			setError(null);
			setLoading(false);
			fetchDashboardData();
		}
	}, [isAuthenticated, setError, fetchDashboardData]);

	const handleToggleDocRequirements = () => {
		setShowDocRequirements((prev) => !prev);
	};

	// Separate component for session expired message
	const SessionExpiredMessage = () => (
		<div className='session-expired'>
			<h2>Session Expired</h2>
			<p>{error}</p>
			<button
				onClick={() => navigate("/admin/login")}
				className='login-again-btn'>
				Log In Again
			</button>
		</div>
	);

	if (error) {
		return <SessionExpiredMessage />;
	}

	return (
		<div className='tax-dashboard-section'>
			{loading && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						background: "rgba(0, 0, 0, 0.5)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 1000,
					}}>
					<ClipLoader size={50} color='#ffffff' />
				</div>
			)}

			<div style={{ display: "flex", gap: "15px" }}>
				<button
					className='tax-service-btn'
					onClick={() => setShowServiceForm(true)}>
					Add Service
				</button>
				<button
					className='tax-service-btn'
					onClick={() => setShowManagerForm(true)}>
					Add Manager
				</button>
				<button
					className='tax-service-btn'
					onClick={() => setShowEmployeeForm(true)}>
					Add Employee
				</button>
				<button
					className='tax-service-btn'
					onClick={() => setShowUserForm(true)}>
					Add Customer
				</button>
			</div>

			<DashboardCharts
				servicesCount={servicesCount}
				usersCount={usersCount}
				managersCount={managersCount}
				employeesCount={employeesCount}
				customersCount={customersCount}
				services={services}
				users={users}
			/>

			<Dialog
				open={showServiceForm}
				onClose={() => setShowServiceForm(false)}
				maxWidth='md'
				fullWidth>
				<DialogTitle>Add Service</DialogTitle>
				<DialogContent>
					<TextField
						margin='dense'
						label='Service Category'
						fullWidth
						value={newService.category}
						onChange={(e) =>
							setNewService({ ...newService, category: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Service Name'
						fullWidth
						value={newService.name}
						onChange={(e) =>
							setNewService({ ...newService, name: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Service Description'
						fullWidth
						value={newService.description}
						onChange={(e) =>
							setNewService({ ...newService, description: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Service Price'
						type='number'
						fullWidth
						value={newService.actualPrice}
						onChange={(e) =>
							setNewService({ ...newService, actualPrice: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Discounted Service Price'
						type='number'
						fullWidth
						value={newService.salePrice}
						onChange={(e) =>
							setNewService({ ...newService, salePrice: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='HSN Code'
						fullWidth
						value={newService.hsncode}
						onChange={(e) =>
							setNewService({ ...newService, hsncode: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Processing Days'
						type='number'
						fullWidth
						value={newService.processingDays}
						onChange={(e) =>
							setNewService((prev) => ({
								...prev,
								processingDays: parseInt(e.target.value),
							}))
						}
						inputProps={{ min: 1 }}
					/>

					<div>
						<button
							className='tax-service-btn2'
							onClick={handleToggleDocRequirements}>
							{showDocRequirements
								? "Hide Document Requirements"
								: "Show Document Requirements"}
						</button>
					</div>

					<div
						className={`doc-requirements ${
							showDocRequirements ? "visible" : "hidden"
						}`}>
						<DocumentRequirements
							documents={newService.requiredDocuments}
							onUpdate={(docs) =>
								setNewService({ ...newService, requiredDocuments: docs })
							}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCreateService}>Create</Button>
					<Button onClick={() => setShowServiceForm(false)}>Cancel</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={showUserForm}
				onClose={() => setShowUserForm(false)}
				maxWidth='md'
				fullWidth>
				<DialogTitle>Add Customer</DialogTitle>
				<DialogContent>
					<TextField
						margin='dense'
						label='Full Name'
						fullWidth
						value={newUser.name || ""}
						onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
					/>
					<TextField
						margin='dense'
						label='Email'
						type='email'
						fullWidth
						value={newUser.email || ""}
						onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
					/>
					<TextField
						margin='dense'
						label='Password'
						type='password'
						fullWidth
						value={newUser.password || ""}
						onChange={(e) =>
							setNewUser({ ...newUser, password: e.target.value })
						}
					/>
					{/* <TextField
						margin='dense'
						label='Mobile Number'
						fullWidth
						value={newUser.mobile || ''}
						onChange={(e) =>
							setNewUser({ ...newUser, mobile: e.target.value })
						}
					/> */}
					<TextField
						margin='dense'
						label='Username'
						fullWidth
						value={newUser.username || ""}
						onChange={(e) =>
							setNewUser({ ...newUser, username: e.target.value })
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowUserForm(false)}>Cancel</Button>
					<Button
						onClick={() => {
							handleCreateUser();
							setShowUserForm(false);
						}}>
						Add Customer
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={showManagerForm}
				onClose={() => setShowManagerForm(false)}
				maxWidth='sm'
				fullWidth>
				<DialogTitle>Add Manager</DialogTitle>
				<DialogContent>
					<TextField
						margin='dense'
						label='Manager Name'
						fullWidth
						value={newManager.name}
						onChange={(e) =>
							setNewManager({ ...newManager, name: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Manager Email'
						type='email'
						fullWidth
						value={newManager.email}
						onChange={(e) =>
							setNewManager({ ...newManager, email: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Username'
						fullWidth
						value={newManager.username}
						onChange={(e) =>
							setNewManager({ ...newManager, username: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Password'
						type='password'
						fullWidth
						value={newManager.password}
						onChange={(e) =>
							setNewManager({ ...newManager, password: e.target.value })
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCreateManager}>Create</Button>
					<Button onClick={() => setShowManagerForm(false)}>Cancel</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={showEmployeeForm}
				onClose={() => setShowEmployeeForm(false)}
				maxWidth='sm'
				fullWidth>
				<DialogTitle>Add Employee</DialogTitle>
				<DialogContent>
					<TextField
						margin='dense'
						label='Employee Full Name'
						fullWidth
						value={newEmployee.name}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, name: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Email ID'
						type='email'
						fullWidth
						value={newEmployee.email}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, email: e.target.value })
						}
					/>
					<FormControl fullWidth margin='dense'>
						<InputLabel shrink>Services</InputLabel>
						<Select
							multiple
							value={newEmployee.services || []} // Directly use newEmployee.services
							onChange={(e) => {
								const selected = e.target.value;
								setNewEmployee({ ...newEmployee, services: selected });
							}}
							label='Services'
							renderValue={(selected) =>
								selected
									.map(
										(serviceId) =>
											services.find((s) => s._id === serviceId)?.name ||
											serviceId
									)
									.join(", ")
							}>
							{services.map((service) => (
								<MenuItem key={service._id} value={service._id}>
									<Checkbox
										checked={
											(newEmployee.services || []).indexOf(service._id) > -1
										}
									/>
									<ListItemText primary={service.name} />
								</MenuItem>
							))}
						</Select>
						<FormHelperText>
							Hold Ctrl/Cmd to select multiple services
						</FormHelperText>
					</FormControl>
					<TextField
						margin='dense'
						label='Username'
						fullWidth
						value={newEmployee.username}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, username: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Password'
						type='password'
						fullWidth
						value={newEmployee.password}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, password: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='L-1 Code'
						fullWidth
						value={newEmployee.Lminus1code}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, Lminus1code: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='L+1 Code'
						fullWidth
						value={newEmployee.L1EmpCode}
						onChange={(e) =>
							setNewEmployee({ ...newEmployee, L1EmpCode: e.target.value })
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCreateEmployee}>Create</Button>
					<Button onClick={() => setShowEmployeeForm(false)}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default DashboardSection;
