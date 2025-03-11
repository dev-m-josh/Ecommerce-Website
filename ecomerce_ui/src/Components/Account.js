import axios from "axios";
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function Account() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    

    const user = JSON.parse(localStorage.getItem("signedUser"));
    const token = localStorage.getItem("token");

    const togglePassword = () => setShowPassword((prev) => !prev);

    const toggleNewPassword = () => setShowNewPassword((prev) => !prev);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(""); 
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
            if (error.response.data) {
                setErrorMessage(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>User Details</h2>
            <p><strong>First Name:</strong> {user.FirstName}</p>
            <p><strong>Last Name:</strong> {user.LastName}</p>
            <p><strong>Email:</strong> {user.Email}</p>
            <p><strong>User Role:</strong> {user.UserRole}</p>

            <h3>Change Password</h3>
            <form onSubmit={handleChangePassword}>
                <div>
                    <label>Current Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                    <button className="password-visibility" type="button" onClick={togglePassword}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>

                <div>
                    <label>New Password</label>
                    <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button className="password-visibility" type="button" onClick={toggleNewPassword}>
                        <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                    </button>
                </div>

                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </div>

                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </form>
        </div>
    );
}
