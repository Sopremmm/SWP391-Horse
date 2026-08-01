import React from 'react';
import { useParams } from 'react-router-dom';
import AdminRaceIncidentDetail from './admin/AdminRaceIncidentDetail.tsx';
import AdminRaceIncidentLog from './admin/AdminRaceIncidentLog.tsx';
import JockeyHome from './jockey/JockeyHome.tsx';
import JockeyHorseDetail from './jockey/JockeyHorseDetail.tsx';
import JockeyHorseLeaderboard from './jockey/JockeyHorseLeaderboard.tsx';
import JockeyInvitationDetail from './jockey/JockeyInvitationDetail.tsx';
import JockeyInvitationPage from './jockey/JockeyInvitationPage.tsx';
import JockeyNotifications from './jockey/JockeyNotifications.tsx';
import JockeyMyRace from './jockey/JockeyMyRace.tsx';
import JockeyProfilePage from './jockey/JockeyProfilePage.tsx';
import JockeyProfileView from './jockey/JockeyProfileView.tsx';
import JockeyRaceDetail from './jockey/JockeyRaceDetail.tsx';
import JockeyTournamentDetail from './jockey/JockeyTournamentDetail.tsx';
import JockeyTournaments from './jockey/JockeyTournaments.tsx';
import HorseOwnerRaceDetail from './horse-owner/HorseOwnerRaceDetail.tsx';
import RefereeHome from './referee/RefereeHome.tsx';
import RefereeNotifications from './referee/RefereeNotifications.tsx';
import RefereeRaceDetail from './referee/RefereeRaceDetail.tsx';
import RefereeRaces from './referee/RefereeRaces.tsx';
import SpectatorHome from './spectator/SpectatorHome.tsx';
import SpectatorHorseDetail from './spectator/SpectatorHorseDetail.tsx';
import SpectatorProfile from './spectator/SpectatorProfile.tsx';
import SpectatorHorses from './spectator/SpectatorHorses.tsx';
import SpectatorRaceDetail from './spectator/SpectatorRaceDetail.tsx';
import SpectatorTournament from './spectator/SpectatorTournament.tsx';
import SpectatorTournamentDetail from './spectator/SpectatorTournamentDetail.tsx';
import { getCurrentUser } from '../services/auth.ts';
import {
  fetchAllTournaments,
  fetchAdminPendingReports,
  fetchAdminPublishableReports,
  fetchAdminRaceReport,
  confirmAdminRaceReport,
  publishAdminRaceResults,
  fetchEntriesByTournament,
  fetchNotifications,
  fetchJockeyProfile,
  fetchJockeyInvitations,
  markNotificationRead,
  fetchPublicRaceResults,
  fetchRaceResults,
  fetchRacesByTournament,
  fetchAssignedRefereeRaces,
  fetchRefereeEntries,
  fetchRefereeRaceResults,
  fetchRefereeReport,
  recordRefereeViolation,
  submitRefereeReport,
  updateRefereeCheckIn,
  updateRefereeNoShow,
  upsertRefereeRaceResults,
  respondToInvitation,
  formatCurrency,
  formatDate,
  formatDateRange,
  formatDateTime,
  saveJockeyProfile,
  slugify,
} from '../services/integration.ts';

const MAX_JOCKEY_AVATAR_FILE_SIZE = 5 * 1024 * 1024;
const MAX_JOCKEY_AVATAR_DIMENSION = 800;

async function jockeyAvatarToDataUrl(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Profile photo must be a PNG, JPEG, or WebP image.');
  }
  if (file.size > MAX_JOCKEY_AVATAR_FILE_SIZE) {
    throw new Error('Profile photo must be 5 MB or smaller.');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () => reject(new Error('The selected profile photo could not be read.'));
      nextImage.src = objectUrl;
    });

    const scale = Math.min(1, MAX_JOCKEY_AVATAR_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('The profile photo could not be processed.');

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    return canvas.toDataURL(outputType, 0.85);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
function mapInvitation(item: Awaited<ReturnType<typeof fetchJockeyInvitations>>[number]) {
  return {
    id: String(item.id),
    horseName: item.horse?.name || 'Horse',
    stableName: item.owner?.fullName || 'Owner',
    tournamentName: item.race?.tournament?.name || 'Tournament',
    raceDate: formatDateTime(item.race?.raceDate),
    status:
      item.status === 'ACCEPTED'
        ? 'accepted'
        : item.status === 'DECLINED'
          ? 'declined'
          : 'pending',
    ownerName: item.owner?.fullName,
    message: item.message || '',
    horseBreed: item.horse?.breed,
    horseAge: item.horse?.age,
    horseImageUrl: item.horse?.imageUrl,
    responseDeadline: formatDateTime(item.expiresAt),
    prize: item.race?.tournament?.prizePool ? formatCurrency(item.race.tournament.prizePool) : undefined,
    location: item.race?.tournament?.location,
    contact: item.owner?.email,
    horseWinRate:
      item.horse?.totalRaces && item.horse.totalRaces > 0
        ? Math.round(((item.horse.totalWins || 0) / item.horse.totalRaces) * 100)
        : undefined,
  };
}

function formatRaceTime(milliseconds?: number) {
  if (!milliseconds || milliseconds <= 0) return '';
  const minutes = Math.floor(milliseconds / 60_000);
  const seconds = Math.floor((milliseconds % 60_000) / 1_000);
  const remainingMilliseconds = milliseconds % 1_000;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(remainingMilliseconds).padStart(3, '0')}`;
}

function parseRaceTime(value: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?$/);
  if (!match) throw new Error('Finish time must use mm:ss.mmm, for example 01:42.350.');
  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  const milliseconds = Number((match[3] || '0').padEnd(3, '0'));
  if (seconds >= 60) throw new Error('Finish time seconds must be less than 60.');
  return (minutes * 60_000) + (seconds * 1_000) + milliseconds;
}

function useAsyncData<T>(loader: () => Promise<T>, deps: React.DependencyList) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await loader();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Request failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, loading, error };
}

export function ConnectedJockeyInvitationPage() {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { data, loading } = useAsyncData(async () => {
    const invitations = await fetchJockeyInvitations();
    return invitations.map(mapInvitation);
  }, [refreshKey]);

  return (
    <JockeyInvitationPage
      invitations={data || []}
      loading={loading}
      onDecision={async (id, decision) => {
        await respondToInvitation(Number(id), decision === 'accepted' ? 'ACCEPTED' : 'DECLINED');
        setRefreshKey((value) => value + 1);
      }}
    />
  );
}

export function ConnectedJockeyInvitationDetail() {
  const params = useParams();
  const invitationId = String(params.id || params.tournamentname || '');
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { data, loading } = useAsyncData(async () => {
    const invitations = await fetchJockeyInvitations();
    const invitation = invitations.find((item) => String(item.id) === invitationId);
    return invitation ? mapInvitation(invitation) : null;
  }, [invitationId, refreshKey]);

  return (
    <JockeyInvitationDetail
      invitation={data}
      onDecision={async (id, decision) => {
        await respondToInvitation(Number(id), decision === 'accepted' ? 'ACCEPTED' : 'DECLINED');
        setRefreshKey((value) => value + 1);
      }}
    />
  );
}

export function ConnectedJockeyHome() {
  const user = getCurrentUser();
  const { data, loading } = useAsyncData(async () => {
    const [profile, invitations, tournaments] = await Promise.all([
      fetchJockeyProfile().catch(() => null),
      fetchJockeyInvitations().catch(() => []),
      fetchAllTournaments().catch(() => []),
    ]);

    const currentInvitations = invitations.map(mapInvitation);
    const featuredInvitation = currentInvitations.find((item) => item.status === 'pending') || currentInvitations[0];
    const leaderboardTournaments = await Promise.all(
      tournaments.slice(0, 3).map(async (tournament) => ({
        tournament,
        entries: await fetchEntriesByTournament(tournament.id).catch(() => []),
      })),
    );
    const topHorses = leaderboardTournaments
      .flatMap(({ entries }) => entries)
      .filter((entry) => entry.horse?.id)
      .sort((a, b) => (b.horse.totalWins || 0) - (a.horse.totalWins || 0))
      .slice(0, 5);

    const totalRaces = profile?.totalRaces || 0;
    const totalWins = profile?.totalWins || 0;

    return {
      jockeyName: user?.fullName || profile?.user?.fullName || 'Jockey',
      intro: 'Your invitations, performance statistics, and horse leaderboard are synced from the backend.',
      featuredEvent: featuredInvitation
        ? {
            label: featuredInvitation.status === 'pending' ? 'Pending Invitation' : 'Latest Invitation',
            title: `${featuredInvitation.horseName} • ${featuredInvitation.tournamentName || 'Tournament'}`,
            description: featuredInvitation.message || 'Review this race invitation and respond from your dashboard.',
            imageUrl: featuredInvitation.horseImageUrl,
            invitationUrl: `/Jockey/Invitation/${encodeURIComponent(featuredInvitation.id)}`,
          }
        : null,
      stats: [
        { id: 'invitations', label: 'Invitations', value: currentInvitations.length },
        { id: 'races', label: 'Total Races', value: totalRaces },
        {
          id: 'win-rate',
          label: 'Win Rate',
          value: totalRaces > 0 ? Math.round((totalWins / totalRaces) * 100) : 0,
          suffix: '%',
        },
      ],
      invitations: currentInvitations.slice(0, 4).map((item) => ({
        id: item.id,
        horseName: item.horseName,
        stableName: item.stableName,
        raceName: item.tournamentName,
        raceDate: item.raceDate,
        horseImageUrl: item.horseImageUrl,
        invitationUrl: `/Jockey/Invitation/${encodeURIComponent(item.id)}`,
      })),
      leaderboard: topHorses.map((entry, index) => ({
        id: String(entry.horse.id),
        rank: index + 1,
        horseName: entry.horse.name,
        breed: entry.horse.breed,
      })),
    };
  }, [user?.id]);

  return <JockeyHome data={data} loading={loading} />;
}

export function ConnectedJockeyNotifications() {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { data, loading, error } = useAsyncData(async () => {
    const notifications = await fetchNotifications();
    return notifications
      .filter((item) => item.refType === 'JOCKEY_INVITATION' || item.type === 'JOCKEY_INVITE' || item.title?.includes('Invitation'))
      .map((item) => ({
        id: item.id,
        title: item.title,
        message: item.message,
        createdAt: formatDateTime(item.createdAt),
        read: item.isRead,
        type: item.refType === 'JOCKEY_INVITATION' ? 'invitation' as const : 'update' as const,
        targetUrl: item.refId ? `/Jockey/Invitation/${encodeURIComponent(String(item.refId))}` : '/Jockey/Invitations',
      }));
  }, [refreshKey]);

  return (
    <JockeyNotifications
      notifications={data || []}
      loading={loading}
      error={error}
      onAcknowledge={async (notification) => {
        await markNotificationRead(Number(notification.id));
        setRefreshKey((value) => value + 1);
      }}
      onMarkAllRead={async (notifications) => {
        await Promise.all(
          notifications
            .filter((item) => !item.read)
            .map(async (item) => markNotificationRead(Number(item.id)).catch(() => undefined)),
        );
        setRefreshKey((value) => value + 1);
      }}
    />
  );
}

export function ConnectedJockeyProfileView() {
  const user = getCurrentUser();
  const { data, loading } = useAsyncData(async () => {
    const profile = await fetchJockeyProfile().catch(() => null);
    if (!profile && !user) return null;

    return {
      name: profile?.user?.fullName || user?.fullName || 'Jockey',
      imageUrl: profile?.user?.avatarUrl,
      active: profile?.active !== false,
      license: profile?.licenseNumber,
      age: profile?.age,
      gender: profile?.gender,
      experienceYears: profile?.experienceYears,
      biography: profile?.bio,
      winRate:
        profile?.totalRaces && profile.totalRaces > 0
          ? Math.round(((profile.totalWins || 0) / profile.totalRaces) * 100)
          : 0,
      totalRaces: profile?.totalRaces,
      hiringPrice: profile?.invitationRate !== undefined ? formatCurrency(profile.invitationRate) : 'Managed by stable owners',
    };
  }, [user?.id]);

  return <JockeyProfileView profile={data} loading={loading} />;
}

export function ConnectedJockeyProfilePage() {
  const user = getCurrentUser();
  const { data, loading } = useAsyncData(async () => {
    const profile = await fetchJockeyProfile().catch(() => null);
    return {
      fullName: profile?.user?.fullName || user?.fullName || '',
      avatarUrl: profile?.user?.avatarUrl,
      age: profile?.age,
      gender: profile?.gender,
      professionalStatus: profile?.active ? 'Active' : 'Unavailable',
      bio: profile?.bio || '',
      invitationRate: profile?.invitationRate !== undefined ? String(profile.invitationRate) : '',
      internationalTravel: Boolean(profile?.internationalTravel),
      experienceYears: profile?.experienceYears,
      totalRaces: profile?.totalRaces,
      winRate:
        profile?.totalRaces && profile.totalRaces > 0
          ? Math.round(((profile.totalWins || 0) / profile.totalRaces) * 100)
          : 0,
      roleTitle: 'Professional Jockey',
      licenseNumber: profile?.licenseNumber,
      weightKg: profile?.weightKg,
    };
  }, [user?.id]);

  return (
    <JockeyProfilePage
      profile={data}
      onSave={async (profile, avatarFile) => {
        const avatarUrl = avatarFile ? await jockeyAvatarToDataUrl(avatarFile) : profile.avatarUrl;
        await saveJockeyProfile({
          avatarUrl,
          fullName: profile.fullName,
          age: profile.age,
          gender: profile.gender,
          invitationRate: profile.invitationRate ? Number(profile.invitationRate) : undefined,
          internationalTravel: Boolean(profile.internationalTravel),
          licenseNumber:
            (data as typeof data & { licenseNumber?: string })?.licenseNumber ||
            `${(user?.fullName || user?.email || 'jockey').replace(/[^A-Z0-9]+/gi, '-').toUpperCase()}-LICENSE`,
          weightKg: (data as typeof data & { weightKg?: number })?.weightKg || 0,
          experienceYears: profile.experienceYears || 0,
          bio: profile.bio || '',
          active: profile.professionalStatus === 'Active',
          totalRaces: data?.totalRaces || 0,
          totalWins:
            data?.totalRaces && data.totalRaces > 0 && profile.winRate !== undefined
              ? Math.round((profile.winRate / 100) * data.totalRaces)
              : 0,
        });
      }}
    />
  );
}

export function ConnectedJockeyTournaments() {
  const { data, loading } = useAsyncData(async () => {
    const tournaments = await fetchAllTournaments();
    const sorted = [...tournaments].sort(
      (a, b) => new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime(),
    );

    const mapped = sorted.map((item) => ({
      id: String(item.id),
      name: item.name,
      description: item.description,
      status: item.status,
      dateLabel: formatDateRange(item.startDate, item.endDate),
      startDate: item.startDate,
      prizePool: formatCurrency(item.prizePool),
      detailsUrl: `/Jockey/Tournaments/${encodeURIComponent(item.name)}`,
    }));

    return {
      featured: mapped.slice(0, 2),
      tournaments: mapped,
    };
  }, []);

  return <JockeyTournaments data={data} loading={loading} />;
}

export function ConnectedJockeyTournamentDetail() {
  const params = useParams();
  const slug = slugify(decodeURIComponent(params.name || ''));
  const { data, loading } = useAsyncData(async () => {
    const tournaments = await fetchAllTournaments();
    const tournament = tournaments.find((item) => slugify(item.name) === slug);
    if (!tournament) return null;
    const races = await fetchRacesByTournament(tournament.id);

    return {
      name: tournament.name,
      label: 'Heritage Racing presents',
      location: tournament.location,
      dateRange: formatDateRange(tournament.startDate, tournament.endDate),
      races: races.map((race) => ({
        id: String(race.id),
        name: race.name,
        round: race.roundNumber === 1 ? 'qualifying' : race.roundNumber === 2 ? 'semifinal' : 'final',
        dateTime: formatDateTime(race.raceDate),
        distance: race.distanceM ? `${race.distanceM}M` : 'TBA',
        status:
          race.status === 'ONGOING'
            ? 'live'
            : race.status === 'COMPLETED' || race.status === 'FINISHED'
              ? 'completed'
              : 'upcoming',
        venue: tournament.location,
      })),
    };
  }, [slug]);

  return <JockeyTournamentDetail data={data} loading={loading} />;
}

export function ConnectedJockeyRaceDetail() {
  const params = useParams();
  const tournamentSlug = slugify(decodeURIComponent(params.name || ''));
  const raceSlug = slugify(decodeURIComponent(params.race || ''));
  const user = getCurrentUser();
  const { data, loading } = useAsyncData(async () => {
    const tournaments = await fetchAllTournaments();
    const tournament = tournaments.find((item) => slugify(item.name) === tournamentSlug);
    if (!tournament) return null;

    const [races, entries, results] = await Promise.all([
      fetchRacesByTournament(tournament.id),
      fetchEntriesByTournament(tournament.id),
      fetchRacesByTournament(tournament.id).then(async (items) => {
        const race = items.find((item) => slugify(item.name) === raceSlug);
        return race ? fetchRaceResults(race.id).catch(() => []) : [];
      }),
    ]);
    const race = races.find((item) => slugify(item.name) === raceSlug);
    if (!race) return null;

    return {
      raceId: race.id,
      tournamentName: tournament.name,
      raceName: race.name,
      statusLabel: race.status || 'Scheduled',
      dateTime: formatDateTime(race.raceDate),
      distance: race.distanceM ? `${race.distanceM}M` : 'TBA',
      venue: tournament.location,
      lineup: entries
        .filter((entry) => entry.race?.id === race.id || !entry.race)
        .map((entry, index) => {
          const result = results.find((item) => item.entryId === entry.id);
          return {
            id: String(entry.id),
            gate: index + 1,
            horseName: entry.horse?.name,
            breed: entry.horse?.breed,
            sex: entry.horse?.color,
            ownerName: entry.horse?.owner?.fullName,
            jockeyName: entry.jockey?.fullName || 'Unassigned',
            finishTime: result?.finishTimeMs ? `${result.finishTimeMs} ms` : undefined,
            rankLabel: result?.finishRank ? `#${result.finishRank}` : undefined,
            isCurrentJockey: Boolean(entry.jockey?.id && entry.jockey.id === user?.id),
          };
        }),
    };
  }, [raceSlug, tournamentSlug, user?.id]);

  return <JockeyRaceDetail data={data} loading={loading} />;
}

export function ConnectedJockeyMyRace() {
  const user = getCurrentUser();
  const { data, loading } = useAsyncData(async () => {
    const tournaments = await fetchAllTournaments();
    const nested = await Promise.all(
      tournaments.map(async (tournament) => {
        const [races, entries, resultsByRace] = await Promise.all([
          fetchRacesByTournament(tournament.id).catch(() => []),
          fetchEntriesByTournament(tournament.id).catch(() => []),
          fetchRacesByTournament(tournament.id)
            .then(async (items) =>
              Promise.all(items.map(async (race) => ({ raceId: race.id, results: await fetchRaceResults(race.id).catch(() => []) }))),
            )
            .catch(() => []),
        ]);
        return { tournament, races, entries, resultsByRace };
      }),
    );

    const assignments = nested.flatMap(({ tournament, races, entries, resultsByRace }) =>
      entries
        .filter((entry) => entry.jockey?.id === user?.id)
        .map((entry) => {
          const race = races.find((item) => item.id === entry.race?.id) || entry.race;
          const result = resultsByRace.find((item) => item.raceId === race?.id)?.results.find((item) => item.entryId === entry.id);
          const status = race?.status === 'COMPLETED' || race?.status === 'FINISHED' ? 'completed' : 'upcoming';
          return {
            id: String(entry.id),
            tournamentName: tournament.name,
            raceName: race?.name || 'Race',
            seriesName: tournament.location,
            distance: race?.distanceM ? `${race.distanceM}M` : 'TBA',
            horseName: entry.horse?.name,
            horseImageUrl: entry.horse?.imageUrl,
            horseBreed: entry.horse?.breed,
            horseSex: entry.horse?.color,
            position: result?.finishRank,
            status,
          } as const;
        }),
    );

    const completed = assignments.filter((item) => item.status === 'completed');
    const wins = completed.filter((item) => item.position === 1).length;

    return {
      assignments,
      totalRaces: assignments.length,
      winRate: completed.length ? Math.round((wins / completed.length) * 100) : 0,
      total: assignments.length,
    };
  }, [user?.id]);

  return <JockeyMyRace data={data} loading={loading} />;
}

export function ConnectedJockeyHorseLeaderboard() {
  const { data, loading } = useAsyncData(async () => {
    const tournaments = await fetchAllTournaments();
    const entries = (
      await Promise.all(tournaments.map(async (tournament) => fetchEntriesByTournament(tournament.id).catch(() => [])))
    ).flat();

    const uniqueHorses = Array.from(
      new Map(entries.filter((entry) => entry.horse?.id).map((entry) => [String(entry.horse.id), entry])).values(),
    ).sort((a, b) => (b.horse.totalWins || 0) - (a.horse.totalWins || 0));

    return {
      season: String(new Date().getFullYear()),
      total: uniqueHorses.length,
      horses: uniqueHorses.map((entry, index) => ({
        id: String(entry.horse.id),
        rank: index + 1,
        name: entry.horse.name,
        imageUrl: entry.horse.imageUrl,
        ownerName: entry.horse.owner?.fullName,
        breed: entry.horse.breed,
        origin: entry.tournament?.location,
        age: entry.horse.age,
        winRatio:
          entry.horse.totalRaces && entry.horse.totalRaces > 0
            ? Math.round(((entry.horse.totalWins || 0) / entry.horse.totalRaces) * 100)
            : 0,
        totalStarts: entry.horse.totalRaces,
        lastPlace: `${entry.horse.totalWins || 0} Wins`,
        lastRace: entry.tournament?.name,
      })),
    };
  }, []);

  return <JockeyHorseLeaderboard data={data} loading={loading} />;
}

export function ConnectedJockeyHorseDetail() {
  const params = useParams();
  const horseSlug = slugify(decodeURIComponent(params.name || ''));
  const { data, loading, error } = useAsyncData(async () => {
    const tournaments = await fetchAllTournaments();
    const nested = await Promise.all(
      tournaments.map(async (tournament) => ({
        tournament,
        entries: await fetchEntriesByTournament(tournament.id).catch(() => []),
      })),
    );

    const selected = nested
      .flatMap(({ tournament, entries }) => entries.map((entry) => ({ tournament, entry })))
      .find(({ entry }) => slugify(entry.horse?.name || '') === horseSlug);

    if (!selected?.entry.horse) return null;

    const relatedHistory = nested
      .flatMap(({ tournament, entries }) =>
        entries
          .filter((entry) => entry.horse?.id === selected.entry.horse.id)
          .map((entry) => ({
            raceName: entry.race?.name || 'Race',
            horse: entry.horse?.name || 'Horse',
            position: entry.status || 'Pending',
            earnings: formatCurrency(entry.tournament?.prizePool),
            trackCondition: tournament.location || 'Track pending',
          })),
      )
      .slice(0, 6);

    return {
      id: String(selected.entry.horse.id),
      name: selected.entry.horse.name,
      owner: selected.entry.horse.owner?.fullName || 'Owner',
      breed: selected.entry.horse.breed || 'Unknown',
      age: selected.entry.horse.age ? `${selected.entry.horse.age} YRS` : 'TBA',
      winRatio:
        selected.entry.horse.totalRaces && selected.entry.horse.totalRaces > 0
          ? `${Math.round(((selected.entry.horse.totalWins || 0) / selected.entry.horse.totalRaces) * 100)}%`
          : '0%',
      totalRaces: String(selected.entry.horse.totalRaces || 0),
      currentTournament: selected.tournament.name,
      imageUrl: selected.entry.horse.imageUrl,
      history: relatedHistory.map((item) => ({
        raceName: item.raceName,
        tournamentName: selected.tournament.name,
        status: item.position,
        jockeyName: 'Assigned via tournament entry',
      })),
    };
  }, [horseSlug]);

  return <JockeyHorseDetail data={data} loading={loading} error={error} />;
}

export function ConnectedRefereeHome() {
  const { data, loading, error } = useAsyncData(async () => {
    const [notifications, races] = await Promise.all([
      fetchNotifications().catch(() => []),
      fetchAssignedRefereeRaces(),
    ]);

    const assignedRaces = races.map((race) => ({ race, tournament: race.tournament }));
    const sortedRaces = [...assignedRaces].sort(
      (a, b) => new Date(a.race.raceDate || '').getTime() - new Date(b.race.raceDate || '').getTime(),
    );
    const liveRace =
      sortedRaces.find(({ race }) => race.status === 'ONGOING') ||
      sortedRaces.find(({ race }) => race.status !== 'COMPLETED' && race.status !== 'FINISHED') ||
      sortedRaces[0];

    return {
      subheading: 'Monitor your assignments, notifications, and race schedule from live backend data.',
      assignedCount: assignedRaces.length,
      completedCount: assignedRaces.filter(({ race }) => race.status === 'COMPLETED' || race.status === 'FINISHED').length,
      liveRace: liveRace
        ? {
            series: liveRace.tournament?.name || 'Tournament',
            race: liveRace.race.name,
            participants: String(liveRace.race.maxParticipants || 0),
            dateTime: formatDateTime(liveRace.race.raceDate),
            distance: liveRace.race.distanceM ? `${liveRace.race.distanceM}M` : 'TBA',
            imageUrl: '',
          }
        : undefined,
      notifications: notifications.slice(0, 4).map((item) => ({
        id: item.id,
        title: item.title,
        message: item.message,
      })),
      weatherWarning: undefined,
      schedule: sortedRaces.map(({ race, tournament }) => ({
        id: race.id,
        time: new Date(race.raceDate || '').toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        race: race.name,
        details: `${tournament?.name || 'Tournament'} • ${race.distanceM || 0}M`,
        address: tournament?.location || 'Location pending',
        status:
          race.status === 'ONGOING'
            ? 'In Progress'
            : race.status === 'COMPLETED' || race.status === 'FINISHED'
              ? 'Completed'
              : 'Upcoming',
        action: race.status === 'ONGOING' ? 'Manage Live Race' : 'View Race',
      })),
    };
  }, []);

  return <RefereeHome data={data} loading={loading} error={error} />;
}

export function ConnectedRefereeNotifications() {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { data, loading, error } = useAsyncData(async () => {
    const [notifications, allRaces] = await Promise.all([fetchNotifications(), fetchAssignedRefereeRaces()]);

    return notifications.map((item) => ({
      id: item.id,
      title: item.title,
      message: item.message,
      createdAt: formatDateTime(item.createdAt),
      raceName: allRaces.find((race) => race.id === item.refId)?.name,
      read: item.isRead,
      type:
        item.type === 'SYSTEM'
          ? 'alert'
          : item.type?.includes('UPDATE')
            ? 'update'
            : item.type?.includes('ASSIGN')
              ? 'assignment'
              : 'update',
    }));
  }, [refreshKey]);

  return (
    <RefereeNotifications
      notifications={data || []}
      loading={loading}
      error={error}
      onAcknowledge={async (notification) => {
        await markNotificationRead(Number(notification.id));
        setRefreshKey((value) => value + 1);
      }}
      onMarkAllRead={async (notifications) => {
        await Promise.all(
          notifications
            .filter((item) => !item.read)
            .map(async (item) => markNotificationRead(Number(item.id)).catch(() => undefined)),
        );
        setRefreshKey((value) => value + 1);
      }}
    />
  );
}

export function ConnectedRefereeRaces() {
  const { data, loading, error } = useAsyncData(async () => {
    const races = await fetchAssignedRefereeRaces();
    return races.map((race) => ({
        id: race.id,
        date: formatDate(race.raceDate),
        time: new Date(race.raceDate || '').toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        series: race.tournament?.name || 'Tournament',
        race: race.name,
        address: race.tournament?.location || 'Location pending',
        distance: race.distanceM ? `${race.distanceM}M` : 'TBA',
        surface: race.tournament?.status || 'Scheduled',
        participants: `${race.maxParticipants || 0} max`,
        status:
          race.status === 'ONGOING'
            ? 'Live Now'
            : race.status === 'COMPLETED' || race.status === 'FINISHED'
              ? 'Completed'
              : 'Upcoming',
        action: race.status === 'COMPLETED' ? 'Archived' : 'Manage Race',
      }));
  }, []);

  return <RefereeRaces races={data || []} loading={loading} error={error} />;
}

export function ConnectedRefereeRaceDetail() {
  const params = useParams();
  const raceSlug = slugify(decodeURIComponent(params.name || ''));
  const { data, loading, error } = useAsyncData(async () => {
    const races = await fetchAssignedRefereeRaces();
    const selectedRace = races.find((race) => slugify(race.name) === raceSlug);

    if (!selectedRace) return null;

    const [entries, report, results] = await Promise.all([
      fetchRefereeEntries(selectedRace.id).catch(() => []),
      fetchRefereeReport(selectedRace.id).catch(() => null),
      fetchRefereeRaceResults(selectedRace.id).catch(() => []),
    ]);
    const resultsByEntryId = new Map(results.map((result) => [result.entryId, result]));

    return {
      raceId: selectedRace.id,
      raceName: selectedRace.name,
      date: formatDate(selectedRace.raceDate),
      time: new Date(selectedRace.raceDate || '').toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      distance: selectedRace.distanceM ? `${selectedRace.distanceM}M` : 'TBA',
      location: selectedRace.tournament?.location,
      participants: entries.map((entry, index) => ({
        entryId: entry.id,
        gate: String(index + 1),
        horse: entry.horse?.name || 'Horse',
        breed: [entry.horse?.breed, entry.horse?.age ? `${entry.horse.age}yo` : ''].filter(Boolean).join(' · '),
        jockey: entry.jockey?.fullName || 'Unassigned',
        checkedIn: Boolean(entry.checkedIn),
        finishTime: resultsByEntryId.get(entry.id)?.finishTimeMs
          ? formatRaceTime(resultsByEntryId.get(entry.id)?.finishTimeMs)
          : '',
        rank: resultsByEntryId.get(entry.id)?.finishRank ? String(resultsByEntryId.get(entry.id)?.finishRank) : '-',
      })),
      incidents: report?.violations
        ? report.violations
            .split(/\r?\n/)
            .filter(Boolean)
            .map((item, index) => ({
              id: index + 1,
              horse: entries[index]?.horse?.name || 'Horse',
              type: 'Violation',
              details: item,
              timestamp: formatDateTime(report.submittedAt || report.confirmedAt),
              severity: 'Medium' as const,
            }))
        : [],
    };
  }, [raceSlug]);

  return (
    <RefereeRaceDetail
      data={data}
      loading={loading}
      error={error}
      onSubmit={async () => {
        if (!data?.raceId) throw new Error('Race data is unavailable. Reload the page and try again.');
        await submitRefereeReport(data.raceId);
      }}
      onSaveParticipants={async (participants) => {
        if (!data?.raceId) throw new Error('Race data is unavailable. Reload the page and try again.');
        await Promise.all(participants.map(async (participant) => {
          if (!participant.entryId) return;
          if (participant.checkedIn) {
            await updateRefereeCheckIn(data.raceId!, participant.entryId, true);
          } else if (participant.attendanceTouched) {
            await updateRefereeNoShow(data.raceId!, participant.entryId, 'Marked absent by referee');
          }
        }));

        const present = participants.filter((participant) => participant.checkedIn);
        const incomplete = present.some((participant) => !participant.rank || participant.rank === '-' || !participant.finishTime?.trim());
        if (incomplete) {
          throw new Error('Enter rank and finish time for every attending horse before saving results.');
        }
        await upsertRefereeRaceResults(data.raceId, present.map((participant) => ({
          entryId: participant.entryId!,
          finishRank: Number(participant.rank),
          finishTimeMs: parseRaceTime(participant.finishTime!),
        })));
      }}
      onRecordIncident={async (entryId, message) => {
        if (!data?.raceId) throw new Error('Race data is unavailable. Reload the page and try again.');
        await recordRefereeViolation(data.raceId, entryId, message);
      }}
    />
  );
}

export function ConnectedSpectatorTournament() {
  const { data, loading, error } = useAsyncData(async () => {
    const tournaments = await fetchAllTournaments();
    const sorted = [...tournaments].sort(
      (a, b) => new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime(),
    );

    return {
      featuredTournaments: sorted.slice(0, 2).map((item, index) => ({
        badge: item.status || (index === 0 ? 'Live Now' : 'Upcoming'),
        tone: index === 0 ? 'live' : 'neutral',
        title: item.name,
        description: item.description || 'Tournament details synced from the backend.',
        prizePool: formatCurrency(item.prizePool),
        image: '',
      })),
      tournaments: sorted.map((item) => ({
        title: item.name,
        slug: slugify(item.name),
        dates: formatDateRange(item.startDate, item.endDate),
        status: item.status || 'Upcoming',
        tone: item.status === 'ONGOING' ? 'live' : item.status === 'OPEN' ? 'open' : 'upcoming',
        races: 'TBA',
        prizePool: formatCurrency(item.prizePool),
        image: '',
      })),
    };
  }, []);

  return <SpectatorTournament featuredTournaments={data?.featuredTournaments} tournaments={data?.tournaments} loading={loading} error={error} />;
}

export function ConnectedSpectatorTournamentDetail() {
  const params = useParams();
  const slug = slugify(decodeURIComponent(params.name || ''));
  const { data, loading, error } = useAsyncData(async () => {
    const tournaments = await fetchAllTournaments();
    const tournament = tournaments.find((item) => slugify(item.name) === slug);
    if (!tournament) return null;

    const races = await fetchRacesByTournament(tournament.id).catch(() => []);
    const qualifyingRaces = races
      .filter((race) => (race.roundNumber || 1) === 1)
      .map((race, index) => ({
        date: formatDateTime(race.raceDate),
        title: race.name,
        status:
          race.status === 'ONGOING'
            ? 'live'
            : race.status === 'COMPLETED' || race.status === 'FINISHED'
              ? 'completed'
              : 'upcoming',
        chip: String(index + 1),
        entry: `${formatDateTime(race.raceDate)} - ${race.distanceM || 0}M`,
      }));
    const semiFinalRaces = races
      .filter((race) => (race.roundNumber || 1) === 2)
      .map((race, index) => ({
        date: formatDateTime(race.raceDate),
        title: race.name,
        status:
          race.status === 'ONGOING'
            ? 'live'
            : race.status === 'COMPLETED' || race.status === 'FINISHED'
              ? 'completed'
              : 'upcoming',
        chip: String(index + 1),
        entry: `${formatDateTime(race.raceDate)} - ${race.distanceM || 0}M`,
      }));

    const finalRaceData = races.find((race) => (race.roundNumber || 1) === 3);
    const finalRace = finalRaceData ? {
      title: finalRaceData.name,
      slug: slugify(finalRaceData.name),
      dateStr: formatDateTime(finalRaceData.raceDate),
      distance: `${finalRaceData.distanceM || 0}m`,
      status: finalRaceData.status === 'ONGOING' ? 'LIVE' : finalRaceData.status === 'COMPLETED' || finalRaceData.status === 'FINISHED' ? 'COMPLETED' : 'SCHEDULED',
      participants: finalRaceData.maxParticipants || 0,
      referee: finalRaceData.refereeName || 'TBA',
    } : undefined;

    return {
      data: {
        location: tournament.location,
        dates: formatDateRange(tournament.startDate, tournament.endDate),
        heroUrl: tournament.imageUrl || '',
      },
      qualifyingRaces,
      semiFinalRaces,
      finalRace,
      schedule: races.map((race) => ({
        time: formatDateTime(race.raceDate),
        event: race.name,
        status:
          race.status === 'ONGOING'
            ? 'live'
            : race.status === 'COMPLETED' || race.status === 'FINISHED'
              ? 'completed'
              : 'upcoming',
        link: spectatorTournamentPath(slugify(tournament.name)),
      })),
    };
  }, [slug]);

  return (
    <SpectatorTournamentDetail
      data={data?.data}
      qualifyingRaces={data?.qualifyingRaces}
      semiFinalRaces={data?.semiFinalRaces}
      finalRace={data?.finalRace}
      schedule={data?.schedule}
      loading={loading}
      error={error}
    />
  );
}

export function ConnectedSpectatorHorses() {
  const { data, loading, error } = useAsyncData(async () => {
    const tournaments = await fetchAllTournaments();
    const entriesByTournament = await Promise.all(
      tournaments.map((tournament) => fetchEntriesByTournament(tournament.id).catch(() => [])),
    );

    const horseMap = new Map<string, { horse: (typeof entriesByTournament)[number][number]['horse']; owner: string; event: string }>();
    entriesByTournament.flat().forEach((entry) => {
      if (!entry.horse?.id) return;
      horseMap.set(String(entry.horse.id), {
        horse: entry.horse,
        owner: entry.horse.owner?.fullName || 'Owner',
        event: entry.tournament?.name || 'Tournament',
      });
    });

    return Array.from(horseMap.values())
      .sort((a, b) => (b.horse.totalWins || 0) - (a.horse.totalWins || 0))
      .map((item, index) => ({
        rank: String(index + 1).padStart(2, '0'),
        featured: index === 0,
        name: item.horse.name,
        owner: item.owner,
        breed: item.horse.breed || 'Unknown',
        age: item.horse.age ? `${item.horse.age} YRS` : 'TBA',
        winRatio:
          item.horse.totalRaces && item.horse.totalRaces > 0
            ? Math.round(((item.horse.totalWins || 0) / item.horse.totalRaces) * 100)
            : 0,
        starts: item.horse.totalRaces || 0,
        result: `${item.horse.totalWins || 0} Wins`,
        event: item.event,
        tone: index === 0 ? 'green' : 'neutral',
        image: item.horse.imageUrl,
      }));
  }, []);

  return <SpectatorHorses horses={data || []} loading={loading} error={error} />;
}

export function ConnectedSpectatorHome() {
  const user = getCurrentUser();
  const { data, loading, error } = useAsyncData(async () => {
    const tournaments = await fetchAllTournaments();

    const upcomingTournaments = [...tournaments]
      .sort((a, b) => new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime())
      .slice(0, 3);

    const allEntries = (
      await Promise.all(tournaments.map(async (tournament) => fetchEntriesByTournament(tournament.id).catch(() => [])))
    ).flat();
    const topHorses = Array.from(
      new Map(allEntries.filter((entry) => entry.horse?.id).map((entry) => [String(entry.horse.id), entry])).values(),
    )
      .sort((a, b) => {
        const aRatio = a.horse.totalRaces ? (a.horse.totalWins || 0) / a.horse.totalRaces : 0;
        const bRatio = b.horse.totalRaces ? (b.horse.totalWins || 0) / b.horse.totalRaces : 0;
        return bRatio - aRatio;
      })
      .slice(0, 5);

    return {
      displayName: user?.fullName || user?.email || 'Spectator',
      introText: 'Your spectator dashboard is focused on tournaments, race schedules, and horse performance.',
      upcomingRaces: upcomingTournaments.map((item) => ({
        date: formatDateRange(item.startDate, item.endDate),
        title: item.name,
        location: item.location || 'Location pending',
      })),
      horseLeaders: topHorses.map((entry, index) => ({
        rank: String(index + 1).padStart(2, '0'),
        name: entry.horse.name,
        ratio:
          entry.horse.totalRaces && entry.horse.totalRaces > 0
            ? `${Math.round(((entry.horse.totalWins || 0) / entry.horse.totalRaces) * 100)}% WIN RATIO`
            : '0% WIN RATIO',
        image: entry.horse.imageUrl,
      })),
      stats: [
        { label: 'Live tournaments', value: String(tournaments.filter((item) => item.status === 'ONGOING').length) },
        { label: 'Upcoming races', value: String(upcomingTournaments.length) },
        { label: 'Tracked horses', value: String(topHorses.length) },
      ],
    };
  }, [user?.id]);

  return <SpectatorHome {...data} loading={loading} error={error} />;
}

export function ConnectedSpectatorRaceDetail() {
  const params = useParams();
  const tournamentSlug = slugify(decodeURIComponent(params.name || ''));
  const raceSlug = slugify(decodeURIComponent(params.racename || ''));
  const { data, loading, error } = useAsyncData(async () => {
    const tournaments = await fetchAllTournaments();
    const tournament = tournaments.find((item) => slugify(item.name) === tournamentSlug);
    if (!tournament) return null;

    const [races, entries, publicSummary] = await Promise.all([
      fetchRacesByTournament(tournament.id),
      fetchEntriesByTournament(tournament.id),
      Promise.resolve(fetchRacesByTournament(tournament.id)).then(async (items) => {
        const race = items.find((item) => slugify(item.name) === raceSlug);
        return race ? fetchPublicRaceResults(race.id).catch(() => null) : null;
      }),
    ]);

    const race = races.find((item) => slugify(item.name) === raceSlug);
    if (!race) return null;

    const raceEntries = entries.filter((entry) => entry.race?.id === race.id || !entry.race);
    const results = publicSummary?.results || [];
    const incidents = publicSummary?.violations
      ? publicSummary.violations
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
      : [];

    return {
      data: {
        description: tournament.description || 'Live race data synced from the backend.',
        date: formatDate(race.raceDate),
        time: new Date(race.raceDate || '').toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        distance: race.distanceM ? String(race.distanceM) : undefined,
        runnerCount: raceEntries.length,
      },
      runners: raceEntries.map((entry, index) => {
        const result = results.find((item) => item.entryId === entry.id);
        return {
          gate: index + 1,
          horse: entry.horse?.name || 'Horse',
          meta: [entry.horse?.breed, entry.horse?.age ? `${entry.horse.age} Years` : ''].filter(Boolean).join(' - '),
          jockey: entry.jockey?.fullName || 'Unassigned',
          weight: entry.horse?.weightKg ? `W: ${entry.horse.weightKg}kg` : 'W: TBA',
          finishTime: result?.finishTimeMs ? `${result.finishTimeMs} ms` : 'Pending',
          rank: result?.finishRank ? String(result.finishRank) : '-',
          entryId: entry.id,
          image: entry.horse?.imageUrl,
        };
      }),
      incidents,
    };
  }, [raceSlug, tournamentSlug]);

  return (
    <SpectatorRaceDetail
      data={data?.data}
      runners={(data?.runners || []).map((runner) => ({
        gate: runner.gate,
        horse: runner.horse,
        meta: runner.meta,
        jockey: runner.jockey,
        weight: runner.weight,
        image: runner.image,
        finishTime: runner.finishTime,
        rank: runner.rank,
      }))}
      incidents={data?.incidents || []}
      loading={loading}
      error={error}
    />
  );
}

export function ConnectedSpectatorProfile() {
  const user = getCurrentUser();
  const { data, loading } = useAsyncData(async () => {
    const [notifications, tournaments] = await Promise.all([
      fetchNotifications().catch(() => []),
      fetchAllTournaments().catch(() => []),
    ]);

    return {
      fullName: user?.fullName || user?.email || 'Spectator',
      email: user?.email || '—',
      role: 'Spectator',
      status: 'Active',
      stats: [
        { label: 'Unread notifications', value: String(notifications.filter((item) => !item.isRead).length) },
        { label: 'Available tournaments', value: String(tournaments.length) },
        { label: 'Live tournaments', value: String(tournaments.filter((item) => item.status === 'ONGOING').length) },
      ],
    };
  }, [user?.id]);

  return <SpectatorProfile profile={data} loading={loading} />;
}

export function ConnectedSpectatorHorseDetail() {
  const params = useParams();
  const horseSlug = slugify(decodeURIComponent(params.name || ''));
  const { data, loading, error } = useAsyncData(async () => {
    const tournaments = await fetchAllTournaments();
    const nested = await Promise.all(
      tournaments.map(async (tournament) => ({
        tournament,
        entries: await fetchEntriesByTournament(tournament.id).catch(() => []),
      })),
    );

    const selected = nested
      .flatMap(({ tournament, entries }) => entries.map((entry) => ({ tournament, entry })))
      .find(({ entry }) => slugify(entry.horse?.name || '') === horseSlug);

    if (!selected?.entry.horse) return null;

    const history = nested
      .flatMap(({ tournament, entries }) =>
        entries
          .filter((entry) => entry.horse?.id === selected.entry.horse.id)
          .map((entry) => ({
            tournament: tournament.name,
            date: formatDate(entry.registeredAt),
            race: entry.race?.name || 'Race',
            jockey: entry.jockey?.fullName || 'Unassigned',
            time: entry.approvedAt ? formatDateTime(entry.approvedAt) : 'Pending',
            position:
              entry.status === 'APPROVED'
                ? 'Approved'
                : entry.status === 'REJECTED'
                  ? 'Declined'
                  : 'Pending',
            tone:
              entry.status === 'APPROVED'
                ? ('first' as const)
                : entry.status === 'REJECTED'
                  ? ('third' as const)
                  : ('neutral' as const),
          })),
      )
      .slice(0, 6);

    return {
      profile: {
        name: selected.entry.horse.name,
        owner: selected.entry.horse.owner?.fullName || 'Owner',
        breed: selected.entry.horse.breed || 'Unknown',
        age: selected.entry.horse.age ? `${selected.entry.horse.age} Yrs` : 'TBA',
        gender: selected.entry.horse.color || 'Unknown',
        rank: '01',
        winRatio:
          selected.entry.horse.totalRaces && selected.entry.horse.totalRaces > 0
            ? Math.round(((selected.entry.horse.totalWins || 0) / selected.entry.horse.totalRaces) * 100)
            : 0,
        starts: selected.entry.horse.totalRaces || 0,
        earnings: formatCurrency(selected.tournament.prizePool),
        hero: selected.entry.horse.imageUrl || '',
      },
      raceHistory: history,
    };
  }, [horseSlug]);

  return (
    <SpectatorHorseDetail
      profile={data?.profile}
      raceHistory={data?.raceHistory}
      loading={loading}
      error={error}
    />
  );
}

export function ConnectedAdminRaceIncidentLog() {
  const { data, loading } = useAsyncData(async () => {
    const reports = [
      ...(await fetchAdminPendingReports().catch(() => [])),
      ...(await fetchAdminPublishableReports().catch(() => [])),
    ];
    const unique = Array.from(new Map(reports.map((item) => [String(item.id), item])).values());

    return unique.map((report) => ({
      id: String(report.id),
      raceName: report.race?.name || 'Race',
      tournamentName: report.race?.tournament?.name || 'Tournament',
      reportedAt: formatDateTime(report.submittedAt || report.confirmedAt),
      refereeName: report.referee?.fullName || 'Referee',
      category: report.violations ? 'Violation' : 'Report',
      status: report.confirmed ? 'resolved' : report.submitted ? 'reviewing' : 'open',
      summary: report.notes || report.violations || '',
    }));
  }, []);

  return <AdminRaceIncidentLog incidents={data || []} total={data?.length || 0} loading={loading} />;
}

export function ConnectedAdminRaceIncidentDetail() {
  const params = useParams();
  const tournamentSlug = slugify(decodeURIComponent(params.name || ''));
  const raceSlug = slugify(decodeURIComponent(params.racename || ''));
  const { data, loading, error } = useAsyncData(async () => {
    const tournaments = await fetchAllTournaments();
    const tournament = tournaments.find((item) => slugify(item.name) === tournamentSlug);
    if (!tournament) return null;

    const races = await fetchRacesByTournament(tournament.id).catch(() => []);
    const race = races.find((item) => slugify(item.name) === raceSlug);
    if (!race) return null;

    const report = await fetchAdminRaceReport(race.id).catch(() => null);

    return {
      raceId: race.id,
      tournamentName: tournament.name,
      raceName: race.name,
      date: formatDate(race.raceDate),
      time: new Date(race.raceDate || '').toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      refereeName: report?.referee?.fullName || race.referee?.fullName || 'Referee',
      reportSubmitted: Boolean(report?.submitted),
      reportConfirmed: Boolean(report?.confirmed),
      resultsPublished: race.status === 'COMPLETED',
      incidents: (report?.violations || '')
        .split(/\r?\n/)
        .filter(Boolean)
        .map((item, index) => {
          const fields = item.split(' | ').map((field) => field.trim());
          const severityIndex = fields.findIndex((field) => ['low', 'medium', 'high'].includes(field.toLowerCase()));
          const severity = severityIndex >= 0 ? fields[severityIndex].toLowerCase() as 'low' | 'medium' | 'high' : 'medium' as const;
          const entryField = fields.find((field) => field.startsWith('entryId='));
          return {
            id: index + 1,
            horseName: entryField ? `Entry ${entryField.replace('entryId=', '')}` : `Entry ${index + 1}`,
            time: severityIndex >= 0 && fields[severityIndex + 1] ? fields[severityIndex + 1] : formatDateTime(report?.submittedAt || report?.confirmedAt),
            violationType: fields[3] || fields[1] || 'Violation',
            severity,
            detail: item,
          };
        }),
    };
  }, [raceSlug, tournamentSlug]);

  return (
    <AdminRaceIncidentDetail
      data={data}
      loading={loading}
      error={error}
      onConfirmReport={async () => {
        if (!data?.raceId) throw new Error('Race data is unavailable. Reload the page and try again.');
        await confirmAdminRaceReport(data.raceId);
      }}
      onPublishResults={async () => {
        if (!data?.raceId) throw new Error('Race data is unavailable. Reload the page and try again.');
        await publishAdminRaceResults(data.raceId);
      }}
    />
  );
}

export function ConnectedHorseOwnerRaceDetail() {
  const params = useParams();
  const user = getCurrentUser();
  const tournamentSlug = slugify(decodeURIComponent(params.name || ''));
  const raceSlug = slugify(decodeURIComponent(params.racename || ''));

  const { data, loading } = useAsyncData(async () => {
    const tournament = (await fetchAllTournaments())
      .find((item) => slugify(item.name) === tournamentSlug);
    if (!tournament) return null;

    const [races, entries] = await Promise.all([
      fetchRacesByTournament(tournament.id),
      fetchEntriesByTournament(tournament.id),
    ]);
    const race = races.find((item) => slugify(item.name) === raceSlug);
    if (!race) return null;

    const results = await fetchPublicRaceResults(race.id)
      .then((response) => response.results || [])
      .catch(() => []);
    const raceEntries = entries.filter((entry) => entry.race?.id === race.id);

    return {
      tournamentName: tournament.name,
      raceName: race.name,
      statusLabel: race.status || 'Race details',
      dateTime: formatDateTime(race.raceDate),
      distance: race.distanceM ? `${race.distanceM}m` : undefined,
      venue: tournament.location,
      heroImageUrl: tournament.imageUrl,
      lineup: raceEntries.map((entry, index) => {
        const result = results.find((item) => item.entryId === entry.id);
        return {
          id: String(entry.id),
          gate: entry.gateNumber ?? index + 1,
          horseName: entry.horse?.name,
          breed: entry.horse?.breed,
          sex: entry.horse?.condition,
          ownerName: entry.horse?.owner?.fullName,
          jockeyName: entry.jockey?.fullName,
          jockeyAvatarUrl: entry.jockey?.avatarUrl,
          finishTime: result?.finishTimeMs ? `${result.finishTimeMs} ms` : undefined,
          rankLabel: result?.finishRank ? String(result.finishRank) : undefined,
          isCurrentOwner: entry.horse?.owner?.id === user?.id,
        };
      }),
    };
  }, [raceSlug, tournamentSlug, user?.id]);

  return <HorseOwnerRaceDetail data={data} loading={loading} />;
}
