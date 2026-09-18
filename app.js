/* ===================== آوا — Voice Room client ===================== */

const MAX_PARTICIPANTS = 10;

const state = {
  api: null,
  roomId: '',
  roomName: '',
  localId: '',
  participants: new Map(),
  muted: false,
  role: 'participant',
  connecting: false,
  joined: false,
  joinTimer: null,
  selectedMicId: '',
  selectedMicLabel: '',
  leaveTimer: null,
  micAsked: false,
  micGranted: true,
  lang: localStorage.getItem('ava-lang') || 'fa',
  chatUnread: false
};

/* ---------------------- i18n ---------------------- */

const STRINGS = {
  fa: {
    homeEyebrow: 'گفت‌وگوی صوتی آرام و واقعی',
    homeHero: 'اتاق صوتی خودت را بساز و با دوستانت صحبت کن.',
    homeCreate: 'ساخت اتاق',
    homeJoin: 'ورود به اتاق',
    homeCodeLabel: 'کد یا لینک اتاق',
    homeCodePlaceholder: 'مثلاً voice-8f3k29',
    continueAria: 'ادامه',
    homeNote: 'تا ۱۰ نفر، با صدای شفاف و کم‌مصرف',
    homeArtTitle: 'همین‌جا، همین حالا',
    homeArtSubtitle: 'تماس صوتی واقعی با Jitsi',
    profileAria: 'پروفایل',
    lobbyEyebrow: 'قبل از ورود',
    lobbyTitleCreate: 'آماده‌ای؟',
    lobbyTitleJoin: 'ورود به اتاق',
    lobbyIntro: 'یک نام انتخاب کن تا دوستانت تو را بشناسند.',
    lobbyNameLabel: 'نام نمایشی',
    lobbyNamePlaceholder: 'مثلاً رهام',
    lobbyJoiningAs: 'ورود با نام',
    lobbyChangeName: 'تغییر',
    lobbyRoomLabel: 'نام اتاق',
    lobbyRoomPlaceholder: 'مثلاً دورهمی شبانه',
    lobbyMicLabel: 'میکروفون',
    micDefault: 'میکروفون پیش‌فرض',
    lobbyPermissionNote: 'برای صحبت کردن، مرورگر از تو اجازه دسترسی به میکروفون می‌خواهد.',
    lobbySubmitCreate: 'ساخت اتاق',
    lobbySubmitJoin: 'ورود به اتاق',
    lobbyChecking: 'در حال بررسی میکروفون...',
    lobbyConnecting: 'در حال اتصال...',
    closeAria: 'بستن',
    roomLive: 'زنده',
    roomConnecting: 'در حال اتصال...',
    roomInvite: 'دعوت دوستان',
    roomReconnecting: 'اتصال قطع شد؛ در حال تلاش مجدد...',
    roomDefaultName: 'اتاق آوا',
    roomSubtitlePresent: '{count} نفر حاضر',
    sidebarCurrentRoom: 'اتاق فعلی',
    copyLinkAria: 'کپی لینک',
    sidebarConnection: 'وضعیت اتصال',
    connConnected: 'متصل',
    connConnecting: 'در حال اتصال',
    connDisconnected: 'قطع شده',
    connWeak: 'اتصال ضعیف',
    connOffline: 'اتصال اینترنت قطع است',
    sidebarChat: 'چت',
    chatPlaceholder: 'پیام...',
    chatSendAria: 'ارسال',
    chatEmpty: 'هنوز پیامی نیست',
    chatYou: 'شما',
    sidebarAudioSettings: 'تنظیمات صدا',
    sidebarLeave: 'خروج از اتاق',
    participantsLabel: 'حاضران',
    participantCount: '{count} / {max} نفر',
    participantsHint: 'صدای شفاف، گفت‌وگوی راحت',
    dockSettings: 'تنظیمات',
    dockMicOn: 'میکروفون',
    dockMicOff: 'میکروفون خاموش',
    dockChat: 'چت',
    dockShare: 'اشتراک‌گذاری',
    dockLeave: 'خروج',
    settingsEyebrow: 'تنظیمات',
    settingsTitle: 'صدا و میکروفون',
    settingsLanguage: 'زبان',
    settingsMicLabel: 'دستگاه ورودی',
    settingsOutputLabel: 'دستگاه خروجی',
    outputDefault: 'خروجی پیش‌فرض مرورگر',
    settingsOutputNote: 'انتخاب خروجی صدا در این مرورگر فقط برای برخی دستگاه‌ها پشتیبانی می‌شود.',
    profileEyebrow: 'پروفایل',
    profileTitle: 'پروفایل من',
    profilePickPhoto: 'انتخاب عکس',
    profileRemovePhoto: 'حذف عکس',
    profileNameLabel: 'نام نمایشی',
    profileNote: 'این نام و عکس ذخیره می‌شود تا دیگر لازم نباشد هر بار وارد کنی.',
    profileSave: 'ذخیره',
    profileSaved: 'پروفایل ذخیره شد ✓',
    profileNameRequired: 'یک نام وارد کن.',
    leaveEyebrow: 'خروج از اتاق',
    leaveTitle: 'مطمئنی می‌خواهی خارج شوی؟',
    leaveNote: 'اتصال صوتی تو قطع می‌شود.',
    leaveCancel: 'انصراف',
    leaveConfirm: 'خروج',
    guest: 'مهمان',
    youTag: 'شما',
    speaking: 'در حال صحبت',
    ready: 'آماده گفت‌وگو',
    micLabel: 'میکروفون',
    outputLabel: 'خروجی',
    toastWelcome: 'به اتاق خوش آمدی',
    toastLinkCopied: 'لینک کپی شد ✓',
    toastLinkCopyFailed: 'کپی لینک انجام نشد',
    toastMicChanged: 'میکروفون تغییر کرد',
    toastOutputChanged: 'خروجی صدا تغییر کرد',
    toastOutputUnsupported: 'این مرورگر تغییر خروجی صدا را پشتیبانی نمی‌کند.',
    toastModeratorActive: 'مدیر اتاق فعال شد',
    toastKnockApproved: 'ورود کاربر تأیید شد',
    toastReconnected: 'اتصال برقرار شد ✓',
    toastMicGranted: 'دسترسی میکروفون فعال شد ✓',
    toastMicListenOnly: 'بدون دسترسی میکروفون وارد می‌شوی (فقط شنونده)',
    errRoomInvalid: 'کد یا لینک اتاق معتبر نیست.',
    errNoName: 'لطفاً نام نمایشی را وارد کن.',
    errHttps: 'برای دسترسی به میکروفون باید سایت با HTTPS باز شود.',
    errMembersOnly: 'این اتاق نیاز به تأیید مدیر دارد.',
    errConnFailed: 'اتصال به اتاق برقرار نشد.',
    errMicDenied: 'دسترسی به میکروفون داده نشده است.',
    errBrowserUnsupported: 'مرورگر شما برای تماس صوتی مناسب نیست.',
    errMicRejected: 'دسترسی میکروفون رد شد. از کنار آدرس سایت، Microphone را روی Allow بگذار و دوباره تلاش کن.',
    errNoMic: 'هیچ میکروفونی پیدا نشد. میکروفون را وصل و دوباره تلاش کن.',
    errMicBusy: 'میکروفون توسط برنامه دیگری استفاده می‌شود. آن برنامه را ببند و دوباره تلاش کن.',
    errMicGeneric: 'دسترسی به میکروفون برقرار نشد.',
    errMicUnsupported: 'مرورگر شما به میکروفون دسترسی ندارد.',
    errConfigUnavailable: 'تنظیمات تماس در دسترس نیست.',
    errServiceLoadFailed: 'بارگذاری سرویس تماس ممکن نشد.',
    errTokenFailed: 'توکن اتصال صادر نشد.',
    errConnTimeout: 'اتصال به اتاق برقرار نشد. تنظیمات JaaS یا اینترنت را بررسی کن.'
  },
  en: {
    homeEyebrow: 'A calm, real voice chat',
    homeHero: 'Create your own voice room and talk with friends.',
    homeCreate: 'Create room',
    homeJoin: 'Join room',
    homeCodeLabel: 'Room code or link',
    homeCodePlaceholder: 'e.g. voice-8f3k29',
    continueAria: 'Continue',
    homeNote: 'Up to 10 people, clear and light audio',
    homeArtTitle: 'Right here, right now',
    homeArtSubtitle: 'Real voice calls powered by Jitsi',
    profileAria: 'Profile',
    lobbyEyebrow: 'Before you join',
    lobbyTitleCreate: 'Ready?',
    lobbyTitleJoin: 'Join room',
    lobbyIntro: 'Pick a name so your friends recognize you.',
    lobbyNameLabel: 'Display name',
    lobbyNamePlaceholder: 'e.g. Sam',
    lobbyJoiningAs: 'Joining as',
    lobbyChangeName: 'Change',
    lobbyRoomLabel: 'Room name',
    lobbyRoomPlaceholder: 'e.g. Late night hangout',
    lobbyMicLabel: 'Microphone',
    micDefault: 'Default microphone',
    lobbyPermissionNote: 'Your browser will ask permission to use the microphone so you can talk.',
    lobbySubmitCreate: 'Create room',
    lobbySubmitJoin: 'Join room',
    lobbyChecking: 'Checking microphone...',
    lobbyConnecting: 'Connecting...',
    closeAria: 'Close',
    roomLive: 'Live',
    roomConnecting: 'Connecting...',
    roomInvite: 'Invite friends',
    roomReconnecting: 'Connection lost; retrying...',
    roomDefaultName: 'Ava room',
    roomSubtitlePresent: '{count} people here',
    sidebarCurrentRoom: 'Current room',
    copyLinkAria: 'Copy link',
    sidebarConnection: 'Connection',
    connConnected: 'Connected',
    connConnecting: 'Connecting',
    connDisconnected: 'Disconnected',
    connWeak: 'Weak connection',
    connOffline: 'You are offline',
    sidebarChat: 'Chat',
    chatPlaceholder: 'Message...',
    chatSendAria: 'Send',
    chatEmpty: 'No messages yet',
    chatYou: 'You',
    sidebarAudioSettings: 'Audio settings',
    sidebarLeave: 'Leave room',
    participantsLabel: 'Participants',
    participantCount: '{count} / {max} people',
    participantsHint: 'Clear voice, easy conversation',
    dockSettings: 'Settings',
    dockMicOn: 'Mic',
    dockMicOff: 'Mic off',
    dockChat: 'Chat',
    dockShare: 'Share',
    dockLeave: 'Leave',
    settingsEyebrow: 'Settings',
    settingsTitle: 'Audio & microphone',
    settingsLanguage: 'Language',
    settingsMicLabel: 'Input device',
    settingsOutputLabel: 'Output device',
    outputDefault: 'Browser default output',
    settingsOutputNote: 'Choosing an audio output is only supported on some devices/browsers.',
    profileEyebrow: 'Profile',
    profileTitle: 'My profile',
    profilePickPhoto: 'Choose photo',
    profileRemovePhoto: 'Remove photo',
    profileNameLabel: 'Display name',
    profileNote: 'This name and photo are saved so you will not need to enter them every time.',
    profileSave: 'Save',
    profileSaved: 'Profile saved ✓',
    profileNameRequired: 'Please enter a name.',
    leaveEyebrow: 'Leave room',
    leaveTitle: 'Are you sure you want to leave?',
    leaveNote: 'Your voice connection will be closed.',
    leaveCancel: 'Cancel',
    leaveConfirm: 'Leave',
    guest: 'Guest',
    youTag: 'You',
    speaking: 'Speaking',
    ready: 'Ready to talk',
    micLabel: 'Microphone',
    outputLabel: 'Output',
    toastWelcome: 'Welcome to the room',
    toastLinkCopied: 'Link copied ✓',
    toastLinkCopyFailed: 'Could not copy the link',
    toastMicChanged: 'Microphone changed',
    toastOutputChanged: 'Audio output changed',
    toastOutputUnsupported: 'This browser does not support changing audio output.',
    toastModeratorActive: 'Moderator rights enabled',
    toastKnockApproved: 'User approved to join',
    toastReconnected: 'Connection restored ✓',
    toastMicGranted: 'Microphone access enabled ✓',
    toastMicListenOnly: 'Joining without microphone access (listen only)',
    errRoomInvalid: 'That room code or link is not valid.',
    errNoName: 'Please enter a display name.',
    errHttps: 'The site must be opened over HTTPS to access the microphone.',
    errMembersOnly: 'This room needs moderator approval.',
    errConnFailed: 'Could not connect to the room.',
    errMicDenied: 'Microphone access was not granted.',
    errBrowserUnsupported: 'Your browser is not suitable for voice calls.',
    errMicRejected: 'Microphone access was denied. Set Microphone to Allow next to the site address and try again.',
    errNoMic: 'No microphone was found. Connect a microphone and try again.',
    errMicBusy: 'The microphone is being used by another app. Close it and try again.',
    errMicGeneric: 'Could not access the microphone.',
    errMicUnsupported: 'Your browser does not support microphone access.',
    errConfigUnavailable: 'Call configuration is unavailable.',
    errServiceLoadFailed: 'Could not load the call service.',
    errTokenFailed: 'Could not issue a connection token.',
    errConnTimeout: 'Could not connect to the room. Check your JaaS settings or internet connection.'
  }
};

function t(key, params) {
  const dict = STRINGS[state.lang] || STRINGS.fa;
  let text = dict[key] ?? STRINGS.fa[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) text = text.replace(`{${k}}`, v);
  }
  return text;
}

function localNum(n) {
  return state.lang === 'fa' ? faNumber(n) : String(n);
}

function applyLanguage() {
  document.documentElement.lang = state.lang === 'fa' ? 'fa' : 'en';
  document.documentElement.dir = state.lang === 'fa' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', t(el.dataset.i18nTitle));
  });
  $('lang-fa-button')?.classList.toggle('active', state.lang === 'fa');
  $('lang-en-button')?.classList.toggle('active', state.lang === 'en');
  // Re-render dynamic bits that depend on language.
  if (state.joined || state.participants.size) renderParticipants();
  updateMuteButton();
  if (!state.api) {
    $('lobby-title').textContent = state.roomId ? t('lobbyTitleJoin') : t('lobbyTitleCreate');
  }
  renderChatEmptyState();
}

function setLanguage(lang) {
  if (lang !== 'fa' && lang !== 'en') return;
  state.lang = lang;
  localStorage.setItem('ava-lang', lang);
  applyLanguage();
}

/* ---------------------- small helpers ---------------------- */

const $ = id => document.getElementById(id);
const faNumber = value => String(value).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const show = id => $(id).classList.remove('hidden');
const hide = id => $(id).classList.add('hidden');

function toast(message) {
  const el = $('toast');
  el.textContent = message;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 2600);
}

function cleanRoomId(value) {
  return String(value || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64).toLowerCase();
}

function roomFromUrl() {
  const match = location.pathname.match(/^\/room\/([^/]+)/);
  let fromPath = '';
  if (match) {
    try { fromPath = decodeURIComponent(match[1]); } catch { fromPath = match[1]; }
  }
  return fromPath || new URLSearchParams(location.search).get('room') || '';
}

function makeRoomId() {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return `voice-${[...bytes].map(byte => byte.toString(36)).join('').slice(0, 8)}`;
}

function getRoomLink() {
  const base = location.pathname.endsWith('/') ? location.pathname : location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1);
  return `${location.origin}${base}?room=${encodeURIComponent(state.roomId)}`;
}

/* ---------------------- profile (persistent name + avatar) ---------------------- */

function loadProfile() {
  try { return JSON.parse(localStorage.getItem('ava-profile') || '{}'); }
  catch { return {}; }
}

function saveProfile(profile) {
  localStorage.setItem('ava-profile', JSON.stringify(profile));
}

function setAvatarVisual(el, profile) {
  if (!el) return;
  if (profile && profile.avatar) {
    el.style.backgroundImage = `url("${profile.avatar}")`;
    el.textContent = '';
  } else {
    el.style.backgroundImage = '';
    const initial = (profile && profile.name ? Array.from(profile.name)[0] : '') || '';
    el.textContent = initial.toUpperCase();
  }
}

function applyProfileUI() {
  const profile = loadProfile();
  setAvatarVisual($('home-profile-button'), profile);
  setAvatarVisual($('profile-button'), profile);
  setAvatarVisual($('profile-avatar-preview'), profile);
  $('profile-name-input').value = profile.name || '';
  $('profile-avatar-remove').classList.toggle('hidden', !profile.avatar);
  updateLobbyProfileSummary();
}

function updateLobbyProfileSummary() {
  const profile = loadProfile();
  const nameBlock = $('profile-name-block');
  const summary = $('profile-name-summary');
  if (profile.name) {
    nameBlock.classList.add('hidden');
    $('display-name').required = false;
    $('display-name').value = profile.name;
    summary.classList.remove('hidden');
    $('profile-name-summary-value').textContent = profile.name;
  } else {
    nameBlock.classList.remove('hidden');
    $('display-name').required = true;
    summary.classList.add('hidden');
  }
}

function openProfilePanel() {
  applyProfileUI();
  show('profile-panel');
}

function closeProfilePanel() {
  hide('profile-panel');
}

function resizeImageToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read-failed'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode-failed'));
      img.onload = () => {
        const size = 160;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale, h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function handleAvatarFile(file) {
  if (!file) return;
  try {
    const dataUrl = await resizeImageToDataUrl(file);
    const profile = loadProfile();
    profile.avatar = dataUrl;
    saveProfile(profile);
    applyProfileUI();
  } catch {
    toast(t('errMicGeneric'));
  }
}

function saveProfileFromPanel() {
  const name = $('profile-name-input').value.trim();
  if (!name) { toast(t('profileNameRequired')); return; }
  const profile = loadProfile();
  profile.name = name;
  saveProfile(profile);
  applyProfileUI();
  toast(t('profileSaved'));
  closeProfilePanel();
  if (state.api) {
    state.api.executeCommand('displayName', name);
  }
}

/* ---------------------- participants UI ---------------------- */

function buildParticipantCard(id) {
  const card = document.createElement('article');
  card.className = 'participant-card';
  card.dataset.id = id;
  card.innerHTML = '<div class="participant-top"><div class="participant-avatar"></div><span class="mic-state"></span></div><div><div class="participant-name"></div><span class="participant-label state-label"></span><div class="volume-row"><span></span><input type="range" min="0" max="100"></div></div>';
  return card;
}

function fillParticipantCard(card, participant) {
  const isLocal = participant.id === state.localId;
  const name = participant.displayName || t('guest');
  card.classList.toggle('speaking', Boolean(participant.isSpeaking));
  const avatarEl = card.querySelector('.participant-avatar');
  if (participant.avatarURL) {
    avatarEl.style.backgroundImage = `url("${participant.avatarURL}")`;
    avatarEl.textContent = '';
  } else {
    avatarEl.style.backgroundImage = '';
    avatarEl.textContent = Array.from(name)[0] || '?';
  }
  card.querySelector('.mic-state').textContent = participant.audioMuted ? '🔇' : '🎙';
  const nameEl = card.querySelector('.participant-name');
  nameEl.textContent = name;
  if (isLocal) {
    const tag = document.createElement('span');
    tag.className = 'participant-label';
    tag.textContent = `(${t('youTag')})`;
    nameEl.append(' ', tag);
  }
  card.querySelector('.state-label').textContent = participant.isSpeaking ? t('speaking') : t('ready');
  const slider = card.querySelector('input');
  slider.setAttribute('aria-label', name);
  slider.dataset.volume = participant.id;
  slider.disabled = isLocal;
  if (document.activeElement !== slider) slider.value = participant.volume ?? 100;
}

function renderParticipants() {
  const grid = $('participants-grid');
  const cards = new Map([...grid.children].map(card => [card.dataset.id, card]));
  for (const participant of state.participants.values()) {
    let card = cards.get(participant.id);
    if (card) cards.delete(participant.id);
    else { card = buildParticipantCard(participant.id); grid.append(card); }
    fillParticipantCard(card, participant);
  }
  cards.forEach(card => card.remove());
  $('participant-count').textContent = t('participantCount', { count: localNum(state.participants.size), max: localNum(MAX_PARTICIPANTS) });
  $('room-subtitle').textContent = t('roomSubtitlePresent', { count: localNum(state.participants.size) });
}

function setConnection(labelKey, connected = false) {
  $('connection-label').textContent = t(labelKey);
  $('reconnect-banner').classList.toggle('hidden', connected);
  $('connection-dot').className = `status-dot ${connected ? 'connected' : 'warning'}`;
}

function addParticipant(id, displayName) {
  const current = state.participants.get(id) || { id, displayName: displayName || t('guest'), volume: 100, audioMuted: false, isSpeaking: false };
  current.displayName = displayName || current.displayName;
  state.participants.set(id, current);
  renderParticipants();
}

/* ---------------------- chat ---------------------- */

function renderChatEmptyState() {
  const box = $('chat-messages');
  if (box && !box.children.length) {
    const empty = document.createElement('p');
    empty.className = 'chat-empty';
    empty.dataset.chatEmpty = '1';
    empty.textContent = t('chatEmpty');
    box.append(empty);
  } else if (box) {
    const empty = box.querySelector('[data-chat-empty]');
    if (empty && box.children.length > 1) empty.remove();
    else if (empty) empty.textContent = t('chatEmpty');
  }
}

function appendChatMessage({ author, message, self }) {
  const box = $('chat-messages');
  if (!box) return;
  const empty = box.querySelector('[data-chat-empty]');
  if (empty) empty.remove();
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble${self ? ' self' : ''}`;
  const authorEl = document.createElement('span');
  authorEl.className = 'chat-author';
  authorEl.textContent = self ? t('chatYou') : (author || t('guest'));
  const textEl = document.createElement('span');
  textEl.textContent = message;
  bubble.append(authorEl, textEl);
  box.append(bubble);
  box.scrollTop = box.scrollHeight;
  if (!self && !$('room-sidebar').classList.contains('sidebar-open')) {
    state.chatUnread = true;
    $('chat-badge').classList.remove('hidden');
  }
}

function sendChatMessage(event) {
  event.preventDefault();
  const input = $('chat-input');
  const text = input.value.trim();
  if (!text || !state.api) return;
  state.api.executeCommand('sendChatMessage', text, '', false);
  input.value = '';
}

function resetChat() {
  const box = $('chat-messages');
  if (box) box.innerHTML = '';
  renderChatEmptyState();
  state.chatUnread = false;
  $('chat-badge').classList.add('hidden');
}

/* ---------------------- mobile sidebar drawer ---------------------- */

function openSidebar() {
  $('room-sidebar').classList.add('sidebar-open');
  $('sidebar-backdrop').classList.add('visible');
  state.chatUnread = false;
  $('chat-badge').classList.add('hidden');
  setTimeout(() => $('chat-input')?.focus(), 150);
}

function closeSidebar() {
  $('room-sidebar').classList.remove('sidebar-open');
  $('sidebar-backdrop').classList.remove('visible');
}

function toggleSidebar() {
  if ($('room-sidebar').classList.contains('sidebar-open')) closeSidebar();
  else openSidebar();
}

/* ---------------------- Jitsi wiring ---------------------- */

function bind(event, handler) { state.api?.addListener(event, handler); }

function bindJitsiEvents() {
  window.avaJitsi = state.api;
  bind('videoConferenceJoined', event => {
    state.localId = event.id;
    state.joined = true;
    addParticipant(event.id, event.displayName || $('display-name').value);
    const profile = loadProfile();
    if (profile.avatar) {
      state.api.executeCommand('avatarUrl', profile.avatar);
      const me = state.participants.get(event.id);
      if (me) { me.avatarURL = profile.avatar; renderParticipants(); }
    }
    setConnection('connConnected', true);
    toast(t('toastWelcome'));
    loadDevices();
  });
  bind('participantJoined', event => addParticipant(event.id, event.displayName));
  bind('knockingParticipant', event => {
    if (state.role === 'moderator' && event.participant?.id) {
      state.api.executeCommand('answerKnockingParticipant', event.participant.id, true);
      toast(t('toastKnockApproved'));
    }
  });
  bind('participantLeft', event => {
    state.participants.delete(event.id);
    renderParticipants();
  });
  bind('displayNameChange', event => {
    if (state.participants.has(event.id)) {
      state.participants.get(event.id).displayName = event.displayname;
      renderParticipants();
    }
  });
  bind('avatarChanged', event => {
    if (state.participants.has(event.id)) {
      state.participants.get(event.id).avatarURL = event.avatarURL;
      renderParticipants();
    }
  });
  bind('participantMuted', event => {
    if (event.mediaType === 'audio' && state.participants.has(event.participantId)) {
      state.participants.get(event.participantId).audioMuted = event.isMuted;
      renderParticipants();
    }
  });
  bind('audioMuteStatusChanged', event => {
    state.muted = event.muted;
    updateMuteButton();
    const me = state.participants.get(state.localId);
    if (me) { me.audioMuted = event.muted; renderParticipants(); }
  });
  bind('dominantSpeakerChanged', event => {
    for (const participant of state.participants.values()) participant.isSpeaking = participant.id === event.id;
    renderParticipants();
  });
  bind('participantRoleChanged', event => {
    if (event.id === state.localId) {
      state.role = event.role;
      document.body.classList.toggle('is-moderator', event.role === 'moderator');
      if (event.role === 'moderator') toast(t('toastModeratorActive'));
    }
  });
  bind('deviceListChanged', loadDevices);
  bind('peerConnectionFailure', () => setConnection('connWeak'));
  bind('errorOccurred', event => {
    if (event.isFatal) {
      setConnection('connDisconnected');
      showError(event.name === 'conference.connectionError.membersOnly' ? t('errMembersOnly') : t('errConnFailed'));
    }
  });
  bind('micError', () => showError(t('errMicDenied')));
  bind('browserSupport', event => { if (event.supported === false) showError(t('errBrowserUnsupported')); });
  bind('readyToClose', destroyJitsi);
  bind('videoConferenceLeft', () => { state.joined = false; setConnection('connDisconnected'); });
  bind('incomingMessage', event => {
    if (event.from === state.localId) return;
    appendChatMessage({ author: event.nick, message: event.message, self: false });
  });
  bind('outgoingMessage', event => {
    appendChatMessage({ message: event.message, self: true });
  });
}

function showError(message) {
  $('lobby-error').textContent = message;
  toast(message);
}

function appendDeviceOptions(select, devices, fallbackKey) {
  devices.forEach((device, index) => {
    const option = document.createElement('option');
    option.value = device.deviceId;
    option.dataset.label = device.label || '';
    option.textContent = device.label || `${t(fallbackKey)} ${localNum(index + 1)}`;
    select.append(option);
  });
}

function selectIfPresent(select, value) {
  select.value = [...select.options].some(option => option.value === value) ? value : (select.options[0]?.value ?? '');
}

async function loadDevices() {
  try {
    let mics, outputs, currentMic = state.selectedMicId, currentOutput = '';
    if (state.api) {
      const [list, current] = await Promise.all([
        state.api.getAvailableDevices(),
        state.api.getCurrentDevices().catch(() => ({}))
      ]);
      mics = list?.audioInput || [];
      outputs = list?.audioOutput || [];
      currentMic = current?.audioInput?.deviceId || '';
      currentOutput = current?.audioOutput?.deviceId || '';
    } else {
      const list = await navigator.mediaDevices.enumerateDevices();
      mics = list.filter(device => device.kind === 'audioinput');
      outputs = list.filter(device => device.kind === 'audiooutput');
    }
    for (const select of [$('microphone-select'), $('settings-mic')]) {
      select.innerHTML = '';
      if (!mics.length) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = t('micDefault');
        select.append(opt);
      }
      appendDeviceOptions(select, mics, 'micLabel');
      selectIfPresent(select, currentMic);
    }
    const output = $('settings-output');
    output.innerHTML = '';
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = t('outputDefault');
    output.append(defaultOpt);
    appendDeviceOptions(output, outputs, 'outputLabel');
    selectIfPresent(output, currentOutput);
  } catch { /* device listing best-effort */ }
}

function isMobileDevice() {
  return (window.matchMedia?.('(pointer:coarse)').matches) || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

async function askMicrophonePermission() {
  if (state.micAsked || !navigator.mediaDevices?.getUserMedia) return;
  state.micAsked = true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    $('lobby-error').textContent = '';
    toast(t('toastMicGranted'));
    loadDevices();
  } catch {
    state.micAsked = false;
    $('lobby-error').textContent = t('errMicRejected');
  }
}

async function requestMicrophone() {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error(t('errMicUnsupported'));
  try {
    const constraints = { audio: state.selectedMicId ? { deviceId: { exact: state.selectedMicId } } : true };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') throw new Error(t('errMicRejected'));
    if (error.name === 'NotFoundError') throw new Error(t('errNoMic'));
    if (error.name === 'NotReadableError') throw new Error(t('errMicBusy'));
    throw new Error(t('errMicGeneric'));
  }
}

async function loadJaasApi() {
  if (window.JitsiMeetExternalAPI) return;
  const config = await fetch('/api/config').then(response => {
    if (!response.ok) throw new Error(t('errConfigUnavailable'));
    return response.json();
  });
  state.jaasAppId = config.appId;
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://8x8.vc/${encodeURIComponent(config.appId)}/external_api.js`;
    script.onload = resolve;
    script.onerror = () => reject(new Error(t('errServiceLoadFailed')));
    document.head.append(script);
  });
}

async function createJitsi() {
  if (state.connecting || state.api) return;
  state.connecting = true;
  try {
    await loadJaasApi();
    const token = await fetch('/api/token', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ room: state.roomId, name: $('display-name').value.trim() })
    }).then(async response => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || t('errTokenFailed'));
      return data;
    });
    state.api = new JitsiMeetExternalAPI('8x8.vc', {
      roomName: `${state.jaasAppId}/${state.roomId}`,
      jwt: token.token,
      parentNode: $('jitsi-container'),
      width: '100%',
      height: '100%',
      lang: state.lang,
      userInfo: { displayName: $('display-name').value.trim() },
      ...(state.selectedMicLabel ? { devices: { audioInput: state.selectedMicLabel } } : {}),
      configOverwrite: {
        startWithAudioMuted: !state.micGranted,
        startWithVideoMuted: true,
        prejoinConfig: { enabled: false },
        disableAP: true,
        disableSimulcast: true,
        enableNoisyMicDetection: true,
        toolbarButtons: []
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: '#101820',
        MOBILE_APP_PROMO: false,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
      }
    });
    bindJitsiEvents();
    $('room-title').textContent = state.roomName;
    $('room-code').textContent = state.roomId;
    hide('lobby-view'); hide('home-view'); hide('top-bar');
    show('room-view');
    setConnection('connConnecting');
    clearTimeout(state.joinTimer);
    state.joinTimer = setTimeout(() => {
      if (!state.joined) showError(t('errConnTimeout'));
    }, 15000);
  } catch (error) {
    state.api?.dispose();
    state.api = null;
    showError(error.message || t('errConnFailed'));
  } finally {
    state.connecting = false;
  }
}

async function joinRoom(event) {
  event.preventDefault();
  if (state.connecting || state.api) return;
  const name = $('display-name').value.trim();
  if (!name) { showError(t('errNoName')); $('display-name').focus(); return; }
  if (!window.isSecureContext && !['localhost', '127.0.0.1'].includes(location.hostname)) {
    showError(t('errHttps'));
    return;
  }
  // Remember the name for next time, so the lobby doesn't need to ask again.
  const profile = loadProfile();
  if (!profile.name) { profile.name = name; saveProfile(profile); }

  const submit = $('lobby-submit');
  submit.disabled = true;
  submit.dataset.label = submit.innerHTML;
  submit.textContent = t('lobbyChecking');
  const micSelect = $('microphone-select');
  state.selectedMicId = micSelect.value;
  state.selectedMicLabel = micSelect.value ? (micSelect.selectedOptions[0]?.dataset.label || '') : '';
  try {
    state.micGranted = true;
    try { await requestMicrophone(); }
    catch (micError) { state.micGranted = false; toast(micError.message || t('toastMicListenOnly')); }
    submit.textContent = t('lobbyConnecting');
    state.roomId = state.roomId || makeRoomId();
    state.roomName = $('room-name').value.trim() || t('roomDefaultName');
    const base = location.pathname.endsWith('/') ? location.pathname : location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1);
    history.pushState({}, '', `${base}?room=${encodeURIComponent(state.roomId)}`);
    await createJitsi();
  } catch (error) {
    showError(error.message);
  } finally {
    submit.disabled = false;
    submit.innerHTML = submit.dataset.label || t('lobbySubmitJoin');
  }
}

function updateMuteButton() {
  const button = $('mute-button');
  button.innerHTML = state.muted
    ? `<span>🔇</span><small>${t('dockMicOff')}</small>`
    : `<span>🎙</span><small>${t('dockMicOn')}</small>`;
  button.classList.toggle('muted', state.muted);
}

function leaveRoom() { show('leave-confirm'); }
function confirmLeave() { hide('leave-confirm'); closeRoom(); }

function closeRoom() {
  if (!state.api) return;
  try { state.api.executeCommand('hangup'); } catch { /* noop */ }
  clearTimeout(state.leaveTimer);
  state.leaveTimer = setTimeout(destroyJitsi, 2000);
}

function destroyJitsi() {
  clearTimeout(state.joinTimer);
  clearTimeout(state.leaveTimer);
  try { state.api?.dispose(); } catch { /* noop */ }
  state.api = null;
  window.avaJitsi = null;
  state.participants.clear();
  state.joined = false;
  state.localId = '';
  state.muted = false;
  state.role = 'participant';
  document.body.classList.remove('is-moderator');
  renderParticipants();
  updateMuteButton();
  closeSidebar();
  resetChat();
  hide('room-view');
  hide('leave-confirm');
  show('home-view');
  show('top-bar');
  history.replaceState({}, '', location.pathname);
}

function openLobby(roomId = '') {
  const clean = cleanRoomId(roomId);
  if (roomId && !clean) { toast(t('errRoomInvalid')); return; }
  state.roomId = clean;
  roomId = clean;
  $('lobby-title').textContent = roomId ? t('lobbyTitleJoin') : t('lobbyTitleCreate');
  $('room-name-label').classList.toggle('hidden', Boolean(roomId));
  $('room-name').classList.toggle('hidden', Boolean(roomId));
  $('room-name').required = !roomId;
  $('lobby-submit').innerHTML = roomId
    ? `<span>${t('lobbySubmitJoin')}</span> <span>←</span>`
    : `<span>${t('lobbySubmitCreate')}</span> <span>←</span>`;
  $('lobby-error').textContent = '';
  updateLobbyProfileSummary();
  hide('home-view'); hide('top-bar');
  show('lobby-view');
  loadDevices();
  if (isMobileDevice()) askMicrophonePermission();
}

async function shareRoom() {
  const url = getRoomLink();
  try {
    if (navigator.share) await navigator.share({ title: t('roomInvite'), text: state.roomName, url });
    else { await navigator.clipboard.writeText(url); toast(t('toastLinkCopied')); }
  } catch (error) {
    if (error.name !== 'AbortError') toast(t('toastLinkCopyFailed'));
  }
}

async function changeInput(select) {
  const deviceId = select.value;
  const label = select.selectedOptions[0]?.dataset.label || '';
  if (!state.api) { state.selectedMicId = deviceId; toast(t('toastMicChanged')); return; }
  try {
    await state.api.setAudioInputDevice(label, deviceId);
    $('microphone-select').value = deviceId;
    $('settings-mic').value = deviceId;
    toast(t('toastMicChanged'));
  } catch { /* device change best-effort */ }
}

async function changeOutput(select) {
  const deviceId = select.value;
  if (!deviceId || !state.api) return;
  const label = select.selectedOptions[0]?.dataset.label || '';
  try { await state.api.setAudioOutputDevice(label, deviceId); toast(t('toastOutputChanged')); }
  catch { toast(t('toastOutputUnsupported')); }
}

/* ---------------------- event bindings ---------------------- */

$('create-room-button').onclick = () => openLobby();
$('show-join-button').onclick = () => {
  const form = $('quick-join-form');
  form.classList.toggle('hidden');
  if (!form.classList.contains('hidden')) $('quick-room-code').focus();
};
$('quick-join-form').onsubmit = event => {
  event.preventDefault();
  const value = $('quick-room-code').value.trim();
  try {
    const url = new URL(value, location.origin);
    openLobby(url.searchParams.get('room') || url.pathname.match(/^\/room\/([^/]+)/)?.[1] || value);
  } catch { openLobby(value); }
};
$('lobby-form').onsubmit = joinRoom;
$('mute-button').onclick = () => state.api?.executeCommand('toggleAudio');
$('share-button').onclick = shareRoom;
$('share-dock-button').onclick = shareRoom;
$('copy-code').onclick = async () => {
  try { await navigator.clipboard.writeText(getRoomLink()); toast(t('toastLinkCopied')); }
  catch { toast(t('toastLinkCopyFailed')); }
};
$('leave-button').onclick = leaveRoom;
$('leave-dock-button').onclick = leaveRoom;
$('settings-button').onclick = () => { show('settings-panel'); loadDevices(); };
$('settings-dock-button').onclick = () => { show('settings-panel'); loadDevices(); };
$('close-settings').onclick = () => hide('settings-panel');
$('settings-mic').onchange = event => changeInput(event.target);
$('microphone-select').onchange = event => changeInput(event.target);
$('settings-output').onchange = event => changeOutput(event.target);
$('participants-grid').oninput = event => {
  const input = event.target.closest('[data-volume]');
  if (!input || !state.api) return;
  const volume = Number(input.value) / 100;
  const participant = state.participants.get(input.dataset.volume);
  if (participant) participant.volume = Number(input.value);
  state.api.executeCommand('setParticipantVolume', input.dataset.volume, volume);
};
$('confirm-leave').onclick = confirmLeave;
$('cancel-leave').onclick = () => hide('leave-confirm');
document.querySelectorAll('[data-action="go-home"]').forEach(button => button.onclick = () => {
  hide('lobby-view'); show('home-view'); show('top-bar');
});

// Language toggle
$('lang-fa-button').onclick = () => setLanguage('fa');
$('lang-en-button').onclick = () => setLanguage('en');

// Profile panel
$('home-profile-button').onclick = openProfilePanel;
$('profile-button').onclick = openProfilePanel;
$('close-profile').onclick = closeProfilePanel;
$('profile-name-change').onclick = openProfilePanel;
$('profile-save-button').onclick = saveProfileFromPanel;
$('profile-avatar-pick').onclick = () => $('profile-avatar-input').click();
$('profile-avatar-input').onchange = event => handleAvatarFile(event.target.files?.[0]);
$('profile-avatar-remove').onclick = () => {
  const profile = loadProfile();
  delete profile.avatar;
  saveProfile(profile);
  applyProfileUI();
};

// Chat
$('chat-form').onsubmit = sendChatMessage;
$('chat-dock-button').onclick = toggleSidebar;
$('sidebar-backdrop').onclick = closeSidebar;
$('sidebar-close').onclick = closeSidebar;

window.addEventListener('popstate', () => { if (state.api) closeRoom(); });
window.addEventListener('offline', () => { if (state.api) setConnection('connOffline'); });
window.addEventListener('online', () => {
  if (state.api && state.joined) { setConnection('connConnected', true); toast(t('toastReconnected')); }
});
window.addEventListener('beforeunload', () => {
  try { state.api?.executeCommand('hangup'); state.api?.dispose(); } catch { /* noop */ }
});

/* ---------------------- boot ---------------------- */

applyLanguage();
applyProfileUI();
resetChat();
const initialRoom = roomFromUrl();
if (initialRoom) openLobby(initialRoom);
