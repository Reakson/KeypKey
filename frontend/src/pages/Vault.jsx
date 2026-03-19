import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

function firstLetter(s) { return (s?.trim()?.[0] || '?').toUpperCase(); }

function badgeOf(pwd) {
  if (!pwd) return null;
  let s = 0;
  if (pwd.length >= 8) s++;
  if (pwd.length >= 12) s++;
  const sets = [/[a-z]/.test(pwd), /[A-Z]/.test(pwd), /\d/.test(pwd), /[^A-Za-z0-9]/.test(pwd)].filter(Boolean).length;
  if (sets >= 2) s++;
  if (sets >= 3) s++;
  return ['WEAK', 'WEAK', 'MEDIUM', 'STRONG', 'STRONG'][s];
}

function strengthClass(badge) {
  if (badge === 'STRONG') return 'strong';
  if (badge === 'MEDIUM') return 'medium';
  if (badge === 'WEAK')   return 'weak';
  return '';
}

export default function Vault({ setItemsForStats }) {
  const [items,   setItems]   = useState([]);
  const [query,   setQuery]   = useState('');
  const [copied,  setCopied]  = useState(null);   // id of recently copied item
  const [visible, setVisible] = useState({});      // { [id]: true } when password visible

  async function load() {
    const data = await api('/vault');
    setItems(data);
    setItemsForStats?.(data);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(it =>
      it.website?.toLowerCase().includes(q) ||
      it.username?.toLowerCase().includes(q)
    );
  }, [items, query]);

  /* Reveal password from API then mark visible */
  async function reveal(id, idx) {
    try {
      const data = await api(`/vault/${id}/reveal`);
      const copy = [...items];
      copy[idx].revealed = data.password;
      setItems(copy);
      setItemsForStats?.(copy);
      setVisible(v => ({ ...v, [id]: true }));
    } catch { alert('Failed to reveal password'); }
  }

  /* Toggle visibility (password already fetched) */
  function toggleVisible(id) {
    setVisible(v => ({ ...v, [id]: !v[id] }));
  }

  /* Copy to clipboard */
  async function copyPassword(text, id) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    } catch { alert('Copy failed — please copy manually'); }
  }

  /* Delete entry */
  async function del(id) {
    if (!confirm('Delete this entry? This cannot be undone.')) return;
    await api(`/vault/${id}`, { method: 'DELETE' });
    const copy = items.filter(x => x.id !== id);
    setItems(copy);
    setItemsForStats?.(copy);
    setVisible(v => { const n = { ...v }; delete n[id]; return n; });
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Vault</h1>
        <span className="page-subtitle">AES-256 Encrypted</span>
      </div>

      <div className="search">
        <input
          placeholder="Search by website or username…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card empty">
          {query
            ? `No results for "${query}"`
            : 'Your vault is empty. Add your first password to get started.'}
        </div>
      ) : (
        <div className="list">
          {filtered.map((it, i) => {
            const badge   = it.revealed ? badgeOf(it.revealed) : null;
            const isShown = visible[it.id] && it.revealed;
            const wasCopied = copied === it.id;

            return (
              <div className={`item ${badge ? strengthClass(badge) : ''}`} key={it.id}>

                {/* Avatar */}
                <div className="avatar">{firstLetter(it.website)}</div>

                {/* Meta */}
                <div className="item-meta">
                  <div className="item-title">
                    {it.website}
                    {badge && <span className={`badge ${badge}`}>{badge}</span>}
                  </div>
                  <div className="item-sub">
                    {it.username}
                    {isShown && it.revealed && (
                      <span className="item-password" style={{ marginLeft: '.75rem' }}>
                        · <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--teal-d)' }}>
                            {it.revealed}
                          </code>
                      </span>
                    )}
                    {!isShown && (
                      <span style={{ marginLeft: '.75rem', color: 'var(--muted-2)' }}>· ••••••••</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="actions">
                  {/* Reveal / Hide toggle */}
                  {!it.revealed ? (
                    <button className="btn-small" onClick={() => reveal(it.id, i)}>
                      Reveal
                    </button>
                  ) : (
                    <button
                      className={`btn-small ${isShown ? 'active' : ''}`}
                      onClick={() => toggleVisible(it.id)}
                    >
                      {isShown ? 'Hide' : 'Show'}
                    </button>
                  )}

                  {/* Copy — only shown after reveal */}
                  {it.revealed && (
                    <button
                      className={`btn-small ${wasCopied ? 'copied' : ''}`}
                      onClick={() => copyPassword(it.revealed, it.id)}
                    >
                      {wasCopied ? '✓ Copied' : 'Copy'}
                    </button>
                  )}

                  {/* Delete */}
                  <button className="btn-small danger" onClick={() => del(it.id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
