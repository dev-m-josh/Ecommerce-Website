import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './Shop.css'

export default function ProductDetails() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [addedToCart, setAddedToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
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

    const handleAddToCart = () => {
        setAddedToCart(true); 
        setQuantity(1)
    };

    const handleIncreaseQuantity = () => {
        if (quantity < 10) {
            setQuantity(quantity + 1); 
        }
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1); 
        } else {
            setAddedToCart(false); 
            setQuantity(0); 
        }
    };

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
        <div className="single-product" key={product.ProductId}>
            <div className="offer">-{product.ProductDiscount}%</div>
            {product.ProductImage && (
                <img
                    src={product.ProductImage}
                    alt={product.ProductName}
                />
            )}
            <div className="product-details">
                <h2>{product.ProductName}</h2>
                <p className="product-description">{product.Description}</p>
                <h5>
                    Ksh {Math.floor(product.Price * ((100 - product.ProductDiscount) / 100)).toLocaleString()}
                </h5>
                <p>Ksh {product.Price.toLocaleString()}</p>
                <div className="category">
                    <strong>Category: </strong>{product.Category}
                </div>
                <p className="stock-left">
                    <strong>{product.StockQuantity}</strong> items left.
                </p>

                {!addedToCart ? (
                    <div className="add-to-cart">
                        <button className="add-btn" onClick={handleAddToCart}>Add to cart</button>
                    </div>
                ) : (
                    <div className="add-btns">
                        <button onClick={handleDecreaseQuantity}>-</button>
                        <span>{quantity}</span>
                        <button disabled={quantity >= 10} onClick={handleIncreaseQuantity}>+</button>
                        <p>({quantity} item(s) added)</p>
                    </div>
                )}
            </div>
        </div>
    );
}
