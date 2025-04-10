import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import Header from './Components/Header';
import SignUp from './Components/Users/SignUp';
import Login from './Components/Users/Login';
import Account from './Components/Users/Account';
import Shop from './Components/Products/Shop';
import ProductDetails from './Components/Products/ProductDetails';
import OpenCart from './Components/Cart/OpenCart';
import Dashboard from './Components/Dashboard';
import Users from './Components/Users/Users';
import AdminDash from './Components/AdminDash';
import Products from './Components/Products/Products';

function App() {
  const [showOptions, setShowOptions] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
      setSearchTerm(term);
  };

  return (
    <>
      <Header showOptions={showOptions} setShowOptions={setShowOptions} onSearch={handleSearch}/>
      <div className={`close ${showOptions ? 'active' : ''}`} onClick={() => setShowOptions(false)}></div>
      <div className="App">
        <Routes>
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/products" element={<Shop searchTerm={searchTerm}/>} />
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<OpenCart />} />
          
          <Route path="/" element={<AdminDash />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="stock" element={<Products />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
