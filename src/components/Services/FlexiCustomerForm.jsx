import React, { useState, useEffect } from "react";
import {
	Box,
	Container,
	Paper,
	Typography,
	TextField,
	Button,
	MenuItem,
	Grid,
	CircularProgress,
	Alert,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../../Admin/utils/axiosConfig";

const FlexiCustomerForm = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [services, setServices] = useState([]);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		mobile: "",

		password: "",
		leadSource: "flexfunneli",
	});

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const response = await axios.get(
					"https://195-35-45-82.sslip.io:8000/api/customers/user-services"
				);
				setServices(response.data.services);
			} catch (error) {
				console.error("Error fetching services:", error);
			}
		};
		fetchServices();
	}, []);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	// Frontend: FlexiCustomerForm component
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Validate required fields
			const requiredFields = ["name", "email", "mobile", "password"];
			const missingFields = requiredFields.filter((field) => !formData[field]);

			if (missingFields.length > 0) {
				throw new Error(
					`Please fill in all required fields: ${missingFields.join(", ")}`
				);
			}

			const response = await axios.post(
				"https://195-35-45-82.sslip.io:8000/api/customers/flexi-register",
				formData
			);

			if (response.data.email) {
				navigate(`/customers/dashboard/${response.data.email}`, {
					state: {
						message:
							"Registration successful! Our team will assign your service within 24 hours.",
						email: formData.email,
					},
				});
			}
		} catch (error) {
			console.error("Registration error:", error);
			// Here you should show the error to the user somehow, maybe using a notification system
			alert(error.message || "Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth='md'>
			<Box sx={{ mt: 16, mb: 4 }}>
				<Paper elevation={3} sx={{ p: 4 }}>
					<Typography variant='h4' gutterBottom align='center' sx={{ mb: 4 }}>
						Register Today
					</Typography>

					<Typography variant='body1' sx={{ mb: 3 }} align='center'>
						Please fill in your details to complete the registration process
					</Typography>

					<form onSubmit={handleSubmit}>
						<Grid container spacing={3}>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									label='Full Name'
									name='name'
									value={formData.name}
									onChange={handleChange}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									label='Email'
									name='email'
									type='email'
									value={formData.email}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									label='Password'
									name='password'
									type='password'
									value={formData.password}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									label='Mobile Number'
									name='mobile'
									value={formData.mobile}
									onChange={handleChange}
								/>
							</Grid>

							<Grid item xs={12}>
								<Button
									type='submit'
									fullWidth
									variant='contained'
									size='large'
									disabled={loading}
									sx={{
										mt: 2,
										bgcolor: "#95b8a2",
										"&:hover": {
											bgcolor: "#7a9985",
										},
									}}>
									{loading ? (
										<CircularProgress size={24} sx={{ color: "white" }} />
									) : (
										"Register"
									)}
								</Button>
							</Grid>
						</Grid>
					</form>
					<p style={{ textAlign: "center", marginTop: "20px" }}>
						Already Have An Account?
						<NavLink to='/customers/login' style={{ marginLeft: "10px" }}>
							Login
						</NavLink>
					</p>
				</Paper>
			</Box>
		</Container>
	);
};

export default FlexiCustomerForm;
