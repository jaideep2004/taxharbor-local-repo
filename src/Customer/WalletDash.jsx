import React, { useState, useEffect } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import {
	Box,
	Container,
	Grid,
	Paper,
	Typography,
	TextField,
	Button,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	IconButton,
	Divider,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Chip,
	Card,
	CardContent,
	Stack,
	Tooltip,
} from "@mui/material";
import {
	AccountBalance as WalletIcon,
	ArrowUpward as ArrowUpIcon,
	ArrowDownward as ArrowDownIcon,
	ContentCopy as CopyIcon,
	Share as ShareIcon,
	Person as PersonIcon,
} from "@mui/icons-material";
import axios from "axios";

// Bank Details Dialog Component
const WithdrawalDialog = ({ open, onClose, onSubmit, loading }) => {
	const [bankDetails, setBankDetails] = useState({
		accountNumber: "",
		confirmAccountNumber: "",
		accountHolderName: "",
		bankName: "",
		ifscCode: "",
		accountType: "",
	});

	const [errors, setErrors] = useState({});

	const validateForm = () => {
		const newErrors = {};
		if (!bankDetails.accountNumber) newErrors.accountNumber = "Required";
		if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
			newErrors.confirmAccountNumber = "Account numbers do not match";
		}
		if (!bankDetails.accountHolderName)
			newErrors.accountHolderName = "Required";
		if (!bankDetails.bankName) newErrors.bankName = "Required";
		if (!bankDetails.ifscCode) {
			newErrors.ifscCode = "Required";
		} else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifscCode)) {
			newErrors.ifscCode = "Invalid IFSC code format";
		}
		if (!bankDetails.accountType) newErrors.accountType = "Required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => validateForm() && onSubmit(bankDetails);

	return (
		<Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
			<DialogTitle>
				<Stack direction='row' alignItems='center' spacing={1}>
					<WalletIcon />
					<Typography variant='h6'>Bank Account Details</Typography>
				</Stack>
			</DialogTitle>
			<DialogContent>
				<Stack spacing={3} sx={{ mt: 2 }}>
					<TextField
						fullWidth
						label='Account Number'
						value={bankDetails.accountNumber}
						onChange={(e) =>
							setBankDetails({ ...bankDetails, accountNumber: e.target.value })
						}
						error={!!errors.accountNumber}
						helperText={errors.accountNumber}
						type='password'
					/>

					<TextField
						fullWidth
						label='Confirm Account Number'
						value={bankDetails.confirmAccountNumber}
						onChange={(e) =>
							setBankDetails({
								...bankDetails,
								confirmAccountNumber: e.target.value,
							})
						}
						error={!!errors.confirmAccountNumber}
						helperText={errors.confirmAccountNumber}
					/>

					<TextField
						fullWidth
						label='Account Holder Name'
						value={bankDetails.accountHolderName}
						onChange={(e) =>
							setBankDetails({
								...bankDetails,
								accountHolderName: e.target.value,
							})
						}
						error={!!errors.accountHolderName}
						helperText={errors.accountHolderName}
					/>

					<TextField
						fullWidth
						label='Bank Name'
						value={bankDetails.bankName}
						onChange={(e) =>
							setBankDetails({ ...bankDetails, bankName: e.target.value })
						}
						error={!!errors.bankName}
						helperText={errors.bankName}
					/>

					<TextField
						fullWidth
						label='IFSC Code'
						value={bankDetails.ifscCode}
						onChange={(e) =>
							setBankDetails({
								...bankDetails,
								ifscCode: e.target.value.toUpperCase(),
							})
						}
						error={!!errors.ifscCode}
						helperText={errors.ifscCode}
					/>

					<FormControl fullWidth error={!!errors.accountType}>
						<InputLabel>Account Type</InputLabel>
						<Select
							value={bankDetails.accountType}
							onChange={(e) =>
								setBankDetails({ ...bankDetails, accountType: e.target.value })
							}
							label='Account Type'>
							<MenuItem value='savings'>Savings</MenuItem>
							<MenuItem value='current'>Current</MenuItem>
						</Select>
					</FormControl>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={loading}>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					variant='contained'
					disabled={loading}
					startIcon={loading && <CircularProgress size={20} />}>
					{loading ? "Processing..." : "Submit"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

// Main WalletDash Component
const WalletDash = () => {
	const {
		wallet,
		fetchWalletDetails,
		requestWithdrawal,
		referralStats,
		fetchReferralStats,
		user,
	} = useCustomerAuth();

	const [withdrawAmount, setWithdrawAmount] = useState("");
	const [loading, setLoading] = useState(false);
	const [dataLoading, setDataLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showBankDetails, setShowBankDetails] = useState(false);

	useEffect(() => {
		const loadData = async () => {
			setDataLoading(true);
			setError(null);
			try {
				await Promise.all([fetchWalletDetails(), fetchReferralStats()]);
			} catch (error) {
				console.error("Error loading wallet data:", error);
				setError("Failed to load wallet data. Please try again later.");
			} finally {
				setDataLoading(false);
			}
		};
		loadData();
	}, []);

	const handleWithdrawal = async (e) => {
		e.preventDefault();
		if (!withdrawAmount) {
			alert("Please enter withdrawal amount");
			return;
		}
		setShowBankDetails(true);
	};

	const handleBankDetailsSubmit = async (bankDetails) => {
		const token = localStorage.getItem("customerToken");
		setLoading(true);
		try {
			await axios.post(
				"https://195-35-45-82.sslip.io:8000/api/customers/update-bank-details",
				{
					bankDetails,
					userId: user._id,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			await requestWithdrawal(Number(withdrawAmount));
			setWithdrawAmount("");
			await fetchWalletDetails();
			setShowBankDetails(false);
		} catch (error) {
			console.error("Withdrawal error:", error);
			alert(error.response?.data?.message || "Failed to process withdrawal");
		} finally {
			setLoading(false);
		}
	};

	if (dataLoading) {
		return (
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				minHeight='400px'>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box p={4} textAlign='center'>
				<Typography color='error'>{error}</Typography>
			</Box>
		);
	}

	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
	};

	return (
		<Container maxWidth='lg'>
			<Grid container spacing={3}>
				{/* Balance Card */}
				<Grid item xs={12}>
					<Paper elevation={3} sx={{ p: 3 }}>
						<Stack direction='row' alignItems='center' spacing={2} mb={2}>
							<WalletIcon color='primary' />
							<Typography variant='h5'>Wallet Balance</Typography>
						</Stack>
						<Typography variant='h3' component='div' gutterBottom>
							₹{referralStats?.balance || 0}
						</Typography>
						<Stack direction='row' alignItems='center' spacing={2} mb={2}>
							<WalletIcon color='primary' />
							<Typography variant='h5'>Referral Earnings</Typography>
						</Stack>
						<Typography variant='h3' component='div' gutterBottom>
							₹{referralStats?.totalEarnings || 0}
						</Typography>

						<Divider sx={{ my: 2 }} />

						<Typography variant='subtitle2' color='text.secondary' gutterBottom>
							Your Referral Code
						</Typography>
						<Stack direction='row' spacing={2} alignItems='center'>
							<Paper
								variant='outlined'
								sx={{ px: 2, py: 1, bgcolor: "grey.50" }}>
								<Typography variant='body2' fontFamily='monospace'>
									{user?.referralCode || wallet?.referralCode || "Loading..."}
								</Typography>
							</Paper>
							<Tooltip title='Copy Code'>
								<IconButton
									onClick={() =>
										navigator.clipboard.writeText(
											user?.referralCode || wallet?.referralCode
										)
									}
									size='small'>
									<CopyIcon />
								</IconButton>
							</Tooltip>
							<Tooltip title='Share'>
								<IconButton
									onClick={() => {
										const referralCode =
											user?.referralCode || wallet?.referralCode;
										if (window.navigator.share) {
											window.navigator.share({
												title: "Join me on Our Platform",
												text: `Use my referral code ${referralCode} to sign up!`,
												url: window.location.origin,
											});
										}
									}}
									size='small'>
									<ShareIcon />
								</IconButton>
							</Tooltip>
						</Stack>
					</Paper>
				</Grid>

				{/* Transactions and Withdrawal Section */}
				<Grid item xs={12} md={6}>
					<Paper elevation={3} sx={{ height: "100%" }}>
						<Box p={3}>
							<Typography variant='h6' gutterBottom>
								Recent Transactions
							</Typography>
							<List>
								{wallet?.transactions.map((transaction) => (
									<ListItem
										key={transaction.transactionId}
										divider
										secondaryAction={
											<Typography
												color={
													transaction.type === "credit"
														? "success.main"
														: "error.main"
												}>
												{transaction.type === "credit" ? "+" : "-"}₹
												{transaction.amount}
											</Typography>
										}>
										<ListItemIcon>
											{transaction.type === "credit" ? (
												<ArrowDownIcon color='success' />
											) : (
												<ArrowUpIcon color='error' />
											)}
										</ListItemIcon>
										<ListItemText
											primary={transaction.description}
											secondary={formatDate(
												new Date(transaction.createdAt).toLocaleDateString()
											)}
										/>
									</ListItem>
								))}
							</List>
						</Box>
					</Paper>
				</Grid>

				{/* Withdrawal Section */}
				<Grid item xs={12} md={6}>
					<Paper elevation={3} sx={{ height: "100%" }}>
						<Box p={3}>
							<Typography variant='h6' gutterBottom>
								Withdrawal
							</Typography>
							<form onSubmit={handleWithdrawal}>
								<Stack direction='row' spacing={2} mb={3}>
									<TextField
										fullWidth
										type='number'
										label='Amount'
										value={withdrawAmount}
										onChange={(e) => setWithdrawAmount(e.target.value)}
										InputProps={{
											startAdornment: (
												<Typography color='text.secondary'>₹</Typography>
											),
										}}
										inputProps={{
											min: "1",
											max: wallet?.balance,
										}}
									/>
									<Button
										type='submit'
										variant='contained'
										disabled={loading || !withdrawAmount}
										sx={{ minWidth: 120 }}>
										{loading ? <CircularProgress size={24} /> : "Withdraw"}
									</Button>
								</Stack>
							</form>

							<Typography variant='subtitle2' gutterBottom>
								Withdrawal History
							</Typography>
							<List>
								{wallet?.withdrawalRequests.map((request) => (
									<ListItem
										key={request.requestId}
										divider
										secondaryAction={
											<Chip
												label={request.status}
												color={
													request.status === "approved"
														? "success"
														: request.status === "rejected"
														? "error"
														: "warning"
												}
												size='small'
											/>
										}>
										<ListItemText
											primary={`₹${request.amount}`}
											secondary={formatDate(
												new Date(request.createdAt).toLocaleDateString()
											)}
										/>
									</ListItem>
								))}
							</List>
						</Box>
					</Paper>
				</Grid>

				{/* Referred Users Section */}
				{referralStats.referredUsers.length > 0 && (
					<Grid item xs={12}>
						<Paper elevation={3} sx={{ p: 3 }}>
							<Typography variant='h6' gutterBottom>
								Referred Users
							</Typography>
							<Grid container spacing={2}>
								{referralStats.referredUsers.map((user) => (
									<Grid item xs={12} sm={6} md={4} key={user.email}>
										<Card variant='outlined'>
											<CardContent>
												<Stack direction='row' spacing={2} alignItems='center'>
													<PersonIcon color='primary' />
													<Box>
														<Typography variant='subtitle1'>
															{user.name}
														</Typography>
														<Typography variant='body2' color='text.secondary'>
															{user.email}
														</Typography>
														<Typography
															variant='caption'
															color='text.secondary'>
															Joined{" "}
															{formatDate(
																new Date(user.joinedAt).toLocaleDateString()
															)}
														</Typography>
													</Box>
												</Stack>
											</CardContent>
										</Card>
									</Grid>
								))}
							</Grid>
						</Paper>
					</Grid>
				)}
			</Grid>

			<WithdrawalDialog
				open={showBankDetails}
				onClose={() => setShowBankDetails(false)}
				onSubmit={handleBankDetailsSubmit}
				loading={loading}
			/>
		</Container>
	);
};

export default WalletDash;
