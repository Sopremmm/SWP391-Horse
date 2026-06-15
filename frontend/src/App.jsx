import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './tms/AppContext.jsx';
import LandingPage from './tms/pages/LandingPage.jsx';
import HostHome from './tms/pages/HostHome.jsx';
import OwnerDashboard from './tms/pages/OwnerDashboard.jsx';
import JockeyDashboard from './tms/pages/JockeyDashboard.jsx';
import RefereeDashboard from './tms/pages/RefereeDashboard.jsx';
import SpectatorDashboard from './tms/pages/SpectatorDashboard.jsx';
import SpectatorBets from './tms/pages/SpectatorBets.jsx';
import ProfilePage from './tms/pages/ProfilePage.jsx';
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

function RequireAuth({ children }) {
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* ── Public landing ── */}
      <Route path="/" element={<LandingPage />} />

      {/* ── Admin (green sidebar layout) ── */}
      <Route path="/admin" element={<AdminLayout />}>
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

      {/* ── TMS role pages (AppShell layout) ── */}
      <Route path="/host" element={<RequireAuth><HostHome /></RequireAuth>} />
      <Route path="/owner" element={<RequireAuth><OwnerDashboard /></RequireAuth>} />
      <Route path="/jockey" element={<RequireAuth><JockeyDashboard /></RequireAuth>} />
      <Route path="/referee" element={<RequireAuth><RefereeDashboard /></RequireAuth>} />
      <Route path="/spectator" element={<RequireAuth><SpectatorDashboard /></RequireAuth>} />
      <Route path="/spectator/bets" element={<RequireAuth><SpectatorBets /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />

      {/* ── Legacy TMS Dashboard ── */}
      <Route path="/app" element={<Dashboard />} />

      {/* ── Catch-all ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
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
