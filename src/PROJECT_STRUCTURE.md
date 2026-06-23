# Professional Front-End Project Structure

A well-organized, scalable React + TypeScript project following industry best practices.

## 📁 Directory Structure

```
src/
├── assets/                    # Static assets
│   └── icons/               # SVG icon components
│
├── components/              # Reusable UI components
│   ├── common/             # Shared components (Header, Footer)
│   ├── cards/              # Card components (RaceCard, FeaturedRaceCard)
│   ├── sections/           # Page sections (WelcomeSection, RaceCardList, etc.)
│   └── index.ts            # Components barrel export
│
├── pages/                   # Page/route components
│   ├── DashboardPage.tsx   # Main dashboard/homepage
│   └── index.ts            # Pages barrel export
│
├── types/                   # TypeScript type definitions & interfaces
│   └── index.ts            # All types/interfaces
│
├── constants/              # Application constants
│   └── index.ts            # Navigation, data, branding constants
│
├── styles/                 # Global styles
│   └── globals.css         # Theme variables & global styles
│
├── utils/                  # Utility functions (empty, ready for helpers)
│
├── App.tsx                 # Application root component
├── index.tsx               # Entry point
└── Main UI/               # Legacy components (can be migrated)
    ├── HOHomepage.tsx     # Can be deprecated (use DashboardPage instead)
    ├── Login.js
    └── Register.js
```

## 🏗️ Component Organization

### Common Components (`components/common/`)
Shared layout components used across multiple pages:
- **Header.tsx** - Fixed navigation bar with logo and nav links
- **Footer.tsx** - Application footer with links and copyright

### Card Components (`components/cards/`)
Reusable card components:
- **RaceCard.tsx** - Individual race card with date, status, location
- **FeaturedRaceCard.tsx** - Large hero card for featured races

### Section Components (`components/sections/`)
Self-contained page sections:
- **WelcomeSection.tsx** - Welcome greeting and intro text
- **RaceCardList.tsx** - Grid/list of race cards
- **StatsSection.tsx** - Performance statistics display

## 📄 Type System

All TypeScript types are centralized in `types/index.ts`:

```tsx
// Example
export interface RaceCardProps {
  date: string;
  status: 'closing-soon' | 'ends-on';
  statusDate: string;
  title: string;
  location: string;
  horseParticipating: string;
}
```

## ⚙️ Constants Management

Application-wide constants in `constants/index.ts`:
- `NAV_LINKS` - Navigation menu items
- `FOOTER_LINKS` - Footer links
- `RACE_CARDS` - Race data
- `FEATURED_RACE` - Featured race details
- `STATISTICS` - Performance stats
- `BRAND` - Branding info

**Benefits:**
- Centralized data management
- Easy to update without touching components
- Type-safe with TypeScript

## 🎨 Styling Approach

- **Tailwind CSS** - Utility-first styling
- **CSS Variables** - Theme colors in `styles/globals.css`
- **Component-scoped** - Styles defined with className attributes

### Available CSS Variables:
```css
--color-primary: #002A15;        /* green-950 */
--color-secondary: #FFA500;      /* orange-300 */
--color-accent: #AD7A1A;         /* yellow-800 */
--color-danger: #BA1A1A;         /* red-700 */
--font-serif: 'Liberation Serif';
--font-sans: 'Manrope';
```

## 📦 Barrel Exports

Simplified imports using barrel exports:

```tsx
// ❌ Before (cluttered)
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { RaceCard } from '../components/cards/RaceCard';

// ✅ After (clean)
import { Header, Footer, RaceCard } from '../components';
```

## 🚀 Best Practices Implemented

✅ **Separation of Concerns** - Each file has a single responsibility
✅ **Type Safety** - Full TypeScript with interfaces for all props
✅ **Reusability** - Components can be used independently
✅ **Scalability** - Easy to add new components/pages
✅ **Maintainability** - Clear structure, consistent naming
✅ **Documentation** - JSDoc comments on components
✅ **Performance** - Optimized imports and lazy loading ready
✅ **DRY Principle** - Shared constants, no duplicated data

## 🔄 Import Patterns

### Importing Components:
```tsx
import { Header, Footer } from '../components';
import { DashboardPage } from '../pages';
```

### Importing Types:
```tsx
import { RaceCardProps, FeaturedRaceCardProps } from '../types';
```

### Importing Constants:
```tsx
import { NAV_LINKS, RACE_CARDS, FEATURED_RACE } from '../constants';
```

### Importing Icons:
```tsx
import { LocationIcon, CalendarIcon } from '../assets/icons';
```

## 📱 Adding New Features

### Adding a New Page:
1. Create file in `pages/` folder
2. Use components from `components/`
3. Export in `pages/index.ts`
4. Add route in `App.tsx`

### Adding a New Component:
1. Determine category (common/cards/sections)
2. Create file in appropriate folder
3. Export in folder's `index.ts`
4. Export in main `components/index.ts`

### Adding New Constants:
1. Add to `constants/index.ts`
2. Import where needed
3. Use throughout app

## 🔗 File Navigation

| Path | Purpose |
|------|---------|
| `src/types/` | All TypeScript interfaces |
| `src/constants/` | Application data & config |
| `src/components/` | Reusable UI components |
| `src/pages/` | Full page components |
| `src/styles/` | Global styles & theme |
| `src/assets/` | Images, icons, static files |
| `src/utils/` | Helper functions (ready for use) |

## ✨ Next Steps

Ready to extend with:
- Utility functions in `utils/`
- API services in new `services/` folder
- Custom hooks in new `hooks/` folder
- State management (Redux/Context)
- Testing setup
- Environment configuration

---

**Structure follows:** React/Next.js best practices, clean code principles, and industry standards.
