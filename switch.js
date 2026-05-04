const themes = { light: 'lightTheme.css', blue: 'blueTheme.css', dark: 'darkTheme.css' };
const KEY = 'elsafa-theme';

function setTheme(k) {
    document.getElementById('theme-stylesheet').href = themes[k] || themes.light;
    localStorage.setItem(KEY, k);
    document.querySelectorAll('.t-opt').forEach(b => b.classList.toggle('active', b.dataset.t === k));
}

function closeMenu() {
    document.getElementById('t-drop').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
    // inject styles
    const s = document.createElement('style');
    s.textContent = `.t-wrap{position:relative;display:inline-block}.t-btn{background:rgba(255,255,255,.18);color:#fff;border:2px solid rgba(255,255,255,.45);border-radius:6px;padding:6px 14px;font-size:.9rem;font-weight:700;cursor:pointer;transition:.2s}.t-btn:hover{background:rgba(255,255,255,.3);transform:translateY(-1px)}.t-drop{display:none;position:absolute;top:calc(100% + 8px);right:0;background:#fff;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.18);overflow:hidden;min-width:160px;z-index:200}.t-drop.open{display:block}.t-opt{display:block;width:100%;padding:11px 18px;background:none;border:none;text-align:left;font-size:.93rem;font-weight:600;color:#333;cursor:pointer;transition:background .15s}.t-opt:hover{background:#f0f0f0}.t-opt.active{background:#e8f0fe;color:#0a4378}`;
    document.head.appendChild(s);

    // build picker
    const wrap = document.createElement('div');
    wrap.className = 't-wrap';
    wrap.innerHTML = `<button class="t-btn" id="t-btn" aria-label="Theme">🎨 Theme</button><div class="t-drop" id="t-drop" role="menu">${Object.keys(themes).map(k => `<button class="t-opt" data-t="${k}" role="menuitem">${k[0].toUpperCase()+k.slice(1)}</button>`).join('')}</div>`;
    document.querySelector('.header')?.insertBefore(wrap, document.getElementById('response'));

    wrap.querySelector('#t-btn').onclick = e => { e.stopPropagation(); document.getElementById('t-drop').classList.toggle('open'); };
    wrap.querySelectorAll('.t-opt').forEach(b => b.onclick = () => { setTheme(b.dataset.t); closeMenu(); });
    document.addEventListener('click', closeMenu);

    // nav toggle
    const nav = document.getElementById('topNav');
    document.getElementById('response')?.addEventListener('click', () => nav?.classList.toggle('open'));

    setTheme(localStorage.getItem(KEY) || 'light');
});
