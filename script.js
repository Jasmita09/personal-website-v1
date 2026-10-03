// Scroll progress bar
const bar = document.getElementById("progress");
addEventListener("scroll", () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
});

// Reveal on scroll
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Count-up stats
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const end = parseFloat(el.dataset.count);
    const dec = +el.dataset.dec || 0;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / 1200, 1);
      el.textContent = (end * p).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countIO.unobserve(el);
  });
});
document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

// Project filter
document.querySelectorAll(".filters button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filters button").forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    document.querySelectorAll(".proj").forEach((p) => {
      p.classList.toggle("hide", btn.dataset.f !== "all" && p.dataset.s !== btn.dataset.f);
    });
  });
});

// Hero animation: noisy data with a clean signal line
const cv = document.getElementById("signal");
const ctx = cv.getContext("2d");
let t = 0;

function resize() {
  cv.width = cv.clientWidth * devicePixelRatio;
  cv.height = cv.clientHeight * devicePixelRatio;
}
resize();
addEventListener("resize", resize);

function draw() {
  const w = cv.width;
  const h = cv.height;
  ctx.clearRect(0, 0, w, h);

  // noisy points (sage green)
  ctx.fillStyle = "rgba(63, 115, 85, 0.35)";
  for (let x = 0; x < w; x += 10 * devicePixelRatio) {
    const base = h / 2 + Math.sin(x / 60 + t) * h * 0.25;
    const y = base + (Math.random() - 0.5) * h * 0.5;
    ctx.beginPath();
    ctx.arc(x, y, 2.2 * devicePixelRatio, 0, 7);
    ctx.fill();
  }

  // clean signal (rose)
  ctx.strokeStyle = "#c4587a";
  ctx.lineWidth = 3 * devicePixelRatio;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 4) {
    const y = h / 2 + Math.sin(x / 60 + t) * h * 0.25;
    x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();

  t += 0.03;
  setTimeout(() => requestAnimationFrame(draw), 60);
}
draw();
