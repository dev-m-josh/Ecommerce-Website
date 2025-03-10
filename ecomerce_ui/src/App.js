import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import Header from './Components/Header';
import SignUp from "./Components/SignUp";

function App() {
  return (
    <>
      <Header/>
      <div className="App">
        <Routes>
          <Route path="/register" element={<SignUp/>}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
