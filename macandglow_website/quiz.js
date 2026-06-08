// ── SKIN QUIZ ─────────────────────────────────
const quizSteps = [
  {
    q: 'What is your main skin concern?',
    opts: ['Dark spots & uneven tone', 'Dryness & dehydration', 'Oiliness & large pores', 'Anti-ageing & fine lines', 'Sensitivity & redness']
  },
  {
    q: 'How does your skin feel by midday?',
    opts: ['Very oily and shiny', 'Tight and dry', 'A mix — oily T-zone, dry cheeks', 'Normal and comfortable', 'Red or irritated']
  },
  {
    q: 'How old is your skin concern?',
    opts: ['Just started noticing it', 'A few months', 'Over a year', 'Always had it']
  }
];

const quizRecs = {
  0: [1, 7],  // brightness
  1: [2, 6],  // hydration
  2: [4, 6],  // oily
  3: [3, 5],  // ageing
  4: [6, 2],  // sensitive
};

let quizStep = 0;
let quizAnswers = [];

function showQuiz() {
  quizStep = 0;
  quizAnswers = [];
  document.getElementById('quizOverlay').style.display = 'flex';
  renderQuizStep();
}

function closeQuiz() {
  document.getElementById('quizOverlay').style.display = 'none';
}

function renderQuizStep() {
  const el = document.getElementById('quizContent');
  if (!el) return;

  if (quizStep >= quizSteps.length) {
    showQuizResults(el);
    return;
  }

  const step = quizSteps[quizStep];
  el.innerHTML = `
    <div class="quiz-progress">
      <div class="quiz-progress-bar" style="width:${((quizStep)/quizSteps.length)*100}%"></div>
    </div>
    <p class="quiz-step-label">Step ${quizStep + 1} of ${quizSteps.length}</p>
    <h3 class="quiz-q">${step.q}</h3>
    <div class="quiz-opts">
      ${step.opts.map((o, i) => `
        <button class="quiz-opt" onclick="answerQuiz(${i})">${o}</button>
      `).join('')}
    </div>
  `;
}

function answerQuiz(idx) {
  quizAnswers.push(idx);
  quizStep++;
  renderQuizStep();
}

function showQuizResults(el) {
  const firstAnswer = quizAnswers[0] || 0;
  const recIds = quizRecs[firstAnswer] || [1, 2];
  const recs = recIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

  el.innerHTML = `
    <div class="quiz-result">
      <div class="quiz-result-icon">✨</div>
      <h3>Your Personalised Routine</h3>
      <p>Based on your answers, we recommend these products for your skin:</p>
      <div class="quiz-recs">
        ${recs.map(p => `
          <div class="quiz-rec-card">
            <div class="qrc-img" style="background:${p.bg}">${p.icon}</div>
            <div class="qrc-info">
              <p class="qrc-name">${p.name}</p>
              <p class="qrc-desc">${p.desc}</p>
              <div class="qrc-footer">
                <span class="qrc-price">₹${p.price.toLocaleString()}</span>
                <button class="btn-primary" style="padding:0.4rem 1rem;font-size:0.75rem" onclick="addToCart('${p.name}',${p.price});closeQuiz()">Add to Cart</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="btn-ghost" onclick="closeQuiz()" style="margin-top:1rem">Continue Shopping →</button>
    </div>
  `;
}

// close on overlay click
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('quizOverlay');
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeQuiz();
    });
  }
});