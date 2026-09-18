import React, { useEffect, useState } from "react";
import Select from 'react-select';
import CloseIcon from "@mui/icons-material/Close";
import {
    Backdrop,
    Box,
    Fade,
    Modal,
    IconButton,
} from "@mui/material";

import { useForm } from 'react-hook-form';
import axios from "axios";
import { backend_url } from "../../App";
import { toast } from "react-toastify";
import PrivacyPolicy from "../PrivacyPolicy";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", md: 1200 },
    maxHeight: "90vh",
    bgcolor: "#fff",
    borderRadius: 2,
    boxShadow: 24,
    p: 0,
    display: "flex",
    flexDirection: "column",
};

const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "non-binary", label: "Non-binary" },
    { value: "transgender", label: "Transgender" },
    { value: "genderqueer", label: "Genderqueer" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
    { value: "other", label: "Other" },
];

const pronounsOptions = [
    { value: "he/him", label: "He/Him" },
    { value: "she/her", label: "She/Her" },
    { value: "they/them", label: "They/Them" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
    { value: "other", label: "Other" },
];

const dataRetentionOptions = [
    { value: "6m", label: "6 months" },
    { value: "1y", label: "1 year" },
    { value: "indefinitely", label: "Indefinitely" },
];

const securityQuestionsOptions = [
    { value: "pet", label: "What is your first pet's name?" },
    { value: "mother", label: "What is your mother's maiden name?" },
    { value: "city", label: "What city were you born in?" },
];


const UserModal = ({ open, setOpen, handleClose, roles, setAdmins, initialData, setPolicyModalOpen, countries, languages, currencies, timezones, setFormData, policies }) => {
    // Add preview state for profile image
    const [preview, setPreview] = useState(null);

    const [step, setStep] = useState(1);

    const [currentPolicyIndex, setCurrentPolicyIndex] = useState(0);

    useEffect(() => {
        if (open) {
            setCurrentPolicyIndex(0); // Reset policy index when modal opens
        }
    }, [open]);



    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
        setValue,
        reset
    } = useForm({
        mode: "onChange",
        defaultValues: {
            isActive: true,
            agreedToPolicies: true,
        },
    });

    // Update preview when profileImage changes
    useEffect(() => {
        const subscription = watch((values, { name }) => {
            if (name === "profileImage" && values.profileImage && values.profileImage.length > 0) {
                const file = values.profileImage[0];
                if (file) {
                    const url = URL.createObjectURL(file);
                    setPreview(url);
                }
            } else if (name === "profileImage" && (!values.profileImage || values.profileImage.length === 0)) {
                setPreview(null);
            }
        });
        return () => {
            if (preview) URL.revokeObjectURL(preview);
            subscription.unsubscribe();
        };
    }, [watch]);

    // Watch password and confirmPassword for real-time validation
    const password = watch("password");
    const confirmPassword = watch("confirmPassword");

    useEffect(() => {
        if (confirmPassword !== undefined && confirmPassword !== "") {
            if (password !== confirmPassword) {
                setError("confirmPassword", { type: "manual", message: "Passwords do not match" });
            } else {
                clearErrors("confirmPassword");
            }
        } else {
            clearErrors("confirmPassword");
        }
    }, [password, confirmPassword, setError, clearErrors]);

    const onSubmitOld = async (data) => {
        console.log("Submitted Data:", data);
        setFormData(data);
        handleClose();
        setPolicyModalOpen(true);
    };

    const onSubmit = async (data) => {
        const file = data.profileImage?.[0] ?? null;
        setFormData({ ...data, profileImage: file });
        setStep(2);
    };

    const handleFinalUserSubmit = async () => {
        const data = watch(); // Get all form data

        console.log("Final Data to Submit:", data);


        const file = data.profileImage?.[0] ?? null;
        const formDataToSend = new FormData();

        for (const key in data) {
            if (key === "gender" && data.gender && typeof data.gender === "object") {
                formDataToSend.append("gender", data.gender.value);
            } else if (key === "pronouns" && data.pronouns && typeof data.pronouns === "object") {
                formDataToSend.append("pronouns", data.pronouns.value);
            } else if (key === "securityQuestion" && data.securityQuestion && typeof data.securityQuestion === "object") {
                formDataToSend.append("securityQuestion", data.securityQuestion.value);
            } else if (key === "dataRetentionPeriod" && data.dataRetentionPeriod && typeof data.dataRetentionPeriod === "object") {
                formDataToSend.append("dataRetentionPeriod", data.dataRetentionPeriod.value);
            } else if (key === "profileImage") {
                // handled below
            } else {
                formDataToSend.append(key, data[key]);
            }
        }
        if (file) {
            formDataToSend.append("profileImage", file);
        }

        console.log("Final Form Data to Send:", formDataToSend);

        try {
            const response = await axios.post(`${backend_url}/api/admin/add`, formDataToSend);

            console.log("Response from server:", response);


            if (response.data.status === "success") {
                handleClose();
                setAdmins((prevAdmins) => [...prevAdmins, response.data.data]);
                setOpen(false);
                setFormData({});
                setStep(1);
                setCurrentPolicyIndex(0);
                reset();
                toast.success("Policies saved successfully");
            } else if (response.data.status === "error") {
                toast.error(response?.data?.message);
                console.error("Error saving policies:", response.data.message);
            }
        } catch (error) {
            console.error("Error saving form data:", error);
        }
    };


    // console.log("roles", roles);

    useEffect(() => {
        if (initialData) {
            setValue("name", initialData?.name);
            setValue("email", initialData?.email);
            setValue("role", initialData?.role);
            setValue("isActive", initialData?.isActive);
        }
    }, [initialData]);


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
                        <h2 className="text-xl font-semibold text-gray-800">Create User</h2>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>

                    {/* Modal Body (Scrollable Form) */}
                    <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
                        {/* 1st section */}
                        {step === 1 && (
                            <div className="space-y-4 flex-1">
                                <div className="grid grid-cols-2 gap-2">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            {...register("name", { required: "Name is required" })}
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter name"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            {...register("email", { required: "Email is required" })}
                                            type="email"
                                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter email"
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <input
                                            {...register("password", { required: "Password is required" })}
                                            type="password"
                                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter password"
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                        <input
                                            {...register("confirmPassword", {
                                                required: "Confirm Password is required",
                                                validate: (value) =>
                                                    value === watch("password") || "Passwords do not match",
                                            })}
                                            type="password"
                                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Confirm password"
                                        />
                                        {errors.confirmPassword && (
                                            <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
                                        )}
                                    </div>

                                    {/* Date of Birth */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                        <input
                                            {...register("dob")}
                                            type="date"
                                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <Select
                                            {...register("gender")}
                                            options={genderOptions}
                                            value={genderOptions.find(option => option.value === watch("gender")?.value)}
                                            onChange={(selectedOption) => setValue("gender", selectedOption)}
                                            className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Select Gender"
                                        />
                                    </div>

                                    {/* Pronouns */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pronouns</label>
                                        <Select
                                            {...register("pronouns")}
                                            options={pronounsOptions}
                                            value={pronounsOptions.find(option => option.value === watch("pronouns")?.value)}
                                            onChange={(selectedOption) => setValue("pronouns", selectedOption)}
                                            className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Select Pronouns"
                                        />
                                    </div>

                                    {/* Role */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <Select
                                            options={roles?.map(role => ({ value: role._id, label: role.name }))}
                                            value={roles?.map(role => ({ value: role._id, label: role.name }))?.find(option => option.value === watch("role"))}
                                            onChange={selectedOption => setValue("role", selectedOption.value)}
                                            className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Select role"
                                        />
                                        {errors.role && (
                                            <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
                                        )}
                                    </div>
                                </div>


                                {/* Contact & Location Section */}
                                <div className="border p-4 rounded-md shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact & Location</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                            <Select
                                                options={countries?.map(country => ({ value: country._id, label: country.name }))}
                                                value={countries?.map(country => ({ value: country._id, label: country.name }))?.find(option => option.value === watch("country"))}
                                                onChange={selectedOption => setValue("country", selectedOption.value)}
                                                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Select Country"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                                            <Select
                                                options={timezones?.map(tz => ({ value: tz._id, label: tz.zone }))}
                                                value={timezones?.map(tz => ({ value: tz._id, label: tz.zone }))?.find(option => option.value === watch("timeZone"))}
                                                onChange={selectedOption => setValue("timeZone", selectedOption.value)}
                                                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Select Time Zone"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                                            <Select
                                                options={languages?.map(lang => ({ value: lang._id, label: lang.name }))}
                                                value={languages?.map(lang => ({ value: lang._id, label: lang.name }))?.find(option => option.value === watch("preferredLanguage"))}
                                                onChange={selectedOption => setValue("preferredLanguage", selectedOption.value)}
                                                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Select Language"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                            <input
                                                {...register("company")}
                                                type="text"
                                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter company name"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information Section */}
                                <div className="border p-4 rounded-md shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                {...register("phoneNumber")}
                                                type="tel"
                                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Email</label>
                                            <input
                                                {...register("alternativeEmail")}
                                                type="email"
                                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter alternative email"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                                            <input
                                                {...register("whatsapp")}
                                                type="url"
                                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="https://wa.me/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                                            <input
                                                {...register("linkedin")}
                                                type="url"
                                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="https://linkedin.com/in/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                                            <input
                                                {...register("facebook")}
                                                type="url"
                                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="https://facebook.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                                            <input
                                                {...register("instagram")}
                                                type="url"
                                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="https://instagram.com/..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* User Identity & Access Section */}
                                <div className="border p-4 rounded-md shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">User Identity & Access</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                            <input
                                                {...register("username")}
                                                type="text"
                                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter username"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                                            <input
                                                {...register("team")}
                                                type="text"
                                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter team name"
                                            />
                                        </div>
                                        <div className="w-full flex items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                                                <label
                                                    htmlFor="front-image-upload"
                                                    className="h-40 flex flex-col justify-center items-center gap-2 cursor-pointer border border-dashed border-gray-400 rounded-lg text-center hover:border-blue-500 transition"
                                                >
                                                    <span className="text-sm text-gray-600">Click to upload profile image</span>
                                                    <input
                                                        type="file"
                                                        id="front-image-upload"
                                                        name="frontImage"
                                                        accept="image/*"
                                                        className="hidden"
                                                        {...register("profileImage")}
                                                    />
                                                </label>
                                            </div>
                                            {/* Preview on right side */}
                                            
                                            {preview && (
                                                <div className="w-20 h-20 border rounded-lg overflow-hidden relative">
                                                    <img
                                                        src={preview}
                                                        alt="Profile Preview"
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            )}
                                          
                                        </div>
                                    </div>
                                </div>

                                {/* Localization & Personalization Section */}
                                <div className="border p-4 rounded-md shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Localization & Personalization</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Currency Preferences</label>
                                            <Select
                                                options={currencies?.map(currency => ({ value: currency._id, label: `${currency.code} - ${currency.name} (${currency.symbol})` }))}
                                                value={currencies?.map(currency => ({ value: currency._id, label: `${currency.code} - ${currency.name} (${currency.symbol})` }))?.find(option => option.value === watch("currencyPreference"))}
                                                onChange={selectedOption => setValue("currencyPreference", selectedOption.value)}
                                                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Select Currency"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Data Management Section */}
                                <div className="border p-4 rounded-md shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Management</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Data Retention Period</label>
                                            <Select
                                                {...register("dataRetentionPeriod")}
                                                options={dataRetentionOptions}
                                                value={dataRetentionOptions.find(option => option.value === watch("dataRetentionPeriod")?.value)}
                                                onChange={(selectedOption) => setValue("dataRetentionPeriod", selectedOption)}
                                                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Select period"
                                            />
                                        </div>
                                    </div>
                                </div>



                                {/* Security Questions Card */}
                                <div className="border p-4 rounded-md shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Security Questions</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Security Question</label>
                                            <Select
                                                {...register("securityQuestion")}
                                                options={securityQuestionsOptions}
                                                value={securityQuestionsOptions.find(option => option.value === watch("securityQuestion")?.value)}
                                                onChange={(selectedOption) => setValue("securityQuestion", selectedOption)}
                                                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Select a question"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Security Answer</label>
                                            <input
                                                {...register("securityAnswer")}
                                                type="text"
                                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter your answer"
                                            />
                                        </div>
                                    </div>
                                </div>


                                {/* Two-Factor Authentication Card */}
                                <div className="border p-4 rounded-md shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Two-Factor Authentication</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">2FA Method</label>
                                        <select
                                            {...register("twoFactorMethod")}
                                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="none">None</option>
                                            <option value="email">Email</option>
                                            <option value="sms">SMS</option>
                                            <option value="authenticator">Authenticator App</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Is Active */}
                                <label className="flex items-center cursor-pointer">
                                    {/* Label */}
                                    <span className="mr-3 text-sm font-medium text-gray-700">Is Active</span>

                                    {/* Toggle */}
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            {...register("isActive")}
                                        // checked={isActive}
                                        // onChange={(e) => setIsActive(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-all duration-300"></div>
                                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
                                    </div>
                                </label>


                                {/* Submit Button - Sticky Footer */}
                                <div className="px-6 py-3 border-t bg-gray-100">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                                    >
                                        Create User
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 2nd section */}
                        {step === 2 && (
                            <div>
                                <PrivacyPolicy setOpen={setOpen} setStep={setStep} handleClose={handleClose} currentPolicyIndex={currentPolicyIndex} setCurrentPolicyIndex={setCurrentPolicyIndex} handleFinalUserSubmit={handleFinalUserSubmit} policies={policies} />
                            </div>
                        )}
                    </form>
                </Box>
            </Fade>
        </Modal>
    );
};

export default UserModal;
