import React, { useEffect, useState, useRef } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "../Admin/utils/axiosConfig";
import ServiceProgress from "./ServiceProgress";
import { useNotification } from "../NotificationContext";
import { useNavigate } from "react-router-dom";

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
	const navigate = useNavigate();

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
							<p>
								<strong>Price:</strong> ₹{service.salePrice}{" "}
								<span className='original-price'>₹{service.actualPrice}</span>
							</p>
							{service.packages && service.packages.length > 0 ? (
								<div className="package-options">
									<p><strong>Available Packages:</strong></p>
									<select className="package-select">
										{service.packages.map((pkg, i) => (
											<option key={i} value={pkg.name}>
												{pkg.name} - ₹{pkg.salePrice}
											</option>
										))}
									</select>
								</div>
							) : null}
							<button
								className='buy-service-btn'
								onClick={() => handleServicePurchase(service)}>
								Purchase
							</button>
						</div>
					))}
				</div>
				<button className='scroll-btn left' onClick={() => scroll("left")}>
					&lt;
				</button>
				<button className='scroll-btn right' onClick={() => scroll("right")}>
					&gt;
				</button>
			</div>

			<div className='active-services-container'>
				<h2>Your Active Services</h2>
				{services.length === 0 ? (
					<p>No active services found. Purchase a service to get started.</p>
				) : (
					<div className='active-services-grid'>
						{services.map((service, index) => {
							const serviceInfo = allServices.find(
								(s) => s._id === service.serviceId
							);
							return (
								<div key={index} className='active-service-card'>
									<div className='service-header'>
										<h3>{serviceInfo?.name}</h3>
										<span className={`status-badge ${service.status.toLowerCase().replace(/\s+/g, '-')}`}>
											{service.status}
										</span>
									</div>
									{service.packageName && (
										<p className="package-info">
											<strong>Package:</strong> {service.packageName}
										</p>
									)}
									<p>
										<strong>Order ID:</strong> {service.orderId}
									</p>
									<p>
										<strong>Processing Days:</strong> {service.processingDays || "7"} days
									</p>
									<p>
										<strong>Due Date:</strong>{" "}
										{service.dueDate
											? new Date(service.dueDate).toLocaleDateString()
											: "Not set"}
									</p>
									<p>
										<strong>Assigned To:</strong>{" "}
										{service.employeeId ? "Yes" : "Not assigned yet"}
									</p>
									<div className='service-actions'>
										<button
											onClick={() =>
												navigate(`/customers/service/${service.serviceId}`)
											}>
											View Details
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default CDashSection;
