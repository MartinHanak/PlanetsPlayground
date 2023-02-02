import './assets/App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Import from './pages/Import';
import Simulation from './pages/Simulation';
import Contact from './pages/Contact';
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
