import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Shop.css';

export default function Shop({ searchTerm }) {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
    const [noMoreProducts, setNoMoreProducts] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [allCategories, setAllCategories] = useState([]);
    const [category, setCategory] = useState(null);

    // Filter products based on searchTerm
    const filteredProducts = products.filter(product =>
        product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fetch the products based on the selected category
    useEffect(() => {
        const fetchProducts = async () => {
            setLoadingProducts(true);
            try {
                let url = '';

                if (category) {
                    url = `http://localhost:4500/products/category?page=${page}&pageSize=${pageSize}&inStock='1'&category=${category}`;
                } else {
                    url = `http://localhost:4500/products/instock?page=${page}&pageSize=${pageSize}&inStock='1'`;
                }

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });

                if (!response.ok) {
                    throw new Error(`${response.statusText}`);
                }

                const data = await response.json();

                if (data.length < pageSize) {
                    setNoMoreProducts(true);
                } else {
                    setNoMoreProducts(false);
                }

                setProducts(data);

            } catch (err) {
                console.error("Error fetching products:", err);
                setErrorMessage("There was an error fetching the products. Please try again later.");
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, [page, pageSize, token, category]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {

            setLoadingCategories(true);
            try {
                const response = await fetch(
                    `http://localhost:4500/products/instock?page=1&pageSize=1000&inStock='1'`,
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

                const categories = data.reduce((categoriesArr, product) => {
                    if (!categoriesArr.includes(product.Category)) {
                        categoriesArr.push(product.Category);
                    }
                    return categoriesArr;
                }, []);

                setAllCategories(categories);

            } catch (err) {
                console.error("Error fetching categories:", err);
                setErrorMessage("There was an error fetching the categories. Please try again later.");
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, [page, pageSize, token]);

    const handleNextPage = () => {
        if (!noMoreProducts && !loadingProducts) {
            setPage((nextPage) => nextPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1 && !loadingProducts) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    if (loadingProducts || loadingCategories) {
        return <div className="loading">Loading...</div>;
    }

    if (errorMessage) {
        return <div className="error">{errorMessage}</div>;
    }

    return (
        <>
            <div className="categories">
                <h3>Categories: </h3>
                <ul>
                    <li onClick={() => setCategory(null)}>
                        All Products
                    </li>
                    {allCategories.map((category, index) => (
                        <li key={index} onClick={() => setCategory(category)}>
                            {category}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="products">
            {filteredProducts.length === 0 ? (
                    <div>No products found for "{searchTerm}"</div>
                ) : (
                    <div className="products-list">
                        {filteredProducts.map((product) => (
                            <div
                                onClick={() => navigate(`/products/${product.ProductId}`)}
                                className="product"
                                key={product.ProductId}
                            >
                                <div className="offer">-{product.ProductDiscount}%</div>
                                {product.ProductImage && (
                                    <img
                                        src={product.ProductImage}
                                        alt={product.ProductName}
                                    />
                                )}
                                <div className="product-details">
                                    <h4>{product.ProductName}</h4>
                                    <h5>
                                        Ksh {Math.floor(product.Price * ((100 - product.ProductDiscount) / 100)).toLocaleString()}
                                    </h5>
                                    <p>
                                        Ksh {product.Price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="pagination">
                    <button
                        onClick={handlePreviousPage}
                        disabled={page === 1 || loadingProducts}
                    >
                        Previous
                    </button>
                    <span>{`Page ${page}`}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={noMoreProducts || loadingProducts}
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}
