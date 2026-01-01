import React, { useEffect, useState } from 'react';
import '../styles/Menu.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Menu() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAllMenu = async () => {
      try {
        // ✅ Using your LIVE Render Backend
        const res = await axios.get("https://coffee-shop-online-ordering-react-backend.onrender.com/menu");
        console.log("Backend Response:", res.data); 

        // 🛡️ SAFETY CHECK: Only update if it is a real list
        if (Array.isArray(res.data)) {
            setProducts(res.data);
            setError(false);
        } else {
            console.error("Backend sent an error instead of a list:", res.data);
            setError(res.data); // Save the error to show it in Red Box
            setProducts([]);    // Keep empty to prevent crash
        }
      } catch (err) {
        console.log(err);
        setError(err);
      }
    };
    fetchAllMenu();
  }, []);

  return (
    <div className="Menu">
      <h1>Our Coffee Menu ☕</h1>

      {/* 🚨 DEBUG RED BOX: Shows the real error instead of crashing */}
      {error && (
        <div style={{background: '#ffcccc', color: 'red', padding: '20px', margin: '20px', border: '2px solid red', fontWeight: 'bold'}}>
            <h3>⚠️ BACKEND ERROR:</h3>
            <pre>{JSON.stringify(error, null, 2)}</pre>
            <p>Please send a screenshot of this box to Gemini!</p>
        </div>
      )}

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