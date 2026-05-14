# Mtm backend (demo)

Quick start for the demo backend that issues Agora tokens and provides a minimal products/orders API.

1. Copy env and fill credentials
   cp .env.example .env
   Fill AGORA_APP_ID and AGORA_APP_CERTIFICATE

2. Install & run:
   cd backend
   npm install
   npm run dev

3. Token usage:
   Request a token: GET http://localhost:4000/token?channel=mtm-demo&uid=123
   Response -> { appId, token, channel, uid }

4. Frontend integration:
   - Frontend should call /token and then call Agora client's join with the returned token:
     await client.join(appId, channel, token);

5. Production:
   - Use HTTPS and authenticate the /token endpoint (only allow tokens for logged-in users).
   - Do not expose App Certificate to clients or public repos.
   - Replace in-memory product store with a real DB (Postgres), implement idempotency & payment flows.
