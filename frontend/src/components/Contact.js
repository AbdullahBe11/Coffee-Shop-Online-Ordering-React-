import React, { useState } from 'react'
import '../styles/Contact.css';
import { Link } from 'react-router-dom';

function Contact() {
  const [state, setState] = useState({ fname: "", email: "", message: "" });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    alert(JSON.stringify(state));
  };

  return (
    <div className="contact">

      <div className='rightSide'>
        <h1>Contact Us</h1>

        <form id="contact-form">
          <label htmlFor='name'>Full name</label>
          <input
            name='fname'
            placeholder='Enter Full name....'
            type="text"
            onChange={handleChange}
          />

          <label htmlFor='email'>Email</label>
          <input
            name='email'
            placeholder='Enter email...'
            type="email"
            onChange={handleChange}
          />

          <label htmlFor='message'>Message</label>
          <textarea
            rows='6'
            placeholder='Enter a message....'
            name='message'
            required
            onChange={handleChange}
          ></textarea>

          <button type="submit" onClick={handleSubmit}>Send Message</button>
        </form>
      </div>

      <section className="footer">
        <h2>Contact & Socials</h2>

        <div className="contact-info">
          <p>📞 +961 81 234 567</p>
          <p>📸 Instagram: @cedars_coffeeshoplb</p>
        </div>

        <Link to="/orders" className="order-btn">Order Now</Link>
      </section>

    </div>
  );
}

export default Contact;
