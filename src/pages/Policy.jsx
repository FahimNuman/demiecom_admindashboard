"use client";
import React, { useEffect, useState } from "react";
import UserModal from "../component/modals/UserModal";
import RoleModal from "../component/modals/RoleModal";
import axios from "axios";
import { backend_url } from "../App";
import { TbTrash } from "react-icons/tb";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import AddPolicyModal from "../component/modals/AddPolicyModal";
// import TableFilter from "@/components/TableFilter";


const Policy = () => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [policy, setPolicy] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);

    //   console.log("policy", policy);


    const getPolicy = async () => {
        setLoading(true);
        const response = await axios.get(`${backend_url}/api/policy/index`);
        if (response?.data?.status === "success") {
            setPolicy(response?.data?.data);
        }
        setLoading(false);
    }



   
    const handleEdit = (item) => {
        setOpen(true);
        setSelectedModel(item);
    }

    const handleModalClose = () => {
        setOpen(false);
        setSelectedModel(null);
    }


    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${backend_url}/api/policy/delete/${id}`);
                Swal.fire({
                    title: "Deleted!",
                    text: "Policy deleted successfully!",
                    icon: "success"
                });
                setPolicy(prev => prev.filter(role => role._id !== id));
            } catch (error) {
                if (error.errors) {
                    Object.values(error.errors).forEach((e) => toast.error(e[0]));
                } else {
                    toast.error(error.message || "Something went wrong");
                }
            }
        }
    };


    useEffect(() => {
        getPolicy();
    }, []);


    return (
        <div className="flex flex-col min-h-screen w-full justify-between bg-gray-50 px-6">
            <main className="mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-6 my-6 w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <h2 className="text-xl text-gray-800">All Policy</h2>
                    <button
                        onClick={() => {
                            setOpen(true);
                            setSelectedModel(null);
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md"
                    >
                        <svg
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Policy
                    </button>
                </div>

                {/* Search Filter */}
                {/* <TableFilter query={query} setQuery={setQuery} setCurrentPage={setCurrentPage} fetchSearchResults={fetchSearchResults} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} placeholder="Search by name..." /> */}

                {/* Table Container */}
                <div className="overflow-x-auto rounded-md border border-gray-300 mt-4">

                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r bg-cyan-900 text-white">
                                <th className="p-3 text-left font-semibold cursor-pointer">
                                    Name
                                </th>
                                <th className="p-3 text-left font-semibold cursor-pointer">
                                    Description
                                </th>
                                <th className="p-3 text-left font-semibold cursor-pointer">
                                    Status
                                </th>
                                <th className="p-3 text-left font-semibold cursor-pointer">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                policy && policy.length > 0 && (
                                    policy.map((role, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="p-3">{role.name}</td>
                                            <td className="p-3">{role.description}</td>
                                            <td className="p-3">{role.isActive ? "Active" : "Inactive"}</td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => handleEdit(role)}
                                                    className="text-rose-600 hover:text-rose-900 focus:outline-none"
                                                >
                                                    <FaRegEdit size={24} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(role._id)}
                                                    className="text-rose-600 hover:text-rose-900 focus:outline-none"
                                                >
                                                    <TbTrash size={24} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </main>


            <AddPolicyModal
                open={open}
                handleClose={handleModalClose}
                setPolicy={setPolicy}
                initialData={selectedModel}
            />
        </div>
    );
};

export default Policy;
