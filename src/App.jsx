import { Routes, Route } from "react-router";


import './App.css';
import Home from '../pages/Home';
import AboutUs from '../pages/AboutUs';
import Header from '../components/Header';

function App() {




  // vercel app url : https://punjab-power-backend.vercel.app/
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<AboutUs />} /> */}


      </Routes>
    </>
  )
}

export default App
