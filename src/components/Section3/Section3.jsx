import React from "react";
import "./section3.css";
import TaxFlipbox from "../FlipboxSection/TaxFlipbox";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
const Section3 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);
	return (
		<div id='tax-section3'>
			{/* <p className='p-tag2' data-aos='fade-down' data-aos-duration='800'>
				SERVICES
			</p> */}
			<h1 data-aos='fade-down' data-aos-duration='800'>
				Our Services
			</h1>
			<div className='tax-section3-wrap'>
				<div
					className='tax-section3-card rotate-up'
					data-aos='fade-up'
					data-aos-duration='850'>
					<img src='./images/i2.jpg' alt='' />
					<div className='tax3-card-desc'>
						<h2>Funding</h2>
						<p>
							FinShelter offers tailored loan solutions for personal and
							business needs. From personal loans and home financing to business
							and vehicle loans, we provide quick approvals, flexible terms, and
							competitive rates, ensuring a seamless borrowing experience with
							expert guidance at every step to meet your financial goals
						</p>
						<a href=''>
							View Detail <i class='fa-solid fa-circle-arrow-right fa-xl'></i>{" "}
						</a>
					</div>
				</div>
				<div
					className='tax-section3-card rotate-up2'
					data-aos='fade-up'
					data-aos-duration='850'>
					<img src='./images/i3.jpg' alt='' />
					<div className='tax3-card-desc'>
						<h2>Mutual Funds</h2>
						<p>
							FinShelter provides expert mutual fund distribution services to
							achieve your financial goals. With personalized recommendations
							and access to diverse investment options, we ensure your funds are
							managed professionally with transparency, maximizing growth
							potential through strategic planning and reliable support tailored
							to your unique needs.
						</p>
						<a href=''>
							View Detail <i class='fa-solid fa-circle-arrow-right fa-xl'></i>{" "}
						</a>
					</div>
				</div>
				<div
					className='tax-section3-card rotate-up'
					data-aos='fade-up'
					data-aos-duration='900'>
					<img src='./images/i4.jpg' alt='' />
					<div className='tax3-card-desc'>
						<h2>Taxation</h2>
						<p>
							FinShelter offers reliable taxation solutions, including ITR
							filing, GST compliance, and ROC services. We simplify complex
							processes, ensure accuracy, and provide expert guidance for a
							hassle-free experience, helping you meet regulatory requirements
							with confidence and efficiency while supporting your financial and
							business objectives.
						</p>
						<a href=''>
							View Detail <i class='fa-solid fa-circle-arrow-right fa-xl'></i>{" "}
						</a>
					</div>
				</div>
				<div
					className='tax-section3-card rotate-up2'
					data-aos='fade-up'
					data-aos-duration='900'>
					<img src='./images/i1.jpg' alt='' />
					<div className='tax3-card-desc'>
						<h2>Insurance</h2>
						<p>
							FinShelter provides comprehensive insurance solutions to secure
							your future. From life and health to property and vehicle
							coverage, we offer trusted advice and tailored plans to protect
							what matters most, ensuring peace of mind with reliable,
							customized options designed for your personal and business needs.
						</p>
						<a href=''>
							View Detail <i class='fa-solid fa-circle-arrow-right fa-xl'></i>{" "}
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Section3;
