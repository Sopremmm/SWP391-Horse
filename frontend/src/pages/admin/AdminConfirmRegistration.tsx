import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout.tsx';
import {
  approveTournamentEntry,
  fetchAllTournaments,
  fetchEntriesByTournament,
  rejectTournamentEntry,
} from '../../services/integration.ts';
import './AdminConfirmRegistration.css';

type RegistrationStatus = 'Pending' | 'Approved' | 'Declined';
type StatusFilter = 'All Entries' | RegistrationStatus;

type Registration = {
  id: number;
  tournament: string;
  horse: string;
  breedAge: string;
  owner: string;
  accent: string;
  status: RegistrationStatus;
};

const PAGE_SIZE = 7;
const filters: StatusFilter[] = ['All Entries', 'Pending', 'Approved', 'Declined'];

function RegistrationIcon({ name }: { name: 'clipboard' | 'approved' | 'declined' | 'trophy' | 'eye' | 'chevron-left' | 'chevron-right' | 'close' }) {
  const paths: Record<typeof name, string> = {
    clipboard: 'M9 2h6a3 3 0 0 1 3 3v3.3a7 7 0 0 0-2-.3V5h-2v3H6V5H4v14h4.3a7 7 0 0 0 1.1 2H4a2 2 0 0 1-2-2V5a3 3 0 0 1 3-3h1.2A3 3 0 0 1 9 0h3a3 3 0 0 1 2.8 2H15v2H9V2Zm6 20a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm.7-3.2 1.4-1.4-1.1-1.1V13h-2v4.1l1.7 1.7Z',
    approved: 'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm-1.4 14.6 7-7-1.4-1.4-5.6 5.6-2.8-2.8-1.4 1.4 4.2 4.2Z',
    declined: 'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm-3.6 14 3.6-3.6 3.6 3.6 1.4-1.4-3.6-3.6L17 7.4 15.6 6 12 9.6 8.4 6 7 7.4l3.6 3.6L7 14.6 8.4 16Z',
    trophy: 'M7 21v-2h4v-3.1c-.9-.2-1.7-.6-2.4-1.2-.7-.6-1.2-1.3-1.5-2.1-1.4-.2-2.5-.8-3.4-1.8C2.8 9.8 2.3 8.6 2.3 7.2V6c0-.6.2-1.1.6-1.5.4-.4.9-.6 1.5-.6H7V2h10v1.9h2.6c.6 0 1.1.2 1.5.6.4.4.6.9.6 1.5v1.2c0 1.4-.5 2.6-1.4 3.6-.9 1-2.1 1.6-3.4 1.8-.3.8-.8 1.5-1.5 2.1-.7.6-1.5 1-2.4 1.2V19h4v2H7Z',
    eye: 'M12 5c5 0 9.3 2.9 11 7-1.7 4.1-6 7-11 7S2.7 16.1 1 12c1.7-4.1 6-7 11-7Zm0 2c-3.8 0-7.2 2-8.7 5 1.5 3 4.9 5 8.7 5s7.2-2 8.7-5C19.2 9 15.8 7 12 7Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z',
    'chevron-left': 'm15.4 7.4-1.4-1.4-6 6 6 6 1.4-1.4-4.6-4.6 4.6-4.6Z',
    'chevron-right': 'm8.6 16.6 1.4 1.4 6-6-6-6-1.4 1.4 4.6 4.6-4.6 4.6Z',
    close: 'M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19Z',
  };

  return (
    <svg className="admin-confirm-registration__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

export default function AdminConfirmRegistration() {
  const [registrations, setRegistrations] = React.useState<(Registration & { raceId?: number })[]>([]);
  const [filter, setFilter] = React.useState<StatusFilter>('All Entries');
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<(Registration & { raceId?: number }) | null>(null);
  const [toast, setToast] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [rejectTarget, setRejectTarget] = React.useState<(Registration & { raceId?: number }) | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [rejectionError, setRejectionError] = React.useState('');
  const [rejecting, setRejecting] = React.useState(false);

  const visibleRegistrations = registrations.filter((item) => filter === 'All Entries' || item.status === filter);
  const pageCount = Math.max(1, Math.ceil(visibleRegistrations.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = visibleRegistrations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pendingCount = registrations.filter((item) => item.status === 'Pending').length;
  const approvedCount = registrations.filter((item) => item.status === 'Approved').length;
  const declinedCount = registrations.filter((item) => item.status === 'Declined').length;

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const tournaments = await fetchAllTournaments().catch(() => []);
        const entriesByTournament = await Promise.all(
          tournaments.map(async (tournament) => {
            const entries = await fetchEntriesByTournament(tournament.id).catch(() => []);

            return entries.map((entry) => ({
              id: Number(entry.id),
              tournament: tournament.name,
              horse: entry.horse?.name || 'Horse',
              breedAge: [entry.horse?.breed, entry.horse?.age ? `${entry.horse.age}yo` : ''].filter(Boolean).join(' · '),
              owner: entry.horse?.owner?.fullName || 'Owner',
              accent: '#775a19',
              status:
                entry.status === 'APPROVED'
                  ? 'Approved'
                  : entry.status === 'REJECTED'
                    ? 'Declined'
                    : 'Pending',
              raceId: entry.race?.id,
            }));
          }),
        );

        if (!cancelled) setRegistrations(entriesByTournament.flat());
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const changeFilter = (nextFilter: StatusFilter) => {
    setFilter(nextFilter);
    setPage(1);
  };

  const openRejectModal = (registration: Registration & { raceId?: number }) => {
    setRejectTarget(registration);
    setRejectionReason('');
    setRejectionError('');
  };

  const closeRejectModal = () => {
    if (rejecting) return;
    setRejectTarget(null);
    setRejectionReason('');
    setRejectionError('');
  };

  const updateStatus = async (id: number, status: RegistrationStatus) => {
    const registration = registrations.find((item) => item.id === id);
    if (!registration) return;

    if (status === 'Declined') {
      openRejectModal(registration);
      return;
    }

    try {
      await approveTournamentEntry(id);
      setRegistrations((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
      setSelected((current) => (current?.id === id ? { ...current, status } : current));
      setToast(`${registration.horse} has been approved.`);
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Failed to update registration.');
    }
  };

  const submitRejection = async () => {
    if (!rejectTarget) return;
    const reason = rejectionReason.trim();
    if (reason.length < 5) {
      setRejectionError('Please provide a clear reason of at least 5 characters.');
      return;
    }

    setRejecting(true);
    setRejectionError('');
    try {
      await rejectTournamentEntry(rejectTarget.id, reason);
      setRegistrations((current) => current.map((item) => (
        item.id === rejectTarget.id ? { ...item, status: 'Declined' } : item
      )));
      setSelected((current) => (
        current?.id === rejectTarget.id ? { ...current, status: 'Declined' } : current
      ));
      setToast(`${rejectTarget.horse} has been declined.`);
      setRejectTarget(null);
      setRejectionReason('');
    } catch (err) {
      setRejectionError(err instanceof Error ? err.message : 'Failed to decline registration.');
    } finally {
      setRejecting(false);
    }
  };

  return (
    <AdminLayout
      active="registrations"
      title="Registration Approvals"
      topNavActive="overview"
    >
      <div className="admin-confirm-registration" aria-busy={loading}>
        <section className="admin-confirm-registration__canvas">
          <header className="admin-confirm-registration__heading">
            <h1>Registration Approvals</h1>
            <p>Review and manage pending race entries. Verify horse pedigrees and owner certifications before confirming tournament status.</p>
          </header>

          <section className="admin-confirm-registration__stats" aria-label="Registration summary">
            <article>
              <span className="admin-confirm-registration__stat-icon"><RegistrationIcon name="clipboard" /></span>
              <div><small>Pending entries</small><strong>{pendingCount} Entries</strong></div>
            </article>
            <article>
              <span className="admin-confirm-registration__stat-icon"><RegistrationIcon name="approved" /></span>
              <div><small>Approved entries</small><strong>{approvedCount} Entries</strong></div>
            </article>
            <article className="is-declined">
              <span className="admin-confirm-registration__stat-icon"><RegistrationIcon name="declined" /></span>
              <div><small>Declined entries</small><strong>{declinedCount} Entries</strong></div>
            </article>
          </section>

          <section className="admin-confirm-registration__filter" aria-label="Filter registrations by status">
            <strong>Filter by Status:</strong>
            <div>
              {filters.map((item) => (
                <button
                  className={filter === item ? 'is-active' : ''}
                  key={item}
                  type="button"
                  onClick={() => changeFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="admin-confirm-registration__table-card" aria-label="Tournament registrations">
            <div className="admin-confirm-registration__table-scroll">
              <div className="admin-confirm-registration__table">
                <div className="admin-confirm-registration__table-head" role="row">
                  <span>Tournament</span><span>Horse</span><span>Owner</span><span>Status / Actions</span>
                </div>
                <div className="admin-confirm-registration__table-body">
                  {pageRows.length ? pageRows.map((registration) => (
                    <article className="admin-confirm-registration__row" key={registration.id}>
                      <div className="admin-confirm-registration__tournament">
                        <span style={{ color: registration.accent }}><RegistrationIcon name="trophy" /></span>
                        <strong>{registration.tournament}</strong>
                      </div>
                      <div className="admin-confirm-registration__horse">
                        <strong>{registration.horse}</strong>
                        <small>{registration.breedAge}</small>
                      </div>
                      <div className="admin-confirm-registration__owner">
                        <i style={{ background: registration.accent }} />
                        <span>{registration.owner}</span>
                      </div>
                      <div className="admin-confirm-registration__row-actions">
                        {registration.status === 'Pending' ? (
                          <>
                            <button className="is-decline" type="button" onClick={() => void updateStatus(registration.id, 'Declined')}>Decline</button>
                            <button className="is-accept" type="button" onClick={() => void updateStatus(registration.id, 'Approved')}>Accept</button>
                          </>
                        ) : (
                          <span className={`admin-confirm-registration__status is-${registration.status.toLowerCase()}`}>{registration.status}</span>
                        )}
                        <button className="is-view" type="button" aria-label={`View ${registration.horse} registration`} onClick={() => setSelected(registration)}>
                          <RegistrationIcon name="eye" />
                        </button>
                      </div>
                    </article>
                  )) : (
                    <div className="admin-confirm-registration__empty">{loading ? 'Loading registrations...' : 'No registrations match this status.'}</div>
                  )}
                </div>
              </div>
            </div>

            <footer className="admin-confirm-registration__footer">
              <span>Showing {pageRows.length} of {visibleRegistrations.length} registrations</span>
              <nav aria-label="Registration pages">
                <button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} aria-label="Previous page">
                  <RegistrationIcon name="chevron-left" />
                </button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                  <button className={currentPage === pageNumber ? 'is-active' : ''} type="button" key={pageNumber} onClick={() => setPage(pageNumber)}>
                    {pageNumber}
                  </button>
                ))}
                <button type="button" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} aria-label="Next page">
                  <RegistrationIcon name="chevron-right" />
                </button>
              </nav>
            </footer>
          </section>
        </section>

        {selected ? (
          <div className="admin-confirm-registration__modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
            <section className="admin-confirm-registration__modal" role="dialog" aria-modal="true" aria-labelledby="registration-detail-title" onMouseDown={(event) => event.stopPropagation()}>
              <button className="admin-confirm-registration__modal-close" type="button" aria-label="Close registration details" onClick={() => setSelected(null)}>
                <RegistrationIcon name="close" />
              </button>
              <span className={`admin-confirm-registration__status is-${selected.status.toLowerCase()}`}>{selected.status}</span>
              <h2 id="registration-detail-title">{selected.horse}</h2>
              <dl>
                <div><dt>Tournament</dt><dd>{selected.tournament}</dd></div>
                <div><dt>Breed / Age</dt><dd>{selected.breedAge}</dd></div>
                <div><dt>Owner</dt><dd>{selected.owner}</dd></div>
                <div><dt>Certification</dt><dd>Pedigree and ownership documents verified</dd></div>
              </dl>
              {selected.status === 'Pending' ? (
                <div className="admin-confirm-registration__modal-actions">
                  <button type="button" onClick={() => void updateStatus(selected.id, 'Declined')}>Decline registration</button>
                  <button type="button" onClick={() => void updateStatus(selected.id, 'Approved')}>Approve registration</button>
                </div>
              ) : null}
            </section>
          </div>
        ) : null}

        {rejectTarget ? (
          <div className="admin-confirm-registration__reject-backdrop" role="presentation" onMouseDown={closeRejectModal}>
            <section
              className="admin-confirm-registration__reject-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="reject-registration-title"
              aria-describedby="reject-registration-description"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <header>
                <span className="admin-confirm-registration__reject-icon"><RegistrationIcon name="declined" /></span>
                <div>
                  <small>Registration decision</small>
                  <h2 id="reject-registration-title">Decline this entry?</h2>
                </div>
                <button type="button" aria-label="Close rejection dialog" onClick={closeRejectModal} disabled={rejecting}>
                  <RegistrationIcon name="close" />
                </button>
              </header>

              <p id="reject-registration-description">
                Explain why <strong>{rejectTarget.horse}</strong> cannot enter <strong>{rejectTarget.tournament}</strong>.
                This reason will be shared with {rejectTarget.owner}.
              </p>

              <div className="admin-confirm-registration__reject-summary">
                <div><span>Horse</span><strong>{rejectTarget.horse}</strong></div>
                <div><span>Owner</span><strong>{rejectTarget.owner}</strong></div>
              </div>

              <label htmlFor="registration-rejection-reason">
                Rejection reason <em>Required</em>
              </label>
              <textarea
                id="registration-rejection-reason"
                value={rejectionReason}
                onChange={(event) => {
                  setRejectionReason(event.target.value);
                  if (rejectionError) setRejectionError('');
                }}
                maxLength={500}
                rows={5}
                autoFocus
                placeholder="Example: The horse's eligibility documents are incomplete..."
                aria-invalid={Boolean(rejectionError)}
                aria-describedby={rejectionError ? 'rejection-reason-error' : undefined}
                disabled={rejecting}
              />
              <div className="admin-confirm-registration__reject-help">
                {rejectionError ? <span id="rejection-reason-error" role="alert">{rejectionError}</span> : <span>Be specific and professional.</span>}
                <small>{rejectionReason.length}/500</small>
              </div>

              <footer>
                <button type="button" onClick={closeRejectModal} disabled={rejecting}>Cancel</button>
                <button type="button" onClick={() => void submitRejection()} disabled={rejecting || rejectionReason.trim().length < 5}>
                  {rejecting ? 'Declining...' : 'Decline entry'}
                </button>
              </footer>
            </section>
          </div>
        ) : null}
        {toast ? <div className="admin-confirm-registration__toast" role="status"><RegistrationIcon name="approved" />{toast}</div> : null}
      </div>
    </AdminLayout>
  );
}
