import React from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout.tsx';

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
  title: string;
  referee: string;
  horseCount: number;
  horses: HeatHorse[];
};

const registeredHorses = [
  { name: 'Sovereign Victory', owner: 'Lord Winston Churchill' },
  { name: 'Emerald Legacy', owner: 'Duke of Wellington' },
  { name: 'Gilded Thunder', owner: 'Eleanor Rigby' },
  { name: 'Midnight Rose', owner: 'Sir Arthur Dayne' },
  { name: 'Royal Radiance', owner: 'Lady Katherine' },
  { name: 'Velvet Gallop', owner: 'Baron von Richter' },
  { name: 'Majestic Wind', owner: 'Countess of Kent' },
  { name: 'Golden Mane', owner: 'General Montgomery' },
];

const referees = ['Michael Harrington', 'Amelia Clarke', 'Victor Nguyen', 'Sophia Bennett'];

function buildHeat(id: number, horseCount: number, referee: string): RaceHeat {
  return {
    id,
    title: `Qualifier ${String.fromCharCode(64 + id)}`,
    referee,
    horseCount,
    horses: Array.from({ length: horseCount }, (_, index) => ({
      gate: index + 1,
      horseName: '',
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

export default function AdminManageTournamentDetail() {
  const { name } = useParams<RouteParams>();
  const [heats, setHeats] = React.useState<RaceHeat[]>([buildHeat(1, 8, referees[0])]);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [horseCount, setHorseCount] = React.useState(8);
  const [referee, setReferee] = React.useState(referees[0]);
  const [saved, setSaved] = React.useState(false);

  const totalRegistrations = registeredHorses.length;

  const handleCreateHeat = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextId = heats.length ? Math.max(...heats.map((heat) => heat.id)) + 1 : 1;

    setHeats((current) => [...current, buildHeat(nextId, horseCount, referee)]);
    setCreateOpen(false);
  };

  const handleDeleteHeat = (heatId: number) => {
    setHeats((current) => current.filter((heat) => heat.id !== heatId));
  };

  const handleRankChange = (heatId: number, gate: number, value: string) => {
    const nextRank = value === '' ? '' : Number(value);

    setHeats((current) =>
      current.map((heat) => {
        if (heat.id !== heatId) return heat;

        return {
          ...heat,
          horses: heat.horses.map((horse) => (horse.gate === gate ? { ...horse, rank: nextRank } : horse)),
        };
      }),
    );
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

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
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
              <img alt="tournament hero" className="amtDetailHeroImg" src="https://placehold.co/896x320" />
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

              <button className="amtDetailCreateHeat" type="button" onClick={() => setCreateOpen(true)}>
                <span aria-hidden="true">+</span>
                <span>Create Race Heat</span>
              </button>
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
                        <div className="amtHeatSlots">
                          {heat.horses.filter((horse) => horse.horseName).length} / {heat.horseCount} SLOTS FILLED
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
                        <div className="amtHeatCellHead">OWNER</div>
                        <div className="amtHeatCellHead amtHeatCellHeadRight">FINAL RANK</div>
                      </div>
                    </div>

                    <div className="amtHeatBody">
                      {heat.horses.map((horse) => {
                        const selectedHorseNames = heat.horses.filter((item) => item.gate !== horse.gate).map((item) => item.horseName);
                        const usedRanks = heat.horses.filter((item) => item.gate !== horse.gate).map((item) => item.rank);
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
                              <div className="amtHeatOwnerName">{selectedHorse?.owner ?? '-'}</div>
                            </div>
                            <div className="amtHeatCell amtHeatCellRank">
                              <select className="amtAssignRankSelect" value={horse.rank} disabled={!horse.horseName} onChange={(event) => handleRankChange(heat.id, horse.gate, event.target.value)}>
                                <option value="">Assign Rank</option>
                                {Array.from({ length: heat.horseCount }, (_, index) => index + 1).map((rank) => (
                                  <option key={rank} value={rank} disabled={usedRanks.includes(rank)}>
                                    {formatRank(rank)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="amtHeatFooter">
                      <label className="amtHeatRefereeControl">
                        <span>Referee</span>
                        <select value={heat.referee} onChange={(event) => handleRefereeChange(heat.id, event.target.value)}>
                          {referees.map((refereeName) => (
                            <option key={refereeName} value={refereeName}>{refereeName}</option>
                          ))}
                        </select>
                      </label>
                      {saved ? <span className="amtSavedState">Saved</span> : null}
                      <button type="button" className="amtSaveRankBtn" onClick={handleSave}>Save</button>
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
                <div className="amtModalDesc">Choose the number of horses and assign a referee for this heat.</div>
              </div>
              <button className="amtModalClose" type="button" aria-label="Close" onClick={() => setCreateOpen(false)}>x</button>
            </div>

            <label className="amtModalField">
              <span>Number of horses</span>
              <select value={horseCount} onChange={(event) => setHorseCount(Number(event.target.value))}>
                {Array.from({ length: 8 }, (_, index) => index + 1).map((count) => (
                  <option key={count} value={count}>{count}</option>
                ))}
              </select>
            </label>

            <label className="amtModalField">
              <span>Assign referee</span>
              <select value={referee} onChange={(event) => setReferee(event.target.value)}>
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
    </div>
    </AdminLayout>
  );
}
