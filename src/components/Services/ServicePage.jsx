import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../Admin/utils/axiosConfig";
import { useCustomerAuth } from "../../Customer/CustomerAuthContext";
import { useNotification } from "../../NotificationContext";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
import { ClipLoader } from "react-spinners";
import "./services.css";

const ServicePage = () => {
	const { login, fetchCustomerDashboard } = useCustomerAuth();
	const { serviceId } = useParams();
	const navigate = useNavigate();
	const [service, setService] = useState(null);
	const [customerDetails, setCustomerDetails] = useState({
		name: "",
		email: "",
		mobile: "",
		username: "",
		password: "",
		referralCode: "",
	});
	const [loading, setLoading] = useState(false);
	const { showNotification } = useNotification();

	const [selectedPackage, setSelectedPackage] = useState(null);

	const handlePackageSelect = (pkg) => {
		setSelectedPackage(pkg);
		setShowForm(true);
		setTimeout(() => {
			formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
		}, 100);
	};

	const fetchService = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				`https://195-35-45-82.sslip.io:8000/api/customers/user-services/${serviceId}`
			);
			setLoading(false);
			setService(response.data.service);
			if (response.data.service.packages && response.data.service.packages.length === 1) {
				setSelectedPackage(response.data.service.packages[0]);
			}
		} catch (error) {
			if (error.response && error.response.status === 404) {
				navigate("/not-found");
			} else {
				console.error("Error fetching service:", error);
			}
		}
	};

	useEffect(() => {
		fetchService();
	}, [serviceId, navigate]);

	const handleChange = (e) => {
		setCustomerDetails({ ...customerDetails, [e.target.name]: e.target.value });
	};

	const handleRegisterAndPay = async () => {
		setLoading(true);
		try {
			if (!selectedPackage) {
				showNotification("Please select a package before proceeding.", "error");
				setLoading(false);
				return;
			}

			const { name, email, mobile, username, password } = customerDetails;
			if (!name || !email || !mobile || !username || !password) {
				showNotification("Please fill in all required fields.", "error");
				setLoading(false);
				return;
			}

			const paymentResponse = await axios.post(
				"https://195-35-45-82.sslip.io:8000/api/customers/user-payment",
				{ amount: selectedPackage.salePrice }
			);

			const { order } = paymentResponse?.data;

			if (typeof window.Razorpay === "undefined") {
				throw new Error("Razorpay script not loaded correctly");
			}

			const options = {
				key: "rzp_test_brvO8EMMhXPsDD",
				amount: order.amount,
				currency: order.currency,
				name: "TaxHarbor",
				description: `${service?.name} - ${selectedPackage.name} Package`,
				order_id: order?.id,
				prefill: {
					name: customerDetails.name,
					email: customerDetails.email,
					contact: customerDetails.mobile,
				},
				notes: {
					serviceId: serviceId,
					packageName: selectedPackage.name
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
						setCustomerDetails({
							name: "",
							email: "",
							mobile: "",
							username: "",
							password: "",
						});
						setLoading(false);
						navigate("/");
					},
				},
				handler: async function (response) {
					try {
						const registrationResponse = await axios.post(
							"https://195-35-45-82.sslip.io:8000/api/customers/user-register",
							{
								name,
								email,
								mobile,
								username,
								password,
								referralCode: customerDetails.referralCode,
								order_id: order.id,
								selectedPackage: selectedPackage.name,
								processingDays: selectedPackage.processingDays
							}
						);

						const registeredUserId = registrationResponse?.data?.userId;
						if (!registeredUserId) {
							throw new Error("User registration failed");
						}

						const loginResponse = await login(email, password);
						if (!loginResponse.success) {
							throw new Error(`Login failed: ${loginResponse.message}`);
						}
						await fetchCustomerDashboard();
						await axios.post(
							"https://195-35-45-82.sslip.io:8000/api/customers/payment-success",
							{
								razorpay_payment_id: response.razorpay_payment_id,
								razorpay_order_id: response.razorpay_order_id,
								razorpay_signature: response.razorpay_signature,
								amount: order.amount,
								userId: registeredUserId,
								serviceId: serviceId,
								packageName: selectedPackage.name,
								processingDays: selectedPackage.processingDays,
								order_id: order.id,
							}
						);

						showNotification("Payment successful!", "success");
						setLoading(true);
						navigate(`/customers/dashboard/${email}`);
						setLoading(false);
					} catch (error) {
						console.error("Error processing payment:", error);
						setLoading(false);
						showNotification(
							error.message || "An error occurred during payment processing"
						);
					}
				},
			};

			const razorpay = new window.Razorpay(options);
			razorpay.open();
		} catch (error) {
			console.error("Error during registration or payment:", error);
			showNotification("An error occurred. Please try again.", "error");
		}
	};

	const [showForm, setShowForm] = useState(false);
	const formRef = useRef(null);
	const handleGetStarted = () => {
		setShowForm(true);
		setTimeout(() => {
			formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
		}, 100);
	};
	return (
		<div id='tax-service-page'>
			{loading && (
				<Box
					sx={{
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
				</Box>
			)}
			{service ? (
				<Box className='service-page-wrap'>
					{/* Service Name Banner */}
					<div
						className='service-banner'
						style={{
							backgroundImage:
								"url('https://frontend-taxharbor.thetaxharbor.com/images/hero8.jpeg')",
							position: "relative",
							backgroundSize: "cover",
							backgroundPosition: "center",
							padding: "6rem 0",
							color: "white",
							textAlign: "center",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							minHeight: "250px",
						}}>
						<Typography variant='h2' color='white'>
							{service.name}
						</Typography>
					</div>
					<div id='service-pg-second-section'>
						<div>
							<p>PRICING PLAN</p>
							<h1>The Best Price For You</h1>
						</div>
						<div>
							<p>
								Choose from our flexible pricing packages designed to meet your specific needs. 
								Each package includes features tailored to different requirements and budgets.
								Select the one that works best for you and get started with our services today.
							</p>
						</div>
					</div>
					{/* Package Cards */}
					<Container sx={{ py: 8 }}>
						<Grid container spacing={4} id='service-pg-cards'>
							{service?.packages?.map((pkg, index) => (
								<Grid item xs={12} sm={4} key={index}>
									<Paper
										elevation={3}
										sx={{
											p: 4,
											height: "100%",
											display: "flex",
											flexDirection: "column",
											justifyContent: "space-between",
											backgroundColor:
												selectedPackage?.name === pkg.name
													? "var(--accent)"
													: "inherit",
											transform:
												selectedPackage?.name === pkg.name
													? "translateY(-5px)"
													: "none",
											transition: "all 0.3s ease",
											border: selectedPackage?.name === pkg.name 
												? "2px solid var(--primary)" 
												: "none"
										}}>
										<div>
											<Typography variant='h5'>{pkg.name}</Typography>
											<Typography
												variant='h4'
												color='primary'
												style={{ marginTop: "5px" }}>
												₹{pkg.salePrice}
											</Typography>
											<Typography variant='body2' color='text.secondary'>
												<span style={{ textDecoration: "line-through" }}>
													₹{pkg.actualPrice}
												</span>
											</Typography>
											{pkg.features && pkg.features.map((feature, idx) => (
												<Box
													key={idx}
													sx={{
														display: "flex",
														alignItems: "center",
														marginTop: 2,
													}}>
													<CheckCircle color='primary' />
													<Typography variant='body2' ml={1}>
														{feature}
													</Typography>
												</Box>
											))}
											<Box sx={{ mt: 2 }}>
												<Typography variant="body2" color="text.secondary">
													Processing time: {pkg.processingDays} days
												</Typography>
											</Box>
										</div>
										<Button
											variant='contained'
											color='primary'
											onClick={() => handlePackageSelect(pkg)}
											sx={{ mt: 2 }}>
											Select Package
										</Button>
									</Paper>
								</Grid>
							))}
						</Grid>
					</Container>

					{/* <Container sx={{ pt: 8, pb: 2 }}>
						<Grid container spacing={4} id='service-pg-cards'>
							{service?.packages?.map((pkg, index) => (
								<Grid item xs={12} sm={4} key={index}>
									<Paper
										elevation={3}
										sx={{
											p: 4,
											height: "100%",
											display: "flex",
											flexDirection: "column",
											justifyContent: "space-between",
											backgroundColor:
												selectedPackage?.name === pkg.name
													? "var(--accent)"
													: "inherit",
											transform:
												selectedPackage?.name === pkg.name
													? "translateY(-5px)"
													: "none",
											transition: "all 0.3s ease",
										}}>
										<div>
											<Typography variant='h5'>{pkg.name}</Typography>
											<Typography
												variant='h4'
												color='primary'
												style={{ marginTop: "5px" }}>
												₹{pkg.salePrice}
											</Typography>
											<Typography variant='body2' color='text.secondary'>
												<span style={{ textDecoration: "line-through" }}>
													₹{pkg.actualPrice}
												</span>
											</Typography>
											{pkg.features.map((feature, idx) => (
												<Box
													key={idx}
													sx={{
														display: "flex",
														alignItems: "center",
														marginTop: 2,
													}}>
													<CheckCircle color='primary' />
													<Typography variant='body2' ml={1}>
														{feature}
													</Typography>
												</Box>
											))}
										</div>
										<Button
											variant='contained'
											color='primary'
											onClick={() => handlePackageSelect(pkg)}
											sx={{ mt: 2 }}>
											Select Package
										</Button>
									</Paper>
								</Grid>
							))}
						</Grid>
					</Container> */}

					{/* Banner with Heading */}
					<div
						className='banner-section'
						style={{
							backgroundImage:
								"url('https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Service-Detail-Image.jpg')",
							marginTop: "0px",
						}}>
						<Typography variant='h3'>
							Having Trouble Managing Your Finances?
						</Typography>
						<p>
							Sed tincidunt accumsan lacus nec bibendum sapien aliquet ut
							suspendisse. Pharetra finibus
							<br /> condimentum aenean lacinia sem metus Integer dapibus diam
							justo.
						</p>
						<Button variant='contained' onClick={handleGetStarted}>
							Get Started
						</Button>
						<Box
							sx={{
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark transparent overlay
								zIndex: 1, // Ensure it sits above the image but below text
							}}
						/>
					</div>
					<div id='service-pg-fifth-section'>
						<div>
							<div className='service-pg-fifth-card'>
								<div>
									<i class='fa-solid fa-user-group fa-2xl'></i>
								</div>
								<div>
									<h3>Consultation</h3>
									<p>
										Etiam quis tincidunt est et efficitur ipsum nunc mixue.
										Bibendum ut risus et nec vehicula.
									</p>
								</div>
							</div>
							<div className='service-pg-fifth-card'>
								<div>
									<i class='fa-solid fa-boxes-packing fa-2xl'></i>
								</div>
								<div>
									<h3>Choose a Package</h3>
									<p>
										Etiam quis tincidunt est et efficitur ipsum nunc mixue.
										Bibendum ut risus et nec vehicula.
									</p>
								</div>
							</div>
							<div className='service-pg-fifth-card'>
								<div>
									<i class='fa-solid fa-list-check fa-2xl'></i>
								</div>
								<div>
									<h3>Get Your Service</h3>
									<p>
										Etiam quis tincidunt est et efficitur ipsum nunc mixue.
										Bibendum ut risus et nec vehicula.
									</p>
								</div>
							</div>
						</div>
						<div id='service-pg-fifth-section-right'>
							<p>OUR STAGES</p>
							<h1>Easy Process to Manage Your Finances</h1>
							<p>
								Proin laoreet nisi vitae pharetr mattis. Etiam luctus suscipit
								velit vitae mixue ultricies. Augue molestie a etiam quis
								tincidunt est, et efficitur ipsum nunc bibendum ut risus et
								vehicula proin tempus tellus diam laoreet justo donec tempus.
							</p>
						</div>
					</div>
					{/* Testimonials */}
					<Container sx={{ py: 10 }}>
						<Grid container spacing={4} id='service-testi'>
							<Grid item xs={12} sm={4}>
								<Paper
									elevation={3}
									sx={{
										p: 4,
										height: "100%",
										display: "flex",
										flexDirection: "column",
										justifyContent: "space-between",
										border: "1px solid var(--primary)",
									}}>
									<Typography variant='body1'>
										"Etiam quis tincidunt est efficitu. Ipsum nunc bibendum ut
										risus et vehicula proin tempus auctor."
									</Typography>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											marginTop: 2,
										}}>
										<img
											src='https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Service-Detail-Image.jpg'
											style={{
												borderRadius: "50%",
												width: "50px",
												height: "50px",
											}}
										/>
										<Box ml={2}>
											<Typography variant='body2' fontWeight='bold'>
												Matthew Patel
											</Typography>
											<Typography variant='caption' color='text.secondary'>
												Consultant
											</Typography>
										</Box>
										<i
											class='fa-solid fa-quote-right fa-2xl'
											style={{ marginLeft: "80px" }}></i>
									</Box>
								</Paper>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Paper
									elevation={3}
									sx={{
										p: 4,
										height: "100%",
										display: "flex",
										flexDirection: "column",
										justifyContent: "space-between",
										border: "1px solid var(--primary)",
									}}>
									<Typography variant='body1'>
										"Etiam quis tincidunt est efficitu. Ipsum nunc bibendum ut
										risus et vehicula proin tempus auctor."
									</Typography>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											marginTop: 2,
										}}>
										<img
											src='https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Service-Detail-Image.jpg'
											style={{
												borderRadius: "50%",
												width: "50px",
												height: "50px",
											}}
										/>
										<Box ml={2}>
											<Typography variant='body2' fontWeight='bold'>
												Matthew Patel
											</Typography>
											<Typography variant='caption' color='text.secondary'>
												Consultant
											</Typography>
										</Box>
										<i
											class='fa-solid fa-quote-right fa-2xl'
											style={{ marginLeft: "80px" }}></i>
									</Box>
								</Paper>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Paper
									elevation={3}
									sx={{
										p: 4,
										height: "100%",
										display: "flex",
										flexDirection: "column",
										justifyContent: "space-between",
										border: "1px solid var(--primary)",
									}}>
									<Typography variant='body1'>
										"Etiam quis tincidunt est efficitu. Ipsum nunc bibendum ut
										risus et vehicula proin tempus auctor."
									</Typography>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											marginTop: 2,
										}}>
										<img
											src='https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Service-Detail-Image.jpg'
											style={{
												borderRadius: "50%",
												width: "50px",
												height: "50px",
											}}
										/>
										<Box ml={2}>
											<Typography variant='body2' fontWeight='bold'>
												Matthew Patel
											</Typography>
											<Typography variant='caption' color='text.secondary'>
												Consultant
											</Typography>
										</Box>
										<i
											class='fa-solid fa-quote-right fa-2xl'
											style={{ marginLeft: "80px" }}></i>
									</Box>
								</Paper>
							</Grid>
							{/* Add two more testimonial cards */}
						</Grid>
					</Container>

					{/* Registration Form Section */}
					{showForm && (
						<Box ref={formRef}>
							<div className='service-page-wrap'>
								<div className='service-content'>
									<div className='service-form'>
										<h1>Register Today!</h1>
										{selectedPackage ? (
											<Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(149, 184, 162, 0.1)', borderRadius: 2 }}>
												<Typography variant="h6" sx={{ mb: 1, color: 'var(--primary)' }}>
													Selected Package: {selectedPackage.name}
												</Typography>
												<Typography variant="body1">
													Price: <span style={{ textDecoration: "line-through" }}>₹{selectedPackage.actualPrice}</span> ₹{selectedPackage.salePrice}
												</Typography>
												<Typography variant="body2" sx={{ mt: 1 }}>
													Processing Time: {selectedPackage.processingDays} days
												</Typography>
											</Box>
										) : (
											<Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 2 }}>
												<Typography variant="body1" color="warning.main">
													Please select a package before proceeding with registration.
												</Typography>
											</Box>
										)}
										
										<div className='sform-div'>
											<div>
												<label htmlFor=''>First Name</label>
												<input
													type='text'
													name='name'
													placeholder='Name'
													onChange={handleChange}
												/>
											</div>
											<div>
												<label htmlFor=''>Last Name</label>
												<input
													type='text'
													name='lastname'
													placeholder='Name'
													onChange={handleChange}
												/>
											</div>
										</div>
										<div className='sform-div'>
											<div>
												<label htmlFor=''>Email</label>
												<input
													type='email'
													name='email'
													placeholder='Email'
													onChange={handleChange}
												/>
											</div>
											<div>
												<label htmlFor=''>Mobile</label>
												<input
													type='text'
													name='mobile'
													placeholder='Mobile'
													onChange={handleChange}
												/>
											</div>
										</div>
										<div className='sform-div'>
											<div>
												<label htmlFor=''>Username</label>
												<input
													type='text'
													name='username'
													placeholder='Username'
													onChange={handleChange}
												/>
											</div>
											<div>
												<label htmlFor=''>Password</label>
												<input
													type='password'
													name='password'
													placeholder='Password'
													onChange={handleChange}
												/>
											</div>
										</div>
										<div className='sform-div'>
											<div>
												<label htmlFor=''>Referral Code (Optional)</label>
												<input
													type='text'
													name='referralCode'
													placeholder='Referral Code'
													onChange={handleChange}
												/>
											</div>
										</div>

										<button 
											onClick={handleRegisterAndPay}
											disabled={!selectedPackage}
											style={{ opacity: selectedPackage ? 1 : 0.7 }}
										>
											<h4>
												{selectedPackage ? (
													<>
														<span style={{ textDecoration: "line-through" }}>
															₹{selectedPackage.actualPrice}
														</span>{" "}
														₹{selectedPackage.salePrice} <br />
													</>
												) : (
													"Select a package"
												)}
											</h4>{" "}
											Register & Pay
										</button>
									</div>
								</div>
							</div>
						</Box>
					)}
				</Box>
			) : (
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
					<ClipLoader size={50} color='var(--primary)' />
				</Box>
			)}
		</div>
	);
};

export default ServicePage;
