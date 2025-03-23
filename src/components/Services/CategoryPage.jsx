import React, { useContext, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { AdminDashboardContext } from "../../Admin/AdminDashboardContext";
import {
	Box,
	Typography,
	Grid,
	Button,
	Container,
	Paper,
	useTheme,
	useMediaQuery,
	Chip,
	Tooltip,
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

const CategoryPage = () => {
	const { categoryName } = useParams();
	const { services } = useContext(AdminDashboardContext);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const filteredServices = services.filter(
		(service) => service.category === categoryName && service.isActive !== false
	);

	// Function to determine redirect path based on category
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

	// Get best package (lowest price) for each service
	const getBestPackage = (service) => {
		if (!service.packages || service.packages.length === 0) {
			return null;
		}

		return service.packages.reduce((best, current) => {
			return (best.salePrice < current.salePrice) ? best : current;
		}, service.packages[0]);
	};

	return (
		<Box className='category-page' sx={{ bgcolor: "#f9fafb", pb: 8 }}>
			{/* Banner Section */}
			<Box
				className='category-banner'
				sx={{
					position: "relative",
					backgroundImage:
						"url('https://gtkit.rometheme.pro/gaudit/wp-content/uploads/sites/20/2023/03/Service-Detail-Image.jpg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					py: { xs: 4, md: 6 },
					textAlign: "center",
					color: "white",
					minHeight: { xs: 200, md: 300 },
				}}>
				<Box
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						bgcolor: "rgba(0, 0, 0, 0.6)",
						zIndex: 1,
					}}
				/>
				<Typography
					variant='h1'
					sx={{
						fontWeight: 700,
						fontSize: { xs: "2rem", md: "3rem" },
						textTransform: "uppercase",
						zIndex: 2,
						position: "relative",
						color: "white",
						marginTop: "140px",
					}}>
					{categoryName}
				</Typography>
			</Box>

			{/* Services Header Section */}
			<Container
				maxWidth='lg'
				className='category-wrap-service'
				sx={{ mt: { xs: 4, md: 6 } }}>
				<Box sx={{ textAlign: "center", mb: { xs: 3, md: 5 } }}>
					<Typography
						variant='h3'
						sx={{
							fontWeight: 700,
							color: "var(--primary)",
							mb: 3,
							fontSize: { xs: "1.75rem", md: "2.25rem" },
						}}>
						Our Services in {categoryName}
					</Typography>
				</Box>
				{/* Service Cards Section */}
				<Container maxWidth='lg'>
					<Grid container spacing={3} justifyContent='center'>
						{filteredServices.map((service) => {
							const bestPackage = getBestPackage(service);
							return (
								<Grid item xs={12} sm={6} md={4} key={service._id}>
									<Paper
										elevation={6}
										sx={{
											p: 3,
											borderRadius: 3,
											bgcolor: "white",
											boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
											transition: "transform 0.3s ease, box-shadow 0.3s ease",
											"&:hover": {
												transform: "translateY(-10px)",
												boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
												bgcolor: "linear-gradient(135deg, #ffffff, #f5f7fa)",
											},
										}}>
										<Typography
											variant='h6'
											sx={{
												fontWeight: 700,
												color: "var(--primary)",
												mb: 2,
												fontSize: { xs: "1.25rem", md: "1.5rem" },
											}}>
											{service.name}
										</Typography>
										<Typography
											variant='body2'
											sx={{
												color: "text.secondary",
												mb: 2,
												fontSize: { xs: "0.9rem", md: "1rem" },
												lineHeight: 1.6,
											}}>
											{service.description && service.description.length > 200
												? `${service.description.substring(0, 200)}...`
												: service.description}
										</Typography>
										
										{service.packages && service.packages.length > 0 ? (
											<Box sx={{ mb: 2 }}>
												<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
													<Typography variant='body2' color="text.secondary">
														Starting from:
													</Typography>
													<Tooltip title={`${service.packages.length} package${service.packages.length > 1 ? 's' : ''} available`}>
														<Chip 
															size="small" 
															color="primary" 
															variant="outlined"
															icon={<InfoIcon />} 
															label={`${service.packages.length} package${service.packages.length > 1 ? 's' : ''}`} 
														/>
													</Tooltip>
												</Box>
												<Typography
													variant='h6'
													sx={{
														color: "var(--primary)",
														fontWeight: 600,
														fontSize: { xs: "1rem", md: "1.2rem" },
													}}>
													₹{bestPackage.salePrice}{" "}
													<Typography
														component='span'
														sx={{
															color: "text.secondary",
															textDecoration: "line-through",
															fontSize: "0.9rem",
														}}>
														₹{bestPackage.actualPrice}
													</Typography>
												</Typography>
											</Box>
										) : (
											<Typography variant='body2' sx={{ mb: 2, color: 'text.secondary' }}>
												Contact for pricing details
											</Typography>
										)}
										
										<Button
											component={NavLink}
											to={getServiceRedirectPath(service)}
											variant='contained'
											sx={{
												bgcolor: "var(--primary)",
												color: "var(--secondary)",
												px: 3,
												py: 1,
												borderRadius: 2,
												textTransform: "none",
												"&:hover": {
													bgcolor: "var(--accent)",
												},
											}}>
											View Details
										</Button>
									</Paper>
								</Grid>
							);
						})}
					</Grid>
				</Container>

				{/* Category Description Section */}
				<Box
					sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}
					style={{ marginTop: "70px" }}>
					<Typography
						variant='h5'
						sx={{
							fontWeight: 600,
							color: "var(--primary)",
							mb: 2,
							fontSize: { xs: "1.5rem", md: "1.8rem" },
						}}>
						About {categoryName}
					</Typography>
					<Typography
						variant='body1'
						sx={{
							color: "text.secondary",
							lineHeight: 1.8,
							fontSize: { xs: "0.9rem", md: "1.1rem" },
							maxWidth: "800px",
							mx: "auto",
						}}>
						Here, we provide a comprehensive set of services to cater to your
						needs. Our offerings in {categoryName} ensure top-quality results
						and customer satisfaction. Browse through the services above and
						contact us for more information. We believe in delivering
						exceptional solutions that meet your expectations, and our team is
						dedicated to assisting you every step of the way.
					</Typography>
				</Box>
			</Container>
		</Box>
	);
};

export default CategoryPage;
