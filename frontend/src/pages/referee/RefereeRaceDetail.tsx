import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RefereeShell } from '../../components/referee/index.ts';
import './RefereeRaceDetail.css';

export type Participant = {
  entryId?: number;
  gate: string;
  horse: string;
  breed: string;
  jockey: string;
  checkedIn?: boolean;
  attendanceTouched?: boolean;
  finishTime?: string;
  rank?: string;
};

export type IncidentLog = {
  id: number;
  horse: string;
  type: string;
  details: string;
  timestamp: string;
  severity: 'Low' | 'Medium' | 'High';
};

export type RefereeRaceDetailData = {
  raceId?: number;
  raceName?: string;
  imageUrl?: string;
  date?: string;
  time?: string;
  distance?: string;
  location?: string;
  participants?: Participant[];
  incidents?: IncidentLog[];
};

const violationTypes = ['Interference', 'Whip Violation', 'False Start', 'Track Limits', 'Unsafe Riding', 'Equipment Issue'];
const severityOptions: IncidentLog['severity'][] = ['Low', 'Medium', 'High'];

const titleCaseFromParam = (value?: string, fallback = 'Race') => {
  if (!value) return fallback;
  const decoded = decodeURIComponent(value).replace(/[-_]+/g, ' ').trim();
  if (!decoded) return fallback;
  return decoded
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const CalendarIcon = () => (
  <svg width="20" height="22" viewBox="0 0 20 22" fill="none" aria-hidden="true">
    <path d="M2 22C1.45 22 0.98 21.8 0.59 21.41C0.2 21.02 0 20.55 0 20V4C0 3.45 0.2 2.98 0.59 2.59C0.98 2.2 1.45 2 2 2H3V0H5V2H15V0H17V2H18C18.55 2 19.02 2.2 19.41 2.59C19.8 2.98 20 3.45 20 4V20C20 20.55 19.8 21.02 19.41 21.41C19.02 21.8 18.55 22 18 22H2ZM2 20H18V9H2V20ZM2 7H18V4H2V7Z" fill="currentColor" />
  </svg>
);

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="M14.2 15.6L10 11.4V5H12V10.6L15.6 14.2L14.2 15.6ZM11 22C9.48 22 8.05 21.71 6.71 21.13C5.38 20.56 4.22 19.78 3.23 18.77C2.22 17.78 1.44 16.62 0.87 15.29C0.29 13.95 0 12.52 0 11C0 9.48 0.29 8.05 0.87 6.71C1.44 5.38 2.22 4.22 3.23 3.23C4.22 2.22 5.38 1.44 6.71 0.87C8.05 0.29 9.48 0 11 0C12.52 0 13.95 0.29 15.29 0.87C16.62 1.44 17.78 2.22 18.77 3.23C19.78 4.22 20.56 5.38 21.13 6.71C21.71 8.05 22 9.48 22 11C22 12.52 21.71 13.95 21.13 15.29C20.56 16.62 19.78 17.78 18.77 18.77C17.78 19.78 16.62 20.56 15.29 21.13C13.95 21.71 12.52 22 11 22Z" fill="currentColor" />
  </svg>
);

const RulerIcon = () => (
  <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
    <path d="M2 16C1.45 16 0.98 15.8 0.59 15.41C0.2 15.02 0 14.55 0 14V2C0 1.45 0.2 0.98 0.59 0.59C0.98 0.2 1.45 0 2 0H20C20.55 0 21.02 0.2 21.41 0.59C21.8 0.98 22 1.45 22 2V14C22 14.55 21.8 15.02 21.41 15.41C21.02 15.8 20.55 16 20 16H2ZM2 14H20V2H17V7H15V2H13V7H11V2H9V7H7V2H5V7H3V2H2V14Z" fill="currentColor" />
  </svg>
);

const LocationIcon = () => (
  <svg width="18" height="22" viewBox="0 0 18 22" fill="none" aria-hidden="true">
    <path d="M9 11C9.55 11 10.02 10.8 10.41 10.41C10.8 10.02 11 9.55 11 9C11 8.45 10.8 7.98 10.41 7.59C10.02 7.2 9.55 7 9 7C8.45 7 7.98 7.2 7.59 7.59C7.2 7.98 7 8.45 7 9C7 9.55 7.2 10.02 7.59 10.41C7.98 10.8 8.45 11 9 11ZM9 22C6.58 19.93 4.44 17.64 2.58 15.13C0.86 12.79 0 10.75 0 9C0 6.25 0.88 4.06 2.64 2.43C4.41 0.81 6.53 0 9 0C11.47 0 13.59 0.81 15.36 2.43C17.12 4.06 18 6.25 18 9C18 10.75 17.14 12.79 15.42 15.13C13.56 17.64 11.42 19.93 9 22Z" fill="currentColor" />
  </svg>
);

const SaveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M18 4V16C18 16.55 17.8 17.02 17.41 17.41C17.02 17.8 16.55 18 16 18H2C1.45 18 0.98 17.8 0.59 17.41C0.2 17.02 0 16.55 0 16V2C0 1.45 0.2 0.98 0.59 0.59C0.98 0.2 1.45 0 2 0H14L18 4ZM16 4.85L13.15 2H2V16H16V4.85ZM9 15C9.83 15 10.54 14.71 11.12 14.12C11.71 13.54 12 12.83 12 12C12 11.17 11.71 10.46 11.12 9.88C10.54 9.29 9.83 9 9 9C8.17 9 7.46 9.29 6.88 9.88C6.29 10.46 6 11.17 6 12C6 12.83 6.29 13.54 6.88 14.12C7.46 14.71 8.17 15 9 15ZM3 7H12V3H3V7Z" fill="currentColor" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M7 9H1V7H7V1H9V7H15V9H9V15H7V9Z" fill="currentColor" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 14H3.43L11.5 5.93L10.07 4.5L2 12.57V14ZM0 16V11.75L11.5 0.27C11.7 0.09 11.92 0 12.17 0C12.42 0 12.64 0.09 12.83 0.27L15.73 3.17C15.91 3.36 16 3.58 16 3.83C16 4.08 15.91 4.3 15.73 4.5L4.25 16H0Z" fill="currentColor" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 16C2.45 16 1.98 15.8 1.59 15.41C1.2 15.02 1 14.55 1 14V3H0V1H5V0H11V1H16V3H15V14C15 14.55 14.8 15.02 14.41 15.41C14.02 15.8 13.55 16 13 16H3ZM5 12H7V5H5V12ZM9 12H11V5H9V12Z" fill="currentColor" />
  </svg>
);

const GearIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M8.95 20L8.55 16.8C8.33 16.72 8.13 16.62 7.95 16.5C7.76 16.38 7.58 16.26 7.4 16.12L4.42 17.37L1.67 12.62L4.25 10.67C4.23 10.55 4.22 10.44 4.22 10.34V9.66C4.22 9.56 4.23 9.45 4.25 9.33L1.67 7.38L4.42 2.63L7.4 3.88C7.58 3.74 7.77 3.62 7.96 3.5C8.16 3.38 8.35 3.28 8.55 3.2L8.95 0H14.45L14.85 3.2C15.07 3.28 15.27 3.38 15.45 3.5C15.64 3.62 15.82 3.74 16 3.88L18.98 2.63L21.73 7.38L19.15 9.33C19.17 9.45 19.18 9.56 19.18 9.66V10.34C19.18 10.44 19.16 10.55 19.13 10.67L21.7 12.62L18.95 17.37L16 16.12C15.82 16.26 15.63 16.38 15.43 16.5C15.23 16.62 15.03 16.72 14.85 16.8L14.45 20H8.95ZM11.7 13.5C12.67 13.5 13.49 13.16 14.17 12.47C14.86 11.79 15.2 10.97 15.2 10C15.2 9.03 14.86 8.21 14.17 7.53C13.49 6.84 12.67 6.5 11.7 6.5C10.72 6.5 9.89 6.84 9.22 7.53C8.54 8.21 8.2 9.03 8.2 10C8.2 10.97 8.54 11.79 9.22 12.47C9.89 13.16 10.72 13.5 11.7 13.5Z" fill="currentColor" />
  </svg>
);

const rankOptions = ['-', '1', '2', '3', '4', '5', '6', '7', '8'];

type RefereeRaceDetailProps = {
  data?: RefereeRaceDetailData | null;
  loading?: boolean;
  error?: string;
  onSubmit?: (participants: Participant[]) => Promise<void>;
  onSaveParticipants?: (participants: Participant[]) => Promise<void>;
  onRecordIncident?: (entryId: number, message: string) => Promise<void>;
};

export const RefereeRaceDetail: React.FC<RefereeRaceDetailProps> = ({
  data,
  loading = false,
  error,
  onSubmit,
  onSaveParticipants,
  onRecordIncident,
}) => {
  const { name } = useParams();
  const raceName = data?.raceName || titleCaseFromParam(name);
  const participants = data?.participants ?? [];
  const [incidents, setIncidents] = useState<IncidentLog[]>(data?.incidents ?? []);
  const [participantRows, setParticipantRows] = useState<Participant[]>(data?.participants ?? []);
  const [isViolationOpen, setIsViolationOpen] = useState(false);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [editingIncidentId, setEditingIncidentId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [draftHorse, setDraftHorse] = useState(participants[0]?.horse ?? '');
  const [draftType, setDraftType] = useState(violationTypes[0]);
  const [draftTime, setDraftTime] = useState('14:10:00 GMT');
  const [draftSeverity, setDraftSeverity] = useState<IncidentLog['severity']>('Low');
  const [draftDetails, setDraftDetails] = useState('');

  React.useEffect(() => setIncidents(data?.incidents ?? []), [data?.incidents]);
  React.useEffect(() => setParticipantRows(data?.participants ?? []), [data?.participants]);

  const canSubmit = Boolean(draftHorse.trim() && draftType.trim() && draftTime.trim() && draftDetails.trim());

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(''), 2600);
  };

  const closeViolationModal = () => {
    setIsViolationOpen(false);
    setEditingIncidentId(null);
  };

  const openViolation = (horseName?: string) => {
    setEditingIncidentId(null);
    setDraftHorse(horseName || participants[0]?.horse || '');
    setDraftType(violationTypes[0]);
    setDraftTime('14:10:00 GMT');
    setDraftSeverity('Low');
    setDraftDetails('');
    setIsViolationOpen(true);
  };

  const openEditViolation = (incident: IncidentLog) => {
    setEditingIncidentId(incident.id);
    setDraftHorse(incident.horse);
    setDraftType(incident.type);
    setDraftTime(incident.timestamp);
    setDraftSeverity(incident.severity);
    setDraftDetails(incident.details);
    setIsViolationOpen(true);
  };

  const deleteViolation = (incidentId: number) => {
    setIncidents((current) => current.filter((incident) => incident.id !== incidentId));
    showToast('Violation deleted successfully.');
  };

  const updateParticipant = (entryId: number | undefined, changes: Partial<Participant>) => {
    if (!entryId) return;
    setParticipantRows((current) => current.map((participant) => (
      participant.entryId === entryId ? { ...participant, ...changes } : participant
    )));
  };

  const saveRaceTable = async () => {
    try {
      await onSaveParticipants?.(participantRows);
      showToast('Race table saved successfully.');
    } catch (saveError) {
      showToast(saveError instanceof Error ? saveError.message : 'Unable to save race table.');
    }
  };

  const saveDraft = () => {
    showToast('Draft saved successfully.');
  };

  const confirmSubmitToAdmin = async () => {
    try {
      await onSubmit?.(participantRows);
      setIsSubmitConfirmOpen(false);
      showToast('Race report submitted to admin.');
    } catch (submitError) {
      showToast(submitError instanceof Error ? submitError.message : 'Unable to submit race report.');
    }
  };

  const addViolation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    if (editingIncidentId) {
      setIncidents((current) =>
        current.map((incident) =>
          incident.id === editingIncidentId
            ? {
                ...incident,
                horse: draftHorse,
                type: draftType,
                details: draftDetails,
                timestamp: draftTime,
                severity: draftSeverity,
              }
            : incident,
        ),
      );
      showToast('Violation updated successfully.');
    } else {
      const participant = participantRows.find((item) => item.horse === draftHorse);
      if (!participant?.entryId) {
        showToast('The selected horse is not a race participant.');
        return;
      }
      try {
        await onRecordIncident?.(
          participant.entryId,
          `${draftType} | ${draftSeverity} | ${draftTime} | ${draftDetails}`,
        );
      } catch (incidentError) {
        showToast(incidentError instanceof Error ? incidentError.message : 'Unable to save incident.');
        return;
      }
      setIncidents((current) => [
        ...current,
        {
          id: Date.now(),
          horse: draftHorse,
          type: draftType,
          details: draftDetails,
          timestamp: draftTime,
          severity: draftSeverity,
        },
      ]);
      showToast('Violation added successfully.');
    }
    closeViolationModal();
  };

  const heroMeta = useMemo(
    () => [
      data?.date ? { icon: <CalendarIcon />, label: data.date } : null,
      data?.time ? { icon: <ClockIcon />, label: data.time } : null,
      data?.distance ? { icon: <RulerIcon />, label: data.distance } : null,
      data?.location ? { icon: <LocationIcon />, label: data.location } : null,
    ].filter((item): item is { icon: React.ReactNode; label: string } => Boolean(item)),
    [data?.date, data?.time, data?.distance, data?.location],
  );

  return (
    <RefereeShell>
      <section className="referee-race-detail">
        <section className="referee-race-hero-card" aria-label={`${raceName} race card`}>
          {data?.imageUrl ? <img src={data.imageUrl} alt="Race track banner" /> : null}
          <div className="referee-race-hero-card__content">
            <span>Official Race Card</span>
            <h1>{raceName}</h1>
            <div className="referee-race-hero-card__meta">
              {heroMeta.map((item) => (
                <div key={item.label}>
                  {item.icon}
                  <strong>{item.label}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="referee-participants-card">
          <header>
            <h2>Race Participant Verification &amp; Results</h2>
            <div className="referee-participants-card__actions">
              <button type="button" onClick={saveRaceTable}>
                <SaveIcon />
                Save Table
              </button>
              <button type="button" onClick={() => setIsSubmitConfirmOpen(true)}>
                <GearIcon />
                Submit to Admin
              </button>
            </div>
          </header>

          <div className="referee-participants-table" role="table" aria-label="Race participant verification and results">
            <div className="referee-participants-row referee-participants-row--head" role="row">
              <span>Gate</span>
              <span>Horse Details</span>
              <span>Jockey</span>
              <span>Attendance</span>
              <span>Finish Time</span>
              <span>Rank</span>
              <span>Action</span>
            </div>
            {loading ? <div className="referee-race-empty">Loading race data...</div> : error ? <div className="referee-race-empty">{error}</div> : participantRows.length ? participantRows.map((participant) => (
              <div className="referee-participants-row" role="row" key={participant.entryId || participant.gate}>
                <strong className="referee-participants-gate">{participant.gate}</strong>
                <div className="referee-participants-horse">
                  <strong>{participant.horse}</strong>
                  <span>{participant.breed}</span>
                </div>
                <strong>{participant.jockey}</strong>
                <label className="referee-attendance-toggle" aria-label={`${participant.horse} attendance`}>
                  <input
                    type="checkbox"
                    checked={participant.checkedIn ?? false}
                    onChange={(event) => updateParticipant(participant.entryId, {
                      checkedIn: event.target.checked,
                      attendanceTouched: true,
                    })}
                  />
                  <span />
                </label>
                <input
                  className="referee-finish-input"
                  type="text"
                  value={participant.finishTime || ''}
                  onChange={(event) => updateParticipant(participant.entryId, { finishTime: event.target.value })}
                  aria-label={`${participant.horse} finish time`}
                  placeholder="mm:ss.mmm"
                />
                <select
                  className="referee-rank-select"
                  aria-label={`${participant.horse} rank`}
                  value={participant.rank || '-'}
                  onChange={(event) => updateParticipant(participant.entryId, { rank: event.target.value })}
                >
                  {rankOptions.map((rank) => (
                    <option key={rank} value={rank}>
                      {rank}
                    </option>
                  ))}
                </select>
                <button type="button" className="referee-violation-button" onClick={() => openViolation(participant.horse)}>
                  Violation
                </button>
              </div>
            )) : <div className="referee-race-empty">No participant data is available.</div>}
          </div>
        </section>

        <section className="referee-incidents-card">
          <header>
            <h2>Incident Logs</h2>
            <button type="button" onClick={() => openViolation()}>
              <PlusIcon />
              Add Incident
            </button>
          </header>
          <div className="referee-incidents-scroll">
            <div className="referee-incidents-table" role="table" aria-label="Incident logs">
              <div className="referee-incidents-row referee-incidents-row--head" role="row">
              <span>Horse Name</span>
              <span>Time</span>
              <span>Violation Type</span>
              <span>Severity</span>
              <span>Detail</span>
              <span>Action</span>
              </div>
            {incidents.length ? incidents.map((incident) => (
                <div className="referee-incidents-row" role="row" key={incident.id}>
                <strong>{incident.horse}</strong>
                <span>{incident.timestamp}</span>
                <span>{incident.type}</span>
                <span className={`referee-severity referee-severity--${incident.severity.toLowerCase()}`}>{incident.severity}</span>
                <span>{incident.details}</span>
                <div className="referee-incidents-actions">
                  <button type="button" aria-label={`Edit ${incident.horse} incident`} onClick={() => openEditViolation(incident)}>
                    <EditIcon />
                  </button>
                  <button type="button" aria-label={`Delete ${incident.horse} incident`} onClick={() => deleteViolation(incident.id)}>
                    <TrashIcon />
                  </button>
                </div>
                </div>
              )) : <div className="referee-race-empty">No incident data is available.</div>}
            </div>
          </div>
        </section>

        <div className="referee-race-actions">
          <button type="button" className="referee-race-actions__secondary" onClick={saveDraft}>
            <SaveIcon />
            Save Draft
          </button>
        </div>
      </section>

      {toastMessage && (
        <div className="referee-toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}

      {isViolationOpen && (
        <div className="referee-violation-modal" role="dialog" aria-modal="true" aria-labelledby="violation-title">
          <div className="referee-violation-modal__panel">
            <form onSubmit={addViolation}>
              <div className="referee-violation-modal__header">
                <div>
                  <span>Race Steward Entry</span>
                  <h2 id="violation-title">{editingIncidentId ? 'Edit Violation' : 'Create Violation'}</h2>
                </div>
                <button type="button" onClick={closeViolationModal} aria-label="Close violation popup">
                  x
                </button>
              </div>

              <label>
                <span>Horse</span>
                <select value={draftHorse} onChange={(event) => setDraftHorse(event.target.value)}>
                  {participants.map((participant) => (
                    <option key={participant.horse} value={participant.horse}>
                      Gate {participant.gate} - {participant.horse}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Violation Type</span>
                <select value={draftType} onChange={(event) => setDraftType(event.target.value)}>
                  {violationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Violation Time</span>
                <input value={draftTime} onChange={(event) => setDraftTime(event.target.value)} placeholder="14:10:00 GMT" />
              </label>

              <fieldset className="referee-severity-fieldset">
                <legend>Severity</legend>
                <div className="referee-severity-options">
                  {severityOptions.map((severity) => (
                    <label key={severity} className={`referee-severity-option referee-severity-option--${severity.toLowerCase()}`}>
                      <input
                        type="radio"
                        name="severity"
                        value={severity}
                        checked={draftSeverity === severity}
                        onChange={() => setDraftSeverity(severity)}
                      />
                      <span>{severity}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label>
                <span>Violation Details</span>
                <textarea
                  value={draftDetails}
                  onChange={(event) => setDraftDetails(event.target.value)}
                  placeholder="Describe what happened, where it occurred, and any immediate action taken."
                  rows={5}
                />
              </label>

              <div className="referee-violation-modal__actions">
                <button type="button" onClick={closeViolationModal}>
                  Cancel
                </button>
                <button type="submit" disabled={!canSubmit}>
                  {editingIncidentId ? 'Save Violation' : 'Add Violation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSubmitConfirmOpen && (
        <div className="referee-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="submit-admin-title">
          <div className="referee-confirm-modal__panel">
            <span>Final Approval</span>
            <h2 id="submit-admin-title">Submit Race Report?</h2>
            <p>
              This will send the current participant results and {incidents.length} incident log
              {incidents.length === 1 ? '' : 's'} to admin for final review.
            </p>
            <div className="referee-confirm-modal__summary">
              <strong>{raceName}</strong>
              <span>{participants.length} participants verified</span>
            </div>
            <div className="referee-confirm-modal__actions">
              <button type="button" onClick={() => setIsSubmitConfirmOpen(false)}>
                Cancel
              </button>
              <button type="button" onClick={confirmSubmitToAdmin}>
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </RefereeShell>
  );
};

export default RefereeRaceDetail;
