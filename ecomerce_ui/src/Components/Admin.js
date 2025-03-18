import React, { useState } from "react";
import UserRoles from "./UserRoles";
import Users from "./Users";
import MostSelling from "./MostSelling";
import LowStock from "./LowStock";
import DeactivateProduct from "./DeactivateProduct";

export default function Admin() {
    const [showUsers, setShowUsers] = useState(false);
    const [showUserRoles, setShowUserRoles] = useState(false);
    const [showMostSellingProducts, setShowMostSellingProducts] = useState(false);
    const [showLowStock, setShowLowStock] = useState(false);
    const [showDeactivate, setShowDeactivate] = useState(false);

    const handleShowUsers = () => {
        setShowUsers(true);
        setShowUserRoles(false);
        setShowMostSellingProducts(false);
        setShowDeactivate(false);
    };

    const handleShowUserRoles = () => {
        setShowUserRoles(true);
        setShowUsers(false);
        setShowMostSellingProducts(false);
        setShowDeactivate(false);
    };

    const handleShowMostSellingProducts = () => {
        setShowMostSellingProducts(true);
        setShowUserRoles(false);
        setShowUsers(false);
        setShowDeactivate(false);
    };

    const handleShowLowStock = () => {
        setShowLowStock(true);
        setShowMostSellingProducts(false);
        setShowUserRoles(false);
        setShowUsers(false);
        setShowDeactivate(false);
    };

    const handleShowDeactivate = () => {
        setShowDeactivate(true);
        setShowLowStock(false);
        setShowMostSellingProducts(false);
        setShowUserRoles(false);
        setShowUsers(false);
    }

    const closeModal = () => {
        setShowUsers(false);
        setShowUserRoles(false);
        setShowMostSellingProducts(false);
        setShowLowStock(false);
        setShowDeactivate(false);
    };

    return (
        <div className="admin-container">
            <h2>Admin Functions</h2>
            <div>
                <ul>
                    <li>
                        <h3 onClick={handleShowUsers}>
                            Check all users.
                        </h3>
                    </li>
                    <li>
                        <h3 onClick={handleShowUserRoles}>
                            Update user role.
                        </h3>
                    </li>
                    <li>
                        <h3 onClick={handleShowMostSellingProducts}>
                            Most selling products.
                        </h3>
                    </li>
                    <li>
                        <h3 onClick={handleShowLowStock}>
                            Products on low stock.
                        </h3>
                    </li>
                    <li>
                        <h3 onClick={handleShowDeactivate}>
                            Delete product.
                        </h3>
                    </li>
                </ul>
            </div>

            {(showUsers || showUserRoles) && (
                <div className="modal-background" onClick={closeModal}></div>
            )}

            {showUsers && (
                <div className="modal-content">
                    <div className="modal-close" onClick={closeModal}>X</div>
                    <Users />
                </div>
            )}

            {showUserRoles && (
                <div className="modal-content">
                    <div className="modal-close" onClick={closeModal}>X</div>
                    <UserRoles />
                </div>
            )}

            {showMostSellingProducts && (
                <div className="modal-content">
                    <div className="modal-close" onClick={closeModal}>X</div>
                    <MostSelling />
                </div>
            )}

            {showLowStock && (
                <div className="modal-content">
                    <div className="modal-close" onClick={closeModal}>X</div>
                    <LowStock />
                </div>
            )}

            {showDeactivate && (
                <div className="modal-content">
                    <div className="modal-close" onClick={closeModal}>X</div>
                    <DeactivateProduct />
                </div>
            )}
        </div>
    );
}
