import React from "react";
import "./footer.css";
import { NavLink } from "react-router-dom";

const Footer = () => {
	return (
		<footer className='footer' style={{ position: "absolute", width: "100%" }}>
			{/* Footer Columns */}
			<div className='footer-columns'>
				<div className='footer-column' id='first-f-col'>
					<h3 style={{ fontFamily: "Agbalumo" }}>FinShelter</h3>
					<p>
						Taxation is the cornerstone of a functioning society, enabling
						governments to fund essential services.
					</p>

					<a href='mailto:Info@thefinshelter.com'>
						<p>Info@thefinshelter.com</p>
					</a>
					<div className='footer-social'>
						<a href='https://www.instagram.com/finshelter/'>
							<i class='fa-brands fa-instagram fa-2xl'> </i>
						</a>
						<a href='https://www.facebook.com/profile.php?id=61575009025557'>
							<i class='fa-brands fa-facebook fa-2xl'></i>
						</a>
						<a href='https://wa.me/919537601955'>
							<i class='fa-brands fa-whatsapp fa-2xl'></i>
						</a>
					</div>
				</div>
				<div className='footer-column'>
					<h4>Legal</h4>
					<ul>
						<li>
							<NavLink to='/terms-conditions'>Terms & Conditions</NavLink>
						</li>
						<li>
							<NavLink to='/privacy-policy'>Privacy Policy</NavLink>
						</li>
						<li>
							<NavLink to='/refund-policy'>Refund Policy</NavLink>
						</li>
						<li>
							<NavLink to='/contact-us'>Contact Us</NavLink>
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
				<div style={{ display: "flex", flexDirection: "column" }}>
					<h3 style={{ color: "white", fontSize: "28px" }}>FinShelter</h3>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							marginTop: "10px",
						}}>
						<a
							href='https://www.facebook.com/profile.php?id=61575009025557'
							target='_blank'
							rel='noopener noreferrer'>
							<i className='fab fa-facebook-f fa-xl'></i>
						</a>

						<a
							href='https://www.instagram.com/finshelter/'
							target='_blank'
							rel='noopener noreferrer'>
							<i className='fab fa-instagram fa-xl'></i>
						</a>
						{/* <a
							href='https://linkedin.com'
							target='_blank'
							rel='noopener noreferrer'>
							<i className='fab fa-linkedin-in'></i>
						</a> */}
						<a
							href='https://wa.me/919537601955'
							target='_blank'
							rel='noopener noreferrer'>
							<i className='fab fa-whatsapp fa-xl'></i>
						</a>
					</div>
				</div>
			</div>

			{/* Copyright Row */}
			<div className='footer-copyright'>
				&copy; {new Date().getFullYear()} FINSHELTER. All rights reserved.
			</div>
		</footer>
	);
};

export default Footer;
