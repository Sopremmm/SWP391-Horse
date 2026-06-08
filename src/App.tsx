import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register.tsx";


import Login from "./pages/Login.tsx";
import Homepage from "./pages/Homepage.tsx";
import HorseOwnerHome from "./pages/HorseOwnerHome.tsx";
import Tournament from "./pages/Tournament.tsx";
import MyHorses from "./pages/MyHorses.tsx";
import AddHorse from "./pages/AddHorse.tsx";
import HireJockey from "./pages/HireJockey.tsx";
import AdminHome from "./pages/AdminHome.tsx";
import AdminManageTournaments from "./pages/AdminManageTournaments.tsx";
import AdminCreateTournament from "./pages/AdminCreateTournament.tsx";
import AdminManageTournamentDetail from "./pages/AdminManageTournamentDetail.tsx";
import JockeyProfile from "./pages/JockeyProfile.tsx";








export default function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/HorseOwnerHome" element={<HorseOwnerHome />} />
        <Route path="/horseownerhome" element={<HorseOwnerHome />} />
        <Route path="/HorseOwner/Profile" element={<HorseOwnerHome />} />
        <Route path="/HorseOwner/MyHorses" element={<MyHorses />} />
        <Route path="/HorseOwner/MyHorses/Add" element={<AddHorse />} />
        <Route path="/HorseOwner/Tournaments" element={<Tournament />} />
        <Route path="/HorseOwner/MyTournament" element={<Tournament />} />
        <Route path="/HorseOwner/HireJockeys" element={<HireJockey />} />
        <Route path="/horseowner/hirejockey" element={<JockeyProfile />} />
        <Route path="/horseowner/hirejockey/:name" element={<JockeyProfile />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/Admin/Profile" element={<AdminHome />} />
        <Route path="/Admin/ManageUsers" element={<AdminHome />} />
        <Route path="/Admin/ManageTournaments" element={<AdminManageTournaments />} />
        <Route path="/Admin/ManageTournaments/Create" element={<AdminCreateTournament />} />
        <Route path="/Admin/ManageTournaments/edit/:name" element={<AdminCreateTournament mode="edit" />} />
        <Route path="/Admin/ManageTournaments/:name" element={<AdminManageTournamentDetail />} />
        <Route path="/Admin/ConfirmRegistration" element={<AdminHome />} />

      </Routes>
    </Router>
  );
}
