# Screenshots Directory

This folder is used to store screenshots captured during testing of the Spectator module.

## Folder Structure

```
src/screenshots/
├── README.md                    # This file
├── SpectatorMockupTest.jsx     # Mockup test page for all Spectator screens
├── spect-flow-diagram.png       # Screen flow diagram
├── spect-01-home.png            # Spectator Home
├── spect-02-tournaments.png     # Tournaments List
├── spect-03-tournament-detail.png # Tournament Detail
├── spect-04-horses.png          # Horse Registry
├── spect-05-horse-detail.png    # Horse Detail
├── spect-06-jockeys.png         # Jockeys List
├── spect-07-jockey-profile.png   # Jockey Profile
├── spect-08-live.png            # Live Racing
├── spect-09-dashboard.png        # Spectator Dashboard
├── spect-10-bets.png            # Betting History
├── spect-11-notifications.png    # Notifications
└── spect-12-profile.png          # Profile
```

## Using Chrome DevTools MCP for Screenshots

The `user-chrome-devtools` MCP server provides the `take_screenshot` tool.

### Capture a Screenshot

Use the `take_screenshot` tool with the `filePath` parameter to save directly to this folder:

```javascript
take_screenshot({
  filePath: "src/screenshots/spect-01-home.png",
  fullPage: true  // Capture full page instead of viewport
})
```

### Available Screenshot Formats

- `png` (default)
- `jpeg`
- `webp`

## Spectator Screen Flow

### Public Screens (No Authentication)

```
Spectator Home (/spectator/home)
├── Tournaments List (/spectator/tournaments)
│   └── Tournament Detail (/spectator/tournaments/:raceId)
│       └── Place Bet → Redirect to Dashboard
├── Horse Registry (/spectator/horses)
│   └── Horse Detail (/spectator/horses/:horseId)
│       └── Place Bet → Redirect to Dashboard
├── Jockeys List (/spectator/jockeys)
│   └── Jockey Profile (/spectator/jockeys/:jockeyId)
└── Live Racing (/spectator/live)
```

### Authenticated Screens (Login Required)

```
Spectator Dashboard (/spectator)
├── Races Tab (default)
├── My Predictions Tab
│   └── Betting History (/spectator/bets)
└── Results Tab

Navigation from Dashboard:
├── Betting History (/spectator/bets)
├── Notifications (/spectator/notifications)
├── Live Racing (/spectator/live)
└── Profile (/spectator/profile)
    ├── Overview Tab
    ├── Activity Tab
    └── Settings Tab
```

## Test Checklist

- [ ] Spectator Home loads correctly
- [ ] Tournaments List displays all races
- [ ] Tournament Detail shows betting options
- [ ] Horse Registry displays all horses
- [ ] Horse Detail shows horse stats
- [ ] Jockeys List shows all jockeys
- [ ] Jockey Profile shows performance history
- [ ] Live Racing updates in real-time
- [ ] Dashboard login flow works
- [ ] Betting History displays past bets
- [ ] Notifications show bet results
- [ ] Profile settings save correctly
- [ ] Navigation between screens works
- [ ] Mobile responsive layout
- [ ] All images load correctly

## Testing Commands

```bash
# Start development server
npm run dev

# Open mockup test page
# Navigate to http://localhost:5173/test/mockup
```

## All Spectator Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/spectator/home` | SpectatorHome.jsx | Landing page |
| `/spectator/tournaments` | TournamentsList.jsx | Tournament list |
| `/spectator/tournaments/:raceId` | TournamentDetail.jsx | Tournament detail |
| `/spectator/horses` | HorseRegistry.jsx | Horse list |
| `/spectator/horses/:horseId` | HorseDetail.jsx | Horse detail |
| `/spectator/jockeys` | JockeysList.jsx | Jockey list |
| `/spectator/jockeys/:jockeyId` | JockeyProfile.jsx | Jockey detail |
| `/spectator/live` | LiveRaces.jsx | Live racing |
| `/spectator` | SpectatorDashboard.jsx | Main dashboard |
| `/spectator/bets` | BettingHistory.jsx | Betting history |
| `/spectator/notifications` | SpectatorNotifications.jsx | Notifications |
| `/spectator/profile` | SpectatorProfile.jsx | User profile |
| `/test/mockup` | SpectatorMockupTest.jsx | Mockup test page |
