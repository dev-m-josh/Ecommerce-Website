import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import Header from './Components/Header';
import SignUp from "./Components/SignUp";
import Login from './Components/Login';
import Account from './Components/Account';
import Admin from './Components/Admin';
import Shop from './Components/Shop';
import Footer from './Components/Footer';
import ProductDetails from './Components/ProductDetails';
import AboutUs from './Components/About';
import PrivacyPolicy from './Components/PrivacyPolicy';

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
          <Route path='/product/:productId' element={<ProductDetails />} />
          <Route path='/about' element={<AboutUs />}/>
          <Route path='/privacy' element={<PrivacyPolicy />}/>
        </Routes>
      </div>
        {<Footer/>}
    </>
  );
}

export default App;
