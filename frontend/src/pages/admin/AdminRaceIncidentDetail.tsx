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
  raceId?: number;
  tournamentName: string;
  raceName: string;
  date?: string;
  time?: string;
  refereeName?: string;
  incidents: RaceIncidentEntry[];
  reportSubmitted?: boolean;
  reportConfirmed?: boolean;
  resultsPublished?: boolean;
};

type Props = {
  data?: RaceIncidentDetailData | null;
  loading?: boolean;
  error?: string;
  onConfirmReport?: () => Promise<void>;
  onPublishResults?: () => Promise<void>;
};

const routeLabel = (value: string | undefined, fallback: string) => {
  if (!value) return fallback;
  return decodeURIComponent(value).replace(/[-_]+/g, ' ').trim() || fallback;
};

export default function AdminRaceIncidentDetail({ data, loading = false, error, onConfirmReport, onPublishResults }: Props) {
  const { name, racename } = useParams();
  const tournamentName = data?.tournamentName || routeLabel(name, 'Tournament');
  const raceName = data?.raceName || routeLabel(racename, 'Race');
  const incidents = data?.incidents ?? [];
  const [confirmed, setConfirmed] = React.useState(Boolean(data?.reportConfirmed));
  const [resultsPublished, setResultsPublished] = React.useState(Boolean(data?.resultsPublished));
  const [actionError, setActionError] = React.useState('');
  const [confirming, setConfirming] = React.useState(false);

  React.useEffect(() => setConfirmed(Boolean(data?.reportConfirmed)), [data?.reportConfirmed]);
  React.useEffect(() => setResultsPublished(Boolean(data?.resultsPublished)), [data?.resultsPublished]);

  const confirmReport = async () => {
    if (!onConfirmReport) return;
    setConfirming(true);
    setActionError('');
    try {
      await onConfirmReport();
      setConfirmed(true);
    } catch (confirmError) {
      setActionError(confirmError instanceof Error ? confirmError.message : 'Unable to confirm race report.');
    } finally {
      setConfirming(false);
    }
  };

  const publishResults = async () => {
    if (!onPublishResults) return;
    setConfirming(true);
    setActionError('');
    try {
      await onPublishResults();
      setResultsPublished(true);
    } catch (publishError) {
      setActionError(publishError instanceof Error ? publishError.message : 'Unable to publish race results.');
    } finally {
      setConfirming(false);
    }
  };

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
          <div className="admin-incident-detail__actions">
            {confirmed ? (
              resultsPublished ? <strong>Results published</strong> : (
                <button type="button" onClick={() => void publishResults()} disabled={confirming}>
                  {confirming ? 'Publishing...' : 'Publish Results'}
                </button>
              )
            ) : data?.reportSubmitted ? (
              <button type="button" onClick={() => void confirmReport()} disabled={confirming}>
                {confirming ? 'Confirming...' : 'Confirm report'}
              </button>
            ) : (
              <span>Awaiting referee submission</span>
            )}
            {actionError ? <p role="alert">{actionError}</p> : null}
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
