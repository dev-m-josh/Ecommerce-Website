import React from 'react';
import '../App.css';

export default function AboutUs() {
  return (
    <div className="about-us">
      <h1>About Us</h1>
      <div className="about-content">
        <section className="our-story">
          <h3>Our Story</h3>
          <p>
            Welcome to MyStore! Our journey began in 2025, driven by a passion for industry, with the goal of providing high-quality products that cater to all audience. We are committed to delivering excellent customer service, ensuring that every experience with us is memorable.
          </p>
        </section>
        
        <section className="mission-values">
          <h3>Our Mission & Values</h3>
          <p>
          Our mission is to provide our customers with high-quality, innovative products that enhance their lives, while delivering exceptional customer service. We strive to create a positive impact on our community and the environment, ensuring every purchase supports sustainability and ethical practices. We believe in core values like sustainability, innovation, customer satisfaction, etc.. These principles guide us every day as we continue to expand and improve our offerings.
          </p>
          <ul>
            <li><strong>Customer Satisfaction:</strong> We strive to meet and exceed the expectations of every customer.</li>
            <li><strong>Quality:</strong> We only offer the best, ensuring every product is carefully chosen.</li>
            <li><strong>Innovation:</strong> We’re always looking for new ways to improve and evolve our products.</li>
            <li><strong>Sustainability:</strong> We are committed to minimizing our environmental impact.</li>
          </ul>
        </section>
        
        <section className="team">
          <h3>Meet Our Team</h3>
          <p>
            Our team is composed of passionate and talented individuals who are dedicated to making MyStore the best it can be. We work together to bring innovative ideas and solutions to life, ensuring our customers have an incredible shopping experience.
          </p>
        </section>
        
        <section className="contact-us">
          <h3>Contact Us</h3>
          <p>
            We’d love to hear from you! If you have any questions or feedback, feel free to reach out to us at <a href="mailto:mutambukijoshua2@gmail.com">support@mystore.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
