import React from 'react';
import { STATISTICS } from '../../constants/index.ts';
import './StatsSection.css';

/**
 * StatsSection Component - Statistics Display Section
 * Shows performance statistics and provides access to performance report generation
 */
export const StatsSection: React.FC = () => {
  return (
    <section className="stats-section">
      <div className="stats-background" />
      <div className="stats-content">
        <div className="stats-grid">
          <div className="stats-cards">
            {STATISTICS.map((stat, index) => (
              <div key={index} className="stats-card">
                <p className="stats-value">{stat.value}</p>
                <p className="stats-label">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="stats-action">
            <button className="stats-button">Generate Performance Report</button>
          </div>
        </div>
      </div>
    </section>
  );
};
