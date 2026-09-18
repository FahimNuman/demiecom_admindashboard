import React, { useState, useEffect } from 'react';
import WorkDescriptionSection from '../WorkDescriptionSection';

const WorkDescriptionModal = ({ isOpen, onClose, group, onSave }) => {
    // State is now managed in this modal component
    const [workDescription, setWorkDescription] = useState('');
    const [customInputFields, setCustomInputFields] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');

    // When the modal opens or the group changes, initialize the state from the group prop
    useEffect(() => {
        if (group) {
            setWorkDescription(group.workDescription || '');
            setCustomInputFields(group.customInputFields || []);
            setAttachments(group.attachments || []);
            setStartTime(group.startTime || '');
            setEndTime(group.endTime || '');
            setLocation(group.location || '');
        }
    }, [group]);

    if (!isOpen) {
        return null;
    }

    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    // Explicit save handler
    const handleSave = () => {
        onSave({
            workDescription,
            customInputFields,
            attachments,
            startTime,
            endTime,
            location
        });
        onClose(); // Close modal after saving
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start pt-10"
            onClick={onClose}
        >
            <div
                className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full m-4 flex flex-col"
                onClick={handleModalContentClick}
                style={{ maxHeight: '90vh' }}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Work Description for {group?.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-3xl font-light"
                    >
                        &times;
                    </button>
                </div>

                {/* Modal Body */}
                <div className="overflow-y-auto flex-1 pr-2 -mr-4">
                    <WorkDescriptionSection
                        // Pass state and setters down to the dumb component
                        workDescription={workDescription}
                        setWorkDescription={setWorkDescription}
                        customInputFields={customInputFields}
                        setCustomInputFields={setCustomInputFields}
                        attachments={attachments}
                        setAttachments={setAttachments}
                        startTime={startTime}
                        setStartTime={setStartTime}
                        endTime={endTime}
                        setEndTime={setEndTime}
                        location={location}
                        setLocation={setLocation}
                    />
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-4 border-t pt-6 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkDescriptionModal;