import { BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import MyMap from './components/Map/Map';
import React from 'react';
import Switch from './components/Switch/Switch';
import Home from './pages/Home/Home';
import MapPage from "./pages/MapPage/MapPage";
import Login from "./pages/LogIn/Login";
import Actual from "./pages/Actual/Actual";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/home" element={<Home />}/>
        <Route path="/map" element={<MapPage />}/>
        <Route path="/actual" element={<Actual />} />
      </Routes>
  );
}

export default App
