# Architecture for Mtm

This document describes the high-level architecture, components, and data flows for the Mtm ecommerce + live streaming platform.

## Goals

- Low-latency live interaction (sub-second where possible)
- Seamless commerce integration in video and live streams
- Scalable ingestion and delivery of video content
- Strong data consistency for orders and payments

## Major Components

1. Clients
   - Mobile app (React Native / Flutter)
   - Web app (Next.js)
   - Creator tools (web dashboard)

2. API Gateway / Backend
   - Auth service (JWT, OAuth providers, session management)
   - User & Profile service
   - Product & Catalog service
   - Order & Payment service (idempotent order processing)
   - Social service (follow/like/comment)
   - Notification service (push & in-app)

3. Streaming & Media
   - Live ingestion: WebRTC edge gateways for low-latency two-way streams
   - Recording & HLS packaging: Record live sessions, produce HLS/DASH variants for playback
   - Short video uploads: asynchronous transcoding and thumbnail generation
   - CDN: cache HLS segments and static assets close to users

4. Data Stores
   - Relational DB: PostgreSQL for primary domain data
   - Cache: Redis for sessions, leaderboards, and short-lived state
   - Object Storage: S3-compatible (videos, thumbnails, static assets)
   - Search: Elasticsearch / Typesense for fast product/video search

5. Real-time Infrastructure
   - Signaling servers for WebRTC (can be part of the livestream service)
   - WebSocket (Socket.io / Phoenix Channels) for realtime events (likes, comments, cart updates)
   - Message queue (RabbitMQ / Kafka) for decoupling long-running jobs (transcoding, order processing)

6. Video Processing
   - Worker pool with FFmpeg for transcoding, watermarking, and thumbnail extraction
   - Serverless options for bursty workloads (AWS Lambda + Elastic Transcoder / MediaConvert)

7. Payments
   - Integrate Stripe for card payments; local providers for region-specific payment methods
   - Ensure PCI compliance through tokenization and using hosted pages where possible

8. Observability & Security
   - Metrics: Prometheus + Grafana
   - Logs: ELK / Loki
   - Tracing: OpenTelemetry
   - WAF, rate limiting, SSO for admin areas, CAPTCHAs for high-risk flows

## Live stream flow (simplified)

1. Creator starts a stream in the mobile app.
2. Mobile uses WebRTC to connect to a regional WebRTC ingestion gateway (signaling + TURN if needed).
3. Gateway forwards / records stream to media-processing cluster.
4. Live viewers connect via WebRTC for low-latency interaction or HLS for larger audiences.
5. Creator links products to the stream (product IDs are sent to the stream metadata channel).
6. Viewer clicks a product -> cart checkout flow is opened; order created via Order service with strong consistency.
7. Payment is processed (Stripe), order state updated, confirmation sent via notifications.

## Scalability Patterns

- Autoscale ingestion and transcoding workers based on queue depth.
- Use regional edge gateways + CDNs for video delivery to reduce latency and cost.
- Partition time-series / analytics data into a data warehouse (Snowflake / BigQuery).
- Use CQRS for command/read separation in high-concurrency read scenarios (feeds, leaderboards).

## Security & Compliance

- Sensitive PII stored encrypted at rest; use field-level encryption where needed.
- Rate-limit actions that can be abused (comments, likes, purchases).
- Implement content moderation pipeline (automated detection + human review).

## Deployment

- Container-based deploy (Kubernetes) with Helm charts.
- Use managed DB (RDS / Cloud SQL) and managed Redis for operational simplicity.
- Use CI/CD pipeline to run tests, build images, and run canary deploys.

## Appendix: Suggested Services

- AWS: S3, EC2/EKS, RDS, Elasticache, MediaConvert, CloudFront
- GCP: Cloud Storage, GKE, Cloud SQL
- Alternatives: DigitalOcean App Platform + Spaces for smaller scale
