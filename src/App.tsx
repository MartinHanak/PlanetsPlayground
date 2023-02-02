import React from 'react';
import './assets/App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';

import { Route, Routes } from 'react-router-dom';


function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </main>

      <Footer />

    </ >
  );
}

export default App;
