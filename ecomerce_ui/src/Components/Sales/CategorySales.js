import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Users.css'

export default function CategorySales() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] =useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [noMoreProducts, setNoMoreProducts] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

        useEffect(() => {
            if (!token) {
                navigate('/login');
            };
    
            const fetchProducts = async () => {
                try {
                    setLoading(true);
    
                    const response = await fetch(
                        `http://localhost:4500/sales/category?page=${page}&pageSize=${pageSize}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            }
                        }
                    );
    
                    if (!response.ok) {
                        throw new Error(`${response.statusText}`)
                    };
    
                    const data = await response.json();
    
                    setProducts(data);
    
                    if (data.length < pageSize) {
                        setNoMoreProducts(true);
                    } else {
                        setNoMoreProducts(false);
                    };
                    
                } catch (err) {
                    console.error("Error fetching products:", err);
                    setErrorMessage("There was an error fetching the products. Please try again later.");
                } finally {
                    setLoading(false);
                }
            }
    
            fetchProducts()
        }, [page, pageSize, token, navigate]);

        const handleNextPage= () =>{
            if (!noMoreProducts && !loading) {
                setPage((nextPage) => nextPage + 1);
            };
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
    
    
    return(
        <div className="users">
            <h2>Category sales.</h2>
            {products.length === 0 ? (
                <div>No sales to display.</div>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Total Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.Category}>
                                <td>{product.Category}</td>
                                <td>Ksh {product.TotalRevenue}</td>
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
                    disabled={noMoreProducts || loading}
                    className="pagination-button"    
                >
                    Next
                </button>
            </div>
        </div>
    );
};