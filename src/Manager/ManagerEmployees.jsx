import React, { useContext } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { ManagerContext } from "./ManagerContext";

const ManagerEmployees = () => {
	const { dashboardData } = useContext(ManagerContext);

	// Extract employees from dashboardData
	const employees = dashboardData?.employees || [];

	// Download as PDF
	const downloadAsPDF = () => {
		const doc = new jsPDF();
		const tableData = [];

		employees.forEach((employee) => {
			if (employee.assignedCustomers) {
				employee.assignedCustomers.forEach((customer) => {
					if (customer.services) {
						customer.services.forEach((service) => {
							tableData.push([
								employee.name,
								customer.name,
								customer.email,
								service.orderId,
								service.status,
							]);
						});
					}
				});
			}
		});

		doc.autoTable({
			head: [
				[
					"Employee Name",
					"Customer Name",
					"Customer Email",
					"Order ID",
					"Service Status",
				],
			],
			body: tableData,
		});

		doc.save("manager_employees.pdf");
	};

	// Download as CSV
	const downloadAsCSV = () => {
		const csvData = [];
		employees.forEach((employee) => {
			if (employee.assignedCustomers) {
				employee.assignedCustomers.forEach((customer) => {
					if (customer.services) {
						customer.services.forEach((service) => {
							csvData.push({
								"Employee Name": employee.name,
								"Customer Name": customer.name,
								"Customer Email": customer.email,
								"Order ID": service.orderId,
								"Service Status": service.status,
							});
						});
					}
				});
			}
		});

		const csv = Papa.unparse(csvData);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		saveAs(blob, "manager_employees.csv");
	};

	return (
		<div className='tax-dashboard-employee'>
			<div>
				<table>
					<thead>
						<tr>
							<th>Employee Name</th>
							<th>Customer Names</th>
							<th>Customer Email</th>
							<th>Order ID</th>
							<th>Service Status</th>
						</tr>
					</thead>
					<tbody>
						{employees.length > 0 ? (
							employees.map((employee) => {
								const assignedCustomers = employee.assignedCustomers || [];
								return (
									<tr key={employee._id}>
										<td>{employee.name}</td>
										<td>
											<select>
												{assignedCustomers.map((customer) => (
													<option key={customer._id} value={customer._id}>
														{customer.name}
													</option>
												))}
											</select>
										</td>
										<td>
											{assignedCustomers.length > 0
												? assignedCustomers[0].email
												: "N/A"}
										</td>
										<td>
											{(assignedCustomers.length > 0 &&
												assignedCustomers[0].services?.[0]?.orderId) ||
												"N/A"}
										</td>
										<td>
											{(assignedCustomers.length > 0 &&
												assignedCustomers[0].services?.[0]?.status) ||
												"N/A"}
										</td>
									</tr>
								);
							})
						) : (
							<tr>
								<td colSpan='5'>No employees or customers assigned</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<div style={{ marginTop: "20px" }}>
				<button className='tax-service-btn' onClick={downloadAsPDF}>
					Download as PDF
				</button>
				<button className='tax-service-btn' onClick={downloadAsCSV}>
					Download as CSV
				</button>
			</div>
		</div>
	);
};

export default ManagerEmployees;
