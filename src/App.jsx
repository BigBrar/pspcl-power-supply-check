import { Routes, Route } from "react-router";
import './App.css';
import Home from '../pages/Home';
import AboutUs from '../pages/AboutUs';
import Header from '../components/Header';

function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* Dynamic routing for District, Division, and Subdivision */}
        <Route path="/" element={<Home />} />
        <Route path="/:route_district" element={<Home />} />
        <Route path="/:route_district/:route_division" element={<Home />} />
        <Route path="/:route_district/:route_division/:route_subdivision" element={<Home />} />

        {/* <Route path="/about" element={<AboutUs />} /> */}
      </Routes>
    </>
  )
}

export default App;