from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from datetime import datetime
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'zagro-dev-secret-key-change-in-prod')

database_url = os.environ.get('DATABASE_URL')
if database_url:
    # Railway uses postgres:// but SQLAlchemy requires postgresql://
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(os.path.dirname(__file__), 'data', 'zagro.db')

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'auth'

@app.before_request
def log_request():
    if '/auth/google' in request.url:
        app.logger.info(f"Request URL: {request.url}")
        app.logger.info(f"Request headers: {dict(request.headers)}")


# ── Models ────────────────────────────────────────────────────────

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(100), nullable=False)
    email      = db.Column(db.String(200), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    plan       = db.Column(db.String(20), default='free')
    goal          = db.Column(db.String(50),  default=None)   # 'masse', 'poids', 'endurance', 'bienetre'
    level         = db.Column(db.String(20),  default=None)   # 'debutant', 'intermediaire', 'avance'
    training_freq = db.Column(db.String(10),  default=None)   # '1-2', '3-4', '5+'
    onboarding_done = db.Column(db.Boolean,  default=False)
    book_goal  = db.Column(db.Integer, default=12)
    habits     = db.relationship('Habit', backref='user', lazy=True, cascade='all, delete-orphan')
    badges     = db.relationship('Badge', backref='user', lazy=True, cascade='all, delete-orphan')
    books      = db.relationship('Book', backref='user', lazy=True, cascade='all, delete-orphan')

class Habit(db.Model):
    __tablename__ = 'habits'
    id           = db.Column(db.Integer, primary_key=True)
    user_id      = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date         = db.Column(db.String(10), nullable=False)  # YYYY-MM-DD
    sleep        = db.Column(db.Float, nullable=False)
    sport        = db.Column(db.Boolean, nullable=False)
    water        = db.Column(db.Float, nullable=False)
    mood         = db.Column(db.Integer, nullable=False)
    productivity = db.Column(db.Integer, nullable=False)

class Badge(db.Model):
    __tablename__ = 'badges'
    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    badge_type  = db.Column(db.String(50), nullable=False)
    unlocked_at = db.Column(db.DateTime, default=datetime.utcnow)

class Book(db.Model):
    __tablename__ = 'books'
    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title       = db.Column(db.String(200), nullable=False)
    author      = db.Column(db.String(200), nullable=False, default='')
    status      = db.Column(db.String(20), nullable=False, default='a_lire')  # en_cours / termine / a_lire
    pages_total = db.Column(db.Integer, nullable=False, default=0)
    pages_read  = db.Column(db.Integer, nullable=False, default=0)
    rating      = db.Column(db.Integer, nullable=True)
    notes       = db.Column(db.Text, nullable=True)
    started_at  = db.Column(db.String(10), nullable=True)
    finished_at = db.Column(db.String(10), nullable=True)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

class WeeklyScore(db.Model):
    __tablename__ = 'weekly_scores'
    id            = db.Column(db.Integer, primary_key=True)
    user_id       = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    week_key      = db.Column(db.String(10), nullable=False)
    score         = db.Column(db.Integer, nullable=False, default=0)
    score_sleep   = db.Column(db.Integer, nullable=False, default=0)
    score_sport   = db.Column(db.Integer, nullable=False, default=0)
    score_regular = db.Column(db.Integer, nullable=False, default=0)
    updated_at    = db.Column(db.DateTime, default=datetime.utcnow)

class WorkoutCheck(db.Model):
    __tablename__ = 'workout_checks'
    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    week_key    = db.Column(db.String(8), nullable=False)   # e.g. '2025-W12'
    session_key = db.Column(db.String(50), nullable=False)  # e.g. 'masse_lundi'
    checked_at  = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ── Page Routes ───────────────────────────────────────────────────

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/auth')
def auth():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('auth.html')

@app.route('/pricing')
def pricing():
    return render_template('pricing.html')

@app.route('/legal')
def legal():
    return render_template('legal.html')

@app.route('/auth/google')
def google_login():
    import urllib.parse
    params = {
        'client_id': os.environ.get('GOOGLE_CLIENT_ID'),
        'redirect_uri': 'https://web-production-e98c6.up.railway.app/auth/google/callback',
        'response_type': 'code',
        'scope': 'openid email profile',
        'access_type': 'offline'
    }
    url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urllib.parse.urlencode(params)
    return redirect(url)

@app.route('/auth/google/callback')
def google_callback():
    import urllib.parse, requests as req
    code = request.args.get('code')
    token_resp = req.post('https://oauth2.googleapis.com/token', data={
        'code': code,
        'client_id': os.environ.get('GOOGLE_CLIENT_ID'),
        'client_secret': os.environ.get('GOOGLE_CLIENT_SECRET'),
        'redirect_uri': 'https://web-production-e98c6.up.railway.app/auth/google/callback',
        'grant_type': 'authorization_code'
    })
    tokens = token_resp.json()
    user_info = req.get('https://www.googleapis.com/oauth2/v2/userinfo',
        headers={'Authorization': f"Bearer {tokens['access_token']}"}).json()
    email = user_info.get('email', '').lower()
    name = user_info.get('name') or email.split('@')[0]
    if not email:
        return redirect(url_for('auth'))
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(name=name, email=email, password_hash='')
        db.session.add(user)
        db.session.commit()
    login_user(user, remember=True)
    return redirect(url_for('dashboard'))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/profile')
@login_required
def profile():
    return redirect(url_for('dashboard'))

@app.route('/api/profile', methods=['PUT'])
@login_required
def api_update_profile():
    data = request.get_json(force=True, silent=True) or {}
    name = (data.get('name') or '').strip()
    goal = data.get('goal')
    if name:
        current_user.name = name
    if goal in ('masse', 'poids', 'endurance', 'bienetre', ''):
        current_user.goal = goal or None
    db.session.commit()
    return jsonify({'ok': True, 'name': current_user.name.title()})

@app.errorhandler(404)
def not_found(e):
    return render_template('404.html'), 404

# ── Auth API ──────────────────────────────────────────────────────

@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json(force=True, silent=True) or {}
    name     = (data.get('name') or '').strip()
    email    = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not name or not email or not password:
        return jsonify({'error': 'Tous les champs sont requis.'}), 400
    if len(password) < 8:
        return jsonify({'error': 'Le mot de passe doit faire 8 caractères minimum.'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Cet email est déjà utilisé.'}), 409

    pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    user = User(name=name, email=email, password_hash=pw_hash)
    db.session.add(user)
    db.session.commit()
    login_user(user, remember=True)
    return jsonify({'ok': True, 'name': user.name.title()})

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json(force=True, silent=True) or {}
    email    = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        return jsonify({'error': 'Email ou mot de passe incorrect.'}), 401

    login_user(user, remember=True)
    return jsonify({'ok': True, 'name': user.name.title()})

@app.route('/api/me')
@login_required
def api_me():
    return jsonify({
        'name': current_user.name.title(),
        'email': current_user.email,
        'plan': current_user.plan,
        'goal': current_user.goal,
        'level': current_user.level,
        'training_freq': current_user.training_freq,
        'onboarding_done': current_user.onboarding_done,
    })

@app.route('/api/onboarding', methods=['POST'])
@login_required
def api_onboarding():
    data = request.get_json()
    current_user.goal          = data.get('goal')
    current_user.level         = data.get('level')
    current_user.training_freq = data.get('training_freq')
    current_user.onboarding_done = True
    db.session.commit()
    return jsonify({'ok': True})

@app.route('/api/workout/checks', methods=['GET'])
@login_required
def get_workout_checks():
    week_key = request.args.get('week')
    checks = WorkoutCheck.query.filter_by(user_id=current_user.id, week_key=week_key).all()
    return jsonify([c.session_key for c in checks])

@app.route('/api/workout/checks', methods=['POST'])
@login_required
def toggle_workout_check():
    data = request.get_json()
    week_key    = data.get('week_key')
    session_key = data.get('session_key')
    existing = WorkoutCheck.query.filter_by(
        user_id=current_user.id, week_key=week_key, session_key=session_key
    ).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({'checked': False})
    check = WorkoutCheck(user_id=current_user.id, week_key=week_key, session_key=session_key)
    db.session.add(check)
    db.session.commit()
    return jsonify({'checked': True})

# ── Habit API ─────────────────────────────────────────────────────

@app.route('/api/habits', methods=['GET'])
@login_required
def get_habits():
    habits = Habit.query.filter_by(user_id=current_user.id).order_by(Habit.date).all()
    return jsonify([_habit_dict(h) for h in habits])

@app.route('/api/habits', methods=['POST'])
@login_required
def add_habit():
    payload = request.get_json()
    today = datetime.now().strftime('%Y-%m-%d')

    # Upsert: remove existing entry for today
    Habit.query.filter_by(user_id=current_user.id, date=today).delete()

    habit = Habit(
        user_id=current_user.id,
        date=today,
        sleep=float(payload.get('sleep', 0)),
        sport=bool(payload.get('sport', False)),
        water=float(payload.get('water', 0)),
        mood=int(payload.get('mood', 5)),
        productivity=int(payload.get('productivity', 5)),
    )
    db.session.add(habit)
    db.session.commit()
    return jsonify({'status': 'ok', 'entry': _habit_dict(habit)})

@app.route('/api/analyse', methods=['GET'])
@login_required
def get_analyse():
    habits = Habit.query.filter_by(user_id=current_user.id).order_by(Habit.date).all()
    data = [_habit_dict(h) for h in habits]
    if len(data) < 3:
        return jsonify({'analyse': [], 'coach': "Commence à enregistrer tes habitudes pour recevoir des analyses personnalisées !", 'score': None, 'days_logged': len(data)})
    analyses = compute_correlations(data)
    coach_msg = generate_coach_message(data, goal=current_user.goal)
    score = compute_weekly_score(data)
    return jsonify({'analyse': analyses, 'coach': coach_msg, 'score': score, 'days_logged': len(data)})

@app.route('/api/dna')
@login_required
def get_dna():
    habits = Habit.query.filter_by(user_id=current_user.id).order_by(Habit.date).all()
    data = [_habit_dict(h) for h in habits]
    if len(data) < 3:
        return jsonify({'error': 'insufficient_data', 'days': len(data)})
    result = compute_dna_profile(data)
    return jsonify(result)

@app.route('/api/leaderboard')
@login_required
def get_leaderboard():
    week_key = get_current_week_key()

    # Compute and upsert current user's scores
    user_habits = Habit.query.filter_by(user_id=current_user.id).order_by(Habit.date).all()
    if user_habits:
        data = [_habit_dict(h) for h in user_habits]
        score = compute_weekly_score(data)
        last7 = data[-7:]
        if score is not None and last7:
            n7 = len(last7)
            def slp_sc(avg):
                if 7 <= avg <= 9: return 100
                elif 6 <= avg < 7 or 9 < avg <= 10: return 60
                else: return 20
            s_sleep   = round(slp_sc(sum(d['sleep'] for d in last7) / n7))
            s_sport   = round(sum(1 for d in last7 if d['sport']) / n7 * 100)
            s_regular = round(n7 / 7 * 100)
            ws = WeeklyScore.query.filter_by(user_id=current_user.id, week_key=week_key).first()
            if ws:
                ws.score = score; ws.score_sleep = s_sleep
                ws.score_sport = s_sport; ws.score_regular = s_regular
                ws.updated_at = datetime.utcnow()
            else:
                ws = WeeklyScore(user_id=current_user.id, week_key=week_key,
                                 score=score, score_sleep=s_sleep,
                                 score_sport=s_sport, score_regular=s_regular)
                db.session.add(ws)
            db.session.commit()

    cat = request.args.get('category', 'score')
    score_attr = {'score': 'score', 'sleep': 'score_sleep', 'sport': 'score_sport', 'regularity': 'score_regular'}.get(cat, 'score')
    all_scores = WeeklyScore.query.filter_by(week_key=week_key).order_by(getattr(WeeklyScore, score_attr).desc()).all()
    total = len(all_scores)
    current_rank = None
    ranked = []
    for rank, ws in enumerate(all_scores, 1):
        if ws.user_id == current_user.id:
            current_rank = rank
        ranked.append({
            'rank': rank,
            'warrior_name': f"Warrior #{rank}",
            'score': getattr(ws, score_attr),
            'is_current_user': ws.user_id == current_user.id,
        })

    if current_rank and total > 1:
        pct = current_rank / total
        if pct <= 0.1:   motivation = "Tu es dans l'élite ZAGRO 🏆"
        elif pct <= 0.5: motivation = "Continue, tu progresses bien"
        else:            motivation = "Chaque jour est une opportunité de grimper"
    else:
        motivation = "Continue à logger pour rejoindre le classement !"

    return jsonify({
        'leaderboard': ranked[:10],
        'current_rank': current_rank,
        'total_users': total,
        'motivation': motivation,
        'week_key': week_key,
    })

@app.route('/api/books', methods=['GET'])
@login_required
def get_books():
    books = Book.query.filter_by(user_id=current_user.id).order_by(Book.created_at.desc()).all()
    return jsonify({
        'books': [_book_dict(b) for b in books],
        'goal': current_user.book_goal or 12,
    })

@app.route('/api/books', methods=['POST'])
@login_required
def add_book():
    data = request.get_json()
    book = Book(
        user_id=current_user.id,
        title=data.get('title', '').strip(),
        author=data.get('author', '').strip(),
        status=data.get('status', 'a_lire'),
        pages_total=int(data.get('pages_total', 0)),
        pages_read=int(data.get('pages_read', 0)),
        rating=data.get('rating'),
        notes=data.get('notes', ''),
        started_at=data.get('started_at'),
        finished_at=data.get('finished_at'),
    )
    if not book.title:
        return jsonify({'error': 'Titre requis'}), 400
    db.session.add(book)
    db.session.commit()
    return jsonify({'ok': True, 'book': _book_dict(book)})

@app.route('/api/books/<int:book_id>', methods=['PUT'])
@login_required
def update_book(book_id):
    book = Book.query.filter_by(id=book_id, user_id=current_user.id).first_or_404()
    data = request.get_json()
    if 'title' in data:       book.title       = data['title'].strip()
    if 'author' in data:      book.author      = data['author'].strip()
    if 'status' in data:      book.status      = data['status']
    if 'pages_total' in data: book.pages_total = int(data['pages_total'])
    if 'pages_read' in data:  book.pages_read  = int(data['pages_read'])
    if 'rating' in data:      book.rating      = data['rating']
    if 'notes' in data:       book.notes       = data['notes']
    if 'started_at' in data:  book.started_at  = data['started_at']
    if 'finished_at' in data: book.finished_at = data['finished_at']
    db.session.commit()
    return jsonify({'ok': True, 'book': _book_dict(book)})

@app.route('/api/books/<int:book_id>', methods=['DELETE'])
@login_required
def delete_book(book_id):
    book = Book.query.filter_by(id=book_id, user_id=current_user.id).first_or_404()
    db.session.delete(book)
    db.session.commit()
    return jsonify({'ok': True})

@app.route('/api/books/goal', methods=['POST'])
@login_required
def set_book_goal():
    data = request.get_json()
    goal = int(data.get('goal', 12))
    current_user.book_goal = max(1, goal)
    db.session.commit()
    return jsonify({'ok': True, 'goal': current_user.book_goal})

def _book_dict(b):
    return {
        'id': b.id, 'title': b.title, 'author': b.author,
        'status': b.status, 'pages_total': b.pages_total,
        'pages_read': b.pages_read, 'rating': b.rating,
        'notes': b.notes, 'started_at': b.started_at,
        'finished_at': b.finished_at,
        'created_at': b.created_at.isoformat() if b.created_at else None,
    }

@app.route('/api/badges', methods=['GET'])
@login_required
def get_badges():
    badges = Badge.query.filter_by(user_id=current_user.id).all()
    return jsonify([{'badge_type': b.badge_type, 'unlocked_at': b.unlocked_at.isoformat()} for b in badges])

@app.route('/api/badges', methods=['POST'])
@login_required
def add_badge():
    data = request.get_json()
    badge_type = data.get('badge_type')
    if not badge_type:
        return jsonify({'error': 'badge_type required'}), 400
    existing = Badge.query.filter_by(user_id=current_user.id, badge_type=badge_type).first()
    if existing:
        return jsonify({'already_exists': True})
    badge = Badge(user_id=current_user.id, badge_type=badge_type)
    db.session.add(badge)
    db.session.commit()
    return jsonify({'ok': True, 'badge_type': badge_type})

# ── Helpers ───────────────────────────────────────────────────────

def _habit_dict(h):
    return {
        'date': h.date,
        'sleep': h.sleep,
        'sport': h.sport,
        'water': h.water,
        'mood': h.mood,
        'productivity': h.productivity,
    }

# ── Intelligence Layer ────────────────────────────────────────────

def pearson(xs, ys):
    n = len(xs)
    if n < 3:
        return 0
    mx, my = sum(xs) / n, sum(ys) / n
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    den = (sum((x - mx) ** 2 for x in xs) * sum((y - my) ** 2 for y in ys)) ** 0.5
    return num / den if den else 0

def compute_correlations(data):
    analyses = []
    recent = data[-30:]
    sleep  = [d['sleep'] for d in recent]
    sport  = [1 if d['sport'] else 0 for d in recent]
    water  = [d['water'] for d in recent]
    mood   = [d['mood'] for d in recent]
    prod   = [d['productivity'] for d in recent]

    pairs = [
        (sleep, mood,  'sleep', 'mood',  "Plus tu dors, meilleure est ton humeur 😴", "Le sommeil semble peu lié à ton humeur dans tes données."),
        (sleep, prod,  'sleep', 'prod',  "Un bon sommeil booste ta productivité 🚀", "Le sommeil n'impacte pas encore visiblement ta productivité."),
        (sport, mood,  'sport', 'mood',  "Le sport améliore significativement ton humeur 💪", "Le sport n'a pas encore d'effet notable sur ton humeur."),
        (sport, prod,  'sport', 'prod',  "Faire du sport les jours de productivité élevée est un pattern récurrent ⚡", "Pas de corrélation claire entre sport et productivité pour l'instant."),
        (water, mood,  'water', 'mood',  "Une bonne hydratation est associée à une meilleure humeur 💧", "L'hydratation ne semble pas encore affecter ton humeur."),
        (water, prod,  'water', 'prod',  "Boire plus d'eau est lié à une productivité accrue 💧", "L'hydratation et la productivité ne sont pas encore corrélées."),
        (mood,  prod,  'mood',  'prod',  "Ton humeur et ta productivité évoluent souvent ensemble 🔗", "Humeur et productivité semblent indépendantes dans tes données."),
    ]

    for xs, ys, xk, yk, pos_msg, neg_msg in pairs:
        if len(xs) < 5:
            continue
        r = pearson(xs, ys)
        strength = abs(r)
        if strength < 0.25:
            continue
        direction = 'positive' if r > 0 else 'negative'
        msg = pos_msg if r > 0 else neg_msg
        analyses.append({'message': msg, 'correlation': round(r, 2), 'strength': 'forte' if strength > 0.6 else 'modérée', 'direction': direction, 'x': xk, 'y': yk})

    analyses.sort(key=lambda i: abs(i['correlation']), reverse=True)
    return analyses[:5]

def compute_weekly_score(data):
    last7 = data[-7:]
    if not last7:
        return None
    scores = []
    for d in last7:
        s = 0
        if 7 <= d['sleep'] <= 9: s += 20
        elif 6 <= d['sleep'] < 7 or 9 < d['sleep'] <= 10: s += 12
        else: s += 5
        s += 20 if d['sport'] else 0
        s += min(20, int(d['water'] / 2.5 * 20))
        s += d['mood'] * 2
        s += d['productivity'] * 2
        scores.append(s)
    return round(sum(scores) / len(scores))

def generate_coach_message(data, goal=None):
    last7 = data[-7:]
    if len(last7) < 3:
        return "Continue à logger tes habitudes — j'ai besoin de plus de données pour te coacher !"
    avg_sleep = sum(d['sleep'] for d in last7) / len(last7)
    sport_days = sum(1 for d in last7 if d['sport'])
    avg_water = sum(d['water'] for d in last7) / len(last7)
    avg_mood = sum(d['mood'] for d in last7) / len(last7)
    avg_prod = sum(d['productivity'] for d in last7) / len(last7)
    lines = []
    if avg_sleep < 6.5: lines.append(f"⚠️ Tu dors en moyenne {avg_sleep:.1f}h — c'est insuffisant. Vise 7-8h pour booster ton énergie et ta concentration.")
    elif avg_sleep > 9.5: lines.append(f"😴 Tu dors {avg_sleep:.1f}h en moyenne. Un excès de sommeil peut indiquer de la fatigue chronique — vérifie ta qualité de nuit.")
    else: lines.append(f"✅ Ton sommeil est bien réglé à {avg_sleep:.1f}h en moyenne. Continue ainsi !")
    if sport_days == 0: lines.append("🏃 Aucune séance de sport cette semaine. Même 20 minutes de marche font une différence énorme sur l'humeur et la productivité.")
    elif sport_days <= 2: lines.append(f"💪 {sport_days} séance(s) de sport sur 7 jours. Essaie d'atteindre 3-4 séances pour sentir un vrai changement.")
    else: lines.append(f"🔥 {sport_days} séances de sport cette semaine — excellent ! Tu crées une habitude solide.")
    if avg_water < 1.5: lines.append(f"💧 Tu bois seulement {avg_water:.1f}L par jour. La déshydratation impacte directement ta concentration — vise 2L minimum.")
    elif avg_water >= 2.5: lines.append(f"💧 Super hydratation à {avg_water:.1f}L/jour — ton cerveau te remercie !")
    else: lines.append(f"💧 Hydratation correcte à {avg_water:.1f}L. Une petite bouteille de plus et tu es au top.")
    if avg_mood < 5: lines.append(f"🧠 Ton humeur moyenne est basse ({avg_mood:.1f}/10). Fais attention aux signaux de burnout.")
    elif avg_mood >= 8: lines.append(f"😊 Humeur excellente cette semaine ({avg_mood:.1f}/10) — capitalise sur cet élan !")
    if avg_prod >= 8: lines.append(f"⚡ Productivité au top ({avg_prod:.1f}/10) ! Identifie ce qui a fonctionné et répète-le.")
    elif avg_prod < 5: lines.append(f"📉 Productivité en berne ({avg_prod:.1f}/10). Regarde tes nuits et ton activité physique.")
    # Goal-specific advice
    goal_advice = {
        'masse':     f"🏋️ Pour ta prise de masse : assure-toi de dormir au moins 8h et de bien t'hydrater — la synthèse protéique se fait pendant le sommeil.",
        'poids':     f"🔥 Pour ta perte de poids : le déficit calorique compte, mais le sommeil régule la ghréline (hormone de la faim). Priorise tes nuits.",
        'endurance': f"🏃 Pour ton endurance : les séances longues nécessitent {2.0:.1f}L+ d'eau. Hydrate-toi avant, pendant et après.",
        'bienetre':  f"🧘 Pour ton bien-être : l'humeur est ton KPI principal. Continue à identifier ce qui te met dans un état positif.",
    }
    if goal and goal in goal_advice:
        lines.append(goal_advice[goal])
    return " ".join(lines)

def get_current_week_key():
    iso = datetime.utcnow().isocalendar()
    return f"{iso[0]}-W{iso[1]:02d}"

def compute_dna_profile(data):
    if not data:
        return None
    n = len(data)
    sleep_avg  = sum(d['sleep'] for d in data) / n
    sport_rate = sum(1 for d in data if d['sport']) / n
    water_avg  = sum(d['water'] for d in data) / n
    mood_avg   = sum(d['mood'] for d in data) / n
    prod_avg   = sum(d['productivity'] for d in data) / n

    def sleep_score(avg):
        if 7 <= avg <= 9: return 100
        elif 6 <= avg < 7: return 60 + (avg - 6) * 40
        elif 9 < avg <= 10: return 100 - (avg - 9) * 40
        elif avg < 6: return max(0, avg / 6 * 60)
        else: return max(0, 60 - (avg - 10) * 30)

    radar = {
        'sommeil':      round(sleep_score(sleep_avg)),
        'sport':        round(sport_rate * 100),
        'hydratation':  round(min(water_avg / 3.0, 1.0) * 100),
        'humeur':       round(mood_avg * 10),
        'productivite': round(prod_avg * 10),
    }

    if all(v >= 70 for v in radar.values()):
        profile = 'balanced'
    elif mood_avg >= 7.5 and prod_avg >= 7.5:
        profile = 'mental'
    elif sport_rate >= 0.7 and water_avg >= 2.0:
        profile = 'endurance'
    elif sleep_avg >= 7.5 and prod_avg >= 7.0:
        profile = 'morning'
    elif sleep_avg < 6.5 and prod_avg >= 7.0:
        profile = 'night'
    else:
        profile = 'recovering'

    profiles = {
        'morning':   {'name': 'MORNING WARRIOR',    'emoji': '🌅', 'color': '#FFD700', 'desc': "Tu maximises ton sommeil pour performer. Tu attaques la journée avec énergie. Le repos est ton arme secrète."},
        'night':     {'name': 'NIGHT MACHINE',       'emoji': '⚡', 'color': '#FF9500', 'desc': "Tu fonctionnes différemment — moins de sommeil, performance qui reste haute. Ton corps s'est adapté."},
        'endurance': {'name': 'ENDURANCE BEAST',     'emoji': '🦁', 'color': '#FFD700', 'desc': "Tu es la machine qui ne s'arrête pas. Sport quotidien, hydratation au top — le carburant parfait."},
        'mental':    {'name': 'MENTAL CHAMPION',     'emoji': '🧠', 'color': '#FFD700', 'desc': "Ton atout c'est l'esprit. Humeur et productivité au top — tu maîtrises ton état intérieur."},
        'recovering':{'name': 'RECOVERING ATHLETE',  'emoji': '🔄', 'color': '#FF3333', 'desc': "Tu es en phase de reconstruction. Irrégularité détectée — concentre-toi sur la constance avant la performance."},
        'balanced':  {'name': 'BALANCED PERFORMER',  'emoji': '⚖️', 'color': '#FFD700', 'desc': "Tu as trouvé l'équilibre parfait. Toutes tes métriques sont au vert — la performance durable par la cohérence."},
    }

    return {
        'profile': profile,
        'profile_data': profiles[profile],
        'radar': radar,
        'averages': {
            'sleep': round(sleep_avg, 1),
            'sport_rate': round(sport_rate * 100),
            'water': round(water_avg, 1),
            'mood': round(mood_avg, 1),
            'prod': round(prod_avg, 1),
        },
        'days': n,
    }

# ── DB Init ───────────────────────────────────────────────────────

with app.app_context():
    os.makedirs(os.path.join(os.path.dirname(__file__), 'data'), exist_ok=True)
    db.metadata.create_all(db.engine, checkfirst=True)

    # ── Column migrations (add new columns to existing tables) ──────
    with db.engine.connect() as conn:
        existing = [row[1] for row in conn.execute(db.text("PRAGMA table_info(users)")).fetchall()]
        migrations = [
            ("goal",            "VARCHAR(50)  DEFAULT NULL"),
            ("level",           "VARCHAR(20)  DEFAULT NULL"),
            ("training_freq",   "VARCHAR(10)  DEFAULT NULL"),
            ("onboarding_done", "BOOLEAN      DEFAULT 0"),
        ]
        migrations = migrations + [("book_goal", "INTEGER DEFAULT 12")]
        for col, definition in migrations:
            if col not in existing:
                conn.execute(db.text(f"ALTER TABLE users ADD COLUMN {col} {definition}"))
        conn.commit()

        # Migrate weekly_scores table
        ws_cols = [row[1] for row in conn.execute(db.text("PRAGMA table_info(weekly_scores)")).fetchall()]
        for col, defn in [('score_sleep','INTEGER DEFAULT 0'),('score_sport','INTEGER DEFAULT 0'),('score_regular','INTEGER DEFAULT 0')]:
            if ws_cols and col not in ws_cols:
                conn.execute(db.text(f"ALTER TABLE weekly_scores ADD COLUMN {col} {defn}"))
        conn.commit()

if __name__ == '__main__':
    is_production = os.environ.get('FLASK_ENV') == 'production'
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=not is_production, host='0.0.0.0', port=port)
