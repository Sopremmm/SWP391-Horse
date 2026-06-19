/**
 * Spectator Screen Mockup Test Page
 * 
 * This page provides a visual overview of all Spectator screens
 * with direct links to navigate to each screen.
 * 
 * Screens are organized by flow:
 * - Public (unauthenticated)
 * - Dashboard (authenticated)
 * - Content Discovery
 * - Betting
 * - Profile & Settings
 */

import { Link } from 'react-router-dom';

const SCREEN_CATEGORIES = [
  {
    title: 'Public Screens',
    description: 'Screens accessible without authentication',
    screens: [
      {
        name: 'Spectator Home',
        path: '/spectator/home',
        description: 'Landing page with featured races, top jockeys, and latest results',
        component: 'SpectatorHome.jsx',
      },
    ],
  },
  {
    title: 'Content Discovery',
    description: 'Browse and discover races, horses, and jockeys',
    screens: [
      {
        name: 'Tournaments List',
        path: '/spectator/tournaments',
        description: 'List of all available tournaments with filtering',
        component: 'TournamentsList.jsx',
      },
      {
        name: 'Tournament Detail',
        path: '/spectator/tournaments/derby-invitational',
        description: 'Detailed view of a specific tournament with betting options',
        component: 'TournamentDetail.jsx',
      },
      {
        name: 'Horse Registry',
        path: '/spectator/horses',
        description: 'Browse all registered horses',
        component: 'HorseRegistry.jsx',
      },
      {
        name: 'Horse Detail',
        path: '/spectator/horses/horse-1',
        description: 'Individual horse profile with stats and betting',
        component: 'HorseDetail.jsx',
      },
      {
        name: 'Jockeys List',
        path: '/spectator/jockeys',
        description: 'Directory of all jockeys with stats',
        component: 'JockeysList.jsx',
      },
      {
        name: 'Jockey Profile',
        path: '/spectator/jockeys/U003',
        description: 'Individual jockey profile with performance history',
        component: 'JockeyProfile.jsx',
      },
      {
        name: 'Live Racing',
        path: '/spectator/live',
        description: 'Real-time race tracking with live commentary',
        component: 'LiveRaces.jsx',
      },
    ],
  },
  {
    title: 'Dashboard (Authenticated)',
    description: 'Screens requiring user login',
    screens: [
      {
        name: 'Spectator Dashboard',
        path: '/spectator',
        description: 'Main dashboard with races, predictions, and results tabs',
        component: 'SpectatorDashboard.jsx',
      },
      {
        name: 'Betting History',
        path: '/spectator/bets',
        description: 'Complete history of placed bets with filters',
        component: 'BettingHistory.jsx',
      },
      {
        name: 'Notifications',
        path: '/spectator/notifications',
        description: 'Notifications for bet results and race updates',
        component: 'SpectatorNotifications.jsx',
      },
      {
        name: 'Profile',
        path: '/spectator/profile',
        description: 'User profile with stats, activity, and settings',
        component: 'SpectatorProfile.jsx',
      },
    ],
  },
];

const NAVIGATION_FLOW = `
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SPECTATOR SCREEN FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

PUBLIC FLOWS (No Authentication Required)
══════════════════════════════════════════

    ┌──────────────────┐
    │  Spectator Home │
    │  /spectator/home│
    └────────┬─────────┘
             │
             ├──► Tournaments List ──────────► Tournament Detail ──────────► Bet
             │     /spectator/tournaments        /spectator/tournaments/:id
             │
             ├──► Horse Registry ────────────► Horse Detail ──────────────► Bet
             │     /spectator/horses               /spectator/horses/:id
             │
             ├──► Jockeys List ──────────────► Jockey Profile
             │     /spectator/jockeys              /spectator/jockeys/:id
             │
             └──► Live Racing
                  /spectator/live


AUTHENTICATED FLOWS (Login Required)
═════════════════════════════════════

    ┌────────────────────┐         ┌──────────────────┐
    │  Spectator Home   │ ──────► │  Login Modal     │
    │  /spectator/home  │         │  (Enter User ID) │
    └────────┬───────────┘         └────────┬─────────┘
             │                            │
             └──────────┬─────────────────┘
                        ▼
             ┌──────────────────────┐
             │  Spectator Dashboard │
             │  /spectator          │
             └────────┬─────────────┘
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │  Races   │ │Predictions│ │ Results  │
    │  (Tab)   │ │  (Tab)    │ │  (Tab)   │
    └────┬─────┘ └────┬─────┘ └──────────┘
         │            │
         │            └──► Betting History ─────────► Tournament Detail ──► Bet
         │                  /spectator/bets              (with betting)
         │
         └────────────────────────┬─────────────────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │Notifications│ │  Live   │ │ Profile │
              │/spec/notif│ │ Racing │ │/spec/prof│
              └──────────┘ └──────────┘ └────┬─────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │  Settings Tab   │
                                    │  (Edit Profile) │
                                    └─────────────────┘

LEGEND
═══════
──► = Navigation (clickable link)
┌───┐ = Screen/Page
└───┘
`;

export default function SpectatorMockupTest() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f7f6f1',
        fontFamily: 'Manrope, Inter, "Segoe UI", sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          background: '#002a15',
          color: '#fff',
          padding: 'clamp(32px, 5vw, 56px)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p
            style={{
              color: '#ffbd6b',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Heritage Racing — Spectator Module
          </p>
          <h1
            style={{
              fontFamily: '"EB Garamond", Georgia, serif',
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 500,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Screen Mockup Test
          </h1>
          <p
            style={{
              marginTop: 14,
              color: 'rgba(210,245,219,0.82)',
              fontSize: '1rem',
              lineHeight: 1.6,
              maxWidth: 640,
            }}
          >
            Visual overview of all Spectator screens with direct navigation links.
            Use this page to test the complete user flow.
          </p>
        </div>
      </header>

      {/* Navigation Flow Diagram */}
      <section
        style={{
          background: '#fff',
          padding: 'clamp(32px, 5vw, 56px)',
          borderBottom: '1px solid #d7d3c7',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: '"EB Garamond", Georgia, serif',
              fontSize: '1.6rem',
              fontWeight: 500,
              color: '#002a15',
              marginTop: 0,
              marginBottom: 24,
            }}
          >
            Navigation Flow
          </h2>
          <pre
            style={{
              background: '#1f231f',
              color: '#e5e7eb',
              padding: 24,
              borderRadius: 8,
              overflow: 'auto',
              fontSize: '0.75rem',
              lineHeight: 1.6,
            }}
          >
            {NAVIGATION_FLOW}
          </pre>
        </div>
      </section>

      {/* Screen Categories */}
      <main style={{ padding: 'clamp(32px, 5vw, 56px) 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {SCREEN_CATEGORIES.map((category, catIndex) => (
            <section
              key={category.title}
              style={{
                marginBottom: 48,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 16,
                  marginBottom: 8,
                }}
              >
                <h2
                  style={{
                    fontFamily: '"EB Garamond", Georgia, serif',
                    fontSize: '1.4rem',
                    fontWeight: 500,
                    color: '#002a15',
                    margin: 0,
                  }}
                >
                  {category.title}
                </h2>
                <span
                  style={{
                    color: '#747b75',
                    fontSize: '0.82rem',
                  }}
                >
                  {category.description}
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: 20,
                }}
              >
                {category.screens.map((screen, screenIndex) => (
                  <ScreenCard
                    key={screen.path}
                    screen={screen}
                    index={catIndex * 10 + screenIndex}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          background: '#002a15',
          color: '#fff',
          padding: '32px',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, color: 'rgba(210,245,219,0.6)', fontSize: '0.82rem' }}>
          Heritage Racing — Spectator Module Mockup Test Page
          <br />
          <span style={{ color: '#ffbd6b' }}>
            Screenshots directory: /src/screenshots/
          </span>
        </p>
      </footer>
    </div>
  );
}

function ScreenCard({ screen, index }) {
  return (
    <article
      style={{
        background: '#fff',
        border: '1px solid rgba(215,211,199,0.5)',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,42,21,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
      }}
    >
      {/* Card Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #002a15 0%, #004225 100%)',
          padding: '20px 24px',
        }}
      >
        <p
          style={{
            color: '#ffbd6b',
            fontSize: '0.66rem',
            fontWeight: 800,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            margin: 0,
            marginBottom: 4,
          }}
        >
          Screen {String(index + 1).padStart(2, '0')}
        </p>
        <h3
          style={{
            color: '#fff',
            fontSize: '1.1rem',
            fontWeight: 600,
            margin: 0,
            fontFamily: '"EB Garamond", Georgia, serif',
          }}
        >
          {screen.name}
        </h3>
      </div>

      {/* Card Body */}
      <div style={{ padding: 24 }}>
        <p
          style={{
            color: '#555e58',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            margin: 0,
            marginBottom: 16,
          }}
        >
          {screen.description}
        </p>

        <div
          style={{
            background: '#f7f6f1',
            padding: '12px 16px',
            borderRadius: 6,
            marginBottom: 20,
          }}
        >
          <p
            style={{
              color: '#747b75',
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: 0,
              marginBottom: 4,
            }}
          >
            Route
          </p>
          <code
            style={{
              color: '#002a15',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            {screen.path}
          </code>
        </div>

        <div
          style={{
            background: '#f7f6f1',
            padding: '12px 16px',
            borderRadius: 6,
            marginBottom: 20,
          }}
        >
          <p
            style={{
              color: '#747b75',
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: 0,
              marginBottom: 4,
            }}
          >
            Component
          </p>
          <code
            style={{
              color: '#002a15',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            {screen.component}
          </code>
        </div>

        <Link
          to={screen.path}
          style={{
            display: 'block',
            width: '100%',
            padding: '14px 24px',
            background: '#002a15',
            color: '#fff',
            textAlign: 'center',
            textDecoration: 'none',
            borderRadius: 4,
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#004225';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#002a15';
          }}
        >
          View Screen →
        </Link>
      </div>
    </article>
  );
}
