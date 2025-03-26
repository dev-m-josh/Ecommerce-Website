import axios from "axios";
import React, { useState } from "react";

export default function OpenCart() {
    const [address, setAddress] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("signedUser"));
    const UserId = user.UserId;
    const pendingCart = JSON.parse(localStorage.getItem("openedCart"));
    console.log(pendingCart)

    const handleAddressChange = (e) => {
        let text = e.target.value;

        if (text && text[0] !== text[0].toUpperCase()) {
            text = text.charAt(0).toUpperCase() + text.slice(1);
        }

        setAddress(text);
    };

    const handleOpenCart = async (e) => {
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

    return (
        <div>
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
    );
}
