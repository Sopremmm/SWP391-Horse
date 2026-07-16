import React from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.tsx';
import './AdminRaceIncidentDetail.css';

export type RaceIncidentSeverity = 'low' | 'medium' | 'high';

export type RaceIncidentEntry = {
  id: string | number;
  horseName: string;
  time: string;
  violationType: string;
  severity: RaceIncidentSeverity;
  detail: string;
};

export type RaceIncidentDetailData = {
  tournamentName: string;
  raceName: string;
  date?: string;
  time?: string;
  refereeName?: string;
  incidents: RaceIncidentEntry[];
};

type Props = {
  data?: RaceIncidentDetailData | null;
  loading?: boolean;
  error?: string;
};

const routeLabel = (value: string | undefined, fallback: string) => {
  if (!value) return fallback;
  return decodeURIComponent(value).replace(/[-_]+/g, ' ').trim() || fallback;
};

export default function AdminRaceIncidentDetail({ data, loading = false, error }: Props) {
  const { name, racename } = useParams();
  const tournamentName = data?.tournamentName || routeLabel(name, 'Tournament');
  const raceName = data?.raceName || routeLabel(racename, 'Race');
  const incidents = data?.incidents ?? [];

  return (
    <AdminLayout
      active="settings"
      breadcrumb={[
        { label: 'Race Incidents', to: '/Admin/RaceIncidentsLog' },
        { label: tournamentName, to: `/Admin/ManageTournaments/${encodeURIComponent(tournamentName)}` },
        { label: raceName },
      ]}
    >
      <section className="admin-incident-detail" aria-busy={loading}>
        <header className="admin-incident-detail__intro">
          <h1>{raceName}</h1>
          <Link to={`/Admin/ManageTournaments/${encodeURIComponent(tournamentName)}`}>{tournamentName}</Link>
          <div className="admin-incident-detail__meta" aria-label="Race information">
            {data?.date ? <span>Date: {data.date}</span> : null}
            {data?.time ? <span>Time: {data.time}</span> : null}
            {data?.refereeName ? <span>Referee: {data.refereeName}</span> : null}
          </div>
        </header>

        <section className="admin-incident-detail__card" aria-labelledby="incident-detail-heading">
          <h2 id="incident-detail-heading">Incident Logs</h2>
          <div className="admin-incident-detail__scroll">
            <div className="admin-incident-detail__table" role="table" aria-label={`${raceName} incident logs`}>
              <div className="admin-incident-detail__row admin-incident-detail__row--head" role="row">
                <span>Horse Name</span>
                <span>Time</span>
                <span>Violation Type</span>
                <span>Severity</span>
                <span>Detail</span>
              </div>

              {loading ? (
                <div className="admin-incident-detail__state" role="status">Loading incident logs...</div>
              ) : error ? (
                <div className="admin-incident-detail__state admin-incident-detail__state--error" role="alert">{error}</div>
              ) : incidents.length ? (
                incidents.map((incident) => (
                  <div className="admin-incident-detail__row" role="row" key={incident.id}>
                    <strong>{incident.horseName}</strong>
                    <span>{incident.time}</span>
                    <span>{incident.violationType}</span>
                    <span><b className={`admin-incident-detail__severity admin-incident-detail__severity--${incident.severity}`}>{incident.severity}</b></span>
                    <span className="admin-incident-detail__description">{incident.detail}</span>
                  </div>
                ))
              ) : (
                <div className="admin-incident-detail__state">No incident logs are available for this race.</div>
              )}
            </div>
          </div>
        </section>
      </section>
    </AdminLayout>
  );
}
