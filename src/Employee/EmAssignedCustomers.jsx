// In EmAssignedCustomers.js
import React, { useContext, useEffect, useState } from "react";
import { EmployeeContext } from "./EmployeeContext";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import Papa from "papaparse";

const EmAssignedCustomers = () => {
	const {
		assignedCustomers,
		loading,
		error,
		updateServiceStatus,
		fetchAssignedCustomers,
		user,
	} = useContext(EmployeeContext);

	const [canDownload, setCanDownload] = useState(false);

	const handleStatusChange = async (event, serviceId, status, customerId) => {
		event.preventDefault();
		try {
			console.log(
				"Updating service with ID:",
				serviceId,
				"to status:",
				status,
				"for customer ID:",
				customerId
			);
			const response = await updateServiceStatus(serviceId, status, customerId);
			alert(response.message);
		} catch (err) {
			alert("Failed to update service status.");
		}
	};

	useEffect(() => {
		fetchAssignedCustomers();
		// Check if the user has download access
		if (user && user.downloadAccess) {
			setCanDownload(true);
		} else {
			setCanDownload(false);
		}
	}, [fetchAssignedCustomers, user]); // Add user as a dependency

	// Ensure assignedCustomers is an array before mapping
	const isAssignedCustomersArray =
		Array.isArray(assignedCustomers) && assignedCustomers.length > 0;

	const downloadAsPDF = () => {
		const doc = new jsPDF();
		const tableData = [];

		assignedCustomers.forEach((customer) => {
			customer.services.forEach((service) => {
				tableData.push([
					service.orderId,
					customer.name,
					customer.email,
					service.status,
				]);
			});
		});

		doc.autoTable({
			head: [["Order ID", "Name", "Email", "Service Status"]],
			body: tableData,
		});

		doc.save("assigned_customers.pdf");
	};

	const downloadAsCSV = () => {
		const csvData = [];
		assignedCustomers.forEach((customer) => {
			customer.services.forEach((service) => {
				csvData.push({
					"Order ID": service.orderId,
					Name: customer.name,
					Email: customer.email,
					"Service Status": service.status,
				});
			});
		});

		const csv = Papa.unparse(csvData);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		saveAs(blob, "assigned_customers.csv");
	};

	return (
		<div className='assigned-customers tax-dashboard-employee'>
			{/* {loading && <p>Loading...</p>} */}
			{error && <p>Error fetching customers: {error}</p>}

			{isAssignedCustomersArray ? (
				<table className='table'>
					<thead>
						<tr>
							<th>Order ID</th>
							<th>Name</th>
							<th>Email</th>
							<th>Service Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{assignedCustomers.map((customer) =>
							customer.services.map((service) => (
								<tr key={service._id}>
									<td>{service.orderId}</td>
									<td>{customer.name}</td>
									<td>{customer.email}</td>
									<td>{service.status}</td>
									<td className='tax-btn-cont'>
										<button
											className='tax-service-btn'
											onClick={(e) =>
												handleStatusChange(
													e,
													service.serviceId,
													"completed",
													customer._id
												)
											}
											disabled={service.status === "completed"}>
											Approve
										</button>
										<button
											className='tax-service-btn'
											onClick={(e) =>
												handleStatusChange(
													e,
													service.serviceId,
													"in-process",
													customer._id
												)
											}
											disabled={service.status === "in-process"}>
											In-Process
										</button>
										<button
											className='serviceDelete'
											onClick={(e) =>
												handleStatusChange(
													e,
													service.serviceId,
													"rejected",
													customer._id
												)
											}
											disabled={service.status === "rejected"}>
											Reject
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			) : (
				<p>No assigned orders available.</p>
			)}

			{canDownload && (
				<div className='table-bottom-btns'>
					<button className='tax-service-btn' onClick={downloadAsPDF}>
						Download as PDF
					</button>
					<button className='tax-service-btn' onClick={downloadAsCSV}>
						Download as CSV
					</button>
				</div>
			)}
		</div>
	);
};

export default EmAssignedCustomers;
