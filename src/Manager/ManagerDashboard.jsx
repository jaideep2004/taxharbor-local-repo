// EmployeeDashboard.jsx
import React, { useState, useEffect } from "react";
// import EmSidebar from "./ManSidebar";
import ManSidebar from "./ManSidebar";
// import EmDash from "./ManDash";
import ManDash from "./ManDash";
import { useNotification } from "../NotificationContext";
import ManTopbar from "./ManTopbar";
import ManagerEmployees from "./ManagerEmployees";
import ManagerProfile from "./ManagerProfile";

const ManagerDashboard = () => {
	const [activeSection, setActiveSection] = useState("Dashboard");
	const { showNotification, setCurrentPage } = useNotification();

	useEffect(() => {
		setCurrentPage("manager");
	}, [setCurrentPage]);

	return (
		<div className='employee-dashboard'>
			<ManSidebar
				activeSection={activeSection}
				setActiveSection={setActiveSection}
			/>
			<div className='content1'>
				<ManTopbar activeSection={activeSection} />
				<div className='content'>
					{activeSection === "Dashboard" && <ManDash />}
					{activeSection === "Employees" && <ManagerEmployees />}
					{activeSection === "Profile" && <ManagerProfile />}
				</div>
			</div>
		</div>
	);
};

export default ManagerDashboard;
