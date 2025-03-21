import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../Styles/Shop.css';

export default function ProductDetails() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { productId } = useParams();

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchProduct = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `http://localhost:4500/products/product/${productId}`,
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
                console.log(data)
                setProduct(data[0]);

            } catch (err) {
                console.error("Error fetching product:", err);
                setErrorMessage("There was an error displaying the product. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId, token, navigate]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (errorMessage) {
        return <div className="error">{errorMessage}</div>;
    }

    if (!product) {
        return <div className="error">Product not found!</div>;
    }

    return (
        <div className="product" key={product.ProductId}>
            <div className="offer">-{product.ProductDiscount}%</div>
            {product.ProductImage && (
                <img 
                    src={product.ProductImage} 
                    alt={product.ProductName} 
                />
            )}
            <div className="product-details">
                <h4>{product.ProductName}</h4>
                <p>{product.Description}</p>
                <h5>
                    Ksh {Math.floor(product.Price * ((100 - product.ProductDiscount) / 100)).toLocaleString()}
                </h5>
                <span>Ksh {product.Price.toLocaleString()}</span>
                <h5>Category: <p>{product.Category}</p></h5>
                <p>{product.StockQuantity} items left.</p>
            </div>
        </div>
    );
}
