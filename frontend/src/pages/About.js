import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-us">
      <section className="intro">
        <h1>About Our Company</h1>
        <p>
          Welcome to [Company Name], your number one source for all things [Product Category].
          We're dedicated to providing you the very best of [product type], with a focus on quality,
          customer service, and uniqueness.
        </p>
      </section>

      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          Our mission is to make shopping for [Product Category] a seamless and enjoyable experience. 
          We believe in offering products that enhance your daily life, and we're committed to ensuring 
          our customers find exactly what they’re looking for.
        </p>
      </section>

      <section className="history">
        <h2>Our Journey</h2>
        <p>
          Founded in [Year of Establishment], [Company Name] has come a long way from its beginnings. 
          What started as a small business in [City, Country] has grown into a trusted online retailer, 
          serving customers across the globe.
        </p>
      </section>

      <section className="commitment">
        <h2>Commitment to Quality</h2>
        <p>
          We carefully select each product we sell to ensure the highest level of quality. Our products 
          are sourced from reputable manufacturers and are tested for durability and style.
        </p>
      </section>

      <section className="team">
        <h2>Meet Our Team</h2>
        <p>
          We’re a passionate team of individuals who love what we do. From customer support to logistics, 
          everyone here at [Your Company Name] works to make sure you have the best shopping experience.
        </p>
      </section>
      
      <section className="contact">
        <h2>Get in Touch</h2>
        <p>
          If you have any questions or comments, please don't hesitate to contact us at:
          <br />
          <a href="mailto:support@yourcompany.com">support@companyname.com</a>
        </p>
      </section>
    </div>
  );
};

export default About;
