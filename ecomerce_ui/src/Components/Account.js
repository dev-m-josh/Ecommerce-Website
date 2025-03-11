import React from "react";

export default function Account() {
    const user = JSON.parse(localStorage.getItem("signedUser"));
    console.log(user)
    return(
        <div>
            <h2>User Details</h2>
            <p><strong>First Name:</strong> {user.FirstName}</p>
            <p><strong>Last Name:</strong> {user.LastName}</p>
            <p><strong>Email:</strong> {user.Email}</p>
            <p><strong>User Role:</strong> {user.UserRole}</p>
            <p>Change password</p>
        </div>
    )
}