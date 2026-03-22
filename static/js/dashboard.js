/* ═══════════════════════════════════════════════════════════════
   ZAGRO — Dashboard JS
   Handles: navigation, form, charts, analyse, coach
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

// ── Mobile sidebar toggle ─────────────────────────────────────────
function setupMobileSidebar() {
  const toggle   = document.getElementById('sidebar-toggle');
  const sidebar  = document.querySelector('.sidebar');
  const overlay  = document.getElementById('sidebar-overlay');
  if (!toggle || !sidebar || !overlay) return;

  function openSidebar()  {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () =>
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar()
  );
  overlay.addEventListener('click', closeSidebar);

  // Close on nav link click (mobile)
  sidebar.querySelectorAll('.sidebar__link').forEach(link =>
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeSidebar();
    })
  );
}

// ── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupDate();
  setupNav();
  setupMobileSidebar();
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
        loadAnalyse();
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
    log:         'Journal du jour',
    history:     'Historique',
    analyse:     'Analyse & Corrélations',
    coach:       'Coach IA',
    goals:       'Mes Objectifs',
    adn:         'Mon ADN de Performance',
    classement:  'Classement Warriors',
    lectures:    'Suivi de Lecture',
    profile:     'Mon Profil',
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
      if (target === 'analyse') renderAnalyseCards();
      if (target === 'coach') loadAnalyse();
      if (target === 'adn') loadDNA();
      if (target === 'classement') loadLeaderboard();
      if (target === 'lectures') loadBooks();
      if (target === 'profile') loadProfile();
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
      showDailyAffirmations();
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
    showDailyAffirmations();
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
  fetch('/api/analyse')
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
      ? '<span class="badge-sport-yes"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>'
      : '<span class="badge-sport-no"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>';
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
    day.title = `${date.getDate()}/${date.getMonth()+1} — ${d.sport ? 'Sport oui' : 'Repos'}`;
    container.appendChild(day);
  });
}

// ── Analyse ──────────────────────────────────────────────────────
let cachedAnalyse = null;

async function loadAnalyse() {
  try {
    const res = await fetch('/api/analyse');
    const data = await res.json();
    cachedAnalyse = data;

    // Update score ring
    if (data.score !== null && data.score !== undefined) {
      document.getElementById('score-display').textContent = data.score;
      animateScoreRing(data.score);
      document.getElementById('score-ring-text').textContent = data.score;
    }

    // Coach message
    const msgEl = document.getElementById('coach-message');
    if (data.score === null) {
      const daysLogged = data.days_logged ?? 0;
      const pct = Math.min(100, Math.round((daysLogged / 3) * 100));
      msgEl.innerHTML = `
        <div class="coach-empty">
          <div class="coach-empty__avatar"><svg width="48" height="48" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10" width="22" height="17" rx="2"/><rect x="10" y="14" width="4" height="5" rx="1"/><rect x="18" y="14" width="4" height="5" rx="1"/><line x1="12" y1="23" x2="20" y2="23"/><line x1="16" y1="3" x2="16" y2="10"/><circle cx="16" cy="2.5" r="2"/><line x1="5" y1="18.5" x2="2" y2="18.5"/><line x1="27" y1="18.5" x2="30" y2="18.5"/></svg></div>
          <div class="coach-empty__title">TON COACH DORT ENCORE...</div>
          <div class="coach-empty__sub">Enregistre tes 3 premiers jours pour le réveiller.</div>
          <div class="coach-empty__progress-wrap">
            <div class="coach-empty__progress-bar">
              <div class="coach-empty__progress-fill" style="width:${pct}%"></div>
            </div>
            <div class="coach-empty__progress-label">${daysLogged} / 3 jours</div>
          </div>
        </div>`;
    } else {
      msgEl.innerHTML = '';
      const p = document.createElement('p');
      p.textContent = data.coach;
      p.style.lineHeight = '1.85';
      msgEl.appendChild(p);
    }

    // Correlations in coach
    const coachCorr = document.getElementById('coach-correlations');
    const corrList  = document.getElementById('correlations-list');
    if (data.analyse && data.analyse.length) {
      coachCorr.style.display = 'block';
      corrList.innerHTML = data.analyse.map((ins) => `
        <div class="corr-item">
          <div class="corr-item__dot corr-item__dot--${ins.direction}"></div>
          <div class="corr-item__msg">${ins.message}</div>
          <div class="corr-item__r">r = ${ins.correlation.toFixed(2)}</div>
        </div>
      `).join('');
    } else {
      coachCorr.style.display = 'none';
    }

    renderAnalyseCards();
  } catch (err) {
    const msgEl = document.getElementById('coach-message');
    msgEl.innerHTML = '<p style="color:var(--text-3)">Impossible de charger l\'analyse. Vérifie que le serveur est démarré.</p>';
  }
}

function renderAnalyseCards() {
  const grid = document.getElementById('analyse-grid');
  if (!cachedAnalyse || !cachedAnalyse.analyse || !cachedAnalyse.analyse.length) {
    const daysLogged = cachedAnalyse?.days_logged ?? 0;
    const remaining = Math.max(0, 5 - daysLogged);
    const motiv = remaining > 0
      ? `Encore <strong>${remaining}</strong> jour${remaining > 1 ? 's' : ''} avant de débloquer tes premières insights.`
      : 'Continue à enregistrer tes habitudes !';
    grid.innerHTML = `
      <div class="insight-placeholder">
        <div class="placeholder-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></div>
        <h3>DONNÉES INSUFFISANTES</h3>
        <p>${motiv}</p>
      </div>
      <div class="insight-card insight-card--preview">
        <div class="insight-card__top">
          <div class="insight-card__dir insight-card__dir--positive">↑</div>
          <div class="insight-card__msg">Sommeil → Productivité</div>
        </div>
        <div class="insight-card__foot">
          <div class="corr-bar"><div class="corr-fill corr-fill--positive" style="width:75%"></div></div>
          <span class="corr-val">r = 0.75</span>
          <span class="corr-strength corr-strength--forte">forte</span>
        </div>
      </div>
      <div class="insight-card insight-card--preview">
        <div class="insight-card__top">
          <div class="insight-card__dir insight-card__dir--positive">↑</div>
          <div class="insight-card__msg">Sport → Humeur du lendemain</div>
        </div>
        <div class="insight-card__foot">
          <div class="corr-bar"><div class="corr-fill corr-fill--positive" style="width:62%"></div></div>
          <span class="corr-val">r = 0.62</span>
          <span class="corr-strength corr-strength--moderee">modérée</span>
        </div>
      </div>
      <div class="insight-card insight-card--preview">
        <div class="insight-card__top">
          <div class="insight-card__dir insight-card__dir--positive">↑</div>
          <div class="insight-card__msg">Score de performance global</div>
        </div>
        <div class="insight-card__foot">
          <div class="corr-bar"><div class="corr-fill corr-fill--positive" style="width:55%"></div></div>
          <span class="corr-val">r = 0.55</span>
          <span class="corr-strength corr-strength--moderee">modérée</span>
        </div>
      </div>`;
    document.getElementById('correlation-section').style.display = 'none';
    return;
  }

  grid.innerHTML = cachedAnalyse.analyse.map((ins) => `
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
            ${isDone ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
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
      checkEl.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    } else {
      el.classList.remove('is-done');
      checkEl.classList.remove('checked');
      checkEl.innerHTML = '';
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

// ── DNA Profile ───────────────────────────────────────────────────
let _dnaRadarChart = null;

async function loadDNA() {
  document.getElementById('dna-loading').style.display = 'flex';
  document.getElementById('dna-insufficient').style.display = 'none';
  document.getElementById('dna-profile').style.display = 'none';

  try {
    const res = await fetch('/api/dna');
    const data = await res.json();

    document.getElementById('dna-loading').style.display = 'none';

    if (data.error === 'insufficient_data') {
      document.getElementById('dna-insufficient').style.display = 'block';
      const days = data.days || 0;
      document.getElementById('dna-progress-fill').style.width = `${Math.min(days / 7 * 100, 100)}%`;
      document.getElementById('dna-progress-label').textContent = `${days} / 7 jours`;
      return;
    }

    document.getElementById('dna-profile').style.display = 'block';
    document.getElementById('dna-emoji').innerHTML = data.profile_data.emoji;
    document.getElementById('dna-profile-name').textContent = data.profile_data.name;
    document.getElementById('dna-profile-desc').textContent = data.profile_data.desc;

    // Apply profile color accent
    const card = document.getElementById('dna-card');
    card.style.borderTopColor = data.profile_data.color;

    // Stats grid
    const stats = [
      { label: 'Sommeil moy.', value: `${data.averages.sleep}h` },
      { label: 'Sport',        value: `${data.averages.sport_rate}%` },
      { label: 'Eau moy.',     value: `${data.averages.water}L` },
      { label: 'Humeur moy.',  value: `${data.averages.mood}/10` },
      { label: 'Prod. moy.',   value: `${data.averages.prod}/10` },
      { label: 'Jours loggés', value: data.days },
    ];
    document.getElementById('dna-stats-grid').innerHTML = stats.map(s => `
      <div class="dna-stat">
        <div class="dna-stat__val">${s.value}</div>
        <div class="dna-stat__label">${s.label}</div>
      </div>
    `).join('');

    // Radar chart
    const canvas = document.getElementById('dna-radar-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (_dnaRadarChart) { _dnaRadarChart.destroy(); _dnaRadarChart = null; }

    const r = data.radar;
    _dnaRadarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Sommeil', 'Sport', 'Hydratation', 'Humeur', 'Productivité'],
        datasets: [{
          data: [r.sommeil, r.sport, r.hydratation, r.humeur, r.productivite],
          backgroundColor: 'rgba(255,215,0,0.12)',
          borderColor: '#FFD700',
          borderWidth: 2,
          pointBackgroundColor: '#FFD700',
          pointBorderColor: '#000',
          pointBorderWidth: 1,
          pointRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false }, tooltip: {
          backgroundColor: 'rgba(10,10,10,0.9)',
          titleColor: '#FFD700',
          bodyColor: '#999',
          borderColor: 'rgba(255,215,0,0.3)',
          borderWidth: 1,
          callbacks: { label: ctx => ` ${ctx.raw}/100` },
        }},
        scales: {
          r: {
            min: 0, max: 100,
            ticks: { display: false, stepSize: 25 },
            grid: { color: 'rgba(255,215,0,0.08)' },
            angleLines: { color: 'rgba(255,215,0,0.15)' },
            pointLabels: {
              color: '#999999',
              font: { size: 11, weight: '600', family: 'Inter, sans-serif' },
            },
          },
        },
      },
    });

  } catch (err) {
    document.getElementById('dna-loading').style.display = 'none';
    document.getElementById('dna-insufficient').style.display = 'block';
    document.getElementById('dna-progress-label').textContent = 'Erreur de chargement';
  }
}

// ── Leaderboard ────────────────────────────────────────────────────
let _currentLbCategory = 'score';

async function loadLeaderboard(category) {
  if (category) _currentLbCategory = category;
  const cat = _currentLbCategory;

  const listEl = document.getElementById('lb-list');
  listEl.innerHTML = '<div class="lb-empty"><div class="loading-dots"><span></span><span></span><span></span></div><p>Chargement…</p></div>';

  try {
    const res = await fetch(`/api/leaderboard?category=${cat}`);
    const data = await res.json();

    // Rank card
    document.getElementById('lb-my-rank').textContent = data.current_rank ? `#${data.current_rank}` : '—';
    document.getElementById('lb-total').textContent = `/ ${data.total_users} warrior${data.total_users > 1 ? 's' : ''}`;
    document.getElementById('lb-motivation').textContent = data.motivation;
    document.getElementById('lb-week-key').textContent = data.week_key;

    // List
    if (!data.leaderboard || !data.leaderboard.length) {
      listEl.innerHTML = '<div class="lb-empty"><p>Aucun warrior classé cette semaine.<br>Commence à logger pour rejoindre le classement !</p></div>';
      return;
    }

    listEl.innerHTML = data.leaderboard.map(entry => {
      const isMine = entry.is_current_user;
      const pct = entry.score;
      const rankClass = entry.rank <= 3 ? ` lb-rank--top${entry.rank}` : '';
      return `
        <div class="lb-row${isMine ? ' lb-row--mine' : ''}">
          <div class="lb-row__rank${rankClass}">${entry.rank}</div>
          <div class="lb-row__name">${entry.warrior_name}${isMine ? ' <span class="lb-you">TOI</span>' : ''}</div>
          <div class="lb-row__score-wrap">
            <div class="lb-row__bar">
              <div class="lb-row__bar-fill" style="width:${pct}%"></div>
            </div>
            <div class="lb-row__score">${entry.score}<span class="lb-row__max">/100</span></div>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    listEl.innerHTML = '<div class="lb-empty"><p>Impossible de charger le classement.</p></div>';
  }
}

// Wire leaderboard filter buttons
document.querySelectorAll('.lb-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lb-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadLeaderboard(btn.dataset.cat);
  });
});

// ── AFFIRMATIONS ──────────────────────────────────────────────────

const AFFIRMATIONS = {
  masse: [
    "Je construis mon corps chaque jour, une répétition à la fois.",
    "Chaque séance me rapproche de la version la plus forte de moi-même.",
    "Je nourris mes muscles avec discipline et constance.",
    "Mon corps est une machine que j'affûte chaque jour.",
    "La croissance musculaire est le résultat de mes efforts quotidiens.",
    "Je suis en train de sculpter mon physique idéal.",
    "Chaque repas, chaque entraînement me construit.",
    "Ma force augmente chaque semaine parce que je montre au présent.",
    "Je respecte mon corps en le poussant à se dépasser.",
    "La prise de masse demande de la patience — je suis patient et déterminé.",
    "Je mange, je dors, je m'entraîne — je suis la masse.",
    "Mon progrès physique reflète mon engagement mental.",
    "Chaque kilo gagné est une victoire que je mérite.",
    "Je suis plus fort aujourd'hui qu'hier.",
    "Le muscle ne ment pas — il récompense le travail.",
    "Je construis non seulement des muscles, mais du caractère.",
    "Chaque effort en salle est un investissement dans mon futur moi.",
    "La masse se construit dans la cuisine autant qu'en salle.",
    "Je suis discipliné, constant, invincible.",
    "Mon physique raconte l'histoire de mes sacrifices.",
    "Je ne compte pas les reps — je les ressens.",
  ],
  poids: [
    "Je brûle les graisses avec chaque pas, chaque choix.",
    "Mon corps se transforme parce que ma mentalité s'est transformée.",
    "Je choisis la santé à chaque repas.",
    "La balance bouge parce que je bouge.",
    "Je suis plus léger, plus rapide, plus libre.",
    "Chaque effort cardio me libère un peu plus.",
    "Je respecte mon corps en lui donnant ce dont il a besoin.",
    "La perte de poids est un voyage, pas une destination.",
    "Je suis constant dans mes efforts — les résultats suivent.",
    "Chaque jour de discipline me rapproche de mon objectif.",
    "Je brûle plus que des calories — je brûle mes limites.",
    "Mon énergie augmente chaque semaine.",
    "Je choisis les escaliers, l'eau, le mouvement.",
    "Je transforme ma silhouette avec patience et détermination.",
    "Mon métabolisme est mon allié quand je le respecte.",
    "Je suis fier de chaque gramme perdu.",
    "La légèreté physique libère aussi l'esprit.",
    "Je mange pour vivre mieux, pas pour compenser.",
    "Je visualise mon corps dans 3 mois — je travaille pour ça.",
    "Chaque sueur est une victoire.",
    "La santé est ma priorité numéro un.",
  ],
  endurance: [
    "Je vais plus loin aujourd'hui qu'hier.",
    "Mon souffle s'améliore, mes jambes se renforcent.",
    "Je suis fait pour aller loin.",
    "Chaque foulée me rend plus fort.",
    "L'endurance se construit dans l'inconfort — j'embrasse l'inconfort.",
    "Mon cœur est un moteur que j'entraîne chaque jour.",
    "Je repousse mes limites aérobies avec constance.",
    "La distance n'est qu'un chiffre — mon mental décide.",
    "Je cours, je nage, je pédale vers ma meilleure version.",
    "L'effort d'aujourd'hui est la facilité de demain.",
    "Je suis un athlète d'endurance en construction permanente.",
    "Chaque kilomètre est une médaille invisible.",
    "Ma respiration se synchronise avec ma détermination.",
    "Je dépasse mes records personnels une séance à la fois.",
    "L'endurance, c'est ma superforce.",
    "Je m'hydrate, je récupère, je recommence.",
    "Mon corps s'adapte et se renforce à chaque effort.",
    "Je cours même quand c'est dur — surtout quand c'est dur.",
    "La constance crée les athlètes que tout le monde admire.",
    "Je suis à l'aise dans l'inconfort.",
    "Chaque entraînement repousse mon plafond.",
  ],
  bienetre: [
    "Je prends soin de mon esprit autant que de mon corps.",
    "La paix intérieure est ma vraie performance.",
    "Je mérite le repos et la sérénité.",
    "Ma santé mentale est ma priorité.",
    "Je respire profondément et je lâche prise.",
    "Chaque moment de pleine conscience me régénère.",
    "Je suis aligné entre ce que je pense, ressens et fais.",
    "La gratitude transforme ma perception du monde.",
    "Je choisis la sérénité dans chaque situation.",
    "Mon bien-être rayonne autour de moi.",
    "Je m'accorde le droit de ralentir pour mieux avancer.",
    "La méditation est mon entraînement invisible.",
    "Je suis présent, conscient, en paix.",
    "Chaque bonne nuit de sommeil est un cadeau à mon cerveau.",
    "Je nourris mon esprit avec des pensées positives.",
    "L'équilibre est ma vraie force.",
    "Je ris, j'aime, je vis pleinement.",
    "Mon état d'esprit détermine la qualité de mes journées.",
    "Je suis la source de ma propre énergie positive.",
    "Le stress est temporaire — ma paix intérieure est permanente.",
    "Je construis un esprit fort pour un corps fort.",
  ],
  sleep_bad: [
    "Je respecte mon sommeil — il me rend plus fort.",
    "Ce soir, je dors bien. Mon corps et mon cerveau ont besoin de récupérer.",
    "Le sommeil est mon entraînement nocturne.",
    "Je prépare mes nuits pour performer le jour.",
    "Chaque heure de sommeil est un investissement dans ma performance.",
    "Je coupe les écrans plus tôt ce soir — demain je serai au top.",
    "Mon repos est aussi important que mon effort.",
    "La récupération est la partie du programme que j'honore enfin.",
    "Je protège mes nuits comme je protège mes séances.",
    "Dormir, c'est gagner.",
    "Je m'endors avec l'intention de me réveiller transformé.",
    "Ma fatigue d'aujourd'hui sera ma force de demain.",
    "Le sommeil construit les muscles que l'entraînement déchire.",
    "J'ai besoin de 8 heures — je me les accorde.",
    "Chaque nuit réparatrice me rapproche de mon objectif.",
    "Je suis discipliné même dans mon sommeil.",
    "Mon lit est mon alié, pas l'ennemi.",
    "Ce soir, j'honore mon corps en lui donnant le repos qu'il mérite.",
    "Le champion dort bien. Je suis ce champion.",
    "Je bâtis des habitudes de sommeil solides.",
    "La qualité de mes nuits définit la qualité de mes jours.",
  ],
  streak: [
    "Je suis constant — la constance crée les champions.",
    "Ma régularité est mon super-pouvoir.",
    "Un jour de plus dans ma série — je suis inarrêtable.",
    "Chaque jour loggé est une brique dans mon édifice.",
    "La constance bat le talent chaque fois.",
    "Je brise les cycles de lâcher — je maintiens le cap.",
    "Ma discipline parle pour moi.",
    "Je ne suis pas parfait, mais je suis présent — chaque jour.",
    "La série continue parce que j'ai décidé qu'elle continue.",
    "Le succès est une habitude — j'en suis la preuve.",
    "Je montre au présent, tous les jours, sans exception.",
    "Ma constance me différencie de la masse.",
    "Je construis quelque chose d'exceptionnel, un jour à la fois.",
    "La régularité est le secret que personne ne veut entendre.",
    "Je suis fidèle à mes engagements envers moi-même.",
    "Chaque journée enregistrée est une victoire sur la procrastination.",
    "Je suis l'athlète de ma propre vie.",
    "La discipline n'est pas une contrainte — c'est ma liberté.",
    "Je bâtis une vie extraordinaire à coups de jours ordinaires.",
    "Ma série reflète qui je suis vraiment.",
    "Je ne rate jamais deux fois de suite.",
  ],
  default: [
    "Je suis capable de plus que je ne le crois.",
    "Chaque effort compte, même les petits.",
    "Je progresse. Lentement peut-être, mais sûrement.",
    "Je suis l'architecte de ma propre transformation.",
    "Ma meilleure version est en train d'émerger.",
    "Je choisis la croissance chaque jour.",
    "Je suis plus fort qu'hier.",
    "Mes actions définissent qui je deviens.",
    "Je construis quelque chose de grand.",
    "La transformation est en cours — je lui fais confiance.",
    "Je suis engagé envers moi-même.",
    "Le meilleur investissement, c'est moi-même.",
    "Je suis dans le processus — et le processus fonctionne.",
    "Chaque jour est une nouvelle opportunité de progresser.",
    "Je prends soin de moi avec rigueur et bienveillance.",
    "Ma vie change parce que mes habitudes changent.",
    "Je suis sur la bonne voie.",
    "Je ne compare pas mon chapitre 1 au chapitre 20 des autres.",
    "Je suis fier de mon chemin parcouru.",
    "La version de moi de demain remercie mes efforts d'aujourd'hui.",
    "Je suis digne de mon propre respect.",
  ],
};

function pickAffirmation(pool, seed) {
  return pool[((seed % pool.length) + pool.length) % pool.length];
}

function showDailyAffirmations() {
  const card = document.getElementById('affirmations-card');
  const list = document.getElementById('affirmations-list');
  if (!card || !list) return;

  const today = todayStr();
  const dateSeed = today.split('-').reduce((a, c) => a * 31 + parseInt(c, 10), 7);

  // Determine last 7 days of habits
  const last7 = habits.slice(-7);
  const avgSleep = last7.length
    ? last7.reduce((s, h) => s + h.sleep, 0) / last7.length
    : 8;
  const streak = computeStreak();

  const selected = [];

  // Affirmation 1: goal-based
  const goal = userProfile && userProfile.goal;
  const goalPool = AFFIRMATIONS[goal] || AFFIRMATIONS.default;
  selected.push(pickAffirmation(goalPool, dateSeed));

  // Affirmation 2: sleep-based if sleep is bad, else streak
  if (avgSleep < 6.5) {
    selected.push(pickAffirmation(AFFIRMATIONS.sleep_bad, dateSeed + 1));
  } else if (streak >= 3) {
    selected.push(pickAffirmation(AFFIRMATIONS.streak, dateSeed + 1));
  } else {
    selected.push(pickAffirmation(AFFIRMATIONS.default, dateSeed + 1));
  }

  // Affirmation 3: streak-based or default
  if (streak >= 7) {
    selected.push(pickAffirmation(AFFIRMATIONS.streak, dateSeed + 2));
  } else {
    selected.push(pickAffirmation(AFFIRMATIONS.default, dateSeed + 2));
  }

  // Deduplicate (shouldn't happen often but just in case)
  const unique = [...new Set(selected)];
  while (unique.length < 3) unique.push(pickAffirmation(AFFIRMATIONS.default, dateSeed + unique.length + 10));

  list.innerHTML = unique.slice(0, 3).map(text =>
    `<li class="affirmation-item">${text}</li>`
  ).join('');

  card.style.display = 'block';
}

// ── BOOKS ─────────────────────────────────────────────────────────

let _books = [];
let _bookFilter = 'all';
let _bookGoal = 12;

async function loadBooks() {
  try {
    const res = await fetch('/api/books');
    const data = await res.json();
    _books = data.books || [];
    _bookGoal = data.goal || 12;
    document.getElementById('book-goal-input').value = _bookGoal;
    renderBooks();
  } catch (e) {
    console.error('loadBooks error', e);
  }
}

function renderBooks() {
  const done = _books.filter(b => b.status === 'termine');
  const pagesRead = _books.reduce((s, b) => s + (b.pages_read || 0), 0);
  const pct = _bookGoal > 0 ? Math.min(100, Math.round((done.length / _bookGoal) * 100)) : 0;

  document.getElementById('books-done-count').textContent = done.length;
  document.getElementById('books-goal-display').textContent = _bookGoal;
  document.getElementById('books-goal-fill').style.width = pct + '%';
  document.getElementById('books-goal-pct').textContent = pct + '%';

  document.getElementById('bstat-done').textContent = done.length;
  document.getElementById('bstat-pages').textContent = pagesRead.toLocaleString('fr-FR');

  // Avg per month: months since first book
  let avgPerMonth = 0;
  if (done.length > 0) {
    const oldest = _books.reduce((min, b) => b.created_at < min ? b.created_at : min, _books[0].created_at);
    const months = Math.max(1, Math.ceil((Date.now() - new Date(oldest).getTime()) / (1000 * 60 * 60 * 24 * 30)));
    avgPerMonth = (done.length / months).toFixed(1);
  }
  document.getElementById('bstat-avg').textContent = avgPerMonth;

  const filtered = _bookFilter === 'all' ? _books : _books.filter(b => b.status === _bookFilter);

  const grid = document.getElementById('books-grid');
  const empty = document.getElementById('books-empty');

  if (!filtered.length) {
    empty.style.display = 'flex';
    // Remove old cards (keep the empty element)
    grid.querySelectorAll('.book-card').forEach(el => el.remove());
    return;
  }
  empty.style.display = 'none';
  grid.querySelectorAll('.book-card').forEach(el => el.remove());

  filtered.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.dataset.id = book.id;

    const pagePct = book.pages_total > 0 ? Math.min(100, Math.round((book.pages_read / book.pages_total) * 100)) : 0;
    const statusLabel = { en_cours: 'EN COURS', termine: 'TERMINÉ', a_lire: 'À LIRE' }[book.status] || book.status;
    const statusClass = { en_cours: 'book-status--en-cours', termine: 'book-status--termine', a_lire: 'book-status--a-lire' }[book.status] || '';
    const starFilled = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="color:#FFD700"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    const starEmpty = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-3)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    const stars = book.rating
      ? Array.from({length: 5}, (_, i) => i < book.rating ? starFilled : starEmpty).join('')
      : Array(5).fill(starEmpty).join('');
    const initials = book.title.charAt(0).toUpperCase();

    card.innerHTML = `
      <div class="book-card__cover">${initials}</div>
      <div class="book-card__content">
        <div class="book-card__header">
          <div>
            <div class="book-card__title">${book.title}</div>
            <div class="book-card__author">${book.author || 'Auteur inconnu'}</div>
          </div>
          <span class="book-status ${statusClass}">${statusLabel}</span>
        </div>
        ${book.pages_total > 0 ? `
        <div class="book-card__progress">
          <div class="book-card__progress-bar">
            <div class="book-card__progress-fill" style="width:${pagePct}%"></div>
          </div>
          <span class="book-card__progress-label">${book.pages_read} / ${book.pages_total} pages (${pagePct}%)</span>
        </div>` : ''}
        <div class="book-card__footer">
          <div class="book-card__rating" title="Note">${stars}</div>
          ${book.notes ? `<div class="book-card__notes">${book.notes}</div>` : ''}
        </div>
        <div class="book-card__actions">
          <button class="book-btn" onclick="openEditBook(${book.id})">Modifier</button>
          <button class="book-btn book-btn--danger" onclick="deleteBook(${book.id})">Supprimer</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openBookModal() {
  document.getElementById('book-modal-overlay').style.display = 'flex';
}

function closeBookModal(e) {
  if (e && e.target !== document.getElementById('book-modal-overlay')) return;
  document.getElementById('book-modal-overlay').style.display = 'none';
  document.getElementById('modal-book-title').value = '';
  document.getElementById('modal-book-author').value = '';
  document.getElementById('modal-book-pages').value = '';
  document.getElementById('modal-book-status').value = 'a_lire';
}

async function addBook() {
  const title = document.getElementById('modal-book-title').value.trim();
  const author = document.getElementById('modal-book-author').value.trim();
  const pages = parseInt(document.getElementById('modal-book-pages').value) || 0;
  const status = document.getElementById('modal-book-status').value;

  if (!title) { showToast('Le titre est requis'); return; }

  try {
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, pages_total: pages, status }),
    });
    const data = await res.json();
    if (data.ok) {
      document.getElementById('book-modal-overlay').style.display = 'none';
      document.getElementById('modal-book-title').value = '';
      document.getElementById('modal-book-author').value = '';
      document.getElementById('modal-book-pages').value = '';
      document.getElementById('modal-book-status').value = 'a_lire';
      showToast('Livre ajouté !');
      await loadBooks();
    }
  } catch { showToast('Erreur lors de l\'ajout'); }
}

async function deleteBook(id) {
  if (!confirm('Supprimer ce livre ?')) return;
  try {
    await fetch(`/api/books/${id}`, { method: 'DELETE' });
    showToast('Livre supprimé');
    await loadBooks();
  } catch { showToast('Erreur'); }
}

function openEditBook(id) {
  const book = _books.find(b => b.id === id);
  if (!book) return;

  const pages = book.pages_total || 0;
  const pagesRead = book.pages_read || 0;
  const rating = book.rating || 0;

  const modal = document.createElement('div');
  modal.className = 'book-edit-modal';
  modal.innerHTML = `
    <div class="book-edit-modal__box">
      <h3 class="book-edit-modal__title">Modifier le livre</h3>
      <input type="text" id="edit-title" class="book-input" value="${book.title}" placeholder="Titre" />
      <input type="text" id="edit-author" class="book-input" value="${book.author || ''}" placeholder="Auteur" />
      <select id="edit-status" class="book-input book-select">
        <option value="a_lire" ${book.status === 'a_lire' ? 'selected' : ''}>À lire</option>
        <option value="en_cours" ${book.status === 'en_cours' ? 'selected' : ''}>En cours</option>
        <option value="termine" ${book.status === 'termine' ? 'selected' : ''}>Terminé</option>
      </select>
      <input type="number" id="edit-pages-total" class="book-input" value="${pages}" placeholder="Pages totales" min="0" />
      <input type="number" id="edit-pages-read" class="book-input" value="${pagesRead}" placeholder="Pages lues" min="0" />
      <input type="number" id="edit-rating" class="book-input" value="${rating}" placeholder="Note /5" min="0" max="5" />
      <textarea id="edit-notes" class="book-input book-textarea" placeholder="Notes...">${book.notes || ''}</textarea>
      <div class="book-edit-modal__btns">
        <button class="btn btn--primary" onclick="saveEditBook(${id})">Sauvegarder</button>
        <button class="btn btn--ghost" onclick="this.closest('.book-edit-modal').remove()">Annuler</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

async function saveEditBook(id) {
  const payload = {
    title: document.getElementById('edit-title').value.trim(),
    author: document.getElementById('edit-author').value.trim(),
    status: document.getElementById('edit-status').value,
    pages_total: parseInt(document.getElementById('edit-pages-total').value) || 0,
    pages_read: parseInt(document.getElementById('edit-pages-read').value) || 0,
    rating: parseInt(document.getElementById('edit-rating').value) || null,
    notes: document.getElementById('edit-notes').value.trim(),
  };
  try {
    await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    document.querySelector('.book-edit-modal').remove();
    showToast('Livre mis à jour !');
    await loadBooks();
  } catch { showToast('Erreur'); }
}

async function saveBookGoal() {
  const goal = parseInt(document.getElementById('book-goal-input').value) || 12;
  try {
    await fetch('/api/books/goal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal }),
    });
    _bookGoal = goal;
    showToast(`Objectif mis à jour : ${goal} livres`);
    renderBooks();
  } catch { showToast('Erreur'); }
}

// ── Profile ───────────────────────────────────────────────────────
function loadProfile() {
  if (!userProfile) return;
  document.getElementById('profile-name-input').value = userProfile.name || '';
  document.getElementById('profile-email-input').value = userProfile.email || '';
  document.getElementById('profile-goal-select').value = userProfile.goal || '';
  document.getElementById('profile-display-name').textContent = userProfile.name || '—';
  document.getElementById('profile-email-label').textContent = userProfile.email || '—';
  const initials = (userProfile.name || '?').charAt(0).toUpperCase();
  document.getElementById('profile-avatar-initials').textContent = initials;
}

async function saveProfile() {
  const name = document.getElementById('profile-name-input').value.trim();
  const goal = document.getElementById('profile-goal-select').value;
  if (!name) { showToast('Le nom ne peut pas être vide'); return; }
  try {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, goal }),
    });
    const data = await res.json();
    if (data.ok) {
      userProfile.name = data.name;
      userProfile.goal = goal;
      setUserGreeting(data.name);
      loadProfile();
      showToast('Profil mis à jour !');
    }
  } catch { showToast('Erreur lors de la sauvegarde'); }
}

// Wire book filters
document.querySelectorAll('.books-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.books-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _bookFilter = btn.dataset.filter;
    renderBooks();
  });
});
