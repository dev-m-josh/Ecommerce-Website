import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket, faSearch, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import "../Styles/Header.css";
import axios from 'axios';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("signedUser"));
    const token = localStorage.getItem("token");
    const [errorMessage, setErrorMessage] = useState("");

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const currentPath = window.location.pathname;

    useEffect(() => {
        if (user && user.UserRole === "Admin") {
            setIsAdmin(true);
        }
    }, [user]);

    // Handle logout
    const handleLogout = async (e) => {
        // Clear user data from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("signedUser");

        try {
            const response = await axios.put(
                `http://localhost:4500/users/deactivate/${user.UserId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            const data = response.data;

            if (data.success) {
                alert(data.message);
            };

            navigate("/")
        } catch (error) {
            console.log("Login error:", error);
            if (error.response.data) {
                setErrorMessage(error.response.data.message);
                alert(errorMessage);
            } 
        }
    };

    return (
        <>
            <div className="header">
                {/* Larger Screen Layout */}
                <div className="larger-screen">
                    <div className="logo">
                        <Link to="/">
                            <img src="/logo.webp" alt="Logo" />
                        </Link>
                    </div>

                    <div className="navigation">
                        <ul>
                            <li>
                                <Link
                                    to="/"
                                    className={`${currentPath === '/' ? 'active' : ''}`}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/shop"
                                    className={`${currentPath === '/shop' ? 'active' : ''}`}
                                >
                                    Shop
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
                            <li>
                                <Link
                                    to="/about"
                                    className={`${currentPath === '/about' ? 'active' : ''}`}
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className={`${currentPath === '/admin' ? 'active' : ''}`}
                                    >
                                        Admin
                                    </Link>
                                )}
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
                            <div className="cart-number">{0}</div>
                        </Link>
                        {user ? (
                            <>
                                <Link to="/account">
                                    <FontAwesomeIcon className="icon user-icon" icon={faUser} />
                                </Link>
                                <button onClick={handleLogout} className='logout'>LogOut</button>
                            </>
                        ) : (
                            <>
                                <Link className='user-btns' to="/login">Login</Link>
                                <Link className='user-btns' to="/register">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Smaller Screen Layout */}
                <div className="smaller-screen">
                    <div className="mini-header">
                        <div className="logo">
                            <Link to="/">
                                <img src="/logo.webp" alt="Logo" />
                            </Link>
                        </div>
                        <div className="mini-header-right">
                            <ul>
                                {user ? (
                                    <>
                                        <span>
                                            {currentPath === '/' ? 'Home' : currentPath === '/shop' ? 'Shop' : currentPath === '/categories' ? 'Categories' : currentPath === '/about' ? 'About Us' : 'Home'}
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
                                    to="/"
                                    className={`${currentPath === '/' ? 'active' : ''}`}
                                    onClick={toggleMenu}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/shop"
                                    className={`${currentPath === '/shop' ? 'active' : ''}`}
                                    onClick={toggleMenu}
                                >
                                    Shop
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
                            <li>
                                <Link
                                    to="/about"
                                    className={`${currentPath === '/about' ? 'active' : ''}`}
                                    onClick={toggleMenu}
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className={`${currentPath === '/admin' ? 'active' : ''}`}
                                        onClick={toggleMenu}
                                    >
                                        Admin
                                    </Link>
                                )}
                            </li>
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
