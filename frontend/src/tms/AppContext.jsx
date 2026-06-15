import React, { createContext, useContext, useState } from "react";
import { TOURNAMENT_SEED } from "./tournament.js";
import { RACES_SEED } from "./races.js";
import { USERS } from "./users.js";
import { NOTIFICATIONS_SEED } from "./notifications.js";
import { getOddsForHorse } from "./data.js";

const AppContext = createContext(null);

// Spectator bet storage (mock — persists in memory only)
const INITIAL_BETS = [];

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("home");
  const [tournament, setTournament] = useState(TOURNAMENT_SEED);
  const [races, setRaces] = useState(RACES_SEED);
  const [profiles, setProfiles] = useState(
    () => Object.fromEntries(USERS.map((u) => [u.id, { ...u }]))
  );
  const [notifications, setNotifications] = useState(NOTIFICATIONS_SEED);
  const [bets, setBets] = useState(INITIAL_BETS);

  const login = (userId) => {
    const found = profiles[userId];
    if (!found) return;
    setUser(found);
    setScreen("dashboard");
  };

  const logout = () => {
    setUser(null);
    setScreen("home");
  };

  const goProfile = () => setScreen("profile");
  const goDashboard = () => setScreen("dashboard");

  const updateProfile = (userId, patch) => {
    setProfiles((prev) => {
      const next = { ...prev[userId], ...patch };
      return { ...prev, [userId]: next };
    });
    setUser((prev) => (prev?.id === userId ? { ...prev, ...patch } : prev));
  };

  const markRead = (id) =>
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllRead = () =>
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));

  const getNotifications = (userObj) => {
    if (!userObj) return [];
    return notifications
      .filter(
        (n) =>
          n.forRoles.includes(userObj.role) &&
          (!n.forUserId || n.forUserId === userObj.id)
      )
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  };

  const unreadCount = (userObj) => getNotifications(userObj).filter((n) => !n.read).length;

  // Spectator Bet actions
  const placeBet = ({ raceId, horseName, jockeyName, amount }) => {
    if (!user) return null;
    const odds = getOddsForHorse(horseName);
    const payout = Math.round(amount * odds * 100) / 100;
    const bet = {
      id: "BET" + Date.now() + Math.random().toString(36).slice(2, 6).toUpperCase(),
      userId: user.id,
      raceId,
      horseName,
      jockeyName,
      amount: Number(amount),
      odds,
      payout,
      placedAt: new Date().toISOString(),
      status: "Pending",
    };
    setBets((prev) => [bet, ...prev]);
    return bet;
  };

  const getMyBets = (userId) => {
    if (!userId) return [];
    return bets
      .filter((b) => b.userId === userId)
      .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
  };

  return (
    <AppContext.Provider
      value={{
        user,
        screen,
        tournament,
        setTournament,
        races,
        setRaces,
        profiles,
        users: Object.values(profiles),
        notifications,
        setNotifications,
        login,
        logout,
        goProfile,
        goDashboard,
        updateProfile,
        markRead,
        markAllRead,
        getNotifications,
        unreadCount,
        bets,
        placeBet,
        getMyBets,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
