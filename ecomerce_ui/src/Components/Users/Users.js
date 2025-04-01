import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import './Users.css'

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [noMoreUsers, setNoMoreUsers] = useState(false);
    const [showUserOptions, setShowUserOptions] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newRole, setNewRole] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleRoleUpdate = async () => {
        if (!newRole) {
            alert("Please select a role.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:4500/users/role/${editingUser.UserId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ UserRole: newRole }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update role");
            }

            const data = await response.json();
            alert(data.message);
            setEditingUser(null);
            setNewRole("");
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.UserId === editingUser.UserId
                        ? { ...user, UserRole: newRole }
                        : user
                )
            ); 
        } catch (err) {
            console.error("Error updating role:", err);
            alert("Error updating role");
        }
    };

    const toggleUserOptions = (userId) => {
        setShowUserOptions((prev) => (prev === userId ? null : userId));
    };

    const fetchUserDetails = async (userId) => {
        try {
            const response = await fetch(`http://localhost:4500/users/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }

            const data = await response.json();
            setUserDetails(data[0]);
            setShowUserDetails(true);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const confirmDeleteUser = (userId) => {
        setUserToDelete(userId);
        setShowDeleteModal(true);
    };

    const deleteUser = async () => {
        if (!userToDelete) return;

        try {
            const response = await fetch(`http://localhost:4500/users/${userToDelete}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUsers((prevUsers) => prevUsers.filter(user => user.UserId !== userToDelete));
            setShowUserOptions(null);
            setShowDeleteModal(false);
            alert('User deleted successfully!');
        } catch (error) {
            setErrorMessage(error.message);
            alert('Error deleting user!');
        };
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        };

        const fetchUsers = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `http://localhost:4500/users?page=${page}&pageSize=${pageSize}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`${response.statusText}`);
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setUsers(data);
                    setNoMoreUsers(data.length < pageSize);
                } else {
                    throw new Error("Unexpected response format");
                }
            } catch (err) {
                console.error("Error fetching users:", err);
                setErrorMessage(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [page, pageSize, navigate, token]);

    const handleNextPage = () => {
        if (!noMoreUsers && !loading) {
            setPage((nextPage) => nextPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1 && !loading) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    const closeModal = () => {
        setShowUserDetails(false);
        setUserDetails(null);
        setEditingUser(null);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (errorMessage) {
        return <div className="error">Error: {errorMessage}</div>;
    }

    return (
        <div className="users">
            <h2>Active Users</h2>
            {users.length === 0 ? (
                <div>No users available to display.</div>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>FirstName</th>
                            <th>LastName</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>PhoneNumber</th>
                            <th className="actions">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.UserId}>
                                <td>{user.FirstName}</td>
                                <td>{user.LastName}</td>
                                <td>{user.UserRole}</td>
                                <td>{user.Email}</td>
                                <td>{user.PhoneNumber}</td>
                                <td className="options">
                                    <button onClick={() => toggleUserOptions(user.UserId)}>
                                        Options <FontAwesomeIcon className="icon user-icon" icon={faCaretDown} />
                                    </button>

                                    {showUserOptions === user.UserId && (
                                        <div className="user-options">
                                            <p onClick={() =>{ setEditingUser(user); setShowUserOptions(false)}}>Update user role.</p>
                                            <p onClick={() =>{ confirmDeleteUser(user.UserId); setShowUserOptions(false)}}>Delete user.</p>
                                            <p onClick={() =>{ fetchUserDetails(user.UserId); setShowUserOptions(false)}}>View profile.</p>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="pagination">
                <button
                    onClick={handlePreviousPage}
                    disabled={page === 1 || loading}
                    className="pagination-button"
                >
                    Previous
                </button>
                <span>{`Page ${page}`}</span>
                <button
                    onClick={handleNextPage}
                    disabled={noMoreUsers}
                    className="pagination-button"
                >
                    Next
                </button>
            </div>

            {showUserDetails && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>User Profile</h2>
                        <button className="close-btn" onClick={closeModal}>X</button>
                        {userDetails && (
                            <div>
                                <p><strong>First Name:</strong> {userDetails.FirstName}</p>
                                <p><strong>Last Name:</strong> {userDetails.LastName}</p>
                                <p><strong>Email:</strong> {userDetails.Email}</p>
                                <p><strong>Phone Number:</strong> {userDetails.PhoneNumber}</p>
                                <p><strong>Role:</strong> {userDetails.UserRole}</p>
                                <p><strong>Created At:</strong> {userDetails.created_at}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {editingUser && (
                <div onClick={closeModal} className={`edit-modal ${editingUser ? "visible" : ""}`}>
                    <div onClick={(e) => e.stopPropagation()} className="modal-content">
                        <div>
                            <h2>Edit User Role</h2>
                            <div className="modal-close" onClick={closeModal}>X</div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">FirstName:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={editingUser.FirstName}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">LastName:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={editingUser.LastName}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">LastName:</label>
                            <input
                                type="email"
                                id="Email"
                                name="Email"
                                value={editingUser.Email}
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Role:</label>
                            <select
                                id="role"
                                name="role"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                            >
                                <option value="">Select a role</option>
                                <option value="Admin">Admin</option>
                                <option value="Customer">Customer</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleRoleUpdate} disabled={!newRole}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay" onClick={handleDeleteCancel}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Are you sure you want to delete this user?</h3>
                        <div className="modal-actions">
                            <button onClick={deleteUser}>Yes, delete</button>
                            <button onClick={handleDeleteCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
