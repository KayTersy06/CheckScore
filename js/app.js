// ============================================================
// CheckScore — Application Logic
// ============================================================

// ── State ─────────────────────────────────────────────────
const state = {
  step: 1,
  country: null,       // country code e.g. "za"
  subjectGrades: {},   // { "Mathematics": "7", ... }
  calculatedScore: 0,
  results: [],
  filters: { faculty: "all", type: "all", search: "", eligibleOnly: false },
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

// ── Step 1: Country selection ─────────────────────────────
function initStep1() {
  const cards = document.querySelectorAll(".country-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      state.country = card.dataset.country;
      $("btn-step1-next").disabled = false;
    });
  });

  $("btn-step1-next").addEventListener("click", () => {
    if (!state.country) return;
    // Reset subjects when changing country
    state.subjectGrades = {};
    state.rowIndex = 0;
    goToStep(2);
    initStep2();
  });
}

// ── Step 2: Subject Grades ────────────────────────────────
function getCountryConfig() {
  return COUNTRIES[state.country];
}

function getGradeSystem() {
  return GRADE_SYSTEMS[getCountryConfig().gradeSystem];
}

function getSubjectList() {
  return SUBJECTS_BY_COUNTRY[state.country] || [];
}

function updateScoreDisplay() {
  const score = calculateScore(state.country, state.subjectGrades);
  state.calculatedScore = score;
  const cfg = getCountryConfig();
  $("live-score-value").textContent = score;
  $("live-score-label").textContent = cfg.scoreLabel;
  $("live-score-max").textContent   = `/ ${cfg.scoreMax}`;

  // Progress bar
  const pct = Math.min(100, Math.round((score / cfg.scoreMax) * 100));
  $("score-progress-bar").style.width = `${pct}%`;
  $("score-progress-bar").style.background =
    pct >= 70 ? "var(--clr-primary)" :
    pct >= 40 ? "var(--clr-accent)"  : "var(--clr-warn)";
}

function createSubjectRow() {
  const idx = state.rowIndex++;
  const subjects   = getSubjectList();
  const gradeSystem = getGradeSystem();

  const row = document.createElement("div");
  row.className = "subject-row";
  row.dataset.idx = idx;

  const subjectSel = document.createElement("select");
  subjectSel.className = "subject-select";
  subjectSel.innerHTML =
    `<option value="">— Select subject —</option>` +
    subjects.map(s => `<option value="${s}">${s}</option>`).join("");

  const gradeSel = document.createElement("select");
  gradeSel.className = "grade-select";
  gradeSel.innerHTML =
    `<option value="">Grade</option>` +
    gradeSystem.grades.map(g =>
      `<option value="${g}">${g}</option>`
    ).join("");

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
  state.subjectGrades = {};
  document.querySelectorAll("#subject-rows .subject-row").forEach(row => {
    const subj  = row.querySelector(".subject-select").value;
    const grade = row.querySelector(".grade-select").value;
    if (subj && grade) state.subjectGrades[subj] = grade;
  });
}

function updateRowCounter() {
  const n = document.querySelectorAll("#subject-rows .subject-row").length;
  $("row-count").textContent = `${n} subject${n !== 1 ? "s" : ""} added`;
}

function initStep2() {
  const cfg = getCountryConfig();
  const gs  = getGradeSystem();

  // Panel header
  $("step2-country-name").textContent = cfg.name;
  $("step2-score-desc").textContent   = cfg.scoreDescription;

  // Grade legend
  const legend = $("grade-legend");
  legend.innerHTML = Object.entries(gs.gradeLabels)
    .map(([g, l]) => `<span class="legend-item"><strong>${g}</strong> — ${l}</span>`)
    .join("");

  // Clear rows
  $("subject-rows").innerHTML = "";
  state.subjectGrades = {};

  // Pre-populate rows
  const defaultRows = Math.max(cfg.subjectMin, 6);
  for (let i = 0; i < defaultRows; i++) {
    $("subject-rows").appendChild(createSubjectRow());
  }
  updateRowCounter();
  updateScoreDisplay();

  // Add subject button — re-wire listener each time step 2 is entered
  const addBtn = $("btn-add-subject");
  const newAddBtn = addBtn.cloneNode(true);
  addBtn.parentNode.replaceChild(newAddBtn, addBtn);
  $("btn-add-subject").addEventListener("click", () => {
    if (document.querySelectorAll("#subject-rows .subject-row").length >= cfg.subjectMax + 2) return;
    $("subject-rows").appendChild(createSubjectRow());
    updateRowCounter();
  });

  $("btn-step2-back").onclick = () => goToStep(1);
  $("btn-step2-next").onclick = () => {
    syncGrades();
    const err   = $("grade-error");
    const count = Object.keys(state.subjectGrades).length;
    const min   = cfg.subjectMin;

    if (count < min) {
      err.textContent = `Please enter at least ${min} subjects with grades.`;
      return;
    }

    // Warn if no English (for SA, ZW, BW, KE)
    const engKeys = ["English Home Language","English First Additional Language",
                     "English Language (O-Level)","English","English Language"];
    const hasEnglish = engKeys.some(k => state.subjectGrades[k]);
    if (!hasEnglish) {
      err.textContent =
        "Most programmes require English. Please add your English subject and grade.";
      return;
    }

    err.textContent = "";
    state.calculatedScore = calculateScore(state.country, state.subjectGrades);
    computeResults();
    populateFilters();
    goToStep(3);
    renderResults();
  };
}

// ── Step 3: Results ───────────────────────────────────────
function computeResults() {
  state.results = COURSES
    .filter(c => c.country === state.country)
    .map(c => {
      const r = checkEligibility(c, state.calculatedScore, state.subjectGrades);
      return { course: c, ...r };
    })
    .sort((a, b) => {
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
      return a.course.name.localeCompare(b.course.name);
    });
}

function getFilteredResults() {
  return state.results.filter(r => {
    const { faculty, type, search, eligibleOnly } = state.filters;
    if (eligibleOnly && !r.eligible) return false;
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
  const cfg      = getCountryConfig();
  const filtered = getFilteredResults();
  const totalEligible   = state.results.filter(r => r.eligible).length;
  const filteredEligible = filtered.filter(r => r.eligible).length;

  $("summary-score").textContent    = state.calculatedScore;
  $("summary-score-label").textContent = cfg.scoreLabel;
  $("summary-subjects").textContent = Object.keys(state.subjectGrades).length;
  $("summary-total").textContent    = totalEligible;
  $("summary-filtered").textContent = filteredEligible;
  $("results-country-flag").textContent = COUNTRIES[state.country].flag;
  $("results-country-name").textContent = COUNTRIES[state.country].name;

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

  const cfg       = getCountryConfig();
  const gradeSystem = getGradeSystem();

  items.forEach(r => {
    const { course, eligible, scoreShortfall, missingSubjects, failedSubjects, institution } = r;
    const card = document.createElement("article");
    card.className = `result-card ${eligible ? "eligible" : "ineligible"}`;

    const badge = eligible
      ? `<span class="badge badge-pass">Eligible</span>`
      : `<span class="badge badge-fail">Not Eligible</span>`;

    const instName = institution ? institution.name     : "Unknown";
    const instType = institution ? institution.type     : "";
    const instUrl  = institution ? institution.url      : "#";
    const instLoc  = institution ? institution.location : "";

    // Issues
    let issues = "";
    if (!eligible) {
      const li = [];
      if (scoreShortfall > 0) {
        li.push(`<li>${cfg.scoreLabel} too low by <strong>${scoreShortfall} point${scoreShortfall !== 1 ? "s" : ""}</strong> (need ${course.minScore})</li>`);
      }
      missingSubjects.forEach(s => li.push(`<li>Missing result for <strong>${s}</strong></li>`));
      failedSubjects.forEach(({ subject, yourGrade, needGrade }) =>
        li.push(`<li><strong>${subject}</strong>: got ${yourGrade}, need ${needGrade}</li>`)
      );
      if (li.length) issues = `<ul class="issues-list">${li.join("")}</ul>`;
    }

    // Required subjects tags
    const reqTags = course.requiredSubjects.length
      ? course.requiredSubjects.map(req => {
          const sg = state.subjectGrades[req.subject];
          const isMandatory = course.mandatorySubjects.includes(req.subject);
          const pts_yours = sg ? (gradeSystem.gradePoints[sg] || 0) : null;
          const pts_need  = gradeSystem.gradePoints[req.minGrade] || 0;
          const cls = !sg ? "req-missing"
            : pts_yours >= pts_need ? "req-pass" : "req-fail";
          const gradeTag = sg ? `<span class="req-grade">${sg}</span>` : "";
          return `<span class="req-tag ${cls}">${isMandatory ? "★ " : ""}${req.subject} ≥${req.minGrade}${gradeTag}</span>`;
        }).join("")
      : `<span class="req-tag req-pass" style="font-style:italic;opacity:.7">No specific subject requirements</span>`;

    const notes = course.notes
      ? `<p class="card-notes">${course.notes}</p>` : "";

    card.innerHTML = `
      <div class="card-header">
        <div>
          <h3 class="card-title">${course.name}</h3>
          <p class="card-faculty">${course.faculty}</p>
        </div>
        ${badge}
      </div>
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
      <div class="card-score-row">
        <span class="score-label-sm">${cfg.scoreLabel} needed</span>
        <span class="score-value ${scoreShortfall <= 0 ? "score-ok" : "score-low"}">${course.minScore}</span>
        <span class="score-yours">Yours: ${state.calculatedScore}</span>
      </div>
      <div class="card-subjects">
        <p class="subjects-label">Subject requirements (★ = mandatory):</p>
        <div class="req-tags">${reqTags}</div>
      </div>
      ${issues}
      ${notes}
    `;
    grid.appendChild(card);
  });
}

// ── Filters ───────────────────────────────────────────────
function populateFilters() {
  const faculties = [...new Set(
    COURSES.filter(c => c.country === state.country).map(c => c.faculty)
  )].sort();
  const fSel = $("filter-faculty");
  fSel.innerHTML = `<option value="all">All faculties</option>` +
    faculties.map(f => `<option value="${f}">${f}</option>`).join("");

  const types = [...new Set(
    INSTITUTIONS.filter(i => i.country === state.country).map(i => i.type)
  )].sort();
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
}

function clearFilters() {
  state.filters = { faculty: "all", type: "all", search: "", eligibleOnly: false };
  $("filter-faculty").value = "all";
  $("filter-type").value    = "all";
  $("filter-search").value  = "";
  $("filter-eligible").checked = false;
  renderResults();
}

// ── Start Over ────────────────────────────────────────────
function startOver() {
  state.country = null;
  state.subjectGrades = {};
  state.calculatedScore = 0;
  state.results = [];
  state.filters = { faculty: "all", type: "all", search: "", eligibleOnly: false };
  document.querySelectorAll(".country-card").forEach(c => c.classList.remove("selected"));
  $("btn-step1-next").disabled = true;
  // Reset filter DOM directly — do NOT call clearFilters() here because
  // that calls renderResults() which requires state.country to be set.
  $("filter-faculty").value    = "all";
  $("filter-type").value       = "all";
  $("filter-search").value     = "";
  $("filter-eligible").checked = false;
  goToStep(1);
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initStep1();
  initFilters();
  goToStep(1);

  $("btn-step3-back").addEventListener("click", () => goToStep(2));
  $("btn-start-over").addEventListener("click", startOver);
});
