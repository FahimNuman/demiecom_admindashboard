"use client";
import React, { useEffect, useState } from "react";
import UserModal from "../component/modals/UserModal";
import axios from "axios";
import { backend_url } from "../App";
import { TbTrash } from "react-icons/tb";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import PolicyModal from "../component/modals/PolicyModal";
// import TableFilter from "@/components/TableFilter";


const User = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [roles, setRoles] = useState([]);
    const [policyModalOpen, setPolicyModalOpen] = useState(false);
    const [countries, setCountries] = useState([]);

    const [formData, setFormData] = useState();


    console.log("formData", formData);

    
    const handleModalClose = () => {
        setOpen(false);
    }

    const handlePolicyModalClose = () => {
        setPolicyModalOpen(false);
    }

    const getAdmins = async () => {
        setLoading(true);
        const response = await axios.get(`${backend_url}/api/admin/index`);

        if (response?.data?.status === "success") {
            setAdmins(response?.data?.data);
        }
        setLoading(false);
    }

    const getRoles = async () => {
        setLoading(true);
        const response = await axios.get(`${backend_url}/api/roles/index`);
        if (response?.data?.status === "success") {
            setRoles(response?.data?.data);
        }
        setLoading(false);
    }

    const getCountrys = async () => {
        setLoading(true);
        const response = await axios.get(`${backend_url}/api/country/index`);
        if (response?.data?.status === "success") {
            setCountries(response?.data?.data);
        }
        setLoading(false);
    }

    const [timezones, setTimezones] = useState([]);

    const getTimezone = async () => {
        setLoading(true);
        const response = await axios.get(`${backend_url}/api/country/get-timezone`);

        if (response?.data?.status === "success") {
            setTimezones(response?.data?.data);
        }
        setLoading(false);
    }   


    const [languages, setLanguages] = useState([]);
    const getLanguages = async () => {
        setLoading(true);
        const response = await axios.get(`${backend_url}/api/country/get-language`);
        if (response?.data?.status === "success") {
            setLanguages(response?.data?.data);
        }
        setLoading(false);
    }

    const [currencies, setCurrencies] = useState([]);

    const getCurrency = async () => {
        setLoading(true);
        const response = await axios.get(`${backend_url}/api/country/get-currency`);
        if (response?.data?.status === "success") {
            setCurrencies(response?.data?.data);
        }
        setLoading(false);
    }

    const [policies, setPolicies] = useState([]);

    const getPolicy = async () => {
        setLoading(true);
        const response = await axios.get(`${backend_url}/api/policy/index`);

        console.log("response", response?.data?.data);

        if (response?.data?.status === "success") {
            setPolicies(response?.data?.data);
        }
        setLoading(false);
    }


    console.log("policies", policies);


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
                const response = await axios.delete(`${backend_url}/api/admin/delete/${id}`);
               
                if(response?.data?.status === "success") {
                    Swal.fire({
                        title: "Deleted!",
                        text: "User deleted successfully!",
                        icon: "success"
                    });
                    setAdmins(prev => prev.filter(admin => admin._id !== id));
                }
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
        getAdmins();
        getRoles();
        getCountrys();
        getLanguages();
        getCurrency();
        getTimezone();
        getPolicy();
    }, []);


    //  console.log("====================");
    //  console.log("policies", policies);


    return (
        <div className="flex flex-col min-h-screen w-full justify-between bg-gray-50 px-6">
            <main className="mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-6 my-6 w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <h2 className="text-xl text-gray-800">All Users</h2>
                    <button
                        onClick={() => {
                            setOpen(true);
                            //   setSelectedModel(null);
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
                        Add User
                    </button>
                </div>

                {/* Search Filter */}
                {/* <TableFilter query={query} setQuery={setQuery} setCurrentPage={setCurrentPage} fetchSearchResults={fetchSearchResults} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} placeholder="Search by name..." /> */}

                {/* Table Container */}
                <div className="overflow-x-auto rounded-md border border-gray-300 mt-4">

                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r bg-cyan-900 text-white">
                                <th className="p-3 text-left font-semibold cursor-pointer">Image</th>
                                <th className="p-3 text-left font-semibold cursor-pointer">Name</th>
                                <th className="p-3 text-left font-semibold cursor-pointer">Email</th>
                                <th className="p-3 text-left font-semibold cursor-pointer">Phone</th>
                                <th className="p-3 text-left font-semibold cursor-pointer">Gender</th>
                                <th className="p-3 text-left font-semibold">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                admins?.map((admin, key) => (
                                    <tr key={key} className="border-b border-gray-200">
                                        {
                                            console.log("admin", admin)
                                        }
                                        <td className="p-3">
                                            <img
                                                src={admin?.profileImage}
                                                alt={admin?.name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        </td>
                                        <td className="p-3">{admin.name}</td>
                                        <td className="p-3">{admin.email}</td>
                                        <td className="p-3">{admin.phoneNumber}</td>
                                        <td className="p-3">{admin.gender}</td>
                                        <td className="p-3">
                                            {/* <button
                                                onClick={() => handleEdit(admin)}
                                                className="text-rose-600 hover:text-rose-900 focus:outline-none"
                                            >
                                                <FaRegEdit size={24} />
                                            </button> */}

                                            <button
                                                onClick={() => handleDelete(admin._id)}
                                                className="text-rose-600 hover:text-rose-900 focus:outline-none"
                                            >
                                                <TbTrash size={24} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>


                    {/* Pagination */}
                    {/* <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
          /> */}
                </div>
            </main>


            <UserModal
                open={open}
                setOpen={setOpen}
                handleClose={handleModalClose}
                roles={roles}
                setAdmins={setAdmins}
                initialData={selectedModel}
                setPolicyModalOpen={setPolicyModalOpen}
                countries={countries}
                languages={languages}
                currencies={currencies}
                timezones={timezones}
                setFormData={setFormData}
                policies={policies}
            />

            {/* <PolicyModal
                setUserOpen={setOpen}
                open={policyModalOpen}
                setOpen={setPolicyModalOpen}
                handleClose={handlePolicyModalClose}
                formData={formData}
                setFormData={setFormData}
                setAdmins={setAdmins}
                policies={policies}
            /> */}
        </div>
    );
};

export default User;
