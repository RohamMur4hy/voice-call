# آوا، اتاق گفت‌وگوی صوتی با Jitsi

آوا یک Voice Chat فارسی و RTL است که انتقال صدای واقعی را با WebRTC از طریق Jitsi Meet IFrame API انجام می‌دهد. این نسخه Backend اختصاصی، دیتابیس و Secret ندارد و برای GitHub Pages یا هر Static Hosting مناسب است.

## اجرا روی سیستم

به دلیل محدودیت میکروفون در بعضی مرورگرها، پروژه را با یک Static Server باز کن. اگر Python نصب است:

```powershell
py -m http.server 8080
```

بعد برو به:

```text
http://localhost:8080
```

باز کردن مستقیم فایل با `file://` برای تست کامل پیشنهاد نمی‌شود.

## Deploy روی GitHub Pages

۱. یک repository جدید در GitHub بساز.
۲. فایل‌های پروژه را در repository قرار بده.
۳. در GitHub به مسیر **Settings > Pages** برو.
۴. در بخش **Build and deployment** گزینه **Deploy from a branch** را انتخاب کن.
۵. branch اصلی و پوشه `/ (root)` را انتخاب کن.
۶. Save را بزن.

چون `index.html` در ریشه پروژه قرار دارد، GitHub Pages همان صفحه را منتشر می‌کند. فایل‌های `public` توسط فایل‌های ریشه استفاده می‌شوند.

## اجرای با Cloudflare Pages

۱. در Cloudflare وارد **Workers & Pages** شو.
۲. گزینه **Create application > Pages > Connect to Git** را انتخاب کن.
۳. repository را انتخاب کن.
۴. برای پروژه بدون build command، بخش Build command را خالی بگذار.
۵. Output directory را `/` یا مقدار پیش‌فرض root قرار بده.
۶. Deploy را بزن.

## استفاده

- روی «ساخت اتاق» بزن.
- نام نمایشی و نام اتاق را وارد کن.
- اجازه میکروفون را بده.
- لینک دعوت را برای دوستان بفرست.
- برای ورود با لینک، می‌توانی از `?room=ROOM_ID` یا `/room/ROOM_ID` استفاده کنی.

اتاق روی `meet.jit.si` ساخته می‌شود. بنابراین هرکس Room ID یکسان داشته باشد، به همان کنفرانس Jitsi وصل می‌شود.

## امکانات واقعی متصل به Jitsi

- صدای واقعی WebRTC از Jitsi
- `toggleAudio` برای روشن و خاموش کردن میکروفون
- `setParticipantVolume` برای صدای جداگانه هر کاربر
- `setAudioInputDevice` برای تغییر میکروفون
- `setAudioOutputDevice` در مرورگرهای پشتیبان
- رویدادهای ورود و خروج کاربران
- وضعیت mute کاربران
- تشخیص گوینده غالب با `dominantSpeakerChanged`
- وضعیت اتصال و رویدادهای reconnect
- نام نمایشی با `userInfo.displayName`
- خروج واقعی با `hangup`

## محدودیت‌های نسخه عمومی

- `meet.jit.si` سرویس عمومی است؛ برای کنترل مالکیت اتاق، احراز هویت، Room Password سازمانی یا Moderator تضمین‌شده باید Jitsi را self-host کنی یا از JaaS و JWT استفاده کنی.
- Room ID تصادفی است اما بدون JWT، هرکس لینک را داشته باشد می‌تواند تلاش کند وارد اتاق شود.
- تشخیص صحبت در UI بر اساس `dominantSpeakerChanged` است و از Audio Level خام استفاده نمی‌کند.
- کنترل‌های Moderator فقط زمانی باید فعال شوند که Jitsi نقش کاربر را `moderator` اعلام کند. عملیات moderation در این نسخه به‌صورت عمومی برای همه نمایش داده نمی‌شود.
- Jitsi API در iframe اجرا می‌شود و دسترسی مستقیم به Media Trackهای داخلی به اپلیکیشن نمی‌دهد؛ کنترل صدا از Command رسمی Jitsi انجام می‌شود.
- کیفیت و ظرفیت واقعی به وضعیت سرویس عمومی Jitsi، شبکه و مرورگر کاربران بستگی دارد.

## تغییر به Jitsi اختصاصی یا JaaS

در [public/app.js](public/app.js) مقدار domain در `createJitsi` قرار دارد:

```js
new JitsiMeetExternalAPI('meet.jit.si', options)
```

برای سرور اختصاصی، فقط domain را عوض کن. برای JaaS معمولاً JWT باید از Backend امن تولید شود؛ Secret مربوط به JWT را داخل Frontend قرار نده.

## تست چند کاربر

۱. یک اتاق بساز.
۲. لینک را کپی کن.
۳. آن را در پنجره Private، مرورگر دیگر یا پروفایل جدا باز کن.
۴. برای هر کاربر نام جدا وارد کن.
۵. مجوز میکروفون را در هر پنجره تأیید کن.

برای تست موبایل از URL HTTPS منتشرشده استفاده کن. `localhost` فقط روی همان دستگاه معتبر است.
