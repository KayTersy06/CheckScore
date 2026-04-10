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
const NSC_SUBJECTS = [
  // Home Languages
  "English Home Language","Afrikaans Home Language","isiZulu Home Language",
  "isiXhosa Home Language","Sesotho Home Language","Setswana Home Language",
  "Sepedi Home Language","Xitsonga Home Language","Tshivenda Home Language",
  "isiNdebele Home Language","siSwati Home Language",
  // First Additional Languages
  "English First Additional Language","Afrikaans First Additional Language",
  "isiZulu First Additional Language","isiXhosa First Additional Language",
  // Mathematics
  "Mathematics","Mathematical Literacy",
  // Sciences
  "Physical Sciences","Life Sciences",
  // Electives
  "Geography","History","Accounting","Business Studies","Economics",
  "Consumer Studies","Agricultural Sciences","Visual Arts","Music",
  "Information Technology","Computer Applications Technology",
  "Engineering Graphics and Design","Hospitality Studies","Tourism",
  "Dramatic Arts","Religion Studies",
  // Life Orientation (compulsory but excluded from APS at most institutions)
  "Life Orientation",
];

// ── Stream keys and display labels ────────────────────────
// Streams are detected from the student's subject combination.
//   "science"       — Mathematics + Physical Sciences
//   "life-sciences" — Mathematics + Life Sciences
//   "commerce"      — Accounting / Business Studies / Economics
//   "humanities"    — History / Geography / Drama / Arts etc.
//   "technology"    — IT / CAT / Engineering Graphics & Design
//   "agriculture"   — Agricultural Sciences
const STREAM_LABELS = {
  "science":       "Physical Sciences",
  "life-sciences": "Life Sciences",
  "commerce":      "Commerce",
  "humanities":    "Humanities",
  "technology":    "Technology",
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

  // Physical Sciences stream: requires pure Maths AND Physical Sciences
  if (has("Mathematics") && has("Physical Sciences")) streams.add("science");
  // Life Sciences stream: requires pure Maths AND Life Sciences
  if (has("Mathematics") && has("Life Sciences"))     streams.add("life-sciences");
  // Commerce stream: any commerce subject
  if (has("Accounting") || has("Business Studies") || has("Economics")) streams.add("commerce");
  // Humanities stream: history, geography, or the arts
  if (["History","Geography","Dramatic Arts","Visual Arts","Music",
       "Religion Studies","Consumer Studies","Tourism","Hospitality Studies"]
      .some(s => has(s))) streams.add("humanities");
  // Technology stream: IT, CAT, or EGD
  if (has("Information Technology") || has("Computer Applications Technology") ||
      has("Engineering Graphics and Design")) streams.add("technology");
  // Agriculture stream
  if (has("Agricultural Sciences")) streams.add("agriculture");

  return streams;
}

// ── Institutions ──────────────────────────────────────────
const INSTITUTIONS = [
  // Traditional / Comprehensive Universities
  { id:"uct",   name:"University of Cape Town",                    type:"Traditional University",      location:"Cape Town, WC",     url:"https://www.uct.ac.za" },
  { id:"wits",  name:"University of the Witwatersrand",            type:"Traditional University",      location:"Johannesburg, GP",  url:"https://www.wits.ac.za" },
  { id:"sun",   name:"Stellenbosch University",                    type:"Traditional University",      location:"Stellenbosch, WC",  url:"https://www.sun.ac.za" },
  { id:"up",    name:"University of Pretoria",                     type:"Traditional University",      location:"Pretoria, GP",      url:"https://www.up.ac.za" },
  { id:"ukzn",  name:"University of KwaZulu-Natal",                type:"Traditional University",      location:"Durban, KZN",       url:"https://www.ukzn.ac.za" },
  { id:"uj",    name:"University of Johannesburg",                 type:"Comprehensive University",    location:"Johannesburg, GP",  url:"https://www.uj.ac.za" },
  { id:"nwu",   name:"North-West University",                      type:"Traditional University",      location:"Potchefstroom, NW", url:"https://www.nwu.ac.za" },
  { id:"uwc",   name:"University of the Western Cape",             type:"Comprehensive University",    location:"Bellville, WC",     url:"https://www.uwc.ac.za" },
  { id:"ufs",   name:"University of the Free State",               type:"Traditional University",      location:"Bloemfontein, FS",  url:"https://www.ufs.ac.za" },
  { id:"nmu",   name:"Nelson Mandela University",                  type:"Comprehensive University",    location:"Gqeberha, EC",      url:"https://www.mandela.ac.za" },
  { id:"ru",    name:"Rhodes University",                          type:"Traditional University",      location:"Makhanda, EC",      url:"https://www.ru.ac.za" },
  { id:"ul",    name:"University of Limpopo",                      type:"Traditional University",      location:"Polokwane, LP",     url:"https://www.ul.ac.za" },
  { id:"unisa", name:"University of South Africa (UNISA)",         type:"Distance University",         location:"National",          url:"https://www.unisa.ac.za" },
  { id:"smu",   name:"Sefako Makgatho Health Sciences University",  type:"Traditional University",      location:"Pretoria, GP",      url:"https://www.smu.ac.za" },
  // Universities of Technology
  { id:"cput",  name:"Cape Peninsula University of Technology",    type:"University of Technology",    location:"Cape Town, WC",     url:"https://www.cput.ac.za" },
  { id:"dut",   name:"Durban University of Technology",            type:"University of Technology",    location:"Durban, KZN",       url:"https://www.dut.ac.za" },
  { id:"tut",   name:"Tshwane University of Technology",           type:"University of Technology",    location:"Pretoria, GP",      url:"https://www.tut.ac.za" },
  { id:"cut",   name:"Central University of Technology",           type:"University of Technology",    location:"Bloemfontein, FS",  url:"https://www.cut.ac.za" },
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
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"4" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Leads to Advanced Diploma or bridging to BEng Tech.",
  },
  {
    id:"dip-elect-dut", name:"Diploma: Electrical Engineering", faculty:"Engineering",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"dut", minScore:22,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"3" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"",
  },
  {
    id:"dip-mech-cput", name:"Diploma: Mechanical Engineering", faculty:"Engineering",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"cput", minScore:22,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"3" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"Engineering Graphics & Design (Level 3+) is an advantage.",
  },
  {
    id:"dip-civil-cput", name:"Diploma: Civil Engineering", faculty:"Engineering",
    nqfLevel:6, qualType:"Diploma", duration:"3 years",
    institutionId:"cput", minScore:22,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"4" },
      { subject:"Physical Sciences", minGrade:"3" },
    ],
    mandatorySubjects:["Mathematics","Physical Sciences"],
    notes:"",
  },
  {
    id:"hc-eng-cut", name:"Higher Certificate: Engineering Studies", faculty:"Engineering",
    nqfLevel:5, qualType:"Higher Certificate", duration:"1 year",
    institutionId:"cut", minScore:16,
    streams:["science"],
    requiredSubjects:[
      { subject:"Mathematics",       minGrade:"3" },
      { subject:"Physical Sciences", minGrade:"3" },
    ],
    mandatorySubjects:["Mathematics"],
    notes:"Foundation pathway into engineering Diploma programmes.",
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
