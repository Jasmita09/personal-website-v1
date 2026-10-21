// ==========================================================================
// SCROLL PROGRESS BAR
// ==========================================================================
const bar = document.getElementById("progress");
if (bar) {
  addEventListener("scroll", () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
  });
}

// ==========================================================================
// HOMEPAGE PROJECT FILTER
// ==========================================================================
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

// ==========================================================================
// ROADMAP CHECKLIST PROGRESS CALCULATOR
// ==========================================================================
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

// ==========================================================================
// DEMO REQUEST MODAL
// ==========================================================================
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

// ==========================================================================
// DYNAMIC NOTES ROUTER (research.html)
// ==========================================================================
const archiveView = document.getElementById("archiveView");
const readerView = document.getElementById("readerView");
const backBtn = document.getElementById("backToArchiveBtn");

function showReader(postId) {
  if (!archiveView || !readerView) return;
  
  archiveView.hidden = true;
  readerView.hidden = false;
  
  // Hide all post blocks, show the chosen one
  document.querySelectorAll(".post-content-block").forEach(p => p.hidden = true);
  const activePost = document.getElementById(`post-${postId}`);
  if (activePost) activePost.hidden = false;

  // Update sidebar active link
  document.querySelectorAll(".sidebar-index-list li").forEach(li => li.classList.remove("active-note"));
  const sideLink = document.getElementById(`sideLink-${postId}`);
  if (sideLink) sideLink.classList.add("active-note");

  // Load real comments for this specific post
  loadCommentsForPost(postId);

  // Update URL hash without jumping
  history.pushState(null, "", `#${postId}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showArchive() {
  if (!archiveView || !readerView) return;
  
  readerView.hidden = true;
  archiveView.hidden = false;
  history.pushState(null, "", window.location.pathname);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Attach click triggers to all Read Note buttons
document.querySelectorAll(".view-post-trigger").forEach((btn) => {
  btn.addEventListener("click", () => {
    const postId = btn.dataset.postId;
    showReader(postId);
  });
});

if (backBtn) {
  backBtn.addEventListener("click", showArchive);
}

// Support browser back/forward buttons and direct shared links
window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.replace("#", "");
  if (hash === "welcome" || hash === "midterm-setback") {
    showReader(hash);
  }
});

window.addEventListener("popstate", () => {
  const hash = window.location.hash.replace("#", "");
  if (hash === "welcome" || hash === "midterm-setback") {
    showReader(hash);
  } else {
    showArchive();
  }
});

// Category filter on research.html archive
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

// ==========================================================================
// REAL COMMENT SYSTEM & EMAIL REGISTRATION
// ==========================================================================
const registerForm = document.getElementById("registerForm");
const commentForm = document.getElementById("commentForm");
const gateBox = document.getElementById("gateBox");
const commentInputBox = document.getElementById("commentInputBox");
const currentUserName = document.getElementById("currentUserName");
const currentUserEmail = document.getElementById("currentUserEmail");
const logoutBtn = document.getElementById("logoutBtn");
const commentsList = document.getElementById("commentsList");
const emptyComments = document.getElementById("emptyComments");
const commentCount = document.getElementById("commentCount");

function getCurrentPostId() {
  const hash = window.location.hash.replace("#", "");
  return hash === "midterm-setback" ? "midterm-setback" : "welcome";
}

function checkUserRegistration() {
  const savedUser = localStorage.getItem("cherri_user");
  if (savedUser) {
    const user = JSON.parse(savedUser);
    if (gateBox) gateBox.hidden = true;
    if (commentInputBox) {
      commentInputBox.hidden = false;
      if (currentUserName) currentUserName.textContent = user.name;
      if (currentUserEmail) currentUserEmail.textContent = user.email;
    }
  } else {
    if (gateBox) gateBox.hidden = false;
    if (commentInputBox) commentInputBox.hidden = true;
  }
}

function loadCommentsForPost(postId) {
  if (!commentsList) return;
  
  const saved = localStorage.getItem(`cherri_comments_${postId}`);
  const comments = saved ? JSON.parse(saved) : [];

  // Remove existing comment cards
  commentsList.querySelectorAll(".comment-card").forEach(el => el.remove());

  if (comments.length === 0) {
    if (emptyComments) emptyComments.hidden = false;
    if (commentCount) commentCount.textContent = "0 comments";
  } else {
    if (emptyComments) emptyComments.hidden = true;
    if (commentCount) commentCount.textContent = `${comments.length} comment${comments.length > 1 ? "s" : ""}`;
    
    comments.forEach((c) => {
      const card = createCommentElement(c.name, c.date, c.text);
      commentsList.appendChild(card);
    });
  }
}

function createCommentElement(name, date, text) {
  const article = document.createElement("article");
  article.className = "comment-card";
  const initial = name.charAt(0).toUpperCase();

  article.innerHTML = `
    <div class="comment-top">
      <div class="comment-author">
        <span class="avatar-circle">${initial}</span>
        <strong>${name}</strong>
      </div>
      <time>${date}</time>
    </div>
    <p>${text}</p>
  `;
  return article;
}

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();

    if (name && email) {
      localStorage.setItem("cherri_user", JSON.stringify({ name, email }));
      checkUserRegistration();
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("cherri_user");
    checkUserRegistration();
  });
}

if (commentForm) {
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const commentInput = document.getElementById("commentText");
    const text = commentInput.value.trim();
    const user = JSON.parse(localStorage.getItem("cherri_user") || "{}");
    const postId = getCurrentPostId();

    if (text && user.name) {
      const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      const newComment = { name: user.name, date: today, text: text };

      // Save to localStorage
      const saved = localStorage.getItem(`cherri_comments_${postId}`);
      const comments = saved ? JSON.parse(saved) : [];
      comments.unshift(newComment);
      localStorage.setItem(`cherri_comments_${postId}`, JSON.stringify(comments));

      // Update UI
      if (emptyComments) emptyComments.hidden = true;
      const card = createCommentElement(newComment.name, newComment.date, newComment.text);
      commentsList.prepend(card);
      commentInput.value = "";

      if (commentCount) {
        commentCount.textContent = `${comments.length} comment${comments.length > 1 ? "s" : ""}`;
      }
    }
  });
}

// Run checks on page load
checkUserRegistration();
