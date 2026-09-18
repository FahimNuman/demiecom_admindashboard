import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const ManageUsersModal = ({ isOpen, onClose, group, allUserOptions, onSave }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    if (group) {
      setSelectedOptions(group.users || []);
    }
  }, [group]);

  if (!isOpen || !group) return null;

  const handleSave = () => {
    onSave(group.id, selectedOptions);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Manage Users for "{group.name}"</h2>
        <div className="mb-6">
          <Select
            isMulti
            options={allUserOptions}
            value={selectedOptions}
            onChange={setSelectedOptions}
            placeholder="Select users..."
            closeMenuOnSelect={false}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersModal;
