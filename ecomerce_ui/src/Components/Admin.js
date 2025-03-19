import React, { useState } from "react";
import UserRoles from "./UserRoles";
import Users from "./Users";
import MostSelling from "./MostSelling";
import LowStock from "./LowStock";
import ActivateProduct from "./ActivateProduct";
import NewProduct from "./NewProduct";

export default function Admin() {
    const [showUsers, setShowUsers] = useState(false);
    const [showUserRoles, setShowUserRoles] = useState(false);
    const [showMostSellingProducts, setShowMostSellingProducts] = useState(false);
    const [showLowStock, setShowLowStock] = useState(false);
    const [showActivateProduct, setShowActivateProduct] = useState(false);
    const [showAddNewProduct, setshowAddNewProduct] = useState(false);

    const handleShowUsers = () => {
        setShowUsers(true);
        setShowUserRoles(false);
        setShowLowStock(false);
        setShowMostSellingProducts(false);
        setShowActivateProduct(false);
        setshowAddNewProduct(false);
    };

    const handleShowUserRoles = () => {
        setShowUserRoles(true);
        setShowUsers(false);
        setShowLowStock(false);
        setShowMostSellingProducts(false);
        setShowActivateProduct(false);
        setshowAddNewProduct(false);
    };

    const handleShowMostSellingProducts = () => {
        setShowMostSellingProducts(true);
        setShowUserRoles(false);
        setShowUsers(false);
        setShowLowStock(false);
        setShowActivateProduct(false);
        setshowAddNewProduct(false);
    };

    const handleShowLowStock = () => {
        setShowLowStock(true);
        setShowMostSellingProducts(false);
        setShowUserRoles(false);
        setShowActivateProduct(false);
        setShowUsers(false);
        setshowAddNewProduct(false);
    };

    const handleShowActivate = () => {
        setShowActivateProduct(true);
        setShowLowStock(false);
        setShowMostSellingProducts(false);
        setShowUserRoles(false);
        setShowUsers(false);
        setshowAddNewProduct(false);
    }

    const handleShowAddNewProduct = () => {
        setshowAddNewProduct(true);
        setShowLowStock(false);
        setShowMostSellingProducts(false);
        setShowUserRoles(false);
        setShowUsers(false);
        setShowActivateProduct(false);
    }

    const closeModal = () => {
        setShowUsers(false);
        setShowUserRoles(false);
        setShowMostSellingProducts(false);
        setShowLowStock(false);
        setShowActivateProduct(false);
        setshowAddNewProduct(false);
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
                        <h3 onClick={handleShowAddNewProduct}>
                            Add new product.
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
                        <h3 onClick={handleShowActivate}>
                            Delete and restore a product.
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

            {showActivateProduct && (
                <div className="modal-content">
                    <div className="modal-close"
                    onClick={closeModal}>X</div>
                    <ActivateProduct />
                </div>
            )}

            {showAddNewProduct && (
                <div className="modal-content">
                    <div className="modal-close"
                    onClick={closeModal}>X</div>
                    <NewProduct />
                </div>
            )}
        </div>
    );
}
