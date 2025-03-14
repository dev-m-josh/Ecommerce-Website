import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket, faSearch, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
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

    useEffect(() =>{
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
                        <a href="/">
                            <img src="/logo.webp" alt="Logo" />
                        </a>
                    </div>

                    <div className="navigation">
                        <ul>
                            <li>
                                <a
                                    href="/"
                                    className={`${currentPath === '/' ? 'active' : ''}`}
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                href="/shop"
                                className={`${currentPath === '/shop' ? 'active' : ''}`}
                                >
                                Shop
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/categories"
                                    className={`${currentPath === '/categories' ? 'active' : ''}`}
                                >
                                    Categories
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/about"
                                    className={`${currentPath === '/about' ? 'active' : ''}`}
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                {isAdmin && (
                                <a
                                href="/admin"
                                className={`${currentPath === '/admin' ? 'active' : ''}`}
                                >
                                Admin
                                </a>
                                )}
                            </li>
                        </ul>
                    </div>

                    <div className="search-bar">
                        <FontAwesomeIcon className="icon" icon={faSearch} />
                        <input type="text" placeholder="Search..." />
                    </div>

                    <div className="user-actions">
                        <a className="cart" href="/cart">
                            <FontAwesomeIcon className="icon " icon={faShoppingBasket} />
                            <div className="cart-number">{0}</div>
                        </a>
                        {user ? (
                            <>
                                <a href="/account">
                                    <FontAwesomeIcon className="icon user-icon" icon={faUser} />
                                </a>
                                <button onClick={handleLogout} className='logout'>LogOut</button>
                            </>
                        ) : (
                            <>
                                <a className='user-btns' href="/login">Login</a>
                                <a className='user-btns' href="/register">Sign Up</a>
                            </>
                        )}
                    </div>
                </div>

                {/* Smaller Screen Layout */}
                <div className="smaller-screen">
                    <div className="mini-header">
                        <div className="logo">
                            <a href="/">
                                <img src="/logo.webp" alt="Logo" />
                            </a>
                        </div>
                        <div className="mini-header-right">
                        <ul>
                            {user ? (
                                <>
                                    <span>
                                        {currentPath === '/' ? 'Home' : currentPath === '/shop' ? 'Shop' : currentPath === '/categories' ? 'Categories' : currentPath === '/about' ? 'About Us' : 'Home'}
                                    </span>
                                    <a href="/account">
                                        <FontAwesomeIcon className={`icon ${currentPath === '/account' ? 'user-icon' : ''}`} icon={faUser} />
                                    </a>
                                </>
                            ) : (
                                <>
                                    <a className='logins' href="/login">Login</a>
                                    <a className='logins' href="/register">Sign Up</a>
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
                                <a
                                    href="/"
                                    className={`${currentPath === '/' ? 'active' : ''}`}
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/account">
                                    Account
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/categories"
                                    className={`${currentPath === '/categories' ? 'active' : ''}`}
                                >
                                    Categories
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/about"
                                    className={`${currentPath === '/about' ? 'active' : ''}`}
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                {isAdmin && (
                                <a
                                href="/admin"
                                className={`${currentPath === '/admin' ? 'active' : ''}`}
                                >
                                Admin
                                </a>
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
