import React from "react";
import { ManagerContext } from "./ManagerContext";

const ManTopbar = ({ activeSection }) => {
	const getTitle = () => {
		switch (activeSection) {
			case "Dashboard":
				return "Manager Dashboard";
			case "Employees":
				return "Employee Management";
			case "Profile":
				return "Profile";
			

			default:
				return "Manager Dashboard";
		}
	};

	return (
		<div className='topbar'>
			<div></div>
			<div>
				<h1>{getTitle()}</h1>
			</div>
			<div></div>
		</div>
	);
};

export default ManTopbar;
