import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { FaTrash, FaPlusCircle, FaUsers, FaUserEdit, FaPaperclip, FaKeyboard } from 'react-icons/fa';
import { BsInputCursor } from "react-icons/bs";
import axios from 'axios';
import { backend_url } from '../../App';
import ManageUsersModal from './ManageUsersModal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS
import WorkDescriptionModal from './WorkDescriptionModal'; // NEW IMPORT
import { AlertCircle, AlertOctagon, AlertTriangle, ArrowDown } from 'lucide-react';

const AddTaskModal = ({ isOpen, onClose, onTaskCreate, initialData }) => {
    // All useState declarations
    const [taskName, setTaskName] = useState('');
    const [priority, setPriority] = useState('Emergency');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userOptions, setUserOptions] = useState([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [isWorkDescriptionModalOpen, setIsWorkDescriptionModalOpen] = useState(false); // NEW STATE

    // All useRef declarations
    // const quillRef = useRef(null); // REMOVED - moved to WorkDescriptionSection

    // All useCallback declarations
    // const imageHandler = useCallback(() => { ... }, []); // REMOVED - moved to WorkDescriptionSection

    // All useMemo declarations
    // const modules = useMemo(() => ({ ... }), [imageHandler]); // REMOVED - moved to WorkDescriptionSection
    // const formats = useMemo(() => ([ ... ]), []); // REMOVED - moved to WorkDescriptionSection

    // All useEffect declarations
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${backend_url}/api/admin/index`);
            if (response?.data?.status === "success") {
                setUserOptions(response.data.data.map(user => ({ value: user._id, label: user.name, image: user.profileImage })));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // useEffect(() => {
    //     if (isOpen) {
    //         if (initialData) {
    //             setTaskName(initialData.name || '');
    //             setTaskDescription(initialData.description || '');
    //             setGroups(initialData.groups || []);
    //         } else {
    //             setTaskName('');
    //             setTaskDescription('');
    //             setGroups([]);
    //             setSelectedOptions([]);
    //         }
    //     }
    // }, [initialData, isOpen]);

    // All other functions and JSX
    const handleAddGroupClick = () => {
        if (selectedOptions.length === 0) return alert("Please select users to form a group.");
        const newGroup = {
            id: Date.now(),
            name: `Group ${groups.length + 1}`,
            users: selectedOptions,
            workDescription: '',
            isWorkVisible: false,
            customInputFields: [],
            attachments: []
        };
        setGroups([...groups, newGroup]);
        setSelectedOptions([]);
    };

    // console.log("selectedOptions", selectedOptions);

    const updateGroup = (groupId, newProps) => {
        setGroups(groups.map(g => g.id === groupId ? { ...g, ...newProps } : g));
    };

    // REMOVED - moved to WorkDescriptionSection
    // const handleAddCustomField = (groupId) => { ... };
    // const handleCustomFieldValueChange = (groupId, fieldId, newValue) => { ... };
    // const handleDeleteCustomField = (groupId, fieldId) => { ... };
    // const handleAddAttachment = (groupId) => { ... };
    // const handleAttachmentNameChange = (groupId, attachmentId, newName) => { ... };
    // const handleDeleteAttachment = (groupId, attachmentId) => { ... };

    const handleDeleteUserFromGroup = (groupId, userId) => {
        const group = groups.find(g => g.id === groupId);
        if (group) {
            updateGroup(groupId, { users: group.users.filter(u => u.value !== userId) });
        }
    };


    const handleWorkDescriptionSave = (groupId, updatedData) => {
        setGroups(prevGroups => prevGroups.map(group =>
            group.id === groupId ? { ...group, ...updatedData, isWorkVisible: true } : group
        ));
        setIsWorkDescriptionModalOpen(false); // Close the modal after saving
        setEditingGroup(null); // Clear editing group
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!taskName.trim()) return alert('Please provide a task name.');
        if (groups.some(g => !g.name.trim())) return alert('Please provide a name for every group.');
        for (const group of groups) {
            if (group.isWorkVisible && !group.workDescription.trim()) {
                return alert(`Please provide a work description for ${group.name}.`);
            }
        }

        const taskData = {
            id: initialData ? initialData._id : Date.now(),
            processId: initialData._id,
            name: taskName,
            priority: priority,
            description: taskDescription,
            groups: groups.map(group => ({
                id: group.id,
                name: group.name,
                startTime: group.startTime,
                endTime: group.endTime,
                location: group.location,
                users: group.users.map(u => ({ id: u.value, name: u.label })),
                workDescription: group.workDescription,
                customInputFields: group.customInputFields,
                attachments: group.attachments
            }))
        };

        console.log("taskData", taskData);

        if (taskData) {
            onTaskCreate(taskData);
        }
        // else {
        //     console.log('Task created/updated:', taskData);
        // }
        // onClose();
    };

    const handleModalContentClick = (e) => e.stopPropagation();

    const priorityIcons = {
        Emergency: <AlertOctagon className="w-4 h-4 mr-2" />,
        High: <AlertTriangle className="w-4 h-4 mr-2" />,
        Medium: <AlertCircle className="w-4 h-4 mr-2" />,
        Low: <ArrowDown className="w-4 h-4 mr-2" />
    };

    // console.log("taskName", taskName);

    // Conditional return (MUST be after ALL Hooks)
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start pt-10" onClick={onClose}>
                <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full m-4" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Add New Task</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl font-light">&times;</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="mb-6">
                            <label className="block text-md font-medium text-gray-700 mb-2">Priority</label>
                            <div className="flex justify-start gap-6 p-2 bg-slate-100 rounded-lg">
                                {['Emergency', 'High', 'Medium', 'Low'].map((level) => (
                                    <div key={level} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`priority-${level}`}
                                            name="priority"
                                            value={level}
                                            checked={priority === level}
                                            onChange={() => setPriority(level)}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor={`priority-${level}`}
                                            className={`cursor-pointer flex items-center py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out ${priority === level
                                                    ? "bg-blue-600 text-white shadow-md"
                                                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                                }`}
                                        >
                                            {priorityIcons[level]} {level}
                                        </label>
                                    </div>
                                ))}
                                {/* {['Emergency', 'High', 'Medium', 'Low'].map((level) => (
                                    <div key={level} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`priority-${level}`}
                                            name="priority"
                                            value={level}
                                            checked={priority === level}
                                            onChange={() => setPriority(level)}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor={`priority-${level}`}
                                            className={`cursor-pointer py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out ${priority === level
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                                }`}
                                        >
                                            {level}
                                        </label>
                                    </div>
                                ))} */}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="taskName" className="block text-md font-medium text-gray-700 mb-2">Task Name</label>
                            <input type="text" id="taskName" value={taskName} onChange={(e) => setTaskName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Enter the task name" required />
                        </div>

                        <div>
                            <label htmlFor="taskDescription" className="block text-md font-medium text-gray-700 mb-2">Description</label>
                            <textarea id="taskDescription" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Provide a detailed description"></textarea>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <label className="block text-md font-medium text-gray-700 mb-2">Assign Users & Create Groups</label>
                            <div className="flex items-start space-x-3">
                                <div className="flex-grow">
                                    <Select id="assignUsers" isMulti options={userOptions} value={selectedOptions} onChange={setSelectedOptions} placeholder="Select users..." isLoading={isLoading} />
                                </div>
                                <button type="button" onClick={handleAddGroupClick} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 h-full">
                                    Add Group
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 -mr-4">
                            {groups.map((group) => (
                                <div key={group.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <input type="text" value={group.name} onChange={(e) => updateGroup(group.id, { name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-md font-semibold" required />
                                        <div className="flex items-center space-x-4 ml-4">
                                            <button type="button" onClick={() => { setEditingGroup(group); setIsUserModalOpen(true); }} className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-semibold whitespace-nowrap">
                                                <FaUserEdit className="mr-2" />
                                                Manage Users
                                            </button>
                                            <button type="button" onClick={() => setGroups(groups.filter(g => g.id !== group.id))} className="text-slate-500 hover:text-red-600">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>

                                    {/* {
                                        console.log("Rendering group:", group.users[0])
                                    } */}

                                    <div className="mb-4">
                                        <h5 className="text-sm font-semibold text-slate-600 mb-2">Assigned Users ({group.users.length}):</h5>
                                        <div className="flex flex-wrap gap-2 p-2 bg-white rounded-md border">
                                            {group.users.map(user => (
                                                // <div key={user.value} className="inline-flex items-center bg-slate-200 rounded-full pl-3 pr-1 py-1 text-sm font-medium text-slate-700">
                                                //     <span>{user.label}</span>
                                                //     <button type="button" onClick={() => handleDeleteUserFromGroup(group.id, user.value)} className="ml-2 h-5 w-5 flex items-center justify-center rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600">&times;</button>
                                                // </div>
                                                <div
                                                    key={user.value}
                                                    className="inline-flex items-center bg-slate-200 rounded-full pl-3 pr-1 py-1 text-sm font-medium text-slate-700"
                                                >

                                                    <>
                                                        {
                                                            console.log("User image:", user.image)
                                                        }
                                                        <img
                                                            src={user.image && user.image.trim() !== "" ? user.image : '/no_image.jpg'}
                                                            alt={user.label}
                                                            className="w-16 h-16 rounded-full mr-2"
                                                            onError={(e) => { e.currentTarget.src = '/no_image.jpg'; }}
                                                        />
                                                    </>

                                                    <span>{user.label}</span>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteUserFromGroup(group.id, user.value)}
                                                        className="ml-2 h-5 w-5 flex items-center justify-center rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                            {group.users.length === 0 && <p className="text-xs text-slate-500">No users assigned.</p>}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-200">
                                        {/* NEW BUTTON */}
                                        <button type="button" onClick={() => {
                                            console.log("Add Work Description button clicked!");
                                            setEditingGroup(group); // Set the group to be edited in the modal
                                            setIsWorkDescriptionModalOpen(true);
                                            console.log("isWorkDescriptionModalOpen:", true);
                                            console.log("editingGroup:", group);
                                        }} className="flex items-center text-sm text-green-600 hover:text-green-700 font-semibold">
                                            <FaPlusCircle className="mr-2" />
                                            Add Work Description
                                        </button>
                                        {/* REMOVED OLD WORK SECTION */}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6">
                            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">Create Task</button>
                        </div>
                    </form>
                </div>
            </div>
            <ManageUsersModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} group={editingGroup} allUserOptions={userOptions} onSave={(groupId, newUsers) => updateGroup(groupId, { users: newUsers })} />
            {/* NEW MODAL */}
            {isWorkDescriptionModalOpen && editingGroup && (
                <WorkDescriptionModal
                    isOpen={isWorkDescriptionModalOpen}
                    onClose={() => {
                        setIsWorkDescriptionModalOpen(false);
                        setEditingGroup(null); // Clear editingGroup when closing
                    }}
                    group={editingGroup}
                    onSave={(updatedData) => handleWorkDescriptionSave(editingGroup.id, updatedData)}
                />
            )}
        </>
    );
};

export default AddTaskModal;