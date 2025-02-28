import React, { useEffect, useState, useRef } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "../Admin/utils/axiosConfig";
import ServiceProgress from "./ServiceProgress";
import { useNotification } from "../NotificationContext";

const CDashSection = () => {
	const {
		services,
		user,
		getAllServicesForCDash,
		fetchMessages,
		loading,
		setLoading,
	} = useCustomerAuth();
	const [allServices, setAllServices] = useState([]);
	const sliderRef = useRef(null);

	const { showNotification, setCurrentPage } = useNotification();

	useEffect(() => {
		setCurrentPage("customer");
	}, [setCurrentPage]);

	useEffect(() => {
		const fetchData = async () => {
			const fetchedServices = await getAllServicesForCDash();
			setAllServices(fetchedServices);
		};
		fetchData();
	}, []);

	const scroll = (direction) => {
		if (sliderRef.current) {
			const scrollAmount = sliderRef.current.offsetWidth;
			sliderRef.current.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	const handleServicePurchase = async (service) => {
		setLoading(true);
		const { actualPrice, _id: serviceId } = service;

		try {
			const paymentResponse = await axios.post(
				"http://localhost:8000/api/customers/user-payment",
				{
					amount: actualPrice,
					currency: "INR",
				}
			);

			const { order } = paymentResponse.data;

			const razorpay = new window.Razorpay({
				key: "rzp_test_brvO8EMMhXPsDD",
				amount: actualPrice * 100,
				currency: "INR",
				name: "Tax Filing Services",
				description: `Purchase ${service.name}`,
				order_id: order.id,
				handler: async (response) => {
					await axios.post(
						"http://localhost:8000/api/customers/payment-success",
						{
							razorpay_payment_id: response.razorpay_payment_id,
							amount: actualPrice * 100,
							userId: user._id,
							serviceId,
							order_id: order.id,
						}
					);
					setLoading(false);
					showNotification(`Service "${service.name}" purchased successfully!`);
				},
				prefill: {
					email: user.email,
					contact: user.mobile,
				},
				theme: {
					color: "#3399cc",
				},
			});

			razorpay.open();
		} catch (error) {
			console.error("Error purchasing service:", error);
			showNotification("Service purchase failed. Please try again.");
			setLoading(false);
		}
	};

	return (
		<div className='tax-dashboard-section'>
			<div className='cdashboard-summary'>
				<h1>Welcome, {user?.name}</h1>
				<div>
					<div className='dashboard-card'>
						<p>Total Services: {services.length}</p>
					</div>
					<div className='dashboard-card'>
						<p>
							Total Payments: ₹
							{user?.paymentHistory?.reduce(
								(total, payment) => total + payment.amount,
								0
							) || 0}
						</p>
					</div>
				</div>
			</div>

			<div className='services-container'>
				<div className='services-slider' ref={sliderRef}>
					{allServices.map((service, index) => (
						<div key={index} className='service-card'>
							<h3>{service.name}</h3>
							<p>{service.description}</p>
							<p className='service-price'>Price: ₹{service.actualPrice}</p>
							<button
								onClick={() => handleServicePurchase(service)}
								className='buy-button'>
								Buy Now
							</button>
						</div>
					))}
				</div>
				<div className='slider-controls'>
					<button className='slider-button' onClick={() => scroll("left")}>
						<ChevronLeft />
					</button>
					<button className='slider-button' onClick={() => scroll("right")}>
						<ChevronRight />
					</button>
				</div>
			</div>
		</div>
	);
};

export default CDashSection;
