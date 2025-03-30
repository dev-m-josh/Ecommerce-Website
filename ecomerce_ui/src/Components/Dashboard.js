import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faUserCog  } from '@fortawesome/free-solid-svg-icons';
import '../Styles/Dashboard.css'
import { Link } from "react-router-dom";

export default function Dashboard() {
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [showProductDetails, setShowProductDetails] = useState(false);

    const toggleUserDetails = () => {
        setShowUserDetails(prev => !prev);
        setShowProductDetails(false);
    };

    const toggleProductDetails = () => {
        setShowProductDetails(prev => !prev);
        setShowUserDetails(false);
    };

    return(
        <div className="dashboard">
            <h3>Admin Functions.</h3>
            <hr/>
            <div className="dashboard-details">
                <p>Users</p>
                <button onClick={toggleUserDetails}>
                    <FontAwesomeIcon icon={faUserCog}/>
                    <FontAwesomeIcon icon={faCaretDown} />
                </button>
            </div>
            {showUserDetails && (
                <div className={`dashboard-options ${showUserDetails ? 'show' : ''}`}>
                    <ul>
                        <li>
                            <Link to='/users'>
                                Check all users.
                            </Link>
                        </li>
                        <li>
                            <Link to='/users-role'>
                                Update user role.
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
            <hr/>
            <div className="dashboard-details">
                <p>Products</p>
                <button onClick={toggleProductDetails}>
                    <FontAwesomeIcon icon={faUserCog}/> <FontAwesomeIcon icon={faCaretDown} />
                </button>
            </div>
            {showProductDetails && (
            <div className={`dashboard-options ${showProductDetails ? 'show' : ''}`}>
                <ul>
                    <li>
                        <Link to='/restore&delete-product'>
                            Restore and delete products.
                        </Link>
                    </li>
                    <li>
                        <Link to='/new-product'>
                            Add new product.
                        </Link>
                    </li>
                    <li>
                        <Link to='/most-selling-product'>
                            Most selling products.
                        </Link>
                    </li>
                    <li>
                        <Link to='/low-stock'>
                            Products on low stock.
                        </Link>
                    </li>
                    <li>
                        <Link to='/product-sales'>
                            Sales per product.
                        </Link>
                    </li>
                    <li>
                        <Link to='/category-sales'>
                            Sales per category.
                        </Link>
                    </li>
                </ul>
            </div>
            )}
        </div>
    );
};
