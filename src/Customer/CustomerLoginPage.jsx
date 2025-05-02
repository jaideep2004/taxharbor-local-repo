import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./customer.css";
import { useCustomerAuth } from "./CustomerAuthContext";
import ClipLoader from "react-spinners/ClipLoader";
import { useNotification } from "../NotificationContext";

const CustomerLoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { login, error } = useCustomerAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	// const [localError, setLocalError] = useState("");
	const navigate = useNavigate(); // Hook for navigation

	const { showNotification } = useNotification();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const response = await login(email, password);

		if (response.success) {
			showNotification(
				"Login successful! Redirecting to dashboard...",
				"success"
			);
			setTimeout(() => {
				setLoading(false); // Stop loading after redirect
				navigate(`/customers/dashboard/${email}`);
			}, 2000);
		} else {
			showNotification("Login failed. Please try again.", "error");
			setLoading(false);
		}
	};

	return (
		<div className='tax-customer-login'>
			<div>
				<h1>Customer Login</h1>
				<form onSubmit={handleSubmit}>
					<div>
						<label>Email:</label>
						<input
							type='text'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email address"
							required
						/>
					</div>
					<div style={{ position: "relative" }}>
						<label>Password:</label>
						<input
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<i
							className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
							style={{
								position: "absolute",
								right: "-10px",
								top: "60px",
								cursor: "pointer",
							}}
							onClick={() => setShowPassword((prev) => !prev)}></i>
					</div>
					{/* {(localError || error) && (
						<p style={{ color: "red" }}>{localError || error}</p>
					)} */}
					<button type='submit'>Login</button>
				</form>
				{loading && (
					<div
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							background: "rgba(0,0,0,0.5)",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<ClipLoader size={50} color='#ffffff' />
					</div>
				)}
			</div>
		</div>
	);
};

export default CustomerLoginPage;
