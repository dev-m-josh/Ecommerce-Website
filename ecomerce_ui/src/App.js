import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import Header from './Components/Header';
import SignUp from "./Components/SignUp";
import Login from './Components/Login';
import Account from './Components/Account';
import Admin from './Components/Admin';
import Shop from './Components/Shop';
import Footer from './Components/Footer/Footer';
import ProductDetails from './Components/ProductDetails';
import AboutUs from './Components/Footer/About';
import PrivacyPolicy from './Components/Footer/PrivacyPolicy';
import TermsAndConditions from './Components/Footer/TermsAndConditions';
import ContactUs from './Components/Footer/Contacts';
import ReturnPolicy from './Components/Footer/ReturnPolicy';

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
          <Route path='/terms' element={<TermsAndConditions />}/>
          <Route path='/contact' element={<ContactUs />}/>
          <Route path='/returns-policy' element={<ReturnPolicy />}/>
        </Routes>
      </div>
        {<Footer/>}
    </>
  );
}

export default App;
