// import React, { useEffect, useContext } from "react";
// import { NavLink } from "react-router-dom";
// import {
// 	Box,
// 	Typography,
// 	Grid,
// 	Paper,
// 	useTheme,
// 	useMediaQuery,
// } from "@mui/material";
// import axios from "../../Admin/utils/axiosConfig";
// import { AdminDashboardContext } from "../../Admin/AdminDashboardContext";
// import "./dropdown.css";

// const DropDownMenu = () => {
// 	const { services, setServices } = useContext(AdminDashboardContext);
// 	const theme = useTheme();
// 	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

// 	const groupServicesByCategory = (services) => {
// 		return services.reduce((acc, service) => {
// 			const { category } = service;
// 			if (!acc[category]) {
// 				acc[category] = [];
// 			}
// 			acc[category].push(service);
// 			return acc;
// 		}, {});
// 	};

// 	useEffect(() => {
// 		const fetchServices = async () => {
// 			try {
// 				const response = await axios.get(
// 					"https://195-35-45-82.sslip.io:8000/api/customers/user-services"
// 				);
// 				setServices(response.data.services);
// 			} catch (error) {
// 				console.error("Failed to fetch services:", error);
// 			}
// 		};
// 		fetchServices();
// 	}, [setServices]);

// 	const groupedServices = groupServicesByCategory(services);

// 	// Function to determine the route based on category
// 	const getCategoryRoute = (category) => {
// 		if (category.toLowerCase() === "personal loan") {
// 			return "/personalloan";
// 		} else if (category.toLowerCase() === "life insurance") {
// 			return "/lifeinsurance";
// 		} else {
// 			return `/category/${category}`;
// 		}
// 	};

// 	return (
// 		<Paper
// 			elevation={3}
// 			sx={{
// 				position: isMobile ? "relative" : "absolute",
// 				top: isMobile ? "auto" : "100%",
// 				left: isMobile ? "auto" : "50%",
// 				transform: isMobile ? "none" : "translateX(-50%)",
// 				width: isMobile ? "100%" : { xs: "90vw", sm: "80vw", md: "1000px" },
// 				maxWidth: "1200px",
// 				bgcolor: "var(--secondary)",
// 				mt: isMobile ? 0 : 1,
// 				p: { xs: 1.5, sm: 2, md: 3 },
// 				zIndex: 1000,
// 				borderRadius: { xs: 0, md: 2 },
// 				boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
// 			}}>
// 			<Grid
// 				container
// 				spacing={{ xs: 1, sm: 2, md: 3 }}
// 				sx={{
// 					maxHeight: { xs: "60vh", md: "none" },
// 					overflowY: { xs: "auto", md: "visible" },
// 				}}>
// 				{Object.entries(groupedServices).map(([category, services]) => (
// 					<Grid
// 						item
// 						xs={12}
// 						md={4}
// 						key={category}
// 						sx={{
// 							borderBottom: { xs: `1px solid var(--accent)`, md: "none" },
// 							pb: { xs: 1.5, md: 0 },
// 							"&:last-child": { borderBottom: "none" },
// 						}}>
// 						<NavLink
// 							to={getCategoryRoute(category)} // Use the new routing function
// 							style={{ textDecoration: "none" }}>
// 							<Typography
// 								variant='h6'
// 								sx={{
// 									color: "var(--primary)",
// 									fontWeight: 600,
// 									mb: { xs: 1, md: 2 },
// 									borderBottom: `2px solid var(--accent)`,
// 									pb: 0.5,
// 									position: "relative",
// 									"&:after": {
// 										content: '""',
// 										position: "absolute",
// 										bottom: -2,
// 										left: 0,
// 										width: "0%",
// 										height: "2px",
// 										bgcolor: "var(--primary)",
// 										transition: "width 0.3s ease",
// 									},
// 									"&:hover:after": { width: "100%" },
// 								}}>
// 								{category}
// 							</Typography>
// 						</NavLink>
// 						<Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
// 							{services.map((service) => (
// 								<NavLink
// 									key={service._id}
// 									to={`/services/${service._id}`}
// 									style={{ textDecoration: "none" }}>
// 									<Typography
// 										sx={{
// 											py: 0.5,
// 											px: { xs: 1, md: 0 },
// 											color: "var(--primary)",
// 											borderRadius: 1,
// 											transition: "all 0.2s ease-in-out",
// 											fontSize: { xs: "0.9rem", md: "1rem" },
// 											"&:hover": {
// 												color: "var(--accent)",
// 												bgcolor: { xs: "var(--background)", md: "transparent" },
// 												pl: { xs: 2, md: 1 },
// 												transform: "translateX(4px)",
// 											},
// 										}}>
// 										{service.name}
// 									</Typography>
// 								</NavLink>
// 							))}
// 						</Box>
// 					</Grid>
// 				))}
// 			</Grid>
// 		</Paper>
// 	);
// };

// export default DropDownMenu;

import React, { useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import {
	Box,
	Typography,
	Grid,
	Paper,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import axios from "../../Admin/utils/axiosConfig";
import { AdminDashboardContext } from "../../Admin/AdminDashboardContext";
import "./dropdown.css";

const DropDownMenu = () => {
	const { services, setServices } = useContext(AdminDashboardContext);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const groupServicesByCategory = (services) => {
		return services.reduce((acc, service) => {
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

	// Function to determine the redirect path based on category
	const getServiceRedirectPath = (service) => {
		const categoryLower = service.category.toLowerCase();
		if (categoryLower === "personal loan") {
			return "/personalloan";
		} else if (categoryLower === "life insurance") {
			return "/lifeinsurance";
		} else {
			return `/services/${service._id}`;
		}
	};

	return (
		<Paper
			elevation={3}
			sx={{
				position: isMobile ? "relative" : "absolute",
				top: isMobile ? "auto" : "100%",
				left: isMobile ? "auto" : "50%",
				transform: isMobile ? "none" : "translateX(-50%)",
				width: isMobile ? "100%" : { xs: "90vw", sm: "80vw", md: "1000px" },
				maxWidth: "1200px",
				bgcolor: "var(--secondary)",
				mt: isMobile ? 0 : 1,
				p: { xs: 1.5, sm: 2, md: 3 },
				zIndex: 1000,
				borderRadius: { xs: 0, md: 2 },
				boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
			}}>
			<Grid
				container
				spacing={{ xs: 1, sm: 2, md: 3 }}
				sx={{
					maxHeight: { xs: "60vh", md: "none" },
					overflowY: { xs: "auto", md: "visible" },
				}}>
				{Object.entries(groupedServices).map(([category, services]) => (
					<Grid
						item
						xs={12}
						md={4}
						key={category}
						sx={{
							borderBottom: { xs: `1px solid var(--accent)`, md: "none" },
							pb: { xs: 1.5, md: 0 },
							"&:last-child": { borderBottom: "none" },
						}}>
						<NavLink
							to={`/category/${category}`}
							style={{ textDecoration: "none", background: "none" }}>
							<Typography
								variant='h6'
								sx={{
									color: "var(--primary)",
									fontWeight: 600,
									mb: { xs: 1, md: 2 },
									borderBottom: `2px solid var(--accent)`,
									pb: 0.5,
									position: "relative",
									"&:after": {
										content: '""',
										position: "absolute",
										bottom: -2,
										left: 0,
										width: "0%",
										height: "2px",
										bgcolor: "var(--primary)",
										transition: "width 0.3s ease",
									},
									"&:hover:after": { width: "100%" },
								}}>
								{category}
							</Typography>
						</NavLink>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
							{services.map((service) => (
								<NavLink
									key={service._id}
									to={getServiceRedirectPath(service)} // Use conditional redirect
									style={{ textDecoration: "none" }}>
									<Typography
										sx={{
											py: 0.5,
											px: { xs: 1, md: 0 },
											color: "var(--primary)",
											borderRadius: 1,
											transition: "all 0.2s ease-in-out",
											fontSize: { xs: "0.9rem", md: "1rem" },
											"&:hover": {
												color: "var(--accent)",
												bgcolor: { xs: "var(--background)", md: "transparent" },
												pl: { xs: 2, md: 1 },
												transform: "translateX(4px)",
											},
										}}>
										{service.name}
									</Typography>
								</NavLink>
							))}
						</Box>
					</Grid>
				))}
			</Grid>
		</Paper>
	);
};

export default DropDownMenu;
