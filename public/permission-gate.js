(() => {
  const createButton = document.getElementById('create-room-button');
  const showMessage = message => {
    const error = document.getElementById('lobby-error');
    if (error) error.textContent = message;
  };
  const askMicrophone = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      showMessage('این مرورگر از دسترسی به میکروفون پشتیبانی نمی‌کند.');
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        showMessage('اجازه میکروفون داده نشد. کنار آدرس سایت روی قفل بزن و Microphone را روی Allow بگذار.');
      } else if (error.name === 'NotFoundError') {
        showMessage('میکروفونی پیدا نشد. میکروفون گوشی را بررسی کن.');
      } else {
        showMessage('درخواست دسترسی به میکروفون انجام نشد.');
      }
      return false;
    }
  };
  createButton?.addEventListener('click', askMicrophone);
})();
