import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import Header from './Components/Header';
import SignUp from "./Components/SignUp";
import Login from './Components/Login';
import Account from './Components/Account';
import Admin from './Components/Admin';
import Shop from './Components/Shop';
import Home from './Components/Home';
import ProductDetails from './Components/ProductDetails';

function App() {
  return (
    <>
      <Header/>
      <div className="App">
        <Routes>
          <Route path="/register" element={<SignUp/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path='/account' element={<Account/>}/>
          <Route path='/admin' element={<Admin/>}/>
          <Route path='/shop' element={<Shop/>}/>
          <Route path='/' element={<Home/>}/>
          <Route path='/product/:productId' element={<ProductDetails />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
