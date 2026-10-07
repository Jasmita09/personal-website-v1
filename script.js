(() => {
  "use strict";

  const email = "jasmita.i1109@gmail.com";
  const bar = document.getElementById("progress");
  let scheduled = false;
  function updateProgress() {
    const root = document.documentElement;
    const distance = root.scrollHeight - root.clientHeight;
    if (bar) bar.style.width = `${distance > 0 ? Math.max(0, Math.min(100, root.scrollTop / distance * 100)) : 0}%`;
    scheduled = false;
  }
  function queueProgress() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateProgress);
    }
  }
  window.addEventListener("scroll", queueProgress, { passive: true });
  window.addEventListener("resize", queueProgress);
  window.addEventListener("load", updateProgress);
  document.querySelectorAll("details").forEach(item => item.addEventListener("toggle", queueProgress));
  updateProgress();

  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  if (nav && toggle && links) {
    const closeMenu = () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      links.classList.toggle("is-open", open);
    });
    links.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("click", event => {
      if (!nav.contains(event.target)) closeMenu();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        toggle.focus();
      }
    });
    window.matchMedia("(max-width: 760px)").addEventListener("change", closeMenu);
    nav.classList.add("is-enhanced");
    toggle.hidden = false;
  }

  function setFilterButtons(group, selected) {
    group.querySelectorAll("button").forEach(button => {
      button.classList.toggle("on", button === selected);
      button.setAttribute("aria-pressed", String(button === selected));
    });
  }
  const filters = document.querySelector(".filters");
  const projects = [...document.querySelectorAll(".proj[data-status]")];
  if (filters) {
    filters.querySelectorAll("button[data-filter]").forEach(button => {
      button.addEventListener("click", () => {
        setFilterButtons(filters, button);
        let visible = 0;
        projects.forEach(project => {
          project.hidden = button.dataset.filter !== "all" && !project.dataset.status.split(/\s+/).includes(button.dataset.filter);
          if (!project.hidden) visible++;
        });
        const counter = document.getElementById("project-count");
        if (counter) counter.textContent = `${visible} ${visible === 1 ? "project" : "projects"} shown`;
        queueProgress();
      });
    });
    filters.hidden = false;
  }

  const items = [...document.querySelectorAll("#checklist li")];
  if (items.length) {
    const done = items.filter(item => item.classList.contains("done")).length;
    const doneLabel = document.getElementById("done");
    const totalLabel = document.getElementById("total");
    const fill = document.getElementById("meter-fill");
    const meter = document.querySelector(".meter");
    if (doneLabel) doneLabel.textContent = String(done);
    if (totalLabel) totalLabel.textContent = String(items.length);
    if (fill) fill.style.width = `${done / items.length * 100}%`;
    if (meter) {
      meter.setAttribute("aria-valuemax", String(items.length));
      meter.setAttribute("aria-valuenow", String(done));
    }
  }

  const noteFilters = document.querySelector(".note-filters");
  const notes = [...document.querySelectorAll(".note-entry[data-category]")];
  const empty = document.getElementById("notes-empty");
  const noteCount = document.getElementById("note-count");
  if (notes.length && empty) empty.hidden = true;
  if (noteCount) noteCount.textContent = `${notes.length} published ${notes.length === 1 ? "note" : "notes"}`;
  if (noteFilters) {
    noteFilters.querySelectorAll("button[data-category]").forEach(button => {
      button.addEventListener("click", () => {
        setFilterButtons(noteFilters, button);
        let visible = 0;
        notes.forEach(note => {
          note.hidden = button.dataset.category !== "all" && note.dataset.category !== button.dataset.category;
          if (!note.hidden) visible++;
        });
        if (empty) empty.hidden = visible > 0;
        if (noteCount) noteCount.textContent = `${visible} ${visible === 1 ? "note" : "notes"} in this view`;
        if (notes.length) {
          const image = empty?.querySelector("img");
          const message = document.getElementById("empty-message");
          if (image) image.hidden = true;
          if (message) message.textContent = "No notes in this category yet. Try another chapter.";
        }
        queueProgress();
      });
    });
    noteFilters.hidden = false;
  }

  if (typeof HTMLDialogElement !== "undefined" && typeof HTMLDialogElement.prototype.showModal === "function") {
    const dialog = document.createElement("dialog");
    dialog.className = "contact-dialog";
    dialog.setAttribute("aria-labelledby", "dialog-title");
    dialog.setAttribute("aria-describedby", "dialog-description");
    dialog.innerHTML = `
      <button class="dialog-close" type="button" aria-label="Close dialog">×</button>
      <span class="eyebrow" id="dialog-kicker"></span>
      <h2 id="dialog-title"></h2>
      <p id="dialog-description"></p>
      <a class="email-address" href="mailto:${email}">${email}</a>
      <div class="dialog-actions">
        <a class="btn fill dialog-email" href="mailto:${email}">Email me ↗</a>
        <button class="btn line dialog-copy" type="button">Copy email</button>
        <button class="btn line dialog-cancel" type="button">Close</button>
      </div>
      <p class="copy-status" role="status" aria-live="polite"></p>`;
    document.body.append(dialog);
    let opener = null;
    const close = () => dialog.close();
    dialog.querySelector(".dialog-close").addEventListener("click", close);
    dialog.querySelector(".dialog-cancel").addEventListener("click", close);
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("modal-open");
      opener?.focus({ preventScroll: true });
    });
    dialog.querySelector(".dialog-copy").addEventListener("click", async () => {
      const status = dialog.querySelector(".copy-status");
      try {
        await navigator.clipboard.writeText(email);
        status.textContent = "Email address copied.";
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(dialog.querySelector(".email-address"));
        selection?.removeAllRanges();
        selection?.addRange(range);
        status.textContent = "Email selected. Press Ctrl+C or Command+C to copy.";
      }
    });
    document.querySelectorAll("[data-contact]").forEach(trigger => {
      trigger.addEventListener("click", event => {
        event.preventDefault();
        opener = trigger;
        const demo = trigger.dataset.contact === "demo";
        const project = trigger.dataset.project || "my projects";
        dialog.querySelector("#dialog-kicker").textContent = demo ? "A closer look" : "Let’s connect";
        dialog.querySelector("#dialog-title").textContent = demo ? "Looking for a project demo?" : "I’d love to connect.";
        dialog.querySelector("#dialog-description").textContent = demo
          ? `I’d love to share ${project} with you. Email me and I’ll send an available demo or arrange a guided walkthrough of the work so far.`
          : "Email me about internships, hackathon teams, collaborations, or an interesting question. I’d love to hear what you’re working on.";
        const subject = demo ? `${project} — demo request` : "Let’s connect";
        const body = demo ? `Hi Jasmita, I’d love to see a demo or walkthrough of ${project}!` : "Hi Jasmita, I’d love to connect!";
        dialog.querySelector(".dialog-email").href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        dialog.querySelector(".copy-status").textContent = "";
        document.body.classList.add("modal-open");
        dialog.showModal();
        dialog.querySelector(".dialog-close").focus();
      });
      trigger.setAttribute("aria-haspopup", "dialog");
    });
  }

  document.querySelectorAll("[data-year]").forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });
})();
