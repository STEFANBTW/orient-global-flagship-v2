/* ==========================================================================
   Climate Futures — Interactive Script & Simulation Engine
   Editorial Aesthetic Edition
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initReadingProgress();
    initNavigation();
    initScrollReveal();
    initHeroSimulation();
    initSandboxSimulator();
    initReaderSettings();
});

/* ==========================================================================
   1. Reading Progress Indicator — thin line that fills as page scrolls
   ========================================================================== */

function initReadingProgress() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;

    function updateProgress() {
        const scrollTop  = window.scrollY || document.documentElement.scrollTop;
        const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
        const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width  = Math.min(progress, 100) + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

/* ==========================================================================
   2. Navigation — Masthead header with sticky effect, scrollspy, mobile overlay
   ========================================================================== */

function initNavigation() {
    const header       = document.getElementById('main-header');
    const navToggle    = document.getElementById('nav-toggle');
    const mobileDropdown = document.getElementById('mobile-dropdown');
    const navLinks     = document.querySelectorAll('.nav-link');
    const dropdownLinks = document.querySelectorAll('[data-dropdown-link]');

    // ── Sticky shadow and opacity transition on scroll ──────────────────
    const hero = document.getElementById('welcome');
    
    function handleScroll() {
        const threshold = hero ? (hero.offsetHeight - header.offsetHeight) : 50;
        if (window.scrollY > threshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', () => {
        handleScroll();
        updateScrollspy();
    }, { passive: true });
    
    handleScroll();

    // ── Scrollspy — highlight active nav link ────────────────────────────
    const sectionIds = ['welcome', 'welcome-intro', 'about', 'why', 'how-it-works', 'objectives', 'methodology', 'results', 'impact', 'status', 'acknowledgements', 'researcher'];

    // Map section id → which nav link href to highlight
    const sectionToNav = {
        'welcome':      '#welcome',
        'welcome-intro':'#welcome',
        'about':        '#about',
        'why':          '#about',
        'how-it-works': '#about',
        'objectives':   '#about',
        'methodology':  '#about',
        'results':      '#about',
        'impact':       '#about',
        'status':       '#about',
        'acknowledgements': '#about',
        'researcher':   '#about'
    };

    function updateScrollspy() {
        let active = 'welcome';
        const offset = 120;

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el && window.scrollY >= el.offsetTop - offset) {
                active = id;
            }
        });

        const targetHref = sectionToNav[active] || `#${active}`;
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === targetHref);
        });

        // Toggle floating side panel active links
        const sideLinks = document.querySelectorAll('.side-nav-link');
        sideLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${active}`);
        });
    }

    // ── Mobile dropdown ───────────────────────────────────────────────────
    function toggleDropdown() {
        const isOpen = mobileDropdown.classList.contains('open');
        if (isOpen) {
            mobileDropdown.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        } else {
            mobileDropdown.classList.add('open');
            navToggle.setAttribute('aria-expanded', 'true');
        }
    }

    function closeDropdown() {
        if (mobileDropdown) {
            mobileDropdown.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }

    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });
    }

    dropdownLinks.forEach(link => {
        link.addEventListener('click', closeDropdown);
    });

    // Close when clicking outside the dropdown
    document.addEventListener('click', (e) => {
        if (mobileDropdown && !mobileDropdown.contains(e.target) && e.target !== navToggle) {
            closeDropdown();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeDropdown();
    });
}

/* ==========================================================================
   3. Scroll-Reveal — Fade and Rise on viewport entry
      Spec: opacity 0→1, translateY 20px→0, 550ms ease-out
   ========================================================================== */

function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // once is enough
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. Tab Switcher — Methodology section
   ========================================================================== */

window.switchTab = function(event, tabId) {
    const buttons  = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');

    buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    contents.forEach(c => c.classList.remove('active'));

    event.currentTarget.classList.add('active');
    event.currentTarget.setAttribute('aria-selected', 'true');

    const panel = document.getElementById(tabId);
    if (panel) panel.classList.add('active');
};

/* ==========================================================================
   5. Contact Form Handler
   ========================================================================== */

window.handleContactForm = function(event) {
    event.preventDefault();
    const btn = document.getElementById('form-submit');
    btn.textContent = 'Message Sent ✓';
    btn.disabled = true;
    btn.style.backgroundColor = '#3F7E44';
    setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        btn.style.backgroundColor = '';
        event.target.reset();
    }, 3500);
};

/* ==========================================================================
   6. Hero Visual Card — Animated Monte Carlo Paths
   ========================================================================== */

function initHeroSimulation() {
    const canvas = document.getElementById('hero-visual-canvas');
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    const loader = document.getElementById('hero-sim-loader');

    // Fit canvas to parent
    function sizeCanvas() {
        canvas.width  = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas, { passive: true });

    const initialTemp = 1.2;
    const years       = 50;
    const steps       = 100;
    const dt          = years / steps;
    const pathCount   = 120;
    const p12         = 0.08;   // Low → High volatility switch probability
    const p21         = 0.25;   // High → Low volatility switch probability
    const paths       = [];

    // Short fake calibration delay, then draw
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 400);
        }
        generatePaths();
        animatePaths();
    }, 1200);

    function generatePaths() {
        for (let p = 0; p < pathCount; p++) {
            const path   = [initialTemp];
            let regime   = Math.random() < 0.85 ? 1 : 2;

            for (let t = 1; t <= steps; t++) {
                if (regime === 1 && Math.random() < p12) regime = 2;
                else if (regime === 2 && Math.random() < p21) regime = 1;

                const drift = regime === 1 ? 0.015 : 0.035;
                const vol   = regime === 1 ? 0.035 : 0.09;

                // Box-Muller normal draw
                const z = Math.sqrt(-2 * Math.log(Math.random())) *
                           Math.cos(2 * Math.PI * Math.random());

                const prev = path[t - 1];
                path.push(prev + drift * prev * dt + vol * prev * Math.sqrt(dt) * z);
            }
            paths.push(path);
        }
    }

    function mapY(temp) {
        const minT = 0.4, maxT = 3.6;
        return canvas.height - ((temp - minT) / (maxT - minT)) * canvas.height;
    }

    let step = 0;
    function animatePaths() {
        if (step > steps) return;

        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Grid lines
        ctx.strokeStyle = 'rgba(55, 65, 81, 0.28)';
        ctx.lineWidth   = 1;
        ctx.font        = '9px "Fira Code", monospace';
        ctx.fillStyle   = 'rgba(156, 163, 175, 0.55)';

        for (let temp = 0.5; temp <= 3.5; temp += 0.5) {
            const y = mapY(temp);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
            ctx.fillText(`+${temp.toFixed(1)}°C`, 5, y - 4);
        }

        // Simulation paths
        ctx.lineWidth = 1;
        paths.forEach(path => {
            ctx.beginPath();
            ctx.moveTo(0, mapY(initialTemp));
            for (let t = 1; t <= step; t++) {
                ctx.lineTo((t / steps) * w, mapY(path[t]));
            }
            const last = path[step] || initialTemp;
            ctx.strokeStyle = last > 2.2
                ? 'rgba(239, 68, 68, 0.13)'    // High anomaly — warm red
                : 'rgba(139, 168, 212, 0.13)'; // Stable — editorial navy
            ctx.stroke();
        });

        // Median path — editorial accent color (navy) instead of neon
        if (paths.length > 0) {
            ctx.lineWidth   = 2.5;
            ctx.strokeStyle = '#5BAD8B'; // Muted emerald — editorial restraint
            ctx.beginPath();
            ctx.moveTo(0, mapY(initialTemp));
            for (let t = 1; t <= step; t++) {
                const sorted = paths.map(p => p[t]).sort((a, b) => a - b);
                const median = sorted[Math.floor(sorted.length / 2)];
                ctx.lineTo((t / steps) * w, mapY(median));
            }
            ctx.stroke();
        }

        step++;
        requestAnimationFrame(animatePaths);
    }
}

/* ==========================================================================
   7. Interactive Sandbox Simulator
   ========================================================================== */

function initSandboxSimulator() {
    const canvas = document.getElementById('simulation-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const sliderX0    = document.getElementById('sim-x0');
    const labelX0     = document.getElementById('sim-x0-val');
    const sliderDrift = document.getElementById('sim-drift');
    const labelDrift  = document.getElementById('sim-drift-val');
    const sliderVol   = document.getElementById('sim-vol');
    const labelVol    = document.getElementById('sim-vol-val');
    const selectYears = document.getElementById('sim-years');
    const runBtn      = document.getElementById('run-sim-btn');

    const metricMedian = document.getElementById('sim-median-val');
    const metricVar    = document.getElementById('sim-var-val');
    const metricProb   = document.getElementById('sim-prob-val');

    function sizeCanvas() {
        canvas.width  = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        runSimulation();
    }

    window.addEventListener('resize', sizeCanvas, { passive: true });

    sliderX0.addEventListener('input',    () => { labelX0.textContent    = `${parseFloat(sliderX0.value).toFixed(1)}°C`; runSimulation(); });
    sliderDrift.addEventListener('input', () => { labelDrift.textContent = parseFloat(sliderDrift.value).toFixed(3); runSimulation(); });
    sliderVol.addEventListener('input',   () => { labelVol.textContent   = parseFloat(sliderVol.value).toFixed(3); runSimulation(); });
    selectYears.addEventListener('change', runSimulation);
    runBtn.addEventListener('click', runSimulation);

    sizeCanvas();

    function runSimulation() {
        const x0    = parseFloat(sliderX0.value);
        const drift = parseFloat(sliderDrift.value);
        const vol   = parseFloat(sliderVol.value);
        const years = parseInt(selectYears.value);

        const w         = canvas.width;
        const h         = canvas.height;
        const steps     = 100;
        const dt        = years / steps;
        const pathCount = 200;
        const paths     = [];

        const expectedEnd  = x0 + drift * years;
        const stdDev       = x0 * vol * Math.sqrt(years);
        const maxAxis      = Math.max(3.8, expectedEnd + 2.5 * stdDev);
        const minAxis      = Math.max(0.0, x0 - 1.5 * stdDev);

        function mapY(v) {
            return h - ((v - minAxis) / (maxAxis - minAxis)) * h;
        }

        // Monte Carlo paths
        for (let p = 0; p < pathCount; p++) {
            const path  = [x0];
            let regime  = 1;

            for (let t = 1; t <= steps; t++) {
                const switchP = 0.05 + vol * 0.2;
                if (Math.random() < switchP) regime = regime === 1 ? 2 : 1;

                const rDrift = regime === 1 ? drift       : drift * 1.5;
                const rVol   = regime === 1 ? vol         : vol   * 1.8;

                const z      = Math.sqrt(-2 * Math.log(Math.random())) *
                                Math.cos(2 * Math.PI * Math.random());
                const prev   = path[t - 1];
                path.push(prev + rDrift * prev * dt + rVol * prev * Math.sqrt(dt) * z);
            }
            paths.push(path);
        }

        ctx.clearRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = 'rgba(55, 65, 81, 0.22)';
        ctx.lineWidth   = 1;
        ctx.font        = '9px "Fira Code", monospace';
        ctx.fillStyle   = 'rgba(156, 163, 175, 0.45)';

        const gridStep = (maxAxis - minAxis) / 6;
        for (let v = minAxis + gridStep; v < maxAxis; v += gridStep) {
            const y = mapY(v);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
            ctx.fillText(`+${v.toFixed(2)}°C`, 5, y - 4);
        }

        // Paths
        ctx.lineWidth = 1;
        paths.forEach(path => {
            ctx.beginPath();
            ctx.moveTo(0, mapY(x0));
            for (let t = 1; t <= steps; t++) ctx.lineTo((t / steps) * w, mapY(path[t]));
            ctx.strokeStyle = 'rgba(139, 168, 212, 0.09)'; // Muted editorial navy
            ctx.stroke();
        });

        // Metrics
        const finals   = paths.map(p => p[steps]).sort((a, b) => a - b);
        const median   = finals[Math.floor(pathCount * 0.5)];
        const var95    = finals[Math.floor(pathCount * 0.95)];
        const warmProb = (finals.filter(v => v > x0).length / pathCount) * 100;

        // Median line
        ctx.lineWidth   = 3;
        ctx.strokeStyle = '#5BAD8B';
        ctx.beginPath();
        ctx.moveTo(0, mapY(x0));
        for (let t = 1; t <= steps; t++) {
            const sorted = paths.map(p => p[t]).sort((a, b) => a - b);
            ctx.lineTo((t / steps) * w, mapY(sorted[Math.floor(pathCount * 0.5)]));
        }
        ctx.stroke();

        // 95th percentile dashed line
        ctx.lineWidth   = 1.5;
        ctx.strokeStyle = '#8AA8D4';
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(0, mapY(x0));
        for (let t = 1; t <= steps; t++) {
            const sorted = paths.map(p => p[t]).sort((a, b) => a - b);
            ctx.lineTo((t / steps) * w, mapY(sorted[Math.floor(pathCount * 0.95)]));
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Update metric readouts
        if (metricMedian) metricMedian.textContent = `+${median.toFixed(2)}°C`;
        if (metricVar)    metricVar.textContent    = `+${var95.toFixed(2)}°C`;
        if (metricProb)   metricProb.textContent   = `${warmProb.toFixed(1)}%`;
    }
}

/* ==========================================================================
   8. Reader Preferences & Typography Customizer
   ========================================================================== */
function initReaderSettings() {
    // Defaults
    let scale = parseFloat(localStorage.getItem('academic-font-scale')) || 1.0;
    let fontType = localStorage.getItem('academic-font-type') || 'serif'; // 'serif' or 'sans'
    let lineWidth = localStorage.getItem('academic-line-width') || 'optimal'; // 'optimal' or 'wide'

    // Constants
    const SCALE_STEP = 0.05; // 5% adjustments for smoother control
    const MIN_SCALE = 0.8;
    const MAX_SCALE = 1.35;

    // Elements
    const root = document.documentElement;
    const btnDec = document.getElementById('btn-dec-font');
    const btnInc = document.getElementById('btn-inc-font');
    const btnDecMob = document.getElementById('btn-dec-font-mob');
    const btnIncMob = document.getElementById('btn-inc-font-mob');
    const btnFont = document.getElementById('btn-toggle-font');
    const btnFontMob = document.getElementById('btn-toggle-font-mob');
    const btnWidth = document.getElementById('btn-toggle-width');
    const btnWidthMob = document.getElementById('btn-toggle-width-mob');

    // Font Family definitions matching CSS variables
    const fontSerif = "'Lora', Georgia, 'Times New Roman', serif";
    const fontSans = "'DM Sans', system-ui, -apple-system, sans-serif";

    function updateTypography() {
        // Apply values to CSS variables
        root.style.setProperty('--user-font-scale', scale);
        root.style.setProperty('--user-font-family', fontType === 'serif' ? fontSerif : fontSans);
        root.style.setProperty('--user-line-width', lineWidth === 'optimal' ? '65ch' : '85ch');

        // Update Button labels
        if (btnFont) btnFont.textContent = fontType === 'serif' ? 'Serif' : 'Sans-Serif';
        if (btnFontMob) btnFontMob.textContent = fontType === 'serif' ? 'Serif' : 'Sans-Serif';

        if (btnWidth) btnWidth.textContent = lineWidth === 'optimal' ? 'Optimal' : 'Wide';
        if (btnWidthMob) btnWidthMob.textContent = lineWidth === 'optimal' ? 'Optimal' : 'Wide';

        // Update active class state (visual feedback)
        if (btnFont) btnFont.classList.toggle('active', fontType === 'serif');
        if (btnFontMob) btnFontMob.classList.toggle('active', fontType === 'serif');
        if (btnWidth) btnWidth.classList.toggle('active', lineWidth === 'optimal');
        if (btnWidthMob) btnWidthMob.classList.toggle('active', lineWidth === 'optimal');

        // Save to localStorage
        localStorage.setItem('academic-font-scale', scale);
        localStorage.setItem('academic-font-type', fontType);
        localStorage.setItem('academic-line-width', lineWidth);
    }

    // Handlers
    function adjustScale(delta) {
        scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta));
        updateTypography();
    }

    function toggleFont() {
        fontType = fontType === 'serif' ? 'sans' : 'serif';
        updateTypography();
    }

    function toggleWidth() {
        lineWidth = lineWidth === 'optimal' ? 'wide' : 'optimal';
        updateTypography();
    }

    // Attach Desktop listeners
    if (btnDec) btnDec.addEventListener('click', () => adjustScale(-SCALE_STEP));
    if (btnInc) btnInc.addEventListener('click', () => adjustScale(SCALE_STEP));
    if (btnFont) btnFont.addEventListener('click', toggleFont);
    if (btnWidth) btnWidth.addEventListener('click', toggleWidth);

    // Attach Mobile listeners
    if (btnDecMob) btnDecMob.addEventListener('click', () => adjustScale(-SCALE_STEP));
    if (btnIncMob) btnIncMob.addEventListener('click', () => adjustScale(SCALE_STEP));
    if (btnFontMob) btnFontMob.addEventListener('click', toggleFont);
    if (btnWidthMob) btnWidthMob.addEventListener('click', toggleWidth);

    // Initialize layout on load
    updateTypography();
}
