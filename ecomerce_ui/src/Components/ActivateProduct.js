import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios';
import '../Styles/Users.css'

export default function ActivateProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [noMoreProducts, setNoMoreProducts] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:4500/products/inactive?page=${page}&pageSize=${pageSize}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        }
                    }
                );

                const data = response.data;
                setProducts(data);

                if (data.length < pageSize) {
                    setNoMoreProducts(true);
                } else {
                    setNoMoreProducts(false);
                }
            } catch (err) {
                console.log("Error fetching products:", err);
                setErrorMessage("There was an error displaying the products. Please reload page.");
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [page, pageSize, token, navigate]);

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
        <div>
            <h2>Products List</h2>
            {products.length === 0 ? (
                <div>No products available to display.</div>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product.ProductId}>
                                <td>{product.ProductName}</td>
                                <td>{product.Category}</td>
                                <td>{product.StockQuantity}</td>
                                <td>
                                    {product.ProductStatus === 'Active' ? (
                                        <button
                                            className="delete" 
                                            onClick={() => handleProductDeactivate(product.ProductId)}
                                        >
                                            Delete
                                        </button>
                                    ) : (
                                        <button
                                            className="restore" 
                                            onClick={() => handleProductRestore(product.ProductId)}
                                        >
                                            Restore
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="pagination">
                <button
                    onClick={handlePreviousPage}
                    disabled={page === 1 || loading}
                    className="pagination-button"
                >
                    Previous
                </button>
                <span>{`Page ${page}`}</span>
                <button
                    onClick={handleNextPage}
                    disabled={noMoreProducts}
                    className="pagination-button"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
