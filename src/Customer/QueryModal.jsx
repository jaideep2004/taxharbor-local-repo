import React, { useState, useEffect, useRef } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import "./customer.css";

const QueryModal = ({ service, onClose }) => {
	const [query, setQuery] = useState("");
	const [files, setFiles] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [queryHistory, setQueryHistory] = useState([]);
	const [showHistory, setShowHistory] = useState(false);
	const fileInputRef = useRef(null);
	const { user } = useCustomerAuth();
	const { fetchQueries, sendQuery } = useCustomerAuth();

	useEffect(() => {
		const fetchQueryHistory = async () => {
			try {
				const queries = await fetchQueries();
				setQueryHistory(queries || []);
			} catch (error) {
				console.error("Error fetching query history:", error);
			}
		};
		fetchQueryHistory();
	}, [fetchQueries]);

	const handleFileChange = (e) => {
		const selectedFiles = Array.from(e.target.files);
		setFiles(selectedFiles);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!query.trim() && files.length === 0) return;

		setIsSubmitting(true);
		try {
			const formData = new FormData();
			formData.append("userId", user._id);
			formData.append("serviceId", service.serviceId);
			formData.append("query", query);

			files.forEach((file) => {
				formData.append("files", file);
			});

			const success = await sendQuery(formData);

			if (success) {
				const queries = await fetchQueries();
				setQueryHistory(queries || []);
				setQuery("");
				setFiles([]);
				onClose();
			}
		} catch (error) {
			console.error("Failed to submit query:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderFilePreview = (file) => {
		// Create base URL for uploaded files
		const baseUrl = "https://195-35-45-82.sslip.io:8000/"; // Adjust this to match your server URL
		const filePath = `${baseUrl}${file.filePath}`;

		if (file.mimetype?.startsWith("image/")) {
			return (
				<img
					src={filePath}
					alt={file.originalName}
					style={{ maxWidth: "100px" }}
				/>
			);
		}
		// For PDFs and other files
		return (
			<div className='file-icon'>
				<a href={filePath} target='_blank' rel='noopener noreferrer'>
					{file.originalName}
				</a>
			</div>
		);
	};
	return (
		<div className='cquerymodalwrap'>
			<div className='cquerymodal'>
				<h2>Submit a Query for {service.serviceName}</h2>

				<button
					className='historybtn'
					onClick={() => setShowHistory(!showHistory)}>
					{showHistory ? "Hide History" : "Show History"}
				</button>

				{showHistory && (
					<div className='queryreplycont'>
						{queryHistory.length > 0 ? (
							queryHistory.map((q, index) => (
								<div key={index}>
									<div className='cquerycustside'>
										<p>
											<strong>Query:</strong> {q.query}
										</p>
										<p>
											<strong>Status:</strong> {q.status}
										</p>
									</div>
									{/* File Attachments */}
									{q.attachments && q.attachments.length > 0 && (
										<div>
											<strong>Attachments:</strong>
											<div
												style={{
													display: "flex",
													gap: "10px",
													marginTop: "5px",
												}}>
												{q.attachments.map((file, i) => (
													<div key={i}>
														{renderFilePreview(file)}
														<div>{file.originalName}</div>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Replies */}
									{q.replies &&
										Array.isArray(q.replies) &&
										q.replies.length > 0 && (
											<div className='custQueryReply'>
												<strong>Replies:</strong>
												<ul>
													{q.replies.map((reply, i) => (
														<li key={i}>
															<p>
																<strong>Response:</strong> {reply.message}
															</p>
															<p>
																<strong>By:</strong> {reply.responder}
															</p>
															<p>
																<strong>On:</strong>{" "}
																{new Date(reply.timestamp).toLocaleString()}
															</p>
														</li>
													))}
												</ul>
											</div>
										)}
									<hr />
								</div>
							))
						) : (
							<p>No queries found for this service.</p>
						)}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<textarea
						className='cquerytext'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder='Enter your query here'
					/>

					<div style={{ marginBottom: "10px" }}>
						<div className='attachment-container'>
							<label htmlFor='file-upload' className='attachment-icon'>
								📎
							</label>
							<input
								id='file-upload'
								type='file'
								ref={fileInputRef}
								onChange={handleFileChange}
								multiple
								accept='image/*,application/pdf'
								style={{ display: "none" }}
							/>
						</div>

						{files.length > 0 && (
							<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
								{files.map((file, index) => (
									<div key={index} className='file-preview'>
										<div>{file.name}</div>
										<button
											type='button'
											onClick={() =>
												setFiles(files.filter((_, i) => i !== index))
											}>
											Remove
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					<div className='btnqcont'>
						<button className='cqueryclose' type='button' onClick={onClose}>
							Close
						</button>
						<button
							className='cquerysubmit'
							type='submit'
							disabled={isSubmitting || (!query.trim() && files.length === 0)}>
							{isSubmitting ? "Submitting..." : "Submit"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default QueryModal;
