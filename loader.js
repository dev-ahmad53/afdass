/**
 * AFDASS HAUTE PARFUMERIE — SIGNATURE LUXURY PRELOADER CONTROLLER
 * Ultra-Smooth Realistic Perfume Application & Volumetric Fragrance Mist
 * 
 * Features:
 * - Buttery-smooth Magnetic Gold Cap Opening (Dhakkan Lifts & Floats)
 * - Actuator Pump Action (Precision mechanical nozzle depression)
 * - Feathered Volumetric Vapor Clouds & Microscopic Atomized Aerosol (Zero harsh lines or hard cones)
 * - Minimalist luxury layout: No cluttered status text below the line
 */

class AfdassPerfumeLoader {
  constructor(options = {}) {
    this.duration = options.duration || 2100; // Fast & snappy luxury duration
    this.autoDismiss = options.autoDismiss !== false;
    this.onComplete = options.onComplete || null;

    // DOM Elements
    this.container = document.getElementById('afdass-preloader');
    this.progressBar = document.getElementById('loader-progress-bar');
    this.percentText = document.getElementById('loader-percentage');
    this.capGroup = document.getElementById('bottle-cap-group');
    this.actuatorGroup = document.getElementById('sprayer-actuator-group');
    this.liquidWave = document.getElementById('liquid-wave-group');
    this.canvas = document.getElementById('perfume-mist-canvas');
    this.transCanvas = document.getElementById('transition-mist-canvas');

    // Canvas 2D Contexts
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.transCtx = this.transCanvas ? this.transCanvas.getContext('2d') : null;
    this.vaporPuffs = [];
    this.droplets = [];
    this.bridgeClouds = [];
    this.bridgeSparkles = [];
    this.sprayedCount = 0;
    this.sprayBurstTimers = [];
    this.bridgeStarted = false;
    this.revealStarted = false;

    this.currentProgress = 0;
    this.animationFrame = null;
    this.canvasFrame = null;
    this.bridgeFrame = null;
    this.hideTimer = null;
    this.isFinished = false;

    this.initCanvas();
  }

  initCanvas() {
    const dpr = window.devicePixelRatio || 1;
    if (this.canvas && this.ctx) {
      const w = 480;
      const h = 380;
      this.canvas.width = w * dpr;
      this.canvas.height = h * dpr;
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);
    }
    if (this.transCanvas && this.transCtx) {
      const vw = window.innerWidth || 1280;
      const vh = window.innerHeight || 800;
      this.transCanvas.width = vw * dpr;
      this.transCanvas.height = vh * dpr;
      this.transCtx.setTransform(1, 0, 0, 1, 0, 0);
      this.transCtx.scale(dpr, dpr);
    }
  }

  start(customDuration) {
    if (customDuration) this.duration = customDuration;
    if (this.hideTimer) clearTimeout(this.hideTimer);
    if (this.bridgeFrame) cancelAnimationFrame(this.bridgeFrame);
    if (this.sprayBurstTimers.length) {
      this.sprayBurstTimers.forEach((t) => clearTimeout(t));
      this.sprayBurstTimers = [];
    }

    this.currentProgress = 0;
    this.isFinished = false;
    this.sprayedCount = 0;
    this.bridgeStarted = false;
    this.revealStarted = false;
    this.vaporPuffs = [];
    this.droplets = [];
    this.bridgeClouds = [];
    this.bridgeSparkles = [];

    this.initCanvas();

    if (this.container) {
      this.container.classList.remove('loader-hidden', 'loader-exiting');
      document.body.classList.add('loader-active');
    }

    const websiteStage = document.querySelector('.website-reveal-stage');
    if (websiteStage) {
      websiteStage.classList.remove('website-visible');
    }

    // Reset bottle cap & actuator states
    if (this.capGroup) {
      this.capGroup.classList.remove('cap-open');
      this.capGroup.classList.add('cap-closed');
    }
    if (this.actuatorGroup) {
      this.actuatorGroup.classList.remove('pump-pressed');
    }

    // Start canvas volumetric rendering loop
    this.startCanvasLoop();

    const startTime = performance.now();
    const totalDuration = this.duration;

    const animateTick = (now) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / totalDuration);

      // Smooth luxury easeInOutCubic curve
      const easedProgress = rawProgress < 0.5
        ? 4 * rawProgress * rawProgress * rawProgress
        : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

      this.currentProgress = Math.round(easedProgress * 100);
      this.updateProgress(this.currentProgress);

      if (rawProgress < 1) {
        this.animationFrame = requestAnimationFrame(animateTick);
      } else {
        this.currentProgress = 100;
        this.updateProgress(100);
        this.onFinish();
      }
    };

    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    this.animationFrame = requestAnimationFrame(animateTick);
  }

  /**
   * Orchestrates the fast timeline: Cap opens -> 1 Heavy FRUSHH Spray -> Overlapping Smooth Website Reveal
   */
  updateProgress(pct) {
    // 1. Sleek progress track & percentage text
    if (this.percentText) {
      this.percentText.textContent = `${pct}%`;
    }
    if (this.progressBar) {
      this.progressBar.style.width = `${pct}%`;
    }

    // 2. Liquid fill rising smoothly inside crystal flacon
    if (this.liquidWave) {
      const liquidY = 120 - (pct / 100) * 120;
      this.liquidWave.style.transform = `translateY(${liquidY}px)`;
    }

    // 3. CAP OPENING: Dhakkan lifts briskly at 14%
    if (pct >= 14 && this.capGroup && !this.capGroup.classList.contains('cap-open')) {
      this.capGroup.classList.remove('cap-closed');
      this.capGroup.classList.add('cap-open');
    }

    // 4. SINGLE HEAVY "FRUSHH" SPRAY: 1 powerful pressurized blast at 34%
    if (pct >= 34 && this.sprayedCount === 0) {
      this.sprayedCount = 1;
      this.triggerHeavyFrushhSpray();
    }

    // 5. PRE-WARM FULLSCREEN MIST BRIDGE AT 70%:
    // Golden fragrance mist expands across the screen while the spray is still in the air
    if (pct >= 70 && !this.bridgeStarted) {
      this.bridgeStarted = true;
      this.startScreenMistBridge();
    }

    // Release pump after the heavy pressurized spray completes
    if (pct >= 78 && this.actuatorGroup) {
      this.actuatorGroup.classList.remove('pump-pressed');
    }

    // 6. OVERLAPPING SILKY WEBSITE REVEAL AT 86% (Zero dead stop at 100%)
    if (pct >= 86 && this.autoDismiss && !this.revealStarted) {
      this.revealStarted = true;
      this.dismiss();
    }
  }

  /**
   * Triggers 1 SINGLE HEAVY, CONTINUOUS PRESSURIZED "FRUSHH" SPRAY to the left:
   * Emits a dense multi-wave pressurized aerosol jet & rich golden vapor cloud
   */
  triggerHeavyFrushhSpray() {
    // 1. Actuator nozzle presses firmly down
    if (this.actuatorGroup) {
      this.actuatorGroup.classList.add('pump-pressed');
    }

    // 2. Side Nozzle orifice anchor inside 480x380 canvas coordinates:
    const originX = 231;
    const originY = 194;

    // Fire 7 rapid consecutive high-pressure micro-waves (~175ms total burst) for a rich "FRUSHH" feel
    const totalWaves = 7;
    for (let w = 0; w < totalWaves; w++) {
      const timerId = setTimeout(() => {
        // A. Heavy Horizontal Conical Vapor Plume shooting far to the Left
        const puffCount = 14; // 14 * 7 = 98 dense volumetric clouds
        for (let i = 0; i < puffCount; i++) {
          const angle = Math.PI + 0.04 + (Math.random() - 0.5) * 0.36;
          const speed = Math.random() * 8.2 + 4.2;

          this.vaporPuffs.push({
            x: originX - Math.random() * 4,
            y: originY + (Math.random() - 0.5) * 2.5,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 3.5 + 3.5,
            growth: Math.random() * 0.95 + 0.55,
            maxRadius: Math.random() * 22 + 28,
            alpha: Math.random() * 0.32 + 0.42,
            decay: Math.random() * 0.008 + 0.006
          });
        }

        // B. High-Velocity Microscopic Atomized Aerosol Jet (Heavy "Frushh" Mist)
        const dropletCount = 28; // 28 * 7 = 196 pressurized droplets
        for (let i = 0; i < dropletCount; i++) {
          const angle = Math.PI + 0.04 + (Math.random() - 0.5) * 0.40;
          const speed = Math.random() * 10.5 + 4.5;

          this.droplets.push({
            x: originX - Math.random() * 3,
            y: originY + (Math.random() - 0.5) * 2.2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 1.3 + 0.5,
            alpha: Math.random() * 0.7 + 0.35,
            decay: Math.random() * 0.013 + 0.009,
            color: Math.random() > 0.4 ? '255, 242, 190' : '235, 195, 105'
          });
        }
      }, w * 25);

      this.sprayBurstTimers.push(timerId);
    }
  }

  /**
   * Continuous high-performance 60FPS fluid canvas renderer (Zero laggy shadowBlur)
   */
  startCanvasLoop() {
    const render = () => {
      if (!this.ctx || !this.canvas) return;

      const width = 480;
      const height = 380;
      this.ctx.clearRect(0, 0, width, height);

      // 1. RENDER SOFT VOLUMETRIC VAPOR PUFFS (Layer 1)
      this.ctx.save();
      this.ctx.globalCompositeOperation = 'screen'; // Melts overlapping vapor smoothly

      for (let i = this.vaporPuffs.length - 1; i >= 0; i--) {
        const p = this.vaporPuffs[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.935; // fluid air drag
        p.vy *= 0.935;
        
        if (p.radius < p.maxRadius) {
          p.radius += p.growth;
        }
        p.alpha -= p.decay;

        if (p.alpha <= 0.005) {
          this.vaporPuffs.splice(i, 1);
          continue;
        }

        // Feathered Radial Gradient with 100% transparent edge (ZERO harsh lines)
        const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(255, 248, 225, ${p.alpha * 0.45})`);
        grad.addColorStop(0.35, `rgba(240, 205, 125, ${p.alpha * 0.25})`);
        grad.addColorStop(0.7, `rgba(212, 175, 55, ${p.alpha * 0.10})`);
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();

      // 2. RENDER MICROSCOPIC AEROSOL DROPLETS (Layer 2 — Fast 60FPS Halo without shadowBlur)
      this.ctx.save();
      for (let i = this.droplets.length - 1; i >= 0; i--) {
        const d = this.droplets[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.95;
        d.vy *= 0.95;
        d.alpha -= d.decay;

        if (d.alpha <= 0.01) {
          this.droplets.splice(i, 1);
          continue;
        }

        this.ctx.beginPath();
        this.ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${d.color}, ${d.alpha})`;
        this.ctx.fill();
      }
      this.ctx.restore();

      // Keep loop running until animation completes and particles dissolve
      if (!this.isFinished || this.vaporPuffs.length > 0 || this.droplets.length > 0) {
        this.canvasFrame = requestAnimationFrame(render);
      }
    };

    if (this.canvasFrame) cancelAnimationFrame(this.canvasFrame);
    this.canvasFrame = requestAnimationFrame(render);
  }

  onFinish() {
    this.isFinished = true;
    if (typeof this.onComplete === 'function') {
      this.onComplete();
    }

    if (this.autoDismiss && !this.revealStarted) {
      this.revealStarted = true;
      this.dismiss();
    }
  }

  dismiss() {
    // 1. Ensure full-screen Golden Fragrance Mist & Stardust Bridge is active
    if (!this.bridgeStarted) {
      this.bridgeStarted = true;
      this.startScreenMistBridge();
    }

    if (this.container) {
      // 2. Gradually dissolve warm dark veil via S-curve & melt bottle into soft mist
      this.container.classList.add('loader-exiting');
      document.body.classList.remove('loader-active');
    }

    // 3. Smoothly reveal and glide the website underneath through the parting mist
    const websiteStage = document.querySelector('.website-reveal-stage');
    if (websiteStage) {
      websiteStage.classList.add('website-visible');
    }

    // 4. Hide overlay container after the 1.85s S-curve fade & floating mist complete
    this.hideTimer = setTimeout(() => {
      if (this.container) {
        this.container.classList.add('loader-hidden');
      }
    }, 2400);
  }

  /**
   * Emits a luxurious wave of golden fragrance mist and floating stardust
   * across the entire screen that lingers over the live website as it opens
   */
  startScreenMistBridge() {
    if (!this.transCanvas || !this.transCtx) return;

    const vw = window.innerWidth || 1280;
    const vh = window.innerHeight || 800;
    const cx = vw * 0.46;
    const cy = vh * 0.42;

    this.bridgeClouds = [];
    this.bridgeSparkles = [];

    // 1. Billowing Golden Fragrance Clouds expanding outward across viewport
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.35;
      const speed = Math.random() * 7.5 + 2.2;
      this.bridgeClouds.push({
        x: cx + (Math.random() - 0.5) * 80,
        y: cy + (Math.random() - 0.5) * 70,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.85,
        radius: Math.random() * 65 + 75,
        growth: Math.random() * 2.4 + 1.5,
        maxRadius: Math.random() * 140 + 190,
        alpha: Math.random() * 0.22 + 0.16,
        decay: Math.random() * 0.0038 + 0.0032
      });
    }

    // 2. Shimmering Golden Stardust Particles floating over the revealed website (Zero laggy shadowBlur)
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8.5 + 1.8;
      this.bridgeSparkles.push({
        x: cx + (Math.random() - 0.5) * 110,
        y: cy + (Math.random() - 0.5) * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.35, // Gentle upward float
        size: Math.random() * 1.9 + 0.7,
        alpha: Math.random() * 0.72 + 0.24,
        decay: Math.random() * 0.007 + 0.0045,
        color: Math.random() > 0.4 ? '255, 242, 190' : '222, 166, 95'
      });
    }

    const renderBridge = () => {
      if (!this.transCtx || !this.transCanvas) return;
      this.transCtx.clearRect(0, 0, vw, vh);

      // Draw soft golden mist clouds
      this.transCtx.save();
      this.transCtx.globalCompositeOperation = 'screen';
      for (let i = this.bridgeClouds.length - 1; i >= 0; i--) {
        const c = this.bridgeClouds[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vx *= 0.965;
        c.vy *= 0.965;
        if (c.radius < c.maxRadius) c.radius += c.growth;
        c.alpha -= c.decay;

        if (c.alpha <= 0.003) {
          this.bridgeClouds.splice(i, 1);
          continue;
        }

        const grad = this.transCtx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.radius);
        grad.addColorStop(0, `rgba(255, 245, 210, ${c.alpha * 0.52})`);
        grad.addColorStop(0.45, `rgba(222, 166, 95, ${c.alpha * 0.26})`);
        grad.addColorStop(1, 'rgba(222, 166, 95, 0)');

        this.transCtx.fillStyle = grad;
        this.transCtx.beginPath();
        this.transCtx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        this.transCtx.fill();
      }
      this.transCtx.restore();

      // Draw floating golden sparkles over the website (Fast dual-circle glow instead of shadowBlur)
      this.transCtx.save();
      for (let i = this.bridgeSparkles.length - 1; i >= 0; i--) {
        const s = this.bridgeSparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.972;
        s.vy *= 0.972;
        s.alpha -= s.decay;

        if (s.alpha <= 0.01) {
          this.bridgeSparkles.splice(i, 1);
          continue;
        }

        // Soft outer halo
        this.transCtx.beginPath();
        this.transCtx.arc(s.x, s.y, s.size * 2.4, 0, Math.PI * 2);
        this.transCtx.fillStyle = `rgba(${s.color}, ${s.alpha * 0.22})`;
        this.transCtx.fill();

        // Bright core
        this.transCtx.beginPath();
        this.transCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        this.transCtx.fillStyle = `rgba(${s.color}, ${s.alpha})`;
        this.transCtx.fill();
      }
      this.transCtx.restore();

      if (this.bridgeClouds.length > 0 || this.bridgeSparkles.length > 0) {
        this.bridgeFrame = requestAnimationFrame(renderBridge);
      } else {
        this.transCtx.clearRect(0, 0, vw, vh);
      }
    };

    if (this.bridgeFrame) cancelAnimationFrame(this.bridgeFrame);
    this.bridgeFrame = requestAnimationFrame(renderBridge);
  }

  replay(duration = 2100) {
    this.start(duration);
  }
}

// Global exposure
window.AfdassPerfumeLoader = AfdassPerfumeLoader;
