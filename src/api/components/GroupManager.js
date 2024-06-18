// src/components/GroupManager.js
import React, { useState } from 'react';

function GroupManager({ onCreateGroup }) {
    const [groupName, setGroupName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreateGroup(groupName);
    };

    return (
        <div>
            <h2>Create a New Group</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Group Name"
                    required
                />
                <button type="submit">Create Group</button>
            </form>
        </div>
    );
}

export default GroupManager;
