import React from "react";
import { useCustomerAuth } from "./CustomerAuthContext";

const PaymentHistory = () => {
	const formatDate = (dateStr) => {
		if (!dateStr) return "Not available";
		const date = new Date(dateStr);
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
	};

	const { user, paymentHistory, loading } = useCustomerAuth();

	const totalPayments =
		user?.paymentHistory?.reduce(
			(total, payment) => total + payment.amount,
			0
		) || 0;

	return (
		<div className='tax-dashboard-services'>
			<div>
				<div>
					{user?.paymentHistory?.length > 0 ? (
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
										<td>
											{formatDate(new Date(payment.date).toLocaleDateString())}
										</td>
										<td>{payment.paymentId}</td>
										<td>₹{payment.amount}</td>
										<td>{payment.paymentMethod}</td>
										<td>{payment.status}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p>No recent activity</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default PaymentHistory;
