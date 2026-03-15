/* ═══════════════════════════════════════════════════════════════
   ZAGRO — Dashboard JS
   Handles: navigation, form, charts, insights, coach
═══════════════════════════════════════════════════════════════ */

'use strict';

// ── State ────────────────────────────────────────────────────────
let habits = [];
let sportValue = false;
let currentPeriod = 7;
let obGoal = null;
let obLevel = null;
let obFreq = null;
let userProfile = null;

// Scale labels (1–10, no emoji)
const MOOD_EMOJIS = ['1','2','3','4','5','6','7','8','9','10'];
const PROD_EMOJIS = ['1','2','3','4','5','6','7','8','9','10'];

const METRIC_LABELS = {
  sleep: 'Sommeil',
  sport: 'Sport',
  water: 'Eau',
  mood: 'Humeur',
  prod: 'Productivité',
  productivity: 'Productivité',
};

// ── Quotes ───────────────────────────────────────────────────────
const QUOTES = [
  // David Goggins
  { text: "La douleur est temporaire. Abandonner dure toujours.", author: "David Goggins", sport: "Ultra-marathonien · Navy SEAL" },
  { text: "Tu es en danger de vivre une vie tellement confortable que tu mourras sans jamais réaliser ton vrai potentiel.", author: "David Goggins", sport: "Ultra-marathonien · Navy SEAL" },
  { text: "Ne t'arrête pas quand tu es fatigué. Arrête-toi quand c'est fait.", author: "David Goggins", sport: "Ultra-marathonien · Navy SEAL" },
  { text: "Endurcis ton esprit comme tu endurcis tes mains.", author: "David Goggins", sport: "Ultra-marathonien · Navy SEAL" },
  { text: "La médiocrité sera toujours là pour t'accueillir si tu baisses les bras.", author: "David Goggins", sport: "Ultra-marathonien · Navy SEAL" },

  // Kobe Bryant
  { text: "Le repos au sommet, pas en chemin.", author: "Kobe Bryant", sport: "NBA · Los Angeles Lakers · 5× champion" },
  { text: "Tout ce qui est négatif — la pression, les défis — c'est une opportunité pour moi de m'élever.", author: "Kobe Bryant", sport: "NBA · Los Angeles Lakers · 5× champion" },
  { text: "Je n'ai rien en commun avec les paresseux qui blâment les autres pour leur manque de succès.", author: "Kobe Bryant", sport: "NBA · Los Angeles Lakers · 5× champion" },
  { text: "La grandeur n'est pas pour tout le monde. C'est pour ceux qui refusent de s'en contenter.", author: "Kobe Bryant", sport: "NBA · Los Angeles Lakers · 5× champion" },

  // Muhammad Ali
  { text: "Impossible est un mot qu'on trouve dans le dictionnaire des lâches.", author: "Muhammad Ali", sport: "Boxe · Champion du monde poids lourds" },
  { text: "Ne compte pas les jours. Fais que les jours comptent.", author: "Muhammad Ali", sport: "Boxe · Champion du monde poids lourds" },
  { text: "Je détestais chaque minute d'entraînement, mais je me disais : ne lâche pas. Souffre maintenant et vis le reste de ta vie en champion.", author: "Muhammad Ali", sport: "Boxe · Champion du monde poids lourds" },
  { text: "Il n'est pas question de combien fort tu peux frapper. C'est de combien fort tu peux en prendre.", author: "Muhammad Ali", sport: "Boxe · Champion du monde poids lourds" },

  // Gary Vaynerchuk
  { text: "Arrête de te plaindre. Commence à travailler.", author: "Gary Vaynerchuk", sport: "Entrepreneur · CEO VaynerMedia" },
  { text: "Les excuses sont le luxe des gens qui ne veulent pas vraiment réussir.", author: "Gary Vaynerchuk", sport: "Entrepreneur · CEO VaynerMedia" },
  { text: "Travaille comme si quelqu'un essayait de te voler tout ce que tu as construit.", author: "Gary Vaynerchuk", sport: "Entrepreneur · CEO VaynerMedia" },
  { text: "Chaque matin tu as deux choix : continuer à dormir avec tes rêves, ou te lever et les poursuivre.", author: "Gary Vaynerchuk", sport: "Entrepreneur · CEO VaynerMedia" },

  // Conor McGregor
  { text: "Je ne rêve pas. Je manifeste.", author: "Conor McGregor", sport: "MMA · Double champion UFC" },
  { text: "Il n'y a pas de talent ici. Il y a du travail acharné. C'est une obsession.", author: "Conor McGregor", sport: "MMA · Double champion UFC" },
  { text: "Nous ne sommes pas ici pour participer. Nous sommes ici pour dominer.", author: "Conor McGregor", sport: "MMA · Double champion UFC" },

  // Arnold Schwarzenegger
  { text: "Tout ce que je fais, je le fais à 100%. Sinon je ne le fais pas.", author: "Arnold Schwarzenegger", sport: "Bodybuilding · 7× Mr. Olympia" },
  { text: "Tu peux avoir des résultats ou des excuses. Pas les deux.", author: "Arnold Schwarzenegger", sport: "Bodybuilding · 7× Mr. Olympia" },
  { text: "Les 3 ou 4 dernières reps, c'est là que le muscle se construit. Cette zone de douleur sépare le champion des autres.", author: "Arnold Schwarzenegger", sport: "Bodybuilding · 7× Mr. Olympia" },
  { text: "La force ne vient pas de la victoire. C'est ta lutte qui développe ta force.", author: "Arnold Schwarzenegger", sport: "Bodybuilding · 7× Mr. Olympia" },

  // Cristiano Ronaldo
  { text: "Le talent sans travail n'est rien.", author: "Cristiano Ronaldo", sport: "Football · Real Madrid · Ballon d'Or ×5" },
  { text: "Je ne suis pas le plus riche, ni le plus intelligent, mais je réussis parce que je continue, encore et encore.", author: "Cristiano Ronaldo", sport: "Football · Real Madrid · Ballon d'Or ×5" },
  { text: "Votre amour pour ce que vous faites et votre volonté d'aller là où les autres refusent — c'est ce qui vous rendra grand.", author: "Cristiano Ronaldo", sport: "Football · Real Madrid · Ballon d'Or ×5" },

  // Michael Jordan
  { text: "J'ai raté plus de 9 000 tirs. C'est pourquoi je gagne.", author: "Michael Jordan", sport: "NBA · Chicago Bulls · 6× champion" },
  { text: "Les obstacles ne m'arrêtent pas. Chaque mur peut être démoli ou contourné.", author: "Michael Jordan", sport: "NBA · Chicago Bulls · 6× champion" },
  { text: "Tu dois t'attendre à de grandes choses de toi-même avant de les accomplir.", author: "Michael Jordan", sport: "NBA · Chicago Bulls · 6× champion" },

  // Serena Williams
  { text: "La grandeur ne vient pas de la chance. Elle se construit chaque jour.", author: "Serena Williams", sport: "Tennis · 23 titres Grand Chelem" },
  { text: "Un champion se définit non pas par ses victoires, mais par comment il se relève après une chute.", author: "Serena Williams", sport: "Tennis · 23 titres Grand Chelem" },
  { text: "Tu dois croire en toi quand personne d'autre ne le fait.", author: "Serena Williams", sport: "Tennis · 23 titres Grand Chelem" },

  // LeBron James
  { text: "Je promets que je vais continuer à travailler.", author: "LeBron James", sport: "NBA · Los Angeles Lakers · 4× champion" },
  { text: "J'aime les critiques. Elles te rendent fort.", author: "LeBron James", sport: "NBA · Los Angeles Lakers · 4× champion" },
  { text: "Tu ne peux pas avoir peur d'échouer. C'est le seul moyen de réussir.", author: "LeBron James", sport: "NBA · Los Angeles Lakers · 4× champion" },

  // Zinedine Zidane
  { text: "Pour réussir, il faut oser.", author: "Zinedine Zidane", sport: "Football · Real Madrid · 3× Ballon d'Or" },
  { text: "Le football, c'est simple. Recevoir, donner, se déplacer.", author: "Zinedine Zidane", sport: "Football · Real Madrid · 3× Ballon d'Or" },
  { text: "Je n'ai jamais rien gagné sans avoir beaucoup travaillé.", author: "Zinedine Zidane", sport: "Football · Real Madrid · 3× Ballon d'Or" },

  // Tony Robbins
  { text: "L'action est la clé fondamentale de tout succès.", author: "Tony Robbins", sport: "Coach · Auteur · Entrepreneur" },
  { text: "Si tu fais ce que tu as toujours fait, tu obtiendras ce que tu as toujours obtenu.", author: "Tony Robbins", sport: "Coach · Auteur · Entrepreneur" },
  { text: "Ce n'est pas ce qui t'arrive qui compte, c'est ce que tu en fais.", author: "Tony Robbins", sport: "Coach · Auteur · Entrepreneur" },
  { text: "La différence entre réussir et échouer, c'est souvent de ne pas abandonner.", author: "Tony Robbins", sport: "Coach · Auteur · Entrepreneur" },

  // Elon Musk
  { text: "Quand quelque chose est assez important, tu le fais même si les chances ne sont pas en ta faveur.", author: "Elon Musk", sport: "Entrepreneur · Tesla · SpaceX" },
  { text: "Travailler dur, c'est comme manger du verre et regarder l'abîme.", author: "Elon Musk", sport: "Entrepreneur · Tesla · SpaceX" },
  { text: "Si tu te lèves le matin en pensant que demain sera mieux qu'hier, c'est un bon jour.", author: "Elon Musk", sport: "Entrepreneur · Tesla · SpaceX" },

  // Rocky Balboa
  { text: "Ce n'est pas comment tu frappes fort. C'est comment tu encaisses et tu continues.", author: "Rocky Balboa", sport: "Film · Rocky Balboa (2006)" },
  { text: "Tout champion était un jour un prétendant qui a refusé d'abandonner.", author: "Rocky Balboa", sport: "Film · Rocky II (1979)" },
  { text: "La vie n'est pas à propos de la force avec laquelle on frappe. Elle est à propos de la force avec laquelle on reçoit les coups.", author: "Rocky Balboa", sport: "Film · Rocky Balboa (2006)" },
];

// ── Milestones ────────────────────────────────────────────────────
const MILESTONES = [
  { days: 3,  icon: '03', name: 'En feu',               desc: '3 jours consécutifs — tu as allumé la flamme !', key: 'badge_3' },
  { days: 7,  icon: '07', name: 'Warrior de la semaine', desc: '7 jours — une semaine complète de discipline !',  key: 'badge_7' },
  { days: 14, icon: '14', name: 'Machine',               desc: '14 jours — tu es devenu une machine !',          key: 'badge_14' },
  { days: 30, icon: '30', name: 'Légende ZAGRO',         desc: '30 jours — statut légendaire atteint !',         key: 'badge_30' },
];

// ── Workout Plans ─────────────────────────────────────────────────
const GOAL_LABELS = {
  masse:     { name: 'Prise de masse',   icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="18" y2="12"/><rect x="2" y="9" width="4" height="6" rx="1"/><rect x="18" y="9" width="4" height="6" rx="1"/><rect x="6" y="10" width="3" height="4" rx="0.5"/><rect x="15" y="10" width="3" height="4" rx="0.5"/></svg>' },
  poids:     { name: 'Perte de poids',   icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>' },
  endurance: { name: 'Endurance',        icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="2"/><path d="M8 22l2-7-2-4 4-2 2 4h4"/><path d="M5 13l3-1"/></svg>' },
  bienetre:  { name: 'Bien-être mental', icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22C7 17 2 13.5 2 9a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 4.5-5 8-10 13z"/></svg>' },
};

const WORKOUT_PLANS = {
  masse: {
    sessions: [
      {
        key: 'masse_lundi', day: 'Lundi', name: 'Push — Poitrine & Épaules', tag: 'force',
        exercises: [
          { icon: '▸', name: 'Développé couché',    sets: '4 × 8 reps', rest: '90s' },
          { icon: '▸', name: 'Développé incliné',   sets: '3 × 10 reps', rest: '75s' },
          { icon: '▸', name: 'Élévations latérales', sets: '3 × 15 reps', rest: '60s' },
          { icon: '▸', name: 'Extensions triceps',   sets: '3 × 12 reps', rest: '60s' },
        ],
      },
      {
        key: 'masse_mercredi', day: 'Mercredi', name: 'Pull — Dos & Biceps', tag: 'force',
        exercises: [
          { icon: '▸', name: 'Tractions',         sets: '4 × max reps', rest: '90s' },
          { icon: '▸', name: 'Rowing barre',      sets: '4 × 10 reps', rest: '90s' },
          { icon: '▸', name: 'Tirage poulie haute', sets: '3 × 12 reps', rest: '75s' },
          { icon: '▸', name: 'Curl biceps',        sets: '3 × 12 reps', rest: '60s' },
        ],
      },
      {
        key: 'masse_vendredi', day: 'Vendredi', name: 'Legs — Jambes & Fessiers', tag: 'force',
        exercises: [
          { icon: '▸', name: 'Squats barre',    sets: '4 × 8 reps', rest: '120s' },
          { icon: '▸', name: 'Presse à cuisses', sets: '3 × 12 reps', rest: '90s' },
          { icon: '▸', name: 'Fentes marchées',  sets: '3 × 12/jambe', rest: '75s' },
          { icon: '▸', name: 'Leg curl couché',  sets: '3 × 15 reps', rest: '60s' },
        ],
      },
      {
        key: 'masse_dimanche', day: 'Dimanche', name: 'Repos actif', tag: 'repos',
        exercises: [
          { icon: '▸', name: 'Marche 30 min', sets: '—', rest: '—' },
          { icon: '▸', name: 'Stretching global', sets: '15 min', rest: '—' },
        ],
      },
    ],
  },
  poids: {
    sessions: [
      {
        key: 'poids_lundi', day: 'Lundi', name: 'HIIT Circuit — Corps complet', tag: 'hiit',
        exercises: [
          { icon: '▸', name: 'Burpees',           sets: '4 × 15 reps', rest: '30s' },
          { icon: '▸', name: 'Mountain climbers',  sets: '4 × 30s',     rest: '20s' },
          { icon: '▸', name: 'Jump squats',        sets: '4 × 20 reps', rest: '30s' },
          { icon: '▸', name: 'High knees',         sets: '4 × 30s',     rest: '20s' },
        ],
      },
      {
        key: 'poids_mercredi', day: 'Mercredi', name: 'Cardio modéré — 35 min', tag: 'cardio',
        exercises: [
          { icon: '▸', name: 'Course à pied',        sets: '35 min', rest: '—' },
          { icon: '▸', name: 'Hydratation régulière', sets: '500ml', rest: '—' },
        ],
      },
      {
        key: 'poids_vendredi', day: 'Vendredi', name: 'HIIT Cardio — Intervalles', tag: 'hiit',
        exercises: [
          { icon: '▸', name: 'Sprint 30s / marche 30s', sets: '10 × cycles', rest: '—' },
          { icon: '▸', name: 'Corde à sauter',           sets: '5 × 1 min',  rest: '30s' },
          { icon: '▸', name: 'Box jumps',                sets: '4 × 12 reps', rest: '45s' },
        ],
      },
      {
        key: 'poids_samedi', day: 'Samedi', name: 'Marche active — 45 min', tag: 'cardio',
        exercises: [
          { icon: '▸', name: 'Marche rapide',     sets: '45 min', rest: '—' },
          { icon: '▸', name: 'Stretching final',  sets: '10 min', rest: '—' },
        ],
      },
    ],
  },
  endurance: {
    sessions: [
      {
        key: 'end_lundi', day: 'Lundi', name: 'Course longue — Endurance de base', tag: 'run',
        exercises: [
          { icon: '▸', name: 'Course allure modérée', sets: '45-60 min', rest: '—' },
          { icon: '▸', name: 'Hydratation',            sets: '750ml+',   rest: '—' },
        ],
      },
      {
        key: 'end_mercredi', day: 'Mercredi', name: 'Vélo / Natation — Cross training', tag: 'cardio',
        exercises: [
          { icon: '▸', name: 'Vélo ou natation', sets: '40 min', rest: '—' },
          { icon: '▸', name: 'Gainage core',     sets: '3 × 45s', rest: '30s' },
        ],
      },
      {
        key: 'end_vendredi', day: 'Vendredi', name: 'Fractionné — Intervalles vitesse', tag: 'hiit',
        exercises: [
          { icon: '▸', name: 'Échauffement',         sets: '10 min', rest: '—' },
          { icon: '▸', name: '400m à 85% vmax',       sets: '8 × répétitions', rest: '90s' },
          { icon: '▸', name: 'Retour au calme',       sets: '10 min', rest: '—' },
        ],
      },
      {
        key: 'end_dimanche', day: 'Dimanche', name: 'Récupération active', tag: 'repos',
        exercises: [
          { icon: '▸', name: 'Marche ou vélo lent', sets: '30 min', rest: '—' },
          { icon: '▸', name: 'Foam roller + stretching', sets: '15 min', rest: '—' },
        ],
      },
    ],
  },
  bienetre: {
    sessions: [
      {
        key: 'bien_lundi', day: 'Lundi', name: 'Yoga Flow — Énergie matinale', tag: 'yoga',
        exercises: [
          { icon: '▸', name: 'Salutation au soleil',   sets: '5 cycles', rest: '—' },
          { icon: '▸', name: 'Guerrier I & II',         sets: '3 min/côté', rest: '—' },
          { icon: '▸', name: 'Chien tête en bas',       sets: '5 × 30s', rest: '—' },
        ],
      },
      {
        key: 'bien_mercredi', day: 'Mercredi', name: 'Méditation & Respiration', tag: 'yoga',
        exercises: [
          { icon: '▸', name: 'Cohérence cardiaque 4-7-8', sets: '10 min', rest: '—' },
          { icon: '▸', name: 'Méditation pleine conscience', sets: '15 min', rest: '—' },
          { icon: '▸', name: 'Journaling — 3 gratitudes',   sets: '5 min',  rest: '—' },
        ],
      },
      {
        key: 'bien_vendredi', day: 'Vendredi', name: 'Yoga Restauratif — Détente profonde', tag: 'yoga',
        exercises: [
          { icon: '▸', name: 'Posture de l\'enfant',      sets: '3 min', rest: '—' },
          { icon: '▸', name: 'Torsion allongée',           sets: '2 min/côté', rest: '—' },
          { icon: '▸', name: 'Savasana — relaxation totale', sets: '10 min', rest: '—' },
        ],
      },
      {
        key: 'bien_dimanche', day: 'Dimanche', name: 'Promenade consciente', tag: 'cardio',
        exercises: [
          { icon: '▸', name: 'Marche en nature sans téléphone', sets: '45 min', rest: '—' },
          { icon: '▸', name: 'Bilan de semaine — journaling', sets: '10 min', rest: '—' },
        ],
      },
    ],
  },
};

// ── Theme ─────────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('zagro_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
}

// ── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupDate();
  setupNav();
  setupForm();
  loadUserProfile().then(() => {
    if (userProfile && !userProfile.onboarding_done) {
      document.getElementById('onboarding-overlay').style.display = 'flex';
      // Don't show quote until onboarding is done (submitOnboarding calls showDailyQuote)
    } else {
      showDailyQuote();
    }
    renderGoalsSection();
    loadEarnedBadges().then(() => {
      fetchData().then(() => {
        checkTodayLogged();
        updateStreak();
        renderHistory(currentPeriod);
        loadInsights();
        updateSidebarScore();
        updateQuickStats();
      });
    });
  });
});

// ── Date ─────────────────────────────────────────────────────────
function setupDate() {
  const now = new Date();
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('today-date').textContent = now.toLocaleDateString('fr-FR', opts);
}

function setUserGreeting(name) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const el = document.getElementById('user-greeting');
  if (el && name) el.textContent = `${greeting}, ${name} · `;
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// ── Navigation ───────────────────────────────────────────────────
function setupNav() {
  const links = document.querySelectorAll('.sidebar__link');
  const sections = document.querySelectorAll('.content-section');
  const titles = {
    log:      'Journal du jour',
    history:  'Historique',
    insights: 'Insights & Corrélations',
    coach:    'Coach IA',
    goals:    'Mes Objectifs',
  };

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.section;

      links.forEach((l) => l.classList.remove('sidebar__link--active'));
      link.classList.add('sidebar__link--active');

      sections.forEach((s) => s.classList.remove('active'));
      document.getElementById(`section-${target}`).classList.add('active');

      document.getElementById('section-title').textContent = titles[target] || '';

      if (target === 'history') renderHistory(currentPeriod);
      if (target === 'insights') renderInsightCards();
      if (target === 'coach') loadInsights();
    });
  });

  // Period buttons
  document.querySelectorAll('.period-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentPeriod = parseInt(btn.dataset.days);
      renderHistory(currentPeriod);
    });
  });
}

// ── Form setup ───────────────────────────────────────────────────
function setupForm() {
  // Sleep slider
  const sleepSlider = document.getElementById('sleep');
  const sleepDisplay = document.getElementById('sleep-display');
  sleepSlider.addEventListener('input', () => {
    sleepDisplay.textContent = `${parseFloat(sleepSlider.value).toFixed(1)}h`;
    highlightSleepZone(parseFloat(sleepSlider.value));
  });
  highlightSleepZone(7);

  // Water slider
  const waterSlider = document.getElementById('water');
  const waterDisplay = document.getElementById('water-display');
  waterSlider.addEventListener('input', () => {
    waterDisplay.textContent = `${parseFloat(waterSlider.value).toFixed(2)}L`;
    renderGlasses(parseFloat(waterSlider.value));
  });
  renderGlasses(1.5);

  // Mood scale
  buildEmojiScale('mood-scale', MOOD_EMOJIS, 'mood', 'mood-display', '/10');

  // Productivity scale
  buildEmojiScale('prod-scale', PROD_EMOJIS, 'productivity', 'prod-display', '/10');

  // Form submit
  document.getElementById('habit-form').addEventListener('submit', submitForm);
}

function highlightSleepZone(h) {
  const zones = document.querySelectorAll('.zone');
  let idx = 0;
  if (h < 6)        idx = 0;
  else if (h < 7)   idx = 1;
  else if (h <= 9)  idx = 2;
  else if (h <= 10) idx = 3;
  else              idx = 4;
  zones.forEach((z, i) => {
    z.classList.toggle('zone--active', i === idx);
    z.style.opacity = i === idx ? '1' : '0.4';
  });
}

function buildEmojiScale(containerId, _unused, hiddenId, displayId, suffix) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  const hidden = document.getElementById(hiddenId);
  const display = document.getElementById(displayId);

  for (let i = 1; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'emoji-btn';
    btn.dataset.val = i;
    btn.textContent = i;
    btn.addEventListener('click', () => {
      container.querySelectorAll('.emoji-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      hidden.value = i;
      display.textContent = `${i}${suffix}`;
    });
    if (i === 5) btn.classList.add('selected');
    container.appendChild(btn);
  }
}

function setSport(val) {
  sportValue = val;
  document.getElementById('sport').value = val;
  document.getElementById('sport-yes').classList.toggle('active', val);
  document.getElementById('sport-no').classList.toggle('active', !val);
}

function renderGlasses(liters) {
  const container = document.getElementById('glasses');
  const filled = Math.round((liters / 2.5) * 8);
  container.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const g = document.createElement('div');
    g.className = `glass${i < filled ? ' filled' : ''}`;
    container.appendChild(g);
  }
}

// ── API ──────────────────────────────────────────────────────────
async function fetchData() {
  try {
    const res = await fetch('/api/habits');
    habits = await res.json();
  } catch (e) {
    console.error('Fetch error', e);
    habits = [];
  }
}

async function submitForm(e) {
  e.preventDefault();
  const btn = document.querySelector('.submit-btn');
  btn.disabled = true;

  const payload = {
    sleep:        parseFloat(document.getElementById('sleep').value),
    sport:        document.getElementById('sport').value === 'true',
    water:        parseFloat(document.getElementById('water').value),
    mood:         parseInt(document.getElementById('mood').value),
    productivity: parseInt(document.getElementById('productivity').value),
  };

  try {
    const res = await fetch('/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.status === 'ok') {
      await fetchData();
      checkTodayLogged();
      updateStreak();
      updateSidebarScore();
      showToast('Habitudes enregistrées avec succès !');
      document.getElementById('already-logged').style.display = 'flex';
    }
  } catch (err) {
    showToast('Erreur lors de l\'enregistrement');
  }

  btn.disabled = false;
}

// ── Today check ──────────────────────────────────────────────────
function checkTodayLogged() {
  const today = todayStr();
  const entry = habits.find((h) => h.date === today);
  const banner = document.getElementById('already-logged');

  if (entry) {
    banner.style.display = 'flex';
    // Pre-fill form
    document.getElementById('sleep').value = entry.sleep;
    document.getElementById('sleep-display').textContent = `${entry.sleep}h`;
    highlightSleepZone(entry.sleep);

    setSport(entry.sport);

    document.getElementById('water').value = entry.water;
    document.getElementById('water-display').textContent = `${entry.water.toFixed(2)}L`;
    renderGlasses(entry.water);

    // Mood
    const moodBtns = document.querySelectorAll('#mood-scale .emoji-btn');
    moodBtns.forEach((b) => {
      b.classList.toggle('selected', parseInt(b.dataset.val) === entry.mood);
    });
    document.getElementById('mood').value = entry.mood;
    document.getElementById('mood-display').textContent = `${entry.mood}/10`;

    // Productivity
    const prodBtns = document.querySelectorAll('#prod-scale .emoji-btn');
    prodBtns.forEach((b) => {
      b.classList.toggle('selected', parseInt(b.dataset.val) === entry.productivity);
    });
    document.getElementById('productivity').value = entry.productivity;
    document.getElementById('prod-display').textContent = `${entry.productivity}/10`;
  } else {
    banner.style.display = 'none';
  }
}

// ── Streak + badges ───────────────────────────────────────────────
function updateStreak() {
  const sorted = [...habits].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  let expected = new Date();

  for (const h of sorted) {
    const d = new Date(h.date);
    const diff = Math.floor((expected - d) / 86400000);
    if (diff === 0 || diff === 1) {
      streak++;
      expected = d;
    } else {
      break;
    }
  }

  // Update topbar streak display
  document.getElementById('streak-count').textContent = streak;

  // Pick the highest milestone reached for the streak icon/label
  const topMilestone = [...MILESTONES].reverse().find((m) => streak >= m.days);
  const boltSVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  if (topMilestone) {
    document.getElementById('streak-icon').innerHTML = `<span class="streak-badge-num">${topMilestone.icon}</span>`;
    document.getElementById('streak-label').textContent = topMilestone.name;
    document.getElementById('streak-badge').classList.add('streak-badge--milestone');
  } else {
    document.getElementById('streak-icon').innerHTML = boltSVG;
    document.getElementById('streak-label').textContent = 'jours consécutifs';
    document.getElementById('streak-badge').classList.remove('streak-badge--milestone');
  }

  checkAndAwardBadges(streak);
  renderSidebarBadges();
}

// ── Badges (server-backed) ────────────────────────────────────────
let earnedBadgeTypes = new Set();

async function loadEarnedBadges() {
  try {
    const res = await fetch('/api/badges');
    if (!res.ok) return;
    const badges = await res.json();
    badges.forEach(b => earnedBadgeTypes.add(b.badge_type));
  } catch {}
}

async function checkAndAwardBadges(streak) {
  for (const m of MILESTONES) {
    if (streak >= m.days && !earnedBadgeTypes.has(m.key)) {
      try {
        const res = await fetch('/api/badges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ badge_type: m.key }),
        });
        const data = await res.json();
        if (data.ok) {
          earnedBadgeTypes.add(m.key);
          setTimeout(() => showCelebration(m), 600);
        }
      } catch {}
    }
  }
}

function renderSidebarBadges() {
  const container = document.getElementById('badges-list');
  const section   = document.getElementById('sidebar-badges');
  const earned = MILESTONES.filter(m => earnedBadgeTypes.has(m.key));
  if (!earned.length) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  container.innerHTML = earned.map(m =>
    `<div class="sidebar__badge-item" title="${m.name}">
      <span class="sidebar__badge-icon sidebar__badge-num">${m.icon}</span>
      <span class="sidebar__badge-name">${m.name}</span>
    </div>`
  ).join('');
}

function showCelebration(milestone) {
  document.getElementById('celebration-icon').textContent     = milestone.icon;
  document.getElementById('celebration-badge-name').textContent = milestone.name;
  document.getElementById('celebration-desc').textContent     = milestone.desc;

  const overlay = document.getElementById('celebration-overlay');
  overlay.style.display = 'flex';
  requestAnimationFrame(() => overlay.classList.add('celebration-overlay--visible'));

  spawnConfetti();
}

function closeCelebration() {
  const overlay = document.getElementById('celebration-overlay');
  overlay.classList.remove('celebration-overlay--visible');
  setTimeout(() => {
    overlay.style.display = 'none';
    document.getElementById('confetti-container').innerHTML = '';
  }, 400);
}

function spawnConfetti() {
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';
  const colors = ['#FF6B35', '#2ECC71', '#0F9B8E', '#7B2FBE', '#FFB830', '#FF4757', '#00D97E'];

  for (let i = 0; i < 80; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 0.8}s;
      animation-duration: ${1.2 + Math.random() * 1.2}s;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      transform: rotate(${Math.random() * 360}deg);
    `;
    container.appendChild(p);
  }
}

// ── Sidebar score ─────────────────────────────────────────────────
function updateSidebarScore() {
  fetch('/api/insights')
    .then((r) => r.json())
    .then((data) => {
      const score = data.score;
      if (score !== null && score !== undefined) {
        document.getElementById('score-display').textContent = score;
      }
      // Also update quick stats score
      const qsScore = document.getElementById('qs-score');
      if (qsScore && score !== null) qsScore.textContent = score;
    })
    .catch(() => {});
}

function updateQuickStats() {
  if (!habits.length) return;
  const streak = computeStreak();
  document.getElementById('qs-streak').textContent = streak + 'j';
  document.getElementById('qs-days').textContent = habits.length;
  document.getElementById('qs-badges').textContent = earnedBadgeTypes.size;
  document.getElementById('quick-stats').style.display = 'flex';
}

function computeStreak() {
  if (!habits.length) return 0;
  const today = todayStr();
  let streak = 0;
  let check = new Date(today);
  const dates = new Set(habits.map(h => h.date));
  while (true) {
    const s = check.toISOString().split('T')[0];
    if (dates.has(s)) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// ── History ──────────────────────────────────────────────────────
function renderHistory(days) {
  const slice = habits.slice(-days);
  renderTable(slice);
  renderCharts(slice);
  renderSportCalendar(slice);
}

function renderTable(data) {
  const tbody = document.getElementById('history-tbody');
  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">Aucune donnée pour cette période</td></tr>';
    return;
  }

  const rows = [...data].reverse().map((d) => {
    const date = new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    const sport = d.sport
      ? '<span class="badge-sport-yes">✓</span>'
      : '<span class="badge-sport-no">✗</span>';
    return `<tr>
      <td>${date}</td>
      <td>${d.sleep}h</td>
      <td>${sport}</td>
      <td>${d.water}L</td>
      <td>${d.mood}/10</td>
      <td>${d.productivity}/10</td>
    </tr>`;
  });

  tbody.innerHTML = rows.join('');
}

// ── Chart.js charts ──────────────────────────────────────────────
const _chartInstances = {};

function getChartTextColor() {
  const theme = document.documentElement.getAttribute('data-theme');
  return theme === 'light' ? '#5A5878' : '#9E9CB8';
}

function getChartGridColor() {
  const theme = document.documentElement.getAttribute('data-theme');
  return theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)';
}

function makeGradient(ctx, color) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, color + '55');
  gradient.addColorStop(1, color + '00');
  return gradient;
}

function renderCharts(data) {
  if (!data.length) return;

  const labels = data.map((d) => {
    const date = new Date(d.date);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });

  const textColor = getChartTextColor();
  const gridColor = getChartGridColor();

  const baseOptions = (min, max, unit = '') => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(13,13,26,0.9)',
        borderColor: 'rgba(255,215,0,0.4)',
        borderWidth: 1,
        titleColor: '#F0EEF8',
        bodyColor: '#9E9CB8',
        padding: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y}${unit}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 11 }, maxTicksLimit: 7 },
        border: { color: gridColor },
      },
      y: {
        min, max,
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 11 } },
        border: { color: gridColor },
      },
    },
  });

  function drawChart(id, values, color, min, max, unit) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (_chartInstances[id]) { _chartInstances[id].destroy(); }
    _chartInstances[id] = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: values,
          borderColor: color,
          borderWidth: 2.5,
          backgroundColor: makeGradient(ctx, color),
          pointBackgroundColor: color,
          pointBorderColor: '#0D0D1A',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true,
        }],
      },
      options: baseOptions(min, max, unit),
    });
  }

  drawChart('chart-sleep', data.map((d) => d.sleep),        '#FFD700', 4,  12, 'h');
  drawChart('chart-mood',  data.map((d) => d.mood),         '#FFE44D', 0,  10, '/10');
  drawChart('chart-prod',  data.map((d) => d.productivity), '#CC9900', 0,  10, '/10');
  drawChart('chart-water', data.map((d) => d.water),        '#FFF0A0', 0,  4,  'L');
}

function renderSportCalendar(data) {
  const container = document.getElementById('sport-calendar');
  container.innerHTML = '';

  if (!data.length) {
    container.innerHTML = '<span style="color:var(--text-3);font-size:.85rem">Aucune donnée</span>';
    return;
  }

  data.forEach((d) => {
    const day = document.createElement('div');
    const date = new Date(d.date);
    day.className = `sport-day sport-day--${d.sport ? 'yes' : 'no'}`;
    day.title = `${date.getDate()}/${date.getMonth()+1} — ${d.sport ? 'Sport ✓' : 'Repos'}`;
    container.appendChild(day);
  });
}

// ── Insights ─────────────────────────────────────────────────────
let cachedInsights = null;

async function loadInsights() {
  try {
    const res = await fetch('/api/insights');
    const data = await res.json();
    cachedInsights = data;

    // Update score ring
    if (data.score !== null && data.score !== undefined) {
      document.getElementById('score-display').textContent = data.score;
      animateScoreRing(data.score);
      document.getElementById('score-ring-text').textContent = data.score;
    }

    // Coach message
    const msgEl = document.getElementById('coach-message');
    msgEl.innerHTML = '';
    const p = document.createElement('p');
    p.textContent = data.coach;
    p.style.lineHeight = '1.85';
    msgEl.appendChild(p);

    // Correlations in coach
    const coachCorr = document.getElementById('coach-correlations');
    const corrList  = document.getElementById('correlations-list');
    if (data.insights && data.insights.length) {
      coachCorr.style.display = 'block';
      corrList.innerHTML = data.insights.map((ins) => `
        <div class="corr-item">
          <div class="corr-item__dot corr-item__dot--${ins.direction}"></div>
          <div class="corr-item__msg">${ins.message}</div>
          <div class="corr-item__r">r = ${ins.correlation.toFixed(2)}</div>
        </div>
      `).join('');
    } else {
      coachCorr.style.display = 'none';
    }

    renderInsightCards();
  } catch (err) {
    const msgEl = document.getElementById('coach-message');
    msgEl.innerHTML = '<p style="color:var(--text-3)">Impossible de charger l\'analyse. Vérifie que le serveur est démarré.</p>';
  }
}

function renderInsightCards() {
  const grid = document.getElementById('insights-grid');
  if (!cachedInsights || !cachedInsights.insights || !cachedInsights.insights.length) {
    grid.innerHTML = `
      <div class="insight-placeholder">
        <div class="placeholder-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></div>
        <h3>Données insuffisantes</h3>
        <p>Enregistre au moins 5 jours d'habitudes pour débloquer les insights.</p>
      </div>`;
    document.getElementById('correlation-section').style.display = 'none';
    return;
  }

  grid.innerHTML = cachedInsights.insights.map((ins) => `
    <div class="insight-card">
      <div class="insight-card__top">
        <div class="insight-card__dir insight-card__dir--${ins.direction}">
          ${ins.direction === 'positive' ? '↑' : '↓'}
        </div>
        <div class="insight-card__msg">${ins.message}</div>
      </div>
      <div class="insight-card__foot">
        <div class="corr-bar">
          <div class="corr-fill corr-fill--${ins.direction}"
               style="width:${Math.abs(ins.correlation) * 100}%"></div>
        </div>
        <span class="corr-val">r = ${ins.correlation.toFixed(2)}</span>
        <span class="corr-strength corr-strength--${ins.strength}">${ins.strength}</span>
      </div>
    </div>
  `).join('');

  buildCorrelationMatrix();
}

function buildCorrelationMatrix() {
  const section = document.getElementById('correlation-section');
  const matrix  = document.getElementById('correlation-matrix');

  if (!habits.length || habits.length < 5) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  const keys = ['sleep', 'sport', 'water', 'mood', 'productivity'];
  const names = { sleep: 'Sommeil', sport: 'Sport', water: 'Eau', mood: 'Humeur', productivity: 'Productivité' };

  const vectors = {};
  keys.forEach((k) => {
    vectors[k] = habits.map((h) => k === 'sport' ? (h.sport ? 1 : 0) : h[k]);
  });

  function pearson(xs, ys) {
    const n = xs.length;
    if (n < 3) return 0;
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    const num = xs.reduce((sum, x, i) => sum + (x - mx) * (ys[i] - my), 0);
    const den = Math.sqrt(
      xs.reduce((s, x) => s + (x - mx) ** 2, 0) *
      ys.reduce((s, y) => s + (y - my) ** 2, 0)
    );
    return den ? num / den : 0;
  }

  // Header row
  let html = '<div class="corr-row"><div class="corr-label"></div>';
  keys.forEach((k) => {
    html += `<div class="corr-cell" style="background:transparent;color:var(--text-3);font-size:.65rem;font-family:Inter,sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.04em">${names[k].slice(0,3)}</div>`;
  });
  html += '</div>';

  keys.forEach((rowKey) => {
    html += `<div class="corr-row"><div class="corr-label">${names[rowKey]}</div>`;
    keys.forEach((colKey) => {
      if (rowKey === colKey) {
        html += `<div class="corr-cell" style="background:var(--bg-3);color:var(--text-3)">—</div>`;
      } else {
        const r = pearson(vectors[rowKey], vectors[colKey]);
        const abs = Math.abs(r);
        const hue = r > 0 ? '160' : '0'; // green or red
        const bg = `hsla(${hue},70%,${40 + abs * 25}%,${0.1 + abs * 0.3})`;
        const fg = `hsla(${hue},80%,${70 + abs * 15}%,1)`;
        html += `<div class="corr-cell" style="background:${bg};color:${fg}" title="${names[rowKey]} ↔ ${names[colKey]}: r=${r.toFixed(2)}">${r.toFixed(2)}</div>`;
      }
    });
    html += '</div>';
  });

  matrix.innerHTML = html;
}

// ── Daily quote ───────────────────────────────────────────────────
function showDailyQuote() {
  const today = todayStr();
  // const seenKey = 'zagro_quote_seen_' + today;
  // if (localStorage.getItem(seenKey)) return;

  // Pick a random quote per day — seeded by date string so it's stable within the day
  const seed = today.split('-').reduce((a, c) => a * 31 + parseInt(c, 10), 7);
  const q = QUOTES[((seed % QUOTES.length) + QUOTES.length) % QUOTES.length];

  document.getElementById('quote-text').textContent  = `"${q.text}"`;
  document.getElementById('quote-name').textContent  = q.author;
  document.getElementById('quote-sport').textContent = q.sport;

  const overlay = document.getElementById('quote-overlay');
  overlay.style.display = 'flex';
  requestAnimationFrame(() => overlay.classList.add('quote-overlay--visible'));
}

function closeQuote() {
  const today = todayStr();
  localStorage.setItem('zagro_quote_seen_' + today, '1');
  const overlay = document.getElementById('quote-overlay');
  overlay.classList.remove('quote-overlay--visible');
  setTimeout(() => { overlay.style.display = 'none'; }, 400);
}

// ── Score ring animation ──────────────────────────────────────────
function animateScoreRing(score) {
  const fill = document.getElementById('score-ring-fill');
  if (!fill) return;

  // Insert gradient def
  const svgEl = fill.closest('svg');
  if (!svgEl.querySelector('#score-gradient')) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#FFD700"/>
        <stop offset="100%" stop-color="#FFE44D"/>
      </linearGradient>`;
    svgEl.prepend(defs);
  }

  fill.setAttribute('stroke', 'url(#score-gradient)');
  const circumference = 2 * Math.PI * 40; // r=40
  const offset = circumference - (score / 100) * circumference;
  fill.style.strokeDasharray  = circumference;
  fill.style.strokeDashoffset = circumference;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fill.style.transition = 'stroke-dashoffset 1.5s ease';
      fill.style.strokeDashoffset = offset;
    });
  });
}

// ── Toast ─────────────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Onboarding ────────────────────────────────────────────────────
function selectGoal(el) {
  document.querySelectorAll('.ob-goal-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  obGoal = el.dataset.goal;
  document.getElementById('ob-next-1').disabled = false;
}

function selectLevel(el) {
  document.querySelectorAll('.ob-level-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  obLevel = el.dataset.level;
  document.getElementById('ob-next-2').disabled = false;
}

function selectFreq(el) {
  document.querySelectorAll('.ob-freq-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  obFreq = el.dataset.freq;
  document.getElementById('ob-next-3').disabled = false;
}

function obNext(step) {
  document.querySelectorAll('.onboarding-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`ob-screen-${step}`).classList.add('active');

  // Update progress bar
  document.querySelectorAll('.onboarding-progress__step').forEach((el, i) => {
    el.classList.toggle('onboarding-progress__step--active', i < step);
  });
}

async function submitOnboarding() {
  if (!obGoal || !obLevel || !obFreq) return;
  try {
    await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal: obGoal, level: obLevel, training_freq: obFreq }),
    });
    userProfile = { ...userProfile, goal: obGoal, level: obLevel, training_freq: obFreq, onboarding_done: true };
    document.getElementById('onboarding-overlay').style.display = 'none';
    renderGoalsSection();
    showDailyQuote();
  } catch (e) {
    console.error('Onboarding save failed', e);
  }
}

// ── Goals section ─────────────────────────────────────────────────
async function loadUserProfile() {
  try {
    const res = await fetch('/api/me');
    if (!res.ok) return;
    userProfile = await res.json();
    setUserGreeting(userProfile.name);
  } catch {}
}

function getWeekKey() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getFullYear(), 0, 1));
  const week = Math.ceil(((now - start) / 86400000 + start.getUTCDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

async function renderGoalsSection() {
  if (!userProfile) return;

  const goal = userProfile.goal;
  const goalInfo = GOAL_LABELS[goal];

  if (!goalInfo) {
    document.getElementById('goal-name').textContent = 'Aucun objectif défini';
    document.getElementById('goal-icon').innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>';
    document.getElementById('goal-meta').textContent = '';
    return;
  }

  document.getElementById('goal-icon').innerHTML = goalInfo.icon;
  document.getElementById('goal-name').textContent    = goalInfo.name;

  const levelLabels = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };
  document.getElementById('goal-meta').textContent =
    `${levelLabels[userProfile.level] || ''} · ${userProfile.training_freq || ''} séances/semaine`;

  // Load this week's checks
  const weekKey = getWeekKey();
  let checkedSessions = new Set();
  try {
    const res = await fetch(`/api/workout/checks?week=${weekKey}`);
    if (res.ok) {
      const keys = await res.json();
      keys.forEach(k => checkedSessions.add(k));
    }
  } catch {}

  const plan = WORKOUT_PLANS[goal];
  if (!plan) return;

  const total   = plan.sessions.length;
  const checked = plan.sessions.filter(s => checkedSessions.has(s.key)).length;
  const pct     = total ? Math.round((checked / total) * 100) : 0;

  // Progress ring
  const circumference = 201; // 2 * π * 32
  const offset = circumference - (pct / 100) * circumference;
  const ringEl = document.getElementById('goal-ring-fill');
  if (ringEl) ringEl.style.strokeDashoffset = offset;
  document.getElementById('goal-progress-pct').textContent = pct + '%';

  // Motivational message
  const motivEl = document.getElementById('goal-motivational');
  if (motivEl) {
    if (pct === 0)       motivEl.textContent = 'Commence aujourd\'hui';
    else if (pct < 50)   motivEl.textContent = 'Continue sur ta lancée';
    else if (pct < 100)  motivEl.textContent = 'Tu es à mi-chemin !';
    else                 motivEl.textContent = 'SEMAINE PARFAITE';
  }

  // Render workout days
  const container = document.getElementById('workout-days');
  container.innerHTML = plan.sessions.map(session => {
    const isDone = checkedSessions.has(session.key);
    return `
      <div class="workout-day${isDone ? ' is-done' : ''}" id="wd-${session.key}">
        <div class="workout-day__header" onclick="toggleWorkoutDay('${session.key}')">
          <div class="workout-day__check ${isDone ? 'checked' : ''}"
               onclick="event.stopPropagation(); toggleCheck('${session.key}', '${weekKey}')"
               title="Marquer comme fait">
            ${isDone ? '✓' : ''}
          </div>
          <span class="workout-day__day">${session.day}</span>
          <span class="workout-day__name">${session.name}</span>
          <span class="workout-day__tag workout-day__tag--${session.tag}">${session.tag.toUpperCase()}</span>
          <span class="workout-day__toggle">▾</span>
        </div>
        <div class="workout-day__body">
          <div class="workout-exercises">
            ${session.exercises.map(ex => `
              <div class="exercise-row">
                <span class="exercise-row__icon">${ex.icon}</span>
                <span class="exercise-row__name">${ex.name}</span>
                <span class="exercise-row__sets">${ex.sets}</span>
                <span class="exercise-row__rest">${ex.rest !== '—' ? 'repos ' + ex.rest : ''}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleWorkoutDay(key) {
  const el = document.getElementById(`wd-${key}`);
  if (el) el.classList.toggle('expanded');
}

async function toggleCheck(sessionKey, weekKey) {
  try {
    const res = await fetch('/api/workout/checks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_key: sessionKey, week_key: weekKey }),
    });
    const data = await res.json();
    const el = document.getElementById(`wd-${sessionKey}`);
    const checkEl = el.querySelector('.workout-day__check');
    if (data.checked) {
      el.classList.add('is-done');
      checkEl.classList.add('checked');
      checkEl.textContent = '✓';
    } else {
      el.classList.remove('is-done');
      checkEl.classList.remove('checked');
      checkEl.textContent = '';
    }
    // Refresh progress
    renderGoalsSection();
  } catch {}
}

// Re-render charts on window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (habits.length) renderHistory(currentPeriod);
  }, 200);
});
