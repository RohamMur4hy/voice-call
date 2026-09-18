(() => {
  const cameraButton = document.getElementById('camera-button');
  const screenButton = document.getElementById('screen-share-button');
  const permissionButton = document.getElementById('permission-button');
  const notify = message => {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    window.setTimeout(() => toast.classList.remove('visible'), 2600);
  };
  permissionButton?.addEventListener('click', async () => {
    if (!navigator.mediaDevices?.getUserMedia) return notify('این مرورگر به میکروفون دسترسی ندارد.');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      notify('دسترسی میکروفون فعال شد ✓');
      document.getElementById('lobby-error').textContent = '';
      window.loadDevices?.();
    } catch {
      const message = 'دسترسی هنوز بسته است. کنار آدرس سایت روی قفل بزن، Microphone را روی Allow بگذار و صفحه را تازه‌سازی کن.';
      document.getElementById('lobby-error').textContent = message;
      notify(message);
    }
  });
  if (!cameraButton || !screenButton) return;
  cameraButton.addEventListener('click', () => {
    if (!window.avaJitsi) return notify('ابتدا وارد اتاق شو');
    window.avaJitsi.executeCommand('toggleVideo');
  });
  screenButton.addEventListener('click', () => {
    if (typeof window.isScreenShareSupported === 'function' && !window.isScreenShareSupported()) {
      return notify('اشتراک‌گذاری صفحه در مرورگر گوشی پشتیبانی نمی‌شود. از کامپیوتر یا دوربین استفاده کن.');
    }
    if (!window.avaJitsi) return notify('ابتدا وارد اتاق شو');
    window.avaJitsi.executeCommand('toggleShareScreen');
  });
})();
