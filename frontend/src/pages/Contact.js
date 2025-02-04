import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [messageStatus, setMessageStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      setMessageStatus({
        type: 'success',
        text: 'Thank you for contacting us! Your message has been sent successfully. We will get back to you soon.',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      setMessageStatus({
        type: 'error',
        text: 'Sorry, there was an issue sending your message. Please try again later or check the form for errors.',
      });
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name *"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email *"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Your Phone *"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" className="send-message-button">
          Send Message
        </button>
      </form>
      
      {/* Display the message below the form */}
      {messageStatus && (
        <div className={`message-status ${messageStatus.type}`}>
          {messageStatus.text}
        </div>
      )}
    </div>
  );
};

export default Contact;
