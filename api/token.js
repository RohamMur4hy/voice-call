import crypto from 'node:crypto';

function base64Url(value) {
  return Buffer.from(value).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function cleanRoom(value) {
  return String(value || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
}

function cleanName(value) {
  return String(value || 'مهمان').replace(/[<>]/g, '').trim().slice(0, 32) || 'مهمان';
}

function createToken({ appId, apiKey, privateKey, room, name }) {
  const now = Math.floor(Date.now() / 1000);
  const header = { typ: 'JWT', alg: 'RS256', kid: `${appId}/${apiKey}` };
  const payload = {
    aud: 'jitsi',
    iss: 'chat',
    sub: appId,
    room,
    exp: now + 3600,
    nbf: now - 10,
    context: {
      user: { id: crypto.randomUUID(), name },
      features: { livestreaming: false, recording: false, transcription: false, 'outbound-call': false }
    }
  };
  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(payload));
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(`${encodedHeader}.${encodedPayload}`);
  signer.end();
  const signature = signer.sign(privateKey);
  return `${encodedHeader}.${encodedPayload}.${base64Url(signature)}`;
}

export default function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'روش درخواست پشتیبانی نمی‌شود.' });
  const appId = process.env.JAAS_APP_ID;
  const apiKey = process.env.JAAS_API_KEY;
  const privateKey = process.env.JAAS_PRIVATE_KEY;
  if (!appId || !apiKey || !privateKey) return response.status(500).json({ error: 'تنظیمات JaaS روی سرور کامل نیست.' });
  const room = cleanRoom(request.body?.room);
  const name = cleanName(request.body?.name);
  if (!room) return response.status(400).json({ error: 'شناسه اتاق معتبر نیست.' });
  try {
    return response.status(200).json({ token: createToken({ appId, apiKey, privateKey, room, name }) });
  } catch {
    return response.status(500).json({ error: 'توکن اتصال ساخته نشد.' });
  }
}
