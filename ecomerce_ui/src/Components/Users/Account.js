import axios from "axios";
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import './Account.css'

export default function Account() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false); 
    const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false); 
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("signedUser"));
    const token = localStorage.getItem("token");
    const UserId = user.UserId;

    const togglePassword = () => setShowPassword((prev) => !prev);
    const toggleNewPassword = () => setShowNewPassword((prev) => !prev);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(""); 

        if (newPassword.length < 6) {
            setErrorMessage("New password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:4500/users/password/${user.UserId}`, 
                {
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                }
            );

            const data = response.data;

            if (data.success) {
                alert(data.message);
            };

        } catch (error) {
            console.log("Error updating password:", error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmAccountDelete = window.confirm("Are you sure you want to delete this account?");

        if (!confirmAccountDelete) return;

        setDeleteLoading(true);

        try {
            const response = await fetch(
                `http://localhost:4500/users/${UserId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete account!");
            }

            localStorage.removeItem("token");
            localStorage.removeItem("signedUser");
            navigate("/");

        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Failed to delete the account. Please try again later.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="account-container">
            {!isChangePasswordVisible && (
                <div className="details">
                    <h2>User Details</h2>
                    <p><strong>First Name:</strong> {user.FirstName}</p>
                    <p><strong>Last Name:</strong> {user.LastName}</p>
                    <p><strong>Email:</strong> {user.Email}</p>
                    <p><strong>User Role:</strong> {user.UserRole}</p>

                    <div className="action-btns">
                        <button className="delete-account-btn" onClick={handleDeleteAccount} disabled={deleteLoading}>
                        {deleteLoading ? "Deleting..." : "Delete Account"}
                        </button>
                        <button className="change-password-button" onClick={() => setIsChangePasswordVisible(!isChangePasswordVisible)}>
                            {isChangePasswordVisible ? "Cancel" : "Change Password"}
                        </button>
                    </div>
                </div>
            )}

            {isChangePasswordVisible && (
                <form className="password-change-form" onSubmit={handleChangePassword}>
                    <h3>Update Password</h3>
                    <div className="password-field">
                        <label htmlFor="currentPassword">Current Password</label>
                        <div className="inputs">
                        <input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        <button className="password-toggle-btn" type="button" onClick={togglePassword} aria-label="Toggle password visibility">
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                        </div>
                    </div>

                    <div className="password-field">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="inputs">
                        <input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button className="password-toggle-btn" type="button" onClick={toggleNewPassword} aria-label="Toggle password visibility">
                            <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                        </button>
                        </div>
                    </div>

                    <div className="password-action">
                        <button
                            className={`change-password-button ${isChangePasswordVisible ? 'cancel' : ''}`}
                            onClick={() => setIsChangePasswordVisible(!isChangePasswordVisible)}
                        >
                            {isChangePasswordVisible ? "Cancel" : "Change Password"}
                        </button>

                        <button className="password-submit-btn" type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>

                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                </form>
            )}
        </div>
    );
}
