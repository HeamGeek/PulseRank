/**
 * PulseRank (Liftoff Replica) Engine - Senior Build
 */

// --- Database & State ---
const EXERCISES = [
    // CHEST
    { id: 'bench_press', name: 'Barbell Bench Press (Competition)', muscle: 'Chest', type: 'Compound Free', multiplier: 1.0, xpMod: 1.5 },
    { id: 'pause_bench', name: 'Paused Barbell Bench Press', muscle: 'Chest', type: 'Compound Free', multiplier: 1.05, xpMod: 1.55 },
    { id: 'close_grip_bench', name: 'Close-Grip Barbell Bench Press', muscle: 'Chest', type: 'Compound Free', multiplier: 0.95, xpMod: 1.45 },
    { id: 'db_bench', name: 'Dumbbell Bench Press', muscle: 'Chest', type: 'Compound Free', multiplier: 0.85, xpMod: 1.2 },
    { id: 'incline_bench', name: 'Incline Barbell Press', muscle: 'Chest', type: 'Compound Free', multiplier: 0.8, xpMod: 1.2 },
    { id: 'chest_press_mach', name: 'Chest Press Machine', muscle: 'Chest', type: 'Compound Machine', multiplier: 1.2, xpMod: 1.0 },
    { id: 'incline_smith_press', name: 'Incline Smith Machine Press', muscle: 'Chest', type: 'Compound Machine', multiplier: 1.05, xpMod: 1.1 },
    { id: 'hammer_chest', name: 'Hammer Strength Chest', muscle: 'Chest', type: 'Compound Machine', multiplier: 1.3, xpMod: 1.0 },
    { id: 'pec_deck', name: 'Pec Deck Fly', muscle: 'Chest', type: 'Isolation Machine', multiplier: 0.6, xpMod: 0.6 },
    { id: 'cable_cross', name: 'Cable Crossover', muscle: 'Chest', type: 'Isolation Cable', multiplier: 0.5, xpMod: 0.6 },
    
    // BACK
    { id: 'deadlift', name: 'Barbell Deadlift (Conventional)', muscle: 'Back', type: 'Compound Free', multiplier: 1.6, xpMod: 2.0 },
    { id: 'sumo_deadlift', name: 'Barbell Deadlift (Sumo)', muscle: 'Back', type: 'Compound Free', multiplier: 1.65, xpMod: 2.0 },
    { id: 'romanian_deadlift', name: 'Romanian Deadlift', muscle: 'Back', type: 'Compound Free', multiplier: 1.25, xpMod: 1.6 },
    { id: 'pullup', name: 'Pull-up (Weighted)', muscle: 'Back', type: 'Compound Bodyweight', multiplier: 1.2, xpMod: 1.5 },
    { id: 'bb_row', name: 'Barbell Row', muscle: 'Back', type: 'Compound Free', multiplier: 1.1, xpMod: 1.5 },
    { id: 'tbar_row', name: 'T-Bar Row', muscle: 'Back', type: 'Compound Machine', multiplier: 1.3, xpMod: 1.2 },
    { id: 'iso_row_machine', name: 'Iso-Lateral Row Machine', muscle: 'Back', type: 'Compound Machine', multiplier: 1.2, xpMod: 1.1 },
    { id: 'assisted_pullup', name: 'Assisted Pull-up Machine', muscle: 'Back', type: 'Compound Machine', multiplier: 0.8, xpMod: 1.0 },
    { id: 'lat_pulldown', name: 'Lat Pulldown', muscle: 'Back', type: 'Compound Machine', multiplier: 0.9, xpMod: 1.0 },
    { id: 'cable_row', name: 'Seated Cable Row', muscle: 'Back', type: 'Compound Cable', multiplier: 1.0, xpMod: 1.0 },
    
    // LEGS
    { id: 'squat', name: 'Barbell Squat', muscle: 'Legs', type: 'Compound Free', multiplier: 1.4, xpMod: 2.0 },
    { id: 'front_squat', name: 'Front Squat', muscle: 'Legs', type: 'Compound Free', multiplier: 1.1, xpMod: 1.8 },
    { id: 'hack_squat', name: 'Hack Squat Machine', muscle: 'Legs', type: 'Compound Machine', multiplier: 1.5, xpMod: 1.5 },
    { id: 'smith_squat', name: 'Smith Machine Squat', muscle: 'Legs', type: 'Compound Machine', multiplier: 1.3, xpMod: 1.4 },
    { id: 'leg_press', name: 'Leg Press', muscle: 'Legs', type: 'Compound Machine', multiplier: 1.7, xpMod: 1.2 },
    { id: 'leg_ext', name: 'Leg Extension', muscle: 'Legs', type: 'Isolation Machine', multiplier: 0.8, xpMod: 0.6 },
    { id: 'leg_curl', name: 'Seated Leg Curl', muscle: 'Legs', type: 'Isolation Machine', multiplier: 0.7, xpMod: 0.6 },
    { id: 'calf_raise', name: 'Seated Calf Raise', muscle: 'Legs', type: 'Isolation Machine', multiplier: 1.0, xpMod: 0.4 },
    
    // SHOULDERS
    { id: 'ohp', name: 'Overhead Press', muscle: 'Shoulders', type: 'Compound Free', multiplier: 0.65, xpMod: 1.5 },
    { id: 'shoulder_press_machine', name: 'Shoulder Press Machine', muscle: 'Shoulders', type: 'Compound Machine', multiplier: 0.7, xpMod: 1.2 },
    { id: 'db_shoulder', name: 'Dumbbell Shoulder Press', muscle: 'Shoulders', type: 'Compound Free', multiplier: 0.55, xpMod: 1.2 },
    { id: 'lat_raise', name: 'Lateral Raise', muscle: 'Shoulders', type: 'Isolation Free', multiplier: 0.2, xpMod: 0.5 },
    { id: 'cable_lat_raise', name: 'Cable Lateral Raise', muscle: 'Shoulders', type: 'Isolation Cable', multiplier: 0.15, xpMod: 0.5 },
    { id: 'rev_pec_deck', name: 'Reverse Pec Deck', muscle: 'Shoulders', type: 'Isolation Machine', multiplier: 0.4, xpMod: 0.5 },
    
    // ARMS
    { id: 'bb_curl', name: 'Barbell Bicep Curl', muscle: 'Arms', type: 'Isolation Free', multiplier: 0.4, xpMod: 0.6 },
    { id: 'preacher_mach', name: 'Preacher Curl Machine', muscle: 'Arms', type: 'Isolation Machine', multiplier: 0.45, xpMod: 0.5 },
    { id: 'tri_pushdown', name: 'Tricep Pushdown', muscle: 'Arms', type: 'Isolation Cable', multiplier: 0.5, xpMod: 0.5 },
    { id: 'assist_dip_machine', name: 'Assisted Dip Machine', muscle: 'Arms', type: 'Compound Machine', multiplier: 0.7, xpMod: 0.9 },
    { id: 'skullcrusher', name: 'Skullcrushers', muscle: 'Arms', type: 'Isolation Free', multiplier: 0.4, xpMod: 0.6 }
];

const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms'];

function parseHistoryFromStorage() {
    try {
        const raw = JSON.parse(localStorage.getItem('pulse_history'));
        return Array.isArray(raw) ? raw : [];
    } catch {
        return [];
    }
}

const STATE = {
    user: {
        name: localStorage.getItem('pulse_name') || '',
        age: parseInt(localStorage.getItem('pulse_age')) || null,
        bw: parseFloat(localStorage.getItem('pulse_bw')) || null,
        level: parseInt(localStorage.getItem('pulse_level')) || 1,
        xp: parseInt(localStorage.getItem('pulse_xp')) || 0
    },
    history: parseHistoryFromStorage(),
    currentSessionSets: [] // Volatile, today's workout
};

function saveState() {
    if (STATE.user.name) localStorage.setItem('pulse_name', STATE.user.name);
    else localStorage.removeItem('pulse_name');

    if (STATE.user.age) localStorage.setItem('pulse_age', STATE.user.age);
    else localStorage.removeItem('pulse_age');

    if (STATE.user.bw) localStorage.setItem('pulse_bw', STATE.user.bw);
    else localStorage.removeItem('pulse_bw');

    localStorage.setItem('pulse_level', STATE.user.level);
    localStorage.setItem('pulse_xp', STATE.user.xp);
    localStorage.setItem('pulse_history', JSON.stringify(STATE.history));
}

// --- Ranking Math (Expanded to Apex) ---
const TIERS = [
    { name: 'Unranked', th: 0, color: 'unranked', icon: 'user' },
    { name: 'Bronze', th: 0.5, color: 'bronze', icon: 'flame' },
    { name: 'Silver', th: 0.75, color: 'silver', icon: 'flame' },
    { name: 'Gold', th: 1.0, color: 'gold', icon: 'trophy' },
    { name: 'Platinum', th: 1.3, color: 'platinum', icon: 'trophy' },
    { name: 'Titanium', th: 1.6, color: 'titanium', icon: 'trophy' },
    { name: 'Diamond', th: 2.0, color: 'diamond', icon: 'heart' },
    { name: 'Master', th: 2.3, color: 'master', icon: 'spark' },
    { name: 'Grandmaster', th: 2.6, color: 'grandmaster', icon: 'shield' },
    { name: 'Apex', th: 3.0, color: 'apex', icon: 'spark' }
];

function calc1RM(weight, reps) {
    if (!Number.isFinite(weight) || !Number.isFinite(reps) || weight <= 0 || reps <= 0) return null;
    if (reps === 1) return weight;

    // Epley is strongest up to around 10 reps; Brzycki is often preferred above that range.
    if (reps <= 10) return weight * (1 + reps / 30);
    if (reps >= 36) return null;
    return weight * (36 / (37 - reps));
}

function getRank(oneRM, bw, multiplier) {
    if (!bw || !oneRM || !multiplier) return { fullName: 'Unranked', colorClass: 'rank-unranked', icon: 'user', ratio: 0 };
    
    // Normalize to standard Bench Press equivalent
    const ratio = (oneRM / bw) / multiplier;
    
    let currentTier = TIERS[0];
    let nextTier = TIERS[1];
    
    for (let i = 0; i < TIERS.length; i++) {
        if (ratio >= TIERS[i].th) {
            currentTier = TIERS[i];
            nextTier = TIERS[i+1] || TIERS[i];
        } else {
            break;
        }
    }

    let subTier = 'I';
    if (currentTier.name !== 'Unranked' && currentTier.name !== 'Apex') {
        const progress = (ratio - currentTier.th) / (nextTier.th - currentTier.th);
        if (progress > 0.66) subTier = 'III';
        else if (progress > 0.33) subTier = 'II';
    }

    const fullName = (currentTier.name === 'Unranked' || currentTier.name === 'Apex') ? currentTier.name : `${currentTier.name} ${subTier}`;
    
    return {
        tier: currentTier.name,
        subTier,
        fullName,
        colorClass: `rank-${currentTier.color}`,
        icon: currentTier.icon,
        ratio: ratio
    };
}

function getExerciseById(exerciseId) {
    return EXERCISES.find(ex => ex.id === exerciseId);
}

function getRecordRatio(log) {
    if (Number.isFinite(log?.ratio)) return log.ratio;

    const ex = getExerciseById(log?.exerciseId);
    const oneRM = Number.isFinite(log?.oneRM) ? log.oneRM : calc1RM(Number(log?.weight), Number(log?.reps));
    if (!ex || !STATE.user.bw || !oneRM) return 0;

    return (oneRM / STATE.user.bw) / ex.multiplier;
}

function getRecordRank(log) {
    if (log?.rank?.fullName && log?.rank?.colorClass) return log.rank;

    const ex = getExerciseById(log?.exerciseId);
    const oneRM = Number.isFinite(log?.oneRM) ? log.oneRM : calc1RM(Number(log?.weight), Number(log?.reps));
    if (!ex || !oneRM) {
        return { fullName: 'Unranked', colorClass: 'rank-unranked', icon: 'user', ratio: 0 };
    }

    return getRank(oneRM, STATE.user.bw, ex.multiplier);
}

function computeStreakDays() {
    if (STATE.history.length === 0) return 0;

    const dayKeys = [...new Set(STATE.history.map(item => {
        const d = new Date(item.date);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }))].sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    for (const key of dayKeys) {
        const [year, month, day] = key.split('-').map(Number);
        const sample = new Date(year, month, day);
        if (sample.getTime() === cursor.getTime()) {
            streak++;
            cursor.setDate(cursor.getDate() - 1);
            continue;
        }

        // Allow no-gap start from yesterday.
        if (streak === 0) {
            const yesterday = new Date();
            yesterday.setHours(0, 0, 0, 0);
            yesterday.setDate(yesterday.getDate() - 1);
            if (sample.getTime() === yesterday.getTime()) {
                streak++;
                cursor = new Date(yesterday);
                cursor.setDate(cursor.getDate() - 1);
                continue;
            }
        }
        break;
    }

    return streak;
}

function getBadgeProgress() {
    const bestRatio = STATE.history.reduce((max, item) => Math.max(max, getRecordRatio(item)), 0);
    const streak = computeStreakDays();
    const setCount = STATE.history.length;
    const muscleGroups = new Set(
        STATE.history
            .map(item => getExerciseById(item.exerciseId))
            .filter(Boolean)
            .map(ex => ex.muscle)
    ).size;

    return [
        { title: 'Starter', detail: 'Log your first set', icon: 'plus', unlocked: setCount >= 1 },
        { title: 'Consistent', detail: 'Train 3 days streak', icon: 'clock', unlocked: streak >= 3 },
        { title: 'Gold Standard', detail: 'Hit 1.0 ratio', icon: 'trophy', unlocked: bestRatio >= 1.0 },
        { title: 'Titan Build', detail: 'Hit 1.6 ratio', icon: 'shield', unlocked: bestRatio >= 1.6 },
        { title: 'Balanced', detail: 'Train 5 muscle groups', icon: 'heart', unlocked: muscleGroups >= 5 }
    ];
}

function getBestExerciseRecord() {
    if (STATE.history.length === 0) return null;

    const bestByExercise = new Map();
    STATE.history.forEach(item => {
        const ratio = getRecordRatio(item);
        const existing = bestByExercise.get(item.exerciseId);
        if (!existing || ratio > getRecordRatio(existing)) {
            bestByExercise.set(item.exerciseId, item);
        }
    });

    let best = null;
    bestByExercise.forEach(item => {
        if (!best || getRecordRatio(item) > getRecordRatio(best)) {
            best = item;
        }
    });

    return best;
}

function getSuggestedExerciseForMuscle(muscle) {
    const preferred = {
        Chest: 'bench_press',
        Back: 'deadlift',
        Legs: 'squat',
        Shoulders: 'ohp',
        Arms: 'tri_pushdown'
    };

    const preferredId = preferred[muscle];
    const direct = EXERCISES.find(ex => ex.id === preferredId);
    if (direct) return direct;

    return EXERCISES.find(ex => ex.muscle === muscle) || EXERCISES[0];
}

function getMuscleStrengthScores() {
    const results = MUSCLE_GROUPS.map(muscle => {
        const logs = STATE.history.filter(item => {
            const ex = getExerciseById(item.exerciseId);
            return ex?.muscle === muscle;
        });

        if (logs.length === 0) {
            return {
                muscle,
                score: 0,
                ratio: 0,
                volume: 0,
                suggestion: 'Start with 2 quality working sets this week.'
            };
        }

        const ratios = logs.map(getRecordRatio).filter(r => Number.isFinite(r) && r > 0).sort((a, b) => b - a);
        const topRatios = ratios.slice(0, Math.min(3, ratios.length));
        const avgTopRatio = topRatios.length ? topRatios.reduce((sum, val) => sum + val, 0) / topRatios.length : 0;

        const recent21Logs = logs.filter(item => {
            const t = new Date(item.date).getTime();
            if (!Number.isFinite(t)) return false;
            return (Date.now() - t) <= (21 * 24 * 60 * 60 * 1000);
        });
        const activeDays = new Set(recent21Logs.map(item => {
            const d = new Date(item.date);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        })).size;

        const recentLogs = logs.slice(0, 12);
        const volume = recentLogs.reduce((sum, item) => sum + ((Number(item.weight) || 0) * (Number(item.reps) || 0)), 0);
        const volumeNorm = Math.min(1, volume / 3500);
        const frequencyNorm = Math.min(1, activeDays / 6);

        const ratioScore = Math.min(1, avgTopRatio / 2.2);
        const score = Math.round((ratioScore * 65) + (volumeNorm * 15) + (frequencyNorm * 20));

        let suggestion = 'Keep progressive overload steady by adding a small load or 1 rep.';
        if (score < 35) suggestion = 'Build frequency: train this muscle 2-3x weekly with controlled tempo.';
        else if (score < 55) suggestion = 'Prioritize one heavy compound and one machine accessory here.';
        else if (score < 75) suggestion = 'Add one top set near RPE 8-9, then back-off volume.';

        return { muscle, score, ratio: avgTopRatio, volume, suggestion };
    });

    return results;
}

// --- Insights Engine ---
function generateInsights() {
    if (STATE.history.length < 3) return null;

    const scored = getMuscleStrengthScores().filter(item => item.score > 0);
    if (scored.length < 2) return null;

    const strongest = [...scored].sort((a, b) => b.score - a.score)[0];
    const weakest = [...scored].sort((a, b) => a.score - b.score)[0];

    return { strongest, weakest };
}

// --- DOM & Routing ---
const $root = document.getElementById('screen-root');
const $modalRoot = document.getElementById('modal-root');
const $toastRoot = document.getElementById('toast-root');

function showToast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    $toastRoot.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

function showModal(contentHTML) {
    $modalRoot.innerHTML = `
        <div class="modal-overlay" onclick="closeModal(event)">
            <div class="modal-content glass-card" onclick="event.stopPropagation()">
                ${contentHTML}
            </div>
        </div>
    `;
}

window.closeModal = (e) => {
    $modalRoot.innerHTML = '';
};

function navigateTo(viewId) {
    if (!STATE.user.bw && viewId !== 'setup') {
        viewId = 'setup';
    }

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    const bottomNav = document.querySelector('.bottom-nav');
    const header = document.querySelector('.app-header');
    const rootEl = document.getElementById('screen-root');
    if (viewId === 'setup') {
        if (bottomNav) bottomNav.style.display = 'none';
        if (header) header.style.display = 'none';
        if (rootEl) rootEl.style.padding = '20px';
    } else {
        if (bottomNav) bottomNav.style.display = 'flex';
        if (header) header.style.display = 'flex';
        if (rootEl) rootEl.style.padding = '';
    }

    if (VIEWS[viewId]) {
        $root.innerHTML = '';
        window.scrollTo(0, 0);
        VIEWS[viewId]();
    }
}

// --- Views ---
const VIEWS = {
    setup: () => {
        let authMode = 'demo'; // 'login', 'register', 'demo'
        
        const renderAuth = () => {
            let formHTML = '';
            
            if (authMode === 'login') {
                formHTML = `
                    <div class="input-group anim-fade-in">
                        <label class="input-label">Email</label>
                        <input type="email" id="auth-email" class="premium-input" placeholder="athlete@pulserank.com">
                    </div>
                    <div class="input-group anim-fade-in" style="animation-delay: 0.1s;">
                        <label class="input-label">Password</label>
                        <input type="password" id="auth-pass" class="premium-input" placeholder="••••••••">
                    </div>
                    <button class="btn btn-primary anim-fade-in" style="animation-delay: 0.2s;" onclick="appAuthAction('login')">Login</button>
                `;
            } else if (authMode === 'register') {
                formHTML = `
                    <div class="input-group anim-fade-in">
                        <label class="input-label">Email</label>
                        <input type="email" id="auth-email" class="premium-input" placeholder="athlete@pulserank.com">
                    </div>
                    <div class="input-group anim-fade-in" style="animation-delay: 0.05s;">
                        <label class="input-label">Password</label>
                        <input type="password" id="auth-pass" class="premium-input" placeholder="••••••••">
                    </div>
                    <div class="input-group anim-fade-in" style="animation-delay: 0.1s;">
                        <label class="input-label">Display Name</label>
                        <input type="text" id="auth-name" class="premium-input" placeholder="Your Name">
                    </div>
                    <div class="auth-row">
                        <div class="input-group anim-fade-in" style="flex:1; animation-delay: 0.15s;">
                            <label class="input-label">Age</label>
                            <input type="number" id="auth-age" class="premium-input" placeholder="e.g. 25">
                        </div>
                        <div class="input-group anim-fade-in" style="flex:1; animation-delay: 0.15s;">
                            <label class="input-label">Bodyweight (kg)</label>
                            <input type="number" id="auth-bw" class="premium-input" placeholder="e.g. 75">
                        </div>
                    </div>
                    <button class="btn btn-primary anim-fade-in" style="animation-delay: 0.2s;" onclick="appAuthAction('register')">Register</button>
                `;
            } else {
                formHTML = `
                    <div class="input-group anim-fade-in">
                        <label class="input-label">Display Name</label>
                        <input type="text" id="auth-name" class="premium-input" placeholder="Your Name" value="${STATE.user.name}">
                    </div>
                    <div class="auth-row">
                        <div class="input-group anim-fade-in" style="flex:1; animation-delay: 0.05s;">
                            <label class="input-label">Age</label>
                            <input type="number" id="auth-age" class="premium-input" placeholder="e.g. 25" value="${STATE.user.age || ''}">
                        </div>
                        <div class="input-group anim-fade-in" style="flex:1; animation-delay: 0.05s;">
                            <label class="input-label">Bodyweight (kg)</label>
                            <input type="number" id="auth-bw" class="premium-input" placeholder="e.g. 75" value="${STATE.user.bw || ''}">
                        </div>
                    </div>
                    <button class="btn btn-primary anim-fade-in" style="animation-delay: 0.1s;" onclick="appAuthAction('demo')">Enter Demo Mode</button>
                `;
            }

            $root.innerHTML = `
                <div class="setup-view anim-fade-in">
                    <div class="setup-container">
                        <div class="brand-mark" style="width: 64px; height: 64px; font-size: 32px; margin-bottom: 20px;">P</div>
                        <h1 class="typography-display text-gradient" style="margin-bottom: 8px;">PulseRank</h1>
                        <p style="margin-bottom: 24px; color:var(--text-secondary);">Gym progress, ranked. Sign in or try the demo.</p>
                        
                        <div class="auth-tabs">
                            <button class="auth-tab ${authMode === 'login' ? 'active' : ''}" onclick="appSetAuthMode('login')">Login</button>
                            <button class="auth-tab ${authMode === 'register' ? 'active' : ''}" onclick="appSetAuthMode('register')">Register</button>
                            <button class="auth-tab ${authMode === 'demo' ? 'active' : ''}" onclick="appSetAuthMode('demo')">Demo</button>
                        </div>

                        <div class="glass-card auth-card">
                            ${formHTML}
                        </div>
                    </div>
                </div>
            `;
        };

        window.appSetAuthMode = (mode) => {
            authMode = mode;
            renderAuth();
        };

        window.appAuthAction = (mode) => {
            if (mode === 'login') {
                const email = document.getElementById('auth-email').value;
                const pass = document.getElementById('auth-pass').value;
                if (!email || !pass) {
                    showToast("Please enter email and password.");
                    return;
                }
                showToast("Database not connected. Use Demo Mode.");
            } else if (mode === 'register') {
                const email = document.getElementById('auth-email').value;
                const pass = document.getElementById('auth-pass').value;
                const name = document.getElementById('auth-name').value;
                const age = parseInt(document.getElementById('auth-age').value);
                const bw = parseFloat(document.getElementById('auth-bw').value);
                
                if (!email || !pass || !name || !age || !bw) {
                    showToast("Please fill all fields.");
                    return;
                }
                if (bw < 30 || age <= 0) {
                    showToast("Please enter a valid age and bodyweight.");
                    return;
                }
                showToast("Database not connected. Use Demo Mode.");
            } else {
                const name = document.getElementById('auth-name').value;
                const age = parseInt(document.getElementById('auth-age').value);
                const bw = parseFloat(document.getElementById('auth-bw').value);
                
                if (!age || !bw || bw < 30 || age <= 0) {
                    showToast("Please enter valid age and bodyweight.");
                    return;
                }

                STATE.user.name = name || 'Athlete';
                STATE.user.age = age;
                STATE.user.bw = bw;
                saveState();
                showToast("Welcome to PulseRank Demo!");
                navigateTo('dashboard');
            }
        };

        renderAuth();
    },

    dashboard: () => {
        let bestRankHTML = '<div class="value rank-unranked">--</div>';
        let totalWorkouts = STATE.history.length;
        
        if (totalWorkouts > 0) {
            const sorted = [...STATE.history].sort((a, b) => getRecordRatio(b) - getRecordRatio(a));
            const best = getRecordRank(sorted[0]);
            bestRankHTML = `<div class="value ${best.colorClass}">${best.fullName}</div>`;
        }

        // Calculate XP Progress
        const xpRequired = STATE.user.level * 500; // Scaling difficulty
        const progressPct = Math.min((STATE.user.xp / xpRequired) * 100, 100);

        let insightsHTML = '';
        const insights = generateInsights();
        if (insights) {
            insightsHTML = `
                <div class="glass-card anim-slide-up" style="animation-delay: 0.1s;">
                    <h2 class="typography-display" style="font-size:16px; margin-bottom:12px;">Performance Insights</h2>
                    <div class="insight-card insight-positive">
                        <div class="insight-icon"><svg style="width:20px;height:20px;"><use href="#icon-spark"></use></svg></div>
                        <div class="insight-text">
                            <h3>Strongest: ${insights.strongest.muscle} (${insights.strongest.score}/100)</h3>
                            <p>High force output and volume consistency in this muscle group.</p>
                        </div>
                    </div>
                    <div class="insight-card insight-negative" style="margin-top:8px;">
                        <div class="insight-icon"><svg style="width:20px;height:20px;"><use href="#icon-chart"></use></svg></div>
                        <div class="insight-text">
                            <h3>Needs Focus: ${insights.weakest.muscle} (${insights.weakest.score}/100)</h3>
                            <p>${insights.weakest.suggestion}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        const muscleScores = getMuscleStrengthScores();
        const muscleCardsHTML = muscleScores.map(item => {
            return `
                <div class="muscle-score-card">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <strong>${item.muscle}</strong>
                        <span class="muscle-score-value">${item.score}/100</span>
                    </div>
                    <div class="score-meter"><div class="score-meter-fill" style="width:${item.score}%"></div></div>
                    <div class="muscle-score-meta">Ratio ${item.ratio.toFixed(2)} • Vol ${Math.round(item.volume)}</div>
                    <p class="muscle-score-tip">${item.suggestion}</p>
                    <button class="btn btn-outline btn-sm" onclick="appTrainMuscle('${item.muscle}')">Train ${item.muscle}</button>
                </div>
            `;
        }).join('');

        const bestExerciseRecord = getBestExerciseRecord();
        let bestExercisePRHTML = '<div class="glass-card" style="text-align:center;"><p>No PR yet. Log your first quality set.</p></div>';
        if (bestExerciseRecord) {
            const rank = getRecordRank(bestExerciseRecord);
            const ratio = getRecordRatio(bestExerciseRecord);
            bestExercisePRHTML = `
                <div class="glass-card best-pr-card anim-slide-up">
                    <div>
                        <div class="label">Best Exercise PR</div>
                        <div class="best-pr-name">${bestExerciseRecord.exerciseName}</div>
                        <div class="best-pr-sub">${bestExerciseRecord.weight}kg x ${bestExerciseRecord.reps} • Est 1RM ${Math.round(bestExerciseRecord.oneRM)}kg</div>
                    </div>
                    <div style="text-align:right;">
                        <div class="${rank.colorClass} typography-display" style="font-size:18px;">${rank.fullName}</div>
                        <div class="best-pr-ratio">Ratio ${ratio.toFixed(2)}</div>
                    </div>
                </div>
            `;
        }

        const badges = getBadgeProgress();
        const badgesHTML = badges.map(badge => `
            <div class="badge-pill ${badge.unlocked ? 'badge-pill--unlocked' : ''}">
                <svg><use href="#icon-${badge.icon}"></use></svg>
                <div>
                    <strong>${badge.title}</strong>
                    <small>${badge.detail}</small>
                </div>
            </div>
        `).join('');

        const visualLevel = Math.min(Math.max(STATE.user.level, 1), 5);
        const levelTrack = [1, 2, 3, 4, 5].map(level => {
            const stateClass = level < visualLevel ? 'level-node--done' : (level === visualLevel ? 'level-node--current' : '');
            return `<div class="level-node ${stateClass}">Lv ${level}</div>`;
        }).join('');

        $root.innerHTML = `
            <div class="anim-fade-in">
                <div class="dash-header">
                    <div>
                        <h1 class="typography-display">${STATE.user.name}</h1>
                        <p style="color: var(--text-secondary); font-size:13px;">Consistency Level ${STATE.user.level}</p>
                    </div>
                    <div style="text-align:center;">
                        <div class="user-level-ring">
                            <svg style="width:24px;height:24px; color:var(--text-secondary);"><use href="#icon-shield"></use></svg>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom:24px;">
                    <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--text-secondary);">
                        <span>Level ${STATE.user.level}</span>
                        <span>${Math.round(STATE.user.xp)} / ${xpRequired} XP</span>
                    </div>
                    <div class="level-progress-bar">
                        <div class="level-progress-fill" style="width: ${progressPct}%"></div>
                    </div>
                </div>

                <div class="level-row-wrap">${levelTrack}</div>

                <h2 class="typography-display" style="font-size:16px; margin-bottom:10px;">Badges</h2>
                <div class="badges-row">${badgesHTML}</div>

                <div class="stat-grid">
                    <div class="glass-card stat-box">
                        <div class="label">Apex Rank</div>
                        ${bestRankHTML}
                    </div>
                    <div class="glass-card stat-box">
                        <div class="label">Sets Logged</div>
                        <div class="value">${totalWorkouts}</div>
                    </div>
                </div>

                ${insightsHTML}

                <h2 class="typography-display" style="margin-bottom:12px;">Muscle Strength Scores</h2>
                <div class="muscle-score-grid">${muscleCardsHTML}</div>

                <h2 class="typography-display" style="margin-bottom:12px;">Recent PR</h2>
                <div id="feed-container">${bestExercisePRHTML}</div>
            </div>
        `;
    },

    library: () => {
        $root.innerHTML = `
            <div class="anim-fade-in">
                <h1 class="typography-display" style="margin-bottom:16px;">Exercise Library</h1>
                <div class="search-bar">
                    <svg><use href="#icon-search"></use></svg>
                    <input type="text" id="lib-search" class="premium-input" placeholder="Search machines, free weights...">
                </div>
                <div class="filter-chips" id="lib-filters">
                    <div class="chip active" data-filter="All">All</div>
                    <div class="chip" data-filter="Chest">Chest</div>
                    <div class="chip" data-filter="Back">Back</div>
                    <div class="chip" data-filter="Legs">Legs</div>
                    <div class="chip" data-filter="Shoulders">Shoulders</div>
                    <div class="chip" data-filter="Arms">Arms</div>
                </div>
                <div class="glass-card" style="padding:0;" id="lib-list"></div>
            </div>
        `;

        const renderList = (filter, query) => {
            const list = document.getElementById('lib-list');
            let filtered = EXERCISES;
            if (filter !== 'All') filtered = filtered.filter(e => e.muscle === filter);
            if (query) filtered = filtered.filter(e => e.name.toLowerCase().includes(query.toLowerCase()));

            list.innerHTML = filtered.map(ex => `
                <div class="list-item" onclick="appLogWorkout('${ex.id}')">
                    <div>
                        <div class="list-item-title">${ex.name}</div>
                        <div class="list-item-sub">${ex.muscle} • ${ex.type}</div>
                    </div>
                    <svg style="width:20px;height:20px;color:var(--brand-primary);"><use href="#icon-plus"></use></svg>
                </div>
            `).join('');
        };

        renderList('All', '');

        document.getElementById('lib-search').addEventListener('input', (e) => {
            const activeFilter = document.querySelector('.chip.active').dataset.filter;
            renderList(activeFilter, e.target.value);
        });

        document.getElementById('lib-filters').addEventListener('click', (e) => {
            if (e.target.classList.contains('chip')) {
                document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                renderList(e.target.dataset.filter, document.getElementById('lib-search').value);
            }
        });
    },

    workout: (prefillExId = null) => {
        $root.innerHTML = `
            <div class="anim-slide-up">
                <h1 class="typography-display" style="margin-bottom:20px;">Log Active Session</h1>
                <div class="glass-card">
                    <div class="input-group">
                        <label class="input-label">Select Equipment</label>
                        <select id="log-ex" class="premium-input">
                            ${EXERCISES.map(e => `<option value="${e.id}">${e.name}</option>`).join('')}
                        </select>
                    </div>
                    <div style="display:flex; gap:16px;">
                        <div class="input-group" style="flex:1;">
                            <label class="input-label">Weight (kg)</label>
                            <input type="number" id="log-wt" class="premium-input" placeholder="0">
                        </div>
                        <div class="input-group" style="flex:1;">
                            <label class="input-label">Reps</label>
                            <input type="number" id="log-reps" class="premium-input" placeholder="0">
                        </div>
                    </div>
                    <button class="btn btn-primary" id="btn-log">
                        Log Set & Calculate
                    </button>
                </div>
                
                <h2 class="typography-display" style="font-size:16px; margin-bottom:12px; margin-top:24px;">Today's Sets</h2>
                <div class="glass-card" style="padding:12px;" id="current-session-list">
                    <p style="font-size:12px; color:var(--text-secondary); text-align:center;">No sets logged this session.</p>
                </div>
            </div>
        `;

        if (prefillExId) document.getElementById('log-ex').value = prefillExId;

        const renderSession = () => {
            const list = document.getElementById('current-session-list');
            if(STATE.currentSessionSets.length === 0) return;
            
            list.innerHTML = STATE.currentSessionSets.map(s => {
                const rank = getRecordRank(s);
                return `
                <div class="mini-set-row">
                    <div>
                        <span style="font-weight:600; font-size:14px;">${s.exerciseName}</span>
                        <span style="color:var(--text-secondary); font-size:12px; margin-left:8px;">${s.weight}kg × ${s.reps}</span>
                    </div>
                    <div class="${rank.colorClass}" style="font-weight:700; font-size:13px;">${rank.fullName}</div>
                </div>
            `;
            }).join('');
        };
        renderSession();

        document.getElementById('btn-log').onclick = () => {
            const exId = document.getElementById('log-ex').value;
            const wt = parseFloat(document.getElementById('log-wt').value);
            const reps = parseInt(document.getElementById('log-reps').value);

            if (!Number.isFinite(wt) || !Number.isFinite(reps) || wt <= 0 || reps <= 0) {
                showToast("Enter valid weight and reps."); return;
            }

            if (reps > 15) {
                showToast("Use 1-15 reps for accurate 1RM estimation.");
                return;
            }

            const ex = EXERCISES.find(e => e.id === exId);
            const oneRM = calc1RM(wt, reps);
            if (!oneRM) {
                showToast("Unable to estimate 1RM from this set.");
                return;
            }
            const rank = getRank(oneRM, STATE.user.bw, ex.multiplier);

            // Calculate Dynamic XP based on volume and exercise type
            const volume = wt * reps;
            const xpEarned = Math.round((volume * 0.1) * ex.xpMod) + 10; // Base 10 + scaling volume

            const record = {
                id: Date.now(),
                date: new Date().toISOString(),
                exerciseId: ex.id,
                exerciseName: ex.name,
                weight: wt,
                reps: reps,
                oneRM,
                ratio: rank.ratio,
                rank,
                xpEarned
            };
            
            STATE.history.unshift(record);
            STATE.currentSessionSets.unshift(record);
            
            STATE.user.xp += xpEarned; 
            const xpRequired = STATE.user.level * 500;
            if(STATE.user.xp >= xpRequired) {
                STATE.user.level++;
                STATE.user.xp = STATE.user.xp - xpRequired;
                showToast(`🛡️ Consistency Level Up! Now Level ${STATE.user.level}!`);
            }
            saveState();

            // Refresh UI
            renderSession();
            
            // Optional: don't clear weight/reps to allow fast duplicate logging, just show toast
            showToast(`+${xpEarned} XP Logged`);

            // Only show massive modal if it's a high rank (e.g. Gold or above) to improve speed UX
            if(rank.ratio >= 1.0) {
                showModal(`
                    <h2 class="typography-display text-gradient">Excellent Set!</h2>
                    <div class="pr-badge-container anim-pulse">
                        <svg class="${rank.colorClass}"><use href="#icon-${rank.icon}"></use></svg>
                        <div class="pr-text ${rank.colorClass}">${rank.fullName}</div>
                    </div>
                    <p style="margin-bottom:10px;">Est 1RM: <strong>${Math.round(oneRM)}kg</strong></p>
                    <p style="font-size:12px; color:var(--brand-accent); margin-bottom:20px;">+${xpEarned} XP Earned</p>
                    <button class="btn btn-primary" onclick="closeModal()">Keep Grinding</button>
                `);
            }
        };
    },

    history: () => {
        $root.innerHTML = `
            <div class="anim-fade-in">
                <h1 class="typography-display" style="margin-bottom:16px;">Workout Ledger</h1>
                <div class="glass-card" style="padding:0;" id="hist-list"></div>
            </div>
        `;

        const list = document.getElementById('hist-list');
        if(STATE.history.length === 0) {
            list.innerHTML = '<div style="padding:20px; text-align:center;">No history.</div>';
            return;
        }

        list.innerHTML = STATE.history.map(item => {
            const d = new Date(item.date).toLocaleDateString(undefined, {month:'short', day:'numeric'});
            const rank = getRecordRank(item);
            return `
                <div class="list-item">
                    <div>
                        <div class="list-item-title">${item.exerciseName}</div>
                        <div class="list-item-sub">${d} • ${item.weight}kg × ${item.reps} <span style="color:var(--brand-accent); margin-left:8px;">+${item.xpEarned}XP</span></div>
                    </div>
                    <div style="text-align:right;">
                        <div class="${rank.colorClass}" style="font-weight:700;">${rank.fullName}</div>
                        <div class="list-item-sub">1RM: ${Math.round(item.oneRM)}kg</div>
                    </div>
                </div>
            `;
        }).join('');
    },

    profile: () => {
        $root.innerHTML = `
            <div class="anim-fade-in">
                <h1 class="typography-display" style="margin-bottom:16px;">Settings</h1>
                <div class="glass-card">
                    <div class="input-group">
                        <label class="input-label">Display Name</label>
                        <input type="text" id="prof-name" class="premium-input" value="${STATE.user.name}">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Current Bodyweight (kg)</label>
                        <input type="number" id="prof-bw" class="premium-input" value="${STATE.user.bw}">
                        <p style="font-size:11px; margin-top:4px; color:var(--brand-accent);">Updating this changes future rank calculations.</p>
                    </div>
                    <div class="input-group">
                        <label class="input-label">Age</label>
                        <input type="number" id="prof-age" class="premium-input" value="${STATE.user.age || ''}">
                    </div>
                    <button class="btn btn-primary" id="btn-save-prof">
                        <svg style="width:20px;height:20px;"><use href="#icon-lock"></use></svg>
                        Save Updates
                    </button>
                </div>
                
                <div class="glass-card" style="margin-top:20px;">
                    <h3 class="typography-display" style="font-size:16px; margin-bottom:8px;">Session</h3>
                    <p style="font-size:12px; color:var(--text-secondary); margin-bottom:10px;">Log out from this profile without deleting workout history.</p>
                    <button class="btn btn-outline" id="btn-logout">
                        <svg style="width:20px;height:20px;"><use href="#icon-user"></use></svg>
                        Logout
                    </button>
                </div>
            </div>
        `;

        document.getElementById('btn-save-prof').onclick = () => {
            STATE.user.name = document.getElementById('prof-name').value;
            STATE.user.bw = parseFloat(document.getElementById('prof-bw').value) || STATE.user.bw;
            STATE.user.age = parseInt(document.getElementById('prof-age').value) || STATE.user.age;
            saveState();
            showToast("Profile Secured");
            
            const meta = document.getElementById('header-meta');
            if(meta) meta.innerHTML = `<span style="font-size:12px; font-weight:600; color:var(--text-secondary); background:rgba(255,255,255,0.1); padding:4px 8px; border-radius:12px;">${STATE.user.bw}kg</span>`;
        };

        document.getElementById('btn-logout').onclick = () => {
            showModal(`
                <div class="brand-mark" style="width: 64px; height: 64px; font-size: 32px; margin: 0 auto 20px;">P</div>
                <h2 class="typography-display text-gradient">Log Out</h2>
                <p style="margin-bottom:24px; color:var(--text-secondary); font-size:14px;">Are you sure you want to log out? This will completely clear your cache and session data from this device.</p>
                <div style="display:flex; gap:12px;">
                    <button class="btn btn-outline" style="flex:1;" onclick="closeModal()">Cancel</button>
                    <button class="btn btn-primary" style="flex:1; background:var(--brand-danger); box-shadow:0 4px 15px rgba(239, 68, 68, 0.4);" onclick="appConfirmLogout()">Log Out</button>
                </div>
            `);
        };
        
        window.appConfirmLogout = () => {
            closeModal();
            localStorage.clear();
            STATE.user = { name: '', age: null, bw: null, level: 1, xp: 0 };
            STATE.history = [];
            STATE.currentSessionSets = [];
            saveState();

            const meta = document.getElementById('header-meta');
            if (meta) meta.innerHTML = '';

            showToast('Cache cleared. Logged out.');
            navigateTo('setup');
        };
    }
};

window.appLogWorkout = (exId) => {
    navigateTo('workout');
    setTimeout(() => {
        const select = document.getElementById('log-ex');
        if(select) select.value = exId;
    }, 10);
};

window.appTrainMuscle = (muscle) => {
    const target = getSuggestedExerciseForMuscle(muscle);
    if (!target) {
        navigateTo('workout');
        return;
    }

    navigateTo('workout');
    setTimeout(() => {
        const select = document.getElementById('log-ex');
        if (select) select.value = target.id;
    }, 10);
};

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.brand-pill').addEventListener('click', () => navigateTo('dashboard'));
    
    if (STATE.user.bw) {
        document.getElementById('header-meta').innerHTML = `<span style="font-size:12px; font-weight:600; color:var(--text-secondary); background:rgba(255,255,255,0.1); padding:4px 8px; border-radius:12px;">${STATE.user.bw}kg</span>`;
    }

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target.closest('.nav-item').dataset.view;
            if (target) navigateTo(target);
        });
    });

    navigateTo('dashboard');
});
