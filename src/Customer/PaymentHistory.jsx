import React from "react";
import { useCustomerAuth } from "./CustomerAuthContext";

const PaymentHistory = () => {
	const formatDate = (dateStr) => {
		if (!dateStr) return "Not available";
		const date = new Date(dateStr);
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
	};

	const { user, loading } = useCustomerAuth();

	// Calculate total payments from payment history
	const totalPayments =
		user?.paymentHistory?.reduce(
			(total, payment) => total + payment.amount,
			0
		) || 0;

	// Check if there's payment history data
	const hasPaymentHistory =
		user?.paymentHistory && user.paymentHistory.length > 0;

	return (
		<div className='tax-dashboard-services'>
			<div>
				<div style={{ paddingTop: "50px" }}>
					<p>Total Payments: ₹{totalPayments.toFixed(2)}</p>

					{loading ? (
						<p>Loading payment data...</p>
					) : hasPaymentHistory ? (
						<table className='payment-history-table'>
							<thead>
								<tr>
									<th>Date</th>
									<th>Payment ID</th>
									<th>Amount</th>
									<th>Method</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{user.paymentHistory.map((payment, index) => (
									<tr key={index}>
										<td>{formatDate(payment.date)}</td>
										<td>{payment.paymentId}</td>
										<td>₹{payment.amount}</td>
										<td>{payment.paymentMethod}</td>
										<td>{payment.status}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p>No payment history available</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default PaymentHistory;
