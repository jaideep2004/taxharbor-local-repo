import React, { useState, useEffect } from "react";
import "./header.css";
import { NavLink, useLocation } from "react-router-dom";
import DropDownMenu from "./DropDownMenu";
import {
	AppBar,
	Box,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemText,
	useTheme,
	useMediaQuery,
	Collapse,
	styled,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMore from "@mui/icons-material/ExpandMore";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
	backgroundColor: "var(--primary)",
	boxShadow: "none",
	[theme.breakpoints.up("md")]: {
		display: "none",
	},
}));

const DesktopNav = styled(Box)(({ theme }) => ({
	display: "none",
	width: "100%", // Ensure it takes full width
	[theme.breakpoints.up("md")]: {
		display: "flex",
	},
}));

const Header = () => {
	const theme = useTheme();
	const [mobileOpen, setMobileOpen] = useState(false);
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const location = useLocation();
	const isHomePage = location.pathname === "/";
	let dropdownTimeout;

	useEffect(() => {
		const handleScroll = () => {
			if (isHomePage) {
				setIsScrolled(window.scrollY > 50);
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isHomePage]);

	const handleMouseEnter = () => {
		clearTimeout(dropdownTimeout);
		dropdownTimeout = setTimeout(() => setIsDropdownVisible(true), 200);
	};

	const handleMouseLeave = () => {
		clearTimeout(dropdownTimeout);
		dropdownTimeout = setTimeout(() => setIsDropdownVisible(false), 300);
	};

	const drawerContent = (
		<Box
			sx={{
				width: { xs: "80vw", sm: "50vw", md: "400px" },
				bgcolor: "var(--primary)",
				height: "100%",
				color: "var(--secondary)",
			}}>
			<List>
				<ListItem
					component={NavLink}
					to='/'
					onClick={() => setMobileOpen(false)}>
					<ListItemText primary='Home' style={{ color: "white" }} />
				</ListItem>
				<ListItem onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
					<ListItemText primary='Services' style={{ color: "white" }} />
					<ExpandMore />
				</ListItem>
				<Collapse in={isDropdownVisible}>
					<DropDownMenu />
				</Collapse>
				<ListItem
					component={NavLink}
					to='/resources'
					onClick={() => setMobileOpen(false)}>
					<ListItemText primary='Resources' style={{ color: "white" }} />
				</ListItem>

				<ListItem
					component={NavLink}
					to='/our-story'
					onClick={() => setMobileOpen(false)}>
					<ListItemText primary='Our Story' style={{ color: "white" }} />
				</ListItem>
			</List>
			<NavLink to='/register' style={{ width: "85%" }}>
				<div className='tax-header-btn'>
					<button className='tax5-btn'>
						Register Today <i className='fa-solid fa-arrow-right'></i>
					</button>
				</div>
			</NavLink>
		</Box>
	);

	return (
		<>
			{/* Mobile Header */}
			<StyledAppBar position='fixed'>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						p: { xs: 1.5, sm: 2 }, // Responsive padding
						width: "90%",
						maxWidth: "1200px", // Cap the width
						mx: "auto", // Center it
					}}>
					<Box
						component={NavLink}
						to='/'
						sx={{ color: "var(--secondary)", textDecoration: "none" }}>
						<i
							className='fa-solid fa-money-bills'
							style={{ marginRight: "10px" }}></i>
						TAXHARBOR
					</Box>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						edge='end'
						onClick={() => setMobileOpen(!mobileOpen)}>
						<MenuIcon />
					</IconButton>
				</Box>
			</StyledAppBar>

			{/* Mobile Drawer */}
			<Drawer
				variant='temporary'
				anchor='right'
				open={mobileOpen}
				onClose={() => setMobileOpen(false)}
				ModalProps={{ keepMounted: true }}>
				{drawerContent}
			</Drawer>

			{/* Desktop Header */}
			<DesktopNav>
				<header
					className={`tax-header ${isHomePage && isScrolled ? "scrolled" : ""}`}
					style={{
						backgroundColor: isHomePage
							? isScrolled
								? "white"
								: "transparent"
							: "white",
					}}>
					<div className='tax-header-wrap'>
						<NavLink to='/'>
							<div className='tax-logo'>
								<div
									style={{
										color: isHomePage
											? isScrolled
												? "var(--primary)"
												: "var(--secondary)"
											: "var(--primary)",
									}}>
									<i className='fa-solid fa-money-bills'></i>
									TAX
									<span
										style={{
											color: isHomePage
												? isScrolled
													? "var(--primary)"
													: "var(--secondary)"
												: "var(--primary)",
										}}>
										HARBOR
									</span>
								</div>
							</div>
						</NavLink>

						<div className='tax-nav-wrap'>
							<nav className='tax-top-nav'>
								<NavLink
									to='/'
									className={({ isActive }) =>
										`nav-link ${isActive ? "active" : ""}`
									}
									style={{
										color: isHomePage
											? isScrolled
												? "var(--primary)"
												: "var(--secondary)"
											: "var(--primary)",
									}}>
									Home
								</NavLink>
								<NavLink
									to='/services'
									className={({ isActive }) =>
										`nav-link ${isActive ? "active" : ""}`
									}
									style={{
										color: isHomePage
											? isScrolled
												? "var(--primary)"
												: "var(--secondary)"
											: "var(--primary)",
									}}
									onMouseEnter={handleMouseEnter}
									onMouseLeave={handleMouseLeave}>
									Services
									<i className='fa-solid fa-caret-down'></i>
									{isDropdownVisible && (
										<div
											onMouseEnter={() => clearTimeout(dropdownTimeout)}
											onMouseLeave={handleMouseLeave}>
											<DropDownMenu />
										</div>
									)}
								</NavLink>
								<NavLink
									to='/resources'
									className={({ isActive }) =>
										`nav-link ${isActive ? "active" : ""}`
									}
									style={{
										color: isHomePage
											? isScrolled
												? "var(--primary)"
												: "var(--secondary)"
											: "var(--primary)",
									}}>
									Resources
									<i className='fa-solid fa-caret-down'></i>
								</NavLink>
								<NavLink
									to='/our-story'
									className={({ isActive }) =>
										`nav-link ${isActive ? "active" : ""}`
									}
									style={{
										color: isHomePage
											? isScrolled
												? "var(--primary)"
												: "var(--secondary)"
											: "var(--primary)",
									}}>
									Our Story
								</NavLink>
							</nav>
						</div>

						<NavLink to='/register'>
							<div className='tax-header-btn'>
								<button className='tax5-btn'>
									Register Today <i className='fa-solid fa-arrow-right'></i>
								</button>
							</div>
						</NavLink>
					</div>
				</header>
			</DesktopNav>
		</>
	);
};

export default Header;
