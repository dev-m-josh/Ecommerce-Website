import React, { useState } from "react";
import axios from "axios";
import './NewProduct.css'

export default function NewProduct() {
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [discount, setDiscount] = useState("");
    const [productImage, setProductImage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const token = localStorage.getItem("token");

    const handleProductChange = (e) => {
        let text = e.target.value;

        if (text && text[0] !== text[0].toUpperCase()) {
            text = text.charAt(0).toUpperCase() + text.slice(1);
        }

        setProductName(text);
    };

    const handleDescriptionChange = (e) => {
        let text = e.target.value;

        if (text && text[0] !== text[0].toUpperCase()) {
            text = text.charAt(0).toUpperCase() + text.slice(1);
        }

        setDescription(text);
    };

    const handleCategoryChange = (e) => {
        let text = e.target.value;

        if (text && text[0] !== text[0].toUpperCase()) {
            text = text.charAt(0).toUpperCase() + text.slice(1);
        }

        setCategory(text);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const parsedPrice = parseFloat(price);
        const parsedDiscount = parseFloat(discount);
        const parsedStock = parseFloat(stock);

        if (!productName || !description || !price || !discount || !stock || !category || !productImage) {
            setErrorMessage("All fields are required!");
            return;
        }

        if (price <= 0 || stock <= 0) {
            setErrorMessage("Price and stock quantity must be positive values!");
            return;
        }

        const productDetails = {
            ProductName: productName,
            Description: description,
            Price: parsedPrice,
            StockQuantity: parsedStock,
            Category: category,
            ProductImage: productImage,
            ProductDiscount: parsedDiscount
        };

        try {
            const response = await axios.post(
                "http://localhost:4500/products",
                productDetails,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                
                }
            );

            const data = response.data;
            alert(data.message);

            setProductName("");
            setDescription("");
            setPrice("");
            setStock("");
            setCategory("");
            setProductImage("");
            setDiscount("");
            
        } catch (error) {
            console.error("Error adding product:", error);
            setErrorMessage(error.response.data.message || "Error adding product!");
        };
    };

    return(
        <div className="new-product">
            <h3>Add New Product</h3>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            <form onSubmit={handleAddProduct}>
                <div className="product-details">
                    <label>Product Name:</label>
                    <input
                        type="text"
                        value={productName}
                        onChange={handleProductChange}
                        required
                    />
                </div>
                <div className="product-details">
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={handleDescriptionChange}
                        required
                    />
                </div>
                <div className="product-details">
                    <label>Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min= '1'
                        required
                    />
                </div>
                <div className="product-details">
                    <label>Discount:</label>
                    <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        min= '0'
                        required
                    />
                </div>
                <div className="product-details">
                    <label>Stock Quantity:</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        min= '1'
                        required
                    />
                </div>
                <div className="product-details">
                    <label>Category:</label>
                    <input
                        type="text"
                        value={category}
                        onChange={handleCategoryChange}
                        required
                    />
                </div>
                <div className="product-details">
                    <label>Product Image URL:</label>
                    <input
                        type="text"
                        value={productImage}
                        onChange={(e) => setProductImage(e.target.value)}
                        required
                    />
                </div>
                <div className="new-product-btn">
                    <button type="submit">Add Product</button>
                </div>
            </form>
        </div>
    );
};