import { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";

const START = new Date("2025-03-26T00:00:00");

// Add photo-12, photo-13, photo-14 here the same way if you want all 14 in the timeline.
const memories = [
  { image: "/images/photo-01.jpg", title: "A little piece of us", note: "Some moments become memories. Some people become home. You became both. ❤️" },
  { image: "/images/photo-02.jpg", title: "My favourite human", note: "You make ordinary days feel like something worth remembering. 💗" },
  { image: "/images/photo-03.jpg", title: "Our kind of happiness", note: "The laughs, the silly things, the little moments — I would choose them all again." },
  { image: "/images/photo-04.jpg", title: "A memory I keep close", note: "If I could bottle up a feeling, it would be the happiness I feel with you. ✨" },
  { image: "/images/photo-05.jpg", title: "More memories to come", note: "This is only a tiny part of our story. I can't wait for everything still ahead of us." },
  { image: "/images/photo-06.jpg", title: "Just you and me", note: "In a world full of people, I'm so glad our paths crossed. 💞" },
  { image: "/images/photo-07.jpg", title: "Your contagious smile", note: "Seeing you happy is literally the highlight of my every single day. ☀️" },
  { image: "/images/photo-08.jpg", title: "Adventures with you", note: "Every place is better, and every journey is brighter when I'm with you. 🌍" },
  { image: "/images/photo-09.jpg", title: "My safe place", note: "No matter how chaotic things get, your arms always feel like home. 🤗" },
  { image: "/images/photo-10.jpg", title: "Endless laughter", note: "Thank you for always knowing how to make me laugh until my cheeks hurt. 😂" },
  { image: "/images/photo-11.jpeg", title: "Forever my favorite", note: "Past, present, and future — you'll always be my absolute favorite person. 💫" },
];

// Edit these to make them yours
const REASONS = [
  "You make me laugh when I'm trying to be serious.",
  "You're the first person I want to tell everything to.",
  "Your hugs fix more than they should be able to.",
  "You make plain days feel like plans.",
  "You believe in me louder than I do.",
  "The way you light up about the things you love.",
  "You're kind even when nobody's watching.",
  "You feel like home.",
  "You make the future look fun.",
  "Because it's you.",
];

const SCRATCH = [
  { front: "scratch me", message: "Thank you for being my calm on loud days.", tilt: -2 },
  { front: "scratch me too", message: "Your next birthday wish is already on my to-do list.", tilt: 1.5 },
  { front: "one more", message: "I'd choose you in every timeline.", tilt: -1 },
];

const LETTER = [
  "I don't think words will ever be enough to explain how much you mean to me. I'm grateful for every laugh, every memory, and every little moment we share.",
  "I hope you always believe in yourself, chase everything your heart wants, and remember that you deserve all the happiness in this world.",
  "Since 26 March 2025, our story has been collecting incredible moments. And my favourite part is that there are still so many memories waiting for us.",
  "Happy birthday, my love. Thank you for being you. I’m always cheering for you! ❤️",
];

const COVER_PHOTOS = [
  { i: 0, style: { top: "7%", left: "4%" }, r: -8 },
  { i: 1, style: { top: "10%", right: "4%" }, r: 7 },
  { i: 2, style: { bottom: "9%", left: "5%" }, r: 5 },
  { i: 3, style: { bottom: "7%", right: "5%" }, r: -6 },
];

const HIM = [
  { image: "/images/Him 01.jpeg", caption: "Mirror check" },
  { image: "/images/Him 02.jpeg", caption: "That little smirk" },
  { image: "/images/Him 03.jpeg", caption: "Flower crown, sort of" },
  { image: "/images/Him 04.jpeg", caption: "Flower boy" },
  { image: "/images/Him 05.jpeg", caption: "Window seat" },
  { image: "/images/Him 06.jpeg", caption: "Gym mode" },
  { image: "/images/Him 07.jpeg", caption: "Napping anywhere" },
  { image: "/images/Him 08.jpeg", caption: "So many mirrors" },
];

const STICKERS = ["❤️", "⭐", "🎀", "🌸", "✨", "🍓", "💌", "🌼"];
const NOTE_COLORS = ["#fff2a8", "#ffd3dc", "#d6efdc", "#d8e4ff"];
const TILTS = [-3, 2.5, -2, 3, -1.5, 2];
const SLIP_COLORS = ["#fff2a8", "#ffd3dc", "#d6efdc", "#d8e4ff", "#ffe0b8"];

/* ---------- helpers ---------- */
function useTogether() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, now - START.getTime());
  return {
    d: Math.floor(diff / 864e5),
    h: Math.floor(diff / 36e5) % 24,
    m: Math.floor(diff / 6e4) % 60,
    s: Math.floor(diff / 1e3) % 60,
  };
}

let topZ = 10;
function Draggable({ children, className = "", style, rot = 0 }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [z, setZ] = useState(2);
  const [held, setHeld] = useState(false);
  const start = useRef(null);
  const end = () => { start.current = null; setHeld(false); };
  return (
    <div
      className={`drag ${className} ${held ? "held" : ""}`}
      style={{
        ...style,
        zIndex: z,
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${held ? 0 : rot}deg) scale(${held ? 1.07 : 1})`,
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        start.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y };
        setHeld(true);
        setZ(++topZ);
      }}
      onPointerMove={(e) => {
        if (!start.current) return;
        setPos({ x: start.current.x + e.clientX - start.current.px, y: start.current.y + e.clientY - start.current.py });
      }}
      onPointerUp={end}
      onPointerCancel={end}
    >
      {children}
    </div>
  );
}

function PhotoStage({ src, alt }) {
  return (
    <div className="photo-stage">
      <img className="photo-bg" src={src} alt="" aria-hidden="true" draggable="false" />
      <img
        className="photo-main"
        src={src}
        alt={alt}
        draggable="false"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
    </div>
  );
}

function Floaters() {
  const items = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        char: ["♥", "✦", "✿", "★"][i % 4],
        color: ["#c42a4b", "#e9a92a", "#8fb585", "#6f86d6"][i % 4],
        left: Math.random() * 100,
        size: 14 + Math.random() * 18,
        dur: 18 + Math.random() * 16,
        delay: -Math.random() * 30,
        drift: (Math.random() - 0.5) * 120,
        rot: (Math.random() - 0.5) * 200,
      })),
    []
  );
  return (
    <div className="floaters" aria-hidden="true">
      {items.map((f) => (
        <span
          key={f.id}
          className="floater"
          style={{
            left: `${f.left}%`,
            fontSize: f.size,
            color: f.color,
            "--dur": `${f.dur}s`,
            "--delay": `${f.delay}s`,
            "--drift": `${f.drift}px`,
            "--rot": `${f.rot}deg`,
          }}
        >
          {f.char}
        </span>
      ))}
    </div>
  );
}

/* ---------- Scratch card ---------- */
function ScratchCard({ front, message, tilt }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const paint = () => {
      const w = c.offsetWidth, h = c.offsetHeight, dpr = window.devicePixelRatio || 1;
      c.width = w * dpr;
      c.height = h * dpr;
      const ctx = c.getContext("2d");
      ctx.scale(dpr, dpr);
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#c6ccd6");
      g.addColorStop(0.5, "#eceff4");
      g.addColorStop(1, "#b4bbc7");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#6b7488";
      ctx.font = "700 28px Caveat, cursive";
      ctx.textAlign = "center";
      ctx.fillText(front, w / 2, h / 2 + 8);
    };
    if (document.fonts?.ready) document.fonts.ready.then(paint);
    else paint();
  }, [front]);

  function scratch(e) {
    if (!drawing.current || done) return;
    const c = canvasRef.current;
    const r = c.getBoundingClientRect();
    const ctx = c.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(e.clientX - r.left, e.clientY - r.top, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  function check() {
    drawing.current = false;
    const c = canvasRef.current;
    const { data } = c.getContext("2d").getImageData(0, 0, c.width, c.height);
    let clear = 0, total = 0;
    for (let i = 3; i < data.length; i += 64) { total++; if (data[i] === 0) clear++; }
    if (clear / total > 0.45) setDone(true);
  }

  return (
    <div className={`scratch ${done ? "done" : ""}`} style={{ "--tilt": `${tilt}deg` }}>
      <span className="tape" />
      <p className="scratch-msg">{message}</p>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drawing.current = true; scratch(e); }}
        onPointerMove={scratch}
        onPointerUp={check}
        onPointerCancel={check}
      />
    </div>
  );
}

/* ---------- Reasons jar ---------- */
function ReasonJar() {
  const [reason, setReason] = useState(null);
  const [pulls, setPulls] = useState(0);
  const slips = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({
      left: 6 + (i % 3) * 30 + Math.random() * 8,
      bottom: 6 + Math.floor(i / 3) * 22 + Math.random() * 6,
      rot: (Math.random() - 0.5) * 70,
      color: SLIP_COLORS[i % SLIP_COLORS.length],
    })),
    []
  );

  function pull() {
    let next;
    do { next = REASONS[Math.floor(Math.random() * REASONS.length)]; } while (next === reason && REASONS.length > 1);
    setReason(next);
    setPulls((p) => p + 1);
  }

  return (
    <div className="jar-wrap">
      <button key={`jar-${pulls}`} className={`jar ${pulls ? "shake" : ""}`} onClick={pull} aria-label="Pull a reason from the jar">
        <span className="jar-lid" />
        <span className="jar-glass">
          {slips.map((s, i) => (
            <i key={i} style={{ left: `${s.left}%`, bottom: `${s.bottom}%`, background: s.color, transform: `rotate(${s.rot}deg)` }} />
          ))}
        </span>
        <span className="jar-label">reasons</span>
      </button>
      <button className="sticker-btn small" onClick={pull}>
        {pulls ? "Pull another" : "Pull a reason"}
      </button>
      {reason && (
        <p key={pulls} className="sticky pop" style={{ "--c": "#fff2a8", "--sr": "-2deg" }}>
          {reason}
        </p>
      )}
    </div>
  );
}

/* ---------- Voice note (hidden if /assets/voice-note.mp3 doesn't exist) ---------- */
function VoiceNote({ onPlay, onStop }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  return (
    <div className="voice" hidden={!ready}>
      <audio
        ref={ref}
        src="/assets/voice-note.mp3"
        preload="metadata"
        onLoadedMetadata={() => setReady(true)}
        onPlay={() => { setPlaying(true); onPlay(); }}
        onPause={() => { setPlaying(false); onStop(); }}
        onEnded={() => { setPlaying(false); onStop(); }}
      />
      <button className="voice-btn" onClick={() => (playing ? ref.current.pause() : ref.current.play())}>
        {playing ? "❚❚" : "▶"}
      </button>
      <span>{playing ? "playing…" : "a voice note for you"}</span>
      <div className={`wave ${playing ? "on" : ""}`}><i /><i /><i /><i /><i /></div>
    </div>
  );
}

/* ---------- New tabs ---------- */
const OPEN_WHEN = [
  { front: "Open when you miss me", back: "Look up. Same sky, same moon, and I'm thinking of you.", c: "#ffd3dc", tilt: -2 },
  { front: "Open when you need a smile", back: "Remember the last time we laughed until it hurt? Do that face again.", c: "#fff2a8", tilt: 2 },
  { front: "Open when you can't sleep", back: "Close your eyes and count our good days. You'll lose count fast.", c: "#d6efdc", tilt: -1.5 },
  { front: "Open when you doubt yourself", back: "I've watched you handle hard things. You're better than you think.", c: "#d8e4ff", tilt: 1.5 },
];

function blowSound() {
  try {
    const C = window.AudioContext || window.webkitAudioContext;
    const ctx = new C();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(170, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.3);
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.3);
    setTimeout(() => ctx.close(), 600);
  } catch (e) {}
}

function Cake() {
  const [blown, setBlown] = useState([false, false, false]);
  const left = blown.filter((b) => !b).length;
  function blowOne(i) {
    if (blown[i]) return;
    blowSound();
    setBlown((b) => b.map((v, j) => (j === i ? true : v)));
  }
  return (
    <>
      <h2 className="sec-title"><span>Make a wish</span></h2>
      <p className="hand sub">{left === 0 ? "Wish granted ♥" : `tap each flame to blow it out (${left} left)`}</p>
      <div className="cake" role="group" aria-label="Birthday cake">
        <div className="candles">
          {blown.map((b, i) => (
            <button key={i} className="candle" onClick={() => blowOne(i)} aria-label={b ? "Candle blown out" : "Blow out candle"}>
              <span className="flame-slot">{b ? <span className="smoke" /> : <span className="flame" />}</span>
              <span className="wick" />
              <span className="stick" />
            </button>
          ))}
        </div>
        <div className="tier-top" />
        <div className="tier-bottom" />
        <div className="plate" />
      </div>
    </>
  );
}

function PhotoBoard() {
  const spots = useMemo(
    () => memories.map((_, i) => ({
      left: (i % 4) * 24 + 3 + Math.random() * 4,
      top: Math.floor(i / 4) * 30 + 3 + Math.random() * 5,
      rot: (Math.random() - 0.5) * 20,
    })),
    []
  );
  return (
    <div className="board">
      {memories.map((m, i) => (
        <Draggable key={m.image} className="board-photo" style={{ left: `${spots[i].left}%`, top: `${spots[i].top}%` }} rot={spots[i].rot}>
          <div className="polaroid small" style={{ "--tapec": i % 2 ? "rgba(242,199,92,.85)" : "rgba(183,207,174,.85)" }}>
            <span className="tape" />
            <PhotoStage src={m.image} alt={m.title} />
          </div>
        </Draggable>
      ))}
    </div>
  );
}

function Count({ to }) {
  const [val, setVal] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let raf, t0;
    const target = to;
    const tick = (t) => {
      t0 = t0 ?? t;
      const p = Math.min(1, (t - t0) / 1600);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDone(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, []);
  return <>{(done ? to : val).toLocaleString("en-IN")}</>;
}

function Numbers({ t }) {
  const totalMin = t.d * 1440 + t.h * 60 + t.m;
  const stats = [
    { n: t.d, label: "days since 26 March 2025", s: "❤️" },
    { n: Math.floor(t.d / 7), label: "weeks of us", s: "🌼" },
    { n: t.d * 24 + t.h, label: "hours of us", s: "⏰" },
    { n: Math.floor(t.d / 29.53), label: "full moons", s: "🌙" },
    { n: t.d, label: "sunsets under the same sky", s: "🌇" },
    { n: totalMin * 70, label: "heartbeats, give or take", s: "💓" },
  ];
  return (
    <div className="stat-grid">
      {stats.map((s, i) => (
        <div key={s.label} className="sticky stat" style={{ "--c": NOTE_COLORS[i % 4], "--sr": `${i % 2 ? 2 : -2}deg` }}>
          <b><Count to={s.n} /></b>
          <span>{s.label}</span>
          <i className="sticker">{s.s}</i>
        </div>
      ))}
    </div>
  );
}

function Vinyl({ musicOn, setMusicOn }) {
  return (
    <>
      <h2 className="sec-title"><span>Our song</span></h2>
      <p className="hand sub">{musicOn ? "playing… tap the record to pause" : "tap the record to play"}</p>
      <button className={`vinyl ${musicOn ? "spin" : ""}`} onClick={() => setMusicOn((v) => !v)} aria-label={musicOn ? "Pause our song" : "Play our song"}>
        <span className="vinyl-label">♥</span>
      </button>
      <div className={`wave big ${musicOn ? "on" : ""}`}><i /><i /><i /><i /><i /><i /><i /></div>
    </>
  );
}

function OpenWhen() {
  const [flipped, setFlipped] = useState({});
  return (
    <div className="scratch-row">
      {OPEN_WHEN.map((c, i) => (
        <button
          key={c.front}
          className={`flip ${flipped[i] ? "on" : ""}`}
          style={{ "--tilt": `${c.tilt}deg`, "--c": c.c }}
          onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}
          aria-label={c.front}
        >
          <span className="flip-in">
            <span className="face front">{c.front}</span>
            <span className="face back">{c.back}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function JustHim() {
  const [order, setOrder] = useState(() => HIM.map((_, i) => i));
  const [flying, setFlying] = useState(false);
  const [seen, setSeen] = useState(1);

  function shuffle() {
    if (flying) return;
    setFlying(true);
    setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setSeen((s) => Math.min(HIM.length, s + 1));
      setFlying(false);
    }, 380);
  }

  return (
    <>
      <h2 className="sec-title"><span>Just him</span></h2>
      <p className="hand sub tight">tap the pile to flip to the next one</p>
      <div className="stack" role="button" tabIndex={0} onClick={shuffle} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && shuffle()} aria-label="Next photo">
        {order.map((idx, depth) => {
          const top = depth === 0;
          const rot = depth === 0 ? -1 : (depth % 2 ? 1 : -1) * (2 + depth * 1.6);
          const style = top && flying
            ? { transform: "translate(130%, -4%) rotate(22deg)", opacity: 0, zIndex: 50 }
            : { transform: `translateY(${-depth * 7}px) rotate(${rot}deg) scale(${1 - depth * 0.035})`, opacity: depth > 3 ? 0 : 1, zIndex: 40 - depth };
          return (
            <div key={HIM[idx].image} className="stack-card" style={style}>
              <div className="polaroid" style={{ "--tapec": idx % 2 ? "rgba(242,199,92,.85)" : "rgba(183,207,174,.85)" }}>
                <span className="tape" />
                <PhotoStage src={HIM[idx].image} alt={HIM[idx].caption} />
                <p className="caption">{HIM[idx].caption}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="hand hint">{Math.min(seen, HIM.length)} of {HIM.length}</p>
    </>
  );
}

/* ---------- App ---------- */
const STEPS = 12;
// 0 cover · 1 wish · 2 memories · 3 just him · 4 photo board · 5 numbers · 6 our song · 7 jar · 8 open when · 9 secrets · 10 letter · 11 surprise

export default function App() {
  const t = useTogether();
  const audioRef = useRef(null);
  const touchX = useRef(null);
  const [step, setStep] = useState(0);
  const [mi, setMi] = useState(0);
  const [dir, setDir] = useState(1);
  const [musicOn, setMusicOn] = useState(true);
  const [videoStarted, setVideoStarted] = useState(false);
  const days = t.d;
  const pad = (n) => String(n).padStart(2, "0");
  const m = memories[mi];
  const lastMem = mi === memories.length - 1;

  /* Music starts automatically. Browsers block sound until the first tap, so if
     autoplay is refused it starts on the very first tap/key press anywhere. */
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.loop = true;
    a.volume = 0.35;
    if (!musicOn) { a.pause(); return; }
    const evs = ["pointerdown", "keydown", "touchstart"];
    const kick = () => { a.play().catch(() => {}); evs.forEach((e) => window.removeEventListener(e, kick)); };
    a.play().catch(() => evs.forEach((e) => window.addEventListener(e, kick, { once: true })));
    return () => evs.forEach((e) => window.removeEventListener(e, kick));
  }, [musicOn]);

  useEffect(() => {
    if (step !== 2) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") nextMem();
      if (e.key === "ArrowLeft") goMem(mi - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const duck = () => audioRef.current?.pause();
  const resume = () => { if (musicOn) audioRef.current?.play().catch(() => {}); };

  function go(s) {
    setStep(s);
    setVideoStarted(false);
    window.scrollTo({ top: 0 });
  }
  function goMem(n) {
    if (n < 0 || n >= memories.length || n === mi) return;
    setDir(n > mi ? 1 : -1);
    setMi(n);
  }
  function nextMem() {
    if (lastMem) go(3);
    else goMem(mi + 1);
  }
  const next = (to, label = "Next") => (
    <button className="sticker-btn next" onClick={() => go(to)}>{label}</button>
  );

  return (
    <main className="scrap">
      <audio ref={audioRef} src="/music/our-song.mp3" loop preload="auto" autoPlay />
      <Floaters />

      <nav className="progress" aria-label="Progress">
        {Array.from({ length: STEPS }, (_, s) => (
          <button
            key={s}
            className={`pdot ${s === step ? "active" : s < step ? "done" : ""}`}
            disabled={s >= step}
            onClick={() => go(s)}
            aria-label={`Go back to part ${s + 1}`}
          />
        ))}
      </nav>

      <button className="music-toggle" onClick={() => setMusicOn((v) => !v)} aria-pressed={musicOn}>
        {musicOn ? "♪ music on" : "♪ music off"}
      </button>

      {/* 0 · COVER */}
      {step === 0 && (
        <section key="cover" className="stage cover stage-in">
          {COVER_PHOTOS.map((p) => (
            <Draggable key={p.i} className="cover-photo" style={p.style} rot={p.r}>
              <div className="polaroid small">
                <span className="tape" />
                <PhotoStage src={memories[p.i].image} alt={memories[p.i].title} />
              </div>
            </Draggable>
          ))}

          <div className="cover-inner">
            <p className="hand big-hand">Happy Birthday</p>
            <h1 className="cover-name">Amitesh</h1>
            <svg className="scribble" viewBox="0 0 300 20" aria-hidden="true">
              <path d="M4 12 C 50 2, 110 20, 170 8 S 260 14, 296 6" />
            </svg>
            <p className="hand">a scrapbook of us</p>

            <div className="ticker" aria-label={`${days} days together`}>
              {[["days", days], ["hrs", pad(t.h)], ["min", pad(t.m)], ["sec", pad(t.s)]].map(([label, v]) => (
                <div key={label} className="tick">
                  <b>{v}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <button className="sticker-btn" onClick={() => go(1)}>Open the scrapbook</button>
            <p className="hand hint">psst… you can drag the photos around</p>
          </div>
        </section>
      )}

      {/* 1 · MAKE A WISH */}
      {step === 1 && (
        <section key="wish" className="stage stage-in">
          <Cake />
          {next(2, "Open the memories")}
        </section>
      )}

      {/* 2 · MEMORIES, one at a time */}
      {step === 2 && (
        <section key="mem" className="stage stage-in">
          <p className="hand sub tight">memory {mi + 1} of {memories.length}</p>

          <div
            key={mi}
            className={`mem ${dir > 0 ? "from-r" : "from-l"}`}
            onPointerDown={(e) => { touchX.current = e.clientX; }}
            onPointerUp={(e) => {
              if (touchX.current === null) return;
              const dx = e.clientX - touchX.current;
              touchX.current = null;
              if (dx < -50) nextMem();
              else if (dx > 50) goMem(mi - 1);
            }}
          >
            <div className="polaroid" style={{ "--tilt": `${TILTS[mi % TILTS.length]}deg`, "--tapec": mi % 2 ? "rgba(242,199,92,.85)" : "rgba(183,207,174,.85)" }}>
              <span className="tape" />
              <PhotoStage src={m.image} alt={m.title} />
              <p className="caption">{m.title}</p>
            </div>
            <div className="entry-note">
              <p className="sticky" style={{ "--c": NOTE_COLORS[mi % NOTE_COLORS.length], "--sr": `${mi % 2 ? 2 : -2}deg` }}>
                {m.note}
              </p>
              <span className="sticker" style={{ "--sr": `${(mi % 3) * 8 - 8}deg` }}>{STICKERS[mi % STICKERS.length]}</span>
            </div>
          </div>

          <div className="nav-row">
            <button className="round-btn" onClick={() => goMem(mi - 1)} disabled={mi === 0} aria-label="Previous memory">‹</button>
            <div className="pips">
              {memories.map((_, i) => (
                <button key={i} className={`pip ${i === mi ? "active" : i < mi ? "seen" : ""}`} onClick={() => goMem(i)} aria-label={`Memory ${i + 1}`} />
              ))}
            </div>
            <button className="round-btn" onClick={nextMem} aria-label="Next memory">›</button>
          </div>

          {lastMem && <button className="sticker-btn" onClick={() => go(3)}>Keep going</button>}
        </section>
      )}

      {/* 3 · JUST HIM */}
      {step === 3 && (
        <section key="him" className="stage stage-in">
          <JustHim />
          {next(4)}
        </section>
      )}

      {/* 4 · PHOTO BOARD */}
      {step === 4 && (
        <section key="board" className="stage stage-in">
          <h2 className="sec-title"><span>Make your own collage</span></h2>
          <p className="hand sub tight">drag the photos anywhere you like</p>
          <PhotoBoard />
          {next(5)}
        </section>
      )}

      {/* 4 · US IN NUMBERS */}
      {step === 5 && (
        <section key="numbers" className="stage stage-in">
          <h2 className="sec-title"><span>Us, in numbers</span></h2>
          <p className="hand sub">counting since 26 March 2025</p>
          <Numbers t={t} />
          {next(6)}
        </section>
      )}

      {/* 5 · OUR SONG */}
      {step === 6 && (
        <section key="song" className="stage stage-in">
          <Vinyl musicOn={musicOn} setMusicOn={setMusicOn} />
          {next(7)}
        </section>
      )}

      {/* 6 · JAR */}
      {step === 7 && (
        <section key="jar" className="stage stage-in">
          <h2 className="sec-title"><span>Reasons I love you</span></h2>
          <p className="hand sub">tap the jar</p>
          <ReasonJar />
          {next(8)}
        </section>
      )}

      {/* 7 · OPEN WHEN */}
      {step === 8 && (
        <section key="openwhen" className="stage stage-in">
          <h2 className="sec-title"><span>Open when…</span></h2>
          <p className="hand sub">tap a card to flip it</p>
          <OpenWhen />
          {next(9)}
        </section>
      )}

      {/* 8 · SCRATCH */}
      {step === 9 && (
        <section key="scratch" className="stage stage-in">
          <h2 className="sec-title"><span>Little secrets</span></h2>
          <p className="hand sub">scratch to reveal</p>
          <div className="scratch-row">
            {SCRATCH.map((s) => (
              <ScratchCard key={s.message} {...s} />
            ))}
          </div>
          {next(10)}
        </section>
      )}

      {/* 9 · LETTER, line by line */}
      {step === 10 && (
        <section key="letter" className="stage stage-in">
          <h2 className="sec-title"><span>A letter for you</span></h2>
          <VoiceNote onPlay={duck} onStop={resume} />
          <div className="notebook">
            <span className="tape" />
            <p className="salutation line" style={{ animationDelay: "0.3s" }}>To my dearest Amitesh,</p>
            {LETTER.map((line, i) => (
              <p key={i} className="line" style={{ animationDelay: `${1.2 + i * 1.3}s` }}>{line}</p>
            ))}
            <p className="sign line" style={{ animationDelay: `${1.2 + LETTER.length * 1.3}s` }}>{days} days and still counting ♥</p>
          </div>
          {next(11, "Open your surprise")}
        </section>
      )}

      {/* 10 · SURPRISE */}
      {step === 11 && (
        <section key="video" className="stage stage-in">
          <h2 className="sec-title"><span>One last thing</span></h2>
          <div className="video-card">
            <span className="tape" />
            {videoStarted ? (
              <video src="/assets/happy-birthday.mp4" controls autoPlay playsInline onPlay={duck} onPause={resume} onEnded={resume} />
            ) : (
              <button className="video-cover" onClick={() => setVideoStarted(true)} aria-label="Play your surprise video">
                <span className="play-badge">▶</span>
                <span className="hand">tap to play your surprise</span>
              </button>
            )}
          </div>
          <p className="hand sub tight">Happy birthday, my love. I love you!</p>
          <div className="row-btns">
            <button className="sticker-btn small" onClick={() => go(2)}>Back to memories</button>
            <button className="sticker-btn small" onClick={() => { setMi(0); go(0); }}>Start over</button>
          </div>
        </section>
      )}
    </main>
  );
}