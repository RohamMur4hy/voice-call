export default function handler(request, response) {
  if (request.method !== 'GET') return response.status(405).json({ error: 'روش درخواست پشتیبانی نمی‌شود.' });
  if (!process.env.JAAS_APP_ID) return response.status(500).json({ error: 'شناسه JaaS روی سرور تنظیم نشده است.' });
  return response.status(200).json({ appId: process.env.JAAS_APP_ID });
}
