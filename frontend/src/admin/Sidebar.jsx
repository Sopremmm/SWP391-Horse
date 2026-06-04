import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { EMERALD } from '../utils/constants';

const navItems = [
  { path: '/admin',              label: 'Dashboard',       icon: 'dashboard' },
  { path: '/admin/tournament',  label: 'Tournament',     icon: 'trophy' },
  { path: '/admin/races',        label: 'Races',         icon: 'run' },
  { path: '/admin/jockeys',      label: 'Jockey Invite', icon: 'user' },
  { path: '/admin/referees',      label: 'Referee',       icon: 'shield-check' },
  { path: '/admin/registrations', label: 'Registrations',  icon: 'clipboard-check' },
  { path: '/admin/users',         label: 'Users',          icon: 'users' },
  { path: '/admin/results',       label: 'Race Results',   icon: 'certificate' },
  { path: '/admin/predictions',   label: 'Predictions',    icon: 'chart-line' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  const activeBg    = EMERALD;
  const activeColor = '#fff';
  const inactiveBg    = 'transparent';
  const inactiveColor = 'rgba(255,255,255,0.6)';
  const hoverBg = 'rgba(255,255,255,0.15)';

  return (
    <aside style={{
      width: collapsed ? 68 : 248,
      background: EMERALD,
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 200,
      transition: 'width .2s',
      overflow: 'hidden',
      boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 16px',
        height: 56,
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        flexShrink: 0,
      }}>
        <div style={{
          width: 34, height: 34,
          background: '#fff', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <i className="ti ti-trophy" style={{ fontSize: 18, color: EMERALD }} aria-hidden />
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.03em', color: '#fff', fontFamily: "'Georgia',serif" }}>
              RACING TMS
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em' }}>
              ADMIN PANEL
            </div>
          </div>
        )}
      </div>

      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div key={item.path} style={{ marginBottom: 2 }}>
              <NavLink
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: collapsed ? '9px 0' : '9px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 8,
                  background: isActive ? activeBg : inactiveBg,
                  color: isActive ? activeColor : inactiveColor,
                  textDecoration: 'none',
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all .15s',
                  borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = inactiveBg; e.currentTarget.style.color = inactiveColor; }}
              >
                <i className={`ti ti-${item.icon}`} style={{ fontSize: 16, flexShrink: 0 }} aria-hidden />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </div>
          );
        })}
      </nav>

      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
        <button
          onClick={onToggle}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '9px 0' : '9px 12px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            width: '100%', background: 'transparent', border: 'none',
            borderRadius: 8, cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
            fontSize: 12, fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
        >
          <i className="ti ti-arrows-left-right" style={{ fontSize: 16, flexShrink: 0 }} aria-hidden />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
