import React, { useState } from "react";
import axios from "axios";
import { backend_url } from "../../App";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import {
    Backdrop,
    Box,
    Fade,
    Modal,
    IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", md: 800 },
    maxHeight: "90vh",
    bgcolor: "#fff",
    borderRadius: 2,
    boxShadow: 24,
    p: 0,
    display: "flex",
    flexDirection: "column",
};

const policies = [
    {
        title: "Privacy Policy",
        content: "This is the privacy policy. It explains how we collect, use, and share your data. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner."
    },
    {
        title: "Terms of Service",
        content: "These are the terms of service. By using our service, you agree to these terms. Please read them carefully. These terms govern your use of our services and constitute a legally binding agreement between you and us."
    },
    {
        title: "Copyright Policy",
        content: "These are the terms of service. By using our service, you agree to these terms. Please read them carefully. These terms govern your use of our services and constitute a legally binding agreement between you and us."
    },
    {
        title: "Cookie Policy",
        content: "This is the cookie policy. We use cookies to improve your experience. This policy explains what cookies are, how we use them, and how you can manage them. By continuing to use our site, you consent to our use of cookies. This is the cookie policy. We use cookies to improve your experience. This policy explains what cookies are, how we use them, and how you can manage them. By continuing to use our site, you consent to our use of cookies. This is the cookie policy. We use cookies to improve your experience. This policy explains what cookies are, how we use them, and how you can manage them. By continuing to use our site, you consent to our use of cookies. This is the cookie policy. We use cookies to improve your experience. This policy explains what cookies are, how we use them, and how you can manage them. By continuing to use our site, you consent to our use of cookies.This is the cookie policy. We use cookies to improve your experience. This policy explains what cookies are, how we use them, and how you can manage them. By continuing to use our site, you consent to our use of cookies.This is the cookie policy. We use cookies to improve your experience. This policy explains what cookies are, how we use them, and how you can manage them. By continuing to use our site, you consent to our use of cookies.This is the cookie policy. We use cookies to improve your experience. This policy explains what cookies are, how we use them, and how you can manage them. By continuing to use our site, you consent to our use of cookies."
    },
    {
        title: "test Policy",
        content: "This is the cookie policy. We use cookies to improve your experience. This policy explains what cookies are, how we use them, and how you can manage them. By continuing to use our site, you consent to our use of cookies. This is the cookie policy. We use cookies to improve your experience. This policy explains what cookies are, how we use them, and how you can manage them. By continuing to use our site, you consent to our use of cookies. This is the cookie policy. We use cookies to improve your experience. This policy explains what cookies are, how we use them, and how you can manage them. By continuing to use our site, you consent to our use of cookies. This is the cookie policy. We use cookies to improve your experience. This policy explains what cookies are, how we use them, and how you can manage them. By continuing to use our site, you consent to our use of cookies.This is the cookie policy. We use cookies to improve your experience. This policy explains what cookies are, how we use them, and how you can manage them. By continuing to use our site, you consent to our use of cookies.This is the cookie policy. We use cookies to improve your experience. This policy explains what cookies are, how we use them, and how you can manage them. By continuing to use our site, you consent to our use of cookies.This is the cookie policy. We use cookies to improve your experience. This policy explains what cookies are, how we use them, and how you can manage them. By continuing to use our site, you consent to our use of cookies."
    }
];

const PolicyModal = ({ setUserOpen, open, setOpen, handleClose, formData, setFormData, setAdmins }) => {
    const [currentPolicyIndex, setCurrentPolicyIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    // console.log("policies", policies);

    const handleAgree = async () => {
        if (currentPolicyIndex < policies.length - 1) {
            setCurrentPolicyIndex(currentPolicyIndex + 1);
        } else {
            setLoading(true);
            let genderValue = formData?.gender?.value || "";
            let pronounsValue = formData?.pronouns?.value || "";
            const form = new FormData();
            form.append("name", formData.name);
            form.append("email", formData.email);
            form.append("password", formData.password);
            form.append("confirmPassword", formData.confirmPassword);
            form.append("role", formData.role);
            form.append("isActive", formData.isActive);
            form.append("dob", formData.dob);
            form.append("gender", genderValue);
            form.append("pronouns", pronounsValue);
            form.append("company", formData.company);
            form.append("phoneNumber", formData.phoneNumber);
            form.append("alternativeEmail", formData.alternativeEmail);
            form.append("whatsapp", formData.whatsapp);
            form.append("linkedin", formData.linkedin);
            form.append("facebook", formData.facebook);
            form.append("instagram", formData.instagram);
            form.append("username", formData.username);
            form.append("team", formData.team);
            form.append("dataRetentionPeriod", formData.dataRetentionPeriod);
            form.append("securityQuestion", formData.securityQuestion);
            form.append("securityAnswer", formData.securityAnswer);
            form.append("twoFactorMethod", formData.twoFactorMethod);
            form.append("country", formData.country);
            form.append("timeZone", formData.timeZone);
            form.append("preferredLanguage", formData.preferredLanguage);
            form.append("currencyPreference", formData.currencyPreference);
            form.append("agreedToPolicies", true);
            if (formData.profileImage instanceof File) {
                form.append("profileImage", formData.profileImage);
            }
            try {
                const response = await axios.post(`${backend_url}/api/admin/add`, form);
                if (response.data.status === "success") {
                    handleClose();
                    setAdmins((prevAdmins) => [...prevAdmins, response.data.data]);
                    setUserOpen(false);
                    setFormData({});
                    setCurrentPolicyIndex(0);
                    toast.success("Policies saved successfully");
                } else if (response.data.status === "error") {
                    toast.error(response?.data?.message);
                    console.error("Error saving policies:", response.data.message);
                }
            } catch (error) {
                console.error("Error saving form data:", error);
            }
            setLoading(false);
        }
    };


    const handleDisAgree = () => {
        setOpen(false);
        Swal.fire({
            // title: "Are you sure?",
            text: "You must accept the Terms, Compliance, and Privacy Policy to proceed. Without your agreement, we can't create your role or allow access.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Okay, I understand",
        }).then((result) => {
            if (result.isConfirmed) {
                setUserOpen(true);
                setOpen(false);
                // setFormData({ ...formData, agreedToPolicies: false });
                setCurrentPolicyIndex(0);
            } else {
                setOpen(true);
            }
        });
    };

        {
            console.log("policies::", policies);
        }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                    sx: {
                        backdropFilter: "blur(4px)",
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                    },
                },
            }}
        >
            <Fade in={open}>
                <Box sx={modalStyle}>
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b">
                        <h2 className="text-2xl font-bold text-gray-800 text-center">
                            Terms of Service
                        </h2>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* Left Sidebar */}
                        <div className="w-1/4 border-r p-4 overflow-y-auto bg-gray-100 rounded-lg">
                            <ul>
                                {policies.map((policy, index) => (
                                    <li
                                        key={index}
                                        className={`p-2 cursor-pointer`}
                                    >
                                        {
                                            console.log("policy", policy)
                                        }
                                        <div className="flex items-center">
                                            <span className={`h-4 w-4 mr-1 flex items-center justify-center ${currentPolicyIndex === index ? 'bg-blue-500' : 'bg-blue-200'} text-white text-[10px] rounded-full`}>
                                                {index + 1}
                                            </span>
                                            <span className={`font-semibold text-sm ${currentPolicyIndex === index ? 'text-blue-500' : 'text-blue-200'}`}>{policy?.name}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Content */}
                        {/* <div className="w-3/4 p-6 overflow-y-auto">
                            <h3 className="text-2xl font-bold mb-4">{policies && policies[currentPolicyIndex]?.name}</h3>
                            <p>{policies && policies[currentPolicyIndex]?.description}</p>
                        </div> */}
                    </div>

                    {/* Modal Footer Back to Form */}
                    <div className="px-6 py-4 border-t flex justify-between gap-2">
                        <div>
                            <button
                                onClick={() => {
                                    setUserOpen(true),
                                    setOpen(false)
                                }}
                                className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition"
                            >
                                Back to Form
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleDisAgree}
                                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                            >
                                Disagree
                            </button>

                            <button
                                onClick={handleAgree}
                                className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex items-center justify-center ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading && currentPolicyIndex === policies.length - 1 ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                                        Processing...
                                    </span>
                                ) : (
                                    currentPolicyIndex < policies.length - 1 ? "I Agree" : "Finish"
                                )}
                            </button>
                        </div>
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
};

export default PolicyModal;
