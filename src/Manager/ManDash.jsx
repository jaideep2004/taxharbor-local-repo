import React, { useContext, useEffect } from "react";
import { ManagerContext } from "./ManagerContext";

const ManDash = () => {
	const { dashboardData, fetchManagerDash, loading } =
		useContext(ManagerContext);

	useEffect(() => {
		fetchManagerDash();
	}, [fetchManagerDash]);

	return (
		<div className='ctax-dashboard-section'>
			<div className='cdashboard-summary'>
				<h1>Welcome, {dashboardData?.managerInfo?.name || "Manager"}</h1>
				<div>
					<div className='cdashboard-card'>
						<p>
							<strong>Assigned Employees:</strong>{" "}
							{dashboardData?.metrics?.totalEmployees || 0}
						</p>
						<p>
							<strong>Total Customers:</strong>{" "}
							{dashboardData?.metrics?.totalCustomers || 0}
						</p>
						<p>
							<strong>Total Services:</strong>{" "}
							{dashboardData?.metrics?.totalServices || 0}
						</p>
					</div>

					<div className='cdashboard-card'>
						<p>
							<strong>Total Queries:</strong>{" "}
							{dashboardData?.metrics?.totalQueries || 0}
						</p>
						<p>
							<strong>Query Distribution:</strong>
						</p>
						<ul>
							<li>
								Pending:{" "}
								{dashboardData?.metrics?.queryDistribution?.pending || 0}
							</li>
							<li>
								Responded:{" "}
								{dashboardData?.metrics?.queryDistribution?.responded || 0}
							</li>
							<li>
								Resolved:{" "}
								{dashboardData?.metrics?.queryDistribution?.resolved || 0}
							</li>
						</ul>
					</div>

					<div className='cdashboard-card'>
						<p>
							<strong>Profile Status:</strong>{" "}
							{dashboardData?.managerInfo?.isProfileComplete
								? "Complete"
								: "Incomplete"}
						</p>
						<p>
							<strong>Account Status:</strong>{" "}
							{dashboardData?.managerInfo?.isActive ? "Active" : "Inactive"}
						</p>
					</div>
				</div>

				{/* Employees Section */}
				<div className='cdashboard-card mt-4'>
					<h2 className='text-xl font-bold mb-4'>Assigned Employees</h2>
					{dashboardData?.employees?.map((employee) => (
						<div key={employee._id} className='mb-4 p-4 border rounded'>
							<h3 className='font-bold'>{employee.name}</h3>
							<p>Email: {employee.email}</p>
							<p>Status: {employee.isActive ? "Active" : "Inactive"}</p>
							<p>Employee Code: {employee.L1EmpCode}</p>

							{/* Employee Metrics */}
							<div className='mt-2'>
								<p>
									Total Customers: {employee.assignedCustomers?.length || 0}
								</p>
								<p>Total Queries: {employee.metrics?.queryCount || 0}</p>
								<p>Total Services: {employee.metrics?.serviceCount || 0}</p>
							</div>

							{/* Customers Section */}
							{employee.assignedCustomers?.length > 0 && (
								<div className='mt-2'>
									<h4 className='font-bold'>Assigned Customers:</h4>
									<div className='ml-4'>
										{employee.assignedCustomers.map((customer) => (
											<div key={customer._id} className='mt-2 p-2 border-l'>
												<p>Name: {customer.name}</p>
												<p>Email: {customer.email}</p>
												<p>Mobile: {customer.mobile}</p>
												<p>
													Status: {customer.isActive ? "Active" : "Inactive"}
												</p>
												{/* Services */}
												{customer.services?.length > 0 && (
													<div className='ml-2 mt-1'>
														<p className='font-bold'>Services:</p>
														{customer.services.map((service) => (
															<div key={service._id} className='ml-2'>
																<p>Service ID: {service.serviceId}</p>
																<p>Status: {service.status}</p>
																<p>
																	Due Date:{" "}
																	{new Date(
																		service.dueDate
																	).toLocaleDateString()}
																</p>
															</div>
														))}
													</div>
												)}
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ManDash;
