import { Box, Typography, Button } from "@mui/material";

const ProductPlanList = ({ plans, selectedPlan, onSelect }) => {
  const planStyles = {
    display: "inline-block",
    width: "200px",
    padding: "20px",
    margin: "10px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "center",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
    ...(selectedPlan && { border: "2px solid #1976d2", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }),
  };

  const selectedIndicatorStyle = {
    position: "absolute",
    top: "10px",
    left: "10px",
    width: "20px",
    height: "20px",
    backgroundColor: "#1976d2",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "12px",
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
      {plans.map((plan, index) => (
        <Box
          key={index}
          sx={planStyles}
          onClick={() => onSelect(plan)}
        >
          {selectedPlan === plan && (
            <Box sx={selectedIndicatorStyle}>✓</Box>
          )}
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            {plan.name}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {plan.size}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {plan.disk}
          </Typography>
          <Typography variant="h6" sx={{ color: "#1976d2", mb: 2 }}>
            ${plan.price}/mo
          </Typography>
          <Button variant="contained" color="primary" size="small" disabled>
            Select
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default ProductPlanList;