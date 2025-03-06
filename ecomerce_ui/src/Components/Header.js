import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import "../Styles/Header.css";

export default function Header() {
    return(
        <div class="header">
            <div class="logo">
                <a href="/"><img src="/logo.webp"/></a>
            </div>
        <div class="navigation">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/shop">Shop</a></li>
                <li><a href="/categories">Categories</a></li>
                <li><a href="/about">About Us</a></li>
            </ul>
        </div>
        <div class="search-bar">
            <FontAwesomeIcon className='icon' icon={faSearch} />
            <input  type="text" placeholder="Search..."/>
        </div>
        <div class="user-actions">
            <a className="cart"  href="/cart">
                <FontAwesomeIcon className='icon' icon={faShoppingBasket} />
                <div className="cart-number">{0}</div>
            </a>
            <a href='/account'><FontAwesomeIcon className='icon user-icon' icon={faUser} />Account</a>
            <a href="/logOut">LogOut</a>
            <a href="/login">Login</a>
            <a href="/register">Sign Up</a>
        </div>
    </div>
    );
};