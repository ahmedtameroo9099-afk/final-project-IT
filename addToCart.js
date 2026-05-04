const CART_KEY = 'elsafa-cart';
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const saveCart = c => localStorage.setItem(CART_KEY, JSON.stringify(c));

function addItem(name, size) {
    const cart = getCart();
    const found = cart.find(i => i.name === name && i.size === size);
    found ? found.qty++ : cart.push({ name, size, qty: 1 });
    saveCart(cart);
    updateBadge();
    showToast(`${name} (${size}) added!`);
}

function updateBadge() {
    const total = getCart().reduce((s, i) => s + i.qty, 0);
    badge.textContent = total;
    badge.style.display = total ? 'flex' : 'none';
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 2200);
}

function removeItem(idx) {
    const cart = getCart();
    cart.splice(idx, 1);
    saveCart(cart);
    updateBadge();
    renderPanel();
}

function renderPanel() {
    const cart = getCart();
    panel.innerHTML = cart.length
        ? cart.map((i, idx) => `
            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;font-size:.88rem">
                <span>${i.name} <em style="color:#999">(${i.size})</em></span>
                <span style="color:#e67e22;font-weight:700">x${i.qty}
                    <button onclick="removeItem(${idx})" style="background:none;border:none;color:#ccc;cursor:pointer;margin-left:6px">✕</button>
                </span>
            </div>`).join('') +
          `<button onclick="saveCart([]);updateBadge();renderPanel()" style="margin-top:10px;width:100%;padding:7px;background:#e74c3c;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer">Clear Cart</button>`
        : `<p style="color:#aaa;text-align:center;padding:10px">Cart is empty 🛒</p>`;
}


const style = document.createElement('style');
style.textContent = `
    .cart-btn{background:rgba(255,255,255,.18);color:#fff;border:2px solid rgba(255,255,255,.45);border-radius:6px;padding:6px 14px;font-size:.9rem;font-weight:700;cursor:pointer;transition:.2s;position:relative}
    .cart-btn:hover{background:rgba(255,255,255,.3);transform:translateY(-1px)}
    #cart-badge{position:absolute;top:-7px;right:-7px;background:#e74c3c;color:#fff;border-radius:50%;width:18px;height:18px;font-size:.65rem;font-weight:800;display:flex;align-items:center;justify-content:center}
    #cart-panel{display:none;position:absolute;top:calc(100% + 8px);right:0;background:#fff;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.18);min-width:260px;padding:14px;z-index:200}
    #cart-panel.open{display:block}
    #cart-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(10px);background:#2d2d2d;color:#fff;padding:9px 20px;border-radius:8px;font-size:.88rem;font-weight:600;opacity:0;pointer-events:none;transition:.3s;z-index:9999}
    #cart-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
`;
document.head.appendChild(style);

const wrap = document.createElement('div');
wrap.style.cssText = 'position:relative;display:inline-block';
wrap.innerHTML = `<button class="cart-btn">🛒 Cart <span id="cart-badge" style="display:none"></span></button><div id="cart-panel"></div>`;
document.querySelector('.t-wrap')
    ? document.querySelector('.t-wrap').before(wrap)
    : document.querySelector('.header')?.append(wrap);

const badge = document.getElementById('cart-badge');
const panel = document.getElementById('cart-panel');
const toast = Object.assign(document.createElement('div'), { id: 'cart-toast' });
document.body.appendChild(toast);

wrap.querySelector('.cart-btn').onclick = e => { e.stopPropagation(); panel.classList.toggle('open'); if (panel.classList.contains('open')) renderPanel(); };
document.addEventListener('click', () => panel.classList.remove('open'));

document.querySelectorAll('.arrow-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const h3 = btn.closest('.category-card')?.querySelector('.card-content h3');
        const [name, size] = h3?.innerText.trim().split('\n').map(s => s.trim()) || ['Item', 'standard'];
        addItem(name, size || 'standard');
    });
});

updateBadge();
