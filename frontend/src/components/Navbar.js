import React from 'react'
import '../styles/NavBar.css'
import {Link} from "react-router-dom"

function Navbar() {
  return (
    <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/about">About</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/admin">Admin</Link>
    </nav>
  )
}

export default Navbar