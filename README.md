# آوا، اتاق صوتی با Vercel و Jitsi JaaS

آوا یک Voice Chat فارسی و RTL است. صدای واقعی با WebRTC از طریق Jitsi JaaS منتقل می‌شود و Vercel Function فقط JWT کوتاه‌عمر می‌سازد. هیچ Private Key به مرورگر ارسال نمی‌شود.

## پیش‌نیاز

- Node.js نسخه ۱۸ یا جدیدتر
- حساب Vercel
- حساب Jitsi JaaS
- App ID، API Key و Private Key از JaaS

## تنظیم Secretها در Vercel

در داشبورد Vercel پروژه را باز کن و به **Settings > Environment Variables** برو. این متغیرها را برای Development، Preview و Production اضافه کن:

```text
JAAS_APP_ID
JAAS_API_KEY
JAAS_PRIVATE_KEY
```

مقدار `JAAS_PRIVATE_KEY` باید کامل باشد، شامل خطوط `BEGIN PRIVATE KEY` و `END PRIVATE KEY`. آن را داخل GitHub، JavaScript مرورگر یا فایل public قرار نده.

## اتصال پروژه به Vercel

```powershell
cd C:\Users\RohamMur4hy\Desktop\voicecall
npm.cmd install
npx vercel login
npx vercel link
```

برای تنظیم Secret از ترمینال نیز می‌توانی استفاده کنی:

```powershell
npx vercel env add JAAS_APP_ID production
npx vercel env add JAAS_API_KEY production
npx vercel env add JAAS_PRIVATE_KEY production
```

## اجرای محلی

```powershell
npx vercel env pull .env.local
npm.cmd run dev
```

سپس باز کن:

```text
http://localhost:3000
```

فایل `.env.local` را Commit یا Upload نکن.

## Deploy نهایی

```powershell
npm.cmd run deploy
```

یا:

```powershell
npx vercel --prod
```

آدرس HTTPS خروجی Vercel سایت اصلی آواست.

## تست

۱. سایت Vercel را باز کن.
۲. «ساخت اتاق» را بزن.
۳. نام و نام اتاق را وارد کن.
۴. اجازه Microphone را فعال کن.
۵. لینک دعوت را کپی کن.
۶. لینک را در مرورگر یا پروفایل دیگری باز کن.

JWT برای هر ورود در `/api/token` ساخته می‌شود و مشکل `membersOnly` سرویس عمومی `meet.jit.si` وجود ندارد.

## امکانات واقعی

- صدای واقعی WebRTC با Jitsi JaaS
- روشن و خاموش کردن میکروفون
- صدای جداگانه هر شرکت‌کننده
- انتخاب میکروفون و خروجی صدا در مرورگرهای پشتیبان
- نمایش کاربران و وضعیت mute
- تشخیص گوینده غالب
- وضعیت اتصال و reconnect
- لینک دعوت و ورود با Room ID

## ساختار مهم

```text
index.html
app.js
style.css
public/
  app.js
  index.html
  style.css
api/
  config.js
  token.js
vercel.json
```

فایل `api/token.js` تنها جایی است که Private Key را می‌خواند.
