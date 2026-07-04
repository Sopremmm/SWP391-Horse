import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register.tsx";


import Login from "./pages/Login.tsx";
import Homepage from "./pages/Homepage.tsx";
import HorseOwnerHome from "./pages/HorseOwnerHome.tsx";
import Tournament from "./pages/Tournament.tsx";
import MyHorses from "./pages/MyHorses.tsx";
import AddHorse from "./pages/AddHorse.tsx";
import InviteJockeys from "./pages/InviteJockeys.tsx";
import InviteJockeyForm from "./pages/InviteJockeyForm.tsx";
import AdminHome from "./pages/AdminHome.tsx";
import AdminManageTournaments from "./pages/AdminManageTournaments.tsx";
import AdminCreateTournament from "./pages/AdminCreateTournament.tsx";
import AdminManageTournamentDetail from "./pages/AdminManageTournamentDetail.tsx";
import AdminConfirmRegistration from "./pages/AdminConfirmRegistration.tsx";
import AdminUsers from "./pages/AdminUsers.tsx";
import JockeyProfile from "./pages/JockeyProfile.tsx";
import HorseOwnerTournamentDetail from "./pages/HorseOwnerTournamentDetail.tsx";
import HorseOwnerHorseDetail from "./pages/HorseOwnerHorseDetail.tsx";
import JockeyHome from "./pages/JockeyHome.tsx";
import JockeyProfilePage from "./pages/JockeyProfilePage.tsx";
import JockeyInvitationPage from "./pages/JockeyInvitationPage.tsx";
import HorseOwnerProfile from "./pages/HorseOwnerProfile.tsx";
import HorseOwnerMyTournament from "./pages/HorseOwnerMyTournament.tsx";
import HorseOwnerMyJockeys from "./pages/HorseOwnerMyJockeys.tsx";
import HorseOwnerNotifications from "./pages/HorseOwnerNotifications.tsx";
import SpectatorHome from "./pages/SpectatorHome.tsx";
import SpectatorTournament from "./pages/SpectatorTournament.tsx";
import SpectatorTournamentDetail from "./pages/SpectatorTournamentDetail.tsx";
import SpectatorRaceDetail from "./pages/SpectatorRaceDetail.tsx";
import SpectatorHorses from "./pages/SpectatorHorses.tsx";
import SpectatorHorseDetail from "./pages/SpectatorHorseDetail.tsx";
import SpectatorMyBets from "./pages/SpectatorMyBets.tsx";
import RefereeHome from "./pages/RefereeHome.tsx";
import RefereeRaces from "./pages/RefereeRaces.tsx";
import RefereeRaceDetail from "./pages/RefereeRaceDetail.tsx";








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
        <Route path="/HorseOwner/Profile" element={<HorseOwnerProfile />} />
        <Route path="/HorseOwner/MyHorses" element={<MyHorses />} />
        <Route path="/HorseOwner/MyHorses/Add" element={<AddHorse />} />
        <Route path="/HorseOwner/MyHorses/edit/:name" element={<AddHorse mode="edit" />} />
        <Route path="/HorseOwner/MyHorses/:name" element={<HorseOwnerHorseDetail />} />
        <Route path="/HorseOwner/Tournaments" element={<Tournament />} />
        <Route path="/HorseOwner/Tournaments/:name" element={<HorseOwnerTournamentDetail />} />
        <Route path="/HorseOwner/MyTournament" element={<HorseOwnerMyTournament />} />
        <Route path="/HorseOwner/MyJockeyinvitations" element={<HorseOwnerMyJockeys />} />
        <Route path="/HorseOwner/Notifications" element={<HorseOwnerNotifications />} />
        <Route path="/HorseOwner/InviteJockeys" element={<InviteJockeys />} />
        <Route path="/HorseOwner/InviteJockeys/:name" element={<JockeyProfile />} />
        <Route path="/HorseOwner/InviteJockeys/:name/invite" element={<InviteJockeyForm />} />
        <Route path="/Jockey/Home" element={<JockeyHome />} />
        <Route path="/Jockey/Profile" element={<JockeyProfilePage />} />
        <Route path="/Jockey/Invitation" element={<JockeyInvitationPage />} />
        <Route path="/Jockey/Invitations" element={<JockeyInvitationPage />} />
        <Route path="/Referee/Home" element={<RefereeHome />} />
        <Route path="/referee/home" element={<RefereeHome />} />
        <Route path="/Referee/Races" element={<RefereeRaces />} />
        <Route path="/Referee/MyRaces" element={<RefereeRaces />} />
        <Route path="/Referee/Races/:name" element={<RefereeRaceDetail />} />
        <Route path="/Referee/MyRaces/:name" element={<RefereeRaceDetail />} />
        <Route path="/referee/races" element={<RefereeRaces />} />
        <Route path="/referee/myraces" element={<RefereeRaces />} />
        <Route path="/referee/races/:name" element={<RefereeRaceDetail />} />
        <Route path="/referee/myraces/:name" element={<RefereeRaceDetail />} />
        <Route path="/Spectator/Home" element={<SpectatorHome />} />
        <Route path="/spectator/home" element={<SpectatorHome />} />
        <Route path="/Spectator/Horses" element={<SpectatorHorses />} />
        <Route path="/spectator/horses" element={<SpectatorHorses />} />
        <Route path="/Spectator/Horses/:name" element={<SpectatorHorseDetail />} />
        <Route path="/spectator/horses/:name" element={<SpectatorHorseDetail />} />
        <Route path="/Spectator/MyBets" element={<SpectatorMyBets />} />
        <Route path="/spectator/mybets" element={<SpectatorMyBets />} />
        <Route path="/Spectator/Tournaments" element={<SpectatorTournament />} />
        <Route path="/Spectator/Tournament" element={<SpectatorTournament />} />
        <Route path="/Spectator/Tournaments/:name/:racename" element={<SpectatorRaceDetail />} />
        <Route path="/Spectator/Tournament/:name/:racename" element={<SpectatorRaceDetail />} />
        <Route path="/Spectator/Tournaments/:name" element={<SpectatorTournamentDetail />} />
        <Route path="/Spectator/Tournament/:name" element={<SpectatorTournamentDetail />} />
        <Route path="/spectator/tournaments" element={<SpectatorTournament />} />
        <Route path="/spectator/tournament" element={<SpectatorTournament />} />
        <Route path="/spectator/tournaments/:name/:racename" element={<SpectatorRaceDetail />} />
        <Route path="/spectator/tournament/:name/:racename" element={<SpectatorRaceDetail />} />
        <Route path="/spectator/tournaments/:name" element={<SpectatorTournamentDetail />} />
        <Route path="/spectator/tournament/:name" element={<SpectatorTournamentDetail />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/Admin/Profile" element={<AdminHome />} />
        <Route path="/Admin/User" element={<AdminUsers />} />
        <Route path="/Admin/ManageUsers" element={<AdminUsers />} />
        <Route path="/Admin/ManageTournaments" element={<AdminManageTournaments />} />
        <Route path="/Admin/ManageTournaments/Create" element={<AdminCreateTournament />} />
        <Route path="/Admin/ManageTournaments/edit/:name" element={<AdminCreateTournament mode="edit" />} />
        <Route path="/Admin/ManageTournaments/:name" element={<AdminManageTournamentDetail />} />
        <Route path="/Admin/ConfirmRegistration" element={<AdminConfirmRegistration />} />

      </Routes>
    </Router>
  );
}
