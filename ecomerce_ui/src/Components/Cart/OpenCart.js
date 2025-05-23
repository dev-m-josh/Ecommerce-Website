import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../Products/Shop.css';

export default function OpenCart() {
    const [address, setAddress] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("signedUser"));
    const UserId = user ? user.UserId : null; 
    const navigate = useNavigate();
    const [pendingCart, setPendingCart] = useState(null);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("openedCart"));
        setPendingCart(storedCart);
    }, []);

    useEffect(() => {

        if (pendingCart) {
            const fetchOrderDetails = async () => {
                const details = {
                    OrderId: pendingCart.OrderId,
                };

                try {
                    setLoading(true);

                    const params = new URLSearchParams(details).toString();

                    const response = await fetch(
                        `http://localhost:4500/orders/order-details?${params}`,
                        {
                            method: "GET",
                            headers: {
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

    }, [token, navigate, pendingCart]);

    const updateItemQuantity = async (ProductId, newQuantity) => {
        if (newQuantity <= 0) {
            setErrorMessage("Quantity must be greater than zero.");
            return;
        }

        if (!pendingCart) {
            navigate('/login');
            return;
        }

        const updatedItem = {
            OrderId: pendingCart.OrderId,
            ProductId,
            Quantity: newQuantity,
        };

        try {
            const response = await axios.put(
                "http://localhost:4500/order-item/quantity",
                updatedItem,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                const updatedOrders = orders.map((order) =>
                    order.ProductId === ProductId
                        ? { ...order, Quantity: newQuantity }
                        : order
                );
                setOrders(updatedOrders);
                calculateTotalCost(updatedOrders);
                toast.success("Item quantity updated successfully!");
            } else {
                setErrorMessage("Failed to update item quantity.");
            }
        } catch (error) {
            console.error("Error updating item quantity:", error);
            setErrorMessage("There was an error updating the quantity.");
        }
    };

    const removeItem = async (ProductId) => {

        try {
            const response = await axios.delete(
                `http://localhost:4500/order-item`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: { OrderId: pendingCart.OrderId, ProductId }
                }
            );

            if (response.status === 200) {
                const updatedOrders = orders.filter(order => order.ProductId !== ProductId);
                setOrders(updatedOrders);
                calculateTotalCost(updatedOrders);
            };

        } catch (error) {
            console.error("Error removing item from cart:", error);
            setErrorMessage("There was an error removing the item from the cart.");
        }
    };

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
            navigate("/");

            if (response.status === 200) {
                toast.success(data.message);
            } else {
                setErrorMessage("There was an issue with opening the cart.");
            }
        } catch (error) {
            setErrorMessage(error.response.data.message || "Error opening cart!");
            console.error("Error opening cart:", error);
        }
    };

    const updateOrder = async () => {
        if (!token || !user || !UserId) {
            navigate('/login');
        };

        const orderUpdateDetails = {
            OrderId: pendingCart.OrderId,
            UserId: UserId,
            OrderStatus: 'Delivered',
            PaymentStatus: 'Paid'
        };

        if (!pendingCart) {
            console.error("No pending cart available to update.");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:4500/orders`, 
                orderUpdateDetails,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                console.log(response.data);
                localStorage.removeItem("openedCart");
                setPendingCart(null);
                setOrders([]);
                navigate('/cart');
                // alert("Order confirmed!");
            } else {
                setErrorMessage("Failed to confirm order. Please try again.");
                navigate("/login");
            }

        } catch (error) {
            console.error('Error updating order:', error.response ? error.response.data : error.message);
        }
    }

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
                    <h3>Please enter your address to open a new cart and add items.</h3>
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
                <>
                    {orders.length === 0 ? (
                        <div className="no-cart-items">
                            <img src="https://www.jumia.co.ke/assets_he/images/cart.668e6453.svg" alt="cart" />
                            <h4>Your cart is empty!</h4>
                            <p>Browse our products and discover our best deals!</p>
                            <button onClick={() => navigate('/')}>Start Shopping</button>
                        </div>
                    ) : (
                        <div className="order-details">
                            <div className="selected-products">
                                <h2>Cart({orders.length})</h2>
                                <hr/>
                                {orders.map((order) => (
    <div className="order-product" key={order.ProductId}>
        <div className="product-sections">
        <div className="order-product-details">
            <div className="doe">
                <img src={order.ProductImage} alt={order.ProductName} />
                <div className="description">
                    <p>{order.Description}</p>
                    <label>
                        In Stock
                    </label>
                    <span>
                        <strong>Category: </strong>
                        {order.Category}
                    </span>
                </div>
            </div>
            <button className="remove" onClick={() => removeItem(order.ProductId)}>Remove</button>
        </div>
        <div className="order-totals">
            <h3>Ksh {order.DiscountedPrice.toLocaleString()}</h3>
            <div className="discount">
                <p>Ksh {order.OriginalPrice.toLocaleString()}</p>
                <span>-{order.ProductDiscount}%</span>
            </div>
            <div className="quantity-selection">
                <button disabled={order.Quantity === 1} onClick={() => updateItemQuantity(order.ProductId, order.Quantity - 1)}>-</button>
                <span>{order.Quantity}</span>
                <button disabled={order.Quantity === 10} onClick={() => updateItemQuantity(order.ProductId, order.Quantity + 1)}>+</button>
            </div>
        </div>
        </div>
        <hr/>
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
                                        updateOrder();
                                    }}
                                >
                                    Confirm Order
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
