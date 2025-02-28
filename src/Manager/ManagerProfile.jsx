import React, { useContext, useState, useEffect } from "react";
import { ManagerContext } from "./ManagerContext";

const ManagerProfile = () => {
	const {
		user,
		formData,
		handleSaveProfile,
		loading,
		handleFieldUpdate,
		setFormData,
	} = useContext(ManagerContext);

	const [editableField, setEditableField] = useState("");
	const [activeTab, setActiveTab] = useState("profile");
	const [localFormData, setLocalFormData] = useState({});

	useEffect(() => {
		if (user) {
			// Initialize local form data with user info
			setLocalFormData({
				...user,
				// Convert date fields to proper format
				dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
				dateOfJoining: user.dateOfJoining
					? new Date(user.dateOfJoining).toISOString().split("T")[0]
					: "",
				currentOrgRelieveDate: user.currentOrgRelieveDate
					? new Date(user.currentOrgRelieveDate).toISOString().split("T")[0]
					: "",
				previousOrgFromDate: user.previousOrgFromDate
					? new Date(user.previousOrgFromDate).toISOString().split("T")[0]
					: "",
				previousOrgToDate: user.previousOrgToDate
					? new Date(user.previousOrgToDate).toISOString().split("T")[0]
					: "",
				passingMonthYear: user.passingMonthYear
					? new Date(user.passingMonthYear).toISOString().split("T")[0]
					: "",
			});
		}
	}, [user]);

	const handleFieldEdit = (field) => {
		setEditableField(field);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setLocalFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		handleFieldUpdate(name, value);
	};

	const getProfileInitial = () => {
		return localFormData?.name ? localFormData.name.charAt(0) : "?";
	};

	const renderTabContent = (tab) => {
		const fields = {
			profile: [
				{ label: "Manager Code", name: "_id", value: localFormData._id },
				{ label: "Full Name", name: "fullName", value: localFormData.fullName },
				{ label: "Email", name: "email", value: localFormData.email },
				{
					label: "Phone Number",
					name: "phoneNumber",
					value: localFormData.phoneNumber,
				},
				{
					label: "Date of Birth",
					name: "dob",
					value: localFormData.dob,
					type: "date",
				},
				{ label: "Gender", name: "gender", value: localFormData.gender },
				{
					label: "Date of Joining",
					name: "dateOfJoining",
					value: localFormData.dateOfJoining,
					type: "date",
				},
				{
					label: "Designation",
					name: "designation",
					value: localFormData.designation,
				},
				{
					label: "L1 Employee Code",
					name: "L1EmpCode",
					value: localFormData.L1EmpCode,
				},
				{ label: "L1 Name", name: "L1Name", value: localFormData.L1Name },
				{
					label: "L2 Employee Code",
					name: "L2Empcode",
					value: localFormData.L2Empcode,
				},
			],
			taxInfo: [
				{ label: "PAN", name: "pan", value: localFormData.pan },
				{ label: "GSTIN", name: "gst", value: localFormData.gst },
				{ label: "TAN", name: "tan", value: localFormData.tan },
			],
			communicationinfo: [
				{
					label: "Full Address",
					name: "fulladdress",
					value: localFormData.fulladdress,
				},
				{ label: "City", name: "city", value: localFormData.city },
				{ label: "State", name: "state", value: localFormData.state },
				{ label: "Country", name: "country", value: localFormData.country },
				{
					label: "Postal Code",
					name: "postalCode",
					value: localFormData.postalCode,
				},
			],
			professionalinfo: [
				{
					label: "Position Code",
					name: "positionCode",
					value: localFormData.positionCode,
				},
				{
					label: "Department Code",
					name: "departmentCode",
					value: localFormData.departmentCode,
				},
				{
					label: "Department Name",
					name: "departmentName",
					value: localFormData.departmentName,
				},
			],
			employmentinfo: [
				{
					label: "Previous Organization",
					name: "previousOrganization",
					value: localFormData.previousOrganization,
				},
				{
					label: "From Date",
					name: "previousOrgFromDate",
					value: localFormData.previousOrgFromDate,
					type: "date",
				},
				{
					label: "To Date",
					name: "previousOrgToDate",
					value: localFormData.previousOrgToDate,
					type: "date",
				},
				{
					label: "Total Experience",
					name: "totalExperience",
					value: localFormData.totalExperience,
				},
			],
			educationinfo: [
				{
					label: "Education Qualification",
					name: "educationQualification",
					value: localFormData.educationQualification,
				},
				{
					label: "University",
					name: "university",
					value: localFormData.university,
				},
				{
					label: "Month & Year of Passing",
					name: "passingMonthYear",
					value: localFormData.passingMonthYear,
					type: "date",
				},
				{
					label: "Certifications",
					name: "certifications",
					value: localFormData.certifications,
				},
			],
			metrics: [
				{
					label: "Total Assigned Employees",
					name: "totalEmployees",
					value: user?.metrics?.totalEmployees || 0,
					readonly: true,
				},
				{
					label: "Total Assigned Customers",
					name: "totalCustomers",
					value: user?.metrics?.totalCustomers || 0,
					readonly: true,
				},
				{
					label: "Total Services",
					name: "totalServices",
					value: user?.metrics?.totalServices || 0,
					readonly: true,
				},
			],
		};

		return (
			<div className='tab-content'>
				<h3>{tab.replace(/([A-Z])/g, " $1").trim()}</h3>
				{fields[tab].map((field) => (
					<div key={field.name} className='field-row'>
						<label htmlFor={field.name}>{field.label}:</label>
						{field.type === "date" ? (
							<input
								id={field.name}
								name={field.name}
								type='date'
								value={field.value || ""}
								onChange={handleInputChange}
								className={editableField === field.name ? "editable" : ""}
								disabled={editableField !== field.name || field.readonly}
							/>
						) : (
							<input
								id={field.name}
								name={field.name}
								value={field.value || ""}
								onChange={handleInputChange}
								className={editableField === field.name ? "editable" : ""}
								disabled={editableField !== field.name || field.readonly}
							/>
						)}
						{!field.readonly && (
							<i
								className='fa-solid fa-pen-to-square edit-icon'
								onClick={() => handleFieldEdit(field.name)}
							/>
						)}
					</div>
				))}
			</div>
		);
	};

	return (
		<div className='profile-container'>
			<div className='psidebar'>
				<ul>
					<li
						onClick={() => setActiveTab("profile")}
						className={activeTab === "profile" ? "selected" : ""}>
						Basic Profile
					</li>
					<li
						onClick={() => setActiveTab("taxInfo")}
						className={activeTab === "taxInfo" ? "selected" : ""}>
						Tax Info
					</li>
					<li
						onClick={() => setActiveTab("communicationinfo")}
						className={activeTab === "communicationinfo" ? "selected" : ""}>
						Communication Info
					</li>
					<li
						onClick={() => setActiveTab("professionalinfo")}
						className={activeTab === "professionalinfo" ? "selected" : ""}>
						Professional Information
					</li>
					<li
						onClick={() => setActiveTab("employmentinfo")}
						className={activeTab === "employmentinfo" ? "selected" : ""}>
						Employment Info
					</li>
					<li
						onClick={() => setActiveTab("educationinfo")}
						className={activeTab === "educationinfo" ? "selected" : ""}>
						Education Info
					</li>
					<li
						onClick={() => setActiveTab("metrics")}
						className={activeTab === "metrics" ? "selected" : ""}>
						Manager Metrics
					</li>
				</ul>
			</div>
			<div className='content'>
				<div className='profile-header'>
					<div className='profile-icon'>{getProfileInitial()}</div>
					<h2>{localFormData?.name}</h2>
				</div>
				{renderTabContent(activeTab)}
				<div className='save-button-container'>
					<button
						className='save-button'
						onClick={handleSaveProfile}
						disabled={loading}>
						{loading ? "Saving..." : "Save Profile"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ManagerProfile;
