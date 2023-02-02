import './assets/App.css';

import LanguageSwitch from './components/LanguageSwitch';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Import from './pages/Import';
import Simulation from './pages/Simulation';
import Contact from './pages/Contact';
import About from './pages/About';
import NotFound from './pages/NotFound';


import { Route, Routes } from 'react-router-dom';

import { useEffect, useState } from 'react';
import i18n from './i18n';

function App() {

  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const navigatorLanguage = navigator.language;
    i18n.changeLanguage(navigatorLanguage);
    document.documentElement.lang = i18n.language;
    setLanguage(navigatorLanguage);
  }, [])

  const handleLanguageChange = (newLanguage: string) => {
    i18n.changeLanguage(newLanguage)
    document.documentElement.lang = i18n.language;
    setLanguage(newLanguage)
  }


  return (
    <>
      <header>
        <LanguageSwitch onClick={handleLanguageChange} />
        <Navbar />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/import" element={<Import />}></Route>
          <Route path="/simulation" element={<Simulation />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </main>

      <Footer />

    </ >
  );
}

export default App;
