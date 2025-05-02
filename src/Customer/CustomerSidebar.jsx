import React from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import "./customer.css";
import { Link } from "react-router-dom";
const Sidebar = ({ activeSection, setActiveSection }) => {
	const sections = [
		"Dashboard",
		"Order History",
		"Documents Upload",
		"Payment History",
		"Profile",
		"Message Center",
		"Wallet",
	];
	const { user, logout } = useCustomerAuth();
	return (
		<div className='csidebar'>
			{/* <center>
				<Link to='/' id='side-home'>
					<div>Go to Home</div>
				</Link>
			</center> */}
			<ul>
				{sections.map((section) => (
					<li
						key={section}
						className={activeSection === section ? "li-active" : ""}
						onClick={() => setActiveSection(section)}>
						{section}
					</li>
				))}
				<button onClick={logout}>Logout</button>
			</ul>
		</div>
	);
};

export default Sidebar;
