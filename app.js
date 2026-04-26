/**
 * PulseRank (Liftoff Replica) Engine
 * Manages state, routing, DOM injection, and complex 1RM/Ranking math.
 */

// --- Database & State ---
const EXERCISES = [
    // CHEST
    { id: 'bench_press', name: 'Barbell Bench Press', muscle: 'Chest', type: 'Free Weight', multiplier: 1.0 },
    { id: 'db_bench', name: 'Dumbbell Bench Press', muscle: 'Chest', type: 'Free Weight', multiplier: 0.85 },
    { id: 'incline_bench', name: 'Incline Barbell Press', muscle: 'Chest', type: 'Free Weight', multiplier: 0.8 },
    { id: 'chest_press_mach', name: 'Chest Press Machine', muscle: 'Chest', type: 'Machine', multiplier: 1.2 },
    { id: 'pec_deck', name: 'Pec Deck Fly', muscle: 'Chest', type: 'Machine', multiplier: 0.6 },
    // BACK
    { id: 'deadlift', name: 'Barbell Deadlift', muscle: 'Back', type: 'Free Weight', multiplier: 1.6 },
    { id: 'pullup', name: 'Pull-up (Weighted)', muscle: 'Back', type: 'Bodyweight', multiplier: 1.2 },
    { id: 'lat_pulldown', name: 'Lat Pulldown', muscle: 'Back', type: 'Machine', multiplier: 0.9 },
    { id: 'cable_row', name: 'Seated Cable Row', muscle: 'Back', type: 'Machine', multiplier: 1.0 },
    // LEGS
    { id: 'squat', name: 'Barbell Squat', muscle: 'Legs', type: 'Free Weight', multiplier: 1.4 },
    { id: 'leg_press', name: 'Leg Press', muscle: 'Legs', type: 'Machine', multiplier: 2.5 },
    { id: 'leg_ext', name: 'Leg Extension', muscle: 'Legs', type: 'Machine', multiplier: 0.8 },
    // SHOULDERS
    { id: 'ohp', name: 'Overhead Press', muscle: 'Shoulders', type: 'Free Weight', multiplier: 0.65 },
    { id: 'lat_raise', name: 'Lateral Raise', muscle: 'Shoulders', type: 'Free Weight', multiplier: 0.2 },
    // ARMS
    { id: 'bb_curl', name: 'Barbell Bicep Curl', muscle: 'Arms', type: 'Free Weight', multiplier: 0.4 },
    { id: 'tri_pushdown', name: 'Tricep Pushdown', muscle: 'Arms', type: 'Cable', multiplier: 0.5 }
];

const STATE = {
    user: {
        name: localStorage.getItem('pulse_name') || '',
        bw: parseFloat(localStorage.getItem('pulse_bw')) || null,
        level: parseInt(localStorage.getItem('pulse_level')) || 1,
        xp: parseInt(localStorage.getItem('pulse_xp')) || 0
    },
    history: JSON.parse(localStorage.getItem('pulse_history')) || []
};

function saveState() {
    localStorage.setItem('pulse_name', STATE.user.name);
    if(STATE.user.bw) localStorage.setItem('pulse_bw', STATE.user.bw);
    localStorage.setItem('pulse_level', STATE.user.level);
    localStorage.setItem('pulse_xp', STATE.user.xp);
    localStorage.setItem('pulse_history', JSON.stringify(STATE.history));
}

// --- Ranking Math ---
const TIERS = [
    { name: 'Unranked', th: 0, color: 'unranked', icon: 'user' },
    { name: 'Bronze', th: 0.5, color: 'bronze', icon: 'flame' },
    { name: 'Silver', th: 0.75, color: 'silver', icon: 'flame' },
    { name: 'Gold', th: 1.0, color: 'gold', icon: 'trophy' },
    { name: 'Platinum', th: 1.3, color: 'platinum', icon: 'trophy' },
    { name: 'Titanium', th: 1.6, color: 'titanium', icon: 'trophy' },
    { name: 'Diamond', th: 2.0, color: 'diamond', icon: 'heart' }
];

function calc1RM(weight, reps) {
    if (reps === 1) return weight;
    return weight * (1 + reps / 30); // Epley Formula
}

function getRank(oneRM, bw, multiplier) {
    if (!bw) return { fullName: 'Unranked', colorClass: 'rank-unranked', icon: 'user' };
    
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
    if (currentTier.name !== 'Unranked' && currentTier.name !== 'Diamond') {
        const progress = (ratio - currentTier.th) / (nextTier.th - currentTier.th);
        if (progress > 0.66) subTier = 'III';
        else if (progress > 0.33) subTier = 'II';
    } else if (currentTier.name === 'Diamond') {
        if (ratio >= 2.5) subTier = 'III';
        else if (ratio >= 2.25) subTier = 'II';
    }

    const fullName = currentTier.name === 'Unranked' ? 'Unranked' : `${currentTier.name} ${subTier}`;
    
    return {
        tier: currentTier.name,
        subTier,
        fullName,
        colorClass: `rank-${currentTier.color}`,
        icon: currentTier.icon,
        ratio: ratio.toFixed(2)
    };
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
    // Force setup if no bodyweight
    if (!STATE.user.bw && viewId !== 'setup') {
        viewId = 'setup';
    }

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    if (VIEWS[viewId]) {
        $root.innerHTML = ''; // clear
        window.scrollTo(0, 0);
        VIEWS[viewId](); // render
    }
}

// --- Views ---
const VIEWS = {
    setup: () => {
        $root.innerHTML = `
            <div class="setup-view anim-fade-in">
                <svg><use href="#icon-user"></use></svg>
                <h1 class="typography-display text-gradient">Commit to PulseRank</h1>
                <p>Before we calculate your ranks, we need your starting bodyweight.</p>
                <div class="glass-card" style="width: 100%;">
                    <div class="input-group">
                        <label class="input-label">What should we call you?</label>
                        <input type="text" id="setup-name" class="premium-input" placeholder="Your Name" value="${STATE.user.name}">
                    </div>
                    <div class="input-group">
                        <label class="input-label">Bodyweight (kg)</label>
                        <input type="number" id="setup-bw" class="premium-input" placeholder="e.g. 75">
                    </div>
                    <button class="btn btn-primary" id="btn-setup">Begin Journey</button>
                </div>
            </div>
        `;

        document.getElementById('btn-setup').onclick = () => {
            const bw = parseFloat(document.getElementById('setup-bw').value);
            const name = document.getElementById('setup-name').value;
            if (!bw || bw < 30) {
                showToast("Please enter a valid bodyweight.");
                return;
            }
            STATE.user.bw = bw;
            STATE.user.name = name || 'Athlete';
            saveState();
            showToast("Welcome to PulseRank!");
            navigateTo('dashboard');
        };
    },

    dashboard: () => {
        let bestRankHTML = '<div class="value rank-unranked">--</div>';
        let totalWorkouts = STATE.history.length;
        
        if (totalWorkouts > 0) {
            const sorted = [...STATE.history].sort((a, b) => b.ratio - a.ratio);
            const best = sorted[0].rank;
            bestRankHTML = `<div class="value ${best.colorClass}">${best.fullName}</div>`;
        }

        $root.innerHTML = `
            <div class="anim-fade-in">
                <div class="dash-header">
                    <div>
                        <h1 class="typography-display">Ready, ${STATE.user.name}?</h1>
                        <p style="color: var(--brand-accent);">Level ${STATE.user.level} Lifter</p>
                    </div>
                    <div class="user-level-ring">
                        <span class="text-gradient">${STATE.user.level}</span>
                    </div>
                </div>

                <div class="stat-grid">
                    <div class="glass-card stat-box">
                        <div class="label">Top Rank</div>
                        ${bestRankHTML}
                    </div>
                    <div class="glass-card stat-box">
                        <div class="label">Workouts</div>
                        <div class="value">${totalWorkouts}</div>
                    </div>
                </div>

                <h2 class="typography-display" style="margin-bottom:12px;">Recent PR Feed</h2>
                <div id="feed-container"></div>
            </div>
        `;

        const feed = document.getElementById('feed-container');
        if (totalWorkouts === 0) {
            feed.innerHTML = '<div class="glass-card" style="text-align:center;"><p>No workouts yet. Hit the + button to log!</p></div>';
        } else {
            const html = STATE.history.slice(0, 5).map(item => `
                <div class="glass-card anim-slide-up" style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:600;">${item.exerciseName}</div>
                        <div style="font-size:12px; color:var(--text-secondary);">${item.weight}kg × ${item.reps}</div>
                    </div>
                    <div style="text-align:right;">
                        <div class="${item.rank.colorClass} typography-display" style="font-size:18px;">${item.rank.fullName}</div>
                    </div>
                </div>
            `).join('');
            feed.innerHTML = html;
        }
    },

    library: () => {
        $root.innerHTML = `
            <div class="anim-fade-in">
                <h1 class="typography-display" style="margin-bottom:16px;">Exercise Library</h1>
                <div class="search-bar">
                    <svg><use href="#icon-search"></use></svg>
                    <input type="text" id="lib-search" class="premium-input" placeholder="Search exercises...">
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

        // Interactions
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
                <h1 class="typography-display" style="margin-bottom:20px;">Log Set</h1>
                <div class="glass-card">
                    <div class="input-group">
                        <label class="input-label">Exercise</label>
                        <select id="log-ex" class="premium-input">
                            ${EXERCISES.map(e => `<option value="${e.id}">${e.name}</option>`).join('')}
                        </select>
                    </div>
                    <div style="display:flex; gap:16px;">
                        <div class="input-group" style="flex:1;">
                            <label class="input-label">Weight (kg)</label>
                            <input type="number" id="log-wt" class="premium-input" placeholder="0" autofocus>
                        </div>
                        <div class="input-group" style="flex:1;">
                            <label class="input-label">Reps</label>
                            <input type="number" id="log-reps" class="premium-input" placeholder="0">
                        </div>
                    </div>
                    <button class="btn btn-primary" id="btn-log">
                        <svg style="width:20px;height:20px;"><use href="#icon-chart"></use></svg>
                        Log & Calculate Rank
                    </button>
                </div>
            </div>
        `;

        if (prefillExId) document.getElementById('log-ex').value = prefillExId;

        document.getElementById('btn-log').onclick = () => {
            const exId = document.getElementById('log-ex').value;
            const wt = parseFloat(document.getElementById('log-wt').value);
            const reps = parseInt(document.getElementById('log-reps').value);

            if (!wt || !reps) {
                showToast("Enter weight and reps."); return;
            }

            const ex = EXERCISES.find(e => e.id === exId);
            const oneRM = calc1RM(wt, reps);
            const rank = getRank(oneRM, STATE.user.bw, ex.multiplier);

            // Record
            const record = {
                id: Date.now(),
                date: new Date().toISOString(),
                exerciseId: ex.id,
                exerciseName: ex.name,
                weight: wt,
                reps: reps,
                oneRM,
                ratio: rank.ratio,
                rank
            };
            STATE.history.unshift(record);
            STATE.user.xp += 50; // Award XP
            if(STATE.user.xp >= STATE.user.level * 200) {
                STATE.user.level++;
                STATE.user.xp = 0;
                showToast(`Level Up! You are now level ${STATE.user.level}!`);
            }
            saveState();

            // Reset Form
            document.getElementById('log-wt').value = '';
            document.getElementById('log-reps').value = '';

            // Show PR Modal
            showModal(`
                <h2 class="typography-display text-gradient">Set Logged!</h2>
                <div class="pr-badge-container anim-pulse">
                    <svg class="${rank.colorClass}"><use href="#icon-${rank.icon}"></use></svg>
                    <div class="pr-text ${rank.colorClass}">${rank.fullName}</div>
                </div>
                <p style="margin-bottom:20px;">Est 1RM: <strong>${Math.round(oneRM)}kg</strong></p>
                <button class="btn btn-primary" onclick="closeModal()">Keep Grinding</button>
            `);
        };
    },

    history: () => {
        $root.innerHTML = `
            <div class="anim-fade-in">
                <h1 class="typography-display" style="margin-bottom:16px;">Workout History</h1>
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
            return `
                <div class="list-item">
                    <div>
                        <div class="list-item-title">${item.exerciseName}</div>
                        <div class="list-item-sub">${d} • ${item.weight}kg × ${item.reps}</div>
                    </div>
                    <div style="text-align:right;">
                        <div class="${item.rank.colorClass}" style="font-weight:700;">${item.rank.fullName}</div>
                        <div class="list-item-sub">1RM: ${Math.round(item.oneRM)}kg</div>
                    </div>
                </div>
            `;
        }).join('');
    },

    profile: () => {
        $root.innerHTML = `
            <div class="anim-fade-in">
                <h1 class="typography-display" style="margin-bottom:16px;">Profile Settings</h1>
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
                    <button class="btn btn-primary" id="btn-save-prof">Save Updates</button>
                </div>
                <div style="text-align:center; margin-top:20px;">
                    <p style="font-size:12px; color:var(--text-tertiary);">PulseRank Web Engine v1.0</p>
                </div>
            </div>
        `;

        document.getElementById('btn-save-prof').onclick = () => {
            STATE.user.name = document.getElementById('prof-name').value;
            STATE.user.bw = parseFloat(document.getElementById('prof-bw').value) || STATE.user.bw;
            saveState();
            showToast("Profile Updated");
            
            const meta = document.getElementById('header-meta');
            if(meta) meta.innerHTML = `<span style="font-size:12px; font-weight:600;">${STATE.user.bw}kg</span>`;
        };
    }
};

// Global helper for the library view to jump to workout logger
window.appLogWorkout = (exId) => {
    navigateTo('workout');
    // Ensure the view has rendered before trying to pre-fill
    setTimeout(() => {
        const select = document.getElementById('log-ex');
        if(select) select.value = exId;
    }, 10);
};

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    // Header binding
    document.querySelector('.brand-pill').addEventListener('click', () => navigateTo('dashboard'));
    
    // Header Meta (shows bodyweight if set)
    if (STATE.user.bw) {
        document.getElementById('header-meta').innerHTML = `<span style="font-size:12px; font-weight:600; color:var(--text-secondary); background:rgba(255,255,255,0.1); padding:4px 8px; border-radius:12px;">${STATE.user.bw}kg</span>`;
    }

    // Nav Bindings
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target.closest('.nav-item').dataset.view;
            if (target) navigateTo(target);
        });
    });

    // Start App
    navigateTo('dashboard');
});
