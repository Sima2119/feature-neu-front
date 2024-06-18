import React, { useState } from 'react';
import { createGroup } from '../api'; 

function CreateGroup() {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await createGroup({ name, ownerId: 1 }); // Assuming ownerId is 1 for now
            setSuccess('Group created successfully!');
            setName('');
        } catch (err) {
            setError('Failed to create group');
        }
    };

    return (
        <div>
            <h2>Create a Group</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Group Name"
                    required
                />
                <button type="submit">Create Group</button>
            </form>
        </div>
    );
}

export default CreateGroup;
