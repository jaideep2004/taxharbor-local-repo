import React, { useState, useEffect } from "react";
import {
	Box,
	Container,
	Typography,
	Grid,
	TextField,
	Button,
	Paper,
	Card,
	CardContent,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	IconButton,
	Divider,
	useMediaQuery,
	Snackbar,
	Alert,
} from "@mui/material";
import {
	ThemeProvider,
	createTheme,
	styled,
	alpha,
} from "@mui/material/styles";
import { motion } from "framer-motion";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "./contact.css";

// Theme configuration with updated colors matching the site
const theme = createTheme({
	palette: {
		primary: {
			main: "#1b321d", // Dark green
			light: "#2C6040", // Lighter green for hover states
		},
		secondary: {
			main: "#ff4081", // Pink color
		},
		background: {
			default: "#ffffff",
			paper: "#ffffff",
			light: "#f5f9f6", // Very light green background
			alternate: "#f5f5f5", // Light gray for alternating sections
		},
		accent: {
			main: "#8cc63f", // Green accent color
			light: "#c6dbce", // Light green
		},
		text: {
			primary: "#333333",
			secondary: "#666666",
		},
	},
	typography: {
		fontFamily: "'Poppins', 'Roboto', sans-serif",
		h1: {
			fontWeight: 700,
			fontSize: "2.5rem",
			"@media (max-width:600px)": {
				fontSize: "2.2rem",
			},
		},
		h2: {
			fontWeight: 700,
			fontSize: "2.2rem",
			"@media (max-width:600px)": {
				fontSize: "2rem",
			},
		},
		h3: {
			fontWeight: 600,
			fontSize: "2rem",
			"@media (max-width:600px)": {
				fontSize: "1.75rem",
			},
		},
		h4: {
			fontWeight: 600,
			fontSize: "1.5rem",
			"@media (max-width:600px)": {
				fontSize: "1.25rem",
			},
		},
		body1: {
			fontSize: "1.1rem",
			lineHeight: 1.7,
		},
		button: {
			textTransform: "none",
			fontWeight: 600,
		},
	},
});

// Styled Components
const StyledButton = styled(Button)(({ theme }) => ({
	borderRadius: "4px",
	padding: "12px 24px",
	textTransform: "uppercase",
	fontSize: "0.95rem",
	fontWeight: 600,
	letterSpacing: "0.5px",
	[theme.breakpoints.down("sm")]: {
		padding: "10px 20px",
		fontSize: "0.85rem",
	},
}));

const AnimatedContactCard = styled(Card)(({ theme }) => ({
	height: "100%",
	display: "flex",
	flexDirection: "column",
	boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
	transition: "transform 0.3s ease, box-shadow 0.3s ease",
	borderRadius: "12px",
	border: "1px solid #eaeaea",
	overflow: "hidden",
	position: "relative",
	"&:hover": {
		transform: "translateY(-8px)",
		boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
		"&::before": {
			opacity: 1,
		},
	},
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: "5px",
		background: "linear-gradient(to right, #1b321d, #8cc63f)",
		opacity: 0.8,
		transition: "opacity 0.3s ease",
	},
}));

const IconCircle = styled(Box)(({ theme }) => ({
	width: "70px",
	height: "70px",
	borderRadius: "50%",
	backgroundColor: alpha(theme.palette.primary.main, 0.1),
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	marginBottom: "1.5rem",
	transition: "all 0.3s ease",
	"& svg": {
		fontSize: "32px",
		color: theme.palette.primary.main,
		transition: "all 0.3s ease",
	},
	"&:hover": {
		backgroundColor: theme.palette.primary.main,
		transform: "scale(1.1)",
		"& svg": {
			color: "#ffffff",
		},
	},
}));

const FormPaper = styled(Paper)(({ theme }) => ({
	borderRadius: "15px",
	padding: theme.spacing(4),
	boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
	position: "relative",
	overflow: "hidden",
	"&::after": {
		content: '""',
		position: "absolute",
		top: 0,
		right: 0,
		width: "150px",
		height: "150px",
		background: `linear-gradient(135deg, ${alpha(
			theme.palette.accent.main,
			0.15
		)}, transparent)`,
		borderRadius: "0 0 0 100%",
		zIndex: 0,
	},
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
	marginBottom: theme.spacing(3),
	"& .MuiOutlinedInput-root": {
		borderRadius: "8px",
		"& fieldset": {
			borderColor: "#e0e0e0",
		},
		"&:hover fieldset": {
			borderColor: theme.palette.primary.light,
		},
		"&.Mui-focused fieldset": {
			borderColor: theme.palette.primary.main,
		},
	},
}));

const MapContainer = styled(Box)(({ theme }) => ({
	height: "500px",
	width: "100%",
	borderRadius: "15px",
	overflow: "hidden",
	boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
	position: "relative",
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: "5px",
		background: "linear-gradient(to right, #1b321d, #8cc63f)",
		opacity: 0.8,
		zIndex: 2,
	},
}));

const ContactUs = () => {
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: "",
	});
	const [submitted, setSubmitted] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Here you would typically send the form data to your backend
		console.log("Form submitted:", formData);

		// For demo purposes, just show success message
		setSubmitted(true);

		// Reset form after submission
		setFormData({
			name: "",
			email: "",
			phone: "",
			subject: "",
			message: "",
		});
	};

	const handleCloseSnackbar = () => {
		setSubmitted(false);
	};

	// Animation variants for Framer Motion
	const fadeInUp = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	};

	const staggerChildren = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.3,
			},
		},
	};

	return (
		<ThemeProvider theme={theme}>
			<Box className='contact-page'>
				{/* Hero Section with background */}
				<Box
					sx={{
						backgroundColor: "background.light",
						pt: { xs: 12, md: 16 },
						pb: 6,
						position: "relative",
						overflow: "hidden",
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundImage: "url('/images/sec7banner.jpg')",
							backgroundSize: "cover",
							backgroundPosition: "center",
							opacity: 0.15,
							zIndex: 0,
						},
					}}>
					<Container maxWidth='xl'>
						<Grid container spacing={3} alignItems='center'>
							<Grid
								item
								xs={12}
								md={6}
								sx={{ position: "relative", zIndex: 2 }}>
								<Typography
									variant='h2'
									component='h1'
									sx={{
										fontWeight: 700,
										fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
										color: "primary.main",
										mb: 2,
										position: "relative",
										"&::after": {
											content: '""',
											position: "absolute",
											bottom: -10,
											left: 0,
											width: "80px",
											height: "4px",
											background: "linear-gradient(to right, #1b321d, #8cc63f)",
										},
									}}>
									Get In Touch
								</Typography>
								<Typography
									variant='h5'
									sx={{
										fontWeight: 500,
										mb: 3,
										color: "text.secondary",
									}}>
									We're here to help and answer any questions
								</Typography>
								<Typography
									variant='body1'
									paragraph
									sx={{
										fontSize: "1.1rem",
										lineHeight: 1.7,
										mb: 4,
										maxWidth: "600px",
										color: "text.primary",
									}}>
									Whether you need help with our services, have inquiries about
									our solutions, or just want to say hello, our team is ready to
									hear from you.
								</Typography>
							</Grid>
							<Grid
								item
								xs={12}
								md={6}
								sx={{
									position: "relative",
									zIndex: 2,
									display: { xs: "none", md: "block" },
								}}>
								{/* Decorative element */}
								<Box
									component='img'
									src='/images/sec7img.png'
									alt='Contact Illustration'
									sx={{
										width: "100%",
										maxWidth: "450px",
										display: "block",
										margin: "0 auto",
									}}
								/>
							</Grid>
						</Grid>
					</Container>
				</Box>

				{/* Contact Info Cards with Animations */}
				<Container
					maxWidth='xl'
					sx={{ py: 8, position: "relative", zIndex: 1 }}>
					<Box
						component={motion.div}
						initial='hidden'
						animate='visible'
						variants={staggerChildren}>
						<Grid container spacing={4} justifyContent='center'>
							<Grid item xs={12} md={4}>
								<Box component={motion.div} variants={fadeInUp}>
									<AnimatedContactCard style={{ minHeight: "322px" }}>
										<CardContent sx={{ textAlign: "center", p: 4 }}>
											<IconCircle
												component={motion.div}
												whileHover={{ rotate: 15 }}
												sx={{ margin: "0 auto 1.5rem" }}>
												<CallIcon />
											</IconCircle>
											<Typography
												variant='h5'
												sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}>
												Call Us
											</Typography>
											<Typography
												variant='body1'
												sx={{ mb: 2, color: "text.secondary" }}>
												Our customer service team is available to help you
											</Typography>
											<Typography
												variant='h6'
												sx={{ fontWeight: 500, color: "primary.main" }}>
												+91 95376 01955
											</Typography>
											<Box
												sx={{
													mt: 2,
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}>
												{/* <AccessTimeIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} /> */}
												{/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Mon-Fri: 9:00 AM - 6:00 PM
                        </Typography> */}
											</Box>
										</CardContent>
									</AnimatedContactCard>
								</Box>
							</Grid>

							<Grid item xs={12} md={4}>
								<Box component={motion.div} variants={fadeInUp}>
									<AnimatedContactCard style={{ minHeight: "322px" }}>
										<CardContent sx={{ textAlign: "center", p: 4 }}>
											<IconCircle
												component={motion.div}
												whileHover={{ scale: 1.1 }}
												sx={{ margin: "0 auto 1.5rem" }}>
												<EmailIcon />
											</IconCircle>
											<Typography
												variant='h5'
												sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}>
												Email Us
											</Typography>
											<Typography
												variant='body1'
												sx={{ mb: 2, color: "text.secondary" }}>
												Send us an email and we'll get back to your query as
												soon as possible
											</Typography>
											<Typography
												variant='h6'
												sx={{ fontWeight: 500, color: "primary.main" }}>
												Info@thefinshelter.com
											</Typography>
										</CardContent>
									</AnimatedContactCard>
								</Box>
							</Grid>
						</Grid>
					</Box>
				</Container>

				{/* Contact Form Section */}
				<Box sx={{ backgroundColor: "background.light", py: 8 }}>
					<Container maxWidth='xl'>
						<Grid container spacing={6} alignItems='center'>
							<Grid item xs={12} md={5}>
								<Box
									component={motion.div}
									initial={{ opacity: 0, x: -50 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6, delay: 0.2 }}>
									<Typography
										variant='h3'
										sx={{
											fontWeight: 700,
											mb: 3,
											color: "primary.main",
											position: "relative",
											display: "inline-block",
											paddingBottom: "15px",
											"&::after": {
												content: '""',
												position: "absolute",
												bottom: 0,
												left: 0,
												width: "80px",
												height: "3px",
												background:
													"linear-gradient(to right, #1b321d 30%, #8cc63f 100%)",
											},
										}}>
										Send Us A Message
									</Typography>

									<Typography
										variant='body1'
										paragraph
										sx={{ mb: 4, color: "text.secondary" }}>
										Have questions or need assistance? Fill out the form, and
										one of our team members will be in touch shortly.
									</Typography>

									<Box sx={{ mb: 4 }}>
										<Typography
											variant='h6'
											sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}>
											Why Contact Us?
										</Typography>

										{[
											"Get expert financial advice",
											"Fast and reliable customer support",
											"Schedule a consultation",
											"Learn more about our services",
										].map((item, index) => (
											<Box
												key={index}
												sx={{ display: "flex", alignItems: "center", mb: 2 }}>
												<Box
													component={motion.div}
													whileHover={{ scale: 1.2, rotate: 180 }}
													transition={{ duration: 0.3 }}
													sx={{
														width: "24px",
														height: "24px",
														borderRadius: "50%",
														backgroundColor: "accent.main",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														mr: 2,
													}}>
													<Typography
														variant='body2'
														sx={{ color: "#fff", fontWeight: "bold" }}>
														✓
													</Typography>
												</Box>
												<Typography variant='body1'>{item}</Typography>
											</Box>
										))}
									</Box>
								</Box>
							</Grid>

							<Grid item xs={12} md={7}>
								<Box
									component={motion.div}
									initial={{ opacity: 0, y: 50 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5 }}>
									<FormPaper elevation={0}>
										<form onSubmit={handleSubmit}>
											<Grid container spacing={3}>
												<Grid item xs={12} md={6}>
													<StyledTextField
														label='Full Name'
														name='name'
														variant='outlined'
														fullWidth
														required
														value={formData.name}
														onChange={handleChange}
													/>
												</Grid>
												<Grid item xs={12} md={6}>
													<StyledTextField
														label='Email Address'
														name='email'
														type='email'
														variant='outlined'
														fullWidth
														required
														value={formData.email}
														onChange={handleChange}
													/>
												</Grid>
												<Grid item xs={12} md={6}>
													<StyledTextField
														label='Phone Number'
														name='phone'
														variant='outlined'
														fullWidth
														value={formData.phone}
														onChange={handleChange}
													/>
												</Grid>
												<Grid item xs={12} md={6}>
													<FormControl
														fullWidth
														variant='outlined'
														sx={{ mb: 3 }}>
														<InputLabel id='subject-label'>Subject</InputLabel>
														<Select
															labelId='subject-label'
															name='subject'
															value={formData.subject}
															onChange={handleChange}
															label='Subject'
															sx={{ borderRadius: "8px" }}>
															<MenuItem value='General Inquiry'>
																General Inquiry
															</MenuItem>
															<MenuItem value='Investment Consultation'>
																Investment Consultation
															</MenuItem>
															<MenuItem value='Tax Services'>
																Tax Services
															</MenuItem>
															<MenuItem value='Insurance'>Insurance</MenuItem>
															<MenuItem value='Partnership'>
																Partnership
															</MenuItem>
															<MenuItem value='Other'>Other</MenuItem>
														</Select>
													</FormControl>
												</Grid>
												<Grid item xs={12}>
													<StyledTextField
														label='Your Message'
														name='message'
														multiline
														rows={5}
														variant='outlined'
														fullWidth
														required
														value={formData.message}
														onChange={handleChange}
													/>
												</Grid>
												<Grid item xs={12}>
													<Box
														component={motion.div}
														whileHover={{ scale: 1.03 }}
														whileTap={{ scale: 0.97 }}>
														<StyledButton
															type='submit'
															variant='contained'
															color='primary'
															size='large'
															endIcon={<SendIcon />}
															sx={{
																mt: 2,
																py: 1.5,
																px: 4,
																background:
																	"linear-gradient(45deg, #1b321d 30%, #2C6040 90%)",
																boxShadow: "0 3px 15px rgba(27,50,29,0.3)",
															}}>
															Send Message
														</StyledButton>
													</Box>
													<Typography
														variant='body2'
														sx={{ mt: 2, color: "text.secondary" }}>
														We respect your privacy. Your information will not
														be shared.
													</Typography>
												</Grid>
											</Grid>
										</form>
									</FormPaper>
								</Box>
							</Grid>
						</Grid>
					</Container>
				</Box>

				{/* Map Section */}
				<Container maxWidth='xl' sx={{ py: 8 }}>
					<Typography
						variant='h3'
						sx={{
							fontWeight: 700,
							mb: 5,
							textAlign: "center",
							color: "primary.main",
							position: "relative",
							"&::after": {
								content: '""',
								position: "absolute",
								bottom: -15,
								left: "50%",
								transform: "translateX(-50%)",
								width: "80px",
								height: "3px",
								background:
									"linear-gradient(to right, #1b321d 30%, #8cc63f 100%)",
							},
						}}>
						Find Us Here
					</Typography>

					<Box
						component={motion.div}
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}>
						<MapContainer>
							<iframe
								src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243646.9050970772!2d78.24323223000582!3d17.412608641550744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1745861290209!5m2!1sen!2sin'
								width='100%'
								height='100%'
								style={{ border: 0 }}
								allowFullScreen=''
								loading='lazy'
								referrerPolicy='no-referrer-when-downgrade'
								title='FinShelter Office Location'
							/>
						</MapContainer>
					</Box>
				</Container>

				{/* Success Snackbar */}
				<Snackbar
					open={submitted}
					autoHideDuration={6000}
					onClose={handleCloseSnackbar}
					anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
					<Alert
						onClose={handleCloseSnackbar}
						severity='success'
						sx={{ width: "100%" }}>
						Thank you! Your message has been sent successfully. We'll get back
						to you soon.
					</Alert>
				</Snackbar>
			</Box>
		</ThemeProvider>
	);
};

export default ContactUs;
