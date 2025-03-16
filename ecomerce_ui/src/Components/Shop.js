import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] =useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(3);
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
                    `http://localhost:4500/products?page=${page}&pageSize=${pageSize}`,
                    {
                        method: "GET",
                        Headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`${response.statusText}`)
                };

                const data = await response.json();
                console.log(data)

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
    }, [page, pageSize, token]);

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
        <>
        <div className="products">
            <h2>Products List</h2>
            {products.length === 0 ? (
                <div>No products available</div>
            ) : (
                <div>
                        {products.map((product) => (
                            <div className="product" key={product.ProductId}>
                                {product.ProductImage && (
                                    <img 
                                        src={product.ProductImage} 
                                        alt={product.ProductName} 
                                        style={{ maxWidth: "200px", height: "auto" }} 
                                    />
                                )}
                                <div className="product-details">
                                    <h4>
                                        {product.ProductName}
                                    </h4>
                                    <p>
                                        {product.Description}
                                    </p>
                                    <h4>
                                        Ksh {product.Price}
                                    </h4>
                                    <h5>
                                        {product.StockQuantity} items left.
                                    </h5>
                                    <h5>Category: {product.Category}</h5>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
                            <div className="pagination">
                            <button 
                                onClick={handlePreviousPage} 
                                disabled={page === 1 || loading}>
                                Previous
                            </button>
                            <button 
                                onClick={handleNextPage} 
                                disabled={noMoreProducts || loading}>
                                Next
                            </button>
                        </div>
                        </>
    );
    
};