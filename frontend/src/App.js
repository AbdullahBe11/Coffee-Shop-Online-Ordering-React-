import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import About from './components/About';
import Contact from './components/Contact';
import Menu from './components/Menu';
import Home from './components/Home';
import Orders from './components/Orders';
import {Routes,Route } from 'react-router-dom';
import Admin from './components/Admin';

function App() {
  return (
    <div className="App">
  <Navbar/>
<Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/menu' element={<Menu/>}/>
    <Route path='/contact' element={<Contact/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/orders' element={<Orders/>}/>
<Route path="/admin" element={<Admin />} />
  </Routes>
    </div>
  );
}

export default App;
