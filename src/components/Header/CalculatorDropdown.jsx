import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Box, Typography, Grid, Paper, Divider, Avatar, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import CalculateIcon from "@mui/icons-material/Calculate";
import SavingsIcon from "@mui/icons-material/Savings";
import PaymentsIcon from "@mui/icons-material/Payments";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import PercentIcon from "@mui/icons-material/Percent";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

// Create a context to handle dropdown closing - this will be used by Header.jsx
export const CalcDropdownContext = React.createContext(null);

const DropdownContainer = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "calc(100% + 0px)",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 1000,
  width: "350px",
  padding: "16px 20px 20px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  border: "1px solid rgba(230, 230, 230, 0.7)",
  borderRadius: "16px",
  backgroundColor: "#fff",
  maxHeight: "450px",
  overflowY: "auto",
  [theme.breakpoints.down('md')]: {
    position: "relative",
    top: 0,
    left: 0,
    transform: "none",
    width: "100%",
    maxHeight: "300px",
    boxShadow: "none",
    borderRadius: "8px",
    padding: "12px 16px",
    border: "1px solid rgba(149, 184, 162, 0.3)",
    backgroundColor: "#fff",
  }
}));

const CalculatorItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "10px 12px",
  borderRadius: "10px",
  transition: "all 0.25s ease-in-out",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    transform: "translateX(8px)",
    boxShadow: "0 3px 10px rgba(0,0,0,0.07)",
    "&::before": {
      width: "100%",
    },
  },
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "0",
    backgroundColor: "rgba(255, 64, 129, 0.08)",
    transition: "width 0.3s ease",
    zIndex: 0,
  },
}));

const calculators = [
  {
    name: "EMI Calculator",
    description: "Calculate your loan EMI payments",
    path: "/emi-calculator",
    icon: <PaymentsIcon />
  },
  {
    name: "Investment Calculator",
    description: "Plan your investments & estimate returns",
    path: "/investment-calculator",
    icon: <SavingsIcon />
  },
  {
    name: "Tax Calculator",
    description: "Estimate your income tax liability",
    path: "/tax-calculator",
    icon: <CalculateIcon />
  }
  // SIP Calculator is part of the Investment Calculator
  // GST and Currency calculators coming soon
];

const CalculatorDropdown = () => {
  // Get access to the parent's setIsCalcDropdownVisible function
  const closeCalcDropdown = useContext(CalcDropdownContext);

  return (
    <DropdownContainer className='dropdown-paper custom-scrollbar'>
      <Box
        sx={{
          mb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        className='dropdown-header'>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: "var(--primary)",
            fontSize: "1.1rem" 
          }}>
          Financial Calculators
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Grid container direction="column" spacing={0.5}>
        {calculators.map((calculator, index) => (
          <Grid item key={index}>
            <NavLink
              to={calculator.path}
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={() => closeCalcDropdown && closeCalcDropdown(false)}
            >
              <Tooltip title={calculator.description} placement="right">
                <CalculatorItem>
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: "rgba(30, 74, 48, 0.08)",
                      color: "var(--primary)",
                      mr: 1.5,
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      border: "1px solid rgba(149, 184, 162, 0.2)",
                      zIndex: 1,
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.2rem",
                      },
                      "&:hover": {
                        bgcolor: "#ff4081",
                        color: "white",
                        boxShadow: "0 3px 8px rgba(255, 64, 129, 0.25)",
                      },
                    }}
                  >
                    {calculator.icon}
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color: "var(--primary)",
                        fontSize: "0.95rem",
                        transition: "all 0.2s ease",
                        zIndex: 1,
                        "&:hover": {
                          color: "#ff4081"
                        },
                      }}
                    >
                      {calculator.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "var(--text-secondary)",
                        fontSize: "0.8rem"
                      }}
                    >
                      {calculator.description}
                    </Typography>
                  </Box>
                </CalculatorItem>
              </Tooltip>
            </NavLink>
          </Grid>
        ))}
      </Grid>
    </DropdownContainer>
  );
};

export default CalculatorDropdown; 