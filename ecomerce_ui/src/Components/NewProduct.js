import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

export default function NewProduct() {
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const [productImage, setProductImage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const token = localStorage.getItem("token");

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!productName || !description || !price || !stock || !category || !productImage) {
            setErrorMessage("All fields are required!");
            return;
        }

        const productDetails = {
            ProductName: productName,
            Description: description,
            Category: category,
            ProductImage: productImage,
            Price: price,
            StockQuantity: stock
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
            toast.success(data.message);

            setProductName("");
            setDescription("");
            setPrice("");
            setStock("");
            setCategory("");
            setProductImage("");
            
        } catch (error) {
            console.error("Error adding product:", error);
            setErrorMessage(error.message);
        };
    };

    return(
        <div>
            <h3>Add New Product</h3>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            <form onSubmit={handleAddProduct}>
                <div>
                    <label>Product Name</label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Stock Quantity</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Product Image URL</label>
                    <input
                        type="text"
                        value={productImage}
                        onChange={(e) => setProductImage(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <button type="submit">Add Product</button>
                </div>
            </form>
        </div>
    );
};