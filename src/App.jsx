import { Routes, Route  } from "react-router";


import './App.css';
import Home from '../pages/Home';
import AboutUs from '../pages/AboutUs';

function App() {





  return (
    <>
    <Routes>
      <Route path="/" element={<Home /> }/>
      <Route path="/about" element={<AboutUs/> }/>
      
    
</Routes>
    </>
  )
}

export default App
