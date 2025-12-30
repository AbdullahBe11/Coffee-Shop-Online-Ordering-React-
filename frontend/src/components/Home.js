import React from 'react'
import '../styles/Home.css'
import '../styles/Footer.css'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import nescafe from '../assets/nescafe.webp';
import mocha from '../assets/mocha.png';
function Home() {
  const navigate=useNavigate();
  return (
    <div className='Home'>
    <section className="hero">
  <h1>Freshly Brewed Happiness ☕</h1>
  <p>Your daily dose of coffee starts here.</p>
  <button onClick={() => navigate("/menu")}>View Menu</button>
</section>
<section className="about-preview">
  <h2>About Us</h2>
  <p>
    We're passionate about crafting the perfect cup of coffee — made with
    locally sourced beans and love in every pour.
  </p>
  <Link to="/about">Learn More</Link>
</section>
<br/>
<section className='OpeningHours'>
<h3>We're open daily 7:00 AM - 10:00 PM</h3>
<p>Find us at Beirut City Center</p>
</section>
<br/>
<section className="featured">
  <h2>Our Favorites</h2>
  <div className="products">
    <div className="product">
      <img src={nescafe} alt="nescafe" />
      <h3>Nescafe</h3>
      <p>$4.00</p>
    </div>
    <div className="product">
      <img src={mocha} alt="mocha" />
      <h3>Mocha</h3>
      <p>$4.75</p>
    </div>
  </div>
</section>
<br/>
<section className="reviews">
  <h2>What Our Customers Say</h2>
  <p>"Best coffee in town! I can’t start my day without it." – Sarah K.</p>
</section>
<br/>
<div>
<section className='footer' >
  <h2>Visit Us or Order Online</h2>
  <Link to="/orders">Order Now</Link>
</section>
</div>
</div>

  )
}

export default Home