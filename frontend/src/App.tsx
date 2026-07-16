import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register.tsx";


import Login from "./pages/Login.tsx";
import Homepage from "./pages/Homepage.tsx";
import HorseOwnerHome from "./pages/horse-owner/HorseOwnerHome.tsx";
import Tournament from "./pages/horse-owner/Tournament.tsx";
import HorseOwnerHorses from "./pages/horse-owner/HorseOwnerHorses.tsx";
import MyHorses from "./pages/horse-owner/MyHorses.tsx";
import AddHorse from "./pages/horse-owner/AddHorse.tsx";
import InviteJockeys from "./pages/horse-owner/InviteJockeys.tsx";
import InviteJockeyForm from "./pages/horse-owner/InviteJockeyForm.tsx";
import AdminHome from "./pages/admin/AdminHome.tsx";
import AdminManageTournaments from "./pages/admin/AdminManageTournaments.tsx";
import AdminCreateTournament from "./pages/admin/AdminCreateTournament.tsx";
import AdminManageTournamentDetail from "./pages/admin/AdminManageTournamentDetail.tsx";
import AdminConfirmRegistration from "./pages/admin/AdminConfirmRegistration.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import JockeyProfile from "./pages/jockey/JockeyProfile.tsx";
import HorseOwnerTournamentDetail from "./pages/horse-owner/HorseOwnerTournamentDetail.tsx";
import HorseOwnerTournamentEntryRegister from "./pages/horse-owner/HorseOwnerTournamentEntryRegister.tsx";
import HorseOwnerHorseDetail from "./pages/horse-owner/HorseOwnerHorseDetail.tsx";
import JockeyHome from "./pages/jockey/JockeyHome.tsx";
import JockeyTournaments from "./pages/jockey/JockeyTournaments.tsx";
import JockeyTournamentDetail from "./pages/jockey/JockeyTournamentDetail.tsx";
import JockeyRaceDetail from "./pages/jockey/JockeyRaceDetail.tsx";
import JockeyHorseLeaderboard from "./pages/jockey/JockeyHorseLeaderboard.tsx";
import JockeyHorseDetail from "./pages/jockey/JockeyHorseDetail.tsx";
import JockeyMyRace from "./pages/jockey/JockeyMyRace.tsx";
import JockeyProfileView from "./pages/jockey/JockeyProfileView.tsx";
import JockeyProfilePage from "./pages/jockey/JockeyProfilePage.tsx";
import JockeyInvitationPage from "./pages/jockey/JockeyInvitationPage.tsx";
import JockeyInvitationDetail from "./pages/jockey/JockeyInvitationDetail.tsx";
import HorseOwnerProfile from "./pages/horse-owner/HorseOwnerProfile.tsx";
import HorseOwnerMyTournament from "./pages/horse-owner/HorseOwnerTournamentRegister.tsx";
import HorseOwnerMyJockeys from "./pages/horse-owner/HorseOwnerMyJockeys.tsx";
import HorseOwnerNotifications from "./pages/horse-owner/HorseOwnerNotifications.tsx";
import SpectatorHome from "./pages/spectator/SpectatorHome.tsx";
import SpectatorTournament from "./pages/spectator/SpectatorTournament.tsx";
import SpectatorTournamentDetail from "./pages/spectator/SpectatorTournamentDetail.tsx";
import SpectatorRaceDetail from "./pages/spectator/SpectatorRaceDetail.tsx";
import SpectatorHorses from "./pages/spectator/SpectatorHorses.tsx";
import SpectatorHorseDetail from "./pages/spectator/SpectatorHorseDetail.tsx";
import SpectatorMyBets from "./pages/spectator/SpectatorMyBets.tsx";
import RefereeHome from "./pages/referee/RefereeHome.tsx";
import RefereeRaces from "./pages/referee/RefereeRaces.tsx";
import RefereeRaceDetail from "./pages/referee/RefereeRaceDetail.tsx";
import RefereeNotifications from "./pages/referee/RefereeNotifications.tsx";
import AdminRaceIncidentLog from "./pages/admin/AdminRaceIncidentLog.tsx";
import AdminRaceIncidentDetail from "./pages/admin/AdminRaceIncidentDetail.tsx";








export default function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/HorseOwner/Home" element={<HorseOwnerHome />} />
        <Route path="/horseowner/home" element={<HorseOwnerHome />} />
        <Route path="/HorseOwnerHome" element={<HorseOwnerHome />} />
        <Route path="/horseownerhome" element={<HorseOwnerHome />} />
        <Route path="/HorseOwner/Profile" element={<HorseOwnerProfile />} />
        <Route path="/HorseOwner/Horses" element={<HorseOwnerHorses />} />
        <Route path="/HorseOwner/Horses/:name" element={<HorseOwnerHorseDetail />} />
        <Route path="/HorseOwner/MyHorses" element={<MyHorses />} />
        <Route path="/HorseOwner/MyHorses/Add" element={<AddHorse />} />
        <Route path="/HorseOwner/MyHorses/edit/:name" element={<AddHorse mode="edit" />} />
        <Route path="/HorseOwner/MyHorses/:name" element={<HorseOwnerHorseDetail />} />
        <Route path="/HorseOwner/Tournaments" element={<Tournament />} />
        <Route path="/HorseOwner/Tournaments/:name" element={<HorseOwnerTournamentDetail />} />
        <Route path="/HorseOwner/Tournaments/:name/Register" element={<HorseOwnerTournamentEntryRegister />} />
        <Route path="/HorseOwner/Tournaments/:name/entry" element={<HorseOwnerTournamentDetail />} />
        <Route path="/HorseOwner/MyTournament" element={<HorseOwnerMyTournament />} />
        <Route path="/HorseOwner/MyJockeyinvitations" element={<HorseOwnerMyJockeys />} />
        <Route path="/HorseOwner/Notifications" element={<HorseOwnerNotifications />} />
        <Route path="/HorseOwner/InviteJockeys" element={<InviteJockeys />} />
        <Route path="/HorseOwner/InviteJockeys/:name" element={<JockeyProfile />} />
        <Route path="/HorseOwner/InviteJockeys/:name/invite" element={<InviteJockeyForm />} />
        <Route path="/Jockey/Home" element={<JockeyHome />} />
        <Route path="/Jockey/Tournaments" element={<JockeyTournaments />} />
        <Route path="/Jockey/Tournaments/:name" element={<JockeyTournamentDetail />} />
        <Route path="/Jockey/Tournaments/:name/:race" element={<JockeyRaceDetail />} />
        <Route path="/Jockey/HorseLeaderBoard" element={<JockeyHorseLeaderboard />} />
        <Route path="/Jockey/Leaderboard" element={<JockeyHorseLeaderboard />} />
        <Route path="/Jockey/Horse/:name" element={<JockeyHorseDetail />} />
        <Route path="/Jockey/MyRace" element={<JockeyMyRace />} />
        <Route path="/jockey/tournament/:name/:race" element={<JockeyRaceDetail />} />
        <Route path="/Jockey/Profile/edit" element={<JockeyProfilePage />} />
        <Route path="/Jockey/Profile" element={<JockeyProfileView />} />
        <Route path="/Jockey/Invitation" element={<JockeyInvitationPage />} />
        <Route path="/Jockey/Invitations" element={<JockeyInvitationPage />} />
        <Route path="/Jockey/Invitation/:id" element={<JockeyInvitationDetail />} />
        <Route path="/Jockey/Invitation/Jockey/Invitation/:tournamentname" element={<JockeyInvitationDetail />} />
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
        <Route path="/Referee/Notifications" element={<RefereeNotifications />} />
        <Route path="/referee/notifications" element={<RefereeNotifications />} />
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
        <Route path="/Admin/ManageTournaments/:name/:racename" element={<AdminManageTournamentDetail />} />
        <Route path="/Admin/ManageTournaments/:name" element={<AdminManageTournamentDetail />} />
        <Route path="/Admin/ConfirmRegistration" element={<AdminConfirmRegistration />} />
        <Route path="/Admin/RaceIncidentLog" element={<AdminRaceIncidentLog />} />
        <Route path="/Admin/RaceIncidentsLog" element={<AdminRaceIncidentLog />} />
        <Route path="/Admin/RaceIncidentsLog/:name/:racename" element={<AdminRaceIncidentDetail />} />

      </Routes>
    </Router>
  );
}
