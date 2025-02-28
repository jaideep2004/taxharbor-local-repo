import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Container,
	Grid,
	Button,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Card,
	CardContent,
	Divider,
	useScrollTrigger,
	Paper,
	Link,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Hidden,
	useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";

// Create custom theme with provided colors
const theme = createTheme({
	palette: {
		primary: {
			main: "#1b321d",
		},
		secondary: {
			main: "#ffffff",
		},
		tertiary: {
			main: "#000000",
		},
		background: {
			default: "#c6dbce",
			paper: "#ffffff",
		},
		accent: {
			main: "#95b8a2",
		},
	},
	typography: {
		// fontFamily: "'Inter', 'Helvetica', 'Arial', sans-serif",
		h1: {
			fontWeight: 700,
		},
		h2: {
			fontWeight: 700,
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
		},
		button: {
			textTransform: "none",
			fontWeight: 600,
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: "4px",
					padding: "12px 24px",
				},
				containedPrimary: {
					backgroundColor: "#1b321d",
					"&:hover": {
						backgroundColor: "#152718",
					},
				},
			},
		},
	},
});

// Custom styled components
const HeroSection = styled(Box)(({ theme }) => ({
	position: "relative",
	padding: "120px 0",
	backgroundColor: "#F5F5F5",
	"@media (max-width:600px)": {
		padding: "80px 0",
	},
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundImage: "url('./images/category2.png')",
		backgroundSize: "cover",
		backgroundPosition: "center",
		opacity: 0.45,
	},
}));

const HeroContent = styled(Box)(({ theme }) => ({
	position: "relative",
	zIndex: 1,
	maxWidth: "650px",
	"@media (max-width:600px)": {
		padding: "0 16px",
	},
}));

const StickyNav = styled(Box)(({ theme, trigger }) => ({
	position: trigger ? "fixed" : "relative",
	top: trigger ? "130px" : "0",
	width: "280px",
	transition: "all 0.3s ease",
	zIndex: "1",
}));

const NavList = styled(List)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	borderRadius: "8px",
	boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
	overflow: "hidden",
}));

const NavItem = styled(ListItem)(({ theme, active }) => ({
	padding: "16px 24px",
	borderLeft: active
		? `4px solid ${theme.palette.primary.main}`
		: "4px solid transparent",
	backgroundColor: active ? theme.palette.accent.main + "30" : "transparent",
	"&:hover": {
		backgroundColor: theme.palette.accent.main + "15",
		cursor: "pointer",
	},
}));

const ContentSection = styled(Box)(({ theme }) => ({
	padding: "40px 0",
	backgroundColor: theme.palette.background.paper,
	marginBottom: "24px",
	borderRadius: "8px",
	boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
}));

const AccentBox = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.accent.main + "30",
	padding: "32px",
	borderRadius: "8px",
	marginBottom: "24px",
	"@media (max-width:600px)": {
		padding: "24px 16px",
	},
}));

const CTAButton = styled(Button)(({ theme }) => ({
	padding: "16px 32px",
	fontSize: "18px",
	"@media (max-width:600px)": {
		padding: "12px 24px",
		fontSize: "16px",
		width: "100%",
		marginBottom: "16px",
	},
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
	boxShadow: "none",
	marginBottom: "16px",
	"&:before": {
		display: "none",
	},
	"&.Mui-expanded": {
		margin: "0 0 16px 0",
	},
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
	padding: "0 16px",
	backgroundColor: theme.palette.accent.main + "15",
	borderRadius: "8px",
	"&.Mui-expanded": {
		minHeight: "48px",
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
}));

// Mobile menu component for section navigation on small screens
const MobileSectionMenu = ({ sections, activeSection, scrollToSection }) => {
	return (
		<Box sx={{ mb: 4, mt: 2 }}>
			<StyledAccordion>
				<StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant='h6' color='primary'>
						{sections.find((section) => section.id === activeSection)?.label ||
							"Sections"}
					</Typography>
				</StyledAccordionSummary>
				<AccordionDetails>
					<List>
						{sections.map((section) => (
							<ListItem
								key={section.id}
								onClick={() => scrollToSection(section.id)}
								sx={{
									backgroundColor:
										activeSection === section.id
											? "accent.main" + "30"
											: "transparent",
									borderRadius: "4px",
									mb: 1,
									cursor: "pointer",
								}}>
								<ListItemText primary={section.label} />
							</ListItem>
						))}
					</List>
				</AccordionDetails>
			</StyledAccordion>
		</Box>
	);
};

// Main component
const LifeInsurancePage = () => {
	const [activeSection, setActiveSection] = useState("overview");
	const [expanded, setExpanded] = useState(false);
	const muiTheme = useTheme();
	const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));

	// For sticky sidebar tracking
	const scrollTrigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 400,
	});

	const sections = [
		{ id: "overview", label: "Overview" },
		{ id: "how-it-works", label: "How It Works" },
		{ id: "benefits", label: "Benefits" },
		{ id: "types", label: "Types of Life Insurance" },
		{ id: "faq", label: "FAQs" },
	];

	// Handle scrolling to section
	const scrollToSection = (sectionId) => {
		const element = document.getElementById(sectionId);
		if (element) {
			const yOffset = -100;
			const y =
				element.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({ top: y, behavior: "smooth" });
			setActiveSection(sectionId);
		}
	};

	// Update active section based on scroll position
	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY + 200;

			for (const section of sections) {
				const element = document.getElementById(section.id);
				if (element) {
					const offsetTop = element.offsetTop;
					const offsetBottom = offsetTop + element.offsetHeight;

					if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
						setActiveSection(section.id);
						break;
					}
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleAccordionChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	return (
		<ThemeProvider theme={theme}>
			<Box sx={{ backgroundColor: "background.default", minHeight: "80vh" }}>
				{/* Hero Banner */}
				<HeroSection>
					<Container maxWidth='lg' sx={{ mt: { xs: "80px", md: "160px" } }}>
						<Grid container spacing={4} alignItems='center'>
							<Grid
								item
								xs={12}
								md={6}
								sx={{
									backgroundColor: "white",
									opacity: "2",
									borderRadius: { xs: "8px", md: "0" },
									p: { xs: 3, md: 0 },
								}}>
								<HeroContent>
									<Typography
										variant='h1'
										color='primary'
										gutterBottom
										sx={{
											fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
										}}>
										Life Insurance
									</Typography>
									<Typography
										variant='h4'
										color='primary'
										gutterBottom
										sx={{
											mb: 3,
											fontWeight: 400,
											fontSize: { xs: "1.25rem", md: "1.5rem" },
										}}>
										Protect what matters most
									</Typography>
									<Typography
										variant='body1'
										color='primary'
										paragraph
										sx={{ mb: 4, fontSize: { xs: "1rem", md: "1.1rem" } }}>
										Secure your family's financial future with our comprehensive
										life insurance solutions. Get personalized coverage that
										gives you peace of mind.
									</Typography>
									<CTAButton
										variant='contained'
										color='primary'
										size='large'
										endIcon={<ArrowForwardIcon />}
										fullWidth={isMobile}>
										Get a Free Quote
									</CTAButton>
								</HeroContent>
							</Grid>
						</Grid>
					</Container>
				</HeroSection>

				{/* Main Content Section with Sticky Sidebar */}
				<Container sx={{ py: { xs: 4, md: 8 } }}>
					<Grid container spacing={4}>
						{/* Sticky Sidebar Navigation - Desktop Only */}
						<Grid item xs={12} md={3}>
							<Hidden mdDown>
								<StickyNav trigger={scrollTrigger}>
									<NavList component='nav'>
										{sections.map((section) => (
											<NavItem
												key={section.id}
												active={activeSection === section.id}
												onClick={() => scrollToSection(section.id)}>
												<ListItemText
													primary={section.label}
													primaryTypographyProps={{
														fontWeight:
															activeSection === section.id ? 600 : 400,
														color: "primary",
													}}
												/>
											</NavItem>
										))}
									</NavList>
									<Box
										sx={{
											mt: 4,
											p: 3,
											backgroundColor: "accent.main",
											borderRadius: "8px",
											textAlign: "center",
										}}>
										<Typography variant='h5' color='primary' gutterBottom>
											Need Help?
										</Typography>
										<Typography variant='body2' color='primary' paragraph>
											Our insurance experts are here to assist you
										</Typography>
										<Button variant='contained' color='primary' sx={{ mt: 1 }}>
											Contact Us
										</Button>
									</Box>
								</StickyNav>
							</Hidden>
						</Grid>

						{/* Main Content */}
						<Grid item xs={12} md={9}>
							{/* Mobile Navigation Menu */}
							{isMobile && (
								<MobileSectionMenu
									sections={sections}
									activeSection={activeSection}
									scrollToSection={scrollToSection}
								/>
							)}

							{/* Overview Section */}
							<ContentSection id='overview'>
								<Container
									maxWidth='md'
									sx={{ px: { xs: 2, sm: 3, md: "auto" } }}>
									<Typography variant='h3' color='primary' gutterBottom>
										Life Insurance Overview
									</Typography>
									<Typography variant='body1' paragraph>
										Life insurance provides financial protection for your loved
										ones in the event of your death. It can help replace lost
										income, cover expenses, pay off debts, and provide peace of
										mind knowing your family will be taken care of financially.
									</Typography>

									<AccentBox>
										<Typography variant='h5' color='primary' gutterBottom>
											Why Choose Our Life Insurance
										</Typography>
										<Grid container spacing={3} sx={{ mt: 1 }}>
											<Grid item xs={12} sm={6}>
												<List>
													<ListItem disableGutters>
														<ListItemIcon sx={{ minWidth: "40px" }}>
															<CheckCircleIcon color='primary' />
														</ListItemIcon>
														<ListItemText primary='Customizable coverage options' />
													</ListItem>
													<ListItem disableGutters>
														<ListItemIcon sx={{ minWidth: "40px" }}>
															<CheckCircleIcon color='primary' />
														</ListItemIcon>
														<ListItemText primary='Competitive rates' />
													</ListItem>
													<ListItem disableGutters>
														<ListItemIcon sx={{ minWidth: "40px" }}>
															<CheckCircleIcon color='primary' />
														</ListItemIcon>
														<ListItemText primary='Fast application process' />
													</ListItem>
												</List>
											</Grid>
											<Grid item xs={12} sm={6}>
												<List>
													<ListItem disableGutters>
														<ListItemIcon sx={{ minWidth: "40px" }}>
															<CheckCircleIcon color='primary' />
														</ListItemIcon>
														<ListItemText primary='Expert guidance' />
													</ListItem>
													<ListItem disableGutters>
														<ListItemIcon sx={{ minWidth: "40px" }}>
															<CheckCircleIcon color='primary' />
														</ListItemIcon>
														<ListItemText primary='24/7 customer support' />
													</ListItem>
													<ListItem disableGutters>
														<ListItemIcon sx={{ minWidth: "40px" }}>
															<CheckCircleIcon color='primary' />
														</ListItemIcon>
														<ListItemText primary='Easy claims process' />
													</ListItem>
												</List>
											</Grid>
										</Grid>
									</AccentBox>
								</Container>
							</ContentSection>

							{/* How It Works Section */}
							<ContentSection id='how-it-works'>
								<Container
									style={{ paddingBottom: "50px" }}
									maxWidth='md'
									sx={{ px: { xs: 2, sm: 3, md: "auto" } }}>
									<Typography variant='h3' color='primary' gutterBottom>
										How Life Insurance Works
									</Typography>
									<Typography variant='body1' paragraph>
										Life insurance is a contract between you and an insurance
										company. You pay regular premiums, and in return, the
										insurer promises to pay a death benefit to your
										beneficiaries upon your passing.
									</Typography>

									<Grid container spacing={4} sx={{ mt: 3 }}>
										<Grid item xs={12} sm={6} md={4}>
											<Card
												sx={{
													height: "100%",
													boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
												}}>
												<CardContent sx={{ p: { xs: 3, md: 4 } }}>
													<Typography
														variant='h5'
														color='primary'
														gutterBottom
														sx={{ fontWeight: 600 }}>
														1. Apply
													</Typography>
													<Typography variant='body2'>
														Complete an application and provide information
														about your health and lifestyle. Some policies may
														require a medical exam.
													</Typography>
												</CardContent>
											</Card>
										</Grid>
										<Grid item xs={12} sm={6} md={4}>
											<Card
												sx={{
													height: "100%",
													boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
												}}>
												<CardContent sx={{ p: { xs: 3, md: 4 } }}>
													<Typography
														variant='h5'
														color='primary'
														gutterBottom
														sx={{ fontWeight: 600 }}>
														2. Pay Premiums
													</Typography>
													<Typography variant='body2'>
														Make regular premium payments to keep your policy
														active. Missed payments may cause your policy to
														lapse.
													</Typography>
												</CardContent>
											</Card>
										</Grid>
										<Grid item xs={12} sm={6} md={4}>
											<Card
												sx={{
													height: "100%",
													boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
												}}>
												<CardContent sx={{ p: { xs: 3, md: 4 } }}>
													<Typography
														variant='h5'
														color='primary'
														gutterBottom
														sx={{ fontWeight: 600 }}>
														3. Claim Process
													</Typography>
													<Typography variant='body2'>
														When you pass away, your beneficiaries file a claim
														with the insurance company to receive the death
														benefit.
													</Typography>
												</CardContent>
											</Card>
										</Grid>
									</Grid>
								</Container>
							</ContentSection>

							{/* Benefits Section */}
							<ContentSection id='benefits'>
								<Container
									maxWidth='md'
									sx={{ px: { xs: 2, sm: 3, md: "auto" } }}>
									<Typography variant='h3' color='primary' gutterBottom>
										Benefits of Life Insurance
									</Typography>
									<Typography variant='body1' paragraph>
										Life insurance offers numerous benefits to policyholders and
										their families, providing protection and peace of mind for
										the future.
									</Typography>

									<Grid container spacing={4} sx={{ mt: 3 }}>
										<Grid item xs={12} md={6}>
											<Box sx={{ mb: 4 }}>
												<Typography variant='h5' color='primary' gutterBottom>
													Income Replacement
												</Typography>
												<Typography variant='body2'>
													Replaces lost income to help your family maintain
													their standard of living and cover day-to-day expenses
													after you're gone.
												</Typography>
											</Box>
											<Box sx={{ mb: 4 }}>
												<Typography variant='h5' color='primary' gutterBottom>
													Debt Coverage
												</Typography>
												<Typography variant='body2'>
													Provides funds to pay off mortgages, car loans, credit
													cards, and other debts so they don't become a burden
													to your family.
												</Typography>
											</Box>
											<Box>
												<Typography variant='h5' color='primary' gutterBottom>
													Estate Planning
												</Typography>
												<Typography variant='body2'>
													Helps with estate planning and can provide liquidity
													to cover estate taxes and other expenses related to
													settling your estate.
												</Typography>
											</Box>
										</Grid>
										<Grid item xs={12} md={6}>
											<Box sx={{ mb: 4 }}>
												<Typography variant='h5' color='primary' gutterBottom>
													Education Funding
												</Typography>
												<Typography variant='body2'>
													Ensures your children's education plans can continue,
													helping to fund college or other educational expenses.
												</Typography>
											</Box>
											<Box sx={{ mb: 4 }}>
												<Typography variant='h5' color='primary' gutterBottom>
													Business Continuation
												</Typography>
												<Typography variant='body2'>
													For business owners, life insurance can fund buy-sell
													agreements and help ensure the continuation of your
													business.
												</Typography>
											</Box>
											<Box>
												<Typography variant='h5' color='primary' gutterBottom>
													Peace of Mind
												</Typography>
												<Typography variant='body2'>
													Perhaps the most important benefit: knowing your loved
													ones will be financially protected gives you peace of
													mind.
												</Typography>
											</Box>
										</Grid>
									</Grid>
								</Container>
							</ContentSection>

							{/* Types of Life Insurance Section */}
							<ContentSection id='types'>
								<Container
									maxWidth='md'
									sx={{ px: { xs: 2, sm: 3, md: "auto" } }}>
									<Typography variant='h3' color='primary' gutterBottom>
										Types of Life Insurance
									</Typography>
									<Typography variant='body1' paragraph>
										We offer different types of life insurance to meet your
										specific needs and budget. Each type has its own features
										and benefits.
									</Typography>

									<AccentBox>
										<Typography
											variant='h4'
											color='primary'
											gutterBottom
											sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
											Term Life Insurance
										</Typography>
										<Typography variant='body2' paragraph>
											Provides coverage for a specific period (term), such as
											10, 20, or 30 years. It's generally the most affordable
											option.
										</Typography>
										<List>
											<ListItem disableGutters>
												<ListItemIcon sx={{ minWidth: "40px" }}>
													<CheckCircleIcon color='primary' />
												</ListItemIcon>
												<ListItemText primary='Lower premiums compared to permanent life insurance' />
											</ListItem>
											<ListItem disableGutters>
												<ListItemIcon sx={{ minWidth: "40px" }}>
													<CheckCircleIcon color='primary' />
												</ListItemIcon>
												<ListItemText primary='Simple and straightforward' />
											</ListItem>
											<ListItem disableGutters>
												<ListItemIcon sx={{ minWidth: "40px" }}>
													<CheckCircleIcon color='primary' />
												</ListItemIcon>
												<ListItemText primary='Ideal for specific financial obligations with end dates' />
											</ListItem>
										</List>
									</AccentBox>

									<AccentBox>
										<Typography
											variant='h4'
											color='primary'
											gutterBottom
											sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
											Whole Life Insurance
										</Typography>
										<Typography variant='body2' paragraph>
											Provides lifelong coverage with a cash value component
											that grows over time. Premiums remain level for life.
										</Typography>
										<List>
											<ListItem disableGutters>
												<ListItemIcon sx={{ minWidth: "40px" }}>
													<CheckCircleIcon color='primary' />
												</ListItemIcon>
												<ListItemText primary='Lifetime coverage' />
											</ListItem>
											<ListItem disableGutters>
												<ListItemIcon sx={{ minWidth: "40px" }}>
													<CheckCircleIcon color='primary' />
												</ListItemIcon>
												<ListItemText primary='Builds cash value over time' />
											</ListItem>
											<ListItem disableGutters>
												<ListItemIcon sx={{ minWidth: "40px" }}>
													<CheckCircleIcon color='primary' />
												</ListItemIcon>
												<ListItemText primary='Fixed premiums that never increase' />
											</ListItem>
										</List>
									</AccentBox>

									<AccentBox>
										<Typography
											variant='h4'
											color='primary'
											gutterBottom
											sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
											Universal Life Insurance
										</Typography>
										<Typography variant='body2' paragraph>
											Offers lifetime coverage with flexible premiums and death
											benefits. Includes a cash value component with potential
											for growth.
										</Typography>
										<List>
											<ListItem disableGutters>
												<ListItemIcon sx={{ minWidth: "40px" }}>
													<CheckCircleIcon color='primary' />
												</ListItemIcon>
												<ListItemText primary='Flexible premium payments' />
											</ListItem>
											<ListItem disableGutters>
												<ListItemIcon sx={{ minWidth: "40px" }}>
													<CheckCircleIcon color='primary' />
												</ListItemIcon>
												<ListItemText primary='Adjustable death benefit' />
											</ListItem>
											<ListItem disableGutters>
												<ListItemIcon sx={{ minWidth: "40px" }}>
													<CheckCircleIcon color='primary' />
												</ListItemIcon>
												<ListItemText primary='Cash value grows based on current interest rates' />
											</ListItem>
										</List>
									</AccentBox>
								</Container>
							</ContentSection>

							{/* FAQs Section */}
							<ContentSection id='faq'>
								<Container
									maxWidth='md'
									sx={{ px: { xs: 2, sm: 3, md: "auto" } }}>
									<Typography variant='h3' color='primary' gutterBottom>
										Frequently Asked Questions
									</Typography>
									<Typography variant='body1' paragraph sx={{ mb: 4 }}>
										Find answers to common questions about life insurance to
										help you make informed decisions about your coverage.
									</Typography>

									<StyledAccordion
										expanded={expanded === "panel1"}
										onChange={handleAccordionChange("panel1")}>
										<StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
											<Typography
												variant='h6'
												color='primary'
												sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
												How much life insurance do I need?
											</Typography>
										</StyledAccordionSummary>
										<AccordionDetails>
											<Typography variant='body2'>
												The amount of life insurance you need depends on several
												factors, including your income, debt, future financial
												obligations, and family needs. A common rule of thumb is
												to have coverage that's 10-15 times your annual income,
												but your specific situation may require more or less.
												Our insurance specialists can help you calculate the
												right amount for your circumstances.
											</Typography>
										</AccordionDetails>
									</StyledAccordion>

									<StyledAccordion
										expanded={expanded === "panel2"}
										onChange={handleAccordionChange("panel2")}>
										<StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
											<Typography
												variant='h6'
												color='primary'
												sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
												What factors affect life insurance premiums?
											</Typography>
										</StyledAccordionSummary>
										<AccordionDetails>
											<Typography variant='body2'>
												Several factors influence your life insurance premiums,
												including:
												<br />
												<br />
												• Age: Generally, younger people pay lower premiums
												<br />
												• Health: Your medical history and current health status
												<br />
												• Lifestyle: Factors like smoking, alcohol use, and
												high-risk hobbies
												<br />
												• Gender: Statistically, women often pay less than men
												<br />
												• Coverage amount: Higher coverage means higher premiums
												<br />• Policy type: Term life is typically less
												expensive than permanent life insurance
											</Typography>
										</AccordionDetails>
									</StyledAccordion>

									<StyledAccordion
										expanded={expanded === "panel3"}
										onChange={handleAccordionChange("panel3")}>
										<StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
											<Typography
												variant='h6'
												color='primary'
												sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
												Can I have multiple life insurance policies?
											</Typography>
										</StyledAccordionSummary>
										<AccordionDetails>
											<Typography variant='body2'>
												Yes, you can have multiple life insurance policies from
												different companies or even multiple policies from the
												same insurer. This strategy, called "laddering," can
												help you tailor your coverage to your changing needs
												over time. However, insurance companies will look at
												your total coverage amount across all policies during
												underwriting to ensure it's reasonable relative to your
												financial situation.
											</Typography>
										</AccordionDetails>
									</StyledAccordion>

									<StyledAccordion
										expanded={expanded === "panel4"}
										onChange={handleAccordionChange("panel4")}>
										<StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
											<Typography
												variant='h6'
												color='primary'
												sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
												Is the death benefit taxable?
											</Typography>
										</StyledAccordionSummary>
										<AccordionDetails>
											<Typography variant='body2'>
												In most cases, life insurance death benefits are not
												subject to federal income tax when paid to a
												beneficiary. However, there are exceptions, such as when
												the policy was sold for cash or if the policy is part of
												an estate that exceeds federal estate tax exemptions. We
												recommend consulting with a tax professional for advice
												specific to your situation.
											</Typography>
										</AccordionDetails>
									</StyledAccordion>

									<StyledAccordion
										expanded={expanded === "panel5"}
										onChange={handleAccordionChange("panel5")}>
										<StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
											<Typography
												variant='h6'
												color='primary'
												sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
												Can I change my beneficiaries?
											</Typography>
										</StyledAccordionSummary>
										<AccordionDetails>
											<Typography variant='body2'>
												Yes, you can change your beneficiaries at any time as
												long as the policy is in force and you are the policy
												owner. Life events such as marriage, divorce, or the
												birth of a child are common reasons people update their
												beneficiaries. It's important to review your beneficiary
												designations regularly to ensure they reflect your
												current wishes.
											</Typography>
										</AccordionDetails>
									</StyledAccordion>
								</Container>
							</ContentSection>

							{/* Call to Action Section */}
							<Box
								sx={{
									backgroundColor: "primary.main",
									borderRadius: "8px",
									padding: { xs: "30px 20px", md: "60px" },
									textAlign: "center",
									mb: 4,
								}}>
								<Typography variant='h3' color='secondary' gutterBottom>
									Ready to Protect Your Family's Future?
								</Typography>
								<Typography
									variant='body1'
									color='secondary'
									paragraph
									sx={{ maxWidth: "700px", mx: "auto", mb: 4 }}>
									Get personalized life insurance coverage tailored to your
									needs and budget. Our experts are ready to help you find the
									right policy.
								</Typography>
								<Grid container spacing={3} justifyContent='center'>
									<Grid item>
										<Button
											variant='contained'
											size='large'
											sx={{
												backgroundColor: "accent.main",
												color: "primary.main",
												"&:hover": {
													backgroundColor: "#84a591",
												},
												px: 4,
											}}>
											Get a Free Quote
										</Button>
									</Grid>
									<Grid item>
										<Button
											variant='outlined'
											size='large'
											sx={{
												borderColor: "secondary.main",
												color: "secondary.main",
												"&:hover": {
													borderColor: "secondary.main",
													backgroundColor: "rgba(255,255,255,0.1)",
												},
												px: 4,
											}}>
											Contact an Agent
										</Button>
									</Grid>
								</Grid>
							</Box>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</ThemeProvider>
	);
};

export default LifeInsurancePage;
