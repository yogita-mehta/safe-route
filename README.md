# SafeRoute 🛡️

A safety-focused navigation app that helps users find the safest routes between locations using real-time safety scoring and community-driven data.

## Features

- **Safe Route Planning** - Find the safest path between any two locations with real-time safety scores
- **Interactive Safety Map** - Visualize safety zones and route options on an interactive Leaflet map
- **Address Autocomplete** - Search for locations with real geocoding powered by OpenStreetMap/Nominatim
- **Multiple Route Options** - Compare different routes with safety scores, distance, and estimated time
- **SOS Emergency Button** - Quick access emergency feature with hold-to-activate protection
- **Real-time Location** - Track your current position on the map
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Maps**: Leaflet + React-Leaflet + OpenStreetMap tiles
- **Routing**: OSRM (Open Source Routing Machine)
- **Geocoding**: Nominatim (OpenStreetMap)
- **Animations**: Framer Motion
- **Backend**: Supabase

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd saferoute

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── FeaturesGrid.tsx # Feature cards display
│   ├── HeroSection.tsx  # Landing page hero
│   ├── Navbar.tsx       # Navigation bar
│   ├── RouteSearch.tsx  # Route search with autocomplete
│   ├── SafetyMap.tsx    # Interactive Leaflet map
│   ├── SafetyScore.tsx  # Safety score display
│   └── SOSButton.tsx    # Emergency SOS feature
├── hooks/
│   └── useAddressSearch.ts # Address autocomplete hook
├── lib/
│   ├── geocoding.ts     # Nominatim geocoding service
│   ├── routing.ts       # OSRM routing service
│   ├── safetyData.ts    # Safety scoring logic
│   └── utils.ts         # Utility functions
├── pages/
│   ├── Index.tsx        # Landing page
│   ├── MapPage.tsx      # Main map interface
│   ├── About.tsx        # About page
│   └── NotFound.tsx     # 404 page
└── integrations/
    └── supabase/        # Backend integration
```

## How It Works

1. **Enter Locations** - Type your origin and destination using the address search
2. **Get Routes** - The app fetches real routes from OSRM and calculates safety scores
3. **Compare Options** - View multiple route alternatives with safety ratings
4. **Navigate Safely** - Select the safest route and view it on the interactive map

## Safety Scoring

Routes are evaluated based on multiple factors:
- Area safety zones
- Time of day considerations
- Historical safety data
- Community reports

Scores range from 0-100:
- 🟢 **80-100**: Very Safe
- 🟡 **60-79**: Moderate
- 🟠 **40-59**: Use Caution
- 🔴 **0-39**: Avoid if Possible


## License

This project is open source and available under the MIT License.

---

