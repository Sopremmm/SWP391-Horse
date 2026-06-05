import React from 'react';
import './WelcomeSection.css';

/**
 * WelcomeSection Component
 * Displays welcome message, badge, and introductory content
 */
export const WelcomeSection: React.FC = () => {
  const username = localStorage.getItem('username') || 'there';

  return (
    <section className="welcome-section">
      <div className="welcome-badge">Owner Dashboard</div>
      <h1 className="welcome-title">Welcome back, {username}.</h1>

      <p className="welcome-copy">
        Your stable is currently at peak performance. Three of your thoroughbreds are
        registered for upcoming stakes, and the training reports show exceptional progress.
      </p>
    </section>
  );
};

