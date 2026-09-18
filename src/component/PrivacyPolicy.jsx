import React, { useState } from "react";
import axios from "axios";
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

const PrivacyPolicy = ({ setOpen, setStep, handleClose, currentPolicyIndex, setCurrentPolicyIndex, handleFinalUserSubmit, policies }) => {

    const policiess = [
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
        }
    ];

    const [loading, setLoading] = useState(false);

    const handleDisAgree = () => {
    //    console.log("User disagreed with the policies.");
       handleClose();
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
                setOpen(true);
                setStep(1);
                // setFormData({ ...formData, agreedToPolicies: false });
                
            }else {
                setOpen(true);
                setStep(2);
            }
        });
    };



    const handleAgree = async () => {
        if (currentPolicyIndex < policies.length - 1) {
            setCurrentPolicyIndex(currentPolicyIndex + 1);
        } else {
            setLoading(true);
            await handleFinalUserSubmit();
            setLoading(false);
        }
    };

    return (
        <div>
            <Box >
                {/* Modal Header */}
                {/* <div className="flex items-center justify-between px-5 py-3 border-b">
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                        Terms of Service
                    </h2>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </div> */}

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar */}
                    <div className="w-1/4 border-r p-4 overflow-y-auto bg-gray-100 rounded-lg">
                        <ul>
                            {policies.map((policy, index) => (
                                <li
                                    key={index}
                                    className={`p-2 cursor-pointer`}
                                >
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
                    <div className="w-3/4 p-6 overflow-y-auto">
                        <h3 className="text-2xl font-bold mb-4">{policies && policies[currentPolicyIndex].name}</h3>
                        <p>{policies &&policies[currentPolicyIndex].description }</p>
                    </div>
                </div>

                {/* Modal Footer Back to Form */}
                <div className="px-6 py-4 border-t flex justify-between gap-2">
                    <div>
                        <button
                            onClick={() => {
                                setStep(1)
                            }}
                            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition"
                        >
                            Back to Form
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleDisAgree}
                            type="button"
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
        </div>
    )
}

export default PrivacyPolicy
