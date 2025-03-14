import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserRole() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate("/admin");
    };
    
    return(
        <div>
            <h2>Roles Updates</h2>
            <button onClick={handleBackClick}>Back</button>
        </div>
    );
};