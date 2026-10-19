// Scroll progress bar
const bar = document.getElementById("progress");
if (bar) {
  addEventListener("scroll", () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
  });
}

// Project filter on Homepage
const filterButtons = document.querySelectorAll(".filters button");
if (filterButtons.length > 0) {
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
      const targetFilter = btn.dataset.filter;
      
      document.querySelectorAll(".proj").forEach((p) => {
        const statuses = (p.dataset.status || "").split(" ");
        const shouldShow = targetFilter === "all" || statuses.includes(targetFilter);
        p.classList.toggle("hide", !shouldShow);
      });
    });
  });
}

// Milestones roadmap progress calculator
const items = document.querySelectorAll("#checklist li");
if (items.length > 0) {
  const done = document.querySelectorAll("#checklist li.done").length;
  const doneEl = document.getElementById("done");
  const totalEl = document.getElementById("total");
  const meterFill = document.getElementById("meter-fill");

  if (doneEl) doneEl.textContent = done;
  if (totalEl) totalEl.textContent = items.length;
  if (meterFill) {
    setTimeout(() => {
      meterFill.style.width = (done / items.length) * 100 + "%";
    }, 300);
  }
}

// Code & Demo Access Modal Logic
const modal = document.getElementById("codeModal");
const modalEmailBtn = document.getElementById("modalEmailBtn");

function openCodeModal(projectName = "General Portfolio") {
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  
  if (modalEmailBtn) {
    const subject = encodeURIComponent(`Demo Access Request : ${projectName}`);
    const body = encodeURIComponent(`Hi Jasmita,\n\nI reviewed your portfolio and would like to request access to the staging demo or architecture breakdown for ${projectName}.\n\nBest regards,`);
    modalEmailBtn.href = `mailto:jasmita.i1109@gmail.com?subject=${subject}&body=${body}`;
  }
}

function closeCodeModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.querySelectorAll(".js-open-code-modal").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const project = btn.dataset.project || "All Projects";
    openCodeModal(project);
  });
});

const modalClose = document.getElementById("modalClose");
const modalCancel = document.getElementById("modalCancelBtn");

if (modalClose) modalClose.addEventListener("click", closeCodeModal);
if (modalCancel) modalCancel.addEventListener("click", closeCodeModal);

window.addEventListener("click", (e) => {
  if (e.target === modal) closeCodeModal();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && modal.classList.contains("open")) {
    closeCodeModal();
  }
});

// Interactive Note Expand / Collapse for research.html
document.querySelectorAll(".toggle-note-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;
    const drawer = document.getElementById(targetId);
    if (!drawer) return;

    const isHidden = drawer.hidden;
    drawer.hidden = !isHidden;
    btn.setAttribute("aria-expanded", isHidden ? "true" : "false");
    btn.innerHTML = isHidden ? 'Close Note <span class="arrow-indicator">↑</span>' : 'Read Note <span class="arrow-indicator">↓</span>';
  });
});

document.querySelectorAll(".collapse-note-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;
    const drawer = document.getElementById(targetId);
    const triggerBtn = document.querySelector(`.toggle-note-btn[data-target="${targetId}"]`);
    if (drawer) drawer.hidden = true;
    if (triggerBtn) {
      triggerBtn.setAttribute("aria-expanded", "false");
      triggerBtn.innerHTML = 'Read Note <span class="arrow-indicator">↓</span>';
      triggerBtn.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});

// Note category filter on research.html
const noteFilterBtns = document.querySelectorAll(".note-filter-pills button");
if (noteFilterBtns.length > 0) {
  noteFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      noteFilterBtns.forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
      const targetCategory = btn.dataset.tag;

      document.querySelectorAll(".note-feed-card").forEach((card) => {
        const categories = (card.dataset.category || "").split(" ");
        const shouldShow = targetCategory === "all" || categories.includes(targetCategory);
        card.style.display = shouldShow ? "block" : "none";
      });
    });
  });
}
