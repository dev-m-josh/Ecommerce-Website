import React from "react";
import { Link } from "react-router-dom";

export default function Admin() {
    return (
        <div>
            <h2>Admin Functions</h2>
            <div>
                <ul>
                    <li>
                        <Link to="/users">Check all users.</Link>
                    </li>
                    <li>
                        <Link to="/users-role">Update user role.</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
