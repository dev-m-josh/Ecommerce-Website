import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Products/Shop.css';

export default function OpenCart() {
    const [address, setAddress] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("signedUser"));
    const UserId = user.UserId;
    const navigate = useNavigate();
    const [pendingCart, setPendingCart] = useState(null);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("openedCart"));
        setPendingCart(storedCart);
    }, []);

    useEffect(() => {
        if (!token) {
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
                        throw new Error("Failed to fetch order details.");
                    }

                    const data = await response.json();
                    setOrders(data.orderDetails);
                    calculateTotalCost(data.orderDetails);

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

    const calculateTotalCost = (orders) => {
        const total = orders.reduce((acc, order) => {
            return acc + (order.DiscountedPrice * order.Quantity);
        }, 0);

        setTotalCost(total);
    };

    const handleAddressChange = (e) => {
        let text = e.target.value;

        if (text && text[0] !== text[0].toUpperCase()) {
            text = text.charAt(0).toUpperCase() + text.slice(1);
        }

        setAddress(text);
    };

    const handleOpenCart = async (e) => {
        if (!token) {
            navigate('/login');
        };

        e.preventDefault();
        setErrorMessage("");

        if (!address) {
            setErrorMessage("Address is required!");
            return;
        }

        const newOrderDetails = {
            UserId: UserId,
            ShippingAddress: address
        };

        try {
            const response = await axios.post(
                "http://localhost:4500/orders",
                newOrderDetails, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            const data = response.data;
            const openedCart = data.order;

            localStorage.setItem("openedCart", JSON.stringify(openedCart));
            setPendingCart(openedCart);
            navigate("/shop");

            if (response.status === 200) {
                alert(data.message);
            } else {
                setErrorMessage("There was an issue with opening the cart.");
            }
        } catch (error) {
            setErrorMessage(error.response.data.message || "Error opening cart!");
            console.error("Error opening cart:", error);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (errorMessage) {
        return <div className="error">{errorMessage}</div>;
    }

    return (
        <div className='cart'>
            {!pendingCart ? (
                <div className='new-cart'>
                    <h3>Please enter your address to open a new cart.</h3>
                    <form onSubmit={handleOpenCart}>
                        <div>
                            <input
                                type="text"
                                value={address}
                                onChange={handleAddressChange}
                                placeholder="Enter your address..."
                            />
                        </div>
                        <button type="submit">Open Cart</button>
                    </form>
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                </div>
            ) : (
                <div className="order-details">
                    <div className="selected-products">
                        <h2>Cart({orders.length})</h2>
                        {orders.map((order) => (
                            <div className="order-product" key={order.ProductId}>
                                <div className="order-product-details">
                                    <div>
                                        <img src={order.ProductImage} alt={order.ProductName} />
                                        <div className="description">
                                            <p>{order.Description}</p>
                                            <p>
                                                <strong>category:</strong>
                                                {order.Category}
                                            </p>
                                        </div>
                                    </div>
                                    <button>
                                        Remove
                                    </button>
                                </div>
                                <div className="order-totals">
                                    <h3>
                                        Ksh {order.DiscountedPrice.toLocaleString()}
                                    </h3>
                                    <div className="discount">
                                        <p>
                                            Ksh {order.OriginalPrice.toLocaleString()}
                                        </p>
                                        <span>-{order.ProductDiscount}%</span>
                                    </div>
                                    <div className="quantity-selection">
                                        <button>-</button>
                                        <span>{order.Quantity}</span>
                                        <button>+</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3>CART SUMMARY</h3>
                        <hr />
                        <div className="cart-totals">
                            <p>Item's total ({orders.length})</p>
                            <span>Ksh {totalCost.toLocaleString()}</span>
                        </div>
                        <hr />
                        <div className="cart-totals">
                            <h4>Subtotal</h4>
                            <h2>Ksh {totalCost.toLocaleString()}</h2>
                        </div>
                        <hr />
                        <button
                            onClick={() => {
                                localStorage.removeItem("openedCart")
                                setPendingCart(null);  // Update state to remove cart
                                alert("Order confirmed!")
                                navigate('/cart')
                            }}
                        >
                            Confirm Order
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}
