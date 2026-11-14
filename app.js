/* ============================================================
   Seguridad — test de verdadero o falso, una pregunta a la vez
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. Tema ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");
  const themeLabel = document.getElementById("themeLabel");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    const dark = theme === "dark";
    themeBtn.setAttribute("aria-pressed", String(dark));
    themeBtn.setAttribute("aria-label", dark ? "Activar modo claro" : "Activar modo oscuro");
    themeLabel.textContent = dark ? "Modo claro" : "Modo oscuro";
  }
  applyTheme(root.getAttribute("data-theme") || "light");
  themeBtn.addEventListener("click", () =>
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark")
  );

  /* ---------- 2. Menú móvil ---------- */
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menuBtn");
  menuBtn.addEventListener("click", () => {
    const open = sidebar.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".nav-link").forEach((l) =>
    l.addEventListener("click", () => {
      sidebar.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- 3. Animaciones y scroll ---------- */
  const reveal = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    reveal.forEach((el) => io.observe(el));
  } else {
    reveal.forEach((el) => el.classList.add("in"));
  }

  const bar = document.getElementById("scrollProgress");
  function onScroll() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window) {
    const links = document.querySelectorAll(".nav-link");
    const spy = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));
  }

  document.getElementById("topBtn").addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ---------- 4. Datos ---------- */
  const BANCO = Object.assign({}, window.BANCO_A || {}, window.BANCO_B || {});
  const OFICIALES = window.OFICIALES || [];

  function el(tag, cls) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }

  /* ============================================================
     Test: una pregunta en pantalla, siguiente al responder
     ============================================================ */
  function createQuiz(container, opts) {
    const states = new Map();
    let ctx = opts.initial || "default";

    function state() {
      if (!states.has(ctx)) {
        states.set(ctx, {
          answers: new Map(),   // índice -> true/false (último intento)
          run: [],              // índices de la tanda en curso
          pos: 0, hits: 0, misses: 0,
          started: false, done: false,
        });
      }
      return states.get(ctx);
    }
    const questions = () => opts.getQuestions(ctx) || [];
    const label = () => (opts.label ? opts.label(ctx) : "Test");

    /* --- regla del examen: cada `penalty` fallos restan 1 acierto --- */
    function penalizacion(st) {
      return opts.penalty ? Math.floor(st.misses / opts.penalty) : 0;
    }
    function aciertosNetos(st) {
      return Math.max(0, st.hits - penalizacion(st));
    }
    function pintaScore(st, score) {
      const partes = score.querySelectorAll("i");
      partes[0].textContent = "✓ " + st.hits;
      partes[1].textContent = "✗ " + st.misses;
      if (partes[2]) {
        const d = penalizacion(st);
        partes[2].textContent = d ? "−" + d : "";
        partes[2].hidden = !d;
      }
    }

    /* --- arranque de una tanda --- */
    function start(kind) {
      const st = state();
      const qs = questions();
      let idx = qs.map((q, i) => i);
      if (kind === "fallos") idx = idx.filter((i) => st.answers.get(i) === false);
      if (!idx.length) return;
      st.run = idx;
      st.pos = 0; st.hits = 0; st.misses = 0;
      st.started = true; st.done = false;
      if (opts.onStart) opts.onStart(kind);
      render();
      container.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function finish() {
      const st = state();
      if (!st.started || st.done) return;
      st.done = true;
      render();
      if (opts.onDone) opts.onDone();
    }

    function reset() {
      const st = state();
      st.answers = new Map();
      start("todo");
    }

    /* --- pintado --- */
    function render() {
      const st = state();
      container.innerHTML = "";

      if (!st.started) { container.appendChild(startCard()); return; }
      if (st.done) { container.appendChild(resultCard()); return; }

      container.appendChild(head());
      container.appendChild(questionCard());
    }

    function head() {
      const st = state();
      const answered = st.hits + st.misses;
      const total = st.run.length;

      const h = el("div", "quiz-head");

      const count = el("span", "quiz-count");
      count.innerHTML = "Pregunta <b>" + Math.min(answered + 1, total) + "</b> / " + total;

      const progress = el("div", "quiz-progress");
      const fill = el("span");
      fill.style.width = (total ? (answered / total) * 100 : 0) + "%";
      progress.appendChild(fill);

      const score = el("span", "score");
      const ok = el("i", "ok"); ok.textContent = "✓ " + st.hits;
      const no = el("i", "no"); no.textContent = "✗ " + st.misses;
      score.append(ok, no);
      if (opts.penalty) {
        const pen = el("i", "pen");
        score.append(pen);
      }
      pintaScore(st, score);

      h.append(count, progress, score);
      return h;
    }

    function startCard() {
      const qs = questions();
      const box = el("div", "start-card");
      const txt = el("div", "start-text");
      const t = el("p", "start-title");
      t.textContent = label();
      const s = el("p", "start-sub");
      s.textContent = opts.startSub
        ? opts.startSub(qs.length)
        : qs.length + " preguntas, una cada vez. Respondes y abajo te cuento el porqué. " +
          "Al final te quedan las falladas para repetirlas.";
      txt.append(t, s);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-solid";
      btn.textContent = opts.startBtn || "Empezar";
      btn.addEventListener("click", () => start("todo"));
      box.append(txt, btn);
      return box;
    }

    function questionCard() {
      const st = state();
      const qs = questions();
      const i = st.run[st.pos];
      const q = qs[i];

      const c = el("article", "question");

      const num = el("span", "q-num");
      num.textContent = (st.pos + 1) + " · " + (opts.tag ? opts.tag(i, ctx) : ctx.toUpperCase());
      const text = el("p", "q-text");
      text.textContent = q.p;
      const actions = el("div", "q-actions");

      const btns = ["Verdadero", "Falso"].map((labelText, k) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn-answer";
        b.textContent = labelText;
        b.dataset.answer = String(k === 0);
        b.addEventListener("click", () => pick(c, i, k === 0, btns));
        return b;
      });

      actions.append(...btns);
      c.append(num, text, actions);
      return c;
    }

    function pick(cardEl, i, chosen, btns) {
      const st = state();
      if (cardEl.classList.contains("answered")) return;
      const q = questions()[i];
      const ok = chosen === q.r;

      st.answers.set(i, ok);
      if (ok) st.hits++; else st.misses++;

      btns.forEach((b) => {
        b.disabled = true;
        if ((b.dataset.answer === "true") === q.r) b.classList.add(ok ? "correct" : "reveal-right");
      });
      if (!ok) (chosen ? btns[0] : btns[1]).classList.add("wrong");

      cardEl.classList.add("answered");
      cardEl.classList.add(ok ? "is-ok" : "is-no");
      cardEl.appendChild(feedback(ok, q.m));

      // contador de la cabecera
      const answered = st.hits + st.misses;
      const total = st.run.length;
      const head = container.querySelector(".quiz-head");
      head.querySelector(".quiz-count").innerHTML =
        "Pregunta <b>" + Math.min(answered + 1, total) + "</b> / " + total;
      head.querySelector(".quiz-progress span").style.width =
        (total ? (answered / total) * 100 : 0) + "%";
      pintaScore(st, head.querySelector(".score"));

      // botón de paso
      const last = st.pos === total - 1;
      const next = el("div", "quiz-next");
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn-solid";
      b.textContent = last ? "Ver resultado" : "Siguiente pregunta";
      b.addEventListener("click", () => {
        if (last) finish();
        else { st.pos++; render(); }
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      next.appendChild(b);
      container.appendChild(next);
    }
    function feedback(ok, motivo) {
      const fb = el("div", "q-feedback " + (ok ? "is-ok" : "is-no"));
      fb.setAttribute("role", "status");
      const verdict = el("div", "verdict " + (ok ? "ok" : "no"));
      verdict.textContent = ok ? "Correcto" : "Incorrecto";
      const why = el("p", "explanation");
      why.textContent = motivo;
      fb.append(verdict, why);
      return fb;
    }

    function failedTotal() {
      let n = 0;
      state().answers.forEach((v) => { if (!v) n++; });
      return n;
    }

    function resultCard() {
      const st = state();
      const total = st.run.length;
      const penal = penalizacion(st);
      const netos = aciertosNetos(st);
      const pct = total ? Math.round((netos / total) * 100) : 0;
      const fallos = failedTotal();

      const result = el("div", "quiz-result");

      const ring = el("div", "ring");
      ring.style.setProperty("--p", pct);
      const rp = el("span"); rp.textContent = pct + "%";
      ring.appendChild(rp);

      const txt = el("div", "result-text");
      const eye = el("p", "eyebrow");
      eye.textContent = "Resultado";
      const h = el("h3"); h.textContent = netos + " / " + total;
      const msg = el("p"); msg.textContent = mensaje(pct);
      txt.append(eye, h, msg);

      if (penal) {
        const nota = el("p", "pen-note");
        nota.textContent = "Sin descontar serían " + st.hits + " aciertos. La regla se los come: " +
          "cada 4 fallos baja 1 bien, así que te quitan " + penal + ".";
        txt.appendChild(nota);
      }

      const acts = el("div", "result-actions");

      if (fallos) {
        const r = document.createElement("button");
        r.type = "button"; r.className = "btn-solid";
        r.innerHTML = "Repasar los fallos <em>" + fallos + "</em>";
        r.addEventListener("click", () => start("fallos"));
        acts.appendChild(r);
      }
      const again = document.createElement("button");
      again.type = "button"; again.className = "btn-ghost";
      again.textContent = fallos ? "Repetir todo" : "Repetir";
      again.addEventListener("click", () => start("todo"));
      acts.appendChild(again);

      if (st.answers.size) {
        const c = document.createElement("button");
        c.type = "button"; c.className = "btn-ghost";
        c.textContent = "Empezar de cero";
        c.addEventListener("click", reset);
        acts.appendChild(c);
      }
      if (opts.extraAction) {
        const x = opts.extraAction();
        if (x) acts.appendChild(x);
      }

      txt.appendChild(acts);
      result.append(ring, txt);
      return result;
    }

    function mensaje(pct) {
      if (pct === 100) return "Ni una mal. Esto lo tienes.";
      if (pct >= 80) return "Muy bien. Repasa las que has fallado y queda redondo.";
      if (pct >= 60) return "Bien, pero hay un puñado de conceptos flojos. Tírate el repaso.";
      if (pct >= 40) return "La mitad más o menos. Vuelve a leer la práctica y repite el test.";
      return "Tranquilo, esto se estudia. Lee otra vez la práctica y vuelve a por él.";
    }

    /* --- cambio de contexto (pestañas) --- */
    const setContext = (id) => { ctx = id; render(); };
    container.__setContext = setContext;
    if (opts.autoStart) start("todo");
    else render();
    return { start, finish, __setContext: setContext };
  }

  /* ============================================================
     Tests por práctica
     ============================================================ */
  document.querySelectorAll(".quiz[data-src='banco']").forEach((box) => {
    const key = box.dataset.key;
    const abrir = () => {
      box.innerHTML = "";
      createQuiz(box, {
        label: () => "Test basado en la Práctica " + key,
        getQuestions: () => BANCO[key] || [],
        tag: () => "Práctica " + key,
        autoStart: true,
      });
      box.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (box.dataset.lazy) {
      const n = (BANCO[key] || []).length;
      const wrap = el("div", "start-card");
      const txt = el("div", "start-text");
      const t = el("p", "start-title");
      t.textContent = "Test basado en la Práctica " + key;
      const s = el("p", "start-sub");
      s.textContent = n + " preguntas, una cada vez. Respondes y abajo te cuento el porqué. " +
        "Al final te quedan las falladas para repetirlas.";
      txt.append(t, s);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-solid";
      btn.textContent = "Empezar test";
      btn.addEventListener("click", abrir);
      wrap.append(txt, btn);
      box.appendChild(wrap);
      return;
    }
    abrir();
  });

  /* ============================================================
     Preguntas oficiales: pestañas + "Realizar todas"
     ============================================================ */
  const chipsBox = document.getElementById("oficialChips");
  const oficialBox = document.getElementById("oficialQuiz");

  if (OFICIALES.length) {
    const TODAS = "__todas__";

    const quiz = createQuiz(oficialBox, {
      initial: TODAS,
      tag: (i, id) => {
        const g = OFICIALES.find((x) => x.id === id);
        return g ? g.titulo : "Oficiales";
      },
      label: (id) => {
        if (id === TODAS) return "Todas las preguntas oficiales";
        const g = OFICIALES.find((x) => x.id === id) || OFICIALES[0];
        return g.titulo + " · " + g.sub;
      },
      getQuestions: (id) => {
        if (id === TODAS) return OFICIALES.reduce((a, g) => a.concat(g.preguntas), []);
        return (OFICIALES.find((x) => x.id === id) || OFICIALES[0]).preguntas;
      },
    });

    const grupos = [
      { id: TODAS, titulo: "Realizar todas", sub: "Las " + OFICIALES.reduce((a, g) => a + g.preguntas.length, 0) + " oficiales de golpe", n: OFICIALES.reduce((a, g) => a + g.preguntas.length, 0), todo: true },
    ].concat(OFICIALES.map((g) => ({
      id: g.id, titulo: g.titulo, sub: g.sub, n: g.preguntas.length,
    })));

    grupos.forEach((g, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (i === 0 ? " is-on" : "");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      if (g.todo) b.classList.add("chip--all");

      const t = document.createElement("span");
      t.textContent = g.titulo;
      const s = document.createElement("em");
      s.textContent = g.sub;
      const n = document.createElement("i");
      n.textContent = g.n;
      b.append(t, s, n);

      b.addEventListener("click", () => {
        chipsBox.querySelectorAll(".chip").forEach((c) => {
          c.classList.remove("is-on");
          c.setAttribute("aria-selected", "false");
        });
        b.classList.add("is-on");
        b.setAttribute("aria-selected", "true");
        quiz.__setContext(g.id);
        oficialBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      chipsBox.appendChild(b);
    });
  } else {
    oficialBox.innerHTML = '<p class="start-sub">Falta cargar las preguntas oficiales.</p>';
  }

  /* ============================================================
     Simulacro de examen · 40 preguntas de todo, 30 minutos
     ============================================================ */
  const examBox = document.getElementById("examenQuiz");
  const examBar = document.getElementById("examBar");
  const examTime = document.getElementById("examTime");
  const examHint = document.getElementById("examHint");

  if (examBox) {
    const TOTAL = 40;
    const SEGUNDOS = 30 * 60;
    let restante = SEGUNDOS;
    let reloj = null;
    let quiz = null;

    /* mezcla todo (banco + oficiales), quita duplicados y saca 40 al azar */
    function sorteo() {
      const todo = [];
      Object.keys(BANCO).forEach((k) =>
        (BANCO[k] || []).forEach((q) => todo.push({ p: q.p, r: q.r, m: q.m, src: "Práctica " + k }))
      );
      (OFICIALES || []).forEach((g) =>
        g.preguntas.forEach((q) => todo.push({ p: q.p, r: q.r, m: q.m, src: "Oficial · " + g.titulo.replace("Práctica ", "") }))
      );

      const vistas = new Set();
      const unicas = todo.filter((q) => {
        const key = q.p.trim().toLowerCase();
        if (vistas.has(key)) return false;
        vistas.add(key);
        return true;
      });

      for (let i = unicas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unicas[i], unicas[j]] = [unicas[j], unicas[i]];
      }
      return unicas.slice(0, TOTAL);
    }

    function pintarReloj() {
      const m = Math.floor(restante / 60);
      const s = restante % 60;
      examTime.textContent = m + ":" + String(s).padStart(2, "0");
      examBar.classList.toggle("is-low", restante <= 300);
    }

    function pararReloj() {
      if (reloj) { clearInterval(reloj); reloj = null; }
      examBar.classList.remove("is-on");
    }

    function arrancarReloj() {
      pararReloj();
      restante = SEGUNDOS;
      pintarReloj();
      examBar.hidden = false;
      examBar.classList.add("is-on");
      examHint.textContent = "Corre. Si llega a cero, se cierra solo.";
      reloj = setInterval(() => {
        restante--;
        pintarReloj();
        if (restante <= 0) {
          pararReloj();
          examBar.classList.add("is-low");
          if (quiz) quiz.finish();
          examHint.textContent = "Se acabó el tiempo. Ahí está lo que has dado.";
        }
      }, 1000);
    }

    function nuevoSimulacro() {
      pararReloj();
      restante = SEGUNDOS;
      examBar.hidden = false;
      examBar.classList.remove("is-low");
      pintarReloj();
      examHint.textContent = "Quieto a 30:00. Empieza a contar cuando pulses empezar.";
      const preguntas = sorteo();
      examBox.innerHTML = "";
      quiz = createQuiz(examBox, {
        label: () => "Simulacro de examen",
        startBtn: "Empezar simulacro",
        penalty: 4,
        startSub: () => TOTAL + " preguntas sacadas al azar de las ocho prácticas y de las oficiales, " +
          "contra reloj: 30 minutos. Cada 4 fallos bajan 1 acierto, como en el examen. " +
          "El tiempo arranca cuando le das a empezar; si llega a cero se cierra solo.",
        getQuestions: () => preguntas,
        tag: (i) => preguntas[i] ? preguntas[i].src : "Simulacro",
        onStart: (kind) => {
          if (kind !== "fallos") arrancarReloj();
          else {
            examBar.classList.remove("is-low");
            pintarReloj();
            examHint.textContent = "Repaso de falladas: aquí el reloj no corre.";
          }
        },
        onDone: () => {
          pararReloj();
          examHint.textContent = "Tiempo que te sobró. Cuando quieras, otro simulacro distinto.";
        },
        extraAction: () => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "btn-ghost";
          b.textContent = "Otro simulacro (40 nuevas)";
          b.addEventListener("click", () => {
            nuevoSimulacro();
            examBox.scrollIntoView({ behavior: "smooth", block: "start" });
          });
          return b;
        },
      });
    }

    nuevoSimulacro();
  }
})();
