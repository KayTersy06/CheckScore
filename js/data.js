// ============================================================
// CheckScore — South Africa Course & Institution Data
// Updated: 2027 academic year
//
// Grading: NSC Levels 1–7
// Score:   APS = best 6 subjects excl. Life Orientation (max 42)
//
// Qualification levels (NQF):
//   Higher Certificate  NQF 5  1 year    APS ~14–20
//   Diploma             NQF 6  3 years   APS ~20–28
//   Bachelor's Degree   NQF 7  3 years   APS ~24–38
//   Professional Degree NQF 8  4–6 yrs   APS ~26–42
//
// NOTE: Requirements are indicative. Meeting the minimum APS does NOT
//       guarantee admission — most programmes are merit-ranked.
//       Always verify with the official institution prospectus.
// ============================================================

// ── NSC Grade System ──────────────────────────────────────
const NSC_GRADES = ["7","6","5","4","3","2","1"];
const NSC_LABELS = {
  "7": "Level 7 — Outstanding (80–100%)",
  "6": "Level 6 — Meritorious (70–79%)",
  "5": "Level 5 — Substantial (60–69%)",
  "4": "Level 4 — Adequate (50–59%)",
  "3": "Level 3 — Moderate (40–49%)",
  "2": "Level 2 — Elementary (30–39%)",
  "1": "Level 1 — Not Achieved (0–29%)",
};
const NSC_POINTS = { "7":7,"6":6,"5":5,"4":4,"3":3,"2":2,"1":1 };

// ── NSC Subjects ──────────────────────────────────────────
// Full list of subjects offered in South African high schools under the
// CAPS (Curriculum and Assessment Policy Statement) framework.
const NSC_SUBJECTS = [

  // ── Home Languages (all 11 official languages + SASL) ───────
  "English Home Language",
  "Afrikaans Home Language",
  "isiZulu Home Language",
  "isiXhosa Home Language",
  "Sepedi Home Language",
  "Sesotho Home Language",
  "Setswana Home Language",
  "siSwati Home Language",
  "Tshivenda Home Language",
  "isiNdebele Home Language",
  "Xitsonga Home Language",
  "South African Sign Language Home Language",  // Official DBE HL subject; examined since 2015

  // ── First Additional Languages (all 11 official languages) ─
  "English First Additional Language",
  "Afrikaans First Additional Language",
  "isiZulu First Additional Language",
  "isiXhosa First Additional Language",
  "Sepedi First Additional Language",
  "Sesotho First Additional Language",
  "Setswana First Additional Language",
  "siSwati First Additional Language",
  "Tshivenda First Additional Language",
  "isiNdebele First Additional Language",
  "Xitsonga First Additional Language",

  // ── Second Additional Languages (official SA language SALs) ─
  // Five official languages are examined at SAL level by DBE (2024 papers):
  "Afrikaans Second Additional Language",
  "isiNdebele Second Additional Language",
  "isiXhosa Second Additional Language",
  "Sesotho Second Additional Language",
  "Sepedi Second Additional Language",

  // ── Second Additional Languages (modern foreign languages) ─
  // Offered at IEB and some multi-language public schools:
  "Arabic Second Additional Language",
  "French Second Additional Language",
  "German Second Additional Language",
  "Gujarati Second Additional Language",
  "Hebrew Second Additional Language",
  "Hindi Second Additional Language",
  "Italian Second Additional Language",
  "Latin Second Additional Language",
  "Mandarin Second Additional Language",
  "Modern Greek Second Additional Language",
  "Portuguese Second Additional Language",
  "Serbian Second Additional Language",
  "Spanish Second Additional Language",
  "Tamil Second Additional Language",
  "Telugu Second Additional Language",
  "Urdu Second Additional Language",

  // ── Mathematics (three options — only one may be taken) ───
  "Mathematics",            // Pure Mathematics — required by most traditional university degrees
  "Mathematical Literacy",  // Applied numeracy — not accepted for engineering/science degrees
  "Technical Mathematics",  // Technical stream — accepted at most UoTs; NOT accepted at traditional universities for STEM degrees

  // ── Sciences ─────────────────────────────────────────────
  "Physical Sciences",   // Required for engineering/science at traditional universities
  "Life Sciences",       // Required for health/biological sciences degrees
  "Technical Sciences",  // Technical stream counterpart to Physical Sciences; accepted at UoTs
  "Marine Sciences",     // Coastal schools; covers marine biology & oceanography (DBE CAPS 2021)

  // ── Social Sciences ───────────────────────────────────────
  "Geography",
  "History",

  // ── Commerce ─────────────────────────────────────────────
  "Accounting",
  "Business Studies",
  "Economics",

  // ── Arts & Creative ───────────────────────────────────────
  "Visual Arts",
  "Music",
  "Dramatic Arts",
  "Dance Studies",
  "Design",

  // ── Technology ───────────────────────────────────────────
  "Information Technology",
  "Computer Applications Technology",
  "Engineering Graphics and Design",

  // ── Technical Occupational (Technical/Vocational schools) ─
  "Civil Technology",            // Distinct DBE CAPS subject: brickwork, wood, civil services
  "Electrical Technology",       // Distinct DBE CAPS subject: electronics, power systems
  "Mechanical Technology",       // Distinct DBE CAPS subject: fitting, automotive, welding

  // ── Agricultural ─────────────────────────────────────────
  "Agricultural Sciences",           // Traditional agricultural theory & practice
  "Agricultural Technology",         // Applied agri-technology (technical schools)
  "Agricultural Management Practices", // Agri-business & farm management

  // ── Vocational / Lifestyle ────────────────────────────────
  "Consumer Studies",
  "Hospitality Studies",
  "Tourism",
  "Religion Studies",

  // ── Compulsory (excluded from APS at most institutions) ───
  "Life Orientation",
];

// ── Stream keys and display labels ────────────────────────
// Streams are detected from the student's subject combination.
//   "science"       — Mathematics + Physical Sciences
//   "life-sciences" — Mathematics + Life Sciences
//   "commerce"      — Accounting / Business Studies / Economics
//   "humanities"    — History / Geography / Drama / Arts etc.
//   "technology"    — IT / CAT / Engineering Graphics & Design
//   "technical"     — Technical Maths/Sciences + Civil/Electrical/Mechanical Technology
//   "agriculture"   — Agricultural Sciences / Technology / Management
const STREAM_LABELS = {
  "science":       "Physical Sciences",
  "life-sciences": "Life Sciences",
  "commerce":      "Commerce",
  "humanities":    "Humanities",
  "technology":    "Technology",
  "technical":     "Technical",
  "agriculture":   "Agriculture",
};

// ── APS Calculation ───────────────────────────────────────
// Best 6 subjects excluding Life Orientation. Max = 42.
function calculateAPS(subjectGrades) {
  return Object.entries(subjectGrades)
    .filter(([s]) => s !== "Life Orientation")
    .map(([, g]) => NSC_POINTS[g] || 0)
    .sort((a, b) => b - a)
    .slice(0, 6)
    .reduce((sum, v) => sum + v, 0);
}

// ── Stream Detection ──────────────────────────────────────
// Returns a Set of stream keys based on the student's subject selection.
function detectStreams(subjectGrades) {
  const subjects = Object.keys(subjectGrades);
  const has = s => subjects.includes(s);
  const streams = new Set();

  // Physical Sciences stream: pure Maths AND Physical Sciences
  if (has("Mathematics") && has("Physical Sciences")) streams.add("science");
  // Life Sciences stream: pure Maths AND Life Sciences
  if (has("Mathematics") && has("Life Sciences"))     streams.add("life-sciences");
  // Commerce stream: any commerce subject
  if (has("Accounting") || has("Business Studies") || has("Economics")) streams.add("commerce");
  // Humanities stream: history, geography, or any arts/lifestyle subject
  if (["History","Geography","Dramatic Arts","Visual Arts","Music","Dance Studies",
       "Design","Religion Studies","Consumer Studies","Tourism","Hospitality Studies",
       "Marine Sciences"]
      .some(s => has(s))) streams.add("humanities");
  // Technology stream: IT, CAT, or Engineering Graphics & Design
  if (has("Information Technology") || has("Computer Applications Technology") ||
      has("Engineering Graphics and Design")) streams.add("technology");
  // Technical stream: Technical Mathematics/Sciences or trade technology subjects
  // (offered mainly at technical high schools; UoTs accept these for diploma entry)
  if (has("Technical Mathematics") || has("Technical Sciences") ||
      has("Civil Technology") || has("Electrical Technology") ||
      has("Mechanical Technology")) streams.add("technical");
  // Agriculture stream: any agricultural subject
  if (has("Agricultural Sciences") || has("Agricultural Technology") ||
      has("Agricultural Management Practices")) streams.add("agriculture");

  return streams;
}

// ── Institutions ──────────────────────────────────────────
const INSTITUTIONS = [
  // Traditional / Comprehensive Universities
  { id:"uct",   name:"University of Cape Town",                    type:"Traditional University",      location:"Cape Town, WC",     url:"https://www.uct.ac.za",        appOpen:"2026-04-01", appClose:"2026-07-31", appNote:"No late applications accepted" },
  { id:"wits",  name:"University of the Witwatersrand",            type:"Traditional University",      location:"Johannesburg, GP",  url:"https://www.wits.ac.za",       appOpen:"2026-03-01", appClose:"2026-09-30", appNote:"Health Sciences close 30 Jun 2026" },
  { id:"sun",   name:"Stellenbosch University",                    type:"Traditional University",      location:"Stellenbosch, WC",  url:"https://www.sun.ac.za",        appOpen:"2026-04-01", appClose:"2026-07-31", appNote:"Health Sciences close earlier — verify on website" },
  { id:"up",    name:"University of Pretoria",                     type:"Traditional University",      location:"Pretoria, GP",      url:"https://www.up.ac.za",         appOpen:"2026-04-01", appClose:"2026-06-30", appNote:null },
  { id:"ukzn",  name:"University of KwaZulu-Natal",                type:"Traditional University",      location:"Durban, KZN",       url:"https://www.ukzn.ac.za",       appOpen:"2026-03-01", appClose:"2026-09-30", appNote:null },
  { id:"uj",    name:"University of Johannesburg",                 type:"Comprehensive University",    location:"Johannesburg, GP",  url:"https://www.uj.ac.za",         appOpen:"2026-04-01", appClose:"2026-10-31", appNote:null },
  { id:"nwu",   name:"North-West University",                      type:"Traditional University",      location:"Potchefstroom, NW", url:"https://www.nwu.ac.za",        appOpen:"2026-04-01", appClose:"2026-08-31", appNote:"Selection programmes close 30 Jun 2026" },
  { id:"uwc",   name:"University of the Western Cape",             type:"Comprehensive University",    location:"Bellville, WC",     url:"https://www.uwc.ac.za",        appOpen:"2026-04-01", appClose:"2026-09-30", appNote:null },
  { id:"ufs",   name:"University of the Free State",               type:"Traditional University",      location:"Bloemfontein, FS",  url:"https://www.ufs.ac.za",        appOpen:"2026-04-01", appClose:"2026-09-30", appNote:"Health Sciences close 31 May 2026" },
  { id:"nmu",   name:"Nelson Mandela University",                  type:"Comprehensive University",    location:"Gqeberha, EC",      url:"https://www.mandela.ac.za",    appOpen:"2026-04-13", appClose:"2026-09-30", appNote:null },
  { id:"ru",    name:"Rhodes University",                          type:"Traditional University",      location:"Makhanda, EC",      url:"https://www.ru.ac.za",         appOpen:"2026-04-01", appClose:"2026-09-30", appNote:null },
  { id:"ul",    name:"University of Limpopo",                      type:"Traditional University",      location:"Polokwane, LP",     url:"https://www.ul.ac.za",         appOpen:"2026-04-01", appClose:"2026-09-30", appNote:null },
  { id:"unisa", name:"University of South Africa (UNISA)",         type:"Distance University",         location:"National",          url:"https://www.unisa.ac.za",      appOpen:"2026-09-01", appClose:null,         appNote:"Rolling admissions — apply year-round" },
  { id:"smu",   name:"Sefako Makgatho Health Sciences University",  type:"Traditional University",      location:"Pretoria, GP",      url:"https://www.smu.ac.za",        appOpen:"2026-04-01", appClose:"2026-07-31", appNote:null },
  // Universities of Technology
  { id:"cput",  name:"Cape Peninsula University of Technology",    type:"University of Technology",    location:"Cape Town, WC",     url:"https://www.cput.ac.za",       appOpen:"2026-05-01", appClose:"2026-08-31", appNote:"Late applications accepted to 30 Sep 2026" },
  { id:"dut",   name:"Durban University of Technology",            type:"University of Technology",    location:"Durban, KZN",       url:"https://www.dut.ac.za",        appOpen:"2026-03-01", appClose:"2026-09-30", appNote:null },
  { id:"tut",   name:"Tshwane University of Technology",           type:"University of Technology",    location:"Pretoria, GP",      url:"https://www.tut.ac.za",        appOpen:"2026-04-03", appClose:"2026-07-31", appNote:null },
  { id:"cut",   name:"Central University of Technology",           type:"University of Technology",    location:"Bloemfontein, FS",  url:"https://www.cut.ac.za",        appOpen:"2026-04-01", appClose:"2026-09-30", appNote:null },
];

function getInstitution(id) {
  return INSTITUTIONS.find(i => i.id === id) || null;
}

// ── Courses ───────────────────────────────────────────────
// Fields:
//   nqfLevel         — 5 | 6 | 7 | 8
//   qualType         — qualification type string
//   duration         — human-readable string
//   minScore         — minimum APS (out of 42, best 6 excl. LO)
//   streams          — subject pathways this course belongs to (see STREAM_LABELS)
//   requiredSubjects — [{ subject, minGrade }]
//   mandatorySubjects — subject names that MUST appear
//
// APS scores reflect 2027 academic year prospectus.

const COURSES = [

  // ── Health Sciences ──────────────────────────────────────
  {
    id:"mbchb-uct", name:"MBChB", faculty:"Health Sciences",
    nqfLevel:8, qualType:"MBChB (6-year)", duration:"6 years",
    institutionId:"uct", minScore:40,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
      { subject:"Life Sciences",     minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences","Life Sciences"],
    notes:"Extremely competitive; APS 40 is a floor, not a guarantee. NBTs required. English HL/FAL at 60%+ required.",
  },
  {
    id:"mbchb-wits", name:"MBChB", faculty:"Health Sciences",
    nqfLevel:8, qualType:"MBChB (6-year)", duration:"6 years",
    institutionId:"wits", minScore:40,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
      { subject:"Life Sciences",     minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences","Life Sciences"],
    notes:"NBT Academic Literacy and Quantitative Literacy tests required. Note: Wits may calculate APS using 7 subjects incl. LO — verify on their website.",
  },
  {
    id:"mbchb-up", name:"MBChB", faculty:"Health Sciences",
    nqfLevel:8, qualType:"MBChB (6-year)", duration:"6 years",
    institutionId:"up", minScore:35,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"5" },
      { subject:"Life Sciences",     minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences","Life Sciences"],
    notes:"~400 places per year. Highly competitive above the minimum APS. English Level 5 required. (2027 prospectus: min APS 35)",
  },
  {
    id:"mbchb-sun", name:"MBChB", faculty:"Health Sciences",
    nqfLevel:8, qualType:"MBChB (6-year)", duration:"6 years",
    institutionId:"sun", minScore:40,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
      { subject:"Life Sciences",     minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences","Life Sciences"],
    notes:"Offered in Afrikaans and English. Language assessment required.",
  },
  {
    id:"mbchb-smu", name:"MBChB", faculty:"Health Sciences",
    nqfLevel:8, qualType:"MBChB (6-year)", duration:"6 years",
    institutionId:"smu", minScore:30,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"5" },
      { subject:"Life Sciences",     minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences","Life Sciences"],
    notes:"Formerly Medunsa; focus on primary health care and underserved communities.",
  },
  {
    id:"bpharm-uct", name:"Bachelor of Pharmacy (BPharm)", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uct", minScore:36,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"6" },
      { subject:"Life Sciences",     minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"NBT required.",
  },
  {
    id:"bpharm-up", name:"Bachelor of Pharmacy (BPharm)", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"up", minScore:30,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"5" },
      { subject:"Life Sciences",     minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"",
  },
  {
    id:"bnurs-ukzn", name:"Bachelor of Nursing Science (BNurs)", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"ukzn", minScore:28,
    streams:["life-sciences"],
    requiredSubjects:[
      { subject:"Life Sciences",     minGrade:"4" },
      { subject:"Mathematics",       minGrade:"3" },
    ],
    mandatorySubjects:["Life Sciences"],
    notes:"Mathematical Literacy at Level 4 also accepted.",
  },
  {
    id:"bnurs-uwc", name:"Bachelor of Nursing Science (BNurs)", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uwc", minScore:25,
    streams:["life-sciences"],
    requiredSubjects:[
      { subject:"Life Sciences",     minGrade:"4" },
    ],
    mandatorySubjects:["Life Sciences"],
    notes:"",
  },
  {
    id:"dip-nurs-dut", name:"Diploma: Nursing", faculty:"Health Sciences",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"dut", minScore:22,
    streams:["life-sciences"],
    requiredSubjects:[
      { subject:"Life Sciences",     minGrade:"4" },
      { subject:"Mathematics",       minGrade:"3" },
    ],
    mandatorySubjects:["Life Sciences"],
    notes:"Entry-level nursing qualification. Graduates may bridge to BNurs.",
  },
  {
    id:"physio-wits", name:"BSc Physiotherapy", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"wits", minScore:38,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"5" },
      { subject:"Life Sciences",     minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Life Sciences"],
    notes:"",
  },
  {
    id:"dental-up", name:"Bachelor of Dental Surgery (BChD)", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (5-year)", duration:"5 years",
    institutionId:"up", minScore:34,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"6" },
      { subject:"Life Sciences",     minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences","Life Sciences"],
    notes:"",
  },
  {
    id:"dip-mlt-tut", name:"Diploma: Medical Laboratory Sciences", faculty:"Health Sciences",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"tut", minScore:22,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"3" },
      { subject:"Life Sciences",     minGrade:"4" },
    ],
    mandatorySubjects:["Life Sciences"],
    notes:"Graduates qualify as Medical Laboratory Technicians (MLT).",
  },
  {
    id:"hc-healthcare-cut", name:"Higher Certificate: Healthcare Support", faculty:"Health Sciences",
    nqfLevel:5, qualType:"Higher Certificate", duration:"1 year",
    institutionId:"cut", minScore:16,
    streams:["life-sciences"],
    requiredSubjects:[
      { subject:"Life Sciences",     minGrade:"3" },
    ],
    mandatorySubjects:[],
    notes:"Pathway into nursing or allied health Diploma programmes.",
  },

  // ── Engineering ──────────────────────────────────────────
  {
    id:"beng-civil-uct", name:"BSc(Eng) Civil Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uct", minScore:40,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"NBT Mathematics test required. UCT uses BSc(Eng) rather than BEng. (2027: APS 40)",
  },
  {
    id:"beng-elec-wits", name:"BSc(Eng) Electrical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"wits", minScore:40,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"NBTs required.",
  },
  {
    id:"beng-mech-up", name:"BEng Mechanical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"up", minScore:35,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"(2027: all BEng programmes at UP require APS 35)",
  },
  {
    id:"beng-elec-up", name:"BEng Electrical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"up", minScore:35,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"(2027: all BEng programmes at UP require APS 35)",
  },
  {
    id:"beng-chem-sun", name:"BEng Chemical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"sun", minScore:36,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"NBT AQL required.",
  },
  {
    id:"beng-mining-wits", name:"BSc(Eng) Mining Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"wits", minScore:38,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Wits is ranked among the top mining engineering schools in the world.",
  },
  {
    id:"beng-ind-up", name:"BEng Industrial Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"up", minScore:35,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"(2027: all BEng programmes at UP require APS 35)",
  },
  {
    id:"dip-civil-tut", name:"Diploma: Civil Engineering Technology", faculty:"Engineering",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"tut", minScore:24,
    streams:["science","technical"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Leads to Advanced Diploma or bridging to BEng Tech. Technical Mathematics and Technical Sciences may be accepted in place of Mathematics and Physical Sciences — verify with TUT.",
  },
  {
    id:"dip-elect-dut", name:"Diploma: Electrical Engineering", faculty:"Engineering",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"dut", minScore:22,
    streams:["science","technical"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"3" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Technical Mathematics and Technical Sciences may be accepted — verify with DUT.",
  },
  {
    id:"dip-mech-cput", name:"Diploma: Mechanical Engineering", faculty:"Engineering",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"cput", minScore:22,
    streams:["science","technical"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"3" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Engineering Graphics & Design (Level 3+) is an advantage. Technical Mathematics and Technical Sciences may be accepted — verify with CPUT.",
  },
  {
    id:"dip-civil-cput", name:"Diploma: Civil Engineering", faculty:"Engineering",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"cput", minScore:22,
    streams:["science","technical"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"3" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Technical Mathematics and Technical Sciences may be accepted — verify with CPUT.",
  },
  {
    id:"hc-eng-cut", name:"Higher Certificate: Engineering Studies", faculty:"Engineering",
    nqfLevel:5, qualType:"Higher Certificate", duration:"1 year",
    institutionId:"cut", minScore:16,
    streams:["science","technical"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"3" },
      { subject:"Physical Sciences", minGrade:"3" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Foundation pathway into engineering Diploma programmes. Technical Mathematics and Technical Sciences accepted — verify with CUT.",
  },

  // ── Computing ────────────────────────────────────────────
  {
    id:"bsc-cs-uct", name:"BSc Computer Science", faculty:"Computing",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"uct", minScore:38,
    streams:["science","technology"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"One of the top CS programmes in Africa. NBT required. (2027: APS 38)",
  },
  {
    id:"bsc-cs-wits", name:"BSc Computer Science", faculty:"Computing",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"wits", minScore:38,
    streams:["science","technology"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"NBT required.",
  },
  {
    id:"bsc-it-up", name:"BSc Information Science", faculty:"Computing",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"up", minScore:28,
    streams:["science","technology"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"",
  },
  {
    id:"bsc-cs-nmu", name:"BSc Computer Science & Informatics", faculty:"Computing",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"nmu", minScore:26,
    streams:["science","technology"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"",
  },
  {
    id:"dip-it-tut", name:"Diploma: Information Technology", faculty:"Computing",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"tut", minScore:20,
    streams:["technology","science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Streams: Software Development, Network Engineering, IT Management.",
  },
  {
    id:"dip-it-cput", name:"Diploma: Information Technology", faculty:"Computing",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"cput", minScore:22,
    streams:["technology","science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"",
  },
  {
    id:"hc-ict-dut", name:"Higher Certificate: ICT", faculty:"Computing",
    nqfLevel:5, qualType:"Higher Certificate", duration:"1 year",
    institutionId:"dut", minScore:16,
    streams:["technology"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"3" },
    ],
    mandatorySubjects:[],
    notes:"Successful completion allows entry into Diploma: IT.",
  },

  // ── Law ──────────────────────────────────────────────────
  {
    id:"llb-uct", name:"Bachelor of Laws (LLB)", faculty:"Law",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uct", minScore:40,
    streams:["humanities","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Among the most competitive law programmes in Africa. NBT AL test required. English Level 5 required.",
  },
  {
    id:"llb-wits", name:"Bachelor of Laws (LLB)", faculty:"Law",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"wits", minScore:36,
    streams:["humanities","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Highly competitive — APS 36 is the published minimum; average entrant scores higher. English Level 6 and Mathematics Level 6 required.",
  },
  {
    id:"llb-up", name:"Bachelor of Laws (LLB)", faculty:"Law",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"up", minScore:35,
    streams:["humanities","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Also offered in Afrikaans. (2027: APS raised to 35)",
  },
  {
    id:"llb-uj", name:"Bachelor of Laws (LLB)", faculty:"Law",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uj", minScore:31,
    streams:["humanities","commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"3" },
    ],
    mandatorySubjects:[],
    notes:"Mathematics L3 (40%+) required; Mathematical Literacy L5 (60%+) also accepted.",
  },
  {
    id:"llb-nwu", name:"Bachelor of Laws (LLB)", faculty:"Law",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"nwu", minScore:26,
    streams:["humanities","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Offered in Afrikaans at Potchefstroom; English option also available.",
  },
  {
    id:"llb-uwc", name:"Bachelor of Laws (LLB)", faculty:"Law",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uwc", minScore:27,
    streams:["humanities","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Strong public interest law and legal aid tradition.",
  },

  // ── Commerce & Business ──────────────────────────────────
  {
    id:"bcom-acc-uct", name:"Bachelor of Commerce: Accounting", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"uct", minScore:38,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Pathway to CA(SA). NBT required. Mathematical Literacy not accepted.",
  },
  {
    id:"bcom-uct", name:"Bachelor of Commerce (BCom)", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"uct", minScore:37,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"NBT required. Streams: Economics, Finance, Information Systems, etc.",
  },
  {
    id:"bcom-acc-wits", name:"Bachelor of Commerce: Accounting", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"wits", minScore:36,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"",
  },
  {
    id:"bcom-wits", name:"Bachelor of Commerce (BCom)", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"wits", minScore:35,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"",
  },
  {
    id:"bcom-up", name:"Bachelor of Commerce (BCom)", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"up", minScore:30,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Streams: Accounting, Economics, Finance, Marketing, Supply Chain, etc. Accounting stream requires APS 34. (2027: general BCom APS 30)",
  },
  {
    id:"bcom-fin-sun", name:"BCom: Financial Management", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"sun", minScore:34,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"NBT AQL required.",
  },
  {
    id:"bcom-uj", name:"Bachelor of Commerce (BCom)", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"uj", minScore:30,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Mathematical Literacy (Level 6+) accepted for some BCom streams.",
  },
  {
    id:"bcom-unisa", name:"Bachelor of Commerce (BCom)", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"unisa", minScore:22,
    streams:["commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Distance learning. Mature applicants (23+) may apply with relevant experience.",
  },
  {
    id:"dip-bm-tut", name:"Diploma: Business Management", faculty:"Commerce",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"tut", minScore:18,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"3" },
    ],
    mandatorySubjects:[],
    notes:"Mathematical Literacy accepted.",
  },
  {
    id:"dip-acc-cput", name:"Diploma: Accounting", faculty:"Commerce",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"cput", minScore:20,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"",
  },
  {
    id:"hc-acc-unisa", name:"Higher Certificate: Accounting Sciences", faculty:"Commerce",
    nqfLevel:5, qualType:"Higher Certificate", duration:"1 year",
    institutionId:"unisa", minScore:14,
    streams:["commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"UNISA's most accessible entry point. Successful completion leads to BCom.",
  },
  {
    id:"hc-bm-cut", name:"Higher Certificate: Business Management", faculty:"Commerce",
    nqfLevel:5, qualType:"Higher Certificate", duration:"1 year",
    institutionId:"cut", minScore:15,
    streams:["commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },

  // ── Sciences ─────────────────────────────────────────────
  {
    id:"bsc-uct", name:"Bachelor of Science (BSc)", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"uct", minScore:38,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Majors: Biochemistry, Chemistry, Mathematics, Physics, Statistics, etc. NBT required.",
  },
  {
    id:"bsc-biol-up", name:"BSc Biological Sciences", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"up", minScore:32,
    streams:["life-sciences","science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Life Sciences",     minGrade:"5" },
    ],
    mandatorySubjects:["Life Sciences"],
    notes:"",
  },
  {
    id:"bsc-chem-wits", name:"BSc Chemistry", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"wits", minScore:32,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"",
  },
  {
    id:"bsc-enviro-ru", name:"BSc Environmental Sciences", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ru", minScore:26,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"4" },
    ],
    mandatorySubjects:[],
    notes:"Rhodes is well-regarded for environmental and earth sciences.",
  },
  {
    id:"bsc-stats-up", name:"BSc Statistics", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"up", minScore:34,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"",
  },

  // ── Humanities ───────────────────────────────────────────
  {
    id:"ba-uct", name:"Bachelor of Arts (BA)", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"uct", minScore:33,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Flexible degree — majors: Politics, Sociology, Psychology, Languages, Film, etc.",
  },
  {
    id:"ba-wits", name:"Bachelor of Arts (BA)", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"wits", minScore:30,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"ba-up", name:"Bachelor of Arts (BA)", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"up", minScore:26,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"bsocsc-ukzn", name:"Bachelor of Social Science (BSocSc)", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ukzn", minScore:26,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"bjourn-ru", name:"Bachelor of Journalism & Media Studies", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ru", minScore:28,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Rhodes Journalism School is among the most respected in Africa.",
  },
  {
    id:"bpsych-uj", name:"Bachelor of Arts: Psychology", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"uj", minScore:26,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"bsw-ul", name:"Bachelor of Social Work (BSW)", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"4 years",
    institutionId:"ul", minScore:22,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"dip-pr-cput", name:"Diploma: Public Relations Management", faculty:"Humanities",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"cput", minScore:20,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },

  // ── Education ────────────────────────────────────────────
  {
    id:"bed-up", name:"BEd: Foundation Phase Teaching", faculty:"Education",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"up", minScore:26,
    streams:["humanities","science","life-sciences","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Trains teachers for Grades R–3. Open to all subject backgrounds.",
  },
  {
    id:"bed-ukzn", name:"BEd: Senior & FET Phase Teaching", faculty:"Education",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"ukzn", minScore:28,
    streams:["humanities","science","life-sciences","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Subject specialisation required at application. All streams welcome.",
  },
  {
    id:"bed-nwu", name:"BEd: Intermediate Phase Teaching", faculty:"Education",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"nwu", minScore:26,
    streams:["humanities","science","life-sciences","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Also available in Afrikaans. (2027: APS 26)",
  },
  {
    id:"bed-unisa", name:"Bachelor of Education (BEd)", faculty:"Education",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"unisa", minScore:18,
    streams:["humanities","science","life-sciences","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Distance-learning BEd. Flexible part-time intake. All streams welcome.",
  },
  {
    id:"hc-early-ed-dut", name:"Higher Certificate: Early Childhood Education", faculty:"Education",
    nqfLevel:5, qualType:"Higher Certificate", duration:"1 year",
    institutionId:"dut", minScore:16,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Provides entry into Diploma: Education programmes.",
  },

  // ── Agriculture ──────────────────────────────────────────
  {
    id:"bscagric-up", name:"BSc Agriculture", faculty:"Agriculture",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"up", minScore:26,
    streams:["agriculture","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"4" },
    ],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"bscagric-sun", name:"BSc Agriculture", faculty:"Agriculture",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"sun", minScore:28,
    streams:["agriculture","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Excellent research focus in agricultural sciences.",
  },
  {
    id:"bscagric-ul", name:"BSc Agriculture", faculty:"Agriculture",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ul", minScore:22,
    streams:["agriculture","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"3" },
    ],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"dip-agric-cut", name:"Diploma: Agriculture", faculty:"Agriculture",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"cut", minScore:18,
    streams:["agriculture","life-sciences"],
    requiredSubjects:[
      { subject:"Life Sciences",     minGrade:"3" },
    ],
    mandatorySubjects:[],
    notes:"Agricultural Sciences or Life Sciences is an advantage.",
  },

  // ── Creative Arts & Design ───────────────────────────────
  {
    id:"dip-graphic-cput", name:"Diploma: Graphic Design", faculty:"Creative Arts & Design",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"cput", minScore:20,
    streams:["humanities","technology"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Portfolio submission required at application.",
  },
  {
    id:"dip-fashion-tut", name:"Diploma: Fashion Design", faculty:"Creative Arts & Design",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"tut", minScore:18,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Portfolio required.",
  },
  {
    id:"dip-hospitality-dut", name:"Diploma: Hospitality Management", faculty:"Creative Arts & Design",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"dut", minScore:18,
    streams:["commerce","humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },

  // ── Health Sciences (additional) ─────────────────────────
  {
    id:"physio-uct", name:"BSc Physiotherapy", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uct", minScore:38,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"5" },
      { subject:"Life Sciences",     minGrade:"5" },
    ],
    mandatorySubjects:["Life Sciences"],
    notes:"NBT required. Selection is merit-based above minimum APS.",
  },
  {
    id:"occther-uct", name:"BSc Occupational Therapy", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uct", minScore:36,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Life Sciences",     minGrade:"5" },
    ],
    mandatorySubjects:["Life Sciences"],
    notes:"NBT required.",
  },
  {
    id:"bds-wits", name:"Bachelor of Dental Surgery (BDS)", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (5-year)", duration:"5 years",
    institutionId:"wits", minScore:40,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
      { subject:"Life Sciences",     minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences","Life Sciences"],
    notes:"NBT required. One of two dental schools in SA accepted by HPCSA.",
  },
  {
    id:"occther-wits", name:"BSc Occupational Therapy", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"wits", minScore:34,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Life Sciences",     minGrade:"5" },
    ],
    mandatorySubjects:["Life Sciences"],
    notes:"",
  },
  {
    id:"physio-sun", name:"BSc Physiotherapy", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"sun", minScore:36,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"5" },
      { subject:"Life Sciences",     minGrade:"5" },
    ],
    mandatorySubjects:["Life Sciences"],
    notes:"Also offered in Afrikaans. NBT AQL required.",
  },
  {
    id:"bpharm-sun", name:"Bachelor of Pharmacy (BPharm)", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"sun", minScore:36,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"5" },
      { subject:"Life Sciences",     minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"",
  },
  {
    id:"physio-up", name:"BSc Physiotherapy", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"up", minScore:32,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Life Sciences",     minGrade:"5" },
    ],
    mandatorySubjects:["Life Sciences"],
    notes:"",
  },
  {
    id:"bnurs-up", name:"Bachelor of Nursing Science (BNurs)", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"up", minScore:28,
    streams:["life-sciences"],
    requiredSubjects:[
      { subject:"Life Sciences",     minGrade:"4" },
      { subject:"Mathematics",       minGrade:"3" },
    ],
    mandatorySubjects:["Life Sciences"],
    notes:"Mathematical Literacy at Level 5 also accepted.",
  },
  {
    id:"mbchb-ukzn", name:"MBChB", faculty:"Health Sciences",
    nqfLevel:8, qualType:"MBChB (6-year)", duration:"6 years",
    institutionId:"ukzn", minScore:38,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
      { subject:"Life Sciences",     minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences","Life Sciences"],
    notes:"Offered at Nelson R Mandela School of Medicine, Durban. NBT required.",
  },
  {
    id:"bpharm-ukzn", name:"Bachelor of Pharmacy (BPharm)", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"ukzn", minScore:32,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"5" },
      { subject:"Life Sciences",     minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"",
  },
  {
    id:"mbchb-ufs", name:"MBChB", faculty:"Health Sciences",
    nqfLevel:8, qualType:"MBChB (6-year)", duration:"6 years",
    institutionId:"ufs", minScore:36,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"5" },
      { subject:"Life Sciences",     minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences","Life Sciences"],
    notes:"Offered at Universitas Hospital, Bloemfontein. English and Afrikaans medium.",
  },
  {
    id:"bpharm-ufs", name:"Bachelor of Pharmacy (BPharm)", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"ufs", minScore:28,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"4" },
      { subject:"Life Sciences",     minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"",
  },
  {
    id:"bnurs-ufs", name:"Bachelor of Nursing Science (BNurs)", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"ufs", minScore:24,
    streams:["life-sciences"],
    requiredSubjects:[
      { subject:"Life Sciences",     minGrade:"4" },
    ],
    mandatorySubjects:["Life Sciences"],
    notes:"Mathematical Literacy accepted.",
  },
  {
    id:"mbchb-ul", name:"MBChB", faculty:"Health Sciences",
    nqfLevel:8, qualType:"MBChB (6-year)", duration:"6 years",
    institutionId:"ul", minScore:30,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"4" },
      { subject:"Life Sciences",     minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences","Life Sciences"],
    notes:"Faculty of Health Sciences at UL's Mankweng campus. Focus on rural health.",
  },
  {
    id:"bnurs-nmu", name:"Bachelor of Nursing Science (BNurs)", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"nmu", minScore:24,
    streams:["life-sciences"],
    requiredSubjects:[
      { subject:"Life Sciences",     minGrade:"4" },
    ],
    mandatorySubjects:["Life Sciences"],
    notes:"",
  },
  {
    id:"bpharm-nwu", name:"Bachelor of Pharmacy (BPharm)", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"nwu", minScore:30,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"5" },
      { subject:"Life Sciences",     minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Potchefstroom campus. Also offered in Afrikaans.",
  },
  {
    id:"bpharm-smu", name:"Bachelor of Pharmacy (BPharm)", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"smu", minScore:28,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"4" },
      { subject:"Life Sciences",     minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"",
  },
  {
    id:"bnurs-smu", name:"Bachelor of Nursing Science (BNurs)", faculty:"Health Sciences",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"smu", minScore:26,
    streams:["life-sciences"],
    requiredSubjects:[
      { subject:"Life Sciences",     minGrade:"4" },
    ],
    mandatorySubjects:["Life Sciences"],
    notes:"",
  },
  {
    id:"dip-nurs-tut", name:"Diploma: Nursing", faculty:"Health Sciences",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"tut", minScore:22,
    streams:["life-sciences"],
    requiredSubjects:[
      { subject:"Life Sciences",     minGrade:"4" },
    ],
    mandatorySubjects:["Life Sciences"],
    notes:"Bridges to BNurs via RPL or further study.",
  },

  // ── Engineering (additional) ──────────────────────────────
  {
    id:"beng-elec-uct", name:"BSc(Eng) Electrical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uct", minScore:40,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"NBT Mathematics required. (2027: APS 40)",
  },
  {
    id:"beng-mech-uct", name:"BSc(Eng) Mechanical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uct", minScore:40,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"NBT Mathematics required.",
  },
  {
    id:"beng-chem-uct", name:"BSc(Eng) Chemical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uct", minScore:40,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"NBT Mathematics required.",
  },
  {
    id:"beng-civil-wits", name:"BSc(Eng) Civil Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"wits", minScore:40,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"NBTs required.",
  },
  {
    id:"beng-mech-wits", name:"BSc(Eng) Mechanical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"wits", minScore:40,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"NBTs required.",
  },
  {
    id:"beng-chem-wits", name:"BSc(Eng) Chemical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"wits", minScore:40,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"NBTs required.",
  },
  {
    id:"beng-civil-sun", name:"BEng Civil Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"sun", minScore:36,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"NBT AQL required.",
  },
  {
    id:"beng-elec-sun", name:"BEng Electrical & Electronic Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"sun", minScore:36,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"NBT AQL required.",
  },
  {
    id:"beng-mech-sun", name:"BEng Mechanical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"sun", minScore:36,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"7" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"NBT AQL required.",
  },
  {
    id:"beng-civil-up", name:"BEng Civil Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"up", minScore:35,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"(2027: all BEng programmes at UP require APS 35)",
  },
  {
    id:"beng-chem-up", name:"BEng Chemical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"up", minScore:35,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"(2027: all BEng programmes at UP require APS 35)",
  },
  {
    id:"beng-computer-up", name:"BEng Computer Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"up", minScore:35,
    streams:["science","technology"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"(2027: all BEng programmes at UP require APS 35)",
  },
  {
    id:"beng-civil-ukzn", name:"BScEng Civil Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"ukzn", minScore:32,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"College of Agriculture, Engineering & Science.",
  },
  {
    id:"beng-elec-ukzn", name:"BScEng Electrical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"ukzn", minScore:32,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"",
  },
  {
    id:"beng-mech-ukzn", name:"BScEng Mechanical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"ukzn", minScore:32,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"",
  },
  {
    id:"beng-civil-uj", name:"BEng Civil Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uj", minScore:28,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Doornfontein campus. Engineering Graphics & Design is an advantage.",
  },
  {
    id:"beng-elec-uj", name:"BEng Electrical/Electronic Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uj", minScore:28,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Doornfontein campus.",
  },
  {
    id:"beng-mech-uj", name:"BEng Mechanical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uj", minScore:28,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Doornfontein campus.",
  },
  {
    id:"beng-civil-nwu", name:"BEng Civil Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"nwu", minScore:28,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Potchefstroom campus.",
  },
  {
    id:"beng-elec-nwu", name:"BEng Electrical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"nwu", minScore:28,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Potchefstroom campus.",
  },
  {
    id:"beng-mech-nwu", name:"BEng Mechanical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"nwu", minScore:28,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Potchefstroom campus.",
  },
  {
    id:"beng-chem-nwu", name:"BEng Chemical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"nwu", minScore:28,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Potchefstroom campus.",
  },
  {
    id:"beng-civil-nmu", name:"BEng Civil Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"nmu", minScore:28,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Faculty of Engineering, Built Environment & Information Technology.",
  },
  {
    id:"beng-elec-nmu", name:"BEng Electrical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"nmu", minScore:28,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"",
  },
  {
    id:"beng-mech-nmu", name:"BEng Mechanical Engineering", faculty:"Engineering",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"nmu", minScore:28,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"",
  },
  {
    id:"dip-mech-dut", name:"Diploma: Mechanical Engineering", faculty:"Engineering",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"dut", minScore:22,
    streams:["science","technical"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"3" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Technical Mathematics and Technical Sciences may be accepted — verify with DUT.",
  },
  {
    id:"dip-civil-dut", name:"Diploma: Civil Engineering", faculty:"Engineering",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"dut", minScore:22,
    streams:["science","technical"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"3" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Technical Mathematics and Technical Sciences may be accepted — verify with DUT.",
  },
  {
    id:"dip-elec-tut", name:"Diploma: Electrical Engineering Technology", faculty:"Engineering",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"tut", minScore:22,
    streams:["science","technical"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Specialisations: Power Systems, Electronics. Technical Mathematics/Sciences may be accepted — verify with TUT.",
  },
  {
    id:"dip-mech-tut", name:"Diploma: Mechanical Engineering Technology", faculty:"Engineering",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"tut", minScore:22,
    streams:["science","technical"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"3" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Technical Mathematics and Technical Sciences may be accepted — verify with TUT.",
  },
  {
    id:"dip-civil-cut", name:"Diploma: Civil Engineering Technology", faculty:"Engineering",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"cut", minScore:18,
    streams:["science","technical"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"3" },
      { subject:"Physical Sciences", minGrade:"3" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Technical Mathematics and Technical Sciences may be accepted — verify with CUT.",
  },
  {
    id:"dip-elec-cut", name:"Diploma: Electrical Engineering Technology", faculty:"Engineering",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"cut", minScore:18,
    streams:["science","technical"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"3" },
      { subject:"Physical Sciences", minGrade:"3" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Technical Mathematics and Technical Sciences may be accepted — verify with CUT.",
  },

  // ── Architecture & Built Environment ─────────────────────
  {
    id:"bas-uct", name:"Bachelor of Architectural Studies (BAS)", faculty:"Architecture & Built Environment",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"uct", minScore:36,
    streams:["humanities","science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"First of a two-part qualification: BAS (3yr) + MArch (2yr). Portfolio may be required. NBT required.",
  },
  {
    id:"barch-wits", name:"Bachelor of Science: Architecture", faculty:"Architecture & Built Environment",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"wits", minScore:35,
    streams:["humanities","science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Leads to MArch professional degree. Portfolio submission required. NBT required.",
  },
  {
    id:"barch-up", name:"BArch (Professional Architecture)", faculty:"Architecture & Built Environment",
    nqfLevel:8, qualType:"Professional Degree (5-year)", duration:"5 years",
    institutionId:"up", minScore:32,
    streams:["humanities","science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"UP offers a direct 5-year professional BArch. Portfolio required.",
  },
  {
    id:"dip-arch-tut", name:"Diploma: Architectural Technology", faculty:"Architecture & Built Environment",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"tut", minScore:20,
    streams:["humanities","science","technical"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Technical Mathematics accepted. Engineering Graphics & Design is a strong advantage.",
  },

  // ── Law (additional) ──────────────────────────────────────
  {
    id:"llb-sun", name:"Bachelor of Laws (LLB)", faculty:"Law",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"sun", minScore:36,
    streams:["humanities","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Offered in Afrikaans and English. NBT AL required.",
  },
  {
    id:"llb-ukzn", name:"Bachelor of Laws (LLB)", faculty:"Law",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"ukzn", minScore:28,
    streams:["humanities","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"llb-ufs", name:"Bachelor of Laws (LLB)", faculty:"Law",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"ufs", minScore:30,
    streams:["humanities","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Faculty of Law at the main Bloemfontein campus.",
  },
  {
    id:"llb-nmu", name:"Bachelor of Laws (LLB)", faculty:"Law",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"nmu", minScore:26,
    streams:["humanities","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"llb-ru", name:"Bachelor of Laws (LLB)", faculty:"Law",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"ru", minScore:28,
    streams:["humanities","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"llb-ul", name:"Bachelor of Laws (LLB)", faculty:"Law",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"ul", minScore:22,
    streams:["humanities","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"llb-unisa", name:"Bachelor of Laws (LLB)", faculty:"Law",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"unisa", minScore:20,
    streams:["humanities","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Distance learning. Mature age exemptions available.",
  },

  // ── Commerce (additional) ─────────────────────────────────
  {
    id:"bcom-sun", name:"Bachelor of Commerce (BCom)", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"sun", minScore:34,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Streams: Economics, Actuarial, Management Accounting, etc. NBT AQL required.",
  },
  {
    id:"bcom-acc-sun", name:"Bachelor of Accounting (BAcc)", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"sun", minScore:36,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Pathway to CA(SA). Highly competitive. NBT AQL required.",
  },
  {
    id:"bcom-ukzn", name:"Bachelor of Commerce (BCom)", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ukzn", minScore:26,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:[],
    notes:"Mathematical Literacy at Level 6 accepted for some BCom streams.",
  },
  {
    id:"bcom-ufs", name:"Bachelor of Commerce (BCom)", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ufs", minScore:28,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:[],
    notes:"Faculty of Economic & Management Sciences.",
  },
  {
    id:"bcom-nmu", name:"Bachelor of Commerce (BCom)", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"nmu", minScore:24,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"bcom-ru", name:"Bachelor of Commerce (BCom)", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ru", minScore:26,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"",
  },
  {
    id:"bcom-acc-ru", name:"BCom Accounting", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ru", minScore:28,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"",
  },
  {
    id:"bcom-ul", name:"Bachelor of Commerce (BCom)", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ul", minScore:22,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"3" },
    ],
    mandatorySubjects:[],
    notes:"Mathematical Literacy at Level 5 accepted.",
  },
  {
    id:"bcom-uwc", name:"Bachelor of Commerce (BCom)", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"uwc", minScore:26,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"bcom-nwu", name:"Bachelor of Commerce (BCom)", faculty:"Commerce",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"nwu", minScore:26,
    streams:["commerce"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:[],
    notes:"Also offered in Afrikaans.",
  },

  // ── Sciences (additional) ─────────────────────────────────
  {
    id:"bsc-wits", name:"Bachelor of Science (BSc)", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"wits", minScore:30,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Majors: Physics, Chemistry, Biology, Maths, Computer Science, etc. NBT required.",
  },
  {
    id:"bsc-sun", name:"Bachelor of Science (BSc)", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"sun", minScore:34,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"6" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Majors: Chemistry, Biochemistry, Physics, Microbiology, etc. NBT AQL required.",
  },
  {
    id:"bsc-up", name:"Bachelor of Science (BSc)", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"up", minScore:28,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Wide range of majors. Some specialisations (Actuarial, Medical Sciences) require higher APS.",
  },
  {
    id:"bsc-ukzn", name:"Bachelor of Science (BSc)", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ukzn", minScore:26,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"",
  },
  {
    id:"bsc-uj", name:"Bachelor of Science (BSc)", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"uj", minScore:26,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"",
  },
  {
    id:"bsc-ufs", name:"Bachelor of Science (BSc)", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ufs", minScore:24,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"4" },
    ],
    mandatorySubjects:[],
    notes:"Faculty of Natural & Agricultural Sciences.",
  },
  {
    id:"bsc-nmu", name:"Bachelor of Science (BSc)", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"nmu", minScore:22,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"3" },
    ],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"bsc-chem-ru", name:"BSc Chemistry", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ru", minScore:26,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"5" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"",
  },
  {
    id:"bsc-biochem-ru", name:"BSc Biochemistry & Microbiology", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ru", minScore:26,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"4" },
      { subject:"Life Sciences",     minGrade:"4" },
    ],
    mandatorySubjects:[],
    notes:"Rhodes has a strong research-focused biochemistry department.",
  },
  {
    id:"bsc-ul", name:"Bachelor of Science (BSc)", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ul", minScore:20,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"bsc-uwc", name:"Bachelor of Science (BSc)", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"uwc", minScore:24,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"4" },
    ],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"bsc-nwu", name:"Bachelor of Science (BSc)", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"nwu", minScore:24,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"5" },
      { subject:"Physical Sciences", minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Potchefstroom campus; also at Mafikeng campus.",
  },
  {
    id:"bsc-unisa", name:"Bachelor of Science (BSc)", faculty:"Sciences",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"unisa", minScore:20,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:[],
    notes:"Distance learning. Majors: Maths, Physics, Chemistry, Biology, etc.",
  },

  // ── Humanities / BA (additional) ─────────────────────────
  {
    id:"ba-sun", name:"Bachelor of Arts (BA)", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"sun", minScore:28,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Faculty of Arts & Social Sciences. Many majors offered in Afrikaans and English.",
  },
  {
    id:"bsocsc-uct", name:"Bachelor of Social Science (BSocSci)", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"uct", minScore:33,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Majors: Sociology, Political Studies, Economics, Social Development, etc. NBT required.",
  },
  {
    id:"ba-ukzn", name:"Bachelor of Arts (BA)", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ukzn", minScore:24,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"ba-uj", name:"Bachelor of Arts (BA)", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"uj", minScore:24,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"ba-ufs", name:"Bachelor of Arts (BA)", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ufs", minScore:22,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Faculty of Humanities. Also offered in Afrikaans.",
  },
  {
    id:"ba-nmu", name:"Bachelor of Arts (BA)", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"nmu", minScore:22,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"ba-ru", name:"Bachelor of Arts (BA)", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ru", minScore:26,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Majors: English, History, Politics, Philosophy, Sociology, Music, Fine Art, etc.",
  },
  {
    id:"ba-ul", name:"Bachelor of Arts (BA)", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ul", minScore:20,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"ba-uwc", name:"Bachelor of Arts (BA)", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"uwc", minScore:22,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"ba-nwu", name:"Bachelor of Arts (BA)", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"nwu", minScore:22,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Also offered in Afrikaans.",
  },
  {
    id:"ba-unisa", name:"Bachelor of Arts (BA)", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"unisa", minScore:20,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Distance learning. Wide range of majors.",
  },
  {
    id:"bjourn-ukzn", name:"Bachelor of Arts: Communication & Media", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ukzn", minScore:28,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"bjourn-uj", name:"Bachelor of Arts: Communication", faculty:"Humanities",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"uj", minScore:26,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Specialisations: Journalism, Media Studies, Public Relations, Corporate Communication.",
  },
  {
    id:"bsw-nmu", name:"Bachelor of Social Work (BSW)", faculty:"Humanities",
    nqfLevel:7, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"nmu", minScore:22,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"bsw-uwc", name:"Bachelor of Social Work (BSW)", faculty:"Humanities",
    nqfLevel:7, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uwc", minScore:22,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"bsw-ufs", name:"Bachelor of Social Work (BSW)", faculty:"Humanities",
    nqfLevel:7, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"ufs", minScore:22,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },

  // ── Education (additional) ────────────────────────────────
  {
    id:"bed-wits", name:"Bachelor of Education (BEd)", faculty:"Education",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"wits", minScore:28,
    streams:["humanities","science","life-sciences","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Specialisations: Foundation Phase, Senior/FET. NBT required.",
  },
  {
    id:"bed-sun", name:"Bachelor of Education (BEd)", faculty:"Education",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"sun", minScore:28,
    streams:["humanities","science","life-sciences","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Also offered in Afrikaans. Phases: Foundation, Intermediate, Senior/FET.",
  },
  {
    id:"bed-uj", name:"Bachelor of Education (BEd)", faculty:"Education",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uj", minScore:24,
    streams:["humanities","science","life-sciences","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Phases: Foundation, Intermediate, Senior/FET.",
  },
  {
    id:"bed-ufs", name:"Bachelor of Education (BEd)", faculty:"Education",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"ufs", minScore:24,
    streams:["humanities","science","life-sciences","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Also offered in Afrikaans. All phases available.",
  },
  {
    id:"bed-nmu", name:"Bachelor of Education (BEd)", faculty:"Education",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"nmu", minScore:24,
    streams:["humanities","science","life-sciences","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"bed-ru", name:"Bachelor of Education (BEd)", faculty:"Education",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"ru", minScore:26,
    streams:["humanities","science","life-sciences","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Phases: Foundation, Intermediate, Senior/FET.",
  },
  {
    id:"bed-ul", name:"Bachelor of Education (BEd)", faculty:"Education",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"ul", minScore:20,
    streams:["humanities","science","life-sciences","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"bed-uwc", name:"Bachelor of Education (BEd)", faculty:"Education",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"uwc", minScore:24,
    streams:["humanities","science","life-sciences","commerce"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"bed-up-senior", name:"BEd: Senior & FET Phase Teaching", faculty:"Education",
    nqfLevel:8, qualType:"Professional Degree (4-year)", duration:"4 years",
    institutionId:"up", minScore:26,
    streams:["humanities","science","life-sciences","commerce","technical"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Subject specialisation required. Technology subjects welcome.",
  },

  // ── Agriculture (additional) ──────────────────────────────
  {
    id:"bscagric-ukzn", name:"BSc Agriculture", faculty:"Agriculture",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ukzn", minScore:24,
    streams:["agriculture","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"bscagric-ufs", name:"BSc Agriculture", faculty:"Agriculture",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ufs", minScore:24,
    streams:["agriculture","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:[],
    notes:"Faculty of Natural & Agricultural Sciences, Qwaqwa and Bloemfontein campuses.",
  },
  {
    id:"bscagric-nwu", name:"BSc Agriculture", faculty:"Agriculture",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"nwu", minScore:24,
    streams:["agriculture","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
    ],
    mandatorySubjects:[],
    notes:"Mafikeng campus; focus on agri-business and sustainable farming.",
  },

  // ── Creative Arts & Design (additional) ──────────────────
  {
    id:"ba-finearts-wits", name:"Bachelor of Arts: Fine Arts", faculty:"Creative Arts & Design",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"wits", minScore:28,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Portfolio required. Wits School of Arts covers Visual Arts, Music, Theatre & Performance.",
  },
  {
    id:"ba-music-uct", name:"BMus (Bachelor of Music)", faculty:"Creative Arts & Design",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"4 years",
    institutionId:"uct", minScore:30,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Audition required. South African College of Music (SACM). Streams: Performance, Composition, Musicology.",
  },
  {
    id:"ba-drama-ukzn", name:"Bachelor of Arts: Drama", faculty:"Creative Arts & Design",
    nqfLevel:7, qualType:"Bachelor's Degree", duration:"3 years",
    institutionId:"ukzn", minScore:24,
    streams:["humanities"],
    requiredSubjects:[],
    mandatorySubjects:[],
    notes:"Audition or portfolio may be required.",
  },
  {
    id:"dip-foodtech-cput", name:"Diploma: Food Technology", faculty:"Creative Arts & Design",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"cput", minScore:20,
    streams:["science","life-sciences"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"3" },
      { subject:"Physical Sciences", minGrade:"3" },
    ],
    mandatorySubjects:[],
    notes:"",
  },
  {
    id:"dip-elec-cput", name:"Diploma: Electrical Engineering Technology", faculty:"Engineering",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"cput", minScore:22,
    streams:["science","technical"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"3" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Technical Mathematics and Technical Sciences may be accepted — verify with CPUT.",
  },
  {
    id:"dip-it-cut", name:"Diploma: Information Technology", faculty:"Computing",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"cut", minScore:18,
    streams:["technology","science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"3" },
    ],
    mandatorySubjects:[],
    notes:"",
  },
];

// ── Eligibility Check ─────────────────────────────────────
// Returns { eligible, scoreShortfall, missingSubjects, failedSubjects, institution }
function checkEligibility(course, aps, subjectGrades) {
  const institution    = getInstitution(course.institutionId);
  const scoreShortfall = course.minScore - aps;
  const missingSubjects = [];
  const failedSubjects  = [];

  for (const req of course.requiredSubjects) {
    const studentGrade = subjectGrades[req.subject];
    if (!studentGrade) {
      missingSubjects.push(req.subject);
    } else {
      const studentPts = NSC_POINTS[studentGrade] ?? 0;
      const reqPts     = NSC_POINTS[req.minGrade]  ?? 0;
      if (studentPts < reqPts) {
        failedSubjects.push({ subject: req.subject, yourGrade: studentGrade, needGrade: req.minGrade });
      }
    }
  }

  const eligible = scoreShortfall <= 0 && missingSubjects.length === 0 && failedSubjects.length === 0;
  return { eligible, scoreShortfall, missingSubjects, failedSubjects, institution };
}
