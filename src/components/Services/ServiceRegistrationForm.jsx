import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Admin/utils/axiosConfig";
import { useCustomerAuth } from "../../Customer/CustomerAuthContext";
import { useNotification } from "../../NotificationContext";
import {
	Box,
	Container,
	Typography,
	TextField,
	Button,
	Grid,
	Card,
	CardContent,
	Divider,
	Paper,
	CircularProgress,
	RadioGroup,
	Radio,
	FormControlLabel,
	Link,
} from "@mui/material";
import { CheckCircle, ArrowBack } from "@mui/icons-material";
import "./services.css";

const ServiceRegistrationForm = ({
	service,
	selectedPackage,
	isLeadService = false,
}) => {
	const navigate = useNavigate();
	const { login, fetchCustomerDashboard } = useCustomerAuth();
	const { showNotification } = useNotification();
	const [loading, setLoading] = useState(false);

	const [customerDetails, setCustomerDetails] = useState({
		name: "",
		lastname: "",
		email: "",
		mobile: "",
		username: "",
		password: "",
		referralCode: "",
		message: "",
	});

	const handleChange = (e) => {
		setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
	};

	const handleRegisterAndPay = async () => {
		setLoading(true);
		try {
			// Field validation
			const { name, email, mobile, username, password } = customerDetails;
			if (!name || !email || !mobile || !username || !password) {
				showNotification("Please fill in all required fields.", "error");
				setLoading(false);
				return;
			}

			// Determine the price to use (either from selected package or service)
			const basePrice = selectedPackage
				? selectedPackage.salePrice || selectedPackage.actualPrice
				: service.salePrice;

			if (!basePrice) {
				showNotification("Service price details are missing.", "error");
				setLoading(false);
				return;
			}

			// Calculate GST amount
			const gstRate = service.gstRate || 18; // Use service's gstRate or default to 18%
			const gstAmount = (basePrice * gstRate) / 100;
			const totalAmount = basePrice + gstAmount;

			// Create order
			const paymentResponse = await axios.post(
				"https://195-35-45-82.sslip.io:8000/api/customers/user-payment",
				{ amount: totalAmount }
			);

			const { order } = paymentResponse?.data;

			// Validate Razorpay script
			if (typeof window.Razorpay === "undefined") {
				throw new Error("Razorpay script not loaded correctly");
			}

			// Configure Razorpay options
			const options = {
				key: "rzp_test_brvO8EMMhXPsDD",
				amount: order.amount,
				currency: order.currency,
				name: "FinShelter",
				description: `${service?.name} ${
					selectedPackage ? `- ${selectedPackage.name}` : ""
				} (Incl. ${gstRate}% GST)`,
				order_id: order?.id,
				prefill: {
					name: customerDetails.name,
					email: customerDetails.email,
					contact: customerDetails.mobile,
				},
				notes: {
					serviceId: service._id,
					gstRate: gstRate,
					gstAmount: gstAmount,
					basePrice: basePrice,
				},
				theme: {
					color: "#95b8a2",
				},
				modal: {
					ondismiss: function () {
						showNotification(
							"Payment cancelled. You have not been registered.",
							"error"
						);
						setLoading(false);
					},
				},
				handler: async function (response) {
					try {
						// First register the user
						const registrationResponse = await axios.post(
							"https://195-35-45-82.sslip.io:8000/api/customers/user-register",
							{
								name: customerDetails.name,
								lastname: customerDetails.lastname,
								email: customerDetails.email,
								mobile: customerDetails.mobile,
								username: customerDetails.username,
								password: customerDetails.password,
								referralCode: customerDetails.referralCode,
								order_id: order.id,
							}
						);

						const registeredUserId = registrationResponse?.data?.userId;
						if (!registeredUserId) {
							throw new Error("User registration failed");
						}

						// Log in the user
						const loginResponse = await login(
							customerDetails.email,
							customerDetails.password
						);
						if (!loginResponse.success) {
							throw new Error(`Login failed: ${loginResponse.message}`);
						}
						await fetchCustomerDashboard();

						// Save payment details
						await axios.post(
							"https://195-35-45-82.sslip.io:8000/api/customers/payment-success",
							{
								razorpay_payment_id: response.razorpay_payment_id,
								razorpay_order_id: response.razorpay_order_id,
								razorpay_signature: response.razorpay_signature,
								amount: order.amount,
								userId: registeredUserId,
								serviceId: service._id,
								packageId: selectedPackage ? selectedPackage._id : undefined,
								order_id: order.id,
								gstRate: gstRate,
								gstAmount: gstAmount,
								basePrice: basePrice,
							}
						);

						showNotification(
							"Payment successful! Welcome to FinShelter.",
							"success"
						);
						navigate(`/customers/dashboard/${customerDetails.email}`);
					} catch (error) {
						console.error("Error processing payment:", error);
						setLoading(false);
						showNotification(
							error.message || "An error occurred during payment processing"
						);
					}
				},
			};

			// Initialize Razorpay
			const razorpay = new window.Razorpay(options);
			razorpay.open();
		} catch (error) {
			console.error("Error during registration or payment:", error);
			showNotification("An error occurred. Please try again.", "error");
			setLoading(false);
		}
	};

	const handleSubmitLead = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Field validation
			const { name, email, mobile, message } = customerDetails;
			if (!name || !email || !mobile) {
				showNotification(
					"Please provide your name, email, and mobile number.",
					"error"
				);
				setLoading(false);
				return;
			}

			// Create lead
			await axios.post("https://195-35-45-82.sslip.io:8000/api/customers/lead", {
				name,
				email,
				mobile,
				serviceId: service._id,
				message:
					message ||
					`Interest in ${service.name} ${
						selectedPackage ? `- Package: ${selectedPackage.name}` : ""
					}`,
				source: "website",
			});

			showNotification(
				"Thank you for your interest! Our team will contact you soon.",
				"success"
			);
			setLoading(false);

			// Add a delay before navigation to allow users to see the notification
			setTimeout(() => {
				// Reset form and navigate back to service
				navigate(`/services/${service._id}`);
			}, 2500); // 2 second delay
		} catch (error) {
			console.error("Error submitting lead:", error);
			showNotification("An error occurred. Please try again.", "error");
			setLoading(false);
		}
	};

	const handleCancel = () => {
		navigate(`/services/${service._id}`);
	};

	return (
		<Container maxWidth='lg' sx={{ mb: 4 }}>
			{loading && (
				<Box
					sx={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						background: "rgba(27, 50, 29, 0.7)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 9999,
					}}>
					<CircularProgress size={60} sx={{ color: "#95b8a2" }} />
				</Box>
			)}

			<Button
				startIcon={<ArrowBack />}
				onClick={handleCancel}
				sx={{
					mb: 2,
					color: "#1b321d",
					borderColor: "#1b321d",
					"&:hover": {
						backgroundColor: "rgba(149, 184, 162, 0.1)",
						borderColor: "#1b321d",
					},
				}}
				variant='outlined'>
				Back to Service
			</Button>

			<Grid container spacing={4}>
				{/* Service Summary */}
				<Grid item xs={12} md={4}>
					<Card
						elevation={0}
						sx={{
							height: "100%",
							borderRadius: "16px",
							overflow: "hidden",
							border: "1px solid rgba(149, 184, 162, 0.3)",
							transition: "all 0.3s ease",
							boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
							background: "linear-gradient(145deg, #ffffff, #f5f9f7)",
						}}>
						<CardContent sx={{ p: 3 }}>
							<Typography
								variant='h5'
								gutterBottom
								sx={{
									color: "#1b321d",
									fontWeight: 700,
									pb: 1,
								}}>
								Service Summary
							</Typography>
							<Divider
								sx={{ mb: 2, borderColor: "rgba(149, 184, 162, 0.4)" }}
							/>

							<Typography
								variant='h6'
								gutterBottom
								sx={{ color: "#1b321d", fontWeight: 600 }}>
								{service?.name}
							</Typography>

							{selectedPackage ? (
								<>
									<Typography
										variant='subtitle1'
										gutterBottom
										sx={{
											color: "#1b321d",
											opacity: 0.9,
											fontWeight: 500,
											mb: 2,
										}}>
										Selected Package: {selectedPackage.name}
									</Typography>

									<Box sx={{ my: 2 }}>
										<Typography
											variant='h4'
											gutterBottom
											sx={{
												color: "#1b321d",
												fontWeight: 700,
											}}>
											₹{selectedPackage.salePrice}
											{selectedPackage.actualPrice &&
												selectedPackage.actualPrice >
													selectedPackage.salePrice && (
													<Typography
														component='span'
														sx={{
															textDecoration: "line-through",
															color: "text.secondary",
															fontSize: "1rem",
															ml: 1,
														}}>
														₹{selectedPackage.actualPrice}
													</Typography>
												)}
										</Typography>

										{/* GST Information */}
										<Box
											sx={{
												mt: 1,
												mb: 2,
												p: 2,
												bgcolor: "rgba(198, 219, 206, 0.2)",
												borderRadius: 2,
												border: "1px solid rgba(149, 184, 162, 0.2)",
											}}>
											<Typography
												variant='body2'
												sx={{
													display: "flex",
													justifyContent: "space-between",
													mb: 0.5,
												}}>
												<span>Base Price:</span>
												<span>₹{selectedPackage.salePrice}</span>
											</Typography>
											<Typography
												variant='body2'
												sx={{
													display: "flex",
													justifyContent: "space-between",
													mb: 0.5,
												}}>
												<span>GST ({service.gstRate || 18}%):</span>
												<span>
													₹
													{(
														(selectedPackage.salePrice *
															(service.gstRate || 18)) /
														100
													).toFixed(2)}
												</span>
											</Typography>
											<Divider
												sx={{ my: 1, borderColor: "rgba(149, 184, 162, 0.4)" }}
											/>
											<Typography
												variant='body1'
												fontWeight='bold'
												sx={{
													display: "flex",
													justifyContent: "space-between",
													color: "#1b321d",
												}}>
												<span>Total Amount:</span>
												<span>
													₹
													{(
														selectedPackage.salePrice +
														(selectedPackage.salePrice *
															(service.gstRate || 18)) /
															100
													).toFixed(2)}
												</span>
											</Typography>
										</Box>
									</Box>

									<Typography
										variant='subtitle2'
										gutterBottom
										sx={{
											color: "#1b321d",
											fontWeight: 600,
											mt: 3,
										}}>
										Features:
									</Typography>
									{selectedPackage.features &&
										selectedPackage.features.map((feature, idx) => (
											<Box
												key={idx}
												sx={{
													display: "flex",
													alignItems: "flex-start",
													mb: 1,
												}}>
												<CheckCircle
													sx={{
														fontSize: 16,
														color: "#1b321d",
														mr: 1,
														mt: 0.5,
													}}
												/>
												<Typography
													variant='body2'
													sx={{
														color: "#1b321d",
														opacity: 0.9,
													}}>
													{feature}
												</Typography>
											</Box>
										))}
								</>
							) : (
								<>
									<Typography variant='body1' sx={{ mb: 2 }}>
										{service?.description ||
											"Complete the form to register for this service."}
									</Typography>

									{service?.salePrice && (
										<Box
											sx={{
												mt: 2,
												mb: 2,
												p: 1.5,
												bgcolor: "background.paper",
												borderRadius: 1,
												border: "1px solid",
												borderColor: "divider",
											}}>
											<Typography
												variant='body2'
												sx={{
													display: "flex",
													justifyContent: "space-between",
													mb: 0.5,
												}}>
												<span>Base Price:</span>
												<span>₹{service.salePrice}</span>
											</Typography>
											<Typography
												variant='body2'
												sx={{
													display: "flex",
													justifyContent: "space-between",
													mb: 0.5,
												}}>
												<span>GST ({service.gstRate || 18}%):</span>
												<span>
													₹
													{(
														(service.salePrice * (service.gstRate || 18)) /
														100
													).toFixed(2)}
												</span>
											</Typography>
											<Divider sx={{ my: 1 }} />
											<Typography
												variant='body1'
												fontWeight='bold'
												sx={{
													display: "flex",
													justifyContent: "space-between",
												}}>
												<span>Total Amount:</span>
												<span>
													₹
													{(
														service.salePrice +
														(service.salePrice * (service.gstRate || 18)) / 100
													).toFixed(2)}
												</span>
											</Typography>
										</Box>
									)}
								</>
							)}

							{!isLeadService && (
								<Box sx={{ mt: 4 }}>
									<Typography
										variant='subtitle2'
										sx={{
											color: "#1b321d",
											opacity: 0.7,
											fontSize: "0.85rem",
											fontStyle: "italic",
										}}>
										* Payment will be processed securely via Razorpay
									</Typography>
								</Box>
							)}
						</CardContent>
					</Card>
				</Grid>

				{/* Registration Form */}
				<Grid item xs={12} md={8}>
					<Paper
						elevation={0}
						sx={{
							p: 4,
							borderRadius: "16px",
							border: "1px solid rgba(149, 184, 162, 0.3)",
							boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
							background: "#ffffff",
						}}>
						<Typography
							variant='h5'
							gutterBottom
							sx={{
								color: "#1b321d",
								fontWeight: 700,
							}}>
							{isLeadService
								? "Register Your Interest"
								: "Complete Registration"}
						</Typography>
						<Divider sx={{ mb: 3, borderColor: "rgba(149, 184, 162, 0.4)" }} />

						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='First Name'
									name='name'
									value={customerDetails.name}
									onChange={handleChange}
									required
									margin='normal'
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Last Name'
									name='lastname'
									value={customerDetails.lastname}
									onChange={handleChange}
									margin='normal'
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Email'
									name='email'
									type='email'
									value={customerDetails.email}
									onChange={handleChange}
									required
									margin='normal'
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Mobile Number'
									name='mobile'
									value={customerDetails.mobile}
									onChange={handleChange}
									required
									margin='normal'
								/>
							</Grid>

							{!isLeadService && (
								<>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label='Username'
											name='username'
											value={customerDetails.username}
											onChange={handleChange}
											required
											margin='normal'
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label='Password'
											name='password'
											type='password'
											value={customerDetails.password}
											onChange={handleChange}
											required
											margin='normal'
										/>
									</Grid>
								</>
							)}

							<Grid item xs={12}>
								<TextField
									fullWidth
									label='Referral Code (Optional)'
									name='referralCode'
									value={customerDetails.referralCode}
									onChange={handleChange}
									margin='normal'
								/>
							</Grid>

							{isLeadService && (
								<Grid item xs={12}>
									<TextField
										fullWidth
										label='Message (Optional)'
										name='message'
										value={customerDetails.message}
										onChange={handleChange}
										multiline
										rows={4}
										margin='normal'
										placeholder='Tell us more about your requirements...'
									/>
								</Grid>
							)}
						</Grid>

						<Box
							sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
							<Button
								variant='outlined'
								onClick={handleCancel}
								size='large'
								sx={{
									borderColor: "#1b321d",
									color: "#1b321d",
									px: 3,
									"&:hover": {
										backgroundColor: "rgba(149, 184, 162, 0.1)",
										borderColor: "#1b321d",
									},
								}}>
								Cancel
							</Button>

							<Button
								variant='contained'
								size='large'
								onClick={
									isLeadService ? handleSubmitLead : handleRegisterAndPay
								}
								disabled={loading}
								sx={{
									bgcolor: "#1b321d",
									color: "#ffffff",
									px: 4,
									"&:hover": {
										bgcolor: "#28482d",
									},
									"&:disabled": {
										bgcolor: "rgba(27, 50, 29, 0.5)",
									},
								}}>
								{isLeadService ? "Submit Inquiry" : "Register & Pay"}
							</Button>
						</Box>

						<Box sx={{ mt: 3, textAlign: "center" }}>
							<Typography
								variant='body2'
								sx={{ color: "rgba(27, 50, 29, 0.7)" }}>
								By continuing, you agree to our{" "}
								<Link
									href='/terms'
									target='_blank'
									sx={{
										color: "#1b321d",
										fontWeight: 500,
										textDecoration: "none",
										borderBottom: "1px dashed",
										"&:hover": {
											color: "#28482d",
										},
									}}>
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link
									href='/privacy'
									target='_blank'
									sx={{
										color: "#1b321d",
										fontWeight: 500,
										textDecoration: "none",
										borderBottom: "1px dashed",
										"&:hover": {
											color: "#28482d",
										},
									}}>
									Privacy Policy
								</Link>
							</Typography>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Container>
	);
};

export default ServiceRegistrationForm;
