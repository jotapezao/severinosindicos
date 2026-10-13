/**
 * SEVERINO SÍNDICOS PROFISSIONAIS — Interações e animações
 * Preloader, cabeçalho inteligente, indicador deslizante do menu, scrollspy,
 * reveal on scroll, parallax, cursor dourado, botões magnéticos, contadores,
 * FAQ, formulário em etapas → WhatsApp e eventos de conversão (Google Ads / GA4).
 */

const WHATSAPP_NUMBER = '5565999195739';
const GOOGLE_ADS_SEND_TO = ''; // ex.: 'AW-123456789/AbCdEfGhIjk'
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMenu();
  initNavPill();
  initFaq();
  initWizard();
  initPhoneMask();
  initTracking();
  initCursor();
  initMagnetic();
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});

/* ---------- Preloader → inicia animações de entrada ---------- */
(function initPreloader() {
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    const pre = document.querySelector('.preloader');
    if (pre) {
      pre.classList.add('is-done');
      setTimeout(() => pre.remove(), 1200);
    }
    document.body.classList.add('is-loaded');
    initReveal();
    initCounters();
  };
  const minDelay = reduceMotion ? 0 : 1400;
  const t0 = performance.now();
  window.addEventListener('load', () => setTimeout(start, Math.max(0, minDelay - (performance.now() - t0))));
  setTimeout(start, 3500); // segurança caso alguma imagem demore
})();

/* ---------- Cabeçalho: fundo ao rolar, esconde ao descer, mostra ao subir ---------- */
function initHeader() {
  const header = document.querySelector('.header');
  const progress = document.querySelector('.progress');
  const heroMedia = document.querySelector('.hero__media');
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);

    const menuOpen = document.querySelector('.nav.is-open');
    if (!menuOpen && y > 500 && y > lastY + 4) header.classList.add('is-hidden');
    else if (y < lastY - 4 || y < 500) header.classList.remove('is-hidden');
    lastY = y;

    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    if (heroMedia && !reduceMotion && y < window.innerHeight * 1.2) {
      heroMedia.style.transform = `translate3d(0, ${y * 0.3}px, 0)`;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ---------- Menu mobile ---------- */
function initMenu() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  const header = document.querySelector('.header');
  if (!burger || !nav) return;

  const toggle = (open) => {
    burger.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    header.classList.remove('is-hidden');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  burger.addEventListener('click', () => toggle(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
}

/* ---------- Indicador deslizante + scrollspy ---------- */
function initNavPill() {
  const nav = document.querySelector('.nav');
  const pill = nav && nav.querySelector('.nav__pill');
  if (!pill) return;
  const links = [...nav.querySelectorAll('a')];
  let active = null;

  const moveTo = (link) => {
    if (!link) { pill.style.opacity = '0'; return; }
    pill.style.width = `${link.offsetWidth}px`;
    pill.style.transform = `translateX(${link.offsetLeft}px)`;
    pill.style.opacity = '1';
  };

  links.forEach((link) => {
    link.addEventListener('mouseenter', () => moveTo(link));
  });
  nav.addEventListener('mouseleave', () => moveTo(active));

  const sections = links
    .map((l) => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const link = links.find((l) => l.getAttribute('href') === `#${entry.target.id}`);
      links.forEach((l) => l.classList.toggle('is-active', l === link));
      active = link;
      if (!nav.matches(':hover')) moveTo(active);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => io.observe(s));

  // topo da página: sem item ativo
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight * 0.5 && active) {
      active = null;
      links.forEach((l) => l.classList.remove('is-active'));
      if (!nav.matches(':hover')) moveTo(null);
    }
  }, { passive: true });

  window.addEventListener('resize', () => moveTo(active));
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => io.observe(el));
}

/* ---------- Contadores ---------- */
function initCounters() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const to = parseInt(el.dataset.count, 10);
    const from = parseInt(el.dataset.from || '0', 10);
    if (reduceMotion) { el.textContent = to; return; }
    const duration = 1800;
    const t0 = performance.now() + 600;
    const step = (now) => {
      const p = Math.min(1, Math.max(0, (now - t0) / duration));
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = from;
    requestAnimationFrame(step);
  });
}

/* ---------- Cursor dourado (apenas desktop) ---------- */
function initCursor() {
  if (!finePointer || reduceMotion) return;
  const ring = document.querySelector('.cursor');
  const dot = document.querySelector('.cursor-dot');
  if (!ring || !dot) return;

  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    document.body.classList.add('has-cursor');
  });
  document.addEventListener('mouseleave', () => document.body.classList.remove('has-cursor'));

  const loop = () => {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(loop);
  };
  loop();

  document.querySelectorAll('a, button, .choice').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });
}

/* ---------- Botões magnéticos ---------- */
function initMagnetic() {
  if (!finePointer || reduceMotion) return;
  document.querySelectorAll('.btn--gold, .wa-float, .hero__badge').forEach((el) => {
    const strength = el.classList.contains('hero__badge') ? 0.25 : 0.3;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ---------- FAQ ---------- */
function initFaq() {
  const items = document.querySelectorAll('.faq__item');
  items.forEach((item) => {
    const btn = item.querySelector('.faq__q');
    const panel = item.querySelector('.faq__a');
    if (item.classList.contains('is-open')) panel.style.maxHeight = panel.scrollHeight + 'px';

    btn.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      items.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq__a').style.maxHeight = null;
        other.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ---------- Formulário de proposta em etapas ---------- */
function initWizard() {
  const wizard = document.getElementById('wizard');
  if (!wizard) return;

  const steps = wizard.querySelectorAll('.wizard__step');
  const bars = wizard.querySelectorAll('.wizard__bar');
  const backBtn = wizard.querySelector('.wizard__back');
  const nextBtn = wizard.querySelector('.wizard__next');
  const nextLabel = nextBtn.querySelector('span');
  const data = {};
  let current = 0;

  wizard.querySelectorAll('.choices').forEach((group) => {
    group.querySelectorAll('.choice').forEach((choice) => {
      choice.addEventListener('click', () => {
        group.querySelectorAll('.choice').forEach((c) => c.classList.remove('is-selected'));
        choice.classList.add('is-selected');
        data[group.dataset.key] = choice.dataset.value;
      });
    });
    const preset = group.querySelector('.choice.is-selected');
    if (preset) data[group.dataset.key] = preset.dataset.value;
  });

  const render = () => {
    steps.forEach((s, i) => s.classList.toggle('is-active', i === current));
    bars.forEach((b, i) => b.classList.toggle('is-done', i <= current));
    backBtn.hidden = current === 0;
    nextLabel.textContent = current === steps.length - 1 ? 'Enviar pelo WhatsApp' : 'Continuar';
  };

  backBtn.addEventListener('click', () => { if (current > 0) { current--; render(); } });

  nextBtn.addEventListener('click', () => {
    if (current < steps.length - 1) { current++; render(); return; }

    const name = wizard.querySelector('#w-name');
    const phone = wizard.querySelector('#w-phone');
    const condo = wizard.querySelector('#w-condo');
    const city = wizard.querySelector('#w-city');
    const role = wizard.querySelector('#w-role');

    if (!name.value.trim() || phone.value.replace(/\D/g, '').length < 10) {
      showToast('Informe seu nome e um WhatsApp válido para continuar.');
      (name.value.trim() ? phone : name).focus();
      return;
    }

    const msg = [
      'Olá! Gostaria de receber uma proposta da Severino Síndicos Profissionais.',
      '',
      `*Nome:* ${name.value.trim()}`,
      `*Vínculo:* ${role.value}`,
      `*WhatsApp:* ${phone.value.trim()}`,
      `*Condomínio:* ${condo.value.trim() || 'Não informado'}`,
      `*Cidade:* ${city.value}`,
      `*Tipo:* ${data.tipo || '-'}`,
      `*Unidades:* ${data.porte || '-'}`,
      `*Prioridade:* ${data.prioridade || '-'}`,
    ].join('\n');

    trackConversion('proposal_form_submit', { tipo: data.tipo, porte: data.porte, cidade: city.value });
    showToast('Obrigado! Abrindo o WhatsApp para concluir o envio…');
    setTimeout(() => openWhatsApp(msg), 700);
  });

  render();
}

/* ---------- Máscara de telefone ---------- */
function initPhoneMask() {
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
      else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      else if (v.length > 0) v = v.replace(/^(\d*)/, '($1');
      input.value = v;
    });
  });
}

/* ---------- Rastreamento de cliques ---------- */
function initTracking() {
  document.querySelectorAll('[data-track]').forEach((el) => {
    el.addEventListener('click', () => trackConversion(el.dataset.track));
  });
}

/* ---------- Helpers ---------- */
function openWhatsApp(message) {
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
}

function trackConversion(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
    if (GOOGLE_ADS_SEND_TO) window.gtag('event', 'conversion', { send_to: GOOGLE_ADS_SEND_TO });
  }
}

function showToast(text) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 4000);
}
