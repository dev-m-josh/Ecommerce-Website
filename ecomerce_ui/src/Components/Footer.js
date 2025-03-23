import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import '../App.css';

export default function Footer() {

  return (
      <footer className="home">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
          <div className="footer-social">
            <a href="https://facebook.com/profile.php?id=61557426687448" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </a>
            <a href="https://instagram.com/sirjay511" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a href="https://twitter.com/sirjay" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} size="2x" />
            </a>
          </div>
          <p>&copy; 2025 MyStore. All rights reserved.</p>
        </div>
      </footer>
  );
}
