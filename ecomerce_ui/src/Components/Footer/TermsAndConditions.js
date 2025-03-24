import React from 'react';
import { Link } from "react-router-dom";

export default function TermsAndConditions() {
  return (
    <div className="terms-and-conditions">
      <h1>Terms and Conditions</h1>
      <div className="terms-content">
        <section className="introduction">
          <h3>Introduction</h3>
          <p>
            By using MyStore, you agree to these Terms and Conditions. Please read them carefully.
          </p>
        </section>

        <section className="user-obligations">
          <h3>User Responsibilities</h3>
          <p>
            You agree to use our site lawfully, provide accurate information, and not engage in fraudulent activities.
          </p>
        </section>

        <section className="product-availability">
          <h3>Product Availability</h3>
          <p>
            We strive to keep our products in stock, but availability is not guaranteed.
          </p>
        </section>

        <section className="pricing">
          <h3>Pricing</h3>
          <p>
            Prices are subject to change without notice. Payment must be made via an accepted method.
          </p>
        </section>

        <section className="returns">
          <h3>Returns</h3>
          <p>
            Please refer to our <Link to="/returns-policy">Returns Policy</Link> for details on returns and refunds.
          </p>
        </section>

        <section className="intellectual-property">
          <h3>Intellectual Property</h3>
          <p>
            All content on MyStore is protected by copyright and may not be used without permission.
          </p>
        </section>

        <section className="limitation-of-liability">
          <h3>Limitation of Liability</h3>
          <p>
            MyStore is not liable for any damages arising from your use of our website.
          </p>
        </section>

        <section className="privacy-policy">
          <h3>Privacy</h3>
          <p>
            By using this website, you agree to our <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </section>

        <section className="modifications">
          <h3>Changes to Terms</h3>
          <p>
            We may update these terms at any time. Please check back regularly for changes.
          </p>
        </section>

        <section className="contact-us">
          <h3>Contact Us</h3>
          <p>
            For any questions, contact us at <a href="mailto:mutambukijoshua2@gmail.com">support@mystore.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
