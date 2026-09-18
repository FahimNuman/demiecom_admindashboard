"use client";
import React, { useEffect, useState } from "react";
import UserModal from "../component/modals/UserModal";
import ProcessModal from "../component/modals/ProcessModal";
import axios from "axios";
import { backend_url } from "../App";
import { TbTrash } from "react-icons/tb";
import { FaRegEdit, FaTasks } from "react-icons/fa";
import Swal from "sweetalert2";
import AddTaskModal from "../component/modals/AddTaskModal";
import { BiShowAlt } from "react-icons/bi";
import ViewTaskModal from "../component/modals/ViewTaskModal";
// import TableFilter from "@/components/TableFilter";


const Process = ({token}) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [process, setProcess] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [taskOpen, setTaskOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);


    const getProcess = async () => {
        setLoading(true);
        const response = await axios.get(`${backend_url}/api/process/index`);
        if (response?.data?.status === "success") {
            setProcess(response?.data?.data);
        }
        setLoading(false);
    }
   
    const handleEdit = (item) => {
        setTaskOpen(true);
        setSelectedModel(item);
    }

    const handleAddTask = (item) => {
        setTaskOpen(true);
        setSelectedModel(item);
    }

    const handleViewTask = (item) => {
        setViewOpen(true);
        setSelectedModel(item);
    }

    

    const handleModalClose = () => {
        setOpen(false);
        setSelectedModel(null);
    }

    console.log("selectedModel:", selectedModel);
    const handleTaskCreate = async (taskData) => {
        try {
            const response = await axios.post(`${backend_url}/api/task/create`, taskData);
            console.log("Task created response:", response); 
            Swal.fire({
                    title: "Success!",
                    text: "Task created successfully!",
                    icon: "success"
                });
            setTaskOpen(false);
            setSelectedModel(null);
            getProcess(); // Refresh the process list
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                Object.values(error.response.data.errors).forEach((e) => Swal.fire({
                    title: "Error!",
                    text: e[0],
                    icon: "error"
                }));                
            } else {
                Swal.fire({
                    title: "Error!",
                    text: error.message || "Something went wrong",
                    icon: "error"
                });
            }
        }
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
                const response = await axios.delete(`${backend_url}/api/process/delete/${id}`);
                Swal.fire({
                    title: "Deleted!",
                    text: "Process deleted successfully!",
                    icon: "success"
                });
                setProcess(prev => prev.filter(role => role._id !== id));
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
        getProcess();
    }, []);


    return (
        <div className="flex flex-col w-full justify-between bg-gray-50 px-6">
            <main className="mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-6 my-6 w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <h2 className="text-xl text-gray-800">All Process</h2>
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
                        Add Process
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
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                process && process.length > 0 && (
                                    process.map((item, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="p-3">{item.name}</td>
                                            <td className="p-3">{item.description}</td>
                                            <td className="p-3 flex gap-2">
                                                <button
                                                    onClick={() => handleAddTask(item)}
                                                    className="text-rose-600 hover:text-rose-900 focus:outline-none"
                                                    title="Add Task"
                                                >
                                                    <FaTasks size={24} />
                                                </button>

                                                 <button
                                                    onClick={() => handleViewTask(item)}
                                                    className="text-rose-600 hover:text-rose-900 focus:outline-none"
                                                    title="View Task"
                                                >
                                                    <BiShowAlt size={24} />
                                                </button>

                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-rose-600 hover:text-rose-900 focus:outline-none"
                                                    title="Edit"
                                                >
                                                    <FaRegEdit size={24} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="text-rose-600 hover:text-rose-900 focus:outline-none"
                                                    title="Delete"
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


                    {/* Pagination */}
                    {/* <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
          /> */}
                </div>
            </main>

            {/* taskOpen */}

            <AddTaskModal
                isOpen={taskOpen}
                onClose={() => setTaskOpen(false)}
                onTaskCreate={(taskData) => handleTaskCreate(taskData)}
                initialData={selectedModel}
            />

            {/* viewOpen */}
            <ViewTaskModal
                isOpen={viewOpen}
                setViewTask={setViewOpen}
                initialData={selectedModel}
            />

            <ProcessModal
                open={open}
                handleClose={handleModalClose}
                setProcess={setProcess}
                initialData={selectedModel}
            />
        </div>
    );
};

export default Process;
