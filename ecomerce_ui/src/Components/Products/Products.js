import React, { useState, useEffect, useCallback } from "react";
import NewProduct from "./NewProduct";
import { toast } from "react-toastify";
import axios from 'axios';
import '../Users/Users.css'

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [noMoreProducts, setNoMoreProducts] = useState(false);
    const token = localStorage.getItem('token');
    const [showUserOptions, setShowUserOptions] = useState(null);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newPrice, setNewPrice] = useState("");
    const [newStockQuantity, setNewStockQuantity] = useState("");
    const [newProductDiscount, setNewProductDiscount] = useState("");
    const [showProductEdit, setShowProductEdit] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [inStock, setInStock] = useState('inStock');

    const fetchUpdatedProducts = useCallback(async () => {
        try {
            const endpoint =
                    `http://localhost:4500/products?page=${page}&pageSize=${pageSize}&inStock=${inStock === 'inStock' ? '1' : '0'}`
        
            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
        
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    }, [page, pageSize, token, inStock]);
    
    useEffect(() => {
        fetchUpdatedProducts();
    }, [fetchUpdatedProducts]);
    
    const handleDeleteOrRestoreProduct = async (ProductId, action) => {
        try {
            const isActive = (action === 'deactivate' ? '0' : '1');

            const response = await axios.put(
                `http://localhost:4500/products/deactivate-product/${ProductId}?inStock=${isActive}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        
            const data = response.data;
            toast.success(data.message);
            
            setProducts((prevProducts) => {
                const updatedProducts = prevProducts.map((product) =>
                    product.ProductId === ProductId
                        ? { ...product, isActive: action === 'deactivate' ? false : true }
                        : product
                );
                return updatedProducts;
            });

            fetchUpdatedProducts();
            
        } catch (error) {
            console.log("Deactivate error:", error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message);
                alert(error.response.data.message);
            } else {
                setErrorMessage('An unexpected error occurred.');
                alert('An unexpected error occurred.');
            }
        }
    };
        
    const toggleUserOptions = (productId) => {
        setShowUserOptions((prev) => (prev === productId ? null : productId));
    };

    const closeModal = () => {
        setShowAddProduct(false);
        setShowProductEdit(false);
    };

    const productEdits ={
        Price: newPrice,
        StockQuantity:newStockQuantity,
        ProductDiscount:newProductDiscount
    }

    const handleProductEdit = async () => {
        if (!newPrice || !newStockQuantity || !newProductDiscount) {
            alert("Please fill all the inputs!")
            return;
        };

        try {
            const response = await fetch(
                `http://localhost:4500/products/edit/${editingProduct.ProductId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ 
                        Price: productEdits.Price,
                        StockQuantity: productEdits.StockQuantity,
                        ProductDiscount: productEdits.ProductDiscount
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to edit product.");
            };

            setNewPrice("");
            setNewStockQuantity("");
            setNewProductDiscount("");
            setShowProductEdit(false);
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.ProductId === editingProduct.ProductId
                        ? { ...product, 
                            Price: newPrice.toLocaleString(),
                            StockQuantity: newStockQuantity, ProductDiscount:newProductDiscount 
                        }
                        : product
                )
            );

        } catch (err) {
            console.error("Error updating product:", err);
            alert("Error updating product");
        };
    };

    useEffect(() => {
        if (editingProduct) {
            setNewPrice(editingProduct.Price);
            setNewStockQuantity(editingProduct.StockQuantity);
            setNewProductDiscount(editingProduct.ProductDiscount);
        }
    }, [editingProduct]);

    const confirmDeleteProduct = (productId) => {
        setProductToDelete(productId);
        setShowDeleteModal(true);
    };
    
    const deleteProduct = async () => {
        if (!productToDelete) return;

        try {
            const response = await fetch(`http://localhost:4500/products/${productToDelete}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            setProducts((prevProducts) => prevProducts.filter(product => product.ProductId !== productToDelete));
            setShowUserOptions(null);
            setShowDeleteModal(false);
        } catch (error) {
            setErrorMessage(error.message);
            alert('Error deleting product: ' + error.message);
        };
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const endpoint =
                        `http://localhost:4500/products?page=${page}&pageSize=${pageSize}&inStock=${inStock === 'inStock' ? '1' : '0'}`
    
                const response = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`${response.statusText}`);
                }
    
                const data = await response.json();
    
                if (data.length < pageSize) {
                    setNoMoreProducts(true);
                } else {
                    setNoMoreProducts(false);
                }
    
                setProducts(data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setErrorMessage(
                    "There was an error fetching the products. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };
    
        fetchProducts();
    }, [page, pageSize, token, inStock]);

    const handleNextPage = () => {
        if (!noMoreProducts && !loading) {
            setPage((nextPage) => nextPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1 && !loading) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (errorMessage) {
        return <div className="error">{errorMessage}</div>;
    }

    return (
        <div className="products">
            <div className="products-header">
                <h2>Products</h2>
                <select onChange={(e) => setInStock(e.target.value)} value={inStock}>
                    <option value="inStock">Active products</option>
                    <option value="deleted">Deleted products</option>
                </select>
                <button onClick={() => { setShowAddProduct(true); setShowUserOptions(false) }}>New product</button>
            </div>
            {products.length === 0 ? (
                <div>No {inStock} products available to display.</div>
            ) : (
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock Quantity</th>
                        <th>Discount</th>
                        <th className="actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.ProductId}>
                            <td>{product.ProductName}</td>
                            <td>{product.Category}</td>
                            <td>{product.Price.toLocaleString()}</td>
                            <td>{product.StockQuantity}</td>
                            <td>{product.ProductDiscount}</td>
                            <td className="options">
                                <select
                                    value={showUserOptions === product.ProductId ? product.ProductId : ''}
                                    onChange={(e) => {
                                        const selectedOption = e.target.value;
                                        if (selectedOption === "deactivate" && product.inStock === true) {
                                            handleDeleteOrRestoreProduct(product.ProductId, 'deactivate');
                                        } else if (selectedOption === "restore" && product.inStock === false) {
                                            handleDeleteOrRestoreProduct(product.ProductId, 'restore');
                                        } else if (selectedOption === "delete") {
                                            confirmDeleteProduct(product.ProductId);
                                        } else if (selectedOption === "edit") {
                                            setEditingProduct(product);
                                            setShowProductEdit(true);
                                        }
                                        setShowUserOptions(null);
                                    }}
                                    onClick={() => toggleUserOptions(product.ProductId)}
                                >
                                    <option value="">Select Action</option>
                                    {product.inStock === true ? (
                                        <option value="deactivate">Delete product</option>
                                    ) : (
                                        <option value="restore">Restore product</option>
                                    )}
                                    {/* <option value="delete">Delete</option> */}
                                    <option value="edit">Edit product</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}

            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={page === 1 || loading}>
                    Previous
                </button>
                <span>{`Page ${page}`}</span>
                <button onClick={handleNextPage} disabled={noMoreProducts || loading}>
                    Next
                </button>
            </div>

            {showAddProduct && (
                <div className="modal-overlay" onClick={() => closeModal()}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => closeModal()}>X</button>
                        <NewProduct />
                    </div>
                </div>
            )}

            {showProductEdit && (
                <div className="modal-overlay" onClick={() => closeModal()}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => closeModal()}>X</button>
                        <div className="form-group">
                            <label htmlFor="ProductName">ProductName:</label>
                            <input 
                                type="text"
                                id="productName"
                                name="productName"
                                value={editingProduct.ProductName}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description:</label>
                            <input 
                                type="text"
                                id="description"
                                name="description"
                                value={editingProduct.Description}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Price:</label>
                            <input 
                                type="number"
                                id="Price"
                                name="Price"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stockQuantity">StockQuantity:</label>
                            <input 
                                type="number"
                                id="stockQuantity"
                                name="stockQuantity"
                                value={newStockQuantity}
                                onChange={(e) => setNewStockQuantity(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="discount">ProductDiscount:</label>
                            <input 
                                type="number"
                                id="discount"
                                name="discount"
                                value={newProductDiscount}
                                onChange={(e) => setNewProductDiscount(e.target.value)}
                            />
                        </div>
                        <button onClick={handleProductEdit}>
                            Save changes
                        </button>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay" onClick={handleDeleteCancel}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Are you sure you want to delete this product completely?</h3>
                        <div className="modal-actions">
                            <button onClick={deleteProduct}>Yes, delete</button>
                            <button onClick={handleDeleteCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
