import React, { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


export default function SignUp() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password toggle
    const togglePassword = () => setShowPassword((prev) => !prev);
    const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

    //submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
            setErrorMessage("Invalid email address!");
            return;
        };

        if (!phoneNumber.match(/^07\d{8}$/)) {
            setErrorMessage("Invalid phone number!");
            return;
        };

        if (password.length < 6) {
            setErrorMessage("Password should be at least 6 characters long");
            return;
        };

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        };

        const userDetails = {
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            PhoneNumber: phoneNumber,
            UserPassword: password
        };

        try {
            const response = await axios.post(
                "http://localhost:4500/users",
                 userDetails
            );

            const data = response.data;

            localStorage.setItem("token", JSON.stringify(data.token));

            const signedUpUser = {
                UserId: data.UserId,
                FirstName: data.FirstName,
                LastName: data.LastName,
                Email: data.Email,
                PhoneNumber: data.PhoneNumber,
                UserRole: data.UserRole,
                UserStatus: data.UserStatus
            };

            localStorage.setItem("signedUser", JSON.stringify(signedUpUser));

            toast.success("You have successfully signed in!");
            navigate("/");
            
        } catch (error) {
            console.error("There was an error during sign-up", error);
            setErrorMessage("An error occurred. Please try again.");
        };

    }

    return(
        <div className="login-form">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="user-details">
                    <label htmlFor="firstName">FirstName:</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFirstName(value.charAt(0).toUpperCase() + value.slice(1));
                        }}
                        required
                    />
                </div>
                <div className="user-details">
                    <label htmlFor="lastName">LastName:</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => {
                            const value = e.target.value;
                            setLastName(value.charAt(0).toUpperCase() + value.slice(1));
                        }}
                        required
                    />
                </div>
                <div className="user-details">
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPhoneNumber(value);
                        }}
                        required
                    />
                </div>
                <div className="user-details">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="user-details">
                    <label htmlFor="password">Password:</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="password-visibility" type="button" onClick={togglePassword}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
                <div className="user-details">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button className="password-visibility" type="button" onClick={toggleConfirmPassword}>
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                </div>

                {errorMessage && <p
                 style={{color: "red"}}>
                 {errorMessage}
                </p>}

                <div className="submit-btn">
                    <button type="submit">
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    )
};