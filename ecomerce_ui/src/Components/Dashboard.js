import React, {useEffect} from "react";
import '../Styles/Dashboard.css'
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem("signedUser"));
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !user.UserRole === "Admin") {
            navigate('/products');
            return;
        };
    });

    return(
        <div className="dashboard">
            <h3>Admin Functions.</h3>
            <hr/>
        </div>
    );
};
