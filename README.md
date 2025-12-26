# SafeRoute 🛡️

A safety-focused navigation web app that finds the **safest route** between locations by comparing multiple paths with real-time safety scores. Perfect for night travel or unfamiliar areas.

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue.svg)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5-orange.svg)](https://vitejs.dev)

## 🚀 Features

- 🛤️ **Safe Route Planning** – Compares multiple routes with real-time safety scores
- 🗺️ **Interactive Safety Map** – Leaflet-powered map with safety zones
- 🔍 **Address Autocomplete** – Powered by OpenStreetMap Nominatim
- ⚖️ **Multiple Route Comparison** – Distance, time, & safety scores side-by-side
- 🚨 **SOS Emergency Button** – Hold-to-activate emergency feature
- 📍 **Real-Time Location Tracking** – Live user position on map
- 📱 **Fully Responsive** – Optimized for mobile & desktop

## 🧰 Tech Stack

| Category     | Technologies                          |
|--------------|---------------------------------------|
| **Frontend** | React 18, TypeScript, Vite           |
| **Styling**  | Tailwind CSS, shadcn/ui              |
| **Maps**     | Leaflet, React-Leaflet, OpenStreetMap|
| **Routing**  | OSRM (Open Source Routing Machine)   |
| **Backend**  | Supabase                            |
| **Extras**   | Framer Motion (animations)           |

## 🗂️ Project Structure

```
src/
├── components/
│ ├── ui/ # shadcn/ui components
│ ├── FeaturesGrid.tsx # Feature showcase
│ ├── HeroSection.tsx # Landing hero
│ ├── Navbar.tsx # Navigation
│ ├── RouteSearch.tsx # Location search
│ ├── SafetyMap.tsx # Interactive map
│ ├── SafetyScore.tsx # Safety metrics
│ └── SOSButton.tsx # Emergency button
├── hooks/
│ └── useAddressSearch.ts # Autocomplete logic
├── lib/
│ ├── geocoding.ts # Nominatim integration
│ ├── routing.ts # OSRM routing
│ ├── safetyData.ts # Safety scoring
│ └── utils.ts # Utilities
├── pages/
│ ├── Index.tsx # Landing page
│ ├── MapPage.tsx # Main app
│ ├── About.tsx # About page
│ └── NotFound.tsx # 404 page
└── integrations/
└── supabase/ # Backend setup
```


## ⚙️ How It Works

| Step | Action | Technology |
|------|--------|------------|
| **1️⃣ Enter Locations** | Type addresses with autocomplete | Nominatim API |
| **2️⃣ Fetch Routes** | Get multiple paths between points | OSRM Routing |
| **3️⃣ Safety Analysis** | Calculate safety score per route | Safety Scoring Logic |
| **4️⃣ Compare Routes** | View distance, time, safety scores | React Components |
| **5️⃣ Select Safe Route** | Follow safest route with live tracking | Leaflet + Geolocation |
| **🚨 Emergency** | Hold SOS button for quick help | Real-time alerts |


## 🧠 Safety Scoring (0-100)

| Score Range | Status     | Color |
|-------------|------------|-------|
| 80-100      | 🟢 Very Safe | Green |
| 60-79       | 🟡 Moderate  | Yellow|
| 40-59       | 🟠 Caution   | Orange|
| 0-39        | 🔴 Avoid     | Red   |

**Factors**: Area safety zones, time-of-day, historical data, community reports

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn

### Installation
```
git clone <your-repo-url>
cd saferoute
npm install
npm run dev
```

**App runs at**: http://localhost:5173

## 🔮 Future Improvements

- 🌐 Real-time crime/traffic data integration
- 🤖 ML-powered safety score prediction
- 👤 User auth & personalized preferences
- 📱 Push notifications for emergencies
- 🚀 PWA support for offline use

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

⭐ **Star this repo if you found it helpful!**  
🛡️ **Built with safety in mind**
