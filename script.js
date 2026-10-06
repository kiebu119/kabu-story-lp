/* =========================================
   KABU STORY LP script
========================================= */

// ★ GASをデプロイしたら、ここにウェブアプリのURLを貼る
const GAS_URL = 'https://script.google.com/macros/s/AKfycbx1YV0x0ugSxLDLP7W2qVigWzKMn7jjY_4loSJFnldQ5e6CozzLVrbzGE7kQ2lH6ixz/exec';

/* ---------- ① FV 紙芝居スライダー（2.5秒切替） ---------- */
(() => {
  const slides = document.querySelectorAll('.fv-slide');
  const dots = document.querySelectorAll('.fv-dots span');
  if (!slides.length) return;
  let i = 0;
  setInterval(() => {
    slides[i].classList.remove('is-active');
    dots[i]?.classList.remove('is-active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('is-active');
    dots[i]?.classList.add('is-active');
  }, 2500);
})();

/* ---------- スクロールで表示 ---------- */
(() => {
  const targets = document.querySelectorAll('.koma, .koma-row, .checklist li, .points li, .benefits li, .voice-card, .plan, .episodes li, .speech, .talk');
  targets.forEach(el => el.classList.add('js-reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  targets.forEach(el => io.observe(el));
})();

/* ---------- SP固定CTA（FVを過ぎたら表示、最終CTAでは隠す） ---------- */
(() => {
  const bar = document.querySelector('.sticky-cta');
  const fv = document.querySelector('.fv');
  const last = document.querySelector('.final-cta');
  if (!bar || !fv) return;
  const update = () => {
    const pastFv = fv.getBoundingClientRect().bottom < 0;
    const atLast = last && last.getBoundingClientRect().top < window.innerHeight;
    bar.classList.toggle('is-show', pastFv && !atLast);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ---------- モーダル開閉 ---------- */
const modal = document.getElementById('modal');
function openForm() {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('f-name')?.focus(), 50);
}
function closeForm() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
document.querySelectorAll('.js-open-form').forEach(b => b.addEventListener('click', openForm));
document.querySelectorAll('.js-close-form').forEach(b => b.addEventListener('click', closeForm));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeForm(); });

/* ---------- フォーム送信 → GAS（スプレッドシート保存） ---------- */
document.getElementById('entry-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');

  const name  = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const age   = document.getElementById('f-age').value;
  const exp   = document.querySelector('input[name="f-exp"]:checked')?.value || '';
  const worry = document.getElementById('f-worry').value.trim();

  let hasError = false;
  if (!name) { document.getElementById('err-name').textContent = '※ニックネームを入力してください'; hasError = true; }
  if (!email) { document.getElementById('err-email').textContent = '※メールアドレスを入力してください'; hasError = true; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('err-email').textContent = '※メールアドレスの形式を確認してください'; hasError = true; }
  if (hasError) return;

  const btn = e.target.querySelector('.btn-submit');
  btn.disabled = true;
  btn.textContent = '送信中…';

  try {
    if (GAS_URL.startsWith('https://')) {
      await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({ name, email, age, exp, worry })
      });
    } else {
      console.warn('GAS_URLが未設定のため、送信せずにサンクス表示します');
    }
    document.getElementById('entry-form').hidden = true;
    document.getElementById('thanks').hidden = false;
  } catch (err) {
    document.getElementById('err-submit').textContent = 'エラーが発生しました。もう一度お試しください。';
    btn.disabled = false;
    btn.textContent = '登録してLINEへ進む';
  }
});
