require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { buildToken } = require('./agoraToken');
const { router: productRouter } = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Token endpoint
// Example: GET /token?channel=mtm-demo&uid=123&role=publisher
app.get('/token', (req, res) => {
  const appId = process.env.AGORA_APP_ID;
  const appCert = process.env.AGORA_APP_CERTIFICATE;
  if (!appId || !appCert) {
    return res.status(500).json({ error: 'Agora credentials not configured on server.' });
  }

  const channel = req.query.channel || 'mtm-demo';
  const uid = req.query.uid ? Number(req.query.uid) : 0; // accept numeric uid
  const role = req.query.role || 'publisher';
  const ttl = process.env.TOKEN_TTL || 3600;

  try {
    const token = buildToken({ appId, appCertificate: appCert, channelName: channel, uid, role, ttlSec: ttl });
    res.json({ appId, token, channel, uid });
  } catch (err) {
    console.error('token error', err);
    res.status(500).json({ error: 'Failed to create token' });
  }
});

// Products + orders endpoints
app.use('/api', productRouter);

app.listen(PORT, () => {
  console.log(`Mtm backend running on http://localhost:${PORT}`);
});
