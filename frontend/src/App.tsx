import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register.tsx";
import {
  ConnectedAdminRaceIncidentDetail,
  ConnectedAdminRaceIncidentLog,
  ConnectedJockeyHome,
  ConnectedJockeyHorseDetail,
  ConnectedJockeyHorseLeaderboard,
  ConnectedJockeyInvitationDetail,
  ConnectedJockeyInvitationPage,
  ConnectedJockeyNotifications,
  ConnectedJockeyMyRace,
  ConnectedJockeyProfilePage,
  ConnectedJockeyProfileView,
  ConnectedJockeyRaceDetail,
  ConnectedJockeyTournamentDetail,
  ConnectedJockeyTournaments,
  ConnectedHorseOwnerRaceDetail,
  ConnectedRefereeHome,
  ConnectedRefereeNotifications,
  ConnectedRefereeRaceDetail,
  ConnectedRefereeRaces,
  ConnectedSpectatorHome,
  ConnectedSpectatorHorseDetail,
  ConnectedSpectatorHorses,
  ConnectedSpectatorProfile,
  ConnectedSpectatorRaceDetail,
  ConnectedSpectatorTournament,
  ConnectedSpectatorTournamentDetail,
} from "./pages/ConnectedPages.tsx";


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
import HorseOwnerProfile from "./pages/horse-owner/HorseOwnerProfile.tsx";
import HorseOwnerMyTournament from "./pages/horse-owner/HorseOwnerTournamentRegister.tsx";
import HorseOwnerMyJockeys from "./pages/horse-owner/HorseOwnerMyJockeys.tsx";
import HorseOwnerNotifications from "./pages/horse-owner/HorseOwnerNotifications.tsx";
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
        <Route path="/HorseOwner/Tournaments/:name/:racename" element={<ConnectedHorseOwnerRaceDetail />} />
        <Route path="/HorseOwner/Tournaments/:name/Register" element={<HorseOwnerTournamentEntryRegister />} />
        <Route path="/HorseOwner/Tournaments/:name/entry" element={<HorseOwnerTournamentDetail />} />
        <Route path="/HorseOwner/MyTournament" element={<HorseOwnerMyTournament />} />
        <Route path="/HorseOwner/MyJockeyinvitations" element={<HorseOwnerMyJockeys />} />
        <Route path="/HorseOwner/Notifications" element={<HorseOwnerNotifications />} />
        <Route path="/HorseOwner/InviteJockeys" element={<InviteJockeys />} />
        <Route path="/HorseOwner/InviteJockeys/:name" element={<JockeyProfile />} />
        <Route path="/HorseOwner/InviteJockeys/:name/invite" element={<InviteJockeyForm />} />
        <Route path="/Jockey/Home" element={<ConnectedJockeyHome />} />
        <Route path="/Jockey/Tournaments" element={<ConnectedJockeyTournaments />} />
        <Route path="/Jockey/Tournaments/:name" element={<ConnectedJockeyTournamentDetail />} />
        <Route path="/Jockey/Tournaments/:name/:race" element={<ConnectedJockeyRaceDetail />} />
        <Route path="/Jockey/HorseLeaderBoard" element={<ConnectedJockeyHorseLeaderboard />} />
        <Route path="/Jockey/Leaderboard" element={<ConnectedJockeyHorseLeaderboard />} />
        <Route path="/Jockey/Horse/:name" element={<ConnectedJockeyHorseDetail />} />
        <Route path="/Jockey/MyRace" element={<ConnectedJockeyMyRace />} />
        <Route path="/jockey/tournament/:name/:race" element={<ConnectedJockeyRaceDetail />} />
        <Route path="/Jockey/Profile/edit" element={<ConnectedJockeyProfilePage />} />
        <Route path="/Jockey/Profile" element={<ConnectedJockeyProfileView />} />
        <Route path="/Jockey/Invitation" element={<ConnectedJockeyInvitationPage />} />
        <Route path="/Jockey/Invitations" element={<ConnectedJockeyInvitationPage />} />
        <Route path="/Jockey/Invitation/:id" element={<ConnectedJockeyInvitationDetail />} />
        <Route path="/Jockey/Invitation/Jockey/Invitation/:tournamentname" element={<ConnectedJockeyInvitationDetail />} />
        <Route path="/Jockey/Notifications" element={<ConnectedJockeyNotifications />} />
        <Route path="/jockey/notifications" element={<ConnectedJockeyNotifications />} />
        <Route path="/Referee/Home" element={<ConnectedRefereeHome />} />
        <Route path="/referee/home" element={<ConnectedRefereeHome />} />
        <Route path="/Referee/Races" element={<ConnectedRefereeRaces />} />
        <Route path="/Referee/MyRaces" element={<ConnectedRefereeRaces />} />
        <Route path="/Referee/Races/:name" element={<ConnectedRefereeRaceDetail />} />
        <Route path="/Referee/MyRaces/:name" element={<ConnectedRefereeRaceDetail />} />
        <Route path="/referee/races" element={<ConnectedRefereeRaces />} />
        <Route path="/referee/myraces" element={<ConnectedRefereeRaces />} />
        <Route path="/referee/races/:name" element={<ConnectedRefereeRaceDetail />} />
        <Route path="/referee/myraces/:name" element={<ConnectedRefereeRaceDetail />} />
        <Route path="/Referee/Notifications" element={<ConnectedRefereeNotifications />} />
        <Route path="/referee/notifications" element={<ConnectedRefereeNotifications />} />
        <Route path="/Spectator/Home" element={<ConnectedSpectatorHome />} />
        <Route path="/spectator/home" element={<ConnectedSpectatorHome />} />
        <Route path="/Spectator/Horses" element={<ConnectedSpectatorHorses />} />
        <Route path="/spectator/horses" element={<ConnectedSpectatorHorses />} />
        <Route path="/Spectator/Horses/:name" element={<ConnectedSpectatorHorseDetail />} />
        <Route path="/spectator/horses/:name" element={<ConnectedSpectatorHorseDetail />} />
        <Route path="/Spectator/Profile" element={<ConnectedSpectatorProfile />} />
        <Route path="/spectator/profile" element={<ConnectedSpectatorProfile />} />
        <Route path="/Spectator/Tournaments" element={<ConnectedSpectatorTournament />} />
        <Route path="/Spectator/Tournament" element={<ConnectedSpectatorTournament />} />
        <Route path="/Spectator/Tournaments/:name/:racename" element={<ConnectedSpectatorRaceDetail />} />
        <Route path="/Spectator/Tournament/:name/:racename" element={<ConnectedSpectatorRaceDetail />} />
        <Route path="/Spectator/Tournaments/:name" element={<ConnectedSpectatorTournamentDetail />} />
        <Route path="/Spectator/Tournament/:name" element={<ConnectedSpectatorTournamentDetail />} />
        <Route path="/spectator/tournaments" element={<ConnectedSpectatorTournament />} />
        <Route path="/spectator/tournament" element={<ConnectedSpectatorTournament />} />
        <Route path="/spectator/tournaments/:name/:racename" element={<ConnectedSpectatorRaceDetail />} />
        <Route path="/spectator/tournament/:name/:racename" element={<ConnectedSpectatorRaceDetail />} />
        <Route path="/spectator/tournaments/:name" element={<ConnectedSpectatorTournamentDetail />} />
        <Route path="/spectator/tournament/:name" element={<ConnectedSpectatorTournamentDetail />} />
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
        <Route path="/Admin/RaceIncidentLog" element={<ConnectedAdminRaceIncidentLog />} />
        <Route path="/Admin/RaceIncidentsLog" element={<ConnectedAdminRaceIncidentLog />} />
        <Route path="/Admin/RaceIncidentsLog/:name/:racename" element={<ConnectedAdminRaceIncidentDetail />} />

      </Routes>
    </Router>
  );
}
