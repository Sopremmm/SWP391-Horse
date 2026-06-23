# Heritage Racing - React Component Structure

A clean, modular React implementation of the Heritage Racing dashboard design.

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx              # Top navigation bar with logo and links
│   ├── WelcomeSection.tsx       # Welcome message and introduction
│   ├── FeaturedRaceCard.tsx     # Hero card with featured race details
│   ├── RaceCard.tsx             # Individual race card component
│   ├── RaceCardList.tsx         # Container for race cards grid
│   ├── StatsSection.tsx         # Statistics display section
│   ├── Footer.tsx               # Footer with links and info
│   ├── icons/
│   │   └── LocationIcon.tsx     # All SVG icons (Location, Calendar, Clock, etc.)
│   └── index.ts                 # Component exports barrel
└── Main UI/
    └── HOHomepage.tsx           # Main page component (entry point)
```

## 🎯 Component Overview

### Header
- Fixed navigation bar with logo
- Navigation links with active state styling
- User avatar and notification bell

### WelcomeSection
- Welcome greeting with user name
- Dashboard badge
- Introductory text

### FeaturedRaceCard
- Hero card with background image
- Gradient overlay effect
- Race details (title, location, description)
- Prize pool information
- "View Race Details" button

### RaceCard
- Reusable card component
- Date display
- Status indicator (closing soon / ends on)
- Race title and location
- Participating horse name

### RaceCardList
- Grid layout for multiple race cards
- "View Full Calendar" button
- Section header with description

### StatsSection
- Statistics display (12 active horses, 8 stakes wins, £4.2M earnings)
- "Generate Performance Report" button
- Green background with subtle background pattern

### Footer
- Company branding
- Company description
- Navigation links (Privacy, Terms, Support, About)
- Copyright information

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Colors**: Heritage Racing brand colors (green-950, orange-300, yellow-800)
- **Typography**: Liberation Serif (headings), Manrope (body)
- **Spacing**: Consistent 16px padding/gaps

## 💡 Key Features

✅ **Modular Components** - Each component has a single responsibility
✅ **TypeScript** - Full type safety with interfaces
✅ **Responsive Design** - Tailwind responsive classes
✅ **Clean Code** - Well-organized, easy to maintain
✅ **Reusable** - Components can be used independently
✅ **Icon System** - SVG icons organized in dedicated folder

## 🚀 Usage

```tsx
import HOHomepage from './Main UI/HOHomepage';

function App() {
  return <HOHomepage />;
}
```

## 📦 Component Props

### FeaturedRaceCard
```tsx
interface FeaturedRaceCardProps {
  title: string;
  location: string;
  description: string;
  imageUrl: string;
  prizePool: string;
  raceDate: string;
  timeUntilStart: string;
}
```

### RaceCard
```tsx
interface RaceCardProps {
  date: string;
  status: 'closing-soon' | 'ends-on';
  statusDate: string;
  title: string;
  location: string;
  horseParticipating: string;
}
```

## 🔄 Scalability

To add more race cards, simply add items to the `raceCards` array in `RaceCardList.tsx`. The component will automatically render them.

## 📝 Notes

- All placeholder images use `https://placehold.co/` for demo purposes
- Replace with actual image URLs in production
- Font families reference custom fonts - ensure they're installed in your project
- Hover states are included for interactive elements
