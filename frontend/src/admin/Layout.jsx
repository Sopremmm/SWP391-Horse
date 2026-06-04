import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { EMERALD } from '../utils/constants';
import Sidebar from './Sidebar';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Georgia','Times New Roman',serif", background: '#FAFAFA' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div style={{
        flex: 1,
        marginLeft: collapsed ? 68 : 248,
        transition: 'margin-left .2s',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}>
        <div style={{
          background: '#fff',
          borderBottom: '1px solid #E5E7EB',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>
            Racing TMS Admin
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: EMERALD,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff',
            }}>
              A
            </div>
            <span style={{ fontSize: 12, color: '#6B7280' }}>Admin</span>
          </div>
        </div>
        <main style={{ flex: 1, padding: '28px 24px', maxWidth: 1200 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
