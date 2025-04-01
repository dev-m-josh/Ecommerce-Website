import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import ActivateProduct from "./ActivateProduct";
import NewProduct from "./NewProduct";
import { toast } from "react-toastify";
import axios from 'axios';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [noMoreProducts, setNoMoreProducts] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [showUserOptions, setShowUserOptions] = useState(null);
    const [showRestoreProduct, setShowRestoreProduct] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newPrice, setNewPrice] = useState("");
    const [newStockQuantity, setNewStockQuantity] = useState("");
    const [newProductDiscount, setNewProductDiscount] = useState("");
    const [showProductEdit, setShowProductEdit] = useState(false);

    const handleProductRestore = async (ProductId) => {
        try {
            const response = await axios.put(
                `http://localhost:4500/products/activate-product/${ProductId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                }
            );

            const data = response.data;
            toast.success(data.message);
            
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.ProductId === ProductId
                        ? { ...product, ProductStatus: 'Active' }
                        : product
                )
            );

        } catch (error) {
            console.log("Activate error:", error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message);
                alert(error.response.data.message);
            } else {
                setErrorMessage('An unexpected error occurred.');
                alert('An unexpected error occurred.');
            }
        }
    };

    const handleProductDeactivate = async (ProductId) => {
        try {
            const response = await axios.put(
                `http://localhost:4500/products/deactivate-product/${ProductId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                    
                }
            );

            const data = response.data;
            toast.success(data.message);
            
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.ProductId === ProductId
                        ? { ...product, ProductStatus: 'Inactive' }
                        : product
                )
            );
            
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
        setShowRestoreProduct(false);
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
    
    const deleteProduct = async (productId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:4500/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }

            setProducts((prevProducts) => prevProducts.filter(product => product.ProductId !== productId));
            setShowUserOptions(null);
            alert('Product deleted successfully!');
        } catch (error) {
            setErrorMessage(error.message);
            alert('Error deleting product: ' + error.message);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `http://localhost:4500/products/inactive?page=${page}&pageSize=${pageSize}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        }
                    }
                );

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
                setErrorMessage("There was an error fetching the products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, pageSize, token, navigate]);


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
            {products.length === 0 ? (
                <div>No products available to display.</div>
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
                                    <button onClick={() => toggleUserOptions(product.ProductId)}>
                                        Options <FontAwesomeIcon className="icon user-icon" icon={faCaretDown} />
                                    </button>

                                            {showUserOptions === product.ProductId && (
                                                <div className="user-options">
                                            {product.ProductStatus === 'Active' ? (
                                                <p style={{color: 'red'}}
                                                    onClick={() => handleProductDeactivate(product.ProductId)}
                                                >
                                                    Deactivate product.
                                                </p>
                                            ) : (
                                                <p
                                                    onClick={() => handleProductRestore(product.ProductId)}
                                                >
                                                    Restore product.
                                                </p>
                                            )}
                                            <p onClick={() => {deleteProduct(product.ProductId); setShowUserOptions(false);}}>Delete product.</p>
                                            <p onClick={() => {setShowAddProduct(true); setShowUserOptions(false)}}>New product.</p>
                                            <p onClick={() => {setEditingProduct(product); setShowProductEdit(true); setShowUserOptions(false)}}>Edit product.</p>
                                        </div>
                                    )}
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

            {showRestoreProduct && (
                <div className="modal-overlay" onClick={() => closeModal()}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => closeModal()}>X</button>
                        <ActivateProduct />
                    </div>
                </div>
            )}

            {showAddProduct && (
                <div className="modal-overlay" onClick={() => closeModal()}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => closeModal()}>X</button>
                        <NewProduct />
                    </div>
                </div>
            )}

            {showProductEdit && (
                <div className="modal-overlay" onClick={() => closeModal()}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => closeModal()}>X</button>
                        <h4>Editing of {editingProduct.ProductName} will be done here.</h4>
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
        </div>
    );
};
