import React, { useContext } from "react";
import { EmployeeContext } from "./EmployeeContext";
import { useState, useEffect } from "react";

const EmTopbar = ({ activeSection }) => {
	const getTitle = () => {
		switch (activeSection) {
			case "Dashboard":
				return "Employee Dashboard";
			case "Customers":
				return "Assigned Orders";
			case "Customer Queries":
				return "Customer Queries";
			case "Profile":
				return "Profile";

			default:
				return "Employee Dashboard";
		}
	};
	const { queries } = useContext(EmployeeContext);
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		if (queries) {
			const count = queries.filter((qry) => !qry.isRead && !qry.isReplied).length;
			setUnreadCount(count);
		}
	}, [queries]);

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

export default EmTopbar;
