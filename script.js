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

// Display-only checklist
const items = document.querySelectorAll("#checklist li");
const done = document.querySelectorAll("#checklist li.done").length;
document.getElementById("done").textContent = done;
document.getElementById("total").textContent = items.length;
setTimeout(() => {
  document.getElementById("meter-fill").style.width = (done / items.length) * 100 + "%";
}, 300);

// Code & Demo Access Modal Logic
const modal = document.getElementById("codeModal");

function openCodeModal() {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeCodeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

// Attach listener to all GitHub buttons
document.querySelectorAll(".js-open-code-modal").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    openCodeModal();
  });
});

// Close event listeners
document.getElementById("modalClose").addEventListener("click", closeCodeModal);
document.getElementById("modalCancelBtn").addEventListener("click", closeCodeModal);

window.addEventListener("click", (e) => {
  if (e.target === modal) closeCodeModal();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) {
    closeCodeModal();
  }
});
