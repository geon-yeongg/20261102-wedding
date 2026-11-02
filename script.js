// 갤러리: 사진 경로는 모두 프로젝트 내부 assets 폴더를 사용합니다.
const photos = [
  'assets/couple.jpg', 'assets/rings.jpg', 'assets/bouquet.jpg',
  'assets/sunset.jpg', 'assets/table.jpg', 'assets/walking.jpg'
];
const photoModal = document.getElementById('photoModal');
const copyModal = document.getElementById('copyModal');
const modalImage = document.getElementById('modalImage');
let currentPhoto = 0;
let previousFocus = null;

// 팝업을 열기 전 포커스를 기억하고 닫을 때 되돌립니다.
function openModal(modal) {
  previousFocus = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modal.querySelector('button').focus();
}
function closeModal(modal) {
  modal.hidden = true;
  document.body.style.overflow = '';
  previousFocus?.focus();
}
function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  modalImage.src = photos[currentPhoto];
  modalImage.alt = `웨딩 사진 ${currentPhoto + 1} 확대`;
  document.getElementById('photoCount').textContent = `${currentPhoto + 1} / ${photos.length}`;
}
document.querySelectorAll('[data-photo]').forEach(button => {
  button.addEventListener('click', () => {
    showPhoto(Number(button.dataset.photo));
    openModal(photoModal);
  });
});
document.getElementById('prevPhoto').addEventListener('click', () => showPhoto(currentPhoto - 1));
document.getElementById('nextPhoto').addEventListener('click', () => showPhoto(currentPhoto + 1));

// 복사 버튼: 보안 연결(HTTPS) 또는 localhost에서 클립보드 API를 사용합니다.
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const number = button.dataset.copy;
    let success = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(number);
        success = true;
      } else {
        // 로컬 파일에서도 동작할 수 있도록 호환용 복사 방법을 제공합니다.
        const input = document.createElement('textarea');
        input.value = number;
        input.style.position = 'fixed'; input.style.opacity = '0';
        document.body.appendChild(input); input.select();
        success = document.execCommand('copy'); input.remove();
      }
    } catch (error) { success = false; }
    document.getElementById('copyMessage').textContent = success
      ? `${button.dataset.owner}님의 계좌번호가 복사되었습니다.\n${number}`
      : `자동 복사가 지원되지 않는 환경입니다.\n아래 번호를 직접 복사해 주세요.\n${number}`;
    openModal(copyModal);
  });
});

// 닫기 버튼, 배경 클릭, ESC 키를 지원합니다.
document.querySelectorAll('[data-close]').forEach(button => {
  button.addEventListener('click', () => closeModal(button.closest('.modal')));
});
[photoModal, copyModal].forEach(modal => {
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(modal); });
});
document.addEventListener('keydown', event => {
  const activeModal = !photoModal.hidden ? photoModal : (!copyModal.hidden ? copyModal : null);
  if (!activeModal) return;
  if (event.key === 'Escape') closeModal(activeModal);
  if (activeModal === photoModal && event.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
  if (activeModal === photoModal && event.key === 'ArrowRight') showPhoto(currentPhoto + 1);
});
