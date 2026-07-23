import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.tsx';
import HomeBanner from '../../assets/images/HomeBanner.png';
import {
  assignRaceReferee,
  deleteTournament,
  fetchAdminHorses,
  fetchAdminUsers,
  fetchEntriesByTournament,
  fetchRacesByTournament,
  fetchTournamentBySlug,
  forceStartAdminRace,
  formatCurrency,
  formatDateRange,
  saveAdminRaceGates,
  saveTournamentBracket,
  slugify,
  updateTournamentStatus,
  type RawHorse,
  type RawRace,
  type RawRaceEntry,
  type RawTournament,
} from '../../services/integration.ts';
import './AdminManageTournamentDetail.css';
import './AdminRaceDetail.css';
import './AdminRaceDetailOverrides.css';

type Race = {
  id: string;
  title: string;
  date: string;
  time: string;
  runners: number;
  state: string;
  refereeName?: string;
  distance?: number;
};

type Bracket = { qualifiers: Race[]; semifinals: Race[]; final: Race };

type RefereeOption = { id: number; name: string };
type GateOption = { key: string; horseId: number; horse: RawHorse; entry: RawRaceEntry | null };

const tournamentName = (name?: string) => decodeURIComponent(name ?? 'Royal Ascot Autumn Derby');

//#region debug-point admin-configure-gates-missing-horses-A1
function reportAdminGateDebug(payload: Record<string, unknown>) {
  try {
    const url = window.localStorage.getItem('DEBUG_SERVER_URL') || '';
    const sessionId = window.localStorage.getItem('DEBUG_SESSION_ID') || 'admin-configure-gates-missing-horses';
    if (!url) return;
    void fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        hypothesisId: 'A',
        runId: 'pre',
        payload,
      }),
    });
  } catch {
    // no-op
  }
}
//#endregion debug-point admin-configure-gates-missing-horses-A1

function RaceCard({ race, tournament, featured = false }: { race: Race; tournament: string; featured?: boolean }) {
  return (
    <Link
      className={`amtBracketRace ${featured ? 'amtBracketRace--final' : ''}`}
      to={`/Admin/ManageTournaments/${encodeURIComponent(tournament)}/${encodeURIComponent(race.id)}`}
    >
      {featured ? <div className="amtBracketRace__championship">The Championship Match</div> : null}
      <div className="amtBracketRace__body">
        <div className="amtBracketRace__top">
          <h3>{race.title}</h3>
          <span>{race.state}</span>
        </div>
        <div className="amtBracketRace__detail">
          <b>▣</b> {race.date} · {race.time}
        </div>
        <div className="amtBracketRace__detail">
          <b>━</b> {race.distance || 0}m
        </div>
        <div className="amtBracketRace__detail">
          <b>♟</b> {race.runners} Runners
        </div>
        <p>Ref: {race.refereeName || 'Unassigned'}</p>
      </div>
      <footer>
        {featured ? 'Final bracket ready' : 'Manage bracket'}
        <span>↗</span>
      </footer>
    </Link>
  );
}

function ensureGateAssignments(length: number, current: string[]) {
  return Array.from({ length }, (_, index) => current[index] || '');
}

function entryGateValue(entryId: number) {
  return `entry:${entryId}`;
}

function horseGateValue(horseId: number) {
  return `horse:${horseId}`;
}

function parseGateValue(value: string) {
  if (!value) return null;
  if (/^\d+$/.test(value)) {
    return { entryId: Number(value), horseId: null as number | null };
  }
  if (value.startsWith('entry:')) {
    return { entryId: Number(value.slice(6)), horseId: null as number | null };
  }
  if (value.startsWith('horse:')) {
    return { entryId: null as number | null, horseId: Number(value.slice(6)) };
  }
  return null;
}

function RaceDetailView({ tournament, raceName }: { tournament: string; raceName: string }) {
  const navigate = useNavigate();
  const decodedRaceName = decodeURIComponent(raceName);
  const [tournamentData, setTournamentData] = React.useState<RawTournament | null>(null);
  const [race, setRace] = React.useState<RawRace | null>(null);
  const [entries, setEntries] = React.useState<RawRaceEntry[]>([]);
  const [horses, setHorses] = React.useState<RawHorse[]>([]);
  const [referees, setReferees] = React.useState<RefereeOption[]>([]);
  const [selectedRefereeId, setSelectedRefereeId] = React.useState('');
  const [gatesOpen, setGatesOpen] = React.useState(false);
  const [gateCount, setGateCount] = React.useState(4);
  const [gateAssignments, setGateAssignments] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [notice, setNotice] = React.useState('');
  const [error, setError] = React.useState('');

  const loadRaceDetail = React.useCallback(async () => {
    setLoading(true);
    setError('');
    const foundTournament = await fetchTournamentBySlug(tournament).catch(() => null);
    setTournamentData(foundTournament);
    if (!foundTournament) {
      setRace(null);
      setEntries([]);
      setHorses([]);
      setReferees([]);
      setLoading(false);
      return;
    }

    const [raceItems, entryItems, horseItems, refereeItems] = await Promise.all([
      fetchRacesByTournament(foundTournament.id).catch(() => []),
      fetchEntriesByTournament(foundTournament.id).catch(() => []),
      fetchAdminHorses().catch(() => []),
      fetchAdminUsers({ role: 'REFEREE' }).catch(() => []),
    ]);

    const selectedRace =
      raceItems.find((item) => String(item.id) === decodedRaceName) ||
      raceItems.find((item) => slugify(item.name) === slugify(decodedRaceName)) ||
      null;

    setRace(selectedRace);
    setEntries(entryItems);
    setHorses(horseItems);
    const nextReferees = refereeItems.map((item) => ({
      id: item.id,
      name: item.fullName || item.email || `Referee #${item.id}`,
    }));
    setReferees(nextReferees);
    setSelectedRefereeId(selectedRace?.referee?.id ? String(selectedRace.referee.id) : '');

    if (selectedRace) {
      const currentRaceEntries = entryItems
        .filter((item) => item.race?.id === selectedRace.id)
        .sort((a, b) => (a.gateNumber || 999) - (b.gateNumber || 999));
      const largestGate = currentRaceEntries.reduce((max, item) => Math.max(max, item.gateNumber || 0), 0);
      const initialGateCount = Math.max(selectedRace.maxParticipants || 0, largestGate, currentRaceEntries.length, 1);
      const initialAssignments = ensureGateAssignments(initialGateCount, []);
      currentRaceEntries.forEach((item, index) => {
        const gateIndex = Math.max(0, (item.gateNumber || index + 1) - 1);
        if (gateIndex < initialAssignments.length) {
          initialAssignments[gateIndex] = entryGateValue(item.id);
        }
      });
      setGateCount(initialGateCount);
      setGateAssignments(initialAssignments);
    } else {
      setGateCount(4);
      setGateAssignments(ensureGateAssignments(4, []));
    }

    setLoading(false);
  }, [decodedRaceName, tournament]);

  React.useEffect(() => {
    void loadRaceDetail();
  }, [loadRaceDetail]);

  React.useEffect(() => {
    if (!notice && !error) return undefined;
    const timeout = window.setTimeout(() => {
      setNotice('');
      setError('');
    }, 3500);
    return () => window.clearTimeout(timeout);
  }, [notice, error]);

  const eligibleEntries = React.useMemo(
    () =>
      entries.filter((item) => item.status === 'APPROVED' || item.status === 'CONFIRMED'),
    [entries, race?.id],
  );

  //#region debug-point admin-configure-gates-missing-horses-A2
  reportAdminGateDebug({
    raceId: race?.id || null,
    tournamentId: tournamentData?.id || null,
    totalHorses: horses.length,
    horses: horses.map((item) => ({
      id: item.id,
      horse: item.name || null,
      status: item.status || null,
    })),
    totalEntries: entries.length,
    entries: entries.map((item) => ({
      id: item.id,
      horse: item.horse?.name || null,
      status: item.status || null,
      raceId: item.race?.id || null,
      gateNumber: item.gateNumber ?? null,
    })),
    eligibleEntryIds: eligibleEntries.map((item) => item.id),
    gateAssignments,
  });
  //#endregion debug-point admin-configure-gates-missing-horses-A2

  const gateOptions = React.useMemo(() => {
    return eligibleEntries
      .map((entry) => {
        return {
          key: entryGateValue(entry.id),
          horseId: entry.horse?.id ?? 0,
          horse: entry.horse,
          entry,
        };
      })
      .sort((left, right) => {
        const leftRank = left.entry?.race?.id === race?.id ? 0 : left.entry?.race?.id ? 2 : 1;
        const rightRank = right.entry?.race?.id === race?.id ? 0 : right.entry?.race?.id ? 2 : 1;
        if (leftRank !== rightRank) return leftRank - rightRank;
        return (left.horse?.name || '').localeCompare(right.horse?.name || '');
      });
  }, [eligibleEntries, horses, race?.id]);

  const assignedEntries = React.useMemo(
    () =>
      gateAssignments.map((value, index) => {
        const parsed = parseGateValue(value);
        const option =
          gateOptions.find((item) => item.key === value) ||
          gateOptions.find((item) => item.entry?.id === parsed?.entryId || item.horseId === parsed?.horseId) ||
          null;
        return {
          gateNumber: index + 1,
          option,
        };
      }),
    [gateAssignments, gateOptions],
  );

  const formatEntryOptionLabel = (option: GateOption) => {
    const horseName = option.horse?.name || (option.entry ? `Entry #${option.entry.id}` : `Horse #${option.horseId}`);
    const raceLabel =
      option.entry?.race?.id && option.entry.race.id !== race?.id
        ? `Assigned to ${option.entry.race.name || `race #${option.entry.race.id}`}`
        : option.entry?.race?.id === race?.id
          ? 'Already in this bracket'
          : option.entry?.status || 'Will be added to tournament';
    return `${horseName} - ${raceLabel}`;
  };

  const applyGateCount = (nextCount: number) => {
    const normalized = Math.max(1, nextCount);
    setGateCount(normalized);
    setGateAssignments((current) => ensureGateAssignments(normalized, current));
  };

  const saveGates = async () => {
    if (!race) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const assignments = gateAssignments
        .map((value, index) => {
          const parsed = parseGateValue(value);
          if (!parsed) return null;
          return {
            gateNumber: index + 1,
            entryId: parsed.entryId || undefined,
            horseId: parsed.horseId || undefined,
          };
        })
        .filter((item): item is { gateNumber: number; entryId?: number; horseId?: number } => Boolean(item));
      const uniqueHorseIds = new Set(
        assignments.map((item) => {
          if (item.horseId) return item.horseId;
          const matched = gateOptions.find((option) => option.entry?.id === item.entryId);
          return matched?.horseId || item.entryId || 0;
        }),
      );
      if (uniqueHorseIds.size !== assignments.length) {
        throw new Error('Each horse can only be assigned to one gate.');
      }

      await saveAdminRaceGates(race.id, { gateCount, assignments });
      setNotice('Gate configuration saved successfully.');
      setGatesOpen(false);
      await loadRaceDetail();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save gate configuration.');
    } finally {
      setSaving(false);
    }
  };

  const assignReferee = async () => {
    if (!race || !selectedRefereeId) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const updated = await assignRaceReferee(race.id, Number(selectedRefereeId));
      setRace(updated);
      await loadRaceDetail();
      setNotice('Referee assigned successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to assign referee.');
    } finally {
      setSaving(false);
    }
  };

  const publishRace = async () => {
    if (!race) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const updated = await publishAdminRace(race.id);
      setRace(updated);
      await loadRaceDetail();
      setNotice('Race published. Horse owners and spectators can now view its details.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to publish this race.');
    } finally {
      setSaving(false);
    }
  };

  const startRace = async () => {
    if (!race) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const updated = await updateAdminRaceStatus(race.id, 'ONGOING');
      setRace(updated);
      await loadRaceDetail();
      setNotice('Race is now ongoing. The assigned referee can record attendance and results.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start this race.');
    } finally {
      setSaving(false);
    }
  };

  const forceStart = async () => {
    if (!race) return;
    if (!window.confirm('Are you sure you want to force start this race? Horses without jockeys assigned will be automatically withdrawn.')) return;

    setSaving(true);
    setError('');
    setNotice('');
    try {
      const updated = await forceStartAdminRace(race.id);
      setRace(updated);
      await loadRaceDetail();
      setNotice('Race forcefully started. Horses without jockeys have been withdrawn.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to force start this race.');
    } finally {
      setSaving(false);
    }
  };

  const displayRace = race?.name || decodedRaceName.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <div className="adminRaceDetail">
      <section className="adminRaceHero">
        <button type="button" onClick={() => setGatesOpen(true)}>
          ✎ Configure Gates
        </button>
        <div>
          <h1>Heat: {displayRace}</h1>
          <div className="adminRaceHero__facts">
            <span>▣ {race?.raceDate ? new Date(race.raceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBA'}</span>
            <span>◷ {race?.raceDate ? new Date(race.raceDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'TBA'}</span>
            <span>━ {race?.distanceM || 0}m</span>
          </div>
          {notice ? <p className="amtDetailHeroDesc">{notice}</p> : null}
          {error ? <p className="amtDetailHeroDesc">{error}</p> : null}
        </div>
      </section>

      <div className="adminRaceContent">
        <section className="adminRacePanel">
          <header className="adminRacePanel__heading">
            <h2>Race Participant Assignment</h2>
            <button type="button" onClick={() => setGatesOpen(true)} disabled={loading}>
              ✎ Configure Gates
            </button>
          </header>
          {loading ? (
            <div className="adminRaceEmpty">
              <b>Loading race participants...</b>
            </div>
          ) : !assignedEntries.some((participant) => participant.option) ? (
            <div className="adminRaceEmpty">
              <b>No participants created yet</b>
              <p>Configure race gates to start assigning horses from the database to this heat.</p>
              <button type="button" onClick={() => setGatesOpen(true)}>
                Configure Gates
              </button>
            </div>
          ) : (
            <>
              <div className="adminParticipantHead">
                <span>Gate</span>
                <span>Horse Name</span>
                <span>Jockey</span>
                <span>Finish Time</span>
                <span>Status</span>
              </div>
              {assignedEntries.map((participant) => (
                <div className="adminParticipantRow" key={participant.gateNumber}>
                  <strong>{String(participant.gateNumber).padStart(2, '0')}</strong>
                  <div>
                    <strong>{participant.option?.horse?.name || 'Empty gate'}</strong>
                    <small>{participant.option?.horse?.owner?.fullName || participant.option?.horse?.owner?.email || '—'}</small>
                  </div>
                  <span>{participant.option?.entry?.jockey?.fullName || 'Unassigned'}</span>
                  <input aria-label={`Finish time gate ${participant.gateNumber}`} placeholder="Configured by referee" disabled />
                  <span className="adminParticipantStatus">{participant.option?.entry?.status || (participant.option ? 'READY_TO_ADD' : 'Empty')}</span>
                </div>
              ))}
            </>
          )}
        </section>

        <aside className="adminRaceSide">
          <section className="adminRefereeCard">
            <h2>♢ Referee Assignment</h2>
            <p>Select the presiding official for this bracket.</p>
            <label>Assigned official</label>
            <select value={selectedRefereeId} onChange={(event) => setSelectedRefereeId(event.target.value)}>
              <option value="">Select referee...</option>
              {referees.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <p>Current referee: {race?.referee?.fullName || race?.referee?.email || 'Unassigned'}</p>
            <button type="button" onClick={assignReferee} disabled={saving || !selectedRefereeId || !race}>
              ♙ Assign Official
            </button>
          </section>

          <section className="adminFinalActions">
            <span>Final actions</span>
            <button type="button" onClick={saveGates} disabled={saving || !race}>
              ▣ Save Configure Gates
            </button>
            {!race?.published ? (
              <button type="button" onClick={publishRace} disabled={saving || !race?.gatesConfigured || !race?.referee}>
                Publish Race
              </button>
            ) : null}
            {race?.published && race.status === 'SCHEDULED' ? (
              <button type="button" onClick={startRace} disabled={saving}>
                ▶ Start Race
              </button>
            ) : null}
            {race?.published && race.status === 'SCHEDULED' ? (
              <button type="button" onClick={forceStart} disabled={saving} style={{ backgroundColor: '#f39c12', color: 'white' }}>
                ⚠ Force Start (Withdraw no-shows)
              </button>
            ) : null}
            <p>Race status: {race?.status || 'Unknown'}</p>
          </section>
        </aside>
      </div>

      {gatesOpen ? (
        <div className="adminRaceModal" onMouseDown={() => setGatesOpen(false)}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void saveGates();
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2>Configure Gates</h2>
            <p>Choose the number of gates and assign horses to this bracket.</p>
            <p>Only horses registered for this tournament are listed here.</p>
            <label>
              Number of gates
              <select value={gateCount} onChange={(event) => applyGateCount(Number(event.target.value))}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((value) => (
                  <option value={value} key={value}>
                    {value} gates
                  </option>
                ))}
              </select>
            </label>
            <div className="adminRaceModal__fields">
              {gateAssignments.map((entryId, index) => (
                <label key={index}>
                  Gate {index + 1}
                  <select
                    value={entryId}
                    onChange={(event) =>
                      setGateAssignments((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? event.target.value : item,
                        ),
                      )
                    }
                  >
                    <option value="">Leave empty</option>
                    {gateOptions.map((item) => (
                      <option value={item.key} key={item.key}>
                        {formatEntryOptionLabel(item)}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <div className="adminRaceModal__actions">
              <button type="button" onClick={() => setGatesOpen(false)} disabled={saving}>
                Cancel
              </button>
              <button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Configure Gates'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export default function AdminManageTournamentDetail() {
  const { name, racename } = useParams<{ name?: string; racename?: string }>();
  const navigate = useNavigate();
  const title = tournamentName(name);
  const [tournament, setTournament] = React.useState<RawTournament | null>(null);
  const [bracket, setBracket] = React.useState<Bracket | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [actionError, setActionError] = React.useState('');
  const [actionSuccess, setActionSuccess] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [qualifierCount, setQualifierCount] = React.useState(1);
  const [semifinalCount, setSemifinalCount] = React.useState(1);

  const toDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBA';
  const toTime = (value?: string) =>
    value ? new Date(value).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'TBA';

  const mapRaceCard = (race: RawRace): Race => ({
    id: String(race.id),
    title: race.name || `Race #${race.id}`,
    date: toDate(race.raceDate),
    time: toTime(race.raceDate),
    runners: race.maxParticipants || 0,
    state: race.status || 'SCHEDULED',
    refereeName: race.referee?.fullName || race.referee?.email,
    distance: race.distanceM,
  });

  const deriveBracket = (races: RawRace[]) => {
    const sortedRaces = [...races].sort((left, right) => {
      const roundDiff = Number(left.roundNumber || 1) - Number(right.roundNumber || 1);
      if (roundDiff !== 0) return roundDiff;
      const leftDate = left.raceDate ? new Date(left.raceDate).getTime() : 0;
      const rightDate = right.raceDate ? new Date(right.raceDate).getTime() : 0;
      if (leftDate !== rightDate) return leftDate - rightDate;
      return left.id - right.id;
    });

    const qualifierCards = sortedRaces.filter((race) => Number(race.roundNumber || 1) === 1).map(mapRaceCard);
    const semiCards = sortedRaces.filter((race) => Number(race.roundNumber || 1) === 2).map(mapRaceCard);
    const finalRace = [...sortedRaces]
      .filter((race) => Number(race.roundNumber || 1) >= 3)
      .sort((left, right) => Number(right.roundNumber || 1) - Number(left.roundNumber || 1))[0];
    const finalCard = finalRace
      ? mapRaceCard(finalRace)
      : { id: 'final', title: 'Grand Final', date: 'TBA', time: 'TBA', runners: 0, state: 'Draft', distance: 0 };
    return { qualifiers: qualifierCards, semifinals: semiCards, final: finalCard };
  };

  React.useEffect(() => {
    if (!modalOpen) return;
    setQualifierCount(bracket?.qualifiers.length || 1);
    setSemifinalCount(bracket?.semifinals.length || 1);
  }, [bracket, modalOpen]);

  const loadTournament = React.useCallback(async () => {
    setLoading(true);
    setActionError('');
    setActionSuccess('');
    const found = await fetchTournamentBySlug(title).catch(() => null);
    setTournament(found);
    if (!found) {
      setBracket(null);
      setLoading(false);
      return;
    }

    const races = await fetchRacesByTournament(found.id).catch(() => []);
    setBracket(races.length ? deriveBracket(races) : null);
    setLoading(false);
  }, [title]);

  React.useEffect(() => {
    void loadTournament();
  }, [loadTournament]);

  const createBracket = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!tournament) return;

    setSaving(true);
    setActionError('');
    setActionSuccess('');
    try {
      const savedRaces = await saveTournamentBracket(tournament.id, qualifierCount, semifinalCount);
      setBracket(deriveBracket(savedRaces));
      setActionSuccess('Bracket saved successfully.');
      setModalOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to create bracket races.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTournament = async () => {
    if (!tournament) return;
    if (!window.confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) return;

    setSaving(true);
    try {
      await deleteTournament(tournament.id);
      navigate('/Admin/ManageTournaments');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to delete tournament.');
      setSaving(false);
    }
  };

  const handleOpenRegistration = async () => {
    if (!tournament) return;
    setSaving(true);
    try {
      await updateTournamentStatus(tournament.id, 'OPEN');
      setTournament(prev => prev ? { ...prev, status: 'OPEN' } : prev);
      setActionSuccess('Tournament registration is now open!');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to open registration. Ensure you have created the bracket first (at least 2 races).');
    } finally {
      setSaving(false);
    }
  };

  if (racename) {
    const raceTitle = decodeURIComponent(racename).replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
    return (
      <AdminLayout
        active="tournaments"
        breadcrumb={[
          { label: 'Tournaments', to: '/Admin/ManageTournaments' },
          { label: title, to: `/Admin/ManageTournaments/${encodeURIComponent(title)}` },
          { label: raceTitle },
        ]}
      >
        <RaceDetailView tournament={title} raceName={racename} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout active="tournaments" breadcrumb={[{ label: 'Tournaments', to: '/Admin/ManageTournaments' }, { label: title }]}>
      <div className="amtDetailPage">
        <main className="amtDetailMain">
          <section className="amtDetailHero">
            <div className="amtDetailHeroBg">
              <img alt="Racecourse" className="amtDetailHeroImg" src={HomeBanner} />
              <div className="amtDetailHeroGradient" />
            </div>
            <div className="amtDetailHeroContent">
              <div className="amtDetailHeroLeft">
                <span className="amtRegistration">{tournament?.status ? String(tournament.status) : loading ? 'Loading...' : 'Draft'}</span>
                <h1 className="amtDetailHeroTitle">{title}</h1>
                <p className="amtDetailHeroDesc">{tournament?.description || 'Tournament details are synced from the backend.'}</p>
                {actionError ? <p className="amtDetailHeroDesc">{actionError}</p> : null}
                {actionSuccess ? <p className="amtDetailHeroDesc">{actionSuccess}</p> : null}
              </div>
              <div className="amtHeroActions">
                {tournament?.status === 'DRAFT' && (
                  <button type="button" className="amtDetailEditBtn" onClick={handleOpenRegistration} disabled={saving} style={{ marginRight: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                    ▶ Open Registration
                  </button>
                )}
                <Link className="amtDetailEditBtn" to={`/Admin/ManageTournaments/edit/${encodeURIComponent(title)}`}>
                  ✎ Edit Tournament
                </Link>
                <button type="button" className="amtDetailDeleteBtn" onClick={handleDeleteTournament} disabled={saving} style={{ marginLeft: '10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                  Trash
                </button>
              </div>
            </div>
          </section>

          <section className="amtDetailGrid" aria-label="Tournament information">
            {[
              ['▣', 'Date', tournament ? formatDateRange(tournament.startDate, tournament.endDate) : '—'],
              ['▤', 'Prize pool', tournament ? formatCurrency(tournament.prizePool) : '—'],
              ['♟', 'Max horses', tournament?.maxHorses ? String(tournament.maxHorses) : '—'],
              ['⌖', 'Location', tournament?.location || '—'],
            ].map(([icon, label, value]) => (
              <article className="amtDetailStat" key={label}>
                <i>{icon}</i>
                <div>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              </article>
            ))}
          </section>

          <section className="amtBracketSection">
            <header className="amtBracketHeader">
              <div>
                <h2>Tournament Bracket</h2>
                <p>Bracket creation will create real Race records in the database. Open each bracket to assign referee and save gates.</p>
              </div>
              <button type="button" onClick={() => setModalOpen(true)} disabled={saving || loading || !tournament}>
                ✎ {bracket ? 'Edit Bracket' : 'Create Bracket'}
              </button>
            </header>
            {!bracket ? (
              <div className="amtBracketEmpty">
                <div>♜</div>
                <strong>No bracket created yet</strong>
                <p>Create a bracket to organize qualifying races, semi-finals, and the championship match.</p>
              </div>
            ) : (
              <div className="amtBracketBoard">
                <div className="amtBracketColumn">
                  <h3>Qualifiers</h3>
                  <div className="amtBracketStack">{bracket.qualifiers.map((race) => <RaceCard key={race.id} race={race} tournament={title} />)}</div>
                </div>
                <div className="amtBracketColumn">
                  <h3>Semi-finals</h3>
                  <div className="amtBracketStack amtBracketStack--middle">{bracket.semifinals.map((race) => <RaceCard key={race.id} race={race} tournament={title} />)}</div>
                </div>
                <div className="amtBracketColumn amtBracketColumn--final">
                  <h3>Grand finals</h3>
                  <RaceCard race={bracket.final} tournament={title} featured />
                </div>
              </div>
            )}
          </section>
        </main>
        {modalOpen ? (
          <div className="amtModalOverlay" onMouseDown={() => setModalOpen(false)}>
            <form className="amtCreateHeatModal" onSubmit={createBracket} onMouseDown={(event) => event.stopPropagation()}>
              <div className="amtModalHeader">
                <div>
                  <h2 className="amtModalTitle">{bracket ? 'Edit' : 'Create'} Tournament Bracket</h2>
                  <p className="amtModalDesc">Choose how many qualifying races and semi-final races should exist in this tournament bracket.</p>
                </div>
                <button className="amtModalClose" type="button" onClick={() => setModalOpen(false)}>
                  ×
                </button>
              </div>
              <div className="amtModalFieldGrid">
                <label className="amtModalField">
                  <span>Qualifying races</span>
                  <input
                    type="number"
                    min="0"
                    value={qualifierCount}
                    onChange={(e) => setQualifierCount(Math.max(0, Number(e.target.value)))}
                  />
                </label>
                <label className="amtModalField">
                  <span>Semi-final races</span>
                  <input
                    type="number"
                    min="0"
                    value={semifinalCount}
                    onChange={(e) => setSemifinalCount(Math.max(0, Number(e.target.value)))}
                  />
                </label>
              </div>
              <div className="amtModalActions">
                <button className="amtModalSecondary" type="button" onClick={() => setModalOpen(false)} disabled={saving}>
                  Cancel
                </button>
                <button className="amtModalPrimary" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Bracket'}
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </AdminLayout>
  );
}
