import React, { useContext, useState, useMemo } from "react";
import { AdminDashboardContext } from "./AdminDashboardContext";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";
import { useNotification } from "../NotificationContext";

const LeadsSection = () => {
    const {
        leads,
        employees,
        loading,
        error,
        handleAssignLead,
        handleConvertLead,
        fetchAllLeads,
    } = useContext(AdminDashboardContext);

    const { showNotification } = useNotification();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOption, setFilterOption] = useState("newest");
    const [dateFilter, setDateFilter] = useState({ fromDate: "", toDate: "" });
    const [statusFilter, setStatusFilter] = useState("all");

    // State for lead assignment
    const [assigningLeadId, setAssigningLeadId] = useState(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

    // State for lead conversion
    const [convertingLeadId, setConvertingLeadId] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState({
        amount: "",
        method: "cash",
        reference: "",
    });

    // Helper functions
    const normalizeDate = (dateStr) => {
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);
        return date;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "Not available";
        const date = new Date(dateStr);
        const options = { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" };
        return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
    };

    // Filter leads
    const filteredLeads = useMemo(() => {
        return leads
            .filter((lead) => {
                const lowerSearchTerm = searchTerm.toLowerCase();
                return (
                    lead.name.toLowerCase().includes(lowerSearchTerm) ||
                    lead.email.toLowerCase().includes(lowerSearchTerm) ||
                    lead._id.toLowerCase().includes(lowerSearchTerm)
                );
            })
            .filter((lead) => {
                // Filter by status
                if (statusFilter !== "all") {
                    return lead.status === statusFilter;
                }
                return true;
            })
            .filter((lead) => {
                // Filter by date
                const leadDate = new Date(lead.createdAt);
                const fromDate = dateFilter.fromDate
                    ? normalizeDate(dateFilter.fromDate)
                    : null;
                const toDate = dateFilter.toDate
                    ? normalizeDate(dateFilter.toDate)
                    : null;

                return (
                    (fromDate === null || leadDate >= fromDate) &&
                    (toDate === null || leadDate <= toDate)
                );
            })
            .sort((a, b) => {
                if (filterOption === "newest") {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                } else if (filterOption === "alphabetical") {
                    return a.name.localeCompare(b.name);
                }
                return 0;
            });
    }, [leads, searchTerm, dateFilter, filterOption, statusFilter]);

    // Lead assignment handlers
    const startAssigningLead = (leadId) => {
        setAssigningLeadId(leadId);
        setSelectedEmployeeId("");
    };

    const confirmAssignLead = async () => {
        if (!selectedEmployeeId) {
            showNotification("Please select an employee", "error");
            return;
        }

        const success = await handleAssignLead(assigningLeadId, selectedEmployeeId);
        if (success) {
            setAssigningLeadId(null);
            setSelectedEmployeeId("");
            fetchAllLeads();
        }
    };

    // Lead conversion handlers
    const startConvertingLead = (leadId) => {
        setConvertingLeadId(leadId);
        setPaymentDetails({
            amount: "",
            method: "cash",
            reference: "",
        });
    };

    const confirmConvertLead = async () => {
        if (!paymentDetails.amount) {
            showNotification("Please enter payment amount", "error");
            return;
        }

        const success = await handleConvertLead(convertingLeadId, paymentDetails);
        if (success) {
            setConvertingLeadId(null);
            setPaymentDetails({
                amount: "",
                method: "cash",
                reference: "",
            });
            fetchAllLeads();
        }
    };

    const clearAllFilters = () => {
        setSearchTerm("");
        setFilterOption("newest");
        setDateFilter({ fromDate: "", toDate: "" });
        setStatusFilter("all");
    };

    if (loading) return <div>Loading leads...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="tax-dashboard-leads">
            <div className="filter-div">
                <input
                    type="text"
                    placeholder="Search by Name, Email or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="new">New</option>
                        <option value="assigned">Assigned</option>
                        <option value="accepted">Accepted</option>
                        <option value="declined">Declined</option>
                        <option value="converted">Converted</option>
                    </select>
                    <input
                        type="date"
                        placeholder="From Date"
                        value={dateFilter.fromDate}
                        onChange={(e) =>
                            setDateFilter({ ...dateFilter, fromDate: e.target.value })
                        }
                    />
                    <input
                        type="date"
                        placeholder="To Date"
                        value={dateFilter.toDate}
                        onChange={(e) =>
                            setDateFilter({ ...dateFilter, toDate: e.target.value })
                        }
                    />
                </div>
                <div className="table-bottom-btns">
                    <button
                        className="tax-service-btn"
                        onClick={clearAllFilters}
                        style={{ backgroundColor: "var(--accent)" }}
                    >
                        <i className="fa-solid fa-rotate-left"></i>
                    </button>
                    <button className="tax-service-btn" onClick={() => fetchAllLeads()}>
                        <i className="fa-solid fa-refresh"></i>
                    </button>
                </div>
            </div>

            <div className="tax-services-wrap-table">
                <table>
                    <thead>
                        <tr>
                            <th>Lead ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Service</th>
                            <th>Created At</th>
                            <th>Status</th>
                            <th>Assigned To</th>
                            <th>Message</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeads.length === 0 ? (
                            <tr>
                                <td colSpan="10" style={{ textAlign: "center" }}>
                                    No leads found
                                </td>
                            </tr>
                        ) : (
                            filteredLeads.map((lead) => (
                                <tr key={lead._id}>
                                    <td>{lead._id}</td>
                                    <td>{lead.name}</td>
                                    <td>{lead.email}</td>
                                    <td>{lead.mobile}</td>
                                    <td>{lead.serviceId?.name || "Unknown Service"}</td>
                                    <td>{formatDate(lead.createdAt)}</td>
                                    <td>
                                        <span
                                            className={`status-badge status-${lead.status}`}
                                            style={{
                                                padding: "5px 10px",
                                                borderRadius: "15px",
                                                backgroundColor: 
                                                    lead.status === "new" ? "#94c2f3" :
                                                    lead.status === "assigned" ? "#ffcc80" :
                                                    lead.status === "accepted" ? "#a5d6a7" :
                                                    lead.status === "declined" ? "#ef9a9a" :
                                                    lead.status === "converted" ? "#81c784" : "#e0e0e0",
                                                color: "#000",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>
                                        {lead.assignedToEmployee?.name || 
                                         (lead.assignedToEmployee ? "Employee ID: " + lead.assignedToEmployee : "Not Assigned")}
                                    </td>
                                    <td>
                                        <div style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {lead.message || "No message"}
                                        </div>
                                    </td>
                                    <td className="tax-btn-cont">
                                        {lead.status === "new" && (
                                            <button
                                                className="tax-service-btn"
                                                onClick={() => startAssigningLead(lead._id)}
                                            >
                                                Assign
                                            </button>
                                        )}
                                        {lead.status === "accepted" && (
                                            <button
                                                className="tax-service-btn"
                                                onClick={() => startConvertingLead(lead._id)}
                                            >
                                                Convert
                                            </button>
                                        )}
                                        {lead.status === "declined" && (
                                            <button
                                                className="tax-service-btn"
                                                onClick={() => startAssigningLead(lead._id)}
                                            >
                                                Reassign
                                            </button>
                                        )}
                                        {lead.status === "converted" && (
                                            <button
                                                className="tax-service-btn"
                                                disabled
                                            >
                                                Converted ({lead.convertedToOrderId})
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Assign Lead Dialog */}
            <Dialog open={assigningLeadId !== null} onClose={() => setAssigningLeadId(null)}>
                <DialogTitle>Assign Lead</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select an employee to assign this lead to:
                    </DialogContentText>
                    <Select
                        fullWidth
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                        margin="dense"
                    >
                        <MenuItem value="" disabled>
                            Select an employee
                        </MenuItem>
                        {employees.map((employee) => (
                            <MenuItem key={employee._id} value={employee._id}>
                                {employee.name} ({employee.email})
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAssigningLeadId(null)}>Cancel</Button>
                    <Button onClick={confirmAssignLead} color="primary">
                        Assign
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Convert Lead Dialog */}
            <Dialog open={convertingLeadId !== null} onClose={() => setConvertingLeadId(null)}>
                <DialogTitle>Convert Lead to Customer</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter payment details to convert this lead to a customer:
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        label="Amount"
                        type="number"
                        fullWidth
                        value={paymentDetails.amount}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, amount: e.target.value })}
                    />
                    <Select
                        fullWidth
                        value={paymentDetails.method}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, method: e.target.value })}
                        margin="dense"
                    >
                        <MenuItem value="cash">Cash</MenuItem>
                        <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                        <MenuItem value="check">Check</MenuItem>
                        <MenuItem value="card">Credit/Debit Card</MenuItem>
                        <MenuItem value="upi">UPI</MenuItem>
                    </Select>
                    <TextField
                        margin="dense"
                        label="Reference/Transaction ID"
                        fullWidth
                        value={paymentDetails.reference}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, reference: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConvertingLeadId(null)}>Cancel</Button>
                    <Button onClick={confirmConvertLead} color="primary">
                        Convert
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default LeadsSection; 