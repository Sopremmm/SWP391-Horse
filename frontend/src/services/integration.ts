import { api } from './api.ts';
import { getCurrentUser } from './auth.ts';

export type RawUser = {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  status?: string;
  avatarUrl?: string;
  balance?: number | string;
  createdAt?: string;
  updatedAt?: string;
};

export type RawHorse = {
  id: number;
  owner?: RawUser;
  name: string;
  breed?: string;
  age?: number;
  weightKg?: number;
  color?: string;
  imageUrl?: string;
  condition?: string;
  totalRaces?: number;
  totalWins?: number;
  status?: string;
  createdAt?: string;
};

export type RawTournament = {
  id: number;
  createdBy?: RawUser;
  name: string;
  location?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  prizePool?: number | string;
  maxHorses?: number;
  imageUrl?: string;
  status?: string;
  createdAt?: string;
};

export type RawRace = {
  id: number;
  tournament?: RawTournament;
  referee?: RawUser | null;
  name: string;
  roundNumber?: number;
  raceDate?: string;
  distanceM?: number;
  maxParticipants?: number;
  status?: string;
  createdAt?: string;
};

export type RawRaceEntry = {
  id: number;
  horse: RawHorse;
  jockey?: RawUser | null;
  tournament: RawTournament;
  race?: RawRace | null;
  status?: string;
  gateNumber?: number | null;
  registeredAt?: string;
  approvedAt?: string;
  checkedIn?: boolean;
  noShow?: boolean;
};

export type RawNotification = {
  id: number;
  title: string;
  message: string;
  type?: string;
  refId?: number;
  refType?: string;
  isRead?: boolean;
  createdAt?: string;
};

export type RawJockeyInvitation = {
  id: number;
  horse: RawHorse;
  owner: RawUser;
  jockey: RawUser;
  race: RawRace;
  status?: string;
  message?: string;
  invitedAt?: string;
  respondedAt?: string;
  expiresAt?: string;
};

export type RawJockeyProfile = {
  id?: number;
  user?: RawUser;
  licenseNumber?: string;
  weightKg?: number;
  experienceYears?: number;
  totalRaces?: number;
  totalWins?: number;
  bio?: string;
};

export type RawRefereeReport = {
  id: number;
  race?: RawRace;
  referee?: RawUser;
  violations?: string;
  notes?: string;
  submitted?: boolean;
  submittedAt?: string;
  confirmed?: boolean;
  confirmedAt?: string;
};

export type RawRaceResult = {
  id?: number;
  entryId: number;
  horseId?: number;
  horseName?: string;
  finishRank?: number;
  finishTimeMs?: number;
  disqualified?: boolean;
};

const SENT_OWNER_INVITATIONS_KEY = 'horse_owner_jockey_invitations_data';
const LEGACY_BRIDGE_FLAG = '__HERITAGE_LEGACY_API_BRIDGE__';

export function slugify(value: string) {
  return String(value || '')
    .toLowerCase()
    .replace(/[_\n]+/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatCurrency(value?: number | string | null) {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) return '£0';
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: numeric % 1 === 0 ? 0 : 2,
  }).format(numeric);
}

export function formatDate(value?: string) {
  if (!value) return 'TBA';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(value?: string) {
  if (!value) return 'TBA';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateRange(start?: string, end?: string) {
  if (!start && !end) return 'TBA';
  if (start && end) return `${formatDate(start)} - ${formatDate(end)}`;
  return formatDate(start || end);
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function readCachedOwnerInvitations() {
  return safeJsonParse<{ invitations?: Array<Record<string, unknown>> }>(
    window.localStorage.getItem(SENT_OWNER_INVITATIONS_KEY),
  );
}

export function getCachedOwnerSentInvitationsData() {
  return (
    readCachedOwnerInvitations() || {
      title: 'Jockey Recruitment Status',
      subtitle: 'Track invitations sent from your stable to race-day jockeys.',
      invitations: [],
    }
  );
}

function writeCachedOwnerInvitations(invitations: Array<Record<string, unknown>>) {
  window.localStorage.setItem(
    SENT_OWNER_INVITATIONS_KEY,
    JSON.stringify({
      title: 'Jockey Recruitment Status',
      subtitle: 'Track invitations sent from your stable to race-day jockeys.',
      invitations,
    }),
  );
}

export function cacheOwnerInvitation(invitation: RawJockeyInvitation) {
  const current = readCachedOwnerInvitations()?.invitations || [];
  const next = [
    {
      id: invitation.id,
      jockey: invitation.jockey?.fullName || invitation.jockey?.email || 'Jockey',
      tournament: invitation.race?.tournament?.name || 'Tournament',
      horse: invitation.horse?.name || 'Horse',
      sentDate: formatDate(invitation.invitedAt),
      status: invitation.status === 'ACCEPTED' ? 'Accepted' : invitation.status === 'DECLINED' ? 'Declined' : 'Pending',
    },
    ...current.filter((item) => item.id !== invitation.id),
  ];

  writeCachedOwnerInvitations(next);
}

export async function fetchAllTournaments() {
  return api.get<RawTournament[]>('/tournaments');
}

export async function fetchTournamentBySlug(slug: string) {
  const tournaments = await fetchAllTournaments();
  const normalized = String(slug || '').trim();
  const normalizedLower = normalized.toLowerCase();
  return (
    tournaments.find(
      (item) =>
        slugify(item.name) === normalizedLower ||
        String(item.id) === normalized ||
        String(item.name || '').trim().toLowerCase() === normalizedLower,
    ) || null
  );
}

export async function fetchRacesByTournament(tournamentId: number) {
  return api.get<RawRace[]>(`/races/tournament/${tournamentId}`);
}

export async function createRaceInTournament(
  tournamentId: number,
  payload: Partial<RawRace> & {
    name: string;
    roundNumber: number;
    raceDate: string;
    distanceM: number;
    maxParticipants?: number;
  },
) {
  return api.post<RawRace>(`/races/tournament/${tournamentId}`, payload);
}

export async function saveTournamentBracket(
  tournamentId: number,
  qualifyingRaces: number,
  semifinalRaces: number,
) {
  return api.put<RawRace[]>(`/races/tournament/${tournamentId}/bracket`, {
    qualifyingRaces,
    semifinalRaces,
  });
}

export async function fetchEntriesByTournament(tournamentId: number) {
  return api.get<RawRaceEntry[]>(`/entries/tournament/${tournamentId}`);
}

export async function fetchMyHorses() {
  return api.get<RawHorse[]>('/horses/my');
}

export async function fetchAdminHorses() {
  return api.get<RawHorse[]>('/horses');
}

export async function fetchHorseById(horseId: number) {
  return api.get<RawHorse>(`/horses/${horseId}`);
}

export async function fetchRaceById(raceId: number) {
  return api.get<RawRace>(`/races/${raceId}`);
}

export async function saveHorse(horse: Partial<RawHorse> & { id?: number }) {
  if (horse.id) {
    return api.put<RawHorse>(`/horses/${horse.id}`, horse);
  }
  return api.post<RawHorse>('/horses', horse);
}

export async function fetchNotifications() {
  return api.get<RawNotification[]>('/notifications/my');
}

export async function markNotificationRead(notificationId: number) {
  return api.patch<void>(`/notifications/${notificationId}/read`);
}

export async function fetchJockeys() {
  return api.get<RawUser[]>('/users/jockeys');
}

export async function fetchReferees() {
  return api.get<RawUser[]>('/users/referees');
}

export async function registerTournamentEntry(horseId: number, tournamentId: number) {
  return api.post<RawRaceEntry>('/entries/register', null, {
    query: { horseId, tournamentId },
  });
}

export async function sendJockeyInvitation(params: {
  horseId: number;
  jockeyId: number;
  raceId: number;
  message?: string;
}) {
  const invitation = await api.post<RawJockeyInvitation>('/invitations', null, {
    query: {
      ...params,
      message: params.message ?? '',
    },
  });
  cacheOwnerInvitation(invitation);
  return invitation;
}

export async function fetchJockeyInvitations() {
  return api.get<RawJockeyInvitation[]>('/invitations/my');
}

export async function respondToInvitation(invitationId: number, status: 'ACCEPTED' | 'DECLINED') {
  return api.patch<RawJockeyInvitation>(`/invitations/${invitationId}/respond`, null, {
    query: { status },
  });
}

export async function fetchJockeyProfile() {
  return api.get<RawJockeyProfile>('/jockeys/profile/my');
}

export async function saveJockeyProfile(profile: Partial<RawJockeyProfile>) {
  return api.post<RawJockeyProfile>('/jockeys/profile', profile);
}

export async function fetchAdminUsers(params?: { role?: string; q?: string }) {
  return api.get<RawUser[]>('/admin/users', {
    query: params,
  });
}

export async function updateAdminUserStatus(id: number, status: string) {
  return api.patch<RawUser>(`/admin/users/${id}/status`, { status });
}

export async function deleteAdminUser(id: number) {
  return api.delete<{ message: string }>(`/admin/users/${id}`);
}

export async function createTournament(payload: Partial<RawTournament> & { id?: number }) {
  return api.post<RawTournament>('/tournaments', payload);
}

export async function updateTournamentStatus(id: number, status: string) {
  return api.patch<RawTournament>(`/tournaments/${id}/status`, null, {
    query: { status },
  });
}

export async function approveTournamentEntry(entryId: number, raceId: number) {
  return api.patch<RawRaceEntry>(`/entries/${entryId}/approve`, null, {
    query: { raceId },
  });
}

export async function rejectTournamentEntry(entryId: number) {
  return api.patch<RawRaceEntry>(`/entries/${entryId}/reject`);
}

export async function fetchAdminPendingReports() {
  return api.get<RawRefereeReport[]>('/admin/dashboard/reports/pending');
}

export async function fetchAdminPublishableReports() {
  return api.get<RawRefereeReport[]>('/admin/dashboard/reports/publishable');
}

export async function fetchAdminRaceControl() {
  return api.get<RawRace[]>('/admin/races/control');
}

export async function fetchAdminRaceReport(raceId: number) {
  return api.get<RawRefereeReport>(`/admin/races/${raceId}/report`);
}

export async function confirmAdminRaceReport(raceId: number) {
  return api.post<RawRefereeReport>(`/admin/races/${raceId}/report/confirm`);
}

export async function publishAdminRaceResults(raceId: number) {
  return api.post<RawRace>(`/admin/races/${raceId}/publish-results`);
}

export async function fetchAdminRaceControlList(params?: {
  tournamentId?: number;
  status?: string;
  q?: string;
  from?: string;
  to?: string;
}) {
  return api.get<
    Array<{
      id: number;
      tournamentId?: number;
      tournamentName?: string;
      refereeId?: number;
      refereeName?: string;
      name?: string;
      roundNumber?: number;
      raceDate?: string;
      distanceM?: number;
      status?: string;
      checklist?: {
        hasReferee?: boolean;
        approvedEntries?: number;
        approvedWithJockey?: number;
        checkedInOrNoShowOrWithdrawn?: number;
        resultsRecorded?: number;
        reportSubmitted?: boolean;
        reportConfirmed?: boolean;
      };
    }>
  >('/admin/races/control', {
    query: params,
  });
}

export async function assignRaceReferee(raceId: number, refereeId: number) {
  return api.patch<RawRace>(`/races/${raceId}/referee`, null, {
    query: { refereeId },
  });
}

export async function saveAdminRaceGates(
  raceId: number,
  payload: {
    gateCount: number;
    assignments: Array<{ entryId?: number; horseId?: number; gateNumber: number }>;
  },
) {
  return api.put<RawRace>(`/admin/races/${raceId}/gates`, payload);
}

export async function fetchRefereeEntries(raceId: number) {
  return api.get<RawRaceEntry[]>(`/referee/races/${raceId}/entries`);
}

export async function updateRefereeCheckIn(raceId: number, entryId: number, checkedIn: boolean) {
  return api.patch<RawRaceEntry>(`/referee/races/${raceId}/checkin`, {
    entryId,
    checkedIn,
  });
}

export async function updateRefereeNoShow(raceId: number, entryId: number, reason?: string) {
  return api.patch<RawRaceEntry>(`/referee/races/${raceId}/no-show`, {
    entryId,
    reason,
  });
}

export async function recordRefereeViolation(raceId: number, entryId: number, message: string) {
  return api.post<RawRefereeReport>(`/referee/races/${raceId}/violations`, {
    entryId,
    message,
  });
}

export async function fetchRefereeRaceResults(raceId: number) {
  return api.get<RawRaceResult[]>(`/referee/races/${raceId}/results`);
}

export async function upsertRefereeRaceResults(
  raceId: number,
  items: Array<{ entryId: number; finishRank: number; finishTimeMs?: number }>
) {
  return api.put<RawRaceResult[]>(`/referee/races/${raceId}/results`, items);
}

export async function fetchRefereeReport(raceId: number) {
  return api.get<RawRefereeReport>(`/referee/races/${raceId}/report`);
}

export async function saveRefereeReportDraft(raceId: number, notes?: string) {
  return api.put<RawRefereeReport>(`/referee/races/${raceId}/report`, { notes });
}

export async function submitRefereeReport(raceId: number, notes?: string) {
  return api.post<RawRefereeReport>(`/referee/races/${raceId}/report/submit`, notes ? { notes } : null);
}

export async function fetchRaceResults(raceId: number) {
  const response = await api.get<
    | Array<{ entryId: number; horseId: number; horseName: string; finishRank?: number; finishTimeMs?: number; disqualified?: boolean }>
    | {
        results?: Array<{ entryId: number; horseId: number; horseName: string; finishRank?: number; finishTimeMs?: number; disqualified?: boolean }>;
        violations?: string;
        notes?: string;
      }
  >(`/races/${raceId}/results`);

  if (Array.isArray(response)) return response;
  return response?.results || [];
}

export async function fetchPublicRaceResults(raceId: number) {
  return api.get<{
    results?: Array<{ entryId: number; horseId: number; horseName: string; finishRank?: number; finishTimeMs?: number; disqualified?: boolean }>;
    violations?: string;
    notes?: string;
  }>(`/races/${raceId}/results`);
}

function statusToOwnerTone(type?: string) {
  if (type === 'JOCKEY_INVITE') return 'jockey';
  if (type === 'REG_REJECTED') return 'declined';
  if (type === 'REG_APPROVED') return 'approved';
  return 'tournament';
}

function notificationIcon(type?: string) {
  if (type === 'JOCKEY_INVITE') return 'badge';
  if (type === 'REG_APPROVED') return 'check';
  if (type === 'REG_REJECTED') return 'info';
  return 'bell';
}

export async function getHorseOwnerHomeData() {
  const [user, horses, tournaments, notifications] = await Promise.all([
    Promise.resolve(getCurrentUser()),
    fetchMyHorses().catch(() => []),
    fetchAllTournaments().catch(() => []),
    fetchNotifications().catch(() => []),
  ]);

  const sortedTournaments = [...tournaments].sort(
    (a, b) => new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime(),
  );
  const featured = sortedTournaments[0];

  return {
    ownerName: user?.fullName || '',
    welcomeText: 'Your stable overview is synced with live tournament and horse data.',
    featuredRace: featured
      ? {
          id: String(featured.id),
          badge: featured.status || 'Upcoming',
          title: featured.name,
          location: featured.location || 'Location pending',
          description: featured.description || '',
          imageUrl: '',
          prizePool: formatCurrency(featured.prizePool),
          raceDate: formatDateRange(featured.startDate, featured.endDate),
          startsIn: featured.status || 'Upcoming',
        }
      : undefined,
    tournaments: sortedTournaments.slice(0, 4).map((item) => ({
      id: String(item.id),
      name: item.name,
      date: formatDateRange(item.startDate, item.endDate),
      prizePool: formatCurrency(item.prizePool),
    })),
    horses: horses.slice(0, 4).map((horse) => ({
      id: String(horse.id),
      name: horse.name,
      age: horse.age ? `${horse.age}` : 'TBA',
      gender: horse.color || horse.status || 'ACTIVE',
      imageSrc: horse.imageUrl,
    })),
    stats: [
      { label: 'Stable Horses', value: String(horses.length) },
      { label: 'Upcoming Tournaments', value: String(sortedTournaments.length) },
      { label: 'Unread Alerts', value: String(notifications.filter((item) => !item.isRead).length) },
    ],
  };
}

export async function getHorseOwnerMyHorsesData() {
  const horses = await fetchMyHorses().catch(() => []);
  return {
    stats: {
      totalValue: formatCurrency(horses.reduce((sum, horse) => sum + (horse.totalWins || 0) * 1000, 0)),
      stableSize: `${String(horses.length).padStart(2, '0')} Thoroughbreds`,
      recentWins: String(horses.reduce((sum, horse) => sum + (horse.totalWins || 0), 0)),
    },
    horses: horses.map((horse) => ({
      id: String(horse.id),
      name: horse.name,
      meta: [horse.breed, horse.age ? `${horse.age}yo` : '', horse.color, `${horse.totalWins || 0} wins`]
        .filter(Boolean)
        .join(' - '),
      imageSrc: horse.imageUrl,
    })),
  };
}

export async function getHorseOwnerProfileData() {
  const [user, horses, tournaments] = await Promise.all([
    Promise.resolve(getCurrentUser()),
    fetchMyHorses().catch(() => []),
    fetchAllTournaments().catch(() => []),
  ]);

  return {
    profile: {
      fullName: user?.fullName || '',
      username: user?.email || '',
      role: 'Horse Owner',
      age: '',
      gender: '',
      bio: '',
      avatarUrl: '',
      initials: user?.fullName
        ?.split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join(''),
    },
    stats: [
      { label: 'Stable Horses', value: String(horses.length), icon: 'stable', action: 'View stable', href: '/HorseOwner/MyHorses' },
      { label: 'Available Tournaments', value: String(tournaments.length), icon: 'calendar', variant: 'dark' },
      { label: 'Total Wins', value: String(horses.reduce((sum, horse) => sum + (horse.totalWins || 0), 0)), icon: 'trophy' },
    ],
    readonlyStats: [
      { label: 'Email', value: user?.email || '—' },
      { label: 'Role', value: 'Horse Owner' },
      { label: 'Account Status', value: 'Active' },
    ],
  };
}

export async function getHorseOwnerNotificationsData() {
  const notifications = await fetchNotifications().catch(() => []);
  return {
    notifications: notifications.map((item) => ({
      id: item.id,
      title: item.title,
      body: item.message,
      time: formatDateTime(item.createdAt),
      createdAt: item.createdAt,
      unread: !item.isRead,
      icon: notificationIcon(item.type),
      tone: statusToOwnerTone(item.type),
    })),
  };
}

export async function getHorseOwnerInviteJockeysData() {
  const jockeys = await fetchJockeys().catch(() => []);
  return {
    title: 'Jockey Invitations',
    subtitle: 'Review available jockeys and invite them to specific races in your upcoming tournaments.',
    total: jockeys.length,
    jockeys: jockeys.map((jockey) => ({
      id: String(jockey.id),
      name: jockey.fullName,
      age: 'TBA',
      gender: 'TBA',
      totalRaces: 0,
      avatarUrl: jockey.avatarUrl,
      imageUrl: jockey.avatarUrl,
    })),
  };
}

export async function getHorseOwnerTournamentListData() {
  const tournaments = await fetchAllTournaments().catch(() => []);
  const sorted = [...tournaments].sort(
    (a, b) => new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime(),
  );

  const toCard = (tournament: RawTournament) => ({
    id: String(tournament.id),
    title: tournament.name,
    dateRange: formatDateRange(tournament.startDate, tournament.endDate),
    status: tournament.status === 'OPEN' ? 'registration-open' : tournament.status?.toLowerCase() || 'upcoming',
    statusLabel: tournament.status === 'OPEN' ? 'Registration Open' : tournament.status || 'Upcoming',
    races: 0,
    prizePool: formatCurrency(tournament.prizePool),
    imageUrl: tournament.imageUrl || '',
    description: tournament.description,
  });

  return {
    featuredTournaments: sorted.slice(0, 2).map(toCard),
    tournaments: sorted.map(toCard),
    sortOptions: [
      { label: 'Sort by Date', value: 'date' },
      { label: 'Prize Pool', value: 'prizePool' },
      { label: 'Tournament Name', value: 'title' },
    ],
  };
}

export async function getHorseOwnerTournamentDetailData(slug: string) {
  const tournament = await fetchTournamentBySlug(slug);
  if (!tournament) return null;

  const [races, entries] = await Promise.all([
    fetchRacesByTournament(tournament.id).catch(() => []),
    fetchEntriesByTournament(tournament.id).catch(() => []),
  ]);

  return {
    title: tournament.name,
    presenter: 'Heritage Racing Presents',
    location: tournament.location || 'Location pending',
    dateRange: formatDateRange(tournament.startDate, tournament.endDate),
    heroImage: '',
    races: races.map((race) => ({
      id: String(race.id),
      round:
        race.roundNumber === 1 ? 'qualifying' : race.roundNumber === 2 ? 'semi' : 'final',
      name: race.name,
      dateTime: formatDateTime(race.raceDate),
      distance: race.distanceM ? `${race.distanceM}M` : 'TBA',
      status:
        race.status === 'COMPLETED' || race.status === 'FINISHED'
          ? 'completed'
          : race.status === 'ONGOING'
            ? 'live'
            : 'upcoming',
      entrantLabel: entries.find((entry) => entry.race?.id === race.id)?.horse?.name,
      entrantTone: race.status === 'ONGOING' ? 'live' : race.status === 'COMPLETED' ? 'winner' : 'pending',
    })),
    participants: entries.map((entry) => ({
      id: entry.id,
      horse: entry.horse?.name || 'Horse',
      breedAge: [entry.horse?.breed, entry.horse?.age ? `${entry.horse.age}yo` : ''].filter(Boolean).join(' · '),
      jockey: entry.jockey?.fullName || 'Unassigned',
      owner: entry.horse?.owner?.fullName || getCurrentUser()?.fullName || 'Owner',
    })),
    final: {
      title: 'Grand Final',
      dateTime: formatDateTime(races[races.length - 1]?.raceDate),
      venue: tournament.location || 'Venue pending',
      distance: races[races.length - 1]?.distanceM ? `${races[races.length - 1].distanceM}m` : 'TBA',
      status: 'upcoming',
    },
  };
}

export async function getHorseOwnerTournamentRegisterData(slug: string) {
  const detail = await getHorseOwnerTournamentDetailData(slug);
  if (!detail) return null;

  return {
    classLabel: 'Heritage Racing Tournament Entry',
    title: detail.title,
    description: 'Select one of your registered horses to enter this tournament.',
    stats: [
      { label: 'Date', value: detail.dateRange },
      { label: 'Purse', value: formatCurrency(detail.final.distance ? undefined : undefined), tone: 'gold' as const },
      { label: 'Location', value: detail.location },
      { label: 'Distance', value: detail.final.distance },
      { label: 'Entries', value: `${detail.participants.length}/${detail.participants.length || 20} Horses`, tone: 'gold' as const },
    ],
    rules: [
      {
        title: 'Eligibility',
        icon: 'shield',
        items: ['Horse must belong to your stable.', 'Tournament status must allow entries.', 'Only one active entry per horse.'],
      },
      {
        title: 'Racing Rules',
        icon: 'gavel',
        items: ['Track rules are enforced by referees.', 'Late entries may be rejected.', 'Entries require admin approval.'],
      },
      {
        title: 'Prize Breakdown',
        icon: 'trophy',
        items: ['Official prize distribution is published after results confirmation.'],
      },
    ],
  };
}

export async function getHorseOwnerRegisteredTournamentsData() {
  const user = getCurrentUser();
  const tournaments = await fetchAllTournaments().catch(() => []);
  const grouped = (
    await Promise.all(
      tournaments.map(async (tournament) => ({
        tournament,
        entries: await fetchEntriesByTournament(tournament.id).catch(() => []),
      })),
    )
  ).flatMap(({ tournament, entries }) =>
    entries
      .filter((entry) => entry.horse?.owner?.id === user?.id || entry.horse?.owner?.email === user?.email)
      .map((entry) => ({
        id: String(entry.id),
        name: tournament.name,
        location: tournament.location || 'Location pending',
        horse: entry.horse?.name || 'Horse',
        jockey: entry.jockey?.fullName || 'Unassigned',
        date: formatDateRange(tournament.startDate, tournament.endDate),
        entryStatus: entry.status || 'PENDING',
        status: entry.race?.status || tournament.status || 'UPCOMING',
        prizePool: formatCurrency(tournament.prizePool),
      })),
  );

  return {
    title: 'Registered Tournaments',
    subtitle:
      "Oversee your elite racing schedule. Manage assigned jockeys and monitor the performance of your stable's finest thoroughbreds across the season's premier events.",
    stats: {
      upcomingEvents: grouped.filter((item) => !/finished|complete|completed/i.test(item.status || '')).length,
      totalCommittedStakes: formatCurrency(grouped.length * 100),
    },
    tournaments: grouped,
    total: grouped.length,
    deadlineTitle: 'Registration Deadlines',
    deadlineText:
      'Tournament changes and jockey reassignments must be finalized at least 72 hours prior to the race date. Please contact the Club Concierge for expedited modifications.',
  };
}

export async function getHorseOwnerHorseLeaderboardData() {
  const horses = await fetchMyHorses().catch(() => []);
  const sorted = [...horses].sort((a, b) => {
    const aRatio = a.totalRaces ? (a.totalWins || 0) / a.totalRaces : 0;
    const bRatio = b.totalRaces ? (b.totalWins || 0) / b.totalRaces : 0;
    return bRatio - aRatio;
  });

  return {
    horses: sorted.map((horse, index) => ({
      id: String(horse.id),
      rank: index + 1,
      name: horse.name,
      owner: horse.owner?.fullName || getCurrentUser()?.fullName || 'Owner',
      breed: horse.breed || 'Unknown',
      age: horse.age ?? 'TBA',
      winRatio: horse.totalRaces ? Math.round(((horse.totalWins || 0) / horse.totalRaces) * 100) : 0,
      totalStarts: horse.totalRaces || 0,
      lastResult: {
        position: `${horse.totalWins || 0} Wins`,
        race: 'Stable record',
      },
      imageSrc: horse.imageUrl,
    })),
  };
}

export async function getHorseOwnerHorseDetailData(slug: string) {
  const user = getCurrentUser();
  const horses = await fetchMyHorses().catch(() => []);
  const horse = horses.find((item) => slugify(item.name) === slug || String(item.id) === slug);
  if (!horse) return null;

  const tournaments = await fetchAllTournaments().catch(() => []);
  const relatedEntries = (
    await Promise.all(
      tournaments.map(async (tournament) => ({
        tournament,
        entries: await fetchEntriesByTournament(tournament.id).catch(() => []),
      })),
    )
  ).flatMap(({ tournament, entries }) =>
    entries
      .filter((entry) => entry.horse?.id === horse.id)
      .map((entry) => ({
        tournament: tournament.name,
        date: formatDate(entry.registeredAt),
        race: entry.race?.name || 'Race',
        jockey: entry.jockey?.fullName || 'Unassigned',
        time: formatDateTime(entry.approvedAt || entry.registeredAt),
        position: entry.status || 'Pending',
      })),
  );

  return {
    id: String(horse.id),
    name: horse.name,
    owner: horse.owner?.fullName || user?.fullName || 'Owner',
    breed: horse.breed || 'Unknown',
    age: horse.age ? String(horse.age) : 'TBA',
    gender: horse.color || horse.status || 'TBA',
    imageSrc: horse.imageUrl || '',
    heroImageSrc: horse.imageUrl || '',
    rank: undefined,
    winRatio: horse.totalRaces ? Math.round(((horse.totalWins || 0) / horse.totalRaces) * 100) : 0,
    totalStarts: horse.totalRaces || 0,
    totalEarnings: formatCurrency((horse.totalWins || 0) * 1000),
    raceHistory: relatedEntries,
  };
}

function createJsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function handleLegacyHorseOwnerEndpoint(pathname: string) {
  if (pathname === '/api/horse-owner/home') {
    return createJsonResponse(await getHorseOwnerHomeData());
  }

  if (pathname === '/api/horse-owner/my-horses' || pathname === '/api/horse-owner/horses') {
    return createJsonResponse(await getHorseOwnerMyHorsesData());
  }

  if (pathname === '/api/horse-owner/profile') {
    return createJsonResponse(await getHorseOwnerProfileData());
  }

  if (pathname === '/api/horse-owner/notifications') {
    return createJsonResponse(await getHorseOwnerNotificationsData());
  }

  if (pathname === '/api/horse-owner/jockeys') {
    return createJsonResponse(await getHorseOwnerInviteJockeysData());
  }

  if (pathname === '/api/horse-owner/jockey-invitations') {
    return createJsonResponse(readCachedOwnerInvitations() || { invitations: [] });
  }

  if (pathname === '/api/horse-owner/tournaments') {
    return createJsonResponse(await getHorseOwnerTournamentListData());
  }

  if (pathname === '/api/horse-owner/my-tournaments') {
    return createJsonResponse(await getHorseOwnerTournamentListData());
  }

  const tournamentDetailMatch = pathname.match(/^\/api\/horse-owner\/tournaments\/([^/]+)$/);
  if (tournamentDetailMatch) {
    const detail = await getHorseOwnerTournamentDetailData(decodeURIComponent(tournamentDetailMatch[1]));
    return createJsonResponse(detail || {}, detail ? 200 : 404);
  }

  const registerMatch = pathname.match(/^\/api\/horse-owner\/tournaments\/([^/]+)\/register$/);
  if (registerMatch) {
    const detail = await getHorseOwnerTournamentRegisterData(decodeURIComponent(registerMatch[1]));
    return createJsonResponse(detail || {}, detail ? 200 : 404);
  }

  return null;
}

export function installLegacyApiBridge() {
  if (typeof window === 'undefined') return;
  if ((window as unknown as Record<string, unknown>)[LEGACY_BRIDGE_FLAG]) return;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const requestUrl =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    const url = new URL(requestUrl, window.location.origin);
    const isLegacyOwnerEndpoint =
      (url.origin === window.location.origin || !/^https?:/i.test(requestUrl)) &&
      url.pathname.startsWith('/api/horse-owner/');

    if (isLegacyOwnerEndpoint) {
      const response = await handleLegacyHorseOwnerEndpoint(url.pathname);
      if (response) return response;
    }

    return originalFetch(input, init);
  };

  (window as unknown as Record<string, unknown>)[LEGACY_BRIDGE_FLAG] = true;
}
