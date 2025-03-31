import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import ActivateProduct from "./ActivateProduct";

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
    const [productToRestore, setProductToRestore] = useState(null);

    const toggleUserOptions = (productId) => {
        setShowUserOptions((prev) => (prev === productId ? null : productId));
    };

    const closeModal = () => {
        setShowRestoreProduct(false);
        setProductToRestore(null);
    };

    const handleRestoreProduct = (productId) => {
        setShowRestoreProduct(true);
        setProductToRestore(productId);
    };

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
                                            <p onClick={() => { handleRestoreProduct(product.ProductId); setShowUserOptions(false); }}>Restore product.</p>
                                            <p onClick={() => {deleteProduct(product.ProductId); setShowUserOptions(false);}}>Delete product.</p>
                                            <p>New product.</p>
                                            <p>Edit product.</p>
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
                        <ActivateProduct productId={productToRestore} />
                    </div>
                </div>
            )}
        </div>
    );
}
