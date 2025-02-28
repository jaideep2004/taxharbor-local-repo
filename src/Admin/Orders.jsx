import React from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);

	// Filter states
	const [searchTerm, setSearchTerm] = useState("");
	const [dateFilter, setDateFilter] = useState({ fromDate: "", toDate: "" });
	const [filterOption, setFilterOption] = useState("newest");

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true);
				const token = localStorage.getItem("adminToken");
				const response = await axios.get(
					"http://localhost:8000/api/admin/orders",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				console.log("Received orders:", response.data);
				setOrders(response.data.orders);
			} catch (error) {
				console.error("Error fetching orders:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [setLoading]);

	const formatDate = (dateStr) => {
		if (!dateStr) return "Not available";
		const date = new Date(dateStr);
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
	};

	const formatCurrency = (amount) => {
		if (!amount) return "₹0";
		return `₹${Number(amount).toLocaleString("en-IN")}`;
	};

	const normalizeDate = (dateStr) => {
		const date = new Date(dateStr);
		date.setHours(0, 0, 0, 0);
		return date;
	};

	// Filtered orders based on search and date filters
	const filteredOrders = [...orders]
		.filter((order) => {
			const lowerSearchTerm = searchTerm.toLowerCase();
			return (
				order["Order ID"]?.toLowerCase().includes(lowerSearchTerm) ||
				order["Customer Name"]?.toLowerCase().includes(lowerSearchTerm) ||
				order["Customer Email"]?.toLowerCase().includes(lowerSearchTerm) ||
				order["Service Name"]?.toLowerCase().includes(lowerSearchTerm)
			);
		})
		.filter((order) => {
			const orderDate = new Date(order["Order Date"]);
			const fromDate = dateFilter.fromDate
				? normalizeDate(dateFilter.fromDate)
				: null;
			const toDate = dateFilter.toDate
				? normalizeDate(dateFilter.toDate)
				: null;

			return (
				(fromDate === null || orderDate >= fromDate) &&
				(toDate === null || orderDate <= toDate)
			);
		})
		.sort((a, b) => {
			if (filterOption === "newest") {
				return new Date(b["Order Date"]) - new Date(a["Order Date"]);
			} else if (filterOption === "oldest") {
				return new Date(a["Order Date"]) - new Date(b["Order Date"]);
			}
			return 0;
		});

	// Export functions
	const handleDownloadCSV = () => {
		const csvData = orders.map((order) => ({
			"Order ID": order["Order ID"],
			"Order Date": formatDate(order["Order Date"]),
			"Customer ID": order["Customer ID"],
			"Customer Name": order["Customer Name"],
			"Customer Email": order["Customer Email"],
			"Customer Mobile Number": order["Customer Mobile Number"],
			"Employee Code": order["Employee Code"],
			"Employee Assigned": order["Employee Assigned"],
			"L1 Employee Code": order["Employee Code"],
			"L1 Employee Name": order["Employee Assigned"],
			"Service Name": order["Service Name"],
			"Service Price": order["Service Price"],
			Discounts: order["Discounts"],
			"IGST Amount": order["IGST Amount"],
			"CGST Amount": order["CGST Amount"],
			"SGST Amount": order["SGST Amount"],
			"Total Order Value": order["Total Order Value"],
			"Order Status": order["Order Status"],
			"Order Completion Date": formatDate(order["Order Date"]),
			"Days Delayed": order["Days Delayed"] || 0,
			"Payment Status": order["Payment Status"],
			Rating: order["Rating"] || "N/A",
			"Payment Method": order["Payment Method"] || "N/A",
		}));

		const csv = Papa.unparse(csvData);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		saveAs(blob, "orders.csv");
	};

	const handleDownloadPDF = () => {
		const doc = new jsPDF({
			orientation: "landscape",
			unit: "in",
			format: [4, 2],
		});

		const tableColumn = [
			"Order ID",
			"Order Date",
			"Customer Name",
			"Service Name",
			"Total Value",
			"Status",
		];

		const tableRows = filteredOrders.map((order) => [
			order["Order ID"],
			formatDate(order["Order Date"]),
			order["Customer Name"],
			order["Service Name"],
			formatCurrency(order["Total Order Value"]),
			order["Order Status"],
		]);

		doc.text("Orders Report", 14, 15);
		doc.autoTable({
			head: [tableColumn],
			body: tableRows,
			startY: 20,
		});

		doc.save("orders.pdf");
	};

	const clearAllFilters = () => {
		setSearchTerm("");
		setFilterOption("newest");
		setDateFilter({ fromDate: "", toDate: "" });
		setFilterCriteria("name");
	};

	return (
		<div className='tax-dashboard-services'>
			<div className='filter-div'>
				<input
					type='text'
					placeholder='Search by Order ID, Customer, or Service'
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
							<th>Order ID</th>
							<th>Order Date</th>
							<th>Customer ID</th>
							<th>Customer Name</th>
							<th>Customer Email</th>
							<th>Customer Mobile</th>
							<th>Employee Code</th>
							<th>Employee Assigned</th>
							<th>L1 Employee Code</th>
							<th>L1 Employee Name</th>
							<th>Service Name</th>
							<th>Service Price</th>
							<th>Discounts</th>
							<th>IGST Amount</th>
							<th>CGST Amount</th>
							<th>SGST Amount</th>
							<th>Total Order Value</th>
							<th>Order Status</th>
							<th>Order Completion Date</th>
							<th>Days Delayed</th>
							<th>Reason for Delay</th>
							<th>Feedback Status</th>
							<th>Feedback</th>
							<th>Rating</th>
							<th>Payment Method</th>
							<th>Payment Status</th>
							<th>Refund Status</th>
							<th>Razorpay Order ID</th>
							<th>Invoice Receipt</th>
						</tr>
					</thead>
					<tbody>
						{filteredOrders.map((order) => (
							<tr key={order["Order ID"]}>
								<td>{order["Order ID"]}</td>
								<td>{formatDate(order["Order Date"])}</td>
								<td>{order["Customer ID"]}</td>
								<td>{order["Customer Name"]}</td>
								<td>{order["Customer Email"]}</td>
								<td>{order["Customer Mobile Number"]}</td>
								<td>{order["Employee Code"]}</td>
								<td>{order["Employee Assigned"]}</td>
								<td>{order["Employee Code"]}</td>
								<td>{order["Employee Assigned"]}</td>
								<td>{order["Service Name"]}</td>
								<td>{formatCurrency(order["Service Price"])}</td>
								<td>{formatCurrency(order["Discounts"])}</td>
								<td>{formatCurrency(order["IGST Amount"])}</td>
								<td>{formatCurrency(order["CGST Amount"])}</td>
								<td>{formatCurrency(order["SGST Amount"])}</td>
								<td>{formatCurrency(order["Total Order Value"])}</td>
								<td>{order["Order Status"]}</td>
								<td>{formatDate(order["Order Date"])}</td>
								<td>{order["Days Delayed"] || 0}</td>
								<td>{order["Reason for Delay"] || "N/A"}</td>
								<td>{order["Feedback Status"]}</td>
								<td>{order["Feedback"] || "N/A"}</td>
								<td>{order["Rating"] || "N/A"}</td>
								<td>{order["Payment Method"] || "N/A"}</td>
								<td>{order["Payment Status"] || "N/A"}</td>
								<td>{order["Refund Status"] || "N/A"}</td>
								<td>{order["Razorpay Order ID"] || "N/A"}</td>
								<td>
									{order["Invoice Receipt"] ? (
										<a
											href={order["Invoice Receipt"]}
											target='blank'
											rel='noopener noreferrer'>
											Download
										</a>
									) : (
										"N/A"
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Orders;
