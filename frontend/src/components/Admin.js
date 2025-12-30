import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Admin.css'; 

function Admin() {
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image: null });
  const [editId, setEditId] = useState(null); 

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      // Updated to your live Render Backend URL
      const res = await axios.get("https://coffee-shop-online-ordering-react-backend.onrender.com/menu");
      console.log("Data received from backend:", res.data); // Log to see what we get
      
      // Safety Check: Only set data if it is actually a list (Array)
      if (Array.isArray(res.data)) {
        setMenuItems(res.data);
      } else {
        console.error("Backend did not return a list!", res.data);
        setMenuItems([]); // Set empty list to prevent crash
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      if (editId) {
        // FIXED: Added backticks ` ` for template literal
        await axios.post(`https://coffee-shop-online-ordering-react-backend.onrender.com/modify/${editId}`, formData);
        alert("Item Updated Successfully!");
      } else {
        await axios.post("https://coffee-shop-online-ordering-react-backend.onrender.com/create", formData);
        alert("Item Added Successfully!");
      }
      
      setForm({ name: "", price: "", image: null });
      setEditId(null);
      fetchMenu(); 

    } catch (err) {
      console.log(err);
      alert("Error saving item");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coffee?")) {
      try {
        // FIXED: Added backticks ` `
        await axios.delete(`https://coffee-shop-online-ordering-react-backend.onrender.com/menu/${id}`);
        fetchMenu(); 
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ name: item.name, price: item.price, image: null }); 
    window.scrollTo(0, 0); 
  };

  return (
    <div className="Admin">
      <h1>Admin Dashboard ⚙️</h1>
      
      <div className="admin-container">
        <div className="admin-form">
          <h2>{editId ? "Update Coffee" : "Add New Coffee"}</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name" 
              placeholder="Coffee Name (e.g. Latte)" 
              value={form.name} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="number" 
              name="price" 
              placeholder="Price (e.g. 4.50)" 
              value={form.price} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="file" 
              name="image" 
              onChange={handleFileChange} 
              required={!editId} 
            />
            
            <button type="submit" className={editId ? "update-btn" : "add-btn"}>
              {editId ? "Update Item" : "Add Item"}
            </button>
            
            {editId && (
              <button type="button" className="cancel-btn" onClick={() => {
                setEditId(null);
                setForm({ name: "", price: "", image: null });
              }}>
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="admin-list">
          <h2>Current Menu Items</h2>
          <div className="list-grid">
            {/* SAFETY CHECK: Ensure menuItems is an array before mapping */}
            {Array.isArray(menuItems) && menuItems.length > 0 ? (
              menuItems.map((item) => (
                <div key={item.id} className="list-item">
                  {/* FIXED: Added backticks ` ` */}
                  <img src={`https://coffee-shop-online-ordering-react-backend.onrender.com/images/${item.image}`} alt={item.name} />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>${item.price}</p>
                  </div>
                  <div className="actions">
                    <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No coffee items found. Add one above! ☕</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;