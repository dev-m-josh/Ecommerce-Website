import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Users.css'

export default function MostSelling() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] =useState(null);
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
                        `http://localhost:4500/products/most-selling`,
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
                    
                } catch (err) {
                    console.error("Error fetching products:", err);
                    setErrorMessage("There was an error fetching the products. Please try again later.");
                } finally {
                    setLoading(false);
                }
            }
    
            fetchProducts()
        }, [token, navigate]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (errorMessage) {
        return <div className="error">{errorMessage}</div>;
    }


    return(
        <div className="users">
        <h2>Most selling products</h2>
        {products.length === 0 ? (
            <div>No products available to display.</div>
        ) : (
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Units Sold</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.ProductId}>
                            <td>{product.ProductName}</td>
                            <td>{product.TotalUnitsSold}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
    )
}