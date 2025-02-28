import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ManagerContext } from "./ManagerContext";

const ManSidebar = ({ activeSection, setActiveSection }) => {
	const sections = ["Dashboard", "Employees", "Profile"];

	const { logout, isAuthenticated } = useContext(ManagerContext);
	const navigate = useNavigate();
	const handleLogout = () => {
		logout(); // Clear authentication state
		navigate("/managers/login"); // Redirect to login page
	};

	return (
		<div className='esidebar'>
			<ul>
				{sections.map((section) => (
					<li
						key={section}
						className={activeSection === section ? "li-active" : ""}
						onClick={() => setActiveSection(section)}>
						{section}
					</li>
				))}
				<button onClick={handleLogout}>Logout</button>
			</ul>
		</div>
	);
};

export default ManSidebar;
