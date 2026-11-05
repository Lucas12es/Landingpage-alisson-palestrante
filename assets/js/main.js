/* Alisson de Araújo — interações da landing page (JavaScript puro, sem dependências) */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Cabeçalho: estado ao rolar + menu mobile ---------- */
  var header = $(".header");
  var onScroll = function () { header && header.classList.toggle("is-scrolled", window.scrollY > 24); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var toggle = $(".nav-toggle");
  var nav = $("#menu");
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setMenu(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });
  }

  /* ---------- Link ativo no menu (scroll spy) ---------- */
  var navLinks = $$('.nav__list a[href^="#"]:not(.btn)');
  if ("IntersectionObserver" in window && navLinks.length) {
    var map = {};
    navLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
          map[en.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); el && spy.observe(el); });
  }

  /* ---------- Slider do hero ---------- */
  var slider = $("[data-slider]");
  if (slider) {
    var slides = $$(".slider__slide", slider);
    var dots = $$(".slider__dot", slider);
    var btnPrev = $("[data-prev]", slider), btnNext = $("[data-next]", slider), btnToggle = $("[data-toggle]", slider);
    var SLIDE_MS = 3500, idx = 0, timer = null, userPaused = false, hoverPaused = false;
    slider.style.setProperty("--slide-ms", SLIDE_MS + "ms");

    var show = function (n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        var on = i === idx;
        s.classList.toggle("is-active", on);
        s.setAttribute("aria-hidden", on ? "false" : "true");
      });
      dots.forEach(function (d, i) {
        var on = i === idx;
        d.classList.toggle("is-active", on);
        d.setAttribute("aria-current", on ? "true" : "false");
        // reinicia a animação da barra de progresso
        var bar = d.firstElementChild;
        if (bar) { bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = ""; }
      });
      schedule();
    };
    var running = function () { return !userPaused && !hoverPaused && !document.hidden; };
    var schedule = function () {
      clearTimeout(timer);
      slider.classList.toggle("is-paused", !running());
      slider.classList.toggle("is-static", userPaused);
      if (running()) timer = setTimeout(function () { show(idx + 1); }, SLIDE_MS);
    };
    // Primeira exibição: não reinicia a imagem inicial (evita piscar)
    slides.forEach(function (s, i) { s.setAttribute("aria-hidden", i === 0 ? "false" : "true"); });
    dots.forEach(function (d, i) { d.classList.toggle("is-active", i === 0); d.setAttribute("aria-current", i === 0 ? "true" : "false"); });

    btnPrev && btnPrev.addEventListener("click", function () { show(idx - 1); });
    btnNext && btnNext.addEventListener("click", function () { show(idx + 1); });
    dots.forEach(function (d, i) { d.addEventListener("click", function () { show(i); }); });
    if (btnToggle) {
      btnToggle.setAttribute("aria-pressed", String(userPaused));
      btnToggle.setAttribute("aria-label", userPaused ? "Retomar apresentação de fotos" : "Pausar apresentação de fotos");
      btnToggle.addEventListener("click", function () {
        userPaused = !userPaused;
        btnToggle.setAttribute("aria-pressed", String(userPaused));
        btnToggle.setAttribute("aria-label", userPaused ? "Retomar apresentação de fotos" : "Pausar apresentação de fotos");
        schedule();
      });
    }
    document.addEventListener("visibilitychange", schedule);
    // gesto de arrastar (touch)
    var x0 = null;
    slider.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 48) show(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });
    schedule();
  }

  /* ---------- Vídeo de apresentação (Home) ---------- */
  var vid = $("[data-video]");
  if (vid) {
    var vPlay = $("[data-vplay]"), vMute = $("[data-vmute]"), vUser = false;
    var vLabel = function () {
      if (vPlay) { vPlay.setAttribute("aria-pressed", String(vid.paused)); vPlay.setAttribute("aria-label", vid.paused ? "Reproduzir vídeo" : "Pausar vídeo"); var ip = vPlay.querySelector(".i-pause"); }
    };
    vid.addEventListener("play", vLabel); vid.addEventListener("pause", vLabel);
    vPlay && vPlay.addEventListener("click", function () { vUser = true; if (vid.paused) vid.play(); else vid.pause(); });
    vMute && vMute.addEventListener("click", function () {
      vid.muted = !vid.muted;
      vMute.setAttribute("aria-pressed", String(vid.muted));
      vMute.setAttribute("aria-label", vid.muted ? "Ativar o som do vídeo" : "Desativar o som do vídeo");
      if (!vid.muted && vid.paused) vid.play();
    });
    if (!reduceMotion) {
      var tryPlay = function () { var p = vid.play(); if (p && p.catch) p.catch(function () {}); };
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (e) { if (e[0].isIntersecting) { if (!vUser) tryPlay(); } else vid.pause(); }, { threshold: 0.25 }).observe(vid);
      } else { tryPlay(); }
    }
    vLabel();
  }

  /* ---------- Revelar ao rolar ---------- */
  if ("IntersectionObserver" in window && !reduceMotion) {
    var targets = $$("[data-reveal]");
    var vh = window.innerHeight;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el, i) {
      if (el.getBoundingClientRect().top < vh * 0.9) return; // já visível: não anima
      el.classList.add("will-reveal");
      var d = parseInt(el.getAttribute("data-reveal"), 10);
      if (d) el.style.setProperty("--d", d + "ms");
      io.observe(el);
    });
  }

  /* ---------- Contadores ---------- */
  var counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !reduceMotion) {
    var fmt = function (n) { return n.toLocaleString("pt-BR"); };
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        co.unobserve(en.target);
        var el = en.target, end = parseFloat(el.getAttribute("data-count")), dur = 1400, t0 = null;
        var prefix = el.getAttribute("data-prefix") || "", suffix = el.getAttribute("data-suffix") || "";
        var step = function (t) {
          if (t0 === null) t0 = t;
          var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + fmt(Math.round(end * e)) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- Galeria: apresentação automática (foto grande, troca com fade) ---------- */
  var gs = $("[data-gslider]");
  if (gs) {
    var gSlides = $$(".gslide", gs), gDots = $$(".gdot", gs), gIdx = 0, gVisible = true;
    var gShow = function (n) {
      gIdx = (n + gSlides.length) % gSlides.length;
      gSlides.forEach(function (sl, i) {
        var on = i === gIdx;
        sl.classList.toggle("is-active", on);
        sl.setAttribute("aria-hidden", on ? "false" : "true");
        if (on) { var im = $(".gslide__img", sl); if (im) { im.style.animation = "none"; void im.offsetWidth; im.style.animation = ""; } }
      });
      gDots.forEach(function (d, i) { d.classList.toggle("is-active", i === gIdx); });
    };
    gShow(0);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { gVisible = e[0].isIntersecting; }, { threshold: 0.2 }).observe(gs);
    }
    window.setInterval(function () { if (gVisible && !document.hidden) gShow(gIdx + 1); }, 3500);
  }

  /* ---------- WhatsApp flutuante: some quando o contato está visível ---------- */
  var fab = $(".fab"), contato = $("#contato");
  if (fab && contato && "IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { fab.classList.toggle("is-hidden", e[0].isIntersecting); }, { threshold: 0.2 }).observe(contato);
  }

  /* ---------- Formulário → WhatsApp ---------- */
  var form = $("#form-contato");
  if (form) {
    var status = $("#form-status");
    var fieldOf = function (name) { return form.elements[name]; };
    var setErr = function (el, msg) {
      var err = document.getElementById(el.id + "-err");
      if (msg) { el.setAttribute("aria-invalid", "true"); if (err) err.textContent = msg; }
      else { el.removeAttribute("aria-invalid"); }
    };
    ["nome"].forEach(function (n) {
      var el = fieldOf(n);
      el.addEventListener("input", function () { if (el.value.trim().length >= 2) setErr(el, ""); });
    });
    form.addEventListener("submit", function (e) {
      var nome = fieldOf("nome"), empresa = fieldOf("empresa"), interesse = fieldOf("interesse"), msg = fieldOf("mensagem");
      if (nome.value.trim().length < 2) {
        e.preventDefault();
        setErr(nome, "Informe seu nome para eu saber com quem falar.");
        nome.focus();
        if (status) status.textContent = "";
        return;
      }
      e.preventDefault();
      var linhas = ["Olá, Alisson! Meu nome é " + nome.value.trim() + "."];
      if (empresa.value.trim()) linhas.push("Empresa/organização: " + empresa.value.trim() + ".");
      if (interesse.value) linhas.push("Tenho interesse em: " + interesse.value + ".");
      if (msg.value.trim()) linhas.push("", msg.value.trim());
      else linhas.push("Gostaria de receber mais informações e uma proposta.");
      var number = (cfg.whatsapp || form.getAttribute("data-wa") || "").replace(/\D/g, "");
      var url = "https://wa.me/" + number + "?text=" + encodeURIComponent(linhas.join("\n"));
      track("generate_lead", { method: "form_whatsapp" });
      var w = window.open(url, "_blank", "noopener");
      if (!w) window.location.href = url;
      if (status) status.textContent = "Abrindo o WhatsApp com a sua mensagem…";
    });
  }

  /* ---------- Rastreamento de cliques (só funciona se o GA estiver ativo) ---------- */
  function track(name, params) { if (typeof window.gtag === "function") window.gtag("event", name, params || {}); }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href.indexOf("wa.me") > -1) track("click_whatsapp", { link_text: (a.textContent || "").trim().slice(0, 60) });
    else if (href.indexOf("instagram.com") > -1) track("click_instagram");
  });

  /* ---------- Consentimento + Google Analytics (opcional) ---------- */
  var KEY = "alisson_consent_v1";
  var GA = /^G-[A-Z0-9]{6,}$/.test(cfg.gaId || "") ? cfg.gaId : "";
  function loadGA() {
    if (!GA || document.getElementById("ga-script")) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA, { anonymize_ip: true });
    var s = document.createElement("script");
    s.id = "ga-script"; s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA);
    document.head.appendChild(s);
  }
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  if (GA) {
    var saved = stored();
    if (saved === "granted") loadGA();
    else if (!saved) {
      var banner = document.createElement("div");
      banner.className = "consent"; banner.setAttribute("role", "region"); banner.setAttribute("aria-label", "Aviso de privacidade e cookies");
      banner.innerHTML = '<p>Usamos o Google Analytics, com o seu consentimento, para entender como o site é utilizado e melhorá-lo. Saiba mais na <a href="/politica-de-privacidade/">Política de Privacidade</a>.</p>' +
        '<div class="consent__btns"><button type="button" class="btn btn--gold btn--sm" data-consent="granted">Aceitar</button><button type="button" class="btn btn--outline btn--sm" data-consent="denied">Recusar</button></div>';
      document.body.appendChild(banner);
      banner.addEventListener("click", function (e) {
        var b = e.target.closest("[data-consent]"); if (!b) return;
        var v = b.getAttribute("data-consent"); store(v); banner.remove(); if (v === "granted") loadGA();
      });
    }
  }
})();
