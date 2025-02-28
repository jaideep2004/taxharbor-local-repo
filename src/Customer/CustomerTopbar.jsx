import React from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import { useEffect, useState } from "react";

const CustomerTopbar = ({ activeSection }) => {
	const getTitle = () => {
		switch (activeSection) {
			case "Dashboard":
				return "Customer Dashboard";
			case "Service Status":
				return "Service Status";
			case "Documents Upload":
				return "Uploaded Documents";
			case "Payment History":
				return "Payment History";
			case "Profile":
				return "Profile";
			case "Message Center":
				return "Message Center";
			case "Wallet":
				return "Wallet";

			default:
				return "Customer Dashboard";
		}
	};
	const [unreadCount, setUnreadCount] = useState(0);
	const { user, logout, messages } = useCustomerAuth();
	useEffect(() => {
		if (messages) {
			const count = messages.filter(
				(msg) => msg.isRead && msg.isReplied
			).length;
			setUnreadCount(count);
		}
	}, [messages]);

	return (
		<div className='topbar'>
			<div></div>
			<div>
				<h1>{getTitle()}</h1>
			</div>
			<div id='n-cont2'>
				<i class='fa-solid fa-bell fa-2xl'></i>
				{unreadCount > 0 && (
					<div id='t-count2'>{unreadCount > 99 ? "99+" : unreadCount}</div>
				)}
			</div>
		</div>
	);
};

export default CustomerTopbar;
