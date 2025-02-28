import React from "react";
import "./footer.css";
import { NavLink } from "react-router-dom";

const Footer = () => {
	return (
		<footer className='footer' style={{ position: "absolute", width: "100%" }}>
			{/* Footer Columns */}
			<div className='footer-columns'>
				<div className='footer-column' id='first-f-col'>
					<h3>TAXHARBOR</h3>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos
						optio officia accusantium officiis facere
					</p>
					<p>123, ABC street</p>
					<p>admin@taxharbor.in</p>
					<div className='footer-social'>
						<i class='fa-brands fa-instagram fa-2xl'></i>
						<i class='fa-brands fa-facebook fa-2xl'></i>
						<i class='fa-brands fa-whatsapp fa-2xl'></i>
						<i class='fa-brands fa-x-twitter fa-2xl'></i>
					</div>
				</div>
				<div className='footer-column'>
					<h4>Support</h4>
					<ul>
						<li>
							<a href='#contact'>Contact Us</a>
						</li>
						<li>
							<a href='#faq'>FAQ</a>
						</li>
						<li>
							<a href='#support'>Support Center</a>
						</li>
						<li>
							<a href='#feedback'>Feedback</a>
						</li>
					</ul>
				</div>
				<div className='footer-column'>
					<h4>Services</h4>
					<ul>
						<li>
							<a href='#consulting'>Consulting</a>
						</li>
						<li>
							<a href='#development'>Development</a>
						</li>
						<li>
							<a href='#design'>Design</a>
						</li>
						<li>
							<a href='#marketing'>Marketing</a>
						</li>
					</ul>
				</div>

				<div className='footer-column'>
					<h4>Resources</h4>
					<ul>
						<li>
							<a href='#docs'>Documentation</a>
						</li>
						<li>
							<a href='#guides'>Guides</a>
						</li>
						<li>
							<a href='#partners'>Partners</a>
						</li>
						<li>
							<a href='#community'>Community</a>
						</li>
					</ul>
				</div>
			</div>

			{/* Social Icons Row */}
			<div className='footer-social-icons'>
				<h3 style={{ color: "white" }}>TAXHARBOR</h3>
				<a
					href='https://facebook.com'
					target='_blank'
					rel='noopener noreferrer'>
					<i className='fab fa-facebook-f'></i>
				</a>
				<a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
					<i className='fab fa-twitter'></i>
				</a>
				<a
					href='https://instagram.com'
					target='_blank'
					rel='noopener noreferrer'>
					<i className='fab fa-instagram'></i>
				</a>
				<a
					href='https://linkedin.com'
					target='_blank'
					rel='noopener noreferrer'>
					<i className='fab fa-linkedin-in'></i>
				</a>
			</div>

			{/* Copyright Row */}
			<div className='footer-copyright'>
				&copy; {new Date().getFullYear()} TAXHARBOR. All rights reserved.
			</div>
		</footer>
	);
};

export default Footer;
