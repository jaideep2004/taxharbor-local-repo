import React from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

const Topbar = ({ activeSection, setActiveSection }) => {
	const [unreadCount, setUnreadCount] = useState(0);
	const { logout, isAuthenticated, messages } = useContext(
		AdminDashboardContext
	);
	const navigate = useNavigate();

	const handleLogout = () => {
		logout(); // Clear authentication state
		navigate("/admin/login"); // Redirect to login page
	};

	useEffect(() => {
		if (messages) {
			const count = messages.filter(
				(msg) => !msg.isRead && !msg.isReplied
			).length;
			setUnreadCount(count);
		}
	}, [messages]);

	// 	// Dynamically change the title based on activeSection
	const getTitle = () => {
		switch (activeSection) {
			case "Dashboard":
				return "Admin Dashboard";
			case "Services":
				return "Service Master";
			case "Managers":
				return "Manager Master";
			case "Customers":
				return "Customer Master";
			case "Orders":
				return "Order History";
			case "Employees":
				return "Employee Master";
			case "Message Center":
				return "Message Center";
			case "Withdrawal Requests":
				return "Withdrawal Requests";

			default:
				return "Admin Dashboard";
		}
	};

	const handleNotificationClick = () => {
		setActiveSection("Message Center"); // Update active section to Message Center
	};

	return (
		<div className='topbar'>
			<div></div>
			<div>
				<h1>{getTitle()}</h1>
			</div>

			<div onClick={handleNotificationClick} id='n-cont'>
				<i class='fa-solid fa-bell fa-2xl'></i>
				{unreadCount > 0 && (
					<div id='t-count'>{unreadCount > 99 ? "99+" : unreadCount}</div>
				)}
			</div>
		</div>
	);
};

export default Topbar;
