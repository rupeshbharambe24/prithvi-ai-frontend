<div align="center">

# 🖥️ PRITHVI-AI · Frontend Console

### Interactive climate-health intelligence dashboard

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![MapLibre](https://img.shields.io/badge/MapLibre-GL-396CB2?logo=maplibre&logoColor=white)](https://maplibre.org/)

*Part of [PRITHVI-AI](https://github.com/rupeshbharambe24/prithvi-ai) · talks to the [FastAPI backend](https://github.com/rupeshbharambe24/prithvi-ai-backend).*

</div>

---

> [!NOTE]
> The operations console for PRITHVI-AI: an interactive, map-driven dashboard where
> epidemiologists and hospital teams explore **heat, disease, surge, and air-quality
> forecasts**, browse the **evidence knowledge graph**, plan **scenarios**, and monitor
> **model performance, fairness, and alerts** — with light/dark themes and i18n.

## 📑 Contents

- [Features](#-features) · [Pages](#-pages) · [Tech stack](#-tech-stack)
- [Quick start](#-quick-start) · [Configuration](#-configuration) · [Project structure](#-project-structure)

## ✨ Features

- 🗺️ **Interactive maps** — region risk layers rendered with MapLibre GL + vector tiles
- 📊 **Forecast dashboards** — risk scores with **p05/p95 uncertainty bands** and SHAP drivers
- 🕸️ **Knowledge-graph explorer** — Cytoscape graph of climate/disease/evidence entities
- 🧪 **Scenario planner** & 🎯 **resource view** backed by the optimizer
- 📉 **Model & fairness monitoring** — registry, skill-over-time, drift, per-region gaps
- 🔔 **Alerts** management with rules and severities
- 🌗 **Dark / light theme**, 🌐 **i18n** (i18next), ⚡ animated UI (Framer Motion)
- 🔐 Cookie + CSRF auth flow with role-based route protection

## 🧭 Pages

| Route | Page | Route | Page |
|-------|------|-------|------|
| `/console/overview` | 📋 Overview | `/console/scenario` | 🧪 Scenario Planner |
| `/console/heat` | 🌡️ Heat Risk | `/console/kg` | 🕸️ Knowledge Graph |
| `/console/disease` | 🦟 Disease Risk | `/console/evidence` | 📚 Evidence |
| `/console/hospital` | 🏥 Hospital Surge | `/console/catalog` | 🗂️ Data Catalog |
| `/console/air` | 🌫️ Air Quality | `/console/fairness` | ⚖️ Fairness & QA |
| `/console/models` | 🤖 Models | `/console/alerts` | 🔔 Alerts |

## 🧱 Tech stack

`React 18` · `Vite 5` · `TypeScript 5` · `Tailwind CSS` · `shadcn/ui` (Radix) ·
`TanStack Query` · `React Router` · `MapLibre GL` · `Cytoscape` · `Recharts` ·
`react-hook-form` + `zod` · `i18next` · `Framer Motion`

## 🚀 Quick start

> [!IMPORTANT]
> Start the [backend](https://github.com/rupeshbharambe24/prithvi-ai-backend) first (port 8000).

```bash
npm install
npm run dev          # → http://localhost:5173
```

Other scripts:

```bash
npm run build        # production build
npm run preview      # preview the production build
npm run lint         # lint
```

**Demo login:** `admin@example.com` / `Admin123!`

## ⚙️ Configuration

Create `.env.development.local` (git-ignored) to point at your backend:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_PREFIX=/api/v1
```

API requests are sent with `credentials: 'include'`; write requests send an `X-CSRF-Token`
header read from the `csrf_token` cookie.

## 📁 Project structure

```
src/
├── pages/
│   ├── console/      Overview, HeatRisk, DiseaseRisk, HospitalSurge, AirQuality,
│   │                 Scenario, KnowledgeGraph, Evidence, Catalog, Fairness, Models, Alerts
│   └── auth/         Login, Signup
├── components/
│   ├── console/      Sidebar, Topbar, RegionPicker, DateLeadPicker
│   └── ui/           shadcn/ui primitives
├── hooks/            use-api, use-toast, use-mobile
├── lib/              api-client, rbac, i18n, utils
└── store/            app store (theme, session)
```

## 📜 License

MIT.

<div align="center"><sub>The human-facing window into PRITHVI-AI's forecasts. 🌍📈</sub></div>
