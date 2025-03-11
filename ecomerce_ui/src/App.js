import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import Header from './Components/Header';
import SignUp from "./Components/SignUp";
import Login from './Components/Login';

function App() {
  return (
    <>
      <Header/>
      <div className="App">
        <Routes>
          <Route path="/register" element={<SignUp/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
