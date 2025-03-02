import React, { useContext, useState } from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { useNotification } from "../NotificationContext";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DocumentRequirements from "./DocumentRequirements";
import Orders from "./Orders";

const ServicesSection = () => {
	const [showServiceForm, setShowServiceForm] = useState(false);
	const {
		services,
		newService,
		setNewService,
		handleCreateService,
		handleUpdateService,
		handleDeleteService,
	} = useContext(AdminDashboardContext);

	const { showNotification } = useNotification();

	// Filter and sorting state
	const [searchTerm, setSearchTerm] = useState("");
	const [filterOption, setFilterOption] = useState("newest");
	const [dateFilter, setDateFilter] = useState({ fromDate: "", toDate: "" });
	const [filterCriteria, setFilterCriteria] = useState("name");
	const [editingService, setEditingService] = useState(null);
	const [showDocuments, setShowDocuments] = useState(false);

	const [showDocRequirements, setShowDocRequirements] = useState(false); // State for toggling Documen
	const handleToggleDocRequirements = () => {
		setShowDocRequirements((prev) => !prev); // Toggle visibility
	};

	const normalizeDate = (dateStr) => {
		const date = new Date(dateStr);
		date.setHours(0, 0, 0, 0);
		return date;
	};

	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
	};

	// Filtered Services based on column filters and search term
	const filteredServices = [...services]
		.filter((service) => {
			const lowerSearchTerm = searchTerm.toLowerCase();
			return (
				service.name.toLowerCase().includes(lowerSearchTerm) ||
				service._id.toLowerCase().includes(lowerSearchTerm)
			);
		})
		.filter((service) => {
			const serviceDate = new Date(service.createdAt);
			const fromDate = dateFilter.fromDate
				? normalizeDate(dateFilter.fromDate)
				: null;
			const toDate = dateFilter.toDate
				? normalizeDate(dateFilter.toDate)
				: null;

			return (
				(fromDate === null || serviceDate >= fromDate) &&
				(toDate === null || serviceDate <= toDate)
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

	const handleUpdateServiceWithProcessingDays = async (updatedService) => {
		const originalService = services.find((s) => s._id === updatedService._id);

		if (originalService.processingDays !== updatedService.processingDays) {
			const daysDifference =
				updatedService.processingDays - originalService.processingDays;
			const success = await handleUpdateService(updatedService);

			if (success) {
				const action = daysDifference > 0 ? "increased" : "decreased";
				const days = Math.abs(daysDifference);
				showNotification(
					`Processing days ${action} by ${days} days successfully!`,
					"success",
					"admin"
				);
			}
		} else {
			await handleUpdateService(updatedService);
		}
		setEditingService(null);
	};

	// Export functions
	const handleDownloadCSV = () => {
		const csvData = services.map((service) => ({
			ID: service._id,
			ServiceDate: formatDate(service.createdAt),
			ServiceCategory: service.category,
			ServiceName: service.name,
			ServiceDescription: service.description,
			SalePrice: service.actualPrice,
			DiscountedPrice: service.salePrice,
			HSNCode: service.hsncode,
			ProcessingDays: service.processingDays,
			RequiredDocuments: service.requiredDocuments.length,
		}));

		const csv = Papa.unparse(csvData);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		saveAs(blob, "services.csv");
	};

	const handleDownloadPDF = () => {
		const doc = new jsPDF("landscape", "pt", "a3");
		const tableColumn = [
			"ID",
			"Service Date",
			"Service Category",
			"Service Name",
			"Service Description",

			"Sale Price",
			"Discounted Price",
			"HSN Code",
			"Processing Days",
			"Required Documents",
		];
		const tableRows = services.map((service) => [
			service._id,
			formatDate(service.createdAt),
			service.category,
			service.name,
			service.description,
			service.actualPrice,
			service.salePrice,
			service.hsncode,
			service.processingDays,
			service.requiredDocuments?.length,
		]);

		doc.text("Service Data", 14, 15);
		doc.autoTable({
			head: [tableColumn],
			body: tableRows,
			startY: 20,
		});

		doc.save("services.pdf");
	};

	const addPackage = () => {
		setNewService((prev) => ({
			...prev,
			packages: [
				...prev.packages,
				{
					name: "",
					description: "",
					actualPrice: "",
					salePrice: "",
					features: [],
					processingDays: 7,
				},
			],
		}));
	};

	const removePackage = (index) => {
		setNewService((prev) => ({
			...prev,
			packages: prev.packages.filter((_, i) => i !== index),
		}));
	};

	const updatePackage = (index, field, value) => {
		setNewService((prev) => ({
			...prev,
			packages: prev.packages.map((pkg, i) =>
				i === index ? { ...pkg, [field]: value } : pkg
			),
		}));
	};

	const addFeature = (packageIndex) => {
		setNewService((prev) => ({
			...prev,
			packages: prev.packages.map((pkg, i) =>
				i === packageIndex ? { ...pkg, features: [...pkg.features, ""] } : pkg
			),
		}));
	};

	const updateFeature = (packageIndex, featureIndex, value) => {
		setNewService((prev) => ({
			...prev,
			packages: prev.packages.map((pkg, i) =>
				i === packageIndex
					? {
							...pkg,
							features: pkg.features.map((feat, j) =>
								j === featureIndex ? value : feat
							),
					  }
					: pkg
			),
		}));
	};

	const removeFeature = (packageIndex, featureIndex) => {
		setNewService((prev) => ({
			...prev,
			packages: prev.packages.map((pkg, i) =>
				i === packageIndex
					? {
							...pkg,
							features: pkg.features.filter((_, j) => j !== featureIndex),
					  }
					: pkg
			),
		}));
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
						onClick={() => setShowServiceForm(true)}>
						Add Service
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
					<thead>
						<tr>
							<th>Service ID</th>
							<th>Service Start Date</th>
							<th>Service Category</th>
							<th>Service Name</th>
							<th>Service Description</th>
							<th>Sale Price</th>
							<th>Discounted Price</th>
							<th>Currency</th>
							<th>HSN Code</th>
							<th>Completion Days</th>
							<th>Required Documents</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredServices.map((service) => (
							<tr key={service._id}>
								<td>{service._id}</td>
								<td>{formatDate(service.createdAt)}</td>
								<td>{service.category}</td>
								<td>{service.name}</td>
								<td>{service.description}</td>

								<td>
									<span style={{ textDecoration: "line-through" }}>
										₹{service.actualPrice}
									</span>
								</td>
								<td>
									₹{service.salePrice} <br />
								</td>
								<td>₹</td>
								<td>{service.hsncode || "No HSN Code"}</td>
								<td>{service.processingDays || 0} days</td>
								<td>
									{service.requiredDocuments &&
									service.requiredDocuments.length > 0 ? (
										<select
											style={{
												border: "1px solid var(--accent)",
												borderRadius: "15px",
												padding: "15px",
												fontSize: "16px",
											}}>
											{service.requiredDocuments.map((doc) => (
												<option key={doc._id} className='service-info'>
													{doc.name} - {doc.description || "no desc"}
												</option>
											))}
										</select>
									) : (
										"No documnets specified"
									)}
								</td>
								<td className='tax-btn-cont'>
									<button
										className='tax-service-btn'
										onClick={() => setEditingService(service)}>
										<i class='fa-solid fa-pencil'></i>
									</button>
									<button
										className='serviceDelete'
										onClick={() => handleDeleteService(service._id)}>
										<i class='fa-solid fa-trash'></i>
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

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
							// onChange={(e) =>
							// 	setNewService({ ...newService, dueDate: e.target.value })
							onChange={(e) =>
								setNewService((prev) => ({
									...prev,
									processingDays: parseInt(e.target.value),
								}))
							}
							min='1'
						/>
					</div>

					{/* <h4>Packages</h4>
					{newService.packages.map((pkg, packageIndex) => (
						<div
							key={packageIndex}
							className='package-section'
							style={{ display: "flex", flexDirection: "column" }}>
							<h5>Package {packageIndex + 1}</h5>
							<div>
								<input
									type='text'
									placeholder='Package Name'
									value={pkg.name}
									onChange={(e) =>
										updatePackage(packageIndex, "name", e.target.value)
									}
								/>
								<input
									type='text'
									placeholder='Package Description'
									value={pkg.description}
									onChange={(e) =>
										updatePackage(packageIndex, "description", e.target.value)
									}
								/>
							</div>
							<div>
								<input
									type='number'
									placeholder='Actual Price'
									value={pkg.actualPrice}
									onChange={(e) =>
										updatePackage(packageIndex, "actualPrice", e.target.value)
									}
								/>
								<input
									type='number'
									placeholder='Sale Price'
									value={pkg.salePrice}
									onChange={(e) =>
										updatePackage(packageIndex, "salePrice", e.target.value)
									}
								/>
							</div>
							<input
								type='number'
								placeholder='Processing Days'
								value={pkg.processingDays}
								onChange={(e) =>
									updatePackage(
										packageIndex,
										"processingDays",
										parseInt(e.target.value)
									)
								}
								min='1'
							/>

							<h6>Features</h6>
							{pkg.features.map((feature, featureIndex) => (
								<div key={featureIndex} className='feature-input'>
									<input
										type='text'
										placeholder='Feature'
										value={feature}
										onChange={(e) =>
											updateFeature(packageIndex, featureIndex, e.target.value)
										}
									/>
									<button
										onClick={() => removeFeature(packageIndex, featureIndex)}>
										Remove Feature
									</button>
								</div>
							))}
							<button onClick={() => addFeature(packageIndex)}>
								Add Feature
							</button>

							{newService.packages.length > 1 && (
								<button onClick={() => removePackage(packageIndex)}>
									Remove Package
								</button>
							)}
						</div>
					))}
					<button onClick={addPackage}>Add Package</button> */}

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
					{/* Modal Buttons */}
					<div id='modal-div'>
						<button onClick={handleCreateService}>Create</button>
						<button onClick={() => setShowServiceForm(false)}>Cancel</button>
					</div>
				</div>
			)}

			{/* Edit Service Modal */}
			{editingService && (
				<div className='smodal'>
					<h3>Edit Service</h3>
					<input
						type='text'
						placeholder='Service Category'
						value={editingService.category}
						onChange={(e) =>
							setEditingService({ ...editingService, category: e.target.value })
						}
					/>
					<input
						type='text'
						placeholder='Service Name'
						value={editingService.name}
						onChange={(e) =>
							setEditingService({ ...editingService, name: e.target.value })
						}
					/>
					<input
						type='text'
						placeholder='Service Description'
						value={editingService.description}
						onChange={(e) =>
							setEditingService({
								...editingService,
								description: e.target.value,
							})
						}
					/>
					<input
						type='number'
						placeholder='Service Price'
						value={editingService.actualPrice}
						onChange={(e) =>
							setEditingService({
								...editingService,
								actualPrice: parseFloat(e.target.value) || 0,
							})
						}
					/>
					<input
						type='number'
						placeholder='Discounted Service Price'
						value={editingService.salePrice}
						onChange={(e) =>
							setEditingService({
								...editingService,
								salePrice: parseFloat(e.target.value) || 0,
							})
						}
					/>
					<input
						type='text'
						placeholder='HSN Code'
						value={editingService.hsncode}
						onChange={(e) =>
							setEditingService({
								...editingService,
								hsncode: e.target.value,
							})
						}
					/>
					<div className='processing-days-section'>
						<label htmlFor='processingDays'>Processing Days</label>
						<input
							id='processingDays'
							type='number'
							placeholder='Processing Days'
							value={editingService.processingDays}
							onChange={(e) =>
								setEditingService({
									...editingService,
									processingDays: parseInt(e.target.value) || 0,
								})
							}
							min='1'
						/>
						{editingService.processingDays !==
							services.find((s) => s._id === editingService._id)
								?.processingDays && (
							<span className='processing-days-notice'>
								This will update processing days for all active services
							</span>
						)}
					</div>

					<div>
						<button
							className='tax-service-btn2'
							onClick={() => setShowDocuments((prev) => !prev)}>
							{showDocuments
								? "Hide Document Requirements"
								: "Show Document Requirements"}
						</button>
					</div>

					{showDocuments && (
						<DocumentRequirements
							documents={editingService.requiredDocuments || []}
							onUpdate={(docs) =>
								setEditingService({
									...editingService,
									requiredDocuments: docs,
								})
							}
						/>
					)}

					<div id='modal-div'>
						<button
							onClick={() =>
								handleUpdateServiceWithProcessingDays(editingService)
							}>
							Update
						</button>
						<button onClick={() => setEditingService(null)}>Cancel</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ServicesSection;
