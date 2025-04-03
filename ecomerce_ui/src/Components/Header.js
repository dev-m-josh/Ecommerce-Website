import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket, faSearch, faUser, faBars, faCaretDown  } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from "react-router-dom";
import "../Styles/Header.css";
import axios from 'axios';

export default function Header({ showOptions, setShowOptions }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("signedUser"));
    const token = localStorage.getItem("token");
    const [errorMessage, setErrorMessage] = useState("");
    const [orders, setOrders] = useState([]);
    const pendingCart = JSON.parse(localStorage.getItem("openedCart"));

    useEffect(() => {
        if (pendingCart) {
            const fetchOrderDetails = async () => {
                const details = {
                    OrderId: pendingCart.OrderId,
                };

                try {
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
                } catch (error) {
                    console.error("Error fetching order details:", error);
                    setErrorMessage("There was an error fetching the order details.");
                }
            };

            fetchOrderDetails();
        };
    }, [pendingCart]);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prevState => !prevState);
    }, []);

    const currentPath = window.location.pathname;

    useEffect(() => {
        if (user && user.UserRole === "Admin") {
            setIsAdmin(true);
        }
    }, [user, token]);

    // Handle logout
    const handleLogout = async (e) => {
        localStorage.removeItem("token");
        localStorage.removeItem("signedUser");
        setIsAdmin(false);

        try {
            const response = await axios.put(
                `http://localhost:4500/users/deactivate-user/${user.UserId}?isActive=0`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            const data = response.data;

            if (data.success) {
                navigate("/products");
            };
        } catch (error) {
            console.log("Login error:", error);
            if (error.response.data) {
                setErrorMessage(error.response.data.message);
                alert(errorMessage);
            };
        };
    };

    // Toggle the display of options
    const toggleOptions = () => {
        setShowOptions(prev => !prev);
    };

    return (
        <>
            <div className="header">
                {/* Larger Screen Layout */}
                <div className="larger-screen">
                    <div className="logo">
                        <Link to="/product">
                            <img src="/logo.webp" alt="Logo" />
                        </Link>
                    </div>

                    <div className="navigation">
                        <ul>
                            <li>
                                <Link
                                    to="/products"
                                    className={`${currentPath === '/products' ? 'active' : ''}`}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/categories"
                                    className={`${currentPath === '/categories' ? 'active' : ''}`}
                                >
                                    Categories
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="search-bar">
                        <FontAwesomeIcon className="icon" icon={faSearch} />
                        <input type="text" placeholder="Search..." />
                    </div>

                    <div className="user-actions">
                        <Link className="cart" to="/cart">
                            <FontAwesomeIcon className="icon " icon={faShoppingBasket} />
                            <div className="cart-number">{orders.length}</div>
                        </Link>
                    </div>
                    {isAdmin && (
                        <Link className='dashboard-link' to="/">
                            Dashboard
                        </Link>
                    )}
                    <h5
                        onClick={toggleOptions}>Options <FontAwesomeIcon className="icon user-icon" icon={faCaretDown} />
                    </h5>
                    {showOptions && (
                        <div className={`options-dropdown ${showOptions ? 'show' : ''}`}>
                            {user ? (
                                <>
                                    <Link onClick={() => setShowOptions(false)} to="/account">View Profile</Link>
                                    <span onClick={() => { setShowOptions(false); handleLogout(); }}>Logout</span>
                                </>
                            ) : (
                                <>
                                    <Link onClick={() => setShowOptions(false)} className='user-btns' to="/login">Login</Link>
                                    <Link onClick={() => setShowOptions(false)} className='user-btns' to="/register">Sign Up</Link>
                                </>
                            )}
                        </div>
                    )}

                </div>

                {/* Smaller Screen Layout */}
                <div className="smaller-screen">
                    <div className="mini-header">
                        <div className="logo">
                            <Link to="/products">
                                <img src="/logo.webp" alt="Logo" />
                            </Link>
                        </div>
                        <div className="mini-header-right">
                            <ul>
                                {user ? (
                                    <>
                                        <span>
                                            { currentPath === '/' ? 'Shop' : currentPath === '/categories' ? 'Categories' : '/'}
                                        </span>
                                        <Link to="/account">
                                            <FontAwesomeIcon className={`icon ${currentPath === '/account' ? 'user-icon' : ''}`} icon={faUser} />
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link className='logins' to="/login">Login</Link>
                                        <Link className='logins' to="/register">Sign Up</Link>
                                    </>
                                )}
                            </ul>
                            <div className="hamburger" onClick={toggleMenu}>
                                <FontAwesomeIcon className="icon" icon={faBars} />
                            </div>
                        </div>
                    </div>

                    <div className="search-bar">
                        <FontAwesomeIcon className="icon" icon={faSearch} />
                        <input type="text" placeholder="Search..." />
                    </div>
                </div>

                {/* Slide-bar (Mobile Menu) */}
                <div className={`slide-bar ${isMenuOpen ? 'open' : ''}`}>
                    <div className="navigation slide">
                        <ul>
                            <li>
                                <Link
                                    to="/products"
                                    className={`${currentPath === '/shop' ? 'active' : ''}`}
                                    onClick={toggleMenu}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/categories"
                                    className={`${currentPath === '/categories' ? 'active' : ''}`}
                                    onClick={toggleMenu}
                                >
                                    Categories
                                </Link>
                            </li>
                            {isAdmin && (
                                <Link className='dashboard-link' to="/">
                                    Dashboard
                                </Link>
                            )}
                            <li>
                                <span onClick={handleLogout}>LogOut</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
