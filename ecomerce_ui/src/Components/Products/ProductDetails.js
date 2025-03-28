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
    const [orders, setOrders] = useState([]);
    const user = JSON.parse(localStorage.getItem("signedUser"));
    const UserId = user ? user.UserId : null; 
    const [pendingCart, setPendingCart] = useState(null);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("openedCart"));
        setPendingCart(storedCart);
    }, []);

    useEffect(() => {
        if (!token || !user || !UserId) {
            navigate('/login');
        }

        if (pendingCart) {
            const fetchOrderDetails = async () => {
                const details = {
                    OrderId: pendingCart.OrderId,
                    UserId: UserId
                };

                try {
                    setLoading(true);

                    const params = new URLSearchParams(details).toString();

                    const response = await fetch(
                        `http://localhost:4500/orders/order-details?${params}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            }
                        }
                    );

                    if (!response.ok) {
                        const error = await response.text();
                        throw new Error(error || "Failed to fetch order details.");
                    }

                    const data = await response.json();
                    setOrders(data.orderDetails);

                } catch (error) {
                    console.error("Error fetching order details:", error);
                    setErrorMessage("There was an error fetching the order details.");
                } finally {
                    setLoading(false);
                }
            };

            fetchOrderDetails();
        }

    }, [token, navigate, UserId, pendingCart]);

    const handleAddItemToCart = async (e) => {
        e.preventDefault();
        setErrorMessage("");
    
        if (!orderId) {
            setErrorMessage("There is no active cart. Please open a new cart.");
            navigate("/cart");
            return;
        }
        
        const existingItems = orders.filter(item => item.ProductId === productId);

        if (existingItems.length > 0) {
            const updatedItem = {
                OrderId: existingItems[0].OrderId,
                ProductId: existingItems[0].ProductId,
                Quantity: existingItems.reduce((sum, item) => sum + item.Quantity, 0) + quantity
            };

            try {
                const response = await axios.put(
                    `http://localhost:4500/orders/order-item/quantity`,
                    updatedItem,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                        }
                    }
                );

                alert(response.data.message);
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.ProductId === updatedItem.ProductId ? { ...order, Quantity: updatedItem.Quantity } : order
                    )
                );
            } catch (error) {
                console.error("Error updating cart item:", error);
                setErrorMessage("There was an error updating the cart. Please try again.");
            }
        }

        else {
            const newOrderItem = {
                OrderId: orderId,
                ProductId: productId,
                Quantity: quantity
            };
    
            try {
                const response = await axios.post(
                    "http://localhost:4500/orders/order-item",
                    newOrderItem,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                        }
                    }
                );
    
                alert(response.data.message);
                setOrders(prevOrders => [...prevOrders, response.data.newOrderItem]);
            } catch (error) {
                console.error("Error adding item to cart:", error);
                setErrorMessage("There was an error adding the item to the cart. Please try again.");
            }
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

                        <button disabled={product.StockQuantity <= 0 || quantity === 0} onClick={handleDecreaseQuantity}>
                            -
                        </button>
                        <span>{quantity}</span>
                        <button
                            disabled={quantity >= product.StockQuantity || quantity === 10}
                            onClick={handleIncreaseQuantity}
                        >
                            +
                        </button>
                        <p>({quantity} item(s) added)</p>
                    </div>

                    <button
                        className="add-btn"
                        onClick={handleAddItemToCart}
                        disabled={quantity === 0 || product.StockQuantity <= 0}
                    >
                        Add Item to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
