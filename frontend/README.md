# Mtm Frontend (React + Agora)

This folder contains a lightweight Vite + React scaffold with a basic Agora WebRTC demo component.

Prerequisites
- Node 18+ and npm
- An Agora account and an App ID (get one at https://console.agora.io)

Local development
1. Copy .env.example -> .env and set VITE_AGORA_APP_ID and optionally VITE_AGORA_TOKEN (for quick testing only).
2. Install and run:
   npm install
   npm run dev

Notes on tokens
- The example supports passing a short-lived token via VITE_AGORA_TOKEN for quick testing, but in production you must implement a token server that mints tokens on demand.
