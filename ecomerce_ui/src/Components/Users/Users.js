import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

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

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

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

    const deleteUser = async (userId) => {

        const confirmDelete = window.confirm('Are you sure you want to delete this user?');

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:4500/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
    
            setUsers((prevUsers) => prevUsers.filter(user => user.UserId !== userId));
            setShowUserOptions(null);
            alert('User deleted successfully!');
        } catch (error) {
            setErrorMessage(error.message);
            alert('Error deleting user: ' + error.message);
        };
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
                                            <p onClick={() => navigate('/users-role') && setShowUserOptions(false)}>Update user role.</p>
                                            <p onClick={() => deleteUser(user.UserId) && setShowUserOptions(false)}>Delete user.</p>
                                            <p onClick={() => fetchUserDetails(user.UserId) && setShowUserOptions(false)}>View profile.</p>
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
                    <div className="modal-content">
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
        </div>
    );
}
