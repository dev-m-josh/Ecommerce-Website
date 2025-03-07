import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket, faSearch, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import "../Styles/Header.css";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const user = JSON.parse(localStorage.getItem("signedUser"));

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const currentPath = window.location.pathname;

    useEffect(() =>{
        if (user && user.UserRole === "Admin") {
            setIsAdmin(true);
        }
    }, [user]);

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
                                <a className='logout' href="/logout">LogOut</a>
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
                                    <a href="/logout">LogOut</a>
                                    <a href="/account">Account</a>
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
                            {user && (
                                <li>
                                    <a href="/account">
                                        <FontAwesomeIcon className={`icon ${currentPath === '/account' ? 'user-icon' : ''}`} icon={faUser} /> Account
                                    </a>
                                </li>
                            )}
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
                </div>
            </div>
        </>
    );
}
