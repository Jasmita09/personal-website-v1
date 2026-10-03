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

// Display-only checklist: counter and bar are read from the markup
const items = document.querySelectorAll("#checklist li");
const done = document.querySelectorAll("#checklist li.done").length;
document.getElementById("done").textContent = done;
document.getElementById("total").textContent = items.length;
setTimeout(() => {
  document.getElementById("meter-fill").style.width = (done / items.length) * 100 + "%";
}, 300);
