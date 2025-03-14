import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserRoles() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [noMoreUsers, setNoMoreUsers] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [editingUser, setEditingUser] = useState(null);
    const [newRole, setNewRole] = useState("");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

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

    const handleCloseModal = () => {
        setEditingUser(null);
        setNewRole("");
    };

    const canGoNext = !noMoreUsers && !loading;
    const canGoPrev = page > 1 && !loading;

    useEffect(() => {
        if (editingUser) {
            setNewRole(editingUser.UserRole);
        }
    }, [editingUser]);

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
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.UserId}>
                                <td>{user.FirstName}</td>
                                <td>{user.LastName}</td>
                                <td>{user.UserRole}</td>
                                <td>{user.Email}</td>
                                <td>
                                    <button onClick={() => setEditingUser(user)}>
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {editingUser && (
                <div className={`edit-modal ${editingUser ? "visible" : ""}`}>
                    <div className="modal-content">
                        <h2>Edit User Role</h2>
                        <h3 onClick={handleCloseModal}>X</h3>
                        <p>Editing: {editingUser.FirstName}</p>
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

            <div className="pagination">
                <button
                    onClick={handlePreviousPage}
                    disabled={!canGoPrev}
                    className="pagination-button"
                >
                    Previous
                </button>
                <span>{`Page ${page}`}</span>
                <button
                    onClick={handleNextPage}
                    disabled={!canGoNext}
                    className="pagination-button"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
