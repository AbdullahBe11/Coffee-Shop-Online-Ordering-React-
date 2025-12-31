import React, { useEffect, useState } from 'react';
import '../styles/Menu.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Menu() {
  const [products, setProducts] = useState([]);

  
  const API_BASE = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    const fetchAllMenu = async () => {
      try {
        const url = `${API_BASE}/menu`;
        const res = await axios.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to load menu:', err.message || err);
      }
    };
    fetchAllMenu();
  }, []);

  const makeImageSrc = (image) => {
    if (!image) return 'https://via.placeholder.com/150';
    if (typeof image === 'string') {
      if (image.startsWith('http://') || image.startsWith('https://')) return image;
      if (image.length > 200 && !image.includes('.')) return `data:image/*;base64,${image}`;
      return `${API_BASE}/images/${image}`;
    }
    return 'https://via.placeholder.com/150';
  };

  return (
    <div className="Menu">
      <h1>Our Coffee Menu ☕</h1>
      <p>Choose your favorite brew and enjoy the perfect cup of coffee.</p>

      <div className="menu-grid">
        {products.map((item) => (
          <div className="menu-item" key={item.id}>
            <img
              src={makeImageSrc(item.image)}
              alt={item.name}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
            />
            <h3>{item.name}</h3>
            <p>${Number(item.price).toFixed(2)}</p>
          </div>
        ))}
      </div>
      
      <section className="footer">
        <h2>Visit Us or Place Your Order</h2>
        <Link to="/orders">Order Now</Link>
      </section>
    </div>
  );
}

export default Menu;