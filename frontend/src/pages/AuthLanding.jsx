import React, { useState } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import StrengthMeter from '../components/StrengthMeter';

export default function AuthLanding({ setUser }) {
  const [mode, setMode] = useState('login');
  const navigate = useNavigate();

  const [loginEmail,  setLoginEmail]  = useState('');
  const [loginPwd,    setLoginPwd]    = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail,    setRegEmail]    = useState('');
  const [regPwd,      setRegPwd]      = useState('');
  const [regConfirm,  setRegConfirm]  = useState('');
  const [err,         setErr]         = useState('');
  const [loading,     setLoading]     = useState(false);

  const isLogin = mode === 'login';
  function switchMode(m) { setMode(m); setErr(''); }

  async function handleLogin(e) {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      const user = await api('/auth/login', { method: 'POST', body: { email: loginEmail, password: loginPwd } });
      setUser(user); navigate('/vault');
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (regPwd !== regConfirm) { setErr('Passwords do not match'); return; }
    setErr(''); setLoading(true);
    try {
      const user = await api('/auth/register', { method: 'POST', body: { username: regUsername, email: regEmail, password: regPwd } });
      setUser(user); navigate('/vault');
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="kk-wrap">

        {/* ── Left: Illustration panel ── */}
        <div className="kk-left">
          <VaultBg />

          {/* Centered content column */}
          <div className="kk-left-inner">

            {/* Logo */}
            <div className="kk-logo">
              <KeypKeyIcon size={52} />
              <div className="kk-logo-name">
                Kepp<span>Key</span>
              </div>
            </div>

            {/* Tagline */}
            <div className="kk-tagline">
              Your passwords, secured with<br />military-grade encryption.
            </div>

            {/* Feature list */}
            <div className="kk-feats">
              {FEATURES.map(f => (
                <div key={f} className="kk-feat">
                  <div className="kk-feat-icon"><div className="kk-check" /></div>
                  {f}
                </div>
              ))}
            </div>

            {/* Bottom badge */}
            <div className="kk-badge">
              <LockIcon />
              AES-256 · Zero-knowledge · End-to-end encrypted
            </div>
          </div>
        </div>

        {/* ── Right: Auth form ── */}
        <div className="kk-right">
          <div className="kk-form-wrap">

            {/* Tab switcher */}
            <div className="kk-tabs">
              <button className={`kk-tab ${isLogin ? 'on' : 'off'}`} onClick={() => switchMode('login')}>
                Sign in
              </button>
              <button className={`kk-tab ${!isLogin ? 'on' : 'off'}`} onClick={() => switchMode('register')}>
                Create account
              </button>
            </div>

            {err && <div className="kk-alert">{err}</div>}

            {isLogin ? (
              <>
                <div className="kk-form-title">Welcome back</div>
                <div className="kk-form-sub">Sign in to access your encrypted vault.</div>
                <form onSubmit={handleLogin}>
                  <div className="kk-lbl">Email address</div>
                  <input className="kk-inp" type="email" value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="you@example.com" required autoFocus />
                  <div className="kk-lbl">Master password</div>
                  <input className="kk-inp" type="password" value={loginPwd}
                    onChange={e => setLoginPwd(e.target.value)}
                    placeholder="Your master password" required />
                  <button className="kk-btn" disabled={loading}>
                    {loading ? 'Unlocking…' : 'Unlock vault →'}
                  </button>
                </form>
                <div className="kk-divider">or</div>
                <div className="kk-foot">
                  Don't have an account?{' '}
                  <button onClick={() => switchMode('register')}>Create one free</button>
                </div>
              </>
            ) : (
              <>
                <div className="kk-form-title">Create your vault</div>
                <div className="kk-form-sub">Set up once, secured forever.</div>
                <form onSubmit={handleRegister}>
                  <div className="kk-lbl">Email address</div>
                  <input className="kk-inp" type="email" value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="you@example.com" required autoFocus />
                  <div className="kk-lbl">Username</div>
                  <input className="kk-inp" value={regUsername}
                    onChange={e => setRegUsername(e.target.value)}
                    placeholder="Choose a username" required />
                  <div className="kk-lbl">Master password</div>
                  <input className="kk-inp" type="password" value={regPwd}
                    onChange={e => setRegPwd(e.target.value)}
                    placeholder="Choose a strong password" required />
                  <StrengthMeter value={regPwd} />
                  <div className="kk-lbl">Confirm password</div>
                  <input className="kk-inp" type="password" value={regConfirm}
                    onChange={e => setRegConfirm(e.target.value)}
                    placeholder="Re-enter your password" required />
                  <button className="kk-btn" disabled={loading}>
                    {loading ? 'Creating vault…' : 'Create account →'}
                  </button>
                </form>
                <div className="kk-foot" style={{ marginTop: '.9rem' }}>
                  Already have an account?{' '}
                  <button onClick={() => switchMode('login')}>Sign in</button>
                </div>
              </>
            )}

            <div className="kk-sec">
              <strong>AES-256</strong> encrypted &nbsp;·&nbsp;
              <strong>Zero-knowledge</strong> &nbsp;·&nbsp;
              Never stored in plain text
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── KeypKey Logo Icon ─────────────────────────────── */
function KeypKeyIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="rgba(255,255,255,0.18)" />
      <rect width="48" height="48" rx="12" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
      {/* Key bow */}
      <circle cx="19" cy="20" r="8" fill="none" stroke="white" strokeWidth="2.5" />
      <circle cx="19" cy="20" r="3.5" fill="white" />
      {/* Key blade */}
      <line x1="25" y1="24" x2="38" y2="34" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      {/* Key teeth */}
      <line x1="32" y1="29.5" x2="34.5" y2="27" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="32.5" x2="38.5" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Small lock icon for badge ─────────────────────── */
function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: 5, opacity: 0.7 }}>
      <rect x="1.5" y="5.5" width="9" height="6" rx="1.5" stroke="#A5F3FC" strokeWidth="1.2" />
      <path d="M3.5 5.5V3.5a2.5 2.5 0 015 0v2" stroke="#A5F3FC" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Decorative SVG background ─────────────────────── */
function VaultBg() {
  const bolts = [0, 60, 120, 180, 240, 300].map(a => {
    const r = (a * Math.PI) / 180;
    return { cx: Math.round(113 * Math.cos(r)), cy: Math.round(113 * Math.sin(r)) };
  });
  return (
    <svg viewBox="0 0 500 700" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <rect width="500" height="700" fill="#0E7490" />
      <pattern id="kkdots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.2" fill="rgba(255,255,255,0.09)" />
      </pattern>
      <rect width="500" height="700" fill="url(#kkdots)" />
      <circle cx="440" cy="70" r="210" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="50" />
      <circle cx="440" cy="70" r="120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="28" />
      <g transform="translate(250,380)">
        <circle r="158" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        <circle r="128" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle r="96" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <circle r="56" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <circle r="18" fill="rgba(255,255,255,0.15)" />
        {[0, 90, 180, 270].map(a => {
          const r2 = (a * Math.PI) / 180;
          return <line key={a}
            x1={Math.round(56 * Math.cos(r2))} y1={Math.round(56 * Math.sin(r2))}
            x2={Math.round(128 * Math.cos(r2))} y2={Math.round(128 * Math.sin(r2))}
            stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />;
        })}
        {[45, 135, 225, 315].map(a => {
          const r2 = (a * Math.PI) / 180;
          return <line key={a}
            x1={Math.round(56 * Math.cos(r2))} y1={Math.round(56 * Math.sin(r2))}
            x2={Math.round(128 * Math.cos(r2))} y2={Math.round(128 * Math.sin(r2))}
            stroke="rgba(255,255,255,0.09)" strokeWidth="1" />;
        })}
        {bolts.map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r="7"
            fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        ))}
        <rect x="-27" y="-11" width="54" height="22" rx="11"
          fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      </g>
      {/* <rect x="0" y="580" width="500" height="120" fill="rgba(10,28,85,0.4)" /> */}
    </svg>
  );
}

const FEATURES = [
  'Zero-knowledge architecture',
  'AES-256 encryption at rest',
  'Password strength analysis',
  'Reuse & breach detection',
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Tilt+Neon&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
.kk-wrap{display:grid;grid-template-columns:1fr 1fr;min-height:100vh}
.kk-left{background:#0E7490;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:3rem 2.6rem}
.kk-left-inner{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;text-align:center;gap:0;width:100%;max-width:300px}
.kk-logo{display:flex;align-items:center;gap:.75rem;margin-bottom:2rem}
.kk-logo-name{font-family:'Tilt Neon',sans-serif;font-size:1.6rem;font-weight:700;color:#fff;letter-spacing:.01em}
.kk-logo-name span{color:#A5F3FC}
.kk-tagline{font-family:'Inter',sans-serif;font-size:.95rem;line-height:1.7;color:#A5F3FC;margin-bottom:2rem;max-width:240px}
.kk-feats{display:flex;flex-direction:column;gap:.65rem;width:100%;margin-bottom:2rem}
.kk-feat{display:flex;align-items:center;gap:.7rem;font-size:13px;color:#CFFAFE;font-family:'Inter',sans-serif;text-align:left}
.kk-feat-icon{width:20px;height:20px;border-radius:6px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.kk-check{width:9px;height:9px;border-right:2px solid #fff;border-bottom:2px solid #fff;transform:rotate(45deg) translate(-1px,-2px)}
.kk-badge{display:inline-flex;align-items:center;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:.4rem .9rem;font-size:11px;color:#A5F3FC;font-family:'Inter',sans-serif;letter-spacing:.04em}
.kk-right{background:#fff;display:flex;align-items:center;justify-content:center;padding:2rem 1.8rem}
.kk-form-wrap{width:min(360px,100%)}
.kk-tabs{display:flex;background:#ECFEFF;border-radius:10px;padding:4px;margin-bottom:1.6rem;gap:4px}
.kk-tab{flex:1;padding:.55rem .8rem;border:none;cursor:pointer;font-size:12.5px;font-weight:600;font-family:'Inter',sans-serif;border-radius:7px;transition:all 160ms;letter-spacing:.02em}
.kk-tab.on{background:#0891B2;color:#fff}
.kk-tab.off{background:transparent;color:#64748B}
.kk-tab.off:hover{background:#CFFAFE;color:#0E7490}
.kk-alert{padding:.6rem .85rem;border-radius:8px;margin-bottom:.8rem;font-size:13px;background:#FEF2F2;color:#991B1B;border-left:3px solid #EF4444;font-family:'Inter',sans-serif}
.kk-form-title{font-family:'Tilt Neon',sans-serif;font-size:1.5rem;font-weight:700;color:#0F172A;margin-bottom:.3rem}
.kk-form-sub{font-size:13px;color:#64748B;line-height:1.5;margin-bottom:1.1rem;font-family:'Inter',sans-serif}
.kk-lbl{font-size:11px;font-weight:600;letter-spacing:.1em;color:#475569;text-transform:uppercase;margin:.85rem 0 .28rem;font-family:'Inter',sans-serif}
.kk-inp{width:100%;padding:.65rem .9rem;border:1.5px solid #CFFAFE;border-radius:8px;font-family:'JetBrains Mono',monospace;font-size:13px;color:#0F172A;background:#fff;outline:none;transition:border-color 140ms,box-shadow 140ms}
.kk-inp:focus{border-color:#0891B2;box-shadow:0 0 0 3px rgba(59,130,246,.1)}
.kk-inp::placeholder{color:#94A3B8}
.kk-btn{width:100%;margin-top:1rem;padding:.78rem 1rem;border:none;border-radius:9px;background:#0891B2;color:#fff;font-family:'Inter',sans-serif;font-size:13.5px;font-weight:600;cursor:pointer;letter-spacing:.03em;transition:background 140ms}
.kk-btn:hover{background:#0E7490}
.kk-btn:disabled{opacity:.6;cursor:not-allowed}
.kk-divider{display:flex;align-items:center;gap:.7rem;margin:1rem 0 .4rem;color:#94A3B8;font-size:11.5px;font-family:'Inter',sans-serif}
.kk-divider::before,.kk-divider::after{content:'';flex:1;height:1px;background:#CFFAFE}
.kk-foot{text-align:center;font-size:12.5px;color:#64748B;font-family:'Inter',sans-serif}
.kk-foot button{background:none;border:none;cursor:pointer;font-weight:600;font-size:12.5px;color:#0891B2;font-family:'Inter',sans-serif;padding:0}
.kk-foot button:hover{text-decoration:underline}
.kk-sec{margin-top:1rem;text-align:center;font-size:11px;color:#94A3B8;border-top:1px solid #ECFEFF;padding-top:.9rem;line-height:1.7;font-family:'Inter',sans-serif}
.kk-sec strong{color:#22D3EE;font-weight:500}
@media(max-width:720px){
  .kk-wrap{grid-template-columns:1fr}
  .kk-left{min-height:240px;padding:2rem}
}
`;
