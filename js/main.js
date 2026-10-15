/**
 * SEVERINO SÍNDICOS PROFISSIONAIS — Interações e Alta Performance
 * - Preloader otimizado com entrada suave
 * - Simulador dinâmico de economia & valorização condominial
 * - Gavetas de expansão dos 8 pilares de serviços
 * - Assistente Concierge Flutuante com WhatsApp inteligente
 * - Cabeçalho inteligente, scrollspy, indicador deslizante
 * - Wizard de proposta em 4 etapas validado
 * - Botões magnéticos e cursor dourado de luxo
 */

const WHATSAPP_NUMBER = '5565999195739';
const GOOGLE_ADS_SEND_TO = ''; // ex.: 'AW-XXXXXXXXX/AbCdEfGhIjk'
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMenu();
  initNavPill();
  initSimulator();
  initServiceExpanders();
  initConcierge();
  initFaq();
  initWizard();
  initPhoneMask();
  initTracking();
  initCursor();
  initMagnetic();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});

/* ---------- Preloader Otimizado (Rápido e Fluido) ---------- */
(function initPreloader() {
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    const pre = document.querySelector('.preloader');
    if (pre) {
      pre.classList.add('is-done');
      setTimeout(() => pre.remove(), 900);
    }
    document.body.classList.add('is-loaded');
    initReveal();
    initCounters();
  };

  const minDelay = reduceMotion ? 0 : 1600; // Apresentação de boas-vindas sofisticada (+1.2s)
  const t0 = performance.now();
  window.addEventListener('load', () => {
    setTimeout(start, Math.max(0, minDelay - (performance.now() - t0)));
  });
  setTimeout(start, 3600); // Failsafe seguro
})();

/* ---------- Cabeçalho: Efeito ao rolar e esconde/mostra inteligente ---------- */
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
    if (!menuOpen && y > 500 && y > lastY + 5) header.classList.add('is-hidden');
    else if (y < lastY - 4 || y < 500) header.classList.remove('is-hidden');
    lastY = y;

    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    if (heroMedia && !reduceMotion && y < window.innerHeight * 1.2) {
      heroMedia.style.transform = `translate3d(0, ${y * 0.25}px, 0)`;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ---------- Menu Mobile ---------- */
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

/* ---------- Indicador Deslizante (Pill) + Scrollspy ---------- */
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
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach((s) => io.observe(s));

  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight * 0.4 && active) {
      active = null;
      links.forEach((l) => l.classList.remove('is-active'));
      if (!nav.matches(':hover')) moveTo(null);
    }
  }, { passive: true });

  window.addEventListener('resize', () => moveTo(active));
}

/* ---------- SIMULADOR INTERATIVO DE ECONOMIA & EFICIÊNCIA ---------- */
function initSimulator() {
  const slider = document.getElementById('sim-units-range');
  const unitsDisplay = document.getElementById('sim-units-display');
  const chipContainer = document.getElementById('sim-challenge-chips');
  const cityContainer = document.getElementById('sim-city-toggle');
  const economyDisplay = document.getElementById('sim-economy-display');
  const valorizationDisplay = document.getElementById('sim-valorization-display');
  const sendBtn = document.getElementById('sim-send-btn');

  if (!slider || !economyDisplay) return;

  let currentUnits = parseInt(slider.value, 10);
  let currentFactor = 1.25;
  let currentChallengeName = 'Altos Custos com Contratos e Fornecedores';
  let currentCity = 'Cuiabá';

  const calculate = () => {
    // Cálculo realista com base em porte condominial (R$ 550 a R$ 680 economia estimada por unidade/ano)
    const baseEconomyPerUnit = 580;
    const rawTotal = currentUnits * baseEconomyPerUnit * currentFactor;
    // Arredondar para milhar mais próximo para elegância visual
    const rounded = Math.max(12000, Math.round(rawTotal / 1000) * 1000);
    const formatted = rounded.toLocaleString('pt-BR');

    economyDisplay.textContent = `R$ ${formatted} / ano`;

    // Estimativa de valorização patrimonial (+15% a +25%)
    let valorization = 18;
    if (currentUnits > 120) valorization = 22;
    if (currentFactor >= 1.28) valorization = 25;
    valorizationDisplay.textContent = `+${valorization}%`;
  };

  slider.addEventListener('input', (e) => {
    currentUnits = parseInt(e.target.value, 10);
    unitsDisplay.textContent = `${currentUnits} unidades`;
    calculate();
  });

  if (chipContainer) {
    chipContainer.querySelectorAll('.sim-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        chipContainer.querySelectorAll('.sim-chip').forEach((c) => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        currentFactor = parseFloat(chip.dataset.factor || '1.2');
        currentChallengeName = chip.querySelector('span:last-child').textContent.trim();
        calculate();
      });
    });
  }

  if (cityContainer) {
    cityContainer.querySelectorAll('.sim-city-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        cityContainer.querySelectorAll('.sim-city-btn').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentCity = btn.dataset.city || 'Cuiabá';
      });
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const msg = [
        'Olá Átila! Fiz uma simulação de gestão para o meu condomínio:',
        '',
        `📍 *Cidade:* ${currentCity}`,
        `🏢 *Porte:* ${currentUnits} unidades`,
        `🎯 *Principal Desafio:* ${currentChallengeName}`,
        `💰 *Economia Estimada:* ${economyDisplay.textContent}`,
        '',
        'Gostaria de agendar uma vistoria técnica preliminar e receber uma apresentação formal.'
      ].join('\n');

      trackConversion('simulator_whatsapp_click', { units: currentUnits, city: currentCity });
      openWhatsApp(msg);
    });
  }

  calculate();
}

/* ---------- Gavetas de Expansão dos 8 Serviços ---------- */
function initServiceExpanders() {
  document.querySelectorAll('.service').forEach((card) => {
    const toggleBtn = card.querySelector('.service__toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = card.classList.contains('is-expanded');
      card.classList.toggle('is-expanded', !isExpanded);
      toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
      const span = toggleBtn.querySelector('span');
      if (span) span.textContent = !isExpanded ? 'Recolher detalhes' : 'Ver detalhes';
    });
  });
}

/* ---------- Assistente Concierge Flutuante ---------- */
function initConcierge() {
  const card = document.getElementById('wa-concierge-card');
  const closeBtn = document.getElementById('wa-concierge-close');
  const floatBtn = document.getElementById('wa-float-btn');
  const chipSim = document.getElementById('wa-chip-sim');

  if (!card) return;

  // Mostra teaser suavemente após 5 segundos se o usuário ainda não fechou
  let dismissed = sessionStorage.getItem('wa_concierge_dismissed');
  if (!dismissed) {
    setTimeout(() => {
      if (!sessionStorage.getItem('wa_concierge_dismissed')) {
        card.classList.add('is-open');
        card.setAttribute('aria-hidden', 'false');
      }
    }, window.matchMedia('(max-width: 780px)').matches ? 30000 : 5000);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      card.classList.remove('is-open');
      card.setAttribute('aria-hidden', 'true');
      sessionStorage.setItem('wa_concierge_dismissed', 'true');
    });
  }

  if (chipSim) {
    chipSim.addEventListener('click', () => {
      card.classList.remove('is-open');
    });
  }
}

/* ---------- Reveal on Scroll ---------- */
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
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => io.observe(el));
}

/* ---------- Contadores Numéricos Suaves ---------- */
function initCounters() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const to = parseInt(el.dataset.count, 10);
    const from = parseInt(el.dataset.from || '0', 10);
    if (reduceMotion) { el.textContent = to; return; }
    const duration = 1600;
    const t0 = performance.now() + 400;

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

/* ---------- Cursor Dourado Nobre (Desktop) ---------- */
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
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(loop);
  };
  loop();

  document.querySelectorAll('a, button, .choice, .sim-chip, .sim-city-btn').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });
}

/* ---------- Efeito Magnético Suave ---------- */
function initMagnetic() {
  if (!finePointer || reduceMotion) return;
  document.querySelectorAll('.btn--gold, .wa-float, .hero__badge').forEach((el) => {
    const strength = el.classList.contains('hero__badge') ? 0.2 : 0.25;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ---------- FAQ Accordion ---------- */
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

/* ---------- Formulário de Proposta em Etapas (Wizard) ---------- */
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
      showToast('Por favor, informe seu nome e um WhatsApp válido para contato.');
      (name.value.trim() ? phone : name).focus();
      return;
    }

    const msg = [
      'Olá! Gostaria de receber uma apresentação e proposta técnica da Severino Síndicos Profissionais.',
      '',
      `👤 *Nome:* ${name.value.trim()}`,
      `📌 *Vínculo:* ${role.value}`,
      `📱 *WhatsApp:* ${phone.value.trim()}`,
      `🏢 *Condomínio:* ${condo.value.trim() || 'A informar na conversa'}`,
      `📍 *Cidade:* ${city.value}`,
      `🏷️ *Tipo:* ${data.tipo || 'Residencial vertical'}`,
      `🔢 *Porte:* ${data.porte || '41 a 120 unidades'}`,
      `🎯 *Prioridade:* ${data.prioridade || 'Finanças e custos'}`,
    ].join('\n');

    trackConversion('proposal_form_submit', { tipo: data.tipo, porte: data.porte, cidade: city.value });
    showToast('Obrigado! Redirecionando para o WhatsApp oficial…');
    setTimeout(() => openWhatsApp(msg), 700);
  });

  render();
}

/* ---------- Máscara de Telefone Brasileira ---------- */
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

/* ---------- Rastreamento de Conversão ---------- */
function initTracking() {
  document.querySelectorAll('[data-track]').forEach((el) => {
    el.addEventListener('click', () => trackConversion(el.dataset.track));
  });
}

/* ---------- Helpers de Suporte ---------- */
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

