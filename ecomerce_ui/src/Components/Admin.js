import React, { useState } from "react";
import UserRoles from "./UserRoles";
import Users from "./Users";
import MostSelling from "./MostSelling";
import LowStock from "./LowStock";
import ActivateProduct from "./ActivateProduct";
import NewProduct from "./NewProduct";
import ProductSales from "./ProductSales";

export default function Admin() {
    const [showUsers, setShowUsers] = useState(false);
    const [showUserRoles, setShowUserRoles] = useState(false);
    const [showMostSellingProducts, setShowMostSellingProducts] = useState(false);
    const [showLowStock, setShowLowStock] = useState(false);
    const [showActivateProduct, setShowActivateProduct] = useState(false);
    const [showAddNewProduct, setshowAddNewProduct] = useState(false);
    const [showProductSales, setShowProductSales] = useState(false);
    const [showCategorySales, setShowCategorySales] = useState(false);

    const handleShowUsers = () => {
        setShowUsers(true);
        setShowUserRoles(false);
        setShowLowStock(false);
        setShowMostSellingProducts(false);
        setShowActivateProduct(false);
        setshowAddNewProduct(false);
        setShowProductSales(false);
        setShowCategorySales(false);
    };

    const handleShowUserRoles = () => {
        setShowUserRoles(true);
        setShowUsers(false);
        setShowLowStock(false);
        setShowMostSellingProducts(false);
        setShowActivateProduct(false);
        setshowAddNewProduct(false);
        setShowProductSales(false);
        setShowCategorySales(false);
    };

    const handleShowMostSellingProducts = () => {
        setShowMostSellingProducts(true);
        setShowUserRoles(false);
        setShowUsers(false);
        setShowLowStock(false);
        setShowActivateProduct(false);
        setshowAddNewProduct(false);
        setShowProductSales(false);
        setShowCategorySales(false);
    };

    const handleShowLowStock = () => {
        setShowLowStock(true);
        setShowMostSellingProducts(false);
        setShowUserRoles(false);
        setShowActivateProduct(false);
        setShowUsers(false);
        setshowAddNewProduct(false);
        setShowProductSales(false);
        setShowCategorySales(false);
    };

    const handleShowActivate = () => {
        setShowActivateProduct(true);
        setShowLowStock(false);
        setShowMostSellingProducts(false);
        setShowUserRoles(false);
        setShowUsers(false);
        setshowAddNewProduct(false);
        setShowProductSales(false);
        setShowCategorySales(false);
    }

    const handleShowAddNewProduct = () => {
        setshowAddNewProduct(true);
        setShowLowStock(false);
        setShowMostSellingProducts(false);
        setShowUserRoles(false);
        setShowUsers(false);
        setShowActivateProduct(false);
        setShowProductSales(false);
        setShowCategorySales(false);
    }

    const handleShowProductSales = () =>{
        setShowProductSales(true);
        setShowUsers(false);
        setShowUserRoles(false);
        setShowMostSellingProducts(false);
        setShowLowStock(false);
        setShowActivateProduct(false);
        setshowAddNewProduct(false);
        setShowCategorySales(false);
    }

    const handleShowCategorySales = () =>{
        setShowCategorySales(true);
        setShowUsers(false);
        setShowUserRoles(false);
        setShowMostSellingProducts(false);
        setShowLowStock(false);
        setShowActivateProduct(false);
        setshowAddNewProduct(false);
        setShowProductSales(false);
    }

    const closeModal = () => {
        setShowUsers(false);
        setShowUserRoles(false);
        setShowMostSellingProducts(false);
        setShowLowStock(false);
        setShowActivateProduct(false);
        setshowAddNewProduct(false);
        setShowProductSales(false);
        setShowCategorySales(false);
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
                        <h3 onClick={handleShowActivate}>
                            Restore and delete products.
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
                        <h3 onClick={handleShowProductSales}>
                        Sales per product.
                        </h3>
                    </li>
                    <li>
                        <h3 onClick={handleShowCategorySales}>
                            Sales per category.
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
                    <div className="modal-close" onClick={closeModal}>X</div>
                    <ActivateProduct />
                </div>
            )}

            {showAddNewProduct && (
                <div className="modal-content">
                    <div className="modal-close" onClick={closeModal}>X</div>
                    <NewProduct />
                </div>
            )}

            {showProductSales && (
                <div className="modal-content">
                    <div className="modal-close" onClick={closeModal}>X</div>
                    <ProductSales />
                </div>
            )}

            {showCategorySales && (
                <div className="modal-content">
                    <div className="modal-close" onClick={closeModal}>X</div>
                    
                </div>
            )}
        </div>
    );
}
