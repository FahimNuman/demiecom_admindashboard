import React from 'react';
import { FaUsers, FaPaperclip, FaKeyboard, FaTasks, FaInfoCircle } from 'react-icons/fa';
import 'react-quill/dist/quill.snow.css';

const ViewTaskModal = ({ isOpen, setViewTask, initialData: processData }) => {
    if (!isOpen || !processData) return null;

    const { processName, description: processDescription, tasks } = processData;

    // Flatten the data for table rows
    const tableRows = [];
    if (tasks) {
        tasks.forEach(task => {
            if (task.groups && task.groups.length > 0) {
                task.groups.forEach(group => {
                    tableRows.push({
                        taskName: task.name,
                        groupName: group.name,
                        adminsInfo: group.adminsInfo || [],
                        works: group.works || []
                    });
                });
            } else {
                // Add task even if it has no groups
                tableRows.push({
                    taskName: task.name,
                    groupName: 'N/A',
                    adminsInfo: [],
                    works: []
                });
            }
        });
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start pt-10 overflow-y-auto" onClick={() => setViewTask(false)}>
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-7xl w-full m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <h2 className="text-3xl font-bold text-gray-800">{processName}</h2>
                    <button onClick={() => setViewTask(false)} className="text-gray-500 hover:text-gray-800 text-3xl font-light">&times;</button>
                </div>

                <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="text-xl font-semibold text-blue-800 mb-2 flex items-center"><FaInfoCircle className="mr-2" /> Process Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{processDescription}</p>
                </div>

                <div className="max-h-[65vh] overflow-auto rounded-lg border border-gray-300">
                    <table className="w-full table-auto border-collapse">
                        <thead className="bg-gray-800 text-white sticky top-0">
                            <tr>
                                <th className="p-3 text-left font-semibold">Task Name</th>
                                <th className="p-3 text-left font-semibold">Group Name</th>
                                <th className="p-3 text-left font-semibold">Assigned Users</th>
                                <th className="p-3 text-left font-semibold">Work Instructions</th>
                                <th className="p-3 text-left font-semibold">Input Labels</th>
                                <th className="p-3 text-left font-semibold">Attachment Labels</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {tableRows.length > 0 ? tableRows.map((row, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-3 align-top">{row.taskName}</td>
                                    <td className="p-3 align-top font-semibold">{row.groupName}</td>
                                    <td className="p-3 align-top">
                                        <div className="flex flex-wrap gap-1">
                                            {row.adminsInfo.map(admin => (
                                                <span key={admin._id} className="bg-slate-200 rounded-full px-2 py-1 text-xs font-medium text-slate-700">
                                                    {admin.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-3 align-top">
                                        {row.works.map((work, i) => (
                                            <div key={i} className="prose max-w-none" dangerouslySetInnerHTML={{ __html: work.instraction }} />
                                        ))}
                                    </td>
                                    <td className="p-3 align-top">
                                        <ul className="list-disc list-inside">
                                            {row.works.flatMap(w => w.labelName).map(label => (
                                                <li key={label._id}>{label.label}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="p-3 align-top">
                                        <ul className="list-disc list-inside">
                                            {row.works.flatMap(w => w.attachment).map(attach => (
                                                <li key={attach._id}>{attach.label}</li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-6 text-gray-500">No tasks found for this process.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end mt-8 border-t pt-4">
                    <button
                        type="button"
                        onClick={() => setViewTask(false)}
                        className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewTaskModal;