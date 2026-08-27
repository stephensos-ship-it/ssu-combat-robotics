/* Arena background: two robots fight, one is chased out,
   the next pair drives in from the far side. Pure canvas, no libraries. */
/* ---------------- arena ---------------- */
  (function () {
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h) {
        this.rect(x, y, w, h);
        return this;
      };
    }

    const canvas = document.getElementById("bg");
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const CFG = { alpha: 0.95, scale: 1.75, sparks: 22, shove: 1.9, dust: 38 };

    let W = 0, H = 0, cx = 0, cy = 0, t = 0;
    let side = 1, jukeAt = 0, jukeY = 0;
    let scuffs = [], dust = [], sparks = [], bots = null;

    /* They spawn just off the edge and drive in, alternating which side they
       come from, so each cycle reads as the fight moving across the floor
       rather than as a reset. */
    function makeBots() {
      const off = Math.max(W * 0.44, 300);
      return [
        { x: -off * side, y: -30, h: side > 0 ? 0 : Math.PI, sp: 0, kx: 0, ky: 0, spin: 0, color: "#EFB532", tone: "#6A5214" },
        { x: off * side, y: 30, h: side > 0 ? Math.PI : 0, sp: 0, kx: 0, ky: 0, spin: 0, color: "#5C9BE0", tone: "#1E3D5E" }
      ];
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      /* Push the fight toward the lower right on wide screens so it plays
         beside the text column rather than directly under the headline. */
      cx = W >= 1150 ? W * 0.70 : W * 0.5;
      cy = H * 0.62;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!bots) bots = makeBots();
      buildFloor();
    }

    /* Wear is generated once so the floor reads as a surface that has been
       driven on, rather than noise that flickers every frame. */
    function buildFloor() {
      scuffs = [];
      for (let i = 0; i < 24; i++) {
        scuffs.push({
          x: Math.random() * W, y: Math.random() * H,
          r: 24 + Math.random() * 130,
          a0: Math.random() * Math.PI * 2,
          sweep: 0.3 + Math.random() * 1.5,
          w: 0.6 + Math.random() * 1.4,
          a: 0.02 + Math.random() * 0.045
        });
      }
      dust = [];
      for (let i = 0; i < CFG.dust; i++) {
        dust.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.16,
          vy: -0.05 - Math.random() * 0.2,
          r: 0.5 + Math.random() * 1.2,
          a: 0.08 + Math.random() * 0.28
        });
      }
    }

    function drawFloor() {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.74);
      g.addColorStop(0, "#1E2836");
      g.addColorStop(0.5, "#151C27");
      g.addColorStop(1, "#0A0E14");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      const step = 76;
      ctx.strokeStyle = "rgba(0, 76, 151, 0.32)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = cx % step; x < W; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      for (let y = cy % step; y < H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();

      for (const s of scuffs) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, s.a0, s.a0 + s.sweep);
        ctx.strokeStyle = "rgba(160, 180, 200, " + s.a + ")";
        ctx.lineWidth = s.w;
        ctx.stroke();
      }
    }

    function drawDust() {
      for (const d of dust) {
        d.x += d.vx; d.y += d.vy;
        if (d.y < -6) { d.y = H + 6; d.x = Math.random() * W; }
        if (d.x < -6) d.x = W + 6;
        if (d.x > W + 6) d.x = -6;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(170, 190, 210, " + d.a * 0.45 + ")";
        ctx.fill();
      }
    }

    /* Top-down chassis with four visible wheels. The wheels are what stop it
       reading as a paper aeroplane from above. */
    function drawBot(b) {
      const s = 15 * CFG.scale;
      ctx.save();
      ctx.translate(cx + b.x, cy + b.y);
      ctx.rotate(b.h + b.spin);
      ctx.globalAlpha = CFG.alpha;

      ctx.beginPath();
      ctx.ellipse(0, s * 0.16, s * 1.24, s * 0.86, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,.34)";
      ctx.fill();

      ctx.fillStyle = "#0D131B";
      for (const wy of [-1, 1]) {
        for (const wx of [-0.52, 0.42]) {
          ctx.save();
          ctx.translate(s * wx, wy * s * 0.62);
          ctx.beginPath();
          ctx.roundRect(-s * 0.26, -s * 0.17, s * 0.52, s * 0.34, s * 0.1);
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.beginPath();
      ctx.roundRect(-s * 0.78, -s * 0.56, s * 1.4, s * 1.12, s * 0.16);
      ctx.fillStyle = "#1F2836";
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = b.color;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(s * 0.62, -s * 0.56);
      ctx.lineTo(s * 1.28, 0);
      ctx.lineTo(s * 0.62, s * 0.56);
      ctx.closePath();
      ctx.fillStyle = b.tone;
      ctx.fill();
      ctx.strokeStyle = b.color;
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(-s * 0.5, -s * 0.28, s * 0.72, s * 0.56, s * 0.08);
      ctx.fillStyle = "#151D27";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-s * 0.24, 0, s * 0.11, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();

      ctx.restore();
      ctx.globalAlpha = 1;
    }

    function burst(x, y, n) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = 0.9 + Math.random() * 3.2;
        sparks.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 22 + Math.random() * 24, age: 0, hot: Math.random() < 0.4 });
      }
    }

    function drawSparks() {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.age++;
        if (p.age > p.life) { sparks.splice(i, 1); continue; }
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.93; p.vy = p.vy * 0.93 + 0.05;
        const k = 1 - p.age / p.life;
        ctx.beginPath();
        ctx.moveTo(cx + p.x, cy + p.y);
        ctx.lineTo(cx + p.x - p.vx * 1.7, cy + p.y - p.vy * 1.7);
        ctx.strokeStyle = p.hot ? "rgba(255,233,176," + k + ")" : "rgba(239,181,50," + k * 0.9 + ")";
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
    }

    function norm(a) {
      while (a > Math.PI) a -= Math.PI * 2;
      while (a < -Math.PI) a += Math.PI * 2;
      return a;
    }

    function drive(b, tx, ty, target, turn) {
      const d = norm(Math.atan2(ty - b.y, tx - b.x) - b.h);
      b.h += Math.max(-turn, Math.min(turn, d));
      b.sp += (target - b.sp) * 0.07;
      b.x += Math.cos(b.h) * b.sp + b.kx;
      b.y += Math.sin(b.h) * b.sp + b.ky;
      b.kx *= 0.88; b.ky *= 0.88; b.spin *= 0.9;
    }

    const P = { ENTER: 66, BRAWL: 372, RESET: 540 };

    function choreograph(tt) {
      const A = bots[0], B = bots[1];

      if (tt < P.ENTER) {
        drive(A, -46 * side, 0, 6.4, 0.07);
        drive(B, 46 * side, 0, 6.4, 0.07);
      } else if (tt < P.BRAWL) {
        const swirl = Math.sin(tt * 0.034) * 78;
        drive(A, B.x, B.y + swirl, 2.9, 0.075);
        drive(B, A.x, A.y - swirl, 2.9, 0.075);

        const dx = A.x - B.x, dy = A.y - B.y, dist = Math.hypot(dx, dy);
        if (dist < 36 * CFG.scale) {
          const nx = dx / (dist || 1), ny = dy / (dist || 1);
          A.kx += nx * CFG.shove; A.ky += ny * CFG.shove;
          B.kx -= nx * CFG.shove; B.ky -= ny * CFG.shove;
          A.spin += (Math.random() - 0.5) * 0.9;
          B.spin += (Math.random() - 0.5) * 0.9;
          A.sp *= 0.5; B.sp *= 0.5;
          burst((A.x + B.x) / 2, (A.y + B.y) / 2, CFG.sparks);
        }
      } else {
        /* Gold runs for the far edge, jinking. Blue aims at a point in gold's
           WAKE rather than at gold itself: chasing the leader's position makes
           the two diverge on every turn, chasing its tail keeps blue tucked in
           behind where it reads as a chase. */
        if (tt > jukeAt) { jukeAt = tt + 32 + Math.random() * 22; jukeY = (Math.random() - 0.5) * 96; }
        drive(A, (W + 500) * side, jukeY, 5.0, 0.09);
        drive(B, A.x - Math.cos(A.h) * 74, A.y - Math.sin(A.h) * 74, 5.5, 0.088);

        const dx = A.x - B.x, dy = A.y - B.y, dist = Math.hypot(dx, dy);
        if (dist < 34 * CFG.scale) {
          const nx = dx / (dist || 1), ny = dy / (dist || 1);
          A.kx += nx * 2.6; A.ky += ny * 2.6;
          B.sp *= 0.78;
          A.spin += (Math.random() - 0.5) * 1.1;
          burst((A.x + B.x) / 2, (A.y + B.y) / 2, Math.round(CFG.sparks * 0.7));
        }
      }
    }

    function frame() {
      t += 1;
      const tt = t % P.RESET;
      if (tt < 1) { side = -side; sparks = []; bots = makeBots(); }

      ctx.clearRect(0, 0, W, H);
      drawFloor();
      drawDust();
      choreograph(tt);
      drawBot(bots[0]);
      drawBot(bots[1]);
      drawSparks();

      if (!reduced) requestAnimationFrame(frame);
    }

    window.addEventListener("resize", resize);
    resize();
    if (reduced) { for (let i = 0; i < 240; i++) choreograph(P.ENTER + i); }
    frame();
  })();
