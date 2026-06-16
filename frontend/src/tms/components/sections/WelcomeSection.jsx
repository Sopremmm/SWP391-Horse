import React from 'react';
import './WelcomeSection.css';

export const WelcomeSection = () => {
  const username =
    (typeof window !== 'undefined' &&
      (window.localStorage.getItem('username') || window.localStorage.getItem('fullName'))) ||
    'there';

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

export default WelcomeSection;
