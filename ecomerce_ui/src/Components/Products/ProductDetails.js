import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './Shop.css';
import axios from "axios";

export default function ProductDetails() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { productId } = useParams();
    const order = JSON.parse(localStorage.getItem("openedCart"));
    const orderId = order.OrderId; 

    const handleAddItemToCart = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!orderId) {
            setErrorMessage("There is no active cart. Please open a new cart.");
            navigate("/cart");
            return;
        }

        const orderItem = {
            OrderId: orderId,
            ProductId: productId,
            Quantity: quantity
        };

        try {
            const response = await axios.post(
                "http://localhost:4500/orders/order-item",
                orderItem,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            const data = response.data;
            alert(data.message);
        } catch (error) {
            console.error("Error adding item to cart:", error);
            setErrorMessage("There was an error adding the item to the cart. Please try again.");
        }
    };

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

    const handleIncreaseQuantity = () => {
        if (quantity < product.StockQuantity) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        } else {
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
                <img src={product.ProductImage} alt={product.ProductName} />
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

                <div className="add-btns">
                    <div className="quantity-selection">
                        {quantity > 0 && !orderId && (
                            <p style={{ color: "red" }}>You need to have an active cart to add items.</p>
                        )}

                        <button disabled={product.StockQuantity <= 0} onClick={handleDecreaseQuantity}>
                            -
                        </button>
                        <span>{quantity}</span>
                        <button
                            disabled={quantity >= product.StockQuantity}
                            onClick={handleIncreaseQuantity}
                        >
                            +
                        </button>
                        <p>({quantity} item(s) added)</p>
                    </div>

                    <button
                        className="add-btn"
                        onClick={handleAddItemToCart}
                        disabled={quantity <= 0 || product.StockQuantity <= 0}
                    >
                        Add Item to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
