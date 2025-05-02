import React, { useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
	Box,
	Typography,
	Grid,
	Paper,
	useTheme,
	useMediaQuery,
	Divider,
	Avatar,
	Chip,
	Tooltip,
} from "@mui/material";
import axios from "../../Admin/utils/axiosConfig";
import { AdminDashboardContext } from "../../Admin/AdminDashboardContext";
import { getServicePath } from "../../utils/serviceRouteMap";
import "./dropdown.css";

// Import Material UI icons
import MoneyIcon from "@mui/icons-material/Money";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HomeIcon from "@mui/icons-material/Home";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ShieldIcon from "@mui/icons-material/Shield";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import SavingsIcon from "@mui/icons-material/Savings";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CalculateIcon from "@mui/icons-material/Calculate";
import PaymentsIcon from "@mui/icons-material/Payments";

// Create a context to handle dropdown closing - this will be used by Header.jsx
export const DropdownContext = React.createContext(null);

const DropDownMenu = () => {
	const { services, setServices } = useContext(AdminDashboardContext);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const navigate = useNavigate();
	
	// Get access to the parent's setIsDropdownVisible function
	const closeDropdown = useContext(DropdownContext);

	const groupServicesByCategory = (services) => {
		// Filter out inactive services first
		const activeServices = services.filter(
			(service) => service.isActive !== false
		);

		return activeServices.reduce((acc, service) => {
			const { category } = service;
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(service);
			return acc;
		}, {});
	};

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const response = await axios.get(
					"https://195-35-45-82.sslip.io:8000/api/customers/user-services"
				);
				setServices(response.data.services);
			} catch (error) {
				console.error("Failed to fetch services:", error);
			}
		};
		fetchServices();
	}, [setServices]);

	const groupedServices = groupServicesByCategory(services);

	// Use the utility function to get the proper path for this service
	const getServiceRedirectPath = (service) => {
		// Special case for TDS Returns to ensure correct routing
		if (
			service.name.toLowerCase().includes("tds") ||
			service.serviceId === "SER122"
		) {
			console.log(
				`TDS service detected: ${service.name}, using direct path: /tds-returns`
			);
			return "/tds-returns";
		}

		const path = getServicePath(service);
		console.log(
			`Service: ${service.name}, Path: ${path}, ID: ${
				service._id || service.serviceId
			}`
		);
		return path;
	};

	// Map to associate service names/categories with icons
	const getServiceIcon = (serviceName, category) => {
		const name = serviceName.toLowerCase();
		const cat = category.toLowerCase();

		if (name.includes("loan") || cat.includes("loan")) {
			if (name.includes("home")) return <HomeIcon />;
			if (name.includes("vehicle") || name.includes("car"))
				return <DirectionsCarIcon />;
			if (name.includes("personal")) return <PersonIcon />;
			if (name.includes("business")) return <BusinessCenterIcon />;
			if (name.includes("gold")) return <SavingsIcon />;
			if (name.includes("property") || name.includes("lap"))
				return <AccountBalanceIcon />;
			return <AttachMoneyIcon />;
		}

		if (name.includes("insurance") || cat.includes("insurance")) {
			if (name.includes("health")) return <HealthAndSafetyIcon />;
			if (name.includes("term")) return <ShieldIcon />;
			return <ShieldIcon />;
		}

		if (name.includes("credit card")) return <CreditCardIcon />;
		if (name.includes("investment") || name.includes("mutual fund"))
			return <AutoGraphIcon />;
		if (name.includes("overdraft")) return <AccountBalanceWalletIcon />;

		// Tax related
		if (
			name.includes("tax") ||
			name.includes("itr") ||
			name.includes("tds") ||
			cat.includes("tax")
		) {
			if (name.includes("filing") || name.includes("itr"))
				return <ReceiptLongIcon />;
			if (name.includes("planning")) return <CalculateIcon />;
			return <ReceiptLongIcon />;
		}

		// Default icon
		return <PaymentsIcon />;
	};

	// Get a color for the category chip
	const getCategoryColor = (category) => {
		const cat = category.toLowerCase();
		if (cat.includes("loan") || cat.includes("funding")) return "#1e4a30"; // primary green
		if (cat.includes("tax") || cat.includes("taxation")) return "#2C6040"; // lighter green
		if (cat.includes("card")) return "#8cc63f"; // accent green
		if (cat.includes("investment")) return "#2C6040"; // lighter green
		return "#1b321d"; // default primary
	};

	return (
		<Paper
			elevation={6}
			sx={{
				position: "absolute",
				top: "calc(100% + 0px)",
				left: "50%",  
				transform: "translateX(-50%)",
				zIndex: 1000, // Ensure consistent z-index with calculator dropdown
				width: "95%",
				maxWidth: "1400px", 
				borderRadius: "16px",
				padding: "16px 8px 20px",
				boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
				border: "1px solid rgba(230, 230, 230, 0.7)",
				maxHeight: "600px",
				overflowY: "auto",
				[theme.breakpoints.down('md')]: {
					position: "relative",
					top: 0,
					left: 0,
					transform: "none",
					width: "100%",
					maxHeight: "400px",
					boxShadow: "none",
					borderRadius: "8px",
					padding: "12px 8px",
					border: "1px solid rgba(149, 184, 162, 0.3)",
					backgroundColor: "#fff",
				}
			}}
			className='dropdown-paper custom-scrollbar'>
			<Grid
				container
				spacing={{ xs: 1.5, sm: 2, md: 3 }}
				sx={{
					maxHeight: "570px", // Adjusted height accounting for padding
					overflowY: "auto",
					overflowX: "hidden",
					pr: 1.5, // Add padding for scrollbar
				}}
				className='custom-scrollbar'>
				{Object.entries(groupedServices).map(
					([category, services], categoryIndex) => (
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={3} // 4 columns on large screens
							key={category}
							className='category-column'
							sx={{
								borderBottom: {
									xs: `1px solid rgba(149, 184, 162, 0.3)`,
									md: "none",
								},
								pb: { xs: 1.5, md: 0 },
								"&:last-child": { borderBottom: "none" },
								position: "relative",
							}}>
							<Box
								sx={{
									mb: 1.5, // Reduced from 2 to 1.5
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
								className='category-header'>
								<NavLink
									to={`/category/${category}`}
									style={{ textDecoration: "none", background: "none" }}
									onClick={() => closeDropdown && closeDropdown(false)}>
									<Chip
										label={category}
										sx={{
											bgcolor: getCategoryColor(category),
											color: "white",
											fontWeight: 600,
											fontSize: "0.9rem",
											py: 2.5,
											px: 1,
											borderRadius: "14px",
											boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
											transition: "all 0.3s ease",
											"&:hover": {
												transform: "translateY(-2px)",
												bgcolor: "#ff4081", // Pink on hover
												boxShadow: "0 4px 12px rgba(255, 64, 129, 0.25)",
											},
										}}
									/>
								</NavLink>
								<Divider
									sx={{
										flex: 1,
										mx: 1.5,
										borderColor: "rgba(149, 184, 162, 0.4)",
										display: { xs: "none", md: "block" },
									}}
								/>
							</Box>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									gap: 0.5, // Reduced from 1 to 0.5 to decrease vertical spacing
									ml: { xs: 0, md: 1 },
								}}
								className='service-list'>
								{services.map((service, index) => {
									const redirectPath = getServiceRedirectPath(service);
									const handleNavigation = (e) => {
										// Special case for TDS Returns to debug
										if (service.name.toLowerCase().includes("tds")) {
											console.log(
												`Clicked TDS service: ${service.name}, serviceId: ${
													service._id || service.serviceId
												}`
											);
											console.log(`Navigating to: ${redirectPath}`);

											// If the path is still incorrect, force it
											if (redirectPath !== "/tds-returns") {
												console.warn(
													`TDS path incorrect: ${redirectPath}, forcing to /tds-returns`
												);
												e.preventDefault();
												window.location.href = "/tds-returns";
											}
										}

										// Close the dropdown immediately when a service is clicked
										if (closeDropdown) {
											closeDropdown(false);
										}

										console.log(
											`Clicked service: ${service.name}, navigating to: ${redirectPath}`
										);
									};

									return (
										<NavLink
											key={service._id}
											to={redirectPath}
											style={{
												textDecoration: "none",
												"--item-index": index, // Add index for staggered animation
											}}
											onClick={handleNavigation}
											className='service-link service-item-container'>
											<Tooltip
												title={service.description || "Click to view details"}
												placement='right'>
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														px: { xs: 1, md: 1.5 },
														py: 1, // Reduced from 1.5 to 1 to decrease vertical height
														borderRadius: "10px",
														transition: "all 0.25s ease-in-out",
														position: "relative",
														overflow: "hidden",
														"&::before": {
															content: '""',
															position: "absolute",
															left: 0,
															top: 0,
															height: "100%",
															width: "0",
															backgroundColor: "rgba(255, 64, 129, 0.08)", // Very light pink background on hover
															transition: "width 0.3s ease",
															zIndex: 0,
														},
														"&:hover": {
															transform: "translateX(8px)",
															boxShadow: "0 3px 10px rgba(0,0,0,0.07)",
															"&::before": {
																width: "100%",
															},
														},
													}}
													className='service-item animate-dropdown-item'>
													<Avatar
														sx={{
															width: 34,
															height: 34,
															bgcolor: "rgba(30, 74, 48, 0.08)",
															color: "var(--primary)",
															mr: 1.5,
															transition: "all 0.3s ease",
															boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
															border: "1px solid rgba(149, 184, 162, 0.2)",
															zIndex: 1,
															"& .MuiSvgIcon-root": {
																fontSize: "1.2rem",
															},
															"&:hover": {
																bgcolor: "#ff4081", // Pink background on hover
																color: "white",
																boxShadow: "0 3px 8px rgba(255, 64, 129, 0.25)",
															},
														}}
														className='service-icon'>
														{getServiceIcon(service.name, category)}
													</Avatar>
													<Typography
														sx={{
															color: "var(--primary)",
															fontWeight: 500,
															fontSize: { xs: "0.95rem", md: "1rem" },
															transition: "all 0.2s ease",
															zIndex: 1,
															"&:hover": {
																color: "#ff4081", // Pink text on hover
															},
														}}
														className='service-name'>
														{service.name}
													</Typography>
												</Box>
											</Tooltip>
										</NavLink>
									);
								})}
							</Box>
						</Grid>
					)
				)}
			</Grid>
		</Paper>
	);
};

export default DropDownMenu;
