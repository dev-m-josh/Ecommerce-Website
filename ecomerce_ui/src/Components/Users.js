import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5); 
    const [noMoreUsers, setNoMoreUsers] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
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

                    if (data.length < pageSize) {
                        setNoMoreUsers(true);
                    } else {
                        setNoMoreUsers(false);
                    }
                } else {
                    throw new Error("Unexpected response format");
                }
            } catch (err) {
                console.error("Error fetching staffs:", err);
                setErrorMessage(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [page, pageSize, navigate, token]);

    // Handle pagination for next and previous page
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

    if (loading) {
        return <div className="loading">Loading...</div>
    };

    if (errorMessage) {
        return <div className="error">Error: {errorMessage}</div>
    }

    const handleBackClick = () => {
        navigate("/admin");
    };

    return (
        <div className="users">
            <h2>Active users.</h2>
            {users.length === 0 ? (
                <div>No active users yet.</div>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>FirstName</th>
                            <th>LastName</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>PhoneNumber</th>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button onClick={handleBackClick}>Back</button>
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
        </div>
    );
}
