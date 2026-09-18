import CloseIcon from "@mui/icons-material/Close";
import {
  Backdrop,
  Box,
  Button,
  Divider,
  Fade,
  Grid,
  IconButton,
  Modal,
  Typography,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

// Adjusted modal style with flex to position submit button at bottom-right
const lightStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, md: 450 },
  bgcolor: "#fff",
  border: "2px solid #1f1f1f",
  borderRadius: 2,
  p: 2,
  display: "flex",
  flexDirection: "column",
  minHeight: "30vh", // Ensure modal has enough height
};

const ShowCostPriceModal = ({ open, handleClose, setCostPriceShow, setEyeButtonShow, setTimeLeft, timeLeft }) => {
  const [otp, setOtp] = useState("");
  const [isValid, setIsValid] = useState(false);
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (event) => {
    const value = event.target.value;
    // Allow only numeric input
    if (/^\d*$/.test(value)) {
      setOtp(value);
      // Validate when 6 digits are entered (standard OTP length)
      setIsValid(value.length === 6);
    }
  };

  const handleSubmit = async () => {
    if (isValid) {
      try {
        const response = await axios.post(`${backend_url}/api/setting/otpVerify`, { otp });

        if (response.data.status === "success") {
          setTimeLeft(600); // Update parent's state
          Cookies.set("code", "247", { expires: new Date(Date.now() + 10 * 60 * 1000) });
          setEyeButtonShow(false);
          handleClose();
          setCostPriceShow(true);
        } else {
          toast.error("Enter Valid OTP!");
        }
      } catch (error) {
        toast.error("Error verifying OTP");
      }
    } else {
      toast.error("Please enter a valid OTP");
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      setOtp("");
      setIsValid(false);
    };
  }, []);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
        },
      }}
    >
      <Fade in={open}>
        <Box sx={lightStyle}>
          {/* Modal Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Verify OTP</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ marginY: 2 }} />

          {/* Modal Body */}
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8} md={10}>
                    <TextField
                      fullWidth
                      label="Enter security code"
                      variant="outlined"
                      size="small"
                      value={otp}
                      onChange={handleChange}
                      inputProps={{ maxLength: 6 }}
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="medium"
                      onClick={handleSubmit}
                      disabled={!isValid}
                    >
                      Verify
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ marginY: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "auto" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!isValid}
              sx={{
                ...(!isValid && { opacity: 0.5, cursor: "not-allowed" }),
              }}
            >
              Verify
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ShowCostPriceModal;