import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './tms/AppContext.jsx';
import LandingPage from './tms/pages/LandingPage.jsx';
import HostHome from './tms/pages/HostHome.jsx';
import OwnerDashboard from './tms/pages/OwnerDashboard.jsx';
import JockeyDashboard from './tms/pages/JockeyDashboard.jsx';
import RefereeDashboard from './tms/pages/RefereeDashboard.jsx';
import SpectatorDashboard from './tms/pages/SpectatorDashboard.jsx';
import SpectatorBets from './tms/pages/SpectatorBets.jsx';
import LiveRaces from './tms/pages/LiveRaces.jsx';
import ProfilePage from './tms/pages/ProfilePage.jsx';
import SpectatorHome from './tms/pages/SpectatorHome.jsx';
import SpectatorProfile from './tms/pages/SpectatorProfile.jsx';
import SpectatorNotifications from './tms/pages/SpectatorNotifications.jsx';
import TournamentsList from './tms/pages/TournamentsList.jsx';
import TournamentDetail from './tms/pages/TournamentDetail.jsx';
import HorseRegistry from './tms/pages/HorseRegistry.jsx';
import HorseDetail from './tms/pages/HorseDetail.jsx';
import JockeysList from './tms/pages/JockeysList.jsx';
import JockeyProfile from './tms/pages/JockeyProfile.jsx';
import BettingHistory from './tms/pages/BettingHistory.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminLayout from './admin/Layout.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import TournamentPage from './pages/TournamentPage.jsx';
import RacesPage from './pages/RacesPage.jsx';
import JockeysPage from './pages/JockeysPage.jsx';
import RefereePage from './pages/RefereePage.jsx';
import RegistrationsPage from './pages/RegistrationsPage.jsx';
import RaceResultPage from './pages/RaceResultPage.jsx';
import PredictionsPage from './pages/PredictionsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';

import SpectatorMockupTest from './screenshots/SpectatorMockupTest.jsx';

// Leader's pages (Heritage Racing design — exact replica of leader's codebase)
import LeaderHomepage from './tms/pages/leader/Homepage.jsx';
import LeaderTournament from './tms/pages/leader/Tournament.jsx';
import LeaderMyHorses from './tms/pages/leader/MyHorses.jsx';
import LeaderHireJockey from './tms/pages/leader/HireJockey.jsx';
import LeaderHorseOwnerHome from './tms/pages/leader/HorseOwnerHome.jsx';
import LeaderJockeyHome from './tms/pages/leader/JockeyHome.jsx';
import LeaderAdminHome from './tms/pages/leader/AdminHome.jsx';

function RequireAuth({ children }) {
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* ── Leader's Heritage Racing pages (replicas of leader's codebase) ── */}
      <Route path="/" element={<LeaderHomepage />} />
      <Route path="/Homepage" element={<LeaderHomepage />} />
      <Route path="/homepage" element={<LeaderHomepage />} />
      <Route path="/HorseOwnerHome" element={<LeaderHorseOwnerHome />} />
      <Route path="/horseownerhome" element={<LeaderHorseOwnerHome />} />
      <Route path="/HorseOwner/Profile" element={<LeaderHorseOwnerHome />} />
      <Route path="/HorseOwner/MyHorses" element={<LeaderMyHorses />} />
      <Route path="/HorseOwner/Tournaments" element={<LeaderTournament />} />
      <Route path="/HorseOwner/MyTournament" element={<LeaderTournament />} />
      <Route path="/HorseOwner/HireJockeys" element={<LeaderHireJockey />} />
      <Route path="/Jockey/Home" element={<LeaderJockeyHome />} />
      <Route path="/admin" element={<LeaderAdminHome />} />

      {/* ── Legacy landing fallback (also keeps our local spectator auth modal) ── */}
      <Route path="/legacy" element={<LandingPage />} />

      {/* ── Admin (green sidebar layout) ── */}
      <Route path="/admin-tms" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="tournament" element={<TournamentPage />} />
        <Route path="races" element={<RacesPage />} />
        <Route path="jockeys" element={<JockeysPage />} />
        <Route path="referees" element={<RefereePage />} />
        <Route path="registrations" element={<RegistrationsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="results" element={<RaceResultPage />} />
        <Route path="predictions" element={<PredictionsPage />} />
      </Route>

      {/* ── Spectator public pages (Heritage Racing design) ── */}
      <Route path="/spectator/home" element={<SpectatorHome />} />
      <Route path="/spectator/tournaments" element={<TournamentsList />} />
      <Route path="/spectator/tournaments/:raceId" element={<TournamentDetail />} />
      <Route path="/spectator/horses" element={<HorseRegistry />} />
      <Route path="/spectator/horses/:horseId" element={<HorseDetail />} />
      <Route path="/spectator/jockeys" element={<JockeysList />} />
      <Route path="/spectator/jockeys/:jockeyId" element={<JockeyProfile />} />
      <Route path="/spectator/bets" element={<BettingHistory />} />
      <Route path="/spectator/live" element={<LiveRaces />} />
      <Route path="/spectator/notifications" element={<SpectatorNotifications />} />
      <Route path="/spectator/profile" element={<SpectatorProfile />} />

      {/* ── Legacy TMS role pages (AppShell layout) ── */}
      <Route path="/host" element={<RequireAuth><HostHome /></RequireAuth>} />
      <Route path="/owner" element={<RequireAuth><OwnerDashboard /></RequireAuth>} />
      <Route path="/jockey" element={<RequireAuth><JockeyDashboard /></RequireAuth>} />
      <Route path="/referee" element={<RequireAuth><RefereeDashboard /></RequireAuth>} />
      <Route path="/spectator" element={<RequireAuth><SpectatorDashboard /></RequireAuth>} />
      <Route path="/spectator/legacy/bets" element={<RequireAuth><SpectatorBets /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />

      {/* ── Legacy TMS Dashboard ── */}
      <Route path="/app" element={<Dashboard />} />

      {/* ── Catch-all ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
      {/* ── Mockup Test Page ── */}
      <Route path="/test/mockup" element={<SpectatorMockupTest />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
