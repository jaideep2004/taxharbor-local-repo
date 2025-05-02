import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import ServiceRegistrationForm from "./ServiceRegistrationForm";
import { Box, CircularProgress, Container, Typography } from "@mui/material";

const ServiceRegistration = () => {
  const location = useLocation();
  
  // If there's no state or it doesn't contain service, redirect to home
  if (!location.state || !location.state.service) {
    return <Navigate to="/" replace />;
  }
  
  const { service, selectedPackage, isLeadService } = location.state;
  
  return (
    <Box className="service-registration-page">
      <ServiceRegistrationForm 
        service={service}
        selectedPackage={selectedPackage}
        isLeadService={isLeadService}
      />
    </Box>
  );
};

export default ServiceRegistration; 