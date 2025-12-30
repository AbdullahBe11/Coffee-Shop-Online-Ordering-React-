import React, { useEffect, useState } from 'react';
import '../styles/Menu.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Menu() {
  const [products, setProducts] = useState([]);

  
  useEffect(() => {
    const fetchAllMenu = async () => {
      try {
        const res = await axios.get("https://coffee-shop-online-ordering-react-backend.onrender.com/menu");
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllMenu();
  }, []);

  return (
    <div className="Menu">
      <h1>Our Coffee Menu ☕</h1>
      <p>Choose your favorite brew and enjoy the perfect cup of coffee.</p>

      <div className="menu-grid">
        {products.map((item) => (
          <div className="menu-item" key={item.id}>
            
            <img 
              src={`https://coffee-shop-online-ordering-react-backend.onrender.com/images/${item.image}`} 
              alt={item.name}
              onError={(e) => { e.target.src = "https://via.placeholder.com/150" }} 
            />
            <h3>{item.name}</h3>
            <p>${item.price}</p>
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