import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Shop.css'

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] =useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [noMoreProducts, setNoMoreProducts] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {

        const fetchProducts = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `http://localhost:4500/products?page=${page}&pageSize=${pageSize}`,
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

                if (data.length < pageSize) {
                    setNoMoreProducts(true);
                } else {
                    setNoMoreProducts(false);
                };

                setProducts(data);
                
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

    return (
        <div className="products">
            {products.length === 0 ? (
                <div>No products available</div>
            ) : (
                <div className="products-list">
                    {products.map((product) => (
                        <div 
                            onClick={() => navigate(`/products/${product.ProductId}`)} className="product" 
                            key={product.ProductId}
                        >
                            <div className="offer">-{product.ProductDiscount}%</div>
                            {product.ProductImage && (
                                <img 
                                    src={product.ProductImage} 
                                    alt={product.ProductName} 
                                />
                            )}
                            <div className="product-details">
                                <h4>
                                    {product.ProductName}
                                </h4>
                                <h5>
                                    Ksh {Math.floor(product.Price * ((100 - product.ProductDiscount) / 100)).toLocaleString()}
                                </h5>
                                <p>
                                    Ksh {product.Price.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="pagination">
                <button 
                    onClick={handlePreviousPage} 
                    disabled={page === 1 || loading}>
                    Previous
                </button>
                <span>{`Page ${page}`}</span>
                <button 
                    onClick={handleNextPage} 
                    disabled={noMoreProducts || loading}>
                    Next
                </button>
        </div>
    </div>
    );
};