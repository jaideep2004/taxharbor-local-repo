import React from "react";
import "./section8.css";
import { useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Section8 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);
	const [value, setValue] = useState(1000); // Default value for the range slider

	const handleChange = (event) => {
		setValue(event.target.value); // Update the state when slider changes
	};
	return (
		<div className='tax-section8'>
			<div className='tax-section8-wrap'>
				<div
					className='tax-section8-right2'
					data-aos='fade-up'
					data-aos-duration='800'>
					{/* <h2>Let’s get started!</h2> */}

					<form action=''>
						<input type='text' placeholder='Name' />
						<div className='fdiv'>
							<input type='email' placeholder='Email' />
							<input type='text' placeholder='Phone No' />
						</div>

						<input type='text' placeholder='Subject' />

						<textarea name='' id='' placeholder='Message'></textarea>
						<button className='tax5-btn'>
							Submit Now <i class='fa-solid fa-arrow-right'></i>{" "}
						</button>
					</form>
				</div>
				<div className='tax-section8-left'>
					{/* <p className='p-tag2'>SCHEDULE AN INTRO CALL</p> */}
					<h1 data-aos='fade-right'
					data-aos-duration='800'>
						Schedule <span>Consultation</span> With Our Team
					</h1>
					<p>
						Taxation is the cornerstone of a functioning society, enabling
						governments to fund essential services such as healthcare,
						education, infrastructure, and public safety.
					</p>

					<div className='tax-8list-con'>
						<ul>
							<li>
								<i class='fa-solid fa-phone fa-xl'></i>
								<div className='tax-8-icontext'>
									<h3>Phone</h3>
									<p>+123456789</p>
								</div>
							</li>
							<li>
								<i class='fa-solid fa-envelope fa-xl'></i>
								<div className='tax-8-icontext'>
									<h3>Email</h3>
									<p>abc@gmail.com</p>
								</div>
							</li>
						</ul>
						<ul>
							<li>
								<i class='fa-solid fa-location-dot fa-xl'></i>
								<div className='tax-8-icontext'>
									<h3>Location</h3>
									<p>ABC Street, XYZ</p>
								</div>
							</li>
							<li>
								<i class='fa-solid fa-globe fa-xl'></i>
								<div className='tax-8-icontext'>
									<h3>Website</h3>
									<p>example.com</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Section8;
