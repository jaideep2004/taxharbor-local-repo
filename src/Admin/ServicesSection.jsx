import React, { useContext, useState } from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { useNotification } from "../NotificationContext";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DocumentRequirements from "./DocumentRequirements";
import Orders from "./Orders";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const ServicesSection = () => {
	const [showServiceForm, setShowServiceForm] = useState(false);
	const {
		services,
		newService,
		setNewService,
		handleCreateService,
		handleUpdateService,
		handleDeleteService,
		handleToggleServiceActivation,
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
			ServiceID: service._id,
			ServiceDate: formatDate(service.createdAt),
			ServiceCategory: service.category,
			ServiceName: service.name,
			ServiceDescription: service.description,
			SalePrice: service.actualPrice,
			DiscountedPrice: service.salePrice,
			Currency: service.currency,
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
			"Service ID",
			"Service Date",
			"Service Category",
			"Service Name",
			"Service Description",
			"Sale Price",
			"Discounted Price",
			"Currency",
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
			service.currency,
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
							<th>Status</th>
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
									{service.packages && service.packages.length > 0 ? (
										<div>
											{service.packages.map((pkg, index) => (
												<div key={index} style={{ marginBottom: '5px' }}>
													<strong>{pkg.name}</strong>: ₹{pkg.actualPrice || 'N/A'}
												</div>
											))}
										</div>
									) : (
										<span>No packages</span>
									)}
								</td>
								<td>
									{service.packages && service.packages.length > 0 ? (
										<div>
											{service.packages.map((pkg, index) => (
												<div key={index} style={{ marginBottom: '5px' }}>
													<strong>{pkg.name}</strong>: ₹{pkg.salePrice || 'N/A'}
												</div>
											))}
										</div>
									) : (
										<span>No packages</span>
									)}
								</td>
								<td>{service.currency}</td>
								<td>{service.hsncode || "No HSN Code"}</td>
								<td>
									{service.packages && service.packages.length > 0 ? (
										<div>
											{service.packages.map((pkg, index) => (
												<div key={index} style={{ marginBottom: '5px' }}>
													<strong>{pkg.name}</strong>: {pkg.processingDays || 0} days
												</div>
											))}
										</div>
									) : (
										<span>No packages</span>
									)}
								</td>
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
								<td>
									<span
										style={{
											color: service.isActive ? "green" : "red",
											fontWeight: "bold",
										}}>
										{service.isActive !== false ? "Active" : "Inactive"}
									</span>
								</td>
								<td className='tax-btn-cont'>
									<button
										className='tax-service-btn'
										onClick={() => setEditingService(service)}>
										<i class='fa-solid fa-pencil'></i>
									</button>
									<button
										className='tax-service-btn'
										onClick={() => handleToggleServiceActivation(service._id)}
										style={{
											backgroundColor:
												service.isActive !== false ? "#ff6b6b" : "#4caf50",
											color: "white",
										}}>
										{service.isActive !== false ? "Deactivate" : "Activate"}
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
						label='HSN Code'
						fullWidth
						value={newService.hsncode}
						onChange={(e) =>
							setNewService({ ...newService, hsncode: e.target.value })
						}
					/>
					<TextField
						margin='dense'
						label='Currency'
						fullWidth
						value={newService.currency}
						onChange={(e) =>
							setNewService({ ...newService, currency: e.target.value })
						}
					/>

					{/* Packages Section */}
					<div style={{ marginTop: '20px', marginBottom: '10px' }}>
						<h3>Packages</h3>
						<Button
							variant="contained"
							color="primary"
							onClick={addPackage}
							style={{ marginBottom: '10px' }}
						>
							Add Package
						</Button>
						
						{newService.packages.map((pkg, packageIndex) => (
							<div 
								key={packageIndex}
								style={{ 
									border: '1px solid #ccc', 
									padding: '15px', 
									marginBottom: '15px',
									borderRadius: '5px'
								}}
							>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<h4>Package {packageIndex + 1}</h4>
									<Button 
										variant="outlined" 
										color="error" 
										onClick={() => removePackage(packageIndex)}
									>
										Remove Package
									</Button>
								</div>
								
								<TextField
									margin='dense'
									label='Package Name'
									fullWidth
									value={pkg.name}
									onChange={(e) => updatePackage(packageIndex, 'name', e.target.value)}
								/>
								<TextField
									margin='dense'
									label='Package Description'
									fullWidth
									value={pkg.description}
									onChange={(e) => updatePackage(packageIndex, 'description', e.target.value)}
								/>
								<div style={{ display: 'flex', gap: '10px' }}>
									<TextField
										margin='dense'
										label='Actual Price'
										type='number'
										fullWidth
										value={pkg.actualPrice}
										onChange={(e) => updatePackage(packageIndex, 'actualPrice', e.target.value)}
									/>
									<TextField
										margin='dense'
										label='Sale Price'
										type='number'
										fullWidth
										value={pkg.salePrice}
										onChange={(e) => updatePackage(packageIndex, 'salePrice', e.target.value)}
									/>
								</div>
								<TextField
									margin='dense'
									label='Processing Days'
									type='number'
									fullWidth
									value={pkg.processingDays}
									onChange={(e) => updatePackage(packageIndex, 'processingDays', parseInt(e.target.value))}
									inputProps={{ min: 1 }}
								/>
								
								{/* Features Section */}
								<div style={{ marginTop: '15px' }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<h5>Features</h5>
										<Button 
											variant="outlined" 
											onClick={() => addFeature(packageIndex)}
										>
											Add Feature
										</Button>
									</div>
									
									{pkg.features.map((feature, featureIndex) => (
										<div key={featureIndex} style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
											<TextField
												margin='dense'
												label={`Feature ${featureIndex + 1}`}
												fullWidth
												value={feature}
												onChange={(e) => updateFeature(packageIndex, featureIndex, e.target.value)}
											/>
											<Button 
												variant="outlined" 
												color="error" 
												onClick={() => removeFeature(packageIndex, featureIndex)}
												style={{ marginTop: '8px' }}
											>
												Remove
											</Button>
										</div>
									))}
								</div>
							</div>
						))}
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
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCreateService}>Create</Button>
					<Button onClick={() => setShowServiceForm(false)}>Cancel</Button>
				</DialogActions>
			</Dialog>

			{/* Edit Service Modal with MUI */}
			<Dialog
				open={!!editingService}
				onClose={() => setEditingService(null)}
				maxWidth='md'
				fullWidth>
				<DialogTitle>Edit Service</DialogTitle>
				<DialogContent>
					{editingService && (
						<>
							<TextField
								margin='dense'
								label='Service Category'
								fullWidth
								value={editingService.category}
								onChange={(e) =>
									setEditingService({
										...editingService,
										category: e.target.value,
									})
								}
							/>
							<TextField
								margin='dense'
								label='Service Name'
								fullWidth
								value={editingService.name}
								onChange={(e) =>
									setEditingService({ ...editingService, name: e.target.value })
								}
							/>
							<TextField
								margin='dense'
								label='Service Description'
								fullWidth
								value={editingService.description}
								onChange={(e) =>
									setEditingService({
										...editingService,
										description: e.target.value,
									})
								}
							/>
							<TextField
								margin='dense'
								label='HSN Code'
								fullWidth
								value={editingService.hsncode}
								onChange={(e) =>
									setEditingService({
										...editingService,
										hsncode: e.target.value,
									})
								}
							/>
							<TextField
								margin='dense'
								label='Currency'
								fullWidth
								value={editingService.currency}
								onChange={(e) =>
									setEditingService({
										...editingService,
										currency: e.target.value,
									})
								}
							/>
							
							{/* Packages Section for Editing */}
							<div style={{ marginTop: '20px', marginBottom: '10px' }}>
								<h3>Packages</h3>
								<Button
									variant="contained"
									color="primary"
									onClick={() => {
										setEditingService({
											...editingService,
											packages: [
												...(editingService.packages || []),
												{
													name: "",
													description: "",
													actualPrice: "",
													salePrice: "",
													features: [],
													processingDays: 7,
												}
											]
										})
									}}
									style={{ marginBottom: '10px' }}
								>
									Add Package
								</Button>
								
								{(editingService.packages || []).map((pkg, packageIndex) => (
									<div 
										key={packageIndex}
										style={{ 
											border: '1px solid #ccc', 
											padding: '15px', 
											marginBottom: '15px',
											borderRadius: '5px'
										}}
									>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<h4>Package {packageIndex + 1}</h4>
											<Button 
												variant="outlined" 
												color="error" 
												onClick={() => {
													setEditingService({
														...editingService,
														packages: editingService.packages.filter((_, i) => i !== packageIndex)
													})
												}}
											>
												Remove Package
											</Button>
										</div>
										
										<TextField
											margin='dense'
											label='Package Name'
											fullWidth
											value={pkg.name}
											onChange={(e) => {
												const newPackages = [...editingService.packages];
												newPackages[packageIndex] = {
													...newPackages[packageIndex],
													name: e.target.value
												};
												setEditingService({
													...editingService,
													packages: newPackages
												})
											}}
										/>
										<TextField
											margin='dense'
											label='Package Description'
											fullWidth
											value={pkg.description}
											onChange={(e) => {
												const newPackages = [...editingService.packages];
												newPackages[packageIndex] = {
													...newPackages[packageIndex],
													description: e.target.value
												};
												setEditingService({
													...editingService,
													packages: newPackages
												})
											}}
										/>
										<div style={{ display: 'flex', gap: '10px' }}>
											<TextField
												margin='dense'
												label='Actual Price'
												type='number'
												fullWidth
												value={pkg.actualPrice}
												onChange={(e) => {
													const newPackages = [...editingService.packages];
													newPackages[packageIndex] = {
														...newPackages[packageIndex],
														actualPrice: e.target.value
													};
													setEditingService({
														...editingService,
														packages: newPackages
													})
												}}
											/>
											<TextField
												margin='dense'
												label='Sale Price'
												type='number'
												fullWidth
												value={pkg.salePrice}
												onChange={(e) => {
													const newPackages = [...editingService.packages];
													newPackages[packageIndex] = {
														...newPackages[packageIndex],
														salePrice: e.target.value
													};
													setEditingService({
														...editingService,
														packages: newPackages
													})
												}}
											/>
										</div>
										<TextField
											margin='dense'
											label='Processing Days'
											type='number'
											fullWidth
											value={pkg.processingDays}
											onChange={(e) => {
												const newPackages = [...editingService.packages];
												newPackages[packageIndex] = {
													...newPackages[packageIndex],
													processingDays: parseInt(e.target.value) || 7
												};
												setEditingService({
													...editingService,
													packages: newPackages
												})
											}}
											inputProps={{ min: 1 }}
										/>
										
										{/* Features Section */}
										<div style={{ marginTop: '15px' }}>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												<h5>Features</h5>
												<Button 
													variant="outlined" 
													onClick={() => {
														const newPackages = [...editingService.packages];
														newPackages[packageIndex] = {
															...newPackages[packageIndex],
															features: [...(newPackages[packageIndex].features || []), ""]
														};
														setEditingService({
															...editingService,
															packages: newPackages
														})
													}}
												>
													Add Feature
												</Button>
											</div>
											
											{(pkg.features || []).map((feature, featureIndex) => (
												<div key={featureIndex} style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
													<TextField
														margin='dense'
														label={`Feature ${featureIndex + 1}`}
														fullWidth
														value={feature}
														onChange={(e) => {
															const newPackages = [...editingService.packages];
															newPackages[packageIndex] = {
																...newPackages[packageIndex],
																features: newPackages[packageIndex].features.map(
																	(f, i) => i === featureIndex ? e.target.value : f
																)
															};
															setEditingService({
																...editingService,
																packages: newPackages
															})
														}}
													/>
													<Button 
														variant="outlined" 
														color="error" 
														onClick={() => {
															const newPackages = [...editingService.packages];
															newPackages[packageIndex] = {
																...newPackages[packageIndex],
																features: newPackages[packageIndex].features.filter(
																	(_, i) => i !== featureIndex
																)
															};
															setEditingService({
																...editingService,
																packages: newPackages
															})
														}}
														style={{ marginTop: '8px' }}
													>
														Remove
													</Button>
												</div>
											))}
										</div>
									</div>
								))}
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
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() =>
							handleUpdateServiceWithProcessingDays(editingService)
						}>
						Update
					</Button>
					<Button onClick={() => setEditingService(null)}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default ServicesSection;
