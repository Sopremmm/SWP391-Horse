import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext.jsx";
import {
  BRAND,
  BRAND_BORDER,
  BRAND_LIGHT,
  BRAND_TEXT,
  BORDER,
  PAGE_BG,
  SURFACE,
  TEXT,
  TEXT_MUTED,
  TEXT_SUBTLE,
} from "../constants.js";
import { fmtDateTime } from "../format.js";
import { RACES_SEED } from "../races.js";

function GradeBadge({ grade }) {
  const style = grade === "G1" ? { bg: "#fef3c7", color: "#92400e", border: "#fde68a" }
    : grade === "G2" ? { bg: "#eff6ff", color: "#1e40af", border: "#93c5fd" }
    : { bg: "#f3f4f6", color: TEXT_MUTED, border: BORDER };
  return (
    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md border"
      style={{ background: style.bg, color: style.color, borderColor: style.border }}>{grade}</span>
  );
}

function ProductCard({ race, onViewDetail }) {
  const [hovered, setHovered] = useState(false);
  const imgs = ["🐎", "🏇"];

  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group cursor-pointer transition-all duration-300"
      style={{ boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.1)" : "0 1px 3px rgba(0,0,0,0.04)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onViewDetail}
    >
      <div className="relative aspect-[4/3] flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)" }}>
        <span className="text-6xl transition-opacity duration-300">{imgs[0]}</span>
        {hovered && (
          <span className="absolute inset-0 flex items-center justify-center text-6xl transition-opacity duration-300" style={{ background: "rgba(0,0,0,0.05)" }}>
            {imgs[1]}
          </span>
        )}
        <GradeBadge grade={race.grade} />
        {race.status === "Running" && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-red-500">LIVE</div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><i className="ti ti-map-pin text-[13px]" />{race.venue}</p>
        <h3 className="text-sm font-bold text-slate-800 mb-1 leading-tight line-clamp-1">{race.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <i className="ti ti-calendar text-[12px]" style={{ color: TEXT_MUTED }} />
          <span className="text-xs" style={{ color: TEXT_MUTED }}>{race.date} · {race.time}</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-lg font-black" style={{ color: BRAND_TEXT }}>${(race.prizePool / 1000).toFixed(0)}K</span>
            <span className="text-[11px] text-slate-400 ml-1">Prize</span>
          </div>
          <span className="text-xs font-medium px-2 py-0.5 rounded-md border" style={{ background: BRAND_LIGHT, color: BRAND_TEXT, borderColor: BRAND_BORDER }}>
            {race.distance}m
          </span>
        </div>
      </div>
    </div>
  );
}

function RaceDetail({ race, onClose }) {
  const [selectedReg, setSelectedReg] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [reviewText, setReviewText] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewSent, setReviewSent] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [activeTab, setActiveTab] = useState("desc");
  const zoomRef = useRef(null);
  const imgs = ["🐎", "🏇", "🏆", "🎯"];

  const handleMouseMove = (e) => {
    const rect = zoomRef.current?.getBoundingClientRect();
    if (!rect) return;
    setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const reviews = [
    { name: "Alex Thompson", rating: 5, text: "Incredible race! The atmosphere was electrifying and the horses performed beautifully.", date: "2 days ago" },
    { name: "Sarah Mitchell", rating: 4, text: "Great event overall. Would love to see more vendors next year.", date: "1 week ago" },
  ];

  const relatedRaces = RACES_SEED.filter((r) => r.id !== race.id && r.grade === race.grade).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-7 pb-12 pt-7">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <button type="button" onClick={onClose} className="hover:text-emerald-700 cursor-pointer bg-transparent border-none font-sans transition-colors">
          Home
        </button>
        <i className="ti ti-chevron-right text-[12px]" />
        <span className="text-slate-600 font-medium">{race.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        <div>
          <div
            ref={zoomRef}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-crosshair mb-4 border border-slate-200"
            style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)" }}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
          >
            <div className="absolute inset-0 flex items-center justify-center text-8xl select-none pointer-events-none">
              {imgs[activeImg]}
            </div>
            {zoom && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at ${zoomPos.x}% ${zoomPos.y}%, rgba(6,78,59,0.15), transparent 60%)`,
                }}
              />
            )}
          </div>
          <div className="flex gap-2">
            {imgs.map((_, i) => (
              <button key={i} type="button" onClick={() => setActiveImg(i)}
                className="w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl transition-all cursor-pointer bg-white"
                style={{ borderColor: activeImg === i ? BRAND : BORDER }}>
                {imgs[i]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <GradeBadge grade={race.grade} />
            <span className="text-xs font-medium px-2 py-0.5 rounded-md border" style={{ background: race.status === "Running" ? "#fef2f2" : "#eff6ff", color: race.status === "Running" ? "#991b1b" : "#1e40af", borderColor: race.status === "Running" ? "#fca5a5" : "#93c5fd" }}>
              {race.status}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">{race.name}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
            <span className="flex items-center gap-1"><i className="ti ti-map-pin text-[14px]" />{race.venue}</span>
            <span className="flex items-center gap-1"><i className="ti ti-calendar text-[14px]" />{race.date}</span>
            <span className="flex items-center gap-1"><i className="ti ti-clock text-[14px]" />{race.time}</span>
          </div>

          <div className="text-3xl font-black mb-4" style={{ color: BRAND_TEXT }}>
            ${(race.prizePool / 1000).toFixed(0)}K <span className="text-sm font-normal text-slate-400">Prize Pool</span>
          </div>

          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            {race.condition} track conditions · {race.distance}m distance · {race.registrations.length} registered horses competing for the championship title.
          </p>

          <div className="mb-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Select Horse</p>
            <div className="flex flex-wrap gap-2">
              {race.registrations.slice(0, 6).map((reg) => (
                <button key={String(reg.id)} type="button" onClick={() => setSelectedReg(selectedReg?.id === reg.id ? null : reg)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all"
                  style={selectedReg?.id === reg.id
                    ? { background: BRAND, color: "#fff", borderColor: BRAND }
                    : { background: "#fff", color: TEXT_MUTED, borderColor: BORDER }}>
                  {reg.horseName}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            {[
              { icon: "map-pin", label: "Venue", value: race.venue },
              { icon: "ruler", label: "Distance", value: `${race.distance}m` },
              { icon: "cloud", label: "Track", value: race.condition },
              { icon: "trophy", label: "Grade", value: race.grade },
              { icon: "users", label: "Entries", value: `${race.registrations.length} horses` },
            ].map((row, i, arr) => (
              <div key={row.label} className="flex items-center gap-3 px-4 py-2.5" style={{ borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none", background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                <i className={`ti ti-${row.icon} text-sm`} style={{ color: TEXT_MUTED }} />
                <span className="text-xs text-slate-500 w-16">{row.label}</span>
                <span className="text-sm font-semibold text-slate-800">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-slate-200 mb-4">
          {["desc", "info", "review"].map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className="px-5 py-3 text-sm font-semibold capitalize cursor-pointer bg-transparent border-none transition-all"
              style={{ color: activeTab === tab ? BRAND : TEXT_MUTED, borderBottom: activeTab === tab ? `2px solid ${BRAND}` : "2px solid transparent", marginBottom: -1 }}>
              {tab === "desc" ? "Description" : tab === "info" ? "Race Info" : "Reviews"}
            </button>
          ))}
        </div>

        {activeTab === "desc" && (
          <div className="text-sm text-slate-500 leading-relaxed max-w-3xl">
            <p className="mb-3">The {race.name} is one of the most prestigious events in the racing calendar, held at the world-renowned {race.venue}. With a prize pool of ${race.prizePool.toLocaleString()} and featuring the finest horses and jockeys, this race attracts competitors from across the globe.</p>
            <p>Track conditions are expected to be {race.condition}, providing excellent footing for the {race.distance}m sprint. Spectators can expect a thrilling display of speed, skill, and strategy as the top contenders battle for championship glory.</p>
          </div>
        )}

        {activeTab === "info" && (
          <div className="max-w-3xl">
            <div className="grid grid-cols-2 gap-3">
              {race.registrations.map((reg) => (
                <div key={String(reg.id)} className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: BRAND_LIGHT }}>🐎</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{reg.horseName}</p>
                      <p className="text-[11px] text-slate-400">{reg.horseColor} · {reg.horseAge} yrs</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <p><span className="font-medium text-slate-600">Jockey:</span> {reg.jockeyName}</p>
                    <p><span className="font-medium text-slate-600">Trainer:</span> {reg.trainerName}</p>
                    <p><span className="font-medium text-slate-600">License:</span> {reg.licenseNo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "review" && (
          <div className="max-w-3xl">
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
              <p className="text-sm font-bold text-slate-800 mb-3">Leave a Review</p>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="cursor-pointer bg-transparent border-none p-0.5 transition-colors">
                    <i className={`ti ti-star text-lg ${star <= (hoverRating || rating) ? "text-yellow-400" : "text-slate-300"}`}
                      style={{ fill: star <= (hoverRating || rating) ? "#facc15" : "none" }} />
                  </button>
                ))}
              </div>
              {!reviewSent ? (
                <form onSubmit={(e) => { e.preventDefault(); if (rating > 0) setReviewSent(true); }}>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input type="text" value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Your name"
                      className="px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans text-slate-800 focus:outline-none focus:ring-2"
                      style={{ borderColor: BORDER }} />
                    <input type="email" value={reviewEmail} onChange={(e) => setReviewEmail(e.target.value)} placeholder="your@email.com"
                      className="px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans text-slate-800 focus:outline-none focus:ring-2"
                      style={{ borderColor: BORDER }} />
                  </div>
                  <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Write your review..."
                    rows={3}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans text-slate-800 focus:outline-none focus:ring-2 resize-none mb-3"
                    style={{ borderColor: BORDER }} />
                  <button type="submit" disabled={rating === 0}
                    className="px-5 py-2.5 rounded-xl font-semibold text-white cursor-pointer border-none transition-all text-sm"
                    style={{ background: rating > 0 ? BRAND : "#9ca3af", cursor: rating > 0 ? "pointer" : "not-allowed" }}>
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="text-center py-3">
                  <i className="ti ti-circle-check text-2xl mb-2 block" style={{ color: BRAND_TEXT }} />
                  <p className="text-sm font-semibold text-slate-800">Thanks for your review!</p>
                </div>
              )}
            </div>
            {reviews.map((r, i) => (
              <div key={i} className="border-b border-slate-100 pb-4 mb-4 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: BRAND }}>{r.name[0]}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i key={s} className={`ti ti-star text-[12px] ${s <= r.rating ? "text-yellow-400" : "text-slate-300"}`}
                          style={{ fill: s <= r.rating ? "#facc15" : "none" }} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 ml-auto">{r.date}</span>
                </div>
                <p className="text-sm text-slate-500">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {relatedRaces.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Related Races</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedRaces.map((r) => (
              <div key={r.id} className="bg-white border border-slate-200 rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={onClose}>
                <div className="aspect-[4/3] rounded-lg flex items-center justify-center text-4xl mb-2" style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)" }}>🐎</div>
                <p className="text-xs text-slate-400">{r.venue}</p>
                <p className="text-sm font-bold text-slate-800 leading-tight">{r.name}</p>
                <p className="text-sm font-black mt-1" style={{ color: BRAND_TEXT }}>${(r.prizePool / 1000).toFixed(0)}K</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { login, user } = useApp();

  const [tab, setTab] = useState("home");
  const [signInOpen, setSignInOpen] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [openStat, setOpenStat] = useState(null);
  const [detailRace, setDetailRace] = useState(null);

  const [authTab, setAuthTab] = useState("signin");
  const [authMode, setAuthMode] = useState("form");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regError, setRegError] = useState("");
  const [signInId, setSignInId] = useState("");
  const [signInPw, setSignInPw] = useState("");
  const [signInError, setSignInError] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault(); setRegError("");
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) { setRegError("Please fill in all fields."); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) { setRegError("Please enter a valid email address."); return; }
    setSignInOpen(false); setRegName(""); setRegEmail(""); setRegPhone("");
  };

  const handleSignIn = (e) => {
    e.preventDefault(); setSignInError("");
    if (signInId === "U001" && signInPw === "admin123") {
      login("U001");
      setSignInOpen(false);
      setSignInId(""); setSignInPw("");
      navigate("/admin");
    } else if (signInId === "U002" && signInPw === "host123") {
      login("U002");
      setSignInOpen(false);
      navigate("/host");
    } else if (signInId === "U003" && signInPw === "jockey123") {
      login("U003");
      setSignInOpen(false);
      navigate("/jockey");
    } else if (signInId === "U006" && signInPw === "owner123") {
      login("U006");
      setSignInOpen(false);
      navigate("/owner");
    } else {
      setSignInError("Invalid ID or password.");
    }
  };

  if (detailRace) {
    return (
      <div className="min-h-screen" style={{ background: PAGE_BG, color: TEXT }}>
        <header className="bg-white border-b border-slate-200 flex items-center px-7" style={{ height: 64 }}>
          <div className="flex items-center gap-2.5 mr-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: BRAND }}><i className="ti ti-trophy text-lg" /></div>
            <div>
              <div className="text-sm font-black text-slate-800 tracking-wide">Racing TMS</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">GRAND PRIX 2025</div>
            </div>
          </div>
          <div className="flex-1" />
          <button type="button" onClick={() => setDetailRace(null)}
            className="px-4 py-2 rounded-lg text-sm font-semibold border cursor-pointer font-sans transition-all"
            style={{ background: BRAND, color: "#fff", borderColor: BRAND }}>
            <i className="ti ti-arrow-left text-sm mr-1.5" />Back
          </button>
        </header>
        <main style={{ background: PAGE_BG }}>
          <RaceDetail race={detailRace} onClose={() => setDetailRace(null)} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: PAGE_BG, color: TEXT }}>
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="max-w-7xl mx-auto px-7">
          <div className="flex items-center h-16 gap-6">
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: BRAND }}><i className="ti ti-trophy text-lg" /></div>
              <div>
                <div className="text-sm font-black text-slate-800 tracking-wide">Racing TMS</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">GRAND PRIX 2025</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-0.5">
              {([
                { id: "home", label: "Home", icon: "home" },
                { id: "shop", label: "Races", icon: "trophy" },
              ]).map((t) => (
                <button key={t.id} type="button" onClick={() => setTab(t.id)}
                  className="px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer font-sans transition-all"
                  style={{ background: tab === t.id ? BRAND : "transparent", color: tab === t.id ? "#fff" : TEXT_MUTED }}>
                  <i className={`ti ti-${t.icon} text-sm`} />{t.label}
                </button>
              ))}
            </nav>

            <div className="flex-1" />

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSignInOpen(true)}
                className="px-3.5 h-9 rounded-lg flex items-center gap-1.5 text-sm font-semibold cursor-pointer no-underline transition-colors hover:opacity-90"
                style={{ background: BRAND, color: "#fff" }}>
                <i className="ti ti-login text-sm" />
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* SIGN IN */}
      {signInOpen && (
        <div className="fixed inset-0 z-[9999]" onClick={() => setSignInOpen(false)}>
          <div className="absolute top-[80px] right-7 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-5 text-center border-b border-slate-100">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: BRAND_LIGHT, border: `2px solid ${BRAND_BORDER}` }}>
                <i className="ti ti-user text-2xl" style={{ color: BRAND }} />
              </div>
              <p className="text-sm font-semibold text-slate-800">Welcome!</p>
              <p className="text-xs text-slate-400 mt-0.5">Sign in to access your account</p>
            </div>
            <div className="flex border-b border-slate-100">
              <button type="button" onClick={() => { setAuthTab("signin"); setAuthMode("form"); setSignInError(""); }}
                className="flex-1 py-2.5 text-sm font-semibold transition-all cursor-pointer bg-transparent border-none"
                style={{ color: authTab === "signin" ? BRAND : TEXT_MUTED, borderBottom: authTab === "signin" ? `2px solid ${BRAND}` : "2px solid transparent" }}>Sign In</button>
              <button type="button" onClick={() => { setAuthTab("signup"); setRegError(""); }}
                className="flex-1 py-2.5 text-sm font-semibold transition-all cursor-pointer bg-transparent border-none"
                style={{ color: authTab === "signup" ? BRAND : TEXT_MUTED, borderBottom: authTab === "signup" ? `2px solid ${BRAND}` : "2px solid transparent" }}>Sign Up</button>
            </div>
            <div className="p-5">
              {authTab === "signin" && authMode === "form" && (
                <form onSubmit={handleSignIn}>
                  <div className="mb-3">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">User ID</label>
                    <input type="text" value={signInId} onChange={(e) => setSignInId(e.target.value)} placeholder="U001"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans text-slate-800 focus:outline-none focus:ring-2 transition-all" style={{ borderColor: BORDER }} />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Password</label>
                    <input type="password" value={signInPw} onChange={(e) => setSignInPw(e.target.value)} placeholder="Enter password"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans text-slate-800 focus:outline-none focus:ring-2 transition-all" style={{ borderColor: BORDER }} />
                  </div>
                  {signInError && <p className="text-xs text-red-500 mb-3">{signInError}</p>}
                  <button type="submit" className="w-full py-2.5 rounded-xl font-sans text-sm font-semibold text-white cursor-pointer border-none transition-all" style={{ background: BRAND }}>Sign In</button>
                  <button type="button" onClick={() => { setAuthMode("forgot"); setSignInError(""); }}
                    className="w-full mt-2 bg-transparent border-none font-sans text-xs text-slate-400 cursor-pointer hover:text-emerald-700 transition-all">Forgot password?</button>
                </form>
              )}
              {authTab === "signin" && authMode === "forgot" && !forgotSent && (
                <form onSubmit={(e) => { e.preventDefault(); setForgotSent(true); }}>
                  <p className="text-xs text-slate-500 mb-4">Enter your email and we'll send you a link to reset your password.</p>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Email</label>
                    <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans text-slate-800 focus:outline-none focus:ring-2 transition-all" style={{ borderColor: BORDER }} />
                  </div>
                  <button type="submit" className="w-full py-2.5 rounded-xl font-sans text-sm font-semibold text-white cursor-pointer border-none transition-all" style={{ background: BRAND }}>Send Reset Link</button>
                  <button type="button" onClick={() => { setAuthMode("form"); setForgotEmail(""); }}
                    className="w-full mt-2 bg-transparent border-none font-sans text-xs text-slate-400 cursor-pointer hover:text-emerald-700 transition-all">Back to Sign In</button>
                </form>
              )}
              {authTab === "signin" && authMode === "forgot" && forgotSent && (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: BRAND_LIGHT }}>
                    <i className="ti ti-mail text-xl" style={{ color: BRAND }} />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mb-1">Check your email</p>
                  <p className="text-xs text-slate-500 mb-4">We sent a password reset link to <span className="font-semibold text-slate-700">{forgotEmail}</span></p>
                  <button type="button" onClick={() => { setAuthMode("form"); setForgotSent(false); setForgotEmail(""); }}
                    className="px-4 py-2 rounded-xl font-sans text-sm font-semibold text-white cursor-pointer border-none transition-all" style={{ background: BRAND }}>Back to Sign In</button>
                </div>
              )}
              {authTab === "signup" && (
                <form onSubmit={handleSignUp}>
                  <div className="mb-3">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Full Name</label>
                    <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="John Doe"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans text-slate-800 focus:outline-none focus:ring-2 transition-all" style={{ borderColor: BORDER }} />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Email</label>
                    <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans text-slate-800 focus:outline-none focus:ring-2 transition-all" style={{ borderColor: BORDER }} />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Phone</label>
                    <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="+1 555 0000"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white font-sans text-slate-800 focus:outline-none focus:ring-2 transition-all" style={{ borderColor: BORDER }} />
                  </div>
                  {regError && <p className="text-xs text-red-500 mb-3">{regError}</p>}
                  <button type="submit" className="w-full py-2.5 rounded-xl font-sans text-sm font-semibold text-white cursor-pointer border-none transition-all" style={{ background: BRAND }}>Create Account</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-7 pb-12">
        {tab === "home" && (
          <>
            {/* HERO */}
            <div className="rounded-2xl p-9 mt-7 mb-8 text-white relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)" }}>
              <div className="absolute -top-10 -right-7 w-52 h-52 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.05)" }} />
              <div className="absolute -bottom-7 right-32 w-24 h-24 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.04)" }} />
              <div className="absolute top-5 right-16 w-14 h-14 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.03)" }} />
              <div className="absolute bottom-0 right-20 w-36 h-36 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.03)" }} />

              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-widest" style={{ background: "rgba(255,255,255,0.15)" }}>SEASON 2025</div>
                <div className="w-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.5)" }} />
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>Grand Prix Championship Series</div>
              </div>

              <h1 className="text-3xl font-black tracking-tight mb-2 leading-tight max-w-xl">
                Horse Racing Tournament<br />Management System
              </h1>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
                Manage registrations, track race results, and connect with the racing community.
              </p>

              <div className="flex gap-7">
                {([
                  { icon: "trophy", label: "Total Races", value: String(RACES_SEED.length), sub: "Across 5 venues" },
                  { icon: "coins", label: "Prize Pool", value: "$1.5M", sub: "Grand total" },
                  { icon: "calendar", label: "Season Start", value: "15 Apr", sub: "Spring Classic" },
                  { icon: "clock", label: "Reg. Deadline", value: "10 Apr", sub: "Register now" },
                ]).map(({ icon, label, value, sub }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <div className="text-[11px] flex items-center gap-1" style={{ color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                      <i className={`ti ti-${icon} text-[13px]`} />{label}
                    </div>
                    <div className="text-xl font-black leading-tight">{value}</div>
                    <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-3">
              <div className="flex">
                {([
                  { key: "races", icon: "trophy", label: "Total Races", value: String(RACES_SEED.length), color: "#92400e", bg: "#fef3c7", border: "#fde68a" },
                  { key: "prize", icon: "coins", label: "Prize Pool", value: "$1.5M", color: "#065f46", bg: BRAND_LIGHT, border: BRAND_BORDER },
                  { key: "registered", icon: "user", label: "Registered", value: String(RACES_SEED.flatMap((r) => r.registrations).length), color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe" },
                  { key: "horses", icon: "horse", label: "Active Horses", value: String(new Set(RACES_SEED.flatMap((r) => r.registrations).map((r) => r.horseName)).size), color: "#5b21b6", bg: "#f5f3ff", border: "#c4b5fd" },
                ]).map(({ key, icon, label, value, color, bg, border }, i) => {
                  const isOpen = openStat === key;
                  return (
                    <div key={key} className="flex items-center gap-3.5 px-2 flex-1" style={{ borderRight: i < 3 ? "1px solid #e5e7eb" : "none" }}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border" style={{ background: bg, borderColor: border }}>
                        <i className={`ti ti-${icon} text-xl`} style={{ color }} />
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl font-black text-slate-800 leading-tight">{value}</div>
                        <button type="button" onClick={() => setOpenStat(isOpen ? null : key)}
                          className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 cursor-pointer bg-transparent border-none font-sans hover:text-emerald-700 transition-colors p-0">
                          {label}
                          <i className={`ti ti-chevron-${isOpen ? "up" : "down"} text-[11px]`} style={{ color: TEXT_SUBTLE }} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {openStat && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  {openStat === "races" && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {RACES_SEED.map((r) => (
                        <button key={r.id} type="button" onClick={() => { setOpenStat(null); setDetailRace(r); }}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer bg-white text-left transition-all hover:border-emerald-300 hover:bg-emerald-50"
                          style={{ borderColor: BORDER }}>
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: BRAND_LIGHT, color: BRAND_TEXT }}>🐎</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-800 truncate">{r.name}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <GradeBadge grade={r.grade} />
                              <span>{r.venue}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {openStat === "prize" && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {RACES_SEED.map((r) => (
                        <div key={r.id} className="p-3 rounded-xl border" style={{ borderColor: BORDER, background: SURFACE }}>
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1 truncate">{r.name}</div>
                          <div className="text-lg font-black" style={{ color: BRAND_TEXT }}>${(r.prizePool / 1000).toFixed(0)}K</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{((r.prizePool / 1500000) * 100).toFixed(1)}% of total</div>
                          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: "#f3f4f6" }}>
                            <div className="h-full rounded-full" style={{ width: `${(r.prizePool / 750000) * 100}%`, background: BRAND }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {openStat === "registered" && (
                    <div>
                      {RACES_SEED.map((r) => (
                        <div key={r.id} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                          <i className="ti ti-flag text-sm flex-shrink-0" style={{ color: BRAND }} />
                          <span className="text-sm font-medium text-slate-700 flex-1 truncate">{r.name}</span>
                          <span className="text-sm font-black tabular-nums" style={{ color: BRAND_TEXT }}>{r.registrations.length}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {openStat === "horses" && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                      {Array.from(new Set(RACES_SEED.flatMap((r) => r.registrations).map((r) => r.horseName))).map((name) => {
                        const reg = RACES_SEED.flatMap((r) => r.registrations).find((r) => r.horseName === name);
                        return (
                          <div key={name} className="flex items-center gap-2.5 p-2 rounded-lg border" style={{ borderColor: BORDER }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: BRAND_LIGHT }}>🐎</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-slate-800 truncate">{name}</div>
                              <div className="text-[11px] text-slate-500 truncate">{reg?.jockeyName} · {reg?.horseColor}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Featured Races */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 m-0">Featured Races</h2>
                  <p className="text-xs text-slate-500 mt-1">Don't miss these top upcoming events</p>
                </div>
                <button type="button" onClick={() => setTab("shop")}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 cursor-pointer font-sans bg-transparent"
                  style={{ borderColor: BORDER, color: TEXT_MUTED }}>
                  View all <i className="ti ti-arrow-right text-[13px]" />
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {RACES_SEED.slice(0, 4).map((race) => (
                  <ProductCard key={race.id} race={race}
                    onViewDetail={() => setDetailRace(race)}
                  />
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-lg font-bold text-slate-800 m-0">Recent Activity</h2>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                {([
                  { icon: "circle-check", iconBg: BRAND_LIGHT, iconColor: BRAND_TEXT, iconBorder: BRAND_BORDER, actor: "Thunder Bolt", action: "registration approved", race: "Spring Classic", time: "2h ago" },
                  { icon: "clock", iconBg: "#fef9c3", iconColor: "#713f12", iconBorder: "#fde047", actor: "Silver Arrow", action: "registration pending", race: "Spring Classic", time: "4h ago" },
                  { icon: "user-check", iconBg: "#eff6ff", iconColor: "#1e40af", iconBorder: "#93c5fd", actor: "Golden Flash", action: "jockey assigned", race: "Derby Cup", time: "1d ago" },
                  { icon: "circle-check", iconBg: BRAND_LIGHT, iconColor: BRAND_TEXT, iconBorder: BRAND_BORDER, actor: "Phantom Rider", action: "registration approved", race: "Mid-Season Stakes", time: "2d ago" },
                ]).map((a, i, arr) => (
                  <div key={a.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border" style={{ background: a.iconBg, borderColor: a.iconBorder }}>
                      <i className={`ti ti-${a.icon} text-base`} style={{ color: a.iconColor }} />
                    </div>
                    <div className="flex-1 text-sm">
                      <span className="font-semibold">{a.actor}</span>
                      <span className="text-slate-500"> — {a.action} </span>
                      <span className="font-semibold" style={{ color: BRAND_TEXT }}>{a.race}</span>
                    </div>
                    <div className="text-[11px] flex-shrink-0" style={{ color: TEXT_SUBTLE }}>{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "shop" && (
          <div className="mt-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black text-slate-800 m-0">Our Shop</h1>
                <p className="text-sm text-slate-500 mt-1">{RACES_SEED.length} races available</p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {RACES_SEED.map((race) => (
                <ProductCard key={race.id} race={race}
                  onViewDetail={() => setDetailRace(race)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-5 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-xs text-slate-400">Racing TMS — Grand Prix Championship Series 2025</div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <a href="#" className="hover:text-emerald-700 transition-colors"><i className="ti ti-brand-facebook" /></a>
            <a href="#" className="hover:text-emerald-700 transition-colors"><i className="ti ti-brand-instagram" /></a>
            <a href="#" className="hover:text-emerald-700 transition-colors"><i className="ti ti-brand-youtube" /></a>
          </div>
        </div>
      </main>
    </div>
  );
}
