import React from "react";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import "./section7.css";
import CountUp from "react-countup";
const Section7 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);
	const [value1, setValue1] = useState(0); // Slider 1 value
	const [value2, setValue2] = useState(0); // Slider 2 value

	const { ref: slider1Ref, inView: slider1InView } = useInView({
		threshold: 0.5,
	});
	const { ref: slider2Ref, inView: slider2InView } = useInView({
		threshold: 0.5,
	});

	useEffect(() => {
		if (slider1InView) {
			let current1 = 0;
			const interval1 = setInterval(() => {
				if (current1 < 95) {
					current1 += 1;
					setValue1(current1);
				} else {
					clearInterval(interval1);
				}
			}, 10); // Updates every 10ms for smooth animation
		} else {
			setValue1(0); // Reset when out of view
		}
	}, [slider1InView]);

	useEffect(() => {
		if (slider2InView) {
			let current2 = 0;
			const interval2 = setInterval(() => {
				if (current2 < 98) {
					current2 += 1;
					setValue2(current2);
				} else {
					clearInterval(interval2);
				}
			}, 10); // Updates every 10ms for smooth animation
		} else {
			setValue2(0); // Reset when out of view
		}
	}, [slider2InView]);
	const { ref, inView } = useInView({
		triggerOnce: true, // Trigger only once
		threshold: 0.1, // Trigger when 50% of the element is in the view
	});
	return (
		<div id='tax-section7'>
			<div className='tax-section7-wrap'>
				<div className='tax7-left'>
					<img src='./images/sec7banner.jpg' alt='' />
					<div id='tax7-small-count'>
						<div className='tax-section6-col'>
							<div className='tax-user' ref={ref}>
								<i class='fa-solid fa-rocket fa-2xl'></i>
								{inView && (
									<h1>
										<CountUp start={0} end={10} duration={10} />+
									</h1>
								)}
							</div>
							<p>Years Experience</p>
						</div>
						<img src='./images/sec7banner.jpg' alt='' />
						{/* <img src='./images/sec7banner.jpg' alt='' /> */}
					</div>
				</div>
				<div className='tax7-right'>
					{/* <p className='p-tag2'>WORKING AREAS</p> */}
					<h1 data-aos='fade-right' data-aos-duration='800'>
						Why TAXHARBOR ?
					</h1>
					<div className='tax7-list'>
						<p>
							Taxation is the cornerstone of a functioning society, enabling
							governments to fund essential services such as healthcare,
							education, infrastructure, and public safety. Through various
							forms of taxes—such as income tax, corporate tax, and sales tax.
						</p>
						<div className='tax-7list-con'>
							<ul>
								<li>
									<i class='fa-regular fa-circle-check fa-lg'></i>On-demand tax
									support
								</li>
								<li>
									<i class='fa-regular fa-circle-check fa-lg'></i>Your personal
									tax expert
								</li>
								<li>
									<i class='fa-regular fa-circle-check fa-lg'></i>Guaranteed
									accuracy
								</li>
								<li>
									<i class='fa-regular fa-circle-check fa-lg'></i>Guaranteed
									accuracy
								</li>
							</ul>
							<ul>
								<li>
									<i class='fa-regular fa-circle-check fa-lg'></i>On-demand tax
									support
								</li>
								<li>
									<i class='fa-regular fa-circle-check fa-lg'></i>Your personal
									tax expert
								</li>
								<li>
									<i class='fa-regular fa-circle-check fa-lg'></i>Guaranteed
									accuracy
								</li>
								<li>
									<i class='fa-regular fa-circle-check fa-lg'></i>Guaranteed
									accuracy
								</li>
							</ul>
						</div>
						<div className='two-sliders-container'>
							<div className='slider-container' ref={slider1Ref}>
								<div className='slider-label'>{value1}%</div>
								<label htmlFor=''>Saving Strategies</label>
								<input
									type='range'
									min='0'
									max='100'
									value={value1}
									onChange={(e) => setValue1(Number(e.target.value))}
									className='slider'
									style={{
										background: `linear-gradient(to right, var(--primary) ${value1}%, #ddd ${value1}%)`,
									}}
								/>
							</div>

							<div className='slider-container' ref={slider2Ref}>
								<div className='slider-label'>{value2}%</div>
								<label htmlFor=''>Tax Planning</label>
								<input
									type='range'
									min='0'
									max='100'
									value={value2}
									onChange={(e) => setValue2(Number(e.target.value))}
									className='slider'
									style={{
										background: `linear-gradient(to right, var(--accent) ${value2}%, #ddd ${value2}%)`,
									}}
								/>
							</div>
						</div>
						<button className='tax5-btn'>
							View All Industries <i class='fa-solid fa-arrow-right'></i>{" "}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Section7;
