// ── MAC & GLOW CHAT ASSISTANT ──────────────────
(function() {
  // Inject CSS
  var style = document.createElement('style');
  style.textContent = `
    .mg-chat-bubble {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      width: 52px; height: 52px; background: var(--rose, #C4856A);
      border-radius: 50%; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem; box-shadow: 0 4px 20px rgba(196,133,106,0.5);
      transition: transform 0.2s, box-shadow 0.2s;
      animation: mg-pulse 2.5s infinite;
    }
    .mg-chat-bubble:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(196,133,106,0.6); }
    @keyframes mg-pulse { 0%,100%{box-shadow:0 4px 20px rgba(196,133,106,0.5)} 50%{box-shadow:0 4px 30px rgba(196,133,106,0.8)} }
    .mg-chat-window {
      position: fixed; bottom: 90px; right: 24px; z-index: 9998;
      width: 340px; max-height: 480px; background: #fff;
      border-radius: 16px; box-shadow: 0 8px 40px rgba(44,32,24,0.18);
      display: flex; flex-direction: column; overflow: hidden;
      transform: scale(0.85) translateY(20px); opacity: 0;
      pointer-events: none; transition: all 0.25s cubic-bezier(.4,0,.2,1);
    }
    .mg-chat-window.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: auto; }
    .mg-chat-header {
      background: linear-gradient(135deg, #3B2F2A, #C4856A);
      padding: 14px 16px; display: flex; align-items: center; gap: 10px;
    }
    .mg-chat-header-icon { font-size: 1.4rem; }
    .mg-chat-header h4 { color: #fff; font-size: 0.92rem; font-weight: 600; margin: 0; font-family: sans-serif; }
    .mg-chat-header p { color: rgba(255,255,255,0.7); font-size: 0.72rem; margin: 0; font-family: sans-serif; }
    .mg-chat-close { margin-left: auto; background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer; font-size: 1rem; }
    .mg-messages {
      flex: 1; overflow-y: auto; padding: 14px; display: flex;
      flex-direction: column; gap: 10px; background: #faf7f2;
    }
    .mg-msg { display: flex; gap: 8px; align-items: flex-end; }
    .mg-msg.user { flex-direction: row-reverse; }
    .mg-msg-avatar { width: 28px; height: 28px; border-radius: 50%; background: #E8D5C4; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; flex-shrink: 0; }
    .mg-msg-bubble {
      max-width: 78%; padding: 9px 13px; border-radius: 14px;
      font-size: 0.82rem; line-height: 1.5; font-family: sans-serif;
    }
    .mg-msg.bot .mg-msg-bubble { background: #fff; color: #2C2018; border: 1px solid #e8d5c4; border-bottom-left-radius: 4px; }
    .mg-msg.user .mg-msg-bubble { background: #C4856A; color: #fff; border-bottom-right-radius: 4px; }
    .mg-quick-btns { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 14px 10px; background: #faf7f2; }
    .mg-quick-btn {
      padding: 5px 12px; border: 1px solid #C4856A; background: none;
      border-radius: 100px; font-size: 0.72rem; color: #C4856A; cursor: pointer;
      font-family: sans-serif; transition: all 0.2s;
    }
    .mg-quick-btn:hover { background: #C4856A; color: #fff; }
    .mg-input-row { display: flex; gap: 0; border-top: 1px solid #e8d5c4; background: #fff; }
    .mg-input-row input {
      flex: 1; border: none; padding: 12px 14px; font-size: 0.85rem;
      font-family: sans-serif; outline: none; background: none; color: #2C2018;
    }
    .mg-send-btn {
      width: 44px; background: none; border: none; cursor: pointer;
      color: #C4856A; font-size: 1.1rem; display: flex; align-items: center; justify-content: center;
    }
    .mg-typing { display: flex; gap: 4px; align-items: center; padding: 10px 14px; }
    .mg-dot { width: 7px; height: 7px; border-radius: 50%; background: #C4856A; animation: mg-bounce 1.2s infinite; }
    .mg-dot:nth-child(2) { animation-delay: 0.2s; }
    .mg-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes mg-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
    @media(max-width:400px){ .mg-chat-window{width:calc(100vw - 20px);right:10px;} }
  `;
  document.head.appendChild(style);

  // Inject HTML
  var html = `
    <button class="mg-chat-bubble" id="mgChatBubble" onclick="mgToggleChat()" aria-label="Chat with us">💬</button>
    <div class="mg-chat-window" id="mgChatWindow">
      <div class="mg-chat-header">
        <div class="mg-chat-header-icon">✨</div>
        <div><h4>Mac & Glow Assistant</h4><p>Usually replies instantly</p></div>
        <button class="mg-chat-close" onclick="mgToggleChat()">✕</button>
      </div>
      <div class="mg-messages" id="mgMessages"></div>
      <div class="mg-quick-btns" id="mgQuickBtns"></div>
      <div class="mg-input-row">
        <input type="text" id="mgInput" placeholder="Ask about skincare, products…" onkeydown="if(event.key==='Enter')mgSend()">
        <button class="mg-send-btn" onclick="mgSend()">➤</button>
      </div>
    </div>
  `;
  var wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  // Bot knowledge base
  var QA = [
    { keys:['hello','hi','hey','namaste'], answer:'Namaste! 🌸 Welcome to Mac & Glow. I\'m your skincare assistant. Ask me about our products, ingredients, routines, or your order!' },
    { keys:['serum','glow serum','vitamin c'], answer:'Our ✨ <b>Glow Serum C+N</b> (₹2,499) combines 15% Vitamin C + 5% Niacinamide to brighten skin in 14 days. <a href="product.html?id=1" style="color:#C4856A">View product →</a>' },
    { keys:['moisturiser','moisturizer','hydra cream','hydration'], answer:'💧 <b>Deep Hydra Cream</b> (₹1,899) gives 72-hour moisture with Hyaluronic Acid + Ceramides. Perfect for dry and normal skin. <a href="product.html?id=2" style="color:#C4856A">View →</a>' },
    { keys:['night','elixir','bakuchiol','anti age','antiage','anti-age'], answer:'🌙 <b>Night Repair Elixir</b> (₹3,199) uses plant-based bakuchiol to firm skin and fade lines overnight — no irritation! <a href="product.html?id=3" style="color:#C4856A">View →</a>' },
    { keys:['cleanser','clean','wash','pore'], answer:'🫧 <b>Clear Pore Cleanser</b> (₹1,199) uses 1% Salicylic Acid to deep clean pores without stripping. Great for oily skin. <a href="product.html?id=4" style="color:#C4856A">View →</a>' },
    { keys:['spf','sunscreen','sun','uv'], answer:'🌤️ <b>Silk Shield SPF 50</b> (₹1,599) — no white cast, no greasiness. Works as a primer too! <a href="product.html?id=7" style="color:#C4856A">View →</a>' },
    { keys:['kit','set','gift','combo','bundle'], answer:'🎁 Our <b>Glow Starter Kit</b> (₹4,999) has Cleanser + Serum + Moisturiser — save 26% vs buying separately! <a href="product.html?id=8" style="color:#C4856A">View →</a>' },
    { keys:['routine','morning','evening','night routine'], answer:'🌅 For Morning: Cleanse → Tone → Serum → Moisturise → SPF<br>🌙 For Evening: Double Cleanse → Tone → Elixir → Eye Serum → Moisturise<br><a href="routines.html" style="color:#C4856A">Full routine guide →</a>' },
    { keys:['shipping','delivery','dispatch'], answer:'🚚 Free shipping on orders above ₹699! Standard delivery takes 3–5 business days across India.' },
    { keys:['return','refund','exchange'], answer:'↩️ We offer easy 30-day returns. Contact us at hello@macandglow.in or call +91 98765 43210 to initiate a return.' },
    { keys:['payment','pay','upi','cod','card'], answer:'💳 We accept UPI (GPay, PhonePe, Paytm), Credit/Debit cards, Net Banking, mobile wallets, and Cash on Delivery.' },
    { keys:['track','order','status'], answer:'📦 Track your order from your <a href="my-account.html?tab=orders" style="color:#C4856A">My Account → Orders</a> section or visit <a href="track-order.html" style="color:#C4856A">Track Order</a>.' },
    { keys:['oily','oily skin','acne','pimple'], answer:'For oily/acne-prone skin, we recommend: Clear Pore Cleanser + Glow Toner Mist + Glow Serum C+N + Silk Shield SPF 50.' },
    { keys:['dry','dry skin'], answer:'For dry skin: Clear Pore Cleanser + Deep Hydra Cream + Night Repair Elixir. The Barrier Repair Balm is also ❤️ loved by dry skin types!' },
    { keys:['sensitive','sensitive skin'], answer:'For sensitive skin, start with Deep Hydra Cream and Night Repair Elixir (bakuchiol is gentle!). Avoid heavy actives initially.' },
    { keys:['dark spot','dark spots','pigment','uneven'], answer:'For dark spots, our ✨ Glow Serum C+N with Vitamin C + Niacinamide is your best bet. Use with SPF every morning!' },
    { keys:['ingredient','niacinamide','hyaluronic','ceramide'], answer:'🔬 Learn about all our hero ingredients on the <a href="ingredients.html" style="color:#C4856A">Ingredients page →</a>' },
    { keys:['contact','email','call','phone','help'], answer:'📞 Call us: +91 98765 43210<br>📧 Email: hello@macandglow.in<br>Or fill the <a href="contact.html" style="color:#C4856A">contact form →</a>' },
    { keys:['price','cost','how much'], answer:'Our products range from ₹799 (Eye Patches) to ₹7,499 (Complete Set). All products are on our <a href="shop.html" style="color:#C4856A">Shop page →</a>' },
    { keys:['login','account','sign up','register'], answer:'👤 Create your account or log in at <a href="login.html" style="color:#C4856A">login.html</a> to track orders, save addresses, and manage your wishlist.' },
  ];

  var quickReplies = ['🛍️ Shop Products','🌙 Night Routine','☀️ Morning Routine','🚚 Shipping Info','📦 Track Order','💳 Payment Options'];

  window.mgChatOpen = false;
  window.mgConversation = [];

  function mgRenderQuick() {
    var el = document.getElementById('mgQuickBtns');
    if (!el) return;
    el.innerHTML = quickReplies.map(function(q) {
      return '<button class="mg-quick-btn" onclick="mgSendText(\'' + q.replace(/'/g,"\\'") + '\')">' + q + '</button>';
    }).join('');
  }

  function mgAddMsg(text, isUser) {
    var msgs = document.getElementById('mgMessages');
    if (!msgs) return;
    var div = document.createElement('div');
    div.className = 'mg-msg ' + (isUser ? 'user' : 'bot');
    div.innerHTML = '<div class="mg-msg-avatar">' + (isUser ? '👤' : '✨') + '</div>' +
      '<div class="mg-msg-bubble">' + text + '</div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function mgShowTyping() {
    var msgs = document.getElementById('mgMessages');
    if (!msgs) return;
    var div = document.createElement('div');
    div.className = 'mg-msg bot'; div.id = 'mgTyping';
    div.innerHTML = '<div class="mg-msg-avatar">✨</div><div class="mg-msg-bubble mg-typing"><div class="mg-dot"></div><div class="mg-dot"></div><div class="mg-dot"></div></div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function mgRemoveTyping() {
    var t = document.getElementById('mgTyping');
    if (t) t.remove();
  }

  function mgGetReply(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < QA.length; i++) {
      for (var j = 0; j < QA[i].keys.length; j++) {
        if (lower.includes(QA[i].keys[j])) return QA[i].answer;
      }
    }
    return 'I\'m not sure about that, but I\'d love to help! 🌸 Try asking about our <a href="shop.html" style="color:#C4856A">products</a>, ingredients, routines, or <a href="contact.html" style="color:#C4856A">contact our team →</a>';
  }

  window.mgSendText = function(text) {
    mgAddMsg(text, true);
    mgShowTyping();
    setTimeout(function() { mgRemoveTyping(); mgAddMsg(mgGetReply(text), false); }, 700);
  };

  window.mgSend = function() {
    var input = document.getElementById('mgInput');
    if (!input || !input.value.trim()) return;
    var text = input.value.trim(); input.value = '';
    window.mgSendText(text);
  };

  window.mgToggleChat = function() {
    var win = document.getElementById('mgChatWindow');
    var bubble = document.getElementById('mgChatBubble');
    if (!win) return;
    window.mgChatOpen = !window.mgChatOpen;
    win.classList.toggle('open', window.mgChatOpen);
    bubble.textContent = window.mgChatOpen ? '✕' : '💬';
    if (window.mgChatOpen && document.getElementById('mgMessages').children.length === 0) {
      setTimeout(function() {
        mgAddMsg('Namaste! 👋 Welcome to <b>Mac & Glow</b>! I\'m your skincare assistant. How can I help you today?', false);
        mgRenderQuick();
      }, 300);
    }
  };
})();
