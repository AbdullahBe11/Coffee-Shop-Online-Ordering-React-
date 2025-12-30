import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Orders.css';

function Orders() {
  
  const [menuItems, setMenuItems] = useState([]);
  
  
  const [selectedId, setSelectedId] = useState(''); 
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState(""); 
  
  
  const [orderList, setOrderList] = useState([]); 

  
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("https://coffee-shop-online-ordering-react-backend.onrender.com/menu");
        setMenuItems(res.data);
        
        
        if (res.data.length > 0) {
          setSelectedId(res.data[0].id);
        }
      } catch (err) {
        console.log("Error fetching menu:", err);
      }
    };
    fetchMenu();
  }, []);

 
  const handleAdd = () => {
    const product = menuItems.find(item => item.id === parseInt(selectedId));
    if (!product) return;
    let updatedOrders = [...orderList]; 
    let existingItem = updatedOrders.find(item => item.menu_id === product.id);

    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      updatedOrders.push({ 
        menu_id: product.id,
        name: product.name, 
        price: product.price, 
        quantity: parseInt(quantity) 
      });
    }
    
    setOrderList(updatedOrders);
  };

  const handleRemove = (menuId) => {
    const filteredOrders = orderList.filter(item => item.menu_id !== menuId);
    setOrderList(filteredOrders);
  };

let totalAmount =0;
  orderList.forEach(item => {
    totalAmount += item.price * item.quantity;
  });

  
  const handleSubmitOrder = async () => {
    if (orderList.length === 0) {
      alert("Your order is empty!");
      return;
    }

    const orderData = {
      customer_name: customerName || "Guest",
      total_amount: totalAmount,
      items: orderList 
    };

    try {
      await axios.post("https://coffee-shop-online-ordering-react-backend.onrender.com/orders", orderData);
      alert("Order placed successfully! ☕");
      setOrderList([]); 
      setCustomerName(""); 
    } catch (err) {
      console.log(err);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="orders-page">
      <h1>Place Your Order</h1>

      <div className="order-form">
        <div>
           <label>Customer Name:</label>
           <input 
             type="text" 
             placeholder="Enter your name"
             value={customerName}
             onChange={(e) => setCustomerName(e.target.value)}
           />
        </div>
        <div>
            <label>Product:</label>
            <select 
              value={selectedId} 
              onChange={e => setSelectedId(e.target.value)}
            >
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} - ${item.price}
                </option>
              ))}
            </select>
        </div>

        <div>
          <label>Quantity:</label>
          <input 
            type="number" 
            min="1" 
            value={quantity} 
            onChange={e => setQuantity(Number(e.target.value))} 
          />
        </div>

        <button onClick={handleAdd}>Add to Order</button>
      </div>

      <div>
        {orderList.length > 0 && (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((orderItem, idx) => (
                <tr key={idx}>
                  <td>{orderItem.name}</td>
                  <td>${orderItem.price}</td>
                  <td>{orderItem.quantity}</td>
                  <td>${(orderItem.price * orderItem.quantity).toFixed(2)}</td>
                  <td>
                    <button 
                      className="remove-btn" 
                      onClick={() => handleRemove(orderItem.menu_id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3">Total</td>
                <td>${totalAmount.toFixed(2)}</td>
                <td>
                  <button 
                    onClick={handleSubmitOrder}
                    style={{ backgroundColor: '#28a745', color: 'white' }}
                  >
                    Submit Order
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}

export default Orders;