import React from "react";
import { Link, Outlet } from "react-router-dom";
import '../Styles/Dashboard.css'

export default function AdminDash() {
    return(
        <div className="admin-dash">
            <div className="admin-links">
                <Link to='/dashboard'>
                    Dashboard
                </Link>
                <Link to='/users'>
                    Users
                </Link>
                <Link to='/products'>
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