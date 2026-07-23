import React from 'react';
import RefereeHeader from './RefereeHeader.tsx';
import RefereeSidebar from './RefereeSidebar.tsx';
import './RefereeLayout.css';

type RefereeShellProps = {
  children: React.ReactNode;
};

export const RefereeShell: React.FC<RefereeShellProps> = ({ children }) => {
  return (
    <div className="referee-shell">
      <div className="referee-layout">
        <RefereeSidebar />
        <div className="referee-main-wrap">
          <RefereeHeader />
          <main className="referee-page">{children}</main>
          <footer className="referee-footer">
            <span>(c) 2024 Heritage Racing Management. All Rights Reserved. Confidential Official Access.</span>
            <nav aria-label="Referee footer links">
              <a href="#support">Support</a>
              <a href="#privacy-policy">Privacy Policy</a>
              <a href="#referee-handbook">Referee Handbook</a>
            </nav>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default RefereeShell;
