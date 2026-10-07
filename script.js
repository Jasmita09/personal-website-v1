(() => {
  "use strict";

  const bar = document.getElementById("progress");
  let scrollPending = false;

  function updateProgress() {
    if (!bar) return;

    const page = document.documentElement;
    const distance = page.scrollHeight - page.clientHeight;
    const percent = distance > 0
      ? (page.scrollTop / distance) * 100
      : 0;

    bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
  }

  function scheduleProgress() {
    if (scrollPending) return;

    scrollPending = true;

    requestAnimationFrame(() => {
      updateProgress();
      scrollPending = false;
    });
  }

  window.addEventListener("scroll", scheduleProgress, { passive: true });
  window.addEventListener("resize", scheduleProgress);
  window.addEventListener("load", updateProgress);

  document.querySelectorAll("details").forEach((item) => {
    item.addEventListener("toggle", scheduleProgress);
  });

  updateProgress();

  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");

  if (nav && toggle && links) {
    function closeMenu(returnFocus = false) {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");

      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";

      toggle.setAttribute("aria-expanded", String(open));
      links.classList.toggle("is-open", open);
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        toggle.getAttribute("aria-expanded") === "true"
      ) {
        closeMenu(true);
      }
    });

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target)) closeMenu();
    });

    window.matchMedia("(max-width: 780px)")
      .addEventListener("change", () => closeMenu());

    toggle.hidden = false;
    nav.classList.add("is-enhanced");
  }

  const filters = document.querySelector(".filters");
  const projects = [...document.querySelectorAll(".proj[data-status]")];
  const projectCount = document.getElementById("project-count");

  if (filters && projects.length) {
    filters.querySelectorAll("button[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const selected = button.dataset.filter;

        filters.querySelectorAll("button").forEach((item) => {
          const active = item === button;

          item.classList.toggle("on", active);
          item.setAttribute("aria-pressed", String(active));
        });

        let shown = 0;

        projects.forEach((project) => {
          const statuses = project.dataset.status.split(/\s+/);
          const visible =
            selected === "all" || statuses.includes(selected);

          project.hidden = !visible;

          if (visible) shown += 1;
        });

        if (projectCount) {
          projectCount.textContent =
            `${shown} ${shown === 1 ? "project" : "projects"} shown`;
        }

        scheduleProgress();
      });
    });

    filters.hidden = false;
  }

  const checklist = document.querySelectorAll("#checklist li");

  if (checklist.length) {
    const completed = [...checklist].filter((item) =>
      item.classList.contains("done")
    ).length;

    const done = document.getElementById("done");
    const total = document.getElementById("total");
    const fill = document.getElementById("meter-fill");
    const meter = document.querySelector(".meter");

    if (done) done.textContent = String(completed);
    if (total) total.textContent = String(checklist.length);

    if (fill) {
      fill.style.width = `${(completed / checklist.length) * 100}%`;
    }

    if (meter) {
      meter.setAttribute("aria-valuemax", String(checklist.length));
      meter.setAttribute("aria-valuenow", String(completed));
    }
  }

  const noteFilters = document.querySelector(".note-filters");
  const notes = [...document.querySelectorAll(".note-entry[data-category]")];
  const emptyNotes = document.getElementById("notes-empty");
  const noteCount = document.getElementById("note-count");

  if (notes.length && emptyNotes) {
    emptyNotes.hidden = true;
  }

  if (noteCount) {
    noteCount.textContent =
      `${notes.length} published ${notes.length === 1 ? "note" : "notes"}`;
  }

  if (noteFilters) {
    noteFilters.querySelectorAll("button[data-category]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const selected = button.dataset.category;

          noteFilters.querySelectorAll("button").forEach((item) => {
            item.classList.toggle("on", item === button);
            item.setAttribute("aria-pressed", String(item === button));
          });

          let shown = 0;

          notes.forEach((note) => {
            const visible =
              selected === "all" ||
              note.dataset.category === selected;

            note.hidden = !visible;

            if (visible) shown += 1;
          });

          if (emptyNotes) emptyNotes.hidden = shown > 0;

          if (noteCount) {
            noteCount.textContent = notes.length
              ? `${shown} ${shown === 1 ? "note" : "notes"} in this view`
              : "0 published notes";
          }

          const message = document.getElementById("empty-message");
          const image = emptyNotes?.querySelector("img");

          if (message && notes.length) {
            message.textContent =
              "No notes in this category yet. Try another chapter.";
          }

          if (image) image.hidden = notes.length > 0;

          scheduleProgress();
        });
      });

    noteFilters.hidden = false;
  }

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
