import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register.tsx";


import Login from "./pages/Login.tsx";
import Homepage from "./pages/Homepage.tsx";
import HorseOwnerHome from "./pages/HorseOwnerHome.tsx";
import Tournament from "./pages/Tournament.tsx";
import MyHorses from "./pages/MyHorses.tsx";
import HireJockey from "./pages/HireJockey.tsx";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/HorseOwnerHome" element={<HorseOwnerHome />} />
        <Route path="/horseownerhome" element={<HorseOwnerHome />} />

        <Route path="/horses" element={<MyHorses />} />
        <Route path="/tournament" element={<Tournament />} />
        <Route path="/hire-jockey" element={<HireJockey />} />
      </Routes>
    </Router>
  );
}





