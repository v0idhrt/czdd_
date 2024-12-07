import { BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import MyMap from './components/Map/Map';
import React from 'react';
import Switch from './components/Switch/Switch';
import Home from './pages/Home/Home';
import MapPage from "./pages/MapPage/MapPage";
import Login from "./pages/LogIn/Login";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/home" element={<Home />}/>
        <Route path="map" element={<MapPage />}/>
      </Routes>
  );
}

export default App
