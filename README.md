# Mtm

Mt project — a combined ecommerce + live video streaming platform (TikTok-style with integrated shopping).

## Vision

Build a scalable mobile-first ecommerce app with a short-video feed and live streaming commerce that lets creators sell during streams and viewers buy with one tap. Improve on existing short-video platforms by making commerce first-class: low-friction checkout, direct product linking in videos, creator storefronts, and stronger moderation and performance.

## High-level features

- Short-form vertical video feed (algorithmic + follow)
- Live streaming with in-stream product linking and real-time purchases
- Full ecommerce: product catalog, cart, checkout, payments, orders
- Creator profiles and storefronts
- Social features: follow, like, comment, share, DM
- Notifications (real-time and push)
- Admin dashboard and moderation tools

## Recommended tech stack (suggestion)

- Backend: Node.js (NestJS/Express) or Python (Django/DRF)
- Realtime: WebSocket (Socket.io) or WebRTC for interactive features
- Streaming: WebRTC for low-latency interaction + HLS for broad delivery
- Video processing: FFmpeg (transcoding, thumbnails), AWS Elemental MediaConvert optional
- Storage: AWS S3 or Google Cloud Storage
- Database: PostgreSQL (relational data) + Redis (caching, rate-limiting)
- Search: Elasticsearch or Typesense for product/video search
- Mobile: React Native or Flutter
- Web front-end: Next.js (React) for SSR/SEO and fast web experience
- Payments: Stripe, local providers where needed
- CDN: CloudFront, Fastly, or Cloudflare for video + assets

## Getting started (developer workflow)

1. Clone the repo
   ```bash
   git clone https://github.com/mytamamuae-oss/Mtm.git
   cd Mtm
   ```
2. Create a backend and frontend workspace (examples)
   - backend/
   - frontend/
   - mobile/

3. Local development tips
   - Use Docker Compose to run PostgreSQL, Redis, and a local MinIO for S3-compatible storage.
   - Expose local WebRTC signaling with ngrok or a dev tunnel when testing mobile devices.

## Documentation and next steps

- docs/ARCHITECTURE.md — architecture and data flow (added)
- docs/architecture-diagram.mmd — mermaid diagram for the high-level system

## Contributing

- Add issues for features and bugs.
- Follow the coding style in each subproject.
- Open PRs against `main` or the agreed branch; include tests where appropriate.

## License

This repository is licensed under the MIT License.
