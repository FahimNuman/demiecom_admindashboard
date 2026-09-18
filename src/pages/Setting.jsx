import { useEffect, useState } from "react";
import {
  Box,
  Button
} from "@mui/material";
import {  motion, AnimatePresence } from "framer-motion";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CustomTextField from "../component/CustomTextField";
import axios from "axios";
import { toast } from "react-toastify";


const Setting = () => {
  const [openSetting, setOpenSetting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const settings = [
    { name: "mailSetting", title: "Mail Setting" },
    { name: "getEmailNumber", title: "Email Number" },
  ];

  const toggleSetting = (name) => {
    setOpenSetting(openSetting === null ? name : null);
    setLoading(false);
  };

  const handleValidation = () => {
    const newErrors = {};
    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const getSetting = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/setting`);
      if (response.data.success) {
        setFormData({
          ...formData,
          email: response?.data?.setting?.email,
          toEmail: response?.data?.setting?.toEmail,
          appPassword: response?.data?.setting?.appPassword,
          code: response?.data?.setting?.code
        })
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted, formData:", formData);
    if (handleValidation()) {
      setLoading(true);
      try {
        console.log("Sending request to backend...");
        const response = await axios.post(`${backend_url}/api/setting/email`, {
          email: formData.email,
          toEmail: formData.toEmail,
          appPassword: formData.appPassword,
          code: formData.code || ""
        });
        // console.log("Response:", response.data);
        setLoading(false);

        if (response.data.success) {
         

          toast.success("Email Information Update Successfully");
        } else {
          toast.error(response.data.message);
        }

      } catch (error) {
        console.error("Error updating email:", error.response?.data || error.message);
        setLoading(false);
      }
    } else {
      console.log("Validation failed, errors:", errors);
    }
  };

  useEffect(() => {
    getSetting();
  }, []);

  return (
    <>
      <div className="container mx-auto py-2 px-4">
        {settings.map(({ name, title }) => (
          <Box
            key={name}
            sx={{
              marginBottom: "10px",
            }}
          >
            {/* Header */}
            <Box
              onClick={() => toggleSetting(name)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#1976d2",
                padding: "10px",
                color: "white", // Apply color globally
                cursor: "pointer",
              }}
            >
              <Box>{title}</Box>
              <Box sx={{ color: "white !important" }}>
                {openSetting === name ? (
                  <KeyboardArrowDownIcon sx={{ color: "white !important" }} />
                ) : (
                  <KeyboardArrowUpIcon sx={{ color: "white !important" }} />
                )}
              </Box>
            </Box>

            {/* Content */}
            <AnimatePresence>
              {openSetting === name && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {name === "mailSetting" && (
                    <Box
                      sx={{
                        padding: "40px",
                        border: `1px solid #1976d2`,
                      }}
                    >
                      <Box
                        sx={{
                          marginBottom: "20px",
                          fontSize: "18px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {/* --------------------- */}


                        <Box
                            component="form"
                            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                            noValidate
                            autoComplete="off"
                        >
                            <CustomTextField
                              label="From Email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="Enter from email"
                              fieldRequired={errors?.email ? true : false}
                            /><br/>

                            <CustomTextField
                              label="To Email"
                              value={formData.toEmail}
                              onChange={(e) => setFormData({ ...formData, toEmail: e.target.value })}
                              placeholder="Enter from email"
                              fieldRequired={errors?.toEmail ? true : false}
                            /><br/>

                            <CustomTextField
                              label="Email App Password"
                              value={formData.appPassword}
                              onChange={(e) => setFormData({ ...formData, appPassword: e.target.value })}
                              placeholder="Enter email app password"
                              fieldRequired={errors?.appPassword ? true : false}
                            />
                        </Box>


                        {/* ----------------------------- */}
                      </Box>
                      
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            textTransform: "none",
                            fontSize: "16px",
                            padding: "8px 20px",
                          }}
                          onClick={(e) => handleSubmit(e)}
                        >
                          {loading ? "Submitting..." : "Submit"}
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {name === "getEmailNumber" && (
                    <Box
                      sx={{
                        padding: "40px",
                        border: `1px solid #1976d2`,
                      }}
                    >
                      <Box
                        sx={{
                          marginBottom: "20px",
                          fontSize: "18px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        Your email code: {formData?.code}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                      </Box>
                    </Box>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        ))}
      </div>
    </>
  );
};

export default Setting;
