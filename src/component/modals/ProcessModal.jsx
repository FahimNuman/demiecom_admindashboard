import React, { useEffect } from "react";
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

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", md: 700 },
    maxHeight: "90vh",
    bgcolor: "#fff",
    borderRadius: 2,
    boxShadow: 24,
    p: 0,
    display: "flex",
    flexDirection: "column",
};

const ProcessModal = ({ open, handleClose, setProcess, initialData }) => {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        setValue,
        reset
    } = useForm({
        mode: "onSubmit",
        defaultValues: {
            isActive: true,
        },
    });

    const onSubmit = async (data) => {
        try {
            if (initialData) {
                const response = await axios.post(`${backend_url}/api/process/update`, {
                    id: initialData._id,
                    data
                });


                console.log("response", response);

                if (response?.data?.status === "success") {
                    setProcess(prev => prev.map(process => process._id === initialData._id ? response?.data?.data : process));
                    toast.success(response.data.message);
                    handleClose();
                    reset();
                } else {
                    toast.error(response.data.message);
                }
            } else {
                const response = await axios.post(`${backend_url}/api/process/add`, { data });
                
                if (response?.data?.status === "success") {
                    setProcess(prev => [...prev, response?.data?.data]);
                    toast.success(response.data.message);
                    handleClose();
                    reset();
                } else {
                    toast.error(response.data.message);
                }
            }


        } catch (error) {
            console.log("Role Response Error:", error);
            handleClose();
        }
    };

    // Set form values when initialData changes
    useEffect(() => {
        if (initialData) {
            setValue('name', initialData.name);
            setValue('description', initialData.description);
        } else {
            reset({
                name: '',
                description: ''
            });
        }
    }, [initialData, reset, setValue]);

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
                        <h2 className="text-xl font-semibold text-gray-800">
                            {initialData ? "Update Process" : "Add Process"}
                        </h2>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>

                    {/* Modal Body (Form) */}
                    <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto px-6 py-4 space-y-4 flex-1">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                {...register("name", { required: "Name is required" })}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter name"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                {...register("description")}
                                placeholder="Write something about this role..."
                                rows={3}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>


                        {/* Submit Button */}
                        <div className="pt-4 border-t">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Processing..." : (initialData ? "UPDATE" : "Save")}
                            </button>
                        </div>
                    </form>
                </Box>
            </Fade>
        </Modal>
    );
};

export default ProcessModal;
