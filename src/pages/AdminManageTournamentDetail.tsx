import React from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout.tsx';
import HomeBanner from '../assets/images/HomeBanner.png';

import './AdminManageTournamentDetail.css';

type RouteParams = {
  name?: string;
};

type HeatHorse = {
  gate: number;
  horseName: string;
  rank: number | '';
};

type RaceHeat = {
  id: number;
  type: HeatType;
  title: string;
  referee: string;
  horseCount: number;
  date: string;
  startTime: string;
  horses: HeatHorse[];
};

type HeatType = 'Qualifier' | 'Quarterfinal' | 'Semifinal' | 'Final';

const registeredHorses = [
  { name: 'Sovereign Victory', breedAge: 'Thoroughbred · 5yo Stallion', jockey: 'James Whitaker', owner: 'Lord Winston Churchill', status: 'Approved' },
  { name: 'Emerald Legacy', breedAge: 'Thoroughbred · 4yo Mare', jockey: 'Elena Rossi', owner: 'Duke of Wellington', status: 'Approved' },
  { name: 'Gilded Thunder', breedAge: 'Arabian Cross · 6yo Stallion', jockey: 'Marcus Thorne', owner: 'Eleanor Rigby', status: 'Approved' },
  { name: 'Midnight Rose', breedAge: 'Thoroughbred · 3yo Mare', jockey: 'Julian Vane', owner: 'Sir Arthur Dayne', status: 'Approved' },
  { name: 'Royal Radiance', breedAge: 'Warmblood · 5yo Mare', jockey: 'Sarah Jenkins', owner: 'Lady Katherine', status: 'Approved' },
  { name: 'Velvet Gallop', breedAge: 'Thoroughbred · 4yo Gelding', jockey: 'Oliver Reed', owner: 'Baron von Richter', status: 'Approved' },
  { name: 'Majestic Wind', breedAge: 'Arabian · 5yo Stallion', jockey: 'Leo Sterling', owner: 'Countess of Kent', status: 'Approved' },
  { name: 'Golden Mane', breedAge: 'Thoroughbred · 6yo Stallion', jockey: 'Thomas Wright', owner: 'General Montgomery', status: 'Approved' },
  { name: 'Autumn Regent', breedAge: 'Thoroughbred · 4yo Gelding', jockey: 'Amelia Hart', owner: 'Helena Ward', status: 'Pending' },
  { name: 'Ivory Monarch', breedAge: 'Arabian Cross · 3yo Stallion', jockey: 'Noah Bennett', owner: 'Edward Sinclair', status: 'Approved' },
];

const referees = ['Michael Harrington', 'Amelia Clarke', 'Victor Nguyen', 'Sophia Bennett'];

function buildHeat(
  id: number,
  horseCount: number,
  referee: string,
  type: HeatType,
  date: string,
  startTime: string,
  prefill = false,
): RaceHeat {
  return {
    id,
    type,
    title: `${type} ${type === 'Final' ? '' : String.fromCharCode(64 + id)}`.trim(),
    referee,
    horseCount,
    date,
    startTime,
    horses: Array.from({ length: horseCount }, (_, index) => ({
      gate: index + 1,
      horseName: prefill ? registeredHorses[index]?.name ?? '' : '',
      rank: '',
    })),
  };
}

function formatRank(rank: number) {
  if (rank === 1) return '1st';
  if (rank === 2) return '2nd';
  if (rank === 3) return '3rd';
  return `${rank}th`;
}

function hasCompleteRefereeResults(heat: RaceHeat) {
  const enteredHorses = heat.horses.filter((horse) => horse.horseName);
  return enteredHorses.length === heat.horseCount && enteredHorses.every((horse) => horse.rank !== '');
}

export default function AdminManageTournamentDetail() {
  const { name } = useParams<RouteParams>();
  const [heats, setHeats] = React.useState<RaceHeat[]>([
    buildHeat(1, 8, 'Not Assigned', 'Qualifier', '2024-11-12', '14:00', true),
  ]);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [entriesOpen, setEntriesOpen] = React.useState(false);
  const [horseCount, setHorseCount] = React.useState(8);
  const [heatType, setHeatType] = React.useState<HeatType>('Qualifier');
  const [heatDate, setHeatDate] = React.useState('2024-11-12');
  const [startTime, setStartTime] = React.useState('14:00');
  const [referee, setReferee] = React.useState('Not Assigned');
  const [officialHeatId, setOfficialHeatId] = React.useState<number | null>(null);
  const [officialName, setOfficialName] = React.useState(referees[0]);
  const [actionMessage, setActionMessage] = React.useState('');
  const actionMessageTimer = React.useRef<number | null>(null);

  const totalRegistrations = registeredHorses.length;

  React.useEffect(() => () => {
    if (actionMessageTimer.current !== null) {
      window.clearTimeout(actionMessageTimer.current);
    }
  }, []);

  const showActionMessage = (message: string) => {
    setActionMessage(message);

    if (actionMessageTimer.current !== null) {
      window.clearTimeout(actionMessageTimer.current);
    }

    actionMessageTimer.current = window.setTimeout(() => {
      setActionMessage('');
      actionMessageTimer.current = null;
    }, 2800);
  };

  const handleCreateHeat = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextId = heats.length ? Math.max(...heats.map((heat) => heat.id)) + 1 : 1;

    setHeats((current) => [
      ...current,
      buildHeat(nextId, horseCount, referee, heatType, heatDate, startTime),
    ]);
    setCreateOpen(false);
  };

  const handleDeleteHeat = (heatId: number) => {
    setHeats((current) => current.filter((heat) => heat.id !== heatId));
  };

  const handleHorseChange = (heatId: number, gate: number, value: string) => {
    setHeats((current) =>
      current.map((heat) => {
        if (heat.id !== heatId) return heat;

        return {
          ...heat,
          horses: heat.horses.map((horse) => (
            horse.gate === gate ? { ...horse, horseName: value, rank: value ? horse.rank : '' } : horse
          )),
        };
      }),
    );
  };

  const handleRefereeChange = (heatId: number, value: string) => {
    setHeats((current) =>
      current.map((heat) => (heat.id === heatId ? { ...heat, referee: value } : heat)),
    );
  };

  const openAssignOfficial = (heat: RaceHeat) => {
    setOfficialHeatId(heat.id);
    setOfficialName(heat.referee === 'Not Assigned' ? referees[0] : heat.referee);
  };

  const handleAssignOfficial = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (officialHeatId === null) return;

    handleRefereeChange(officialHeatId, officialName);
    setOfficialHeatId(null);
    showActionMessage(`${officialName} has been assigned to this heat.`);
  };

  const handleSendStartList = (heat: RaceHeat) => {
    if (heat.referee === 'Not Assigned') {
      showActionMessage('Assign an official before sending the start list.');
      return;
    }

    showActionMessage(`Start list sent to ${heat.referee}.`);
  };

  const handleSaveDraft = (heat: RaceHeat) => {
    showActionMessage(`${heat.title} was saved as a draft.`);
  };

  const handlePublishRankings = (heat: RaceHeat) => {
    if (!hasCompleteRefereeResults(heat)) {
      showActionMessage('Rankings are pending until the referee submits the complete result.');
      return;
    }

    showActionMessage(`Rankings for ${heat.title} have been published.`);
  };

  return (
    <AdminLayout
      active="tournaments"
      breadcrumb={[
        { label: 'Tournaments', to: '/Admin/ManageTournaments' },
        { label: name ?? 'Tournament' },
      ]}
    >
    <div className="amtDetailPage">
      <div className="amtDetailWrap">
        <main className="amtDetailMain">
          <section className="amtDetailHero">
            <div className="amtDetailHeroBg">
              <img alt="Royal Ascot racecourse" className="amtDetailHeroImg" src={HomeBanner} />
              <div className="amtDetailHeroGradient" />
            </div>

            <div className="amtDetailHeroContent">
              <div className="amtDetailHeroLeft">
                <div className="amtDetailBadges">
                  <div className="amtBadge amtBadgeGold">PREMIUM EVENT</div>
                  <div className="amtBadge amtBadgeTeal">REGISTRATION OPEN</div>
                </div>
                <div className="amtDetailHeroTitle">{name ?? 'Royal Ascot Autumn Derby'}</div>
                <div className="amtDetailHeroDesc">
                  The pinnacle of the autumn racing season, where tradition meets speed. A gathering of elite breeders and thoroughbreds.
                </div>
              </div>

              <Link className="amtDetailEditBtn" to={`/Admin/ManageTournaments/edit/${encodeURIComponent(name ?? 'Tournament')}`}>
                Edit Tournament
              </Link>
            </div>
          </section>

          <section className="amtDetailGrid" aria-label="Tournament stats">
            <div className="amtDetailStat">
              <div className="amtDetailStatIcon">DATE</div>
              <div className="amtDetailStatLabel">DATE</div>
              <div className="amtDetailStatValue">Nov 12-15,<br />2024</div>
            </div>
            <div className="amtDetailStat">
              <div className="amtDetailStatIcon">M</div>
              <div className="amtDetailStatLabel">DISTANCE</div>
              <div className="amtDetailStatValue">2400m</div>
            </div>
            <div className="amtDetailStat">
              <div className="amtDetailStatIcon">$</div>
              <div className="amtDetailStatLabel">PRIZE POOL</div>
              <div className="amtDetailStatValue">$500,000</div>
            </div>
            <div className="amtDetailStat">
              <div className="amtDetailStatIcon">LOC</div>
              <div className="amtDetailStatLabel">LOCATION</div>
              <div className="amtDetailStatValue">Berkshire,<br />UK</div>
            </div>
          </section>

          <section className="amtDetailSection">
            <div className="amtDetailSectionHeader">
              <div>
                <div className="amtDetailSectionTitle">Race Management</div>
                <div className="amtDetailSectionDesc">Schedule heats, assign referees, manage participants, and record final standings.</div>
                <div className="amtDetailSectionMeta">
                  <div className="amtDetailMetaLabel">TOTAL REGISTRATIONS:</div>
                  <div className="amtDetailMetaPill">{totalRegistrations}/20</div>
                  <div className="amtDetailMetaPillSmall">REGISTRATION OPEN</div>
                </div>
              </div>

              <div className="amtDetailSectionActions">
                <button className="amtDetailViewEntries" type="button" onClick={() => setEntriesOpen(true)}>
                  <span aria-hidden="true">▦</span>
                  <span>View Entries</span>
                </button>
                <button className="amtDetailCreateHeat" type="button" onClick={() => setCreateOpen(true)}>
                  <span aria-hidden="true">+</span>
                  <span>Create Race Heat</span>
                </button>
              </div>
            </div>

            {heats.length === 0 ? (
              <div className="amtNoHeatState">No race heats yet.</div>
            ) : (
              heats.map((heat) => (
                <article className="amtHeatCard" key={heat.id}>
                  <div className="amtHeatCardHeader">
                    <div className="amtHeatHeaderLeft">
                      <div className="amtHeatHeaderBar" aria-hidden="true" />
                      <div>
                        <div className="amtHeatTitle">Heat: {heat.title}</div>
                        <div className="amtHeatMeta">
                          <span className="amtHeatSlots">
                            {heat.horses.filter((horse) => horse.horseName).length} / {heat.horseCount} SLOTS FILLED
                          </span>
                          <span>{heat.date} · {heat.startTime}</span>
                          <span className={hasCompleteRefereeResults(heat) ? 'amtHeatResultState amtHeatResultStateReady' : 'amtHeatResultState'}>
                            {hasCompleteRefereeResults(heat) ? 'RESULTS RECEIVED' : 'AWAITING REFEREE RESULTS'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="amtHeatHeaderActions">
                      <button className="amtHeatActionBtn" type="button">Edit Heat Details</button>
                      <button className="amtHeatActionBtn amtHeatActionBtnDanger" type="button" onClick={() => handleDeleteHeat(heat.id)}>Delete</button>
                    </div>
                  </div>

                  <div className="amtHeatTable">
                    <div className="amtHeatTableHead">
                      <div className="amtHeatRowHead">
                        <div className="amtHeatCellHead">GATE</div>
                        <div className="amtHeatCellHead">HORSE NAME</div>
                        <div className="amtHeatCellHead">JOCKEY</div>
                        <div className="amtHeatCellHead">OWNER</div>
                        <div className="amtHeatCellHead amtHeatCellHeadRight">FINAL RANK</div>
                      </div>
                    </div>

                    <div className="amtHeatBody">
                      {heat.horses.map((horse) => {
                        const selectedHorseNames = heat.horses.filter((item) => item.gate !== horse.gate).map((item) => item.horseName);
                        const selectedHorse = registeredHorses.find((item) => item.name === horse.horseName);

                        return (
                          <div key={horse.gate} className="amtHeatRow">
                            <div className="amtHeatCell amtHeatCellGate">{horse.gate}</div>
                            <div className="amtHeatCell amtHeatCellHorse">
                              <select className="amtAssignHorseSelect" value={horse.horseName} onChange={(event) => handleHorseChange(heat.id, horse.gate, event.target.value)}>
                                <option value="">Select registered horse</option>
                                {registeredHorses.map((registeredHorse) => (
                                  <option key={registeredHorse.name} value={registeredHorse.name} disabled={selectedHorseNames.includes(registeredHorse.name)}>
                                    {registeredHorse.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="amtHeatCell amtHeatCellOwner">
                              <div className="amtHeatOwnerName">{selectedHorse?.jockey ?? '-'}</div>
                            </div>
                            <div className="amtHeatCell amtHeatCellOwner">
                              <div className="amtHeatOwnerName">{selectedHorse?.owner ?? '-'}</div>
                            </div>
                            <div className="amtHeatCell amtHeatCellRank">
                              {hasCompleteRefereeResults(heat) && horse.rank !== '' ? (
                                <span className="amtRankBadge amtRankBadgeReady">{formatRank(horse.rank)}</span>
                              ) : (
                                <span className="amtRankBadge">Pending</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="amtHeatOfficialRow">
                      <div className="amtHeatOfficialInfo">
                        <span className="amtHeatOfficialIcon" aria-hidden="true">♙</span>
                        <span>
                          <small>ASSIGNED REFEREE</small>
                          <strong>{heat.referee}</strong>
                        </span>
                      </div>
                      <button type="button" className="amtAssignOfficialBtn" onClick={() => openAssignOfficial(heat)}>
                        Assign Official
                      </button>
                    </div>

                    <div className="amtHeatActionBar">
                      <button type="button" className="amtHeatFooterBtn amtSendStartBtn" onClick={() => handleSendStartList(heat)}>
                        <span aria-hidden="true">▷</span>
                        Send Start List to Referee
                      </button>
                      <button type="button" className="amtHeatFooterBtn amtDraftBtn" onClick={() => handleSaveDraft(heat)}>
                        Save Draft
                      </button>
                      <button type="button" className="amtHeatFooterBtn amtPublishBtn" onClick={() => handlePublishRankings(heat)}>
                        <span aria-hidden="true">↥</span>
                        Publish Rankings
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        </main>
      </div>

      {createOpen ? (
        <div className="amtModalOverlay" role="presentation">
          <form className="amtCreateHeatModal" onSubmit={handleCreateHeat}>
            <div className="amtModalHeader">
              <div>
                <div className="amtModalTitle">Create Race Heat</div>
                <div className="amtModalDesc">Configure the race round, horse capacity, date, and starting time.</div>
              </div>
              <button className="amtModalClose" type="button" aria-label="Close" onClick={() => setCreateOpen(false)}>x</button>
            </div>

            <label className="amtModalField">
              <span>Race round</span>
              <select value={heatType} onChange={(event) => setHeatType(event.target.value as HeatType)}>
                <option value="Qualifier">Qualifier</option>
                <option value="Quarterfinal">Quarterfinal</option>
                <option value="Semifinal">Semifinal</option>
                <option value="Final">Final</option>
              </select>
            </label>

            <label className="amtModalField">
              <span>Number of horses</span>
              <select value={horseCount} onChange={(event) => setHorseCount(Number(event.target.value))}>
                {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (
                  <option key={count} value={count}>{count}</option>
                ))}
              </select>
            </label>

            <div className="amtModalFieldGrid">
              <label className="amtModalField">
                <span>Race date</span>
                <input type="date" required value={heatDate} onChange={(event) => setHeatDate(event.target.value)} />
              </label>
              <label className="amtModalField">
                <span>Start time</span>
                <input type="time" required value={startTime} onChange={(event) => setStartTime(event.target.value)} />
              </label>
            </div>

            <label className="amtModalField">
              <span>Assign referee (optional)</span>
              <select value={referee} onChange={(event) => setReferee(event.target.value)}>
                <option value="Not Assigned">Not Assigned</option>
                {referees.map((refereeName) => (
                  <option key={refereeName} value={refereeName}>{refereeName}</option>
                ))}
              </select>
            </label>

            <div className="amtModalActions">
              <button className="amtModalSecondary" type="button" onClick={() => setCreateOpen(false)}>Cancel</button>
              <button className="amtModalPrimary" type="submit">Create Heat</button>
            </div>
          </form>
        </div>
      ) : null}

      {entriesOpen ? (
        <div className="amtModalOverlay" role="presentation" onMouseDown={() => setEntriesOpen(false)}>
          <section className="amtEntriesModal" role="dialog" aria-modal="true" aria-labelledby="entries-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="amtModalHeader">
              <div>
                <div className="amtModalTitle" id="entries-modal-title">Tournament Entries</div>
                <div className="amtModalDesc">{registeredHorses.length} horses registered for {name ?? 'Royal Ascot Autumn Derby'}.</div>
              </div>
              <button className="amtModalClose" type="button" aria-label="Close entries" onClick={() => setEntriesOpen(false)}>×</button>
            </div>
            <div className="amtEntriesTableScroll">
              <div className="amtEntriesTable">
                <div className="amtEntriesTableHead">
                  <span>#</span><span>Horse</span><span>Breed / Age</span><span>Jockey</span><span>Owner</span><span>Status</span>
                </div>
                {registeredHorses.map((horse, index) => (
                  <article key={horse.name}>
                    <span>{index + 1}</span>
                    <strong>{horse.name}</strong>
                    <span>{horse.breedAge}</span>
                    <span>{horse.jockey}</span>
                    <span>{horse.owner}</span>
                    <i className={horse.status.toLowerCase()}>{horse.status}</i>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {officialHeatId !== null ? (
        <div className="amtModalOverlay" role="presentation" onMouseDown={() => setOfficialHeatId(null)}>
          <form className="amtCreateHeatModal" onSubmit={handleAssignOfficial} onMouseDown={(event) => event.stopPropagation()}>
            <div className="amtModalHeader">
              <div>
                <div className="amtModalTitle">Assign Official</div>
                <div className="amtModalDesc">Select the referee responsible for this race heat.</div>
              </div>
              <button className="amtModalClose" type="button" aria-label="Close official assignment" onClick={() => setOfficialHeatId(null)}>×</button>
            </div>

            <label className="amtModalField">
              <span>Referee</span>
              <select value={officialName} onChange={(event) => setOfficialName(event.target.value)}>
                {referees.map((refereeName) => (
                  <option key={refereeName} value={refereeName}>{refereeName}</option>
                ))}
              </select>
            </label>

            <div className="amtModalActions">
              <button className="amtModalSecondary" type="button" onClick={() => setOfficialHeatId(null)}>Cancel</button>
              <button className="amtModalPrimary" type="submit">Assign Official</button>
            </div>
          </form>
        </div>
      ) : null}

      {actionMessage ? (
        <div className="amtActionToast" role="status" aria-live="polite">{actionMessage}</div>
      ) : null}
    </div>
    </AdminLayout>
  );
}
