import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TestCard from "./TestCard";
import "./section9.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";

const Section9 = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);

	const CustomPrevArrow = (props) => (
		<Box
			className='customprevarrow'
			onClick={props.onClick}
			sx={{ "&:hover": { color: "var(--accent)" } }}>
			<i className='fa-solid fa-circle-arrow-left fa-2xl' />
		</Box>
	);

	const CustomNextArrow = (props) => (
		<Box
			className='customnextarrow'
			onClick={props.onClick}
			sx={{ "&:hover": { color: "var(--accent)" } }}>
			<i className='fa-solid fa-circle-arrow-right fa-2xl' />
		</Box>
	);

	const settings = {
		dots: false,
		infinite: true,
		autoplay: true,
		speed: 700,
		slidesToShow: 1,
		slidesToScroll: 1,
		prevArrow: <CustomPrevArrow />,
		nextArrow: <CustomNextArrow />,
	};

	const testimonials = [
		{
			id: 1,
			img: "./images/t1.png",
			heading: "Data collection and analysis",
			desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa, quis cupiditate veniam quibusdam doloremque eius aperiam ducimus adipisci magni facilis veritatis molestias.",
		},
		{
			id: 2,
			img: "./images/t2.png",
			heading: "Proactive strategy for financial growth",
			desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa, quis cupiditate veniam quibusdam doloremque eius aperiam ducimus adipisci magni facilis veritatis molestias.",
		},
		{
			id: 3,
			img: "./images/t3.png",
			heading: "Proactive strategy for financial growth",
			desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa, quis cupiditate veniam quibusdam doloremque eius aperiam ducimus adipisci magni facilis veritatis molestias.",
		},
		{
			id: 4,
			img: "./images/t4.png",
			heading: "Cash flow planning and tax planning",
			desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa, quis cupiditate veniam quibusdam doloremque eius aperiam ducimus adipisci magni facilis veritatis molestias.",
		},
	];

	return (
		<Box
			className='tax-section9-wrap'
			sx={{
				bgcolor: "var(--background)",
				py: { xs: 4, md: 6 }, // Responsive padding
				px: 2,
				minHeight: "500px",
			}}>
			<Box
				data-aos='fade-down'
				data-aos-duration='800'
				sx={{ textAlign: "center", mb: 4 }}>
				<Typography
					variant='h1'
					sx={{
						color: "var(--primary)",
						fontWeight: 700,
						fontSize: { xs: "2rem", md: "2.7rem" }, // Responsive heading
					}}>
					Our Testimonials
				</Typography>
			</Box>
			<Box
				className='tax9sliderwrap'
				sx={{
					display: "flex",
					flexDirection: { xs: "column", md: "row" }, // Stack on mobile, row on desktop
					alignItems: "center",
					width: "90%",
					maxWidth: "1200px",
					mx: "auto",
					mt: 4,
				}}>
				<Box
					className='slidercont'
					sx={{ flex: 1, maxWidth: { xs: "100%", md: "40%" }, px: 2 }}>
					<Paper elevation={6} sx={{ borderRadius: 2, overflow: "hidden" }}>
						<Slider {...settings}>
							{testimonials.map((testimonial) => (
								<TestCard
									key={testimonial.id}
									img={testimonial.img}
									heading={testimonial.heading}
									desc={testimonial.desc}
								/>
							))}
						</Slider>
					</Paper>
				</Box>
				<Box
					className='tax9-animate'
					sx={{
						flex: 1,
						display: "flex",
						justifyContent: "center",
						mt: { xs: 4, md: 0 }, // Margin-top on mobile only
					}}>
					<Box
						className='solar-system'
						sx={{
							width: { xs: "300px", md: "500px" },
							height: { xs: "300px", md: "500px" },
						}}>
						<Box className='central-image'>
							<img
								src='./images/t1.png'
								alt='Central'
								className='central-img'
							/>
						</Box>
						<Box className='orbit orbit-1'>
							<Box className='planet'>
								<img src='./images/t1.png' alt='Planet 1' />
							</Box>
						</Box>
						<Box className='orbit orbit-2'>
							<Box className='planet'>
								<img src='./images/t2.png' alt='Planet 2' />
							</Box>
						</Box>
						<Box className='orbit orbit-3'>
							<Box className='planet'>
								<img src='./images/t3.png' alt='Planet 3' />
							</Box>
						</Box>
						<Box className='orbit orbit-4'>
							<Box className='planet'>
								<img src='./images/t4.png' alt='Planet 4' />
							</Box>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default Section9;
