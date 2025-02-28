import React, { useState, useEffect } from "react";
import axios from "../Admin/utils/axiosConfig";
import { useCustomerAuth } from "./CustomerAuthContext";

const FeedbackModal = ({ service, onClose }) => {
	const [feedback, setFeedback] = useState("");
	const [rating, setRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0); // For hover effect
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useCustomerAuth();

	useEffect(() => {
		console.log("FeedbackModal - Received service:", service);
	}, [service]);

	const handleSubmit = async () => {
		if (!feedback.trim()) {
			setError("Feedback cannot be empty");
			return;
		}

		if (rating === 0) {
			setError("Please select a rating");
			return;
		}

		setLoading(true);

		try {
			const token = localStorage.getItem("customerToken");

			if (!token) {
				setError("You are not authenticated. Please log in.");
				setLoading(false);
				return;
			}

			// Make the request with the token in headers
			await axios.post(
				"http://localhost:8000/api/customers/feedback",
				{
					userId: user._id,
					serviceId: service.serviceId,
					feedback,
					rating, // Include the rating
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			alert("Feedback submitted successfully!");
			onClose();
		} catch (err) {
			console.error("Error submitting feedback:", err);
			setError("Failed to submit feedback");
		} finally {
			setLoading(false);
		}
	};

	const handleStarClick = (index) => {
		setRating(index);
	};

	const handleStarHover = (index) => {
		setHoverRating(index);
	};

	const handleStarLeave = () => {
		setHoverRating(0);
	};

	return (
		<div className='cquerymodalwrap'>
			<div className='cquerymodal'>
				<h2>Feedback for {service.serviceName}</h2>
				<div className='stars'>
					{[1, 2, 3, 4, 5].map((index) => (
						<i
							key={index}
							className={`fa-solid fa-star ${
								index <= (hoverRating || rating) ? "highlighted" : ""
							}`}
							onClick={() => handleStarClick(index)}
							onMouseEnter={() => handleStarHover(index)}
							onMouseLeave={handleStarLeave}
							style={{ cursor: "pointer" }}
						/>
					))}
				</div>
				<p>
					Selected Rating: {rating} star{rating > 1 && "s"}
				</p>
				<form>
					<textarea
						value={feedback}
						onChange={(e) => setFeedback(e.target.value)}
						placeholder='Write your feedback here...'
						className='cquerytext'
					/>
					{error && <p style={{ color: "red" }}>{error}</p>}
					<div className='btnqcont'>
						<button onClick={onClose} className='cqueryclose'>
							Close
						</button>
						<button
							onClick={handleSubmit}
							disabled={loading}
							className='cquerysubmit'>
							{loading ? "Submitting..." : "Submit"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default FeedbackModal;
