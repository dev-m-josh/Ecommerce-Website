import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import Header from './Components/Header';
import SignUp from './Components/Users/SignUp';
import Login from './Components/Users/Login';
import Account from './Components/Users/Account';
import Admin from './Components/Admin';
import Shop from './Components/Products/Shop';
import Footer from './Components/Footer/Footer';
import ProductDetails from './Components/Products/ProductDetails';
import AboutUs from './Components/Footer/About';
import PrivacyPolicy from './Components/Footer/PrivacyPolicy';
import TermsAndConditions from './Components/Footer/TermsAndConditions';
import ContactUs from './Components/Footer/Contacts';
import ReturnPolicy from './Components/Footer/ReturnPolicy';
import OpenCart from './Components/Cart/OpenCart';

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
          <Route path='/' element={<Shop/>}/>
          <Route path='/product/:productId' element={<ProductDetails />} />
          <Route path='/about' element={<AboutUs />}/>
          <Route path='/privacy' element={<PrivacyPolicy />}/>
          <Route path='/terms' element={<TermsAndConditions />}/>
          <Route path='/contact' element={<ContactUs />}/>
          <Route path='/returns-policy' element={<ReturnPolicy />}/>
          <Route path='/cart' element={<OpenCart />}/>
        </Routes>
      </div>
        {<Footer/>}
    </>
  );
};

export default App;
