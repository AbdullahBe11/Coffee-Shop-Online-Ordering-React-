import React, { useEffect, useState } from 'react';
import '../styles/Menu.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Menu() {
  const [products, setProducts] = useState([]);
  const [debugError, setDebugError] = useState(null);

  useEffect(() => {
    const fetchAllMenu = async () => {
      try {
        const res = await axios.get("https://coffee-shop-online-ordering-react-backend.onrender.com/menu");
        console.log("Raw Data:", res.data);

        // CHECK: Is it a list or an error?
        if (Array.isArray(res.data)) {
            setProducts(res.data);
        } else {
            // It's not a list! It's likely an error object.
            // Let's save it to show the user.
            setDebugError(res.data);
            setProducts([]); 
        }
      } catch (err) {
        console.log(err);
        setDebugError(err.message);
      }
    };
    fetchAllMenu();
  }, []);

  return (
    <div className="Menu">
      <h1>Our Coffee Menu ☕</h1>

      {/* 🚨 DEBUG SECTION: Shows us exactly what is wrong */}
      {debugError && (
        <div style={{background: '#ffcccc', color: 'red', padding: '20px', margin: '20px', border: '2px solid red', fontWeight: 'bold'}}>
            <h3>⚠️ BACKEND ERROR DETECTED:</h3>
            <pre>{JSON.stringify(debugError, null, 2)}</pre>
            <p>Please send a screenshot of this red box to Gemini!</p>
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