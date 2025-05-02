import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components for the calculator wrapper
const HeroSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #1b321d 0%, #3c6d47 100%)",
  padding: theme.spacing(6, 0),
  paddingTop: "167px",
  color: "#fff",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    right: "5%",
    width: "400px",
    height: "400px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "50%",
    transform: "translate(50%, -50%)",
    zIndex: 1,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-100px",
    left: "10%",
    width: "300px",
    height: "300px",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: "50%",
    zIndex: 1,
  },
}));

const MainContent = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(10),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "20%",
    right: "0",
    width: "250px",
    height: "250px",
    backgroundColor: "rgba(149, 184, 162, 0.05)",
    borderRadius: "50%",
    zIndex: 0,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "5%",
    left: "5%",
    width: "200px",
    height: "200px",
    backgroundColor: "rgba(149, 184, 162, 0.05)",
    borderRadius: "50%",
    zIndex: 0,
  },
}));

const BackgroundDecoration = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: "radial-gradient(circle at 15% 50%, rgba(149, 184, 162, 0.03) 0%, transparent 50%),radial-gradient(circle at 85% 30%, rgba(27, 50, 29, 0.02) 0%, transparent 50%)",
  pointerEvents: "none",
}));

/**
 * A wrapper component to provide consistent styling for all calculator pages
 */
const CalculatorWrapper = ({ 
  title, 
  description, 
  backgroundIcon,
  children 
}) => {
  return (
    <Box sx={{ pb: 6, minHeight: "100vh" }}>
      <BackgroundDecoration />
      
      <HeroSection>
        <Container maxWidth="lg">
          <Box sx={{ position: "relative", zIndex: 5 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                mb: 1,
                fontSize: { xs: "2.2rem", md: "3rem" },
                color: "#ffffff"
              }}
            >
              {title}
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: "800px", opacity: 0.9, lineHeight: 1.5, color: "#ffffff" }}>
              {description}
            </Typography>
          </Box>
          <Box 
            sx={{ 
              position: "absolute", 
              right: "5%", 
              top: "50%", 
              transform: "translateY(-50%)", 
              opacity: 0.2,
              display: { xs: "none", md: "block" },
              color: "#ffffff"
            }}
          >
            {backgroundIcon}
          </Box>
        </Container>
      </HeroSection>
      
      <MainContent maxWidth="lg">
        {children}
      </MainContent>
    </Box>
  );
};

export default CalculatorWrapper; 