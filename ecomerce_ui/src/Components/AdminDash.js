import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import '../Styles/Dashboard.css'

export default function AdminDash() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/products');
            return;
        };
    });

    return(
        <div className="admin-dash">
            <div className="admin-links">
                <Link to='/dashboard'>
                    Dashboard
                </Link>
                <Link to='/users'>
                    Users
                </Link>
                <Link to='/stock'>
                    Products
                </Link>
            </div>
            <div className="dashboard-content">
                <Outlet>
                    
                </Outlet>
            </div>
        </div>
    )
}