import React from 'react';
import AdminLayout from '../components/admin/AdminLayout.tsx';
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

const initialRegistrations: Registration[] = [
  { id: 1, tournament: 'Royal Ascot Gold Cup', horse: 'Midnight Sovereign', breedAge: 'Thoroughbred · 5yo Stallion', owner: 'Alexander Sterling', accent: '#775a19', status: 'Pending' },
  { id: 2, tournament: 'The Dubai World Cup', horse: 'Silver Shadow', breedAge: 'Arabian · 4yo Mare', owner: 'Arthur Sterling', accent: '#004225', status: 'Declined' },
  { id: 3, tournament: 'Preakness Stakes', horse: 'Golden Gallop', breedAge: 'Thoroughbred · 6yo Stallion', owner: 'Julian Rossi', accent: '#002a15', status: 'Approved' },
  { id: 4, tournament: 'Emerald Derby Classic', horse: 'Velvet Comet', breedAge: 'Thoroughbred · 3yo Mare', owner: 'Claire Beaumont', accent: '#526d50', status: 'Pending' },
  { id: 5, tournament: 'Heritage Breeders Cup', horse: 'Northern Crown', breedAge: 'Warmblood · 5yo Stallion', owner: 'James Whitmore', accent: '#895f32', status: 'Pending' },
  { id: 6, tournament: 'Winter Solstice Sprint', horse: 'Crimson Legacy', breedAge: 'Thoroughbred · 4yo Gelding', owner: 'Sofia Moretti', accent: '#7c2d12', status: 'Approved' },
  { id: 7, tournament: 'King George Stakes', horse: 'Windswept Honor', breedAge: 'Arabian Cross · 5yo Mare', owner: 'George Fairchild', accent: '#365314', status: 'Pending' },
  { id: 8, tournament: 'Belmont Heritage Run', horse: 'Noble Whisper', breedAge: 'Thoroughbred · 3yo Stallion', owner: 'Isabelle Laurent', accent: '#475569', status: 'Approved' },
  { id: 9, tournament: 'Grand National Trial', horse: 'Ironwood Prince', breedAge: 'Warmblood · 6yo Gelding', owner: 'Henry Ashford', accent: '#713f12', status: 'Declined' },
  { id: 10, tournament: 'Royal Ascot Gold Cup', horse: 'Dawn’s Promise', breedAge: 'Thoroughbred · 4yo Mare', owner: 'Victoria Wells', accent: '#9f1239', status: 'Pending' },
  { id: 11, tournament: 'The Dubai World Cup', horse: 'Desert Anthem', breedAge: 'Arabian · 5yo Stallion', owner: 'Omar Al-Fayed', accent: '#a16207', status: 'Pending' },
  { id: 12, tournament: 'Preakness Stakes', horse: 'Secretariat Blue', breedAge: 'Thoroughbred · 3yo Stallion', owner: 'Oliver Price', accent: '#1e3a8a', status: 'Pending' },
  { id: 13, tournament: 'Emerald Derby Classic', horse: 'Autumn Regent', breedAge: 'Thoroughbred · 5yo Gelding', owner: 'Helena Ward', accent: '#166534', status: 'Approved' },
  { id: 14, tournament: 'Heritage Breeders Cup', horse: 'Ivory Monarch', breedAge: 'Arabian Cross · 4yo Stallion', owner: 'Edward Sinclair', accent: '#854d0e', status: 'Declined' },
  { id: 15, tournament: 'King George Stakes', horse: 'Rosewood Star', breedAge: 'Thoroughbred · 3yo Mare', owner: 'Beatrice Cole', accent: '#be123c', status: 'Pending' },
  { id: 16, tournament: 'Belmont Heritage Run', horse: 'Sapphire Crest', breedAge: 'Warmblood · 5yo Mare', owner: 'Nathaniel Brooks', accent: '#1d4ed8', status: 'Approved' },
];

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
  const [registrations, setRegistrations] = React.useState(initialRegistrations);
  const [filter, setFilter] = React.useState<StatusFilter>('All Entries');
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<Registration | null>(null);
  const [toast, setToast] = React.useState('');

  const visibleRegistrations = registrations.filter((item) => filter === 'All Entries' || item.status === filter);
  const pageCount = Math.max(1, Math.ceil(visibleRegistrations.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = visibleRegistrations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pendingCount = registrations.filter((item) => item.status === 'Pending').length;
  const approvedCount = registrations.filter((item) => item.status === 'Approved').length;
  const declinedCount = registrations.filter((item) => item.status === 'Declined').length;

  React.useEffect(() => {
    setRegistrations((current) =>
      current.map((item) =>
        String(item.status).toLowerCase() === 'rejected'
          ? { ...item, status: 'Declined' }
          : item,
      ),
    );
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

  const updateStatus = (id: number, status: RegistrationStatus) => {
    const registration = registrations.find((item) => item.id === id);
    setRegistrations((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
    setSelected((current) => (current?.id === id ? { ...current, status } : current));
    setToast(`${registration?.horse ?? 'Registration'} has been ${status.toLowerCase()}.`);
  };

  return (
    <AdminLayout
      active="registrations"
      breadcrumb={[{ label: 'Admin', to: '/admin' }, { label: 'Registration Approvals' }]}
    >
      <div className="admin-confirm-registration">
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
                            <button className="is-decline" type="button" onClick={() => updateStatus(registration.id, 'Declined')}>Decline</button>
                            <button className="is-accept" type="button" onClick={() => updateStatus(registration.id, 'Approved')}>Accept</button>
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
                    <div className="admin-confirm-registration__empty">No registrations match this status.</div>
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
                  <button type="button" onClick={() => updateStatus(selected.id, 'Declined')}>Decline registration</button>
                  <button type="button" onClick={() => updateStatus(selected.id, 'Approved')}>Approve registration</button>
                </div>
              ) : null}
            </section>
          </div>
        ) : null}

        {toast ? <div className="admin-confirm-registration__toast" role="status"><RegistrationIcon name="approved" />{toast}</div> : null}
      </div>
    </AdminLayout>
  );
}
