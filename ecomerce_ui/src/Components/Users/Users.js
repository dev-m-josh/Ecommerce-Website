import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import SignUp from "./SignUp";
import '../../Styles/Login.css';

export default function Users() {
    const user = JSON.parse(localStorage.getItem("signedUser"));
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
    const [showAddUser, setShowAddUser] = useState(false);  
    const [activeUsers, setActiveUsers] = useState('active');

    useEffect(() => {
        if (!token || user.UserRole !== "Admin") {
            navigate('/products');
            return;
        };
    });

    const fetchUpdatedUsers = useCallback(async () => {
        try {
            const endpoint =
                    `http://localhost:4500/users?page=${page}&pageSize=${pageSize}&activeUsers=${activeUsers === 'active' ? '1' : '0'}`
        
            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    }, [page, pageSize, token, activeUsers]);

    useEffect(() => {
        fetchUpdatedUsers();
    }, [fetchUpdatedUsers]);

    const handleUserDeactivateOrRestore = async (UserId, action) => {
        try {
            const isActive = (action === 'deactivate' ? '0' : '1');
    
            const response = await axios.put(
                `http://localhost:4500/users/deactivate-user/${UserId}?isActive=${isActive}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            const data = response.data;
            toast.success(data.message);
    
            setUsers((prevUsers) => {
                const updatedUsers = prevUsers.map((user) =>
                    user.UserId === UserId
                        ? { ...user, isActive: action === 'deactivate' ? false : true }
                        : user
                );
                return updatedUsers;
            });
    
            fetchUpdatedUsers();
    
        } catch (error) {
            console.log("Error:", error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message);
                alert(error.response.data.message);
            } else {
                setErrorMessage('An unexpected error occurred.');
                alert('An unexpected error occurred.');
            }
        }
    };
       
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
            toast.success("Role updated successfully");
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
                const endpoint =
                 `http://localhost:4500/users?page=${page}&pageSize=${pageSize}&activeUsers=${activeUsers === 'active' ? '1' : '0'}`

                const response = await fetch(endpoint,
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
    }, [page, pageSize, navigate, token, activeUsers]);

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
        setShowAddUser(false);
    };    

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (errorMessage) {
        return <div className="error">Error: {errorMessage}</div>;
    }

    return (
        <div className="users">
            <div className="products-header">
                <h2>Users</h2>
                <select onChange={(e) => setActiveUsers(e.target.value)} value={activeUsers}>
                    <option value="active">Active users</option>
                    <option value="inactive">Inactive users</option>
                </select>
                <button onClick={() => setShowAddUser(true)}>New User</button>
            </div>
            
            {users.length === 0 ? (
                <div>No {activeUsers} users available to display.</div>
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
                                    <select
                                        value={showUserOptions === user.UserId ? user.UserId : ''}
                                        onChange={(e) => {
                                            const selectedOption = e.target.value;
                                            if (selectedOption === "deactivate" && user.isActive === true) {
                                                handleUserDeactivateOrRestore(user.UserId, 'deactivate');
                                            } else if (selectedOption === "restore" && user.isActive === false) {
                                                handleUserDeactivateOrRestore(user.UserId, 'restore');
                                            } else if (selectedOption === "details") {
                                                fetchUserDetails(user.UserId);
                                            } else if (selectedOption === "delete") {
                                                confirmDeleteUser(user.UserId);
                                            } else if (selectedOption === "edit") {
                                                setEditingUser(user);
                                            }
                                            setShowUserOptions(null);
                                        }}
                                        onClick={() => toggleUserOptions(user.UserId)}
                                    >
                                        <option value="">Select Action</option>
                                        {user.isActive === true ? (
                                            <option value="deactivate">Delete user</option>
                                        ) : (
                                            <option value="restore">Restore user</option>
                                        )}
                                        <option value="details">View profile</option>
                                        <option value="edit">Edit user</option>
                                    </select>
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
                        <button className="modal-close" onClick={closeModal}>X</button>
                        {userDetails && (
                            <div className="user-details">
                                <p><strong>First Name:</strong> {userDetails.FirstName}</p>
                                <p><strong>Last Name:</strong> {userDetails.LastName}</p>
                                <p><strong>Email:</strong> {userDetails.Email}</p>
                                <p><strong>Phone Number:</strong> {userDetails.PhoneNumber}</p>
                                <p><strong>Role:</strong> {userDetails.UserRole}</p>
                                <p><strong>Created At:</strong> {userDetails.created_at.split('T')[0]}</p>
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
                                <option value="">{editingUser.UserRole}</option>
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

            {showAddUser && (
                <div className="modal-overlay" onClick={() => closeModal()}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => closeModal()}>X</button>
                        <SignUp/>
                    </div>
                </div>
            )}
        </div>
    );
};
