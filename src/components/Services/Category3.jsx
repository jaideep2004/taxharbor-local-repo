import React, { useState } from "react";
import {
	Box,
	Container,
	Typography,
	Grid,
	Button,
	TextField,
	Card,
	CardContent,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
	Slider,
	InputAdornment,
	FormControl,
	Select,
	MenuItem,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalculateIcon from "@mui/icons-material/Calculate";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoneyIcon from "@mui/icons-material/Money";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DescriptionIcon from "@mui/icons-material/Description";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import GroupIcon from "@mui/icons-material/Group";
import SavingsIcon from "@mui/icons-material/Savings";

// Theme configuration
const theme = createTheme({
	palette: {
		primary: {
			main: "#1b321d",
		},
		secondary: {
			main: "#ffffff",
		},
		background: {
			default: "#ffffff",
			paper: "#ffffff",
		},
		text: {
			primary: "#1b321d",
		},
	},
	typography: {
		fontFamily: "'Inter', sans-serif",
		h1: {
			fontWeight: 700,
			fontSize: "3.5rem",
			// Make h1 responsive
			"@media (max-width:600px)": {
				fontSize: "2.5rem",
			},
		},
		h2: {
			fontWeight: 700,
			fontSize: "2.5rem",
			// Make h2 responsive
			"@media (max-width:600px)": {
				fontSize: "2rem",
			},
		},
		h3: {
			fontWeight: 600,
			fontSize: "2rem",
			// Make h3 responsive
			"@media (max-width:600px)": {
				fontSize: "1.75rem",
			},
		},
		h4: {
			fontWeight: 600,
			fontSize: "1.5rem",
			// Make h4 responsive
			"@media (max-width:600px)": {
				fontSize: "1.25rem",
			},
		},
		body1: {
			fontSize: "1.1rem",
		},
	},
});

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
	backgroundColor: "#c6dbce",
	padding: "140px 0",
	position: "relative",
	// Make hero section responsive
	[theme.breakpoints.down("sm")]: {
		// padding: "80px 0",
	},
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background: "url('./images/category3.png')",
		opacity: "0.05",
	},
}));

const StyledButton = styled(Button)(({ theme }) => ({
	borderRadius: "50px",
	padding: "12px 30px",
	textTransform: "none",
	fontSize: "1.1rem",
	[theme.breakpoints.down("sm")]: {
		padding: "10px 20px",
		fontSize: "1rem",
	},
}));

const StatsSection = styled(Box)(({ theme }) => ({
	padding: "60px 0",
	backgroundColor: "#95b8a2",
	[theme.breakpoints.down("sm")]: {
		padding: "40px 0",
	},
}));

const StatsCard = styled(Box)(({ theme }) => ({
	textAlign: "center",
	color: "#ffffff",
	// marginBottom: "50px",
}));

const PersonalLoanPage = () => {
	const [loanAmount, setLoanAmount] = useState(50000);
	const [loanTerm, setLoanTerm] = useState(12);
	const [interestRate, setInterestRate] = useState(8.0);
	const [expanded, setExpanded] = useState(false);
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const calculateMonthlyPayment = () => {
		const rate = interestRate / 100 / 12;
		const n = loanTerm;
		const presentValue = loanAmount;
		const monthlyPayment =
			(presentValue * rate * Math.pow(1 + rate, n)) /
			(Math.pow(1 + rate, n) - 1);
		return monthlyPayment.toFixed(2);
	};

	const faqs = [
		{
			question: "What can I use a personal loan for?",
			answer:
				"Personal loans can be used for various purposes including debt consolidation, home improvements, major purchases, medical expenses, or unexpected costs.",
		},
		{
			question: "How long does the approval process take?",
			answer:
				"Most applications are reviewed within 24 hours, with funds typically available within 1-2 business days after approval.",
		},
		{
			question: "Is there a prepayment penalty?",
			answer:
				"No, we do not charge any prepayment penalties. You can pay off your loan early without additional fees.",
		},
		{
			question: "What is the minimum credit score required?",
			answer:
				"Generally, we require a minimum credit score of 600. However, we consider multiple factors when evaluating loan applications.",
		},
		{
			question: "How much can I borrow?",
			answer:
				"Personal loan amounts range from $1,000 to $100,000, depending on your creditworthiness and ability to repay.",
		},
	];

	return (
		<ThemeProvider theme={theme}>
			<Box>
				{/* Hero Section */}
				<HeroSection>
					<Container>
						<Grid container spacing={isMobile ? 4 : 6} alignItems='center'>
							<Grid item xs={12} md={6}>
								<Box
									sx={{
										pt: { xs: 0, md: 4 },
										textAlign: { xs: "center", md: "left" },
									}}>
									<Typography variant='h1' gutterBottom color='primary'>
										Need a Personal Loan?
									</Typography>
									<Typography
										variant='h5'
										paragraph
										sx={{ mb: 4, color: "#1b321d" }}>
										Low fixed rates starting at{" "}
										<span
											style={{
												color: "black",
												fontSize: isMobile ? "22px" : "26px",
											}}>
											6.99%
										</span>{" "}
										APR and flexible terms to fit your budget.
									</Typography>
									<Box
										sx={{
											display: "flex",
											flexDirection: { xs: "column", sm: "row" },
											gap: 2,
											justifyContent: { xs: "center", md: "flex-start" },
										}}>
										<StyledButton
											variant='contained'
											color='primary'
											endIcon={<ArrowForwardIcon />}
											fullWidth={isMobile}>
											Apply Now
										</StyledButton>
										<StyledButton
											variant='outlined'
											color='primary'
											fullWidth={isMobile}>
											Check Your Rate
										</StyledButton>
									</Box>
								</Box>
							</Grid>
							<Grid item xs={12} md={6}>
								<Paper
									elevation={3}
									sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
									<Typography variant='h4' gutterBottom color='primary'>
										Calculate Your Payment
									</Typography>
									<Box sx={{ mt: 3 }}>
										<Grid container spacing={2}>
											<Grid item xs={12} md={6}>
												<Typography gutterBottom>Loan Amount</Typography>
												<Slider
													value={loanAmount}
													onChange={(e, newValue) => setLoanAmount(newValue)}
													min={1000}
													max={100000}
													step={1000}
													valueLabelDisplay='auto'
													sx={{ mb: 1 }}
												/>
												<TextField
													fullWidth
													value={loanAmount}
													onChange={(e) =>
														setLoanAmount(Number(e.target.value))
													}
													InputProps={{
														startAdornment: (
															<InputAdornment position='start'>
																₹
															</InputAdornment>
														),
													}}
													sx={{ mb: 3 }}
												/>
											</Grid>

											<Grid item xs={12} md={6}>
												<Typography gutterBottom>Interest Rate (%)</Typography>
												<Slider
													value={interestRate}
													onChange={(e, newValue) => setInterestRate(newValue)}
													min={5}
													max={20}
													step={0.1}
													valueLabelDisplay='auto'
													sx={{ mb: 1 }}
												/>
												<TextField
													fullWidth
													value={interestRate}
													onChange={(e) =>
														setInterestRate(Number(e.target.value))
													}
													InputProps={{
														endAdornment: (
															<InputAdornment position='end'>%</InputAdornment>
														),
													}}
													sx={{ mb: 3 }}
												/>
											</Grid>

											<Grid item xs={12}>
												<Typography gutterBottom>Loan Term</Typography>
												<FormControl fullWidth sx={{ mb: 3 }}>
													<Select
														value={loanTerm}
														onChange={(e) => setLoanTerm(e.target.value)}>
														<MenuItem value={6}>6 months</MenuItem>
														<MenuItem value={12}>12 months</MenuItem>
														<MenuItem value={18}>18 months</MenuItem>
														<MenuItem value={24}>24 months</MenuItem>
														<MenuItem value={36}>36 months</MenuItem>
														<MenuItem value={48}>48 months</MenuItem>
														<MenuItem value={60}>60 months</MenuItem>
													</Select>
												</FormControl>
											</Grid>
										</Grid>

										<Box
											sx={{ bgcolor: "#f5f5f5", p: 3, borderRadius: 2, mb: 3 }}>
											<Typography variant='h6' gutterBottom>
												Monthly Payment
											</Typography>
											<Typography variant='h3' color='primary'>
												₹{calculateMonthlyPayment()}
											</Typography>
										</Box>

										<StyledButton
											variant='contained'
											color='primary'
											fullWidth
											endIcon={<CalculateIcon />}>
											Apply Now
										</StyledButton>
									</Box>
								</Paper>
							</Grid>
						</Grid>
					</Container>
				</HeroSection>

				{/* Stats Section */}
				<StatsSection>
					<Container>
						<Grid container spacing={4}>
							{[
								{
									icon: <AutoGraphIcon sx={{ fontSize: 40 }} />,
									number: "10.5M+",
									text: "Loans Funded",
								},
								{
									icon: <GroupIcon sx={{ fontSize: 40 }} />,
									number: "98%",
									text: "Customer Satisfaction",
								},
								{
									icon: <SavingsIcon sx={{ fontSize: 40 }} />,
									number: "$250M+",
									text: "Total Savings",
								},
							].map((stat, index) => (
								<Grid item xs={12} md={4} key={index}>
									<StatsCard>
										{stat.icon}
										<Typography variant='h2' sx={{ my: 2 }}>
											{stat.number}
										</Typography>
										<Typography variant='h5'>{stat.text}</Typography>
									</StatsCard>
								</Grid>
							))}
						</Grid>
					</Container>
				</StatsSection>

				{/* Features Section */}
				<Box sx={{ py: { xs: 5, md: 8 }, bgcolor: "#ffffff" }}>
					<Container>
						<Typography
							variant='h2'
							textAlign='center'
							gutterBottom
							color='primary'>
							Why Choose Our Personal Loans?
						</Typography>
						<Grid container spacing={4} sx={{ mt: 4 }}>
							{[
								{
									icon: <MoneyIcon sx={{ fontSize: 40 }} />,
									title: "Low Fixed Rates",
									description:
										"Competitive interest rates starting from 6.99% APR",
								},
								{
									icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
									title: "Fast Funding",
									description:
										"Get funds in as little as 24 hours after approval",
								},
								{
									icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
									title: "No Hidden Fees",
									description: "No origination fees or prepayment penalties",
								},
								{
									icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
									title: "Easy Process",
									description:
										"Simple online application with instant decisions",
								},
							].map((feature, index) => (
								<Grid
									item
									xs={12}
									sm={6}
									md={3}
									key={index}
									style={{ marginBottom: "50px" }}>
									<Card sx={{ height: "100%", textAlign: "center", p: 3 }}>
										<CardContent>
											<Box sx={{ color: "primary.main", mb: 2 }}>
												{feature.icon}
											</Box>
											<Typography variant='h5' gutterBottom color='primary'>
												{feature.title}
											</Typography>
											<Typography variant='body2'>
												{feature.description}
											</Typography>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					</Container>
				</Box>

				<Box sx={{ py: { xs: 5, md: 8 }, bgcolor: "#ffffff" }}>
					<Container>
						<Typography
							variant='h2'
							textAlign='center'
							gutterBottom
							color='primary'>
							Types of Personal Loans
						</Typography>
						<Typography variant='body1' textAlign='center' sx={{ mb: 6 }}>
							We offer various types of personal loans to meet your specific
							needs
						</Typography>
						<Grid container spacing={4}>
							{[
								{
									title: "Debt Consolidation",
									description:
										"Combine multiple debts into one manageable monthly payment with potentially lower interest rates.",
									amount: "Up to $50,000",
									rate: "From 6.99% APR",
								},
								{
									title: "Home Improvement",
									description:
										"Fund your home renovation projects to increase your property value and comfort.",
									amount: "Up to $75,000",
									rate: "From 7.49% APR",
								},
								{
									title: "Major Purchases",
									description:
										"Finance large purchases like appliances, furniture, or special occasions.",
									amount: "Up to $25,000",
									rate: "From 8.99% APR",
								},
								{
									title: "Emergency Expenses",
									description:
										"Cover unexpected costs with quick access to emergency funds.",
									amount: "Up to $15,000",
									rate: "From 8.49% APR",
								},
							].map((loan, index) => (
								<Grid
									item
									xs={12}
									sm={6}
									md={3}
									key={index}
									style={{ marginBottom: "50px" }}>
									<Card
										sx={{
											height: "100%",
											display: "flex",
											flexDirection: "column",
										}}>
										<CardContent>
											<Typography variant='h5' gutterBottom color='primary'>
												{loan.title}
											</Typography>
											<Typography variant='body2' sx={{ mb: 2 }}>
												{loan.description}
											</Typography>
											<Typography
												variant='subtitle1'
												color='primary'
												fontWeight='bold'>
												{loan.amount}
											</Typography>
											<Typography variant='subtitle2' color='text.secondary'>
												{loan.rate}
											</Typography>
										</CardContent>
										<Box sx={{ p: 2, mt: "auto" }}>
											<Button
												variant='outlined'
												color='text'
												fullWidth
												style={{ backgroundColor: "#263b28", color: "white" }}>
												Learn More
											</Button>
										</Box>
									</Card>
								</Grid>
							))}
						</Grid>
					</Container>
				</Box>

				{/* Loan Process Section */}
				<Box sx={{ py: { xs: 5, md: 8 }, bgcolor: "#f5f5f5" }}>
					<Container>
						<Typography
							variant='h2'
							textAlign='center'
							gutterBottom
							color='primary'>
							Simple Loan Process
						</Typography>
						<Typography variant='body1' textAlign='center' sx={{ mb: 6 }}>
							Get your loan in three easy steps
						</Typography>
						<Grid container spacing={4}>
							{[
								{
									step: "1",
									title: "Check Your Rate",
									description:
										"Fill out our simple form to check your rate with no impact to your credit score.",
								},
								{
									step: "2",
									title: "Choose Your Loan",
									description:
										"Select the loan amount and terms that work best for your needs.",
								},
								{
									step: "3",
									title: "Get Your Money",
									description:
										"Complete your application and receive funds as soon as the next business day.",
								},
							].map((step, index) => (
								<Grid item xs={12} md={4} key={index}>
									<Box
										sx={{
											textAlign: "center",
											position: "relative",
											"&::after": {
												content: '""',
												position: "absolute",
												top: "20%",
												right: "-10%",
												width: "20%",
												height: "2px",
												backgroundColor: "#95b8a2",
												display: {
													xs: "none",
													md: index < 2 ? "block" : "none",
												},
											},
										}}>
										<Box
											sx={{
												width: "60px",
												height: "60px",
												borderRadius: "50%",
												backgroundColor: "primary.main",
												color: "white",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												margin: "0 auto 20px",
												fontSize: "24px",
												fontWeight: "bold",
											}}>
											{step.step}
										</Box>
										<Typography variant='h4' gutterBottom color='primary'>
											{step.title}
										</Typography>
										<Typography variant='body1'>{step.description}</Typography>
									</Box>
								</Grid>
							))}
						</Grid>
					</Container>
				</Box>

				{/* Benefits Section */}
				<Box sx={{ py: { xs: 5, md: 8 } }}>
					<Container>
						<Grid container spacing={6} alignItems='center'>
							<Grid item xs={12} md={6}>
								<Typography
									variant='h2'
									gutterBottom
									color='primary'
									sx={{ textAlign: { xs: "center", md: "left" } }}>
									Benefits of Our Personal Loans
								</Typography>
								<List>
									{[
										"Fixed monthly payments",
										"No collateral required",
										"Flexible loan terms from 12-60 months",
										"No prepayment penalties",
										"Quick online application process",
										"Funds available as soon as next business day",
									].map((benefit, index) => (
										<ListItem key={index}>
											<ListItemIcon>
												<CheckCircleIcon color='primary' />
											</ListItemIcon>
											<ListItemText primary={benefit} />
										</ListItem>
									))}
								</List>
								<Box sx={{ textAlign: { xs: "center", md: "left" } }}>
									<Button
										variant='contained'
										color='primary'
										size='large'
										sx={{ mt: 3 }}
										endIcon={<ArrowForwardIcon />}>
										Apply Now
									</Button>
								</Box>
							</Grid>
							<Grid item xs={12} md={6}>
								<Box
									sx={{
										bgcolor: "#f5f5f5",
										p: 4,
										borderRadius: 2,
										border: "1px solid #e0e0e0",
									}}>
									<Typography
										variant='h4'
										gutterBottom
										color='primary'
										sx={{ textAlign: { xs: "center", md: "left" } }}>
										What You Need to Apply
									</Typography>
									<List>
										{[
											"Valid government-issued ID",
											"Proof of income",
											"Bank account statements",
											"Social Security number",
											"Proof of address",
											"Employment information",
										].map((requirement, index) => (
											<ListItem key={index}>
												<ListItemIcon>
													<CheckCircleIcon color='primary' />
												</ListItemIcon>
												<ListItemText primary={requirement} />
											</ListItem>
										))}
									</List>
								</Box>
							</Grid>
						</Grid>
					</Container>
				</Box>

				{/* Testimonials Section */}
				<Box sx={{ py: { xs: 5, md: 8 }, bgcolor: "#c6dbce" }}>
					<Container>
						<Typography
							variant='h2'
							textAlign='center'
							gutterBottom
							color='primary'>
							What Our Customers Say
						</Typography>
						<Grid container spacing={4} sx={{ mt: 4 }}>
							{[
								{
									quote:
										"The process was incredibly smooth and fast. I got my loan approved within 24 hours!",
									author: "Sarah M.",
									location: "New York, NY",
								},
								{
									quote:
										"I was able to consolidate all my debts into one manageable payment. Couldn't be happier!",
									author: "John D.",
									location: "Chicago, IL",
								},
								{
									quote:
										"The customer service was excellent. They helped me every step of the way.",
									author: "Michael R.",
									location: "Los Angeles, CA",
								},
							].map((testimonial, index) => (
								<Grid
									item
									xs={12}
									md={4}
									key={index}
									style={{ marginBottom: "50px" }}>
									<Card sx={{ height: "100%", bgcolor: "white" }}>
										<CardContent sx={{ p: 4 }}>
											<Typography
												variant='body1'
												paragraph
												sx={{ fontStyle: "italic" }}>
												"{testimonial.quote}"
											</Typography>
											<Typography
												variant='subtitle1'
												color='primary'
												fontWeight='bold'>
												{testimonial.author}
											</Typography>
											<Typography variant='subtitle2' color='text.secondary'>
												{testimonial.location}
											</Typography>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					</Container>
				</Box>

				{/* CTA Section */}
				<Box sx={{ py: { xs: 5, md: 8 }, bgcolor: "#1b321d", color: "white" }}>
					<Container>
						<Grid container spacing={4} alignItems='center'>
							<Grid
								item
								xs={12}
								md={8}
								sx={{ textAlign: { xs: "center", md: "left" } }}>
								<Typography variant='h3' gutterBottom sx={{ color: "white" }}>
									Ready to Get Started?
								</Typography>
								<Typography variant='h6' sx={{ color: "white", opacity: 0.9 }}>
									Check your rate with no impact to your credit score
								</Typography>
							</Grid>
							<Grid
								item
								xs={12}
								md={4}
								sx={{ textAlign: { xs: "center", md: "right" } }}>
								<Button
									variant='contained'
									size='large'
									sx={{
										bgcolor: "white",
										color: "primary.main",
										"&:hover": {
											bgcolor: "#f5f5f5",
										},
									}}
									endIcon={<ArrowForwardIcon />}>
									Apply Now
								</Button>
							</Grid>
						</Grid>
					</Container>
				</Box>

				{/* FAQ Section */}
				<Box sx={{ py: { xs: 5, md: 8 }, bgcolor: "#f5f5f5" }}>
					<Container>
						<Typography
							variant='h2'
							textAlign='center'
							gutterBottom
							color='primary'>
							Frequently Asked Questions
						</Typography>
						<Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
							{faqs.map((faq, index) => (
								<Accordion
									key={index}
									expanded={expanded === index}
									onChange={() =>
										setExpanded(expanded === index ? false : index)
									}
									sx={{ mb: 2 }}>
									<AccordionSummary expandIcon={<ExpandMoreIcon />}>
										<Typography variant='body1' style={{ fontWeight: "600" }}>
											{faq.question}
										</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<Typography style={{ fontSize: "17px" }}>
											{faq.answer}
										</Typography>
									</AccordionDetails>
								</Accordion>
							))}
						</Box>
					</Container>
				</Box>
			</Box>
		</ThemeProvider>
	);
};

export default PersonalLoanPage;
