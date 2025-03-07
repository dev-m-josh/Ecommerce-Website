import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket, faSearch, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import "../Styles/Header.css";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("/"); 
    const user = JSON.parse(localStorage.getItem("signedUser"));

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    

    // Function to set active link
    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    return (
        <>
            <div className="header">
                {/* Larger Screen Layout */}
                <div className="larger-screen">
                    <div className="logo">
                        <a href="/" onClick={() => handleLinkClick("/")}>
                            <img src="/logo.webp" alt="Logo" />
                        </a>
                    </div>

                    <div className="navigation">
                        <ul>
                            <li>
                                <a
                                    href="/"
                                    onClick={() => handleLinkClick("/")}
                                    className={activeLink === "/" ? "active" : ""}
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/shop"
                                    onClick={() => handleLinkClick("/shop")}
                                    className={activeLink === "/shop" ? "active" : ""}
                                >
                                    Shop
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/categories"
                                    onClick={() => handleLinkClick("/categories")}
                                    className={activeLink === "/categories" ? "active" : ""}
                                >
                                    Categories
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/about"
                                    onClick={() => handleLinkClick("/about")}
                                    className={activeLink === "/about" ? "active" : ""}
                                >
                                    About Us
                                </a>
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
                                    <FontAwesomeIcon className="icon user-icon" icon={faUser} /> Account
                                </a>
                                <a href="/logout">LogOut</a>
                            </>
                        ) : (
                            <>
                                <a href="/login">Login</a>
                                <a href="/register">Sign Up</a>
                            </>
                        )}
                    </div>
                </div>

                {/* Smaller Screen Layout */}
                <div className="smaller-screen">
                    <div className="mini-header">
                        <div className="logo">
                            <a href="/" onClick={() => handleLinkClick("/")}>
                                <img src="/logo.webp" alt="Logo" />
                            </a>
                        </div>
                        <ul>
                            {user ? (
                                <>
                                    <a href="/logout">LogOut</a>
                                    <a href="/account">Account</a>
                                </>
                            ) : (
                                <>
                                    <a href="/login">Login</a>
                                    <a href="/register">Sign Up</a>
                                </>
                            )}
                        </ul>
                        <div className="hamburger" onClick={toggleMenu}>
                            <FontAwesomeIcon className="icon" icon={faBars} />
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
                                    onClick={() => handleLinkClick("/")}
                                    className={activeLink === "/" ? "active" : ""}
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/shop"
                                    onClick={() => handleLinkClick("/shop")}
                                    className={activeLink === "/shop" ? "active" : ""}
                                >
                                    Shop
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/categories"
                                    onClick={() => handleLinkClick("/categories")}
                                    className={activeLink === "/categories" ? "active" : ""}
                                >
                                    Categories
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/about"
                                    onClick={() => handleLinkClick("/about")}
                                    className={activeLink === "/about" ? "active" : ""}
                                >
                                    About Us
                                </a>
                            </li>
                            {user && (
                                <li>
                                    <a href="/account">
                                        <FontAwesomeIcon className="icon user-icon" icon={faUser} /> Account
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
