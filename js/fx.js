/* Efeitos premium v2 — não depende de main.js */
(function () {
  'use strict';
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Spotlight que segue o mouse nos cards
  var spotSel = '.service, .quote, .trust-pill, .faq__item, .sim-mini-metric, .condo, .manifesto__highlight-box';
  document.querySelectorAll(spotSel).forEach(function (el) {
    el.classList.add('spot');
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Preenchimento dourado do slider do simulador
  var range = document.getElementById('sim-units-range');
  if (range) {
    var fill = function () {
      var p = (range.value - range.min) / (range.max - range.min) * 100;
      range.style.setProperty('--fill', p + '%');
    };
    range.addEventListener('input', fill); fill();
  }

  if (!fine || reduce) return;

  // Botões magnéticos
  document.querySelectorAll('.btn--gold, .btn--glass, .btn--wa-ghost').forEach(function (b) {
    b.setAttribute('data-magnetic', '');
    b.addEventListener('pointermove', function (e) {
      var r = b.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) * 0.18;
      var y = (e.clientY - r.top - r.height / 2) * 0.28;
      b.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    b.addEventListener('pointerleave', function () { b.style.transform = ''; });
  });

  // Tilt 3D sutil nas imagens
  document.querySelectorAll('.method__media, .founder__media').forEach(function (el) {
    var img = el.querySelector('img');
    if (!img) return;
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      img.style.transition = 'transform 0.15s ease-out';
      img.style.transform = 'perspective(900px) rotateY(' + px * 7 + 'deg) rotateX(' + -py * 7 + 'deg) scale(1.02)';
    });
    el.addEventListener('pointerleave', function () {
      img.style.transition = 'transform 0.8s cubic-bezier(.22,1,.36,1)';
      img.style.transform = '';
    });
  });

  // Parallax do hero
  var hero = document.querySelector('.hero__media img');
  if (hero) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) hero.style.translate = '0 ' + (y * 0.18) + 'px';
    }, { passive: true });
  }
})();

/* Vídeo institucional: autoplay mudo + botão para ativar o som */
(function () {
  'use strict';
  var holder = document.getElementById('yt-player');
  var btn = document.getElementById('video-sound-btn');
  if (!holder || !btn) return;
  var player, ready = false;

  function build() {
    player = new YT.Player('yt-player', {
      videoId: holder.getAttribute('data-video'),
      playerVars: { autoplay: 1, mute: 1, loop: 1, playlist: holder.getAttribute('data-video'),
        controls: 1, rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3 },
      events: { onReady: function (e) { ready = true; e.target.mute(); e.target.playVideo(); } }
    });
  }
  window.onYouTubeIframeAPIReady = build;
  var s = document.createElement('script');
  s.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(s);

  function setUi(on) {
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', on);
    btn.querySelector('b').textContent = on ? 'Som ativado' : 'Ativar som';
    btn.querySelector('small').textContent = on ? 'Toque para silenciar' : 'Toque para ouvir';
  }
  btn.addEventListener('click', function () {
    if (!ready) return;
    var muted = player.isMuted();
    if (muted) { player.unMute(); player.setVolume(100); player.playVideo(); } else { player.mute(); }
    setUi(muted);
  });

  // Pausa fora da tela, retoma ao voltar (economiza dados)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      if (!ready) return;
      en[0].isIntersecting ? player.playVideo() : player.pauseVideo();
    }, { threshold: 0.25 }).observe(holder.parentElement);
  }
})();
