import React, { useState } from 'react';

// Mock user data, in a real app this would come from an API
const allUsers = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
  { id: 4, name: 'David' },
  { id: 5, name: 'Eve' },
];

const CreateGroupForm = () => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!groupName || selectedUsers.length === 0) {
      alert('Please provide a group name and select at least one user.');
      return;
    }

    const newGroup = {
      id: Date.now(),
      name: groupName,
      description: groupDescription,
      users: selectedUsers.map(userId => allUsers.find(u => u.id === parseInt(userId))),
    };

    setGroups([...groups, newGroup]);
    setGroupName('');
    setGroupDescription('');
    setSelectedUsers([]);
  };

  const handleUserSelection = (e) => {
    const options = [...e.target.selectedOptions];
    const values = options.map(option => option.value);
    setSelectedUsers(values);
  };

  const handleDeleteUserFromGroup = (groupId, userId) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          users: group.users.filter(user => user.id !== userId),
        };
      }
      return group;
    }));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create User Group</h1>
      
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleCreateGroup}>
          <div className="mb-6">
            <label htmlFor="groupName" className="block text-lg font-medium text-gray-700 mb-2">Group Name</label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter group name"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="groupDescription" className="block text-lg font-medium text-gray-700 mb-2">Description</label>
            <textarea
              id="groupDescription"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a short description for the group"
            ></textarea>
          </div>

          <div className="mb-6">
            <label htmlFor="assignUsers" className="block text-lg font-medium text-gray-700 mb-2">Assign Users</label>
            <div className="flex items-start space-x-4">
              <select
                id="assignUsers"
                multiple
                value={selectedUsers}
                onChange={handleUserSelection}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-40"
              >
                {allUsers.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
              <button
                type="submit"
                className="h-12 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200"
              >
                Create Group
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Created Groups</h2>
        {groups.length === 0 ? (
          <p className="text-center text-gray-500">No groups created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map(group => (
              <div key={group.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{group.name}</h3>
                <p className="text-gray-600 mb-4">{group.description}</p>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Users in this group:</h4>
                  <ul className="space-y-2">
                    {group.users.map(user => (
                      <li key={user.id} className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md">
                        <span className="text-gray-800">{user.name}</span>
                        <button
                          onClick={() => handleDeleteUserFromGroup(group.id, user.id)}
                          className="text-red-500 hover:text-red-700 font-semibold"
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGroupForm;
