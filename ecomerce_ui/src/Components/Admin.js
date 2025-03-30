// import React, { useState } from "react";
// import Users from "./Users/Users";
// import MostSelling from "./Sales/MostSelling";
// import LowStock from "./Products/LowStock";
// import ActivateProduct from "./Products/ActivateProduct";
// import NewProduct from "./Products/NewProduct"
// import ProductSales from "./Sales/ProductSales";
// import CategorySales from "./Sales/CategorySales";
// import '../Styles/Admin.css'

// export default function Admin() {
//     const [showUsers, setShowUsers] = useState(false);
//     const [showMostSellingProducts, setShowMostSellingProducts] = useState(false);
//     const [showLowStock, setShowLowStock] = useState(false);
//     const [showActivateProduct, setShowActivateProduct] = useState(false);
//     const [showAddNewProduct, setshowAddNewProduct] = useState(false);
//     const [showProductSales, setShowProductSales] = useState(false);
//     const [showCategorySales, setShowCategorySales] = useState(false);

//     const handleShowUsers = () => {
//         setShowUsers(true);
//         setShowLowStock(false);
//         setShowMostSellingProducts(false);
//         setShowActivateProduct(false);
//         setshowAddNewProduct(false);
//         setShowProductSales(false);
//         setShowCategorySales(false);
//     };

//     const handleShowMostSellingProducts = () => {
//         setShowMostSellingProducts(true);
//         setShowUsers(false);
//         setShowLowStock(false);
//         setShowActivateProduct(false);
//         setshowAddNewProduct(false);
//         setShowProductSales(false);
//         setShowCategorySales(false);
//     };

//     const handleShowLowStock = () => {
//         setShowLowStock(true);
//         setShowMostSellingProducts(false);
//         setShowActivateProduct(false);
//         setShowUsers(false);
//         setshowAddNewProduct(false);
//         setShowProductSales(false);
//         setShowCategorySales(false);
//     };

//     const handleShowActivate = () => {
//         setShowActivateProduct(true);
//         setShowLowStock(false);
//         setShowMostSellingProducts(false);
//         setShowUsers(false);
//         setshowAddNewProduct(false);
//         setShowProductSales(false);
//         setShowCategorySales(false);
//     }

//     const handleShowAddNewProduct = () => {
//         setshowAddNewProduct(true);
//         setShowLowStock(false);
//         setShowMostSellingProducts(false);
//         setShowUsers(false);
//         setShowActivateProduct(false);
//         setShowProductSales(false);
//         setShowCategorySales(false);
//     }

//     const handleShowProductSales = () =>{
//         setShowProductSales(true);
//         setShowUsers(false);
//         setShowMostSellingProducts(false);
//         setShowLowStock(false);
//         setShowActivateProduct(false);
//         setshowAddNewProduct(false);
//         setShowCategorySales(false);
//     }

//     const handleShowCategorySales = () =>{
//         setShowCategorySales(true);
//         setShowUsers(false);
//         setShowMostSellingProducts(false);
//         setShowLowStock(false);
//         setShowActivateProduct(false);
//         setshowAddNewProduct(false);
//         setShowProductSales(false);
//     }

//     const closeModal = () => {
//         setShowUsers(false);
//         setShowMostSellingProducts(false);
//         setShowLowStock(false);
//         setShowActivateProduct(false);
//         setshowAddNewProduct(false);
//         setShowProductSales(false);
//         setShowCategorySales(false);
//     };

//     return (
//         <div className="admin-container">
//             <h2>Admin Functions</h2>
//             <div className="admin-functions">
//                 <h3 onClick={handleShowUsers}>
//                     Check all users.
//                 </h3>
//                 <h3 onClick={handleShowAddNewProduct}>
//                     Add new product.
//                 </h3>
//                 <h3 onClick={handleShowActivate}>
//                     Restore and delete products.
//                 </h3>
//                 <h3 onClick={handleShowMostSellingProducts}>
//                     Most selling products.
//                 </h3>
//                 <h3 onClick={handleShowLowStock}>
//                     Products on low stock.
//                 </h3>
//                 <h3 onClick={handleShowProductSales}>
//                     Sales per product.
//                 </h3>
//                 <h3 onClick={handleShowCategorySales}>
//                     Sales per category.
//                 </h3>
//             </div>

//             {(showUsers || showMostSellingProducts || showLowStock || showActivateProduct || showAddNewProduct || showProductSales || showCategorySales) && (
//                 <div className="modal-background" onClick={closeModal}></div>
//             )}

//             {showUsers && (
//                 <div className="modal-content">
//                     <div className="modal-close" onClick={closeModal}>X</div>
//                     <Users />
//                 </div>
//             )}

//             {showMostSellingProducts && (
//                 <div className="modal-content">
//                     <div className="modal-close" onClick={closeModal}>X</div>
//                     <MostSelling />
//                 </div>
//             )}

//             {showLowStock && (
//                 <div className="modal-content">
//                     <div className="modal-close" onClick={closeModal}>X</div>
//                     <LowStock />
//                 </div>
//             )}

//             {showActivateProduct && (
//                 <div className="modal-content">
//                     <div className="modal-close" onClick={closeModal}>X</div>
//                     <ActivateProduct />
//                 </div>
//             )}

//             {showAddNewProduct && (
//                 <div className="modal-content">
//                     <div className="modal-close" onClick={closeModal}>X</div>
//                     <NewProduct />
//                 </div>
//             )}

//             {showProductSales && (
//                 <div className="modal-content">
//                     <div className="modal-close" onClick={closeModal}>X</div>
//                     <ProductSales />
//                 </div>
//             )}

//             {showCategorySales && (
//                 <div className="modal-content">
//                     <div className="modal-close" onClick={closeModal}>X</div>
//                     <CategorySales />
//                 </div>
//             )}
//         </div>
//     );
// }
