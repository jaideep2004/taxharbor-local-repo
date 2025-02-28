import React from "react";
import "./section5.css";

const HexagonItem = ({ icon, title, color, className }) => {
	return (
		<div className={`hexagon-wrapper ${className}`}>
			<div className='hexagon-container'>
				<div className='hexagon'>
					<div className='hexagon-content'>
						<i className={`fa-solid fa-${icon} fa-2xl ${color}`} />
					</div>
				</div>
				<h3>{title}</h3>
			</div>
		</div>
	);
};

export default HexagonItem;
