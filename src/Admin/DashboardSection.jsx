import React, { useContext, useState, useEffect } from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useNotification } from "../NotificationContext";
import DocumentRequirements from "./DocumentRequirements";
import DashboardCharts from "./DashboardCharts";

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
		handleCreateUser,
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

			{showServiceForm && (
				<div className='smodal'>
					<h3>Add Service</h3>
					<div>
						<input
							type='text'
							placeholder='Service Category'
							value={newService.category}
							onChange={(e) =>
								setNewService({ ...newService, category: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='Service Name'
							value={newService.name}
							onChange={(e) =>
								setNewService({ ...newService, name: e.target.value })
							}
						/>
					</div>
					<div>
						<input
							type='text'
							placeholder='Service Description'
							value={newService.description}
							onChange={(e) =>
								setNewService({ ...newService, description: e.target.value })
							}
						/>
						<input
							type='number'
							placeholder='Service Price'
							value={newService.actualPrice}
							onChange={(e) =>
								setNewService({ ...newService, actualPrice: e.target.value })
							}
						/>
					</div>
					<div>
						<input
							type='number'
							placeholder='Discounted Service Price'
							value={newService.salePrice}
							onChange={(e) =>
								setNewService({ ...newService, salePrice: e.target.value })
							}
						/>
						<input
							type='text'
							placeholder='HSN Code'
							value={newService.hsncode}
							onChange={(e) =>
								setNewService({ ...newService, hsncode: e.target.value })
							}
						/>
					</div>
					<div>
						<label
							htmlFor='tdueDate'
							style={{ padding: "0", color: "white", textAlign: "left" }}>
							Processing Days
						</label>
						<input
							id='tdueDate'
							type='number'
							placeholder='Processing Days'
							value={newService.processingDays}
							onChange={(e) =>
								setNewService((prev) => ({
									...prev,
									processingDays: parseInt(e.target.value),
								}))
							}
							min='1'
						/>
					</div>

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
					<div id='modal-div'>
						<button onClick={handleCreateService}>Create</button>
						<button onClick={() => setShowServiceForm(false)}>Cancel</button>
					</div>
				</div>
			)}

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

			{showUserForm && (
				<div className='smodal'>
					<h3>Add Customer</h3>
					<input
						type='text'
						placeholder='Customer Name'
						value={newUser.name}
						onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
					/>
					<input
						type='email'
						placeholder='Customer Email'
						value={newUser.email}
						onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
					/>
					<select
						value={newUser.role}
						onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
						<option value=''>Select Role</option>
						<option value='admin'>Admin</option>
						<option value='employee'>Employee</option>
						<option value='customer'>Customer</option>
					</select>
					<select
						value={newUser.serviceId}
						onChange={(e) =>
							setNewUser({ ...newUser, serviceId: e.target.value })
						}>
						<option value=''>Select Service</option>
						{services.map((service) => (
							<option key={service._id} value={service._id}>
								{service.name}
							</option>
						))}
					</select>
					<input
						type='text'
						placeholder='Username'
						value={newUser.username}
						onChange={(e) =>
							setNewUser({ ...newUser, username: e.target.value })
						}
					/>
					<input
						type='password'
						placeholder='Password'
						value={newUser.password}
						onChange={(e) =>
							setNewUser({ ...newUser, password: e.target.value })
						}
					/>
					<div id='modal-div'>
						<button onClick={handleCreateUser}>Create</button>
						<button onClick={() => setShowUserForm(false)}>Cancel</button>
					</div>
				</div>
			)}

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
					<select
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
					</select>
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
					<div id='modal-div'>
						<button onClick={handleCreateEmployee}>Create</button>
						<button onClick={() => setShowEmployeeForm(false)}>Cancel</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default DashboardSection;
