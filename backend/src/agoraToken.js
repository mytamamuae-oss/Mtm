// Helper to build Agora tokens using agora-access-token
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

function buildToken({ appId, appCertificate, channelName, uid = 0, role = 'publisher', ttlSec = 3600 }) {
  const roleEnum = role === 'audience' ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;
  const currentTs = Math.floor(Date.now() / 1000);
  const privilegeTs = currentTs + Number(ttlSec);
  // buildTokenWithUid supports numeric uid or string; using uid as number default 0
  return RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, roleEnum, privilegeTs);
}

module.exports = { buildToken };
