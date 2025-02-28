import React, { useState, useEffect } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import QueryModal from "./QueryModal";
import FeedbackModal from "./FeedbackModal";
import ServiceProgress from "./ServiceProgress";

const CServiceStatus = () => {
	const { services, uploadDocuments, loading, user } = useCustomerAuth();
	const [selectedService, setSelectedService] = useState(null);
	const [uploadError, setUploadError] = useState("");
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
	const [files, setFiles] = useState({});
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadedDocuments, setUploadedDocuments] = useState([]);

	const [feedbackGiven, setFeedbackGiven] = useState(() => {
		const savedFeedback =
			JSON.parse(localStorage.getItem("feedbackGiven")) || {};
		return savedFeedback;
	});

	useEffect(() => {
		localStorage.setItem("feedbackGiven", JSON.stringify(feedbackGiven));
	}, [feedbackGiven]);

	const getServiceStage = (service) => {
		const stages = [
			"Signup For The Service",
			"Assigned To An Expert",
			"Document Upload",
			"Service Execution",
			"Deliverables Finalized",
		];

		if (service.status === "completed") {
			return "Deliverables Finalized";
		} else if (service.documents?.length > 0) {
			return "Service Execution";
		} else if (service.employeeId) {
			return "Document Upload";
		} else if (service.activated) {
			return "Assigned To An Expert";
		}
		return "Signup For The Service";
	};

	const openModal = (service) => {
		setSelectedService(service);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setSelectedService(null);
		setIsModalOpen(false);
	};

	const openUploadModal = (service) => {
		const enhancedService = {
			...service,
			serviceName: service.name || service.serviceName,
			requiredDocuments: service.requiredDocuments || [],
		};
		setSelectedService(enhancedService);
		setFiles({});
		setUploadError("");
		setIsUploadModalOpen(true);
	};

	const closeUploadModal = () => {
		setSelectedService(null);
		setFiles({});
		setUploadError("");
		setIsUploadModalOpen(false);
		setUploadProgress(0);
	};

	const openFeedbackModal = (service) => {
		setSelectedService(service);
		setIsFeedbackModalOpen(true);
	};

	const closeFeedbackModal = () => {
		setSelectedService(null);
		setIsFeedbackModalOpen(false);
	};

	const handleFileChange = (docName, e) => {
		const file = e.target.files[0];
		setFiles((prev) => ({
			...prev,
			[docName]: file,
		}));
	};

	const handleUpload = async () => {
		if (!selectedService) {
			setUploadError("No service selected.");
			return;
		}

		if (!selectedService.requiredDocuments?.length) {
			setUploadError("No required documents specified for this service.");
			return;
		}

		const requiredDocs = selectedService.requiredDocuments.filter(
			(doc) => doc.required
		);
		const missingDocs = requiredDocs.filter((doc) => !files[doc.name]);

		if (missingDocs.length > 0) {
			setUploadError(
				`Please upload required documents: ${missingDocs
					.map((d) => d.name)
					.join(", ")}`
			);
			return;
		}

		try {
			const serviceId = selectedService.serviceId || selectedService._id;
			await uploadDocuments(serviceId, files);
			closeUploadModal();
		} catch (error) {
			setUploadError(
				error.message || "Failed to upload documents. Please try again."
			);
		}
	};

	const formatDate = (dateStr) => {
		if (!dateStr) return "N/A";
		const date = new Date(dateStr);
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
	};

	const handleFeedbackSubmit = (serviceId) => {
		setFeedbackGiven((prev) => ({
			...prev,
			[serviceId]: true,
		}));
	};

	if (loading) return <p>Loading...</p>;

	const stages = [
		"Signup For The Service",
		"Assigned To An Expert",
		"Document Upload",
		"Service Execution",
		"Deliverables Finalized",
	];

	const [selectedServiceName, setSelectedServiceName] = useState("");
	useEffect(() => {
		if (services && services.length > 0) {
			setSelectedServiceName(services[0].serviceName);
			setUploadedDocuments(services[0].documents || []);
		}
	}, [services]);

	useEffect(() => {
		const selectedService = services.find(
			(service) => service.serviceName === selectedServiceName
		);
		setUploadedDocuments(selectedService?.documents || []);
	}, [selectedServiceName, services]);

	return (
		<div className='tax-dashboard-section'>
			<div className='service-status'>
				<div className='tax-services-wrap-table'>
					<table>
						<thead>
							<tr>
								<th>Order ID</th>
								<th>Service Name</th>
								<th>Purchased At</th>
								<th>Status</th>
								<th>Managed By</th>
								<th>Due Date</th>
								<th>Actions</th>
								<th>Uploaded Documents</th>
							</tr>
						</thead>
						<tbody>
							{services.length > 0 ? (
								services.map((service, index) => (
									<React.Fragment key={index}>
										<tr>
											<td>{service.orderId || service._id || "N/A"}</td>
											<td>{service.serviceName || service.name}</td>
											<td>{formatDate(service.purchasedAt)}</td>
											<td>{service.status || "Pending"}</td>
											<td>{service.managedBy || "Unassigned"}</td>
											<td>{formatDate(service.dueDate)}</td>
											<td className='tax-btn-cont'>
												<button
													className='tax-service-btn'
													onClick={() => openModal(service)}>
													Query
												</button>

												{service.status === "completed" &&
													(!service.feedback ||
														service.feedback.length === 0) && (
														<button
															className='tax-service-btn'
															onClick={() => openFeedbackModal(service)}>
															Feedback
														</button>
													)}

												{service.status !== "completed" && (
													<button
														className='tax-service-btn'
														onClick={() => openUploadModal(service)}>
														Upload Documents
													</button>
												)}
											</td>
										</tr>
										<tr>
											<td colSpan='7' className='p-4'>
												<div className='w-full'>
													<h4 className='text-lg font-semibold mb-2'>
														Service Progress
													</h4>
													<ServiceProgress
														stages={stages}
														currentStage={getServiceStage(service)}
													/>
												</div>
											</td>
											<td>
												{service.documents && service.documents.length > 0 ? (
													service.documents.map((doc, index) => (
														<div key={index} className='document-item'>
															<span className='document-name'>
																{doc.originalName}
															</span>
														</div>
													))
												) : (
													<span>No documents uploaded</span>
												)}
											</td>
										</tr>
									</React.Fragment>
								))
							) : (
								<tr>
									<td colSpan='7' className='text-center'>
										No services found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Modals remain unchanged */}
			{isModalOpen && (
				<QueryModal service={selectedService} onClose={closeModal} />
			)}

			{isFeedbackModalOpen && (
				<FeedbackModal
					service={selectedService}
					onClose={closeFeedbackModal}
					onFeedbackSubmit={() =>
						handleFeedbackSubmit(
							selectedService.serviceId || selectedService._id
						)
					}
				/>
			)}

			{isUploadModalOpen && selectedService && (
				<div className='cquerymodalwrap'>
					<div className='cquerymodal'>
						<h2>Upload Documents for {selectedService.serviceName}</h2>

						{selectedService.requiredDocuments?.length > 0 ? (
							selectedService.requiredDocuments.map((doc, index) => (
								<div key={index} className='document-upload-item'>
									{/* <label> */}
									<div>
										<h5>
											{doc.name} {doc.required && "*"}
										</h5>
										<br />
										<p>{doc.description}</p>
									</div>
									{/* </label> */}
									<input
										type='file'
										onChange={(e) => handleFileChange(doc.name, e)}
										accept='image/*,application/pdf'
									/>
								</div>
							))
						) : (
							<p>No required documents specified for this service.</p>
						)}

						{uploadProgress > 0 && uploadProgress < 100 && (
							<div className='upload-progress'>
								<div
									className='progress-bar'
									style={{ width: `${uploadProgress}%` }}
								/>
								<span>{uploadProgress}%</span>
							</div>
						)}

						{uploadError && <p className='error'>{uploadError}</p>}

						<div className='btnqcont'>
							<button
								className='cquerysubmit'
								onClick={handleUpload}
								disabled={!selectedService.requiredDocuments?.length}>
								Upload
							</button>
							<button className='cqueryclose' onClick={closeUploadModal}>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CServiceStatus;
