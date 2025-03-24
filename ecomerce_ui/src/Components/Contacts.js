import React, { useState } from 'react';
import '../App.css';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-us">
      <h1>Contact Us</h1>
      <div className="contact-info">
        <p>If you have any questions, feel free to reach out to us using the form below, or by emailing us at <a href="mailto:mutambukijoshua2@gmail.com">support@mystore.com</a>.</p>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ textTransform: 'capitalize' }}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit">Send Message</button>
      </form>

      <div className="contact-details">
        <h3>Other Ways to Reach Us:</h3>
        <p>
          Email: <a href="mailto:mutambukijoshua2@gmail.com">support@mystore.com</a>
        </p>
        <p>Phone: +254748894542</p>
        <p>Address: 1234 Main Street, City, Country</p>
      </div>
    </div>
  );
}
