// ============================================================
// CheckScore — Application Logic (South Africa / NSC only)
// ============================================================

// ── State ─────────────────────────────────────────────────
const state = {
  step: 1,
  subjectGrades: {},   // { "Mathematics": "7", ... }
  calculatedScore: 0,
  detectedStreams: new Set(),
  results: [],
  filters: { faculty: "all", type: "all", search: "", eligibleOnly: false, streamOnly: false },
  rowIndex: 0,
};

// ── DOM helpers ───────────────────────────────────────────
const $ = id => document.getElementById(id);
const show = el => el && el.classList.remove("hidden");
const hide = el => el && el.classList.add("hidden");

// ── Step navigation ───────────────────────────────────────
function goToStep(n) {
  state.step = n;
  document.querySelectorAll(".step-panel").forEach(p => hide(p));
  show($(`step-${n}`));
  document.querySelectorAll(".stepper-item").forEach((el, i) => {
    el.classList.remove("active", "done");
    if (i + 1 < n) el.classList.add("done");
    if (i + 1 === n) el.classList.add("active");
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Step 1: Subject Grades (NSC / APS) ───────────────────
function updateScoreDisplay() {
  const score = calculateAPS(state.subjectGrades);
  state.calculatedScore = score;
  $("live-score-value").textContent = score;
  const pct = Math.min(100, Math.round((score / 42) * 100));
  $("score-progress-bar").style.width = `${pct}%`;
  $("score-progress-bar").style.background =
    pct >= 70 ? "var(--clr-primary)" :
    pct >= 40 ? "var(--clr-accent)"  : "var(--clr-warn)";
}

function createSubjectRow() {
  const idx = state.rowIndex++;
  const row = document.createElement("div");
  row.className = "subject-row";
  row.dataset.idx = idx;

  const subjectSel = document.createElement("select");
  subjectSel.className = "subject-select";
  subjectSel.innerHTML =
    `<option value="">— Select subject —</option>` +
    NSC_SUBJECTS.map(s => `<option value="${s}">${s}</option>`).join("");

  const gradeSel = document.createElement("select");
  gradeSel.className = "grade-select";
  gradeSel.innerHTML =
    `<option value="">Grade</option>` +
    NSC_GRADES.map(g => `<option value="${g}">${g}</option>`).join("");

  const removeBtn = document.createElement("button");
  removeBtn.className = "btn-remove-row";
  removeBtn.type = "button";
  removeBtn.title = "Remove";
  removeBtn.innerHTML =
    `<svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
    </svg>`;

  removeBtn.addEventListener("click", () => {
    row.remove();
    syncGrades();
    updateRowCounter();
  });

  subjectSel.addEventListener("change", () => { syncGrades(); updateScoreDisplay(); });
  gradeSel.addEventListener("change",   () => { syncGrades(); updateScoreDisplay(); });

  row.appendChild(subjectSel);
  row.appendChild(gradeSel);
  row.appendChild(removeBtn);
  return row;
}

function syncGrades() {
  // First pass: collect all selected subject names (including blanks)
  const rows = [...document.querySelectorAll("#subject-rows .subject-row")];
  const seen = new Set();
  const dupes = new Set();
  rows.forEach(row => {
    const subj = row.querySelector(".subject-select").value;
    if (!subj) return;
    if (seen.has(subj)) dupes.add(subj);
    seen.add(subj);
  });

  // Second pass: mark duplicates visually and build grade map
  state.subjectGrades = {};
  rows.forEach(row => {
    const subj  = row.querySelector(".subject-select").value;
    const grade = row.querySelector(".grade-select").value;
    const isDupe = subj && dupes.has(subj);
    row.classList.toggle("duplicate", isDupe);
    if (subj && grade) state.subjectGrades[subj] = grade;
  });

  // Show or clear the duplicate warning
  const err = $("grade-error");
  if (dupes.size > 0 && !err.textContent.startsWith("Please")) {
    err.textContent = `Duplicate subject${dupes.size > 1 ? "s" : ""}: ${[...dupes].join(", ")}. Only the last grade entered will be used.`;
  } else if (dupes.size === 0 && err.textContent.startsWith("Duplicate")) {
    err.textContent = "";
  }
}

function updateRowCounter() {
  const n = document.querySelectorAll("#subject-rows .subject-row").length;
  $("row-count").textContent = `${n} subject${n !== 1 ? "s" : ""} added`;
}

function initStep1() {
  // Grade legend
  const legend = $("grade-legend");
  legend.innerHTML = Object.entries(NSC_LABELS)
    .map(([g, l]) => `<span class="legend-item"><strong>${g}</strong> — ${l}</span>`)
    .join("");

  // Clear rows and reset index
  $("subject-rows").innerHTML = "";
  state.subjectGrades = {};
  state.rowIndex = 0;

  // Pre-populate 6 rows
  for (let i = 0; i < 6; i++) {
    $("subject-rows").appendChild(createSubjectRow());
  }
  updateRowCounter();
  updateScoreDisplay();

  // Re-wire add button to avoid duplicate listeners
  const addBtn = $("btn-add-subject");
  const newAddBtn = addBtn.cloneNode(true);
  addBtn.parentNode.replaceChild(newAddBtn, addBtn);
  $("btn-add-subject").addEventListener("click", () => {
    if (document.querySelectorAll("#subject-rows .subject-row").length >= 12) return;
    $("subject-rows").appendChild(createSubjectRow());
    updateRowCounter();
  });

  $("btn-step1-next").onclick = () => {
    syncGrades();
    const err   = $("grade-error");
    const count = Object.keys(state.subjectGrades).length;

    if (count < 6) {
      err.textContent = "Please enter at least 6 subjects with grades.";
      return;
    }

    // Require English
    const engKeys = ["English Home Language", "English First Additional Language"];
    const hasEnglish = engKeys.some(k => state.subjectGrades[k]);
    if (!hasEnglish) {
      err.textContent =
        "Most programmes require English. Please add your English subject and grade.";
      return;
    }

    err.textContent = "";
    state.calculatedScore  = calculateAPS(state.subjectGrades);
    state.detectedStreams   = detectStreams(state.subjectGrades);
    computeResults();
    populateFilters();
    goToStep(2);
    renderResults();
  };
}

// ── Step 2: Results ───────────────────────────────────────
function computeResults() {
  state.results = COURSES
    .map(c => {
      const r = checkEligibility(c, state.calculatedScore, state.subjectGrades);
      const streamMatch = c.streams.some(s => state.detectedStreams.has(s));
      return { course: c, ...r, streamMatch };
    })
    .sort((a, b) => {
      // Primary: eligible first
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
      // Secondary: stream match first within each group
      if (a.streamMatch !== b.streamMatch) return a.streamMatch ? -1 : 1;
      // Tertiary: alphabetical
      return a.course.name.localeCompare(b.course.name);
    });
}

function getFilteredResults() {
  return state.results.filter(r => {
    const { faculty, type, search, eligibleOnly, streamOnly } = state.filters;
    if (eligibleOnly && !r.eligible)    return false;
    if (streamOnly  && !r.streamMatch)  return false;
    if (faculty !== "all" && r.course.faculty !== faculty) return false;
    if (type !== "all" && r.institution && r.institution.type !== type) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.course.name.toLowerCase().includes(q) &&
          !(r.institution && r.institution.name.toLowerCase().includes(q))) return false;
    }
    return true;
  });
}

function renderResults() {
  const filtered         = getFilteredResults();
  const totalEligible    = state.results.filter(r => r.eligible).length;
  const filteredEligible = filtered.filter(r => r.eligible).length;

  $("summary-score").textContent    = state.calculatedScore;
  $("summary-subjects").textContent = Object.keys(state.subjectGrades).length;
  $("summary-total").textContent    = totalEligible;
  $("summary-filtered").textContent = filteredEligible;

  // Pathway banner
  const streamBanner = $("stream-banner");
  const streamChips  = $("detected-streams");
  if (state.detectedStreams.size > 0) {
    streamChips.innerHTML = [...state.detectedStreams]
      .map(s => `<span class="stream-chip">${STREAM_LABELS[s]}</span>`)
      .join("");
    show(streamBanner);
  } else {
    hide(streamBanner);
  }

  renderCards(filtered);
}

function renderCards(items) {
  const grid = $("results-grid");
  grid.innerHTML = "";

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 64 64" fill="none" width="56" height="56">
          <circle cx="32" cy="32" r="30" stroke="var(--clr-muted)" stroke-width="2"/>
          <path d="M22 42 L42 22 M22 22 L42 42" stroke="var(--clr-muted)" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p>No courses match your current filters.</p>
        <button class="btn-secondary" onclick="clearFilters()">Clear filters</button>
      </div>`;
    return;
  }

  items.forEach(r => {
    const { course, eligible, scoreShortfall, missingSubjects, failedSubjects, institution, streamMatch } = r;
    const card = document.createElement("article");
    card.className = `result-card ${eligible ? "eligible" : "ineligible"}`;

    const badge = eligible
      ? `<span class="badge badge-pass">Eligible</span>`
      : `<span class="badge badge-fail">Not Eligible</span>`;

    const pathwayBadge = streamMatch
      ? `<span class="badge badge-stream">Pathway match</span>`
      : "";

    const instName  = institution ? institution.name     : "Unknown";
    const instType  = institution ? institution.type     : "";
    const instUrl   = institution ? institution.url      : "#";
    const instLoc   = institution ? institution.location : "";

    // Application deadline row
    let deadlineHtml = "";
    if (institution && institution.appOpen) {
      const today     = new Date();
      today.setHours(0, 0, 0, 0);
      const closeDate = institution.appClose ? new Date(institution.appClose) : null;
      const openDate  = new Date(institution.appOpen);
      const notYetOpen = today < openDate;
      const isClosed   = closeDate && today > closeDate;
      const daysLeft   = closeDate ? Math.ceil((closeDate - today) / 86400000) : null;

      let statusClass = "deadline-open";
      let statusText  = "";

      if (institution.appClose === null) {
        // Rolling admissions
        statusClass = "deadline-rolling";
        statusText  = "Rolling admissions";
      } else if (notYetOpen) {
        statusClass = "deadline-upcoming";
        statusText  = `Opens ${openDate.toLocaleDateString("en-ZA", { day:"numeric", month:"short", year:"numeric" })}`;
      } else if (isClosed) {
        statusClass = "deadline-closed";
        statusText  = `Closed ${closeDate.toLocaleDateString("en-ZA", { day:"numeric", month:"short", year:"numeric" })}`;
      } else if (daysLeft !== null && daysLeft <= 14) {
        statusClass = "deadline-urgent";
        statusText  = `Closes in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;
      } else if (daysLeft !== null && daysLeft <= 60) {
        statusClass = "deadline-warning";
        statusText  = `Closes ${closeDate.toLocaleDateString("en-ZA", { day:"numeric", month:"short" })} (${daysLeft}d)`;
      } else {
        statusText = `Closes ${closeDate.toLocaleDateString("en-ZA", { day:"numeric", month:"short", year:"numeric" })}`;
      }

      const noteHtml = institution.appNote
        ? `<span class="deadline-note">${institution.appNote}</span>` : "";

      deadlineHtml = `
        <div class="card-deadline ${statusClass}">
          <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
          </svg>
          <span class="deadline-status">${statusText}</span>${noteHtml}
        </div>`;
    }

    // Issues list
    let issues = "";
    if (!eligible) {
      const li = [];
      if (scoreShortfall > 0) {
        li.push(`<li>APS too low by <strong>${scoreShortfall} point${scoreShortfall !== 1 ? "s" : ""}</strong> (need ${course.minScore})</li>`);
      }
      missingSubjects.forEach(s => li.push(`<li>Missing result for <strong>${s}</strong></li>`));
      failedSubjects.forEach(({ subject, yourGrade, needGrade }) =>
        li.push(`<li><strong>${subject}</strong>: got Level ${yourGrade}, need Level ${needGrade}</li>`)
      );
      if (li.length) issues = `<ul class="issues-list">${li.join("")}</ul>`;
    }

    // Required subjects tags
    const reqTags = course.requiredSubjects.length
      ? course.requiredSubjects.map(req => {
          const sg = state.subjectGrades[req.subject];
          const isMandatory = course.mandatorySubjects.includes(req.subject);
          const pts_yours = sg ? (NSC_POINTS[sg] || 0) : null;
          const pts_need  = NSC_POINTS[req.minGrade] || 0;
          const cls = !sg ? "req-missing"
            : pts_yours >= pts_need ? "req-pass" : "req-fail";
          const gradeTag = sg ? `<span class="req-grade">${sg}</span>` : "";
          return `<span class="req-tag ${cls}">${isMandatory ? "★ " : ""}${req.subject} ≥${req.minGrade}${gradeTag}</span>`;
        }).join("")
      : `<span class="req-tag req-pass" style="font-style:italic;opacity:.7">No specific subject requirements</span>`;

    const notes = course.notes
      ? `<p class="card-notes">${course.notes}</p>` : "";

    // Competitive programmes: meeting min APS does not guarantee an offer
    const competitive = eligible && course.minScore >= 32
      ? `<p class="card-competitive">
           <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
             <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-5a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z" clip-rule="evenodd"/>
           </svg>
           Meets minimum APS — admission not guaranteed. Places are merit-ranked.
         </p>`
      : "";

    // Stream chips on the card
    const courseStreamChips = course.streams
      .map(s => {
        const isMatch = state.detectedStreams.has(s);
        return `<span class="stream-chip-sm ${isMatch ? "stream-match" : "stream-other"}">${STREAM_LABELS[s]}</span>`;
      }).join("");

    card.innerHTML = `
      <div class="card-header">
        <div>
          <h3 class="card-title">${course.name}</h3>
          <p class="card-faculty">${course.faculty}</p>
        </div>
        <div class="card-badges">${pathwayBadge}${badge}</div>
      </div>
      <div class="card-streams">${courseStreamChips}</div>
      <div class="card-institution">
        <span class="inst-type">${instType}</span>
        <a href="${instUrl}" target="_blank" rel="noopener noreferrer" class="inst-link">
          <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
          ${instName}
        </a>
        <span class="inst-location">
          <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
          </svg>
          ${instLoc}
        </span>
      </div>
      ${deadlineHtml}
      <div class="card-score-row">
        <span class="score-label-sm">APS needed</span>
        <span class="score-value ${scoreShortfall <= 0 ? "score-ok" : "score-low"}">${course.minScore}</span>
        <span class="score-yours">Yours: ${state.calculatedScore}</span>
      </div>
      <div class="card-subjects">
        <p class="subjects-label">Subject requirements (★ = mandatory):</p>
        <div class="req-tags">${reqTags}</div>
      </div>
      ${issues}
      ${competitive}
      ${notes}
    `;
    grid.appendChild(card);
  });
}

// ── Filters ───────────────────────────────────────────────
function populateFilters() {
  const faculties = [...new Set(COURSES.map(c => c.faculty))].sort();
  const fSel = $("filter-faculty");
  fSel.innerHTML = `<option value="all">All faculties</option>` +
    faculties.map(f => `<option value="${f}">${f}</option>`).join("");

  const types = [...new Set(INSTITUTIONS.map(i => i.type))].sort();
  const tSel = $("filter-type");
  tSel.innerHTML = `<option value="all">All types</option>` +
    types.map(t => `<option value="${t}">${t}</option>`).join("");
}

function initFilters() {
  $("filter-faculty").addEventListener("change", e => {
    state.filters.faculty = e.target.value;
    renderResults();
  });
  $("filter-type").addEventListener("change", e => {
    state.filters.type = e.target.value;
    renderResults();
  });
  $("filter-search").addEventListener("input", e => {
    state.filters.search = e.target.value.trim();
    renderResults();
  });
  $("filter-eligible").addEventListener("change", e => {
    state.filters.eligibleOnly = e.target.checked;
    renderResults();
  });
  $("filter-stream").addEventListener("change", e => {
    state.filters.streamOnly = e.target.checked;
    renderResults();
  });
}

function clearFilters() {
  state.filters = { faculty: "all", type: "all", search: "", eligibleOnly: false, streamOnly: false };
  $("filter-faculty").value    = "all";
  $("filter-type").value       = "all";
  $("filter-search").value     = "";
  $("filter-eligible").checked = false;
  $("filter-stream").checked   = false;
  renderResults();
}

// ── Start Over ────────────────────────────────────────────
function startOver() {
  state.subjectGrades   = {};
  state.calculatedScore = 0;
  state.detectedStreams  = new Set();
  state.results         = [];
  state.filters         = { faculty: "all", type: "all", search: "", eligibleOnly: false, streamOnly: false };
  $("filter-faculty").value    = "all";
  $("filter-type").value       = "all";
  $("filter-search").value     = "";
  $("filter-eligible").checked = false;
  $("filter-stream").checked   = false;
  goToStep(1);
  initStep1();
}

// ── Share ─────────────────────────────────────────────────
function initShare() {
  const btn = $("btn-share");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const shareData = {
      title: "CheckScore — SA Course Finder",
      text:  "Find which South African university courses you qualify for based on your NSC results.",
      url:   location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        showShareConfirm(btn);
      }
    } catch {
      // User cancelled or clipboard blocked — do nothing
    }
  });
}

function showShareConfirm(btn) {
  const original = btn.innerHTML;
  btn.innerHTML = `<svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
  </svg> Copied!`;
  btn.classList.add("btn-share--copied");
  setTimeout(() => {
    btn.innerHTML = original;
    btn.classList.remove("btn-share--copied");
  }, 2000);
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initFilters();
  initStep1();
  initShare();
  goToStep(1);

  $("btn-step2-back").addEventListener("click", () => goToStep(1));
  $("btn-start-over").addEventListener("click", startOver);
});
