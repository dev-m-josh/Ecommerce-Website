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
import UserRoles from './Components/Users/UserRoles';
import NewProduct from './Components/Products/NewProduct';
import MostSelling from './Components/Sales/MostSelling';
import LowStock from './Components/Products/LowStock';
import ProductSales from './Components/Sales/ProductSales';
import CategorySales from './Components/Sales/CategorySales';
import AdminDash from './Components/AdminDash';
import Products from './Components/Products/Products';

function App() {

  const [showOptions, setShowOptions] = useState(false);

  return (
    <>
      <Header showOptions={showOptions} setShowOptions={setShowOptions} />
      <div className={`close ${showOptions ? 'active' : ''}`} onClick={() => setShowOptions(false)}></div>
      <div className="App">
        <Routes>
          <Route path="/register" element={<SignUp/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path='/account' element={<Account/>}/>
          <Route path='/products' element={<Shop/>}/>
          <Route path='/products/:productId' element={<ProductDetails />} />
          <Route path='/cart' element={<OpenCart />}/>
          <Route path='/users-role' element={<UserRoles />}/>
          <Route path='/new-product' element={<NewProduct />}/>
          <Route path='/most-selling-product' element={<MostSelling />}/>
          <Route path='/low-stock' element={<LowStock />}/>
          <Route path='/product-sales' element={<ProductSales />}/>
          <Route path='/category-sales' element={<CategorySales />}/>
          <Route path='/' element={<AdminDash/>}>
            <Route index path='/dashboard' element={<Dashboard/>}/>
            <Route path='/users' element={<Users/>}/>
            <Route path='/stock' element={<Products/>}/>
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
