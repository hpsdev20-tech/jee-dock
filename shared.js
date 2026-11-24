/* Shared data + helpers for JEE Planner (index.html) and JEE Dock (dock.html) */
const EXAM = '2027-01-20';
const SUBJECTS = ['Physics','Chemistry','Maths','Other'];
const KEY = 'jeePlanner.v1';

const SYLLABUS = {
  Physics: [
    ['Units & Measurements',1],['Kinematics',3],['Laws of Motion',3],['Work, Energy & Power',2],
    ['Centre of Mass & Collisions',2],['Rotational Motion',4],['Gravitation',2],['Mechanical Properties of Solids',1],
    ['Fluid Mechanics',2],['Thermal Properties & Calorimetry',1],['Thermodynamics',2],['Kinetic Theory of Gases',1],
    ['Simple Harmonic Motion',2],['Waves & Sound',2],['Electrostatics',3],['Capacitors',2],
    ['Current Electricity',3],['Moving Charges & Magnetism',3],['Magnetism & Matter',1],['Electromagnetic Induction',2],
    ['Alternating Current',2],['EM Waves',1],['Ray Optics',3],['Wave Optics',2],
    ['Dual Nature of Matter',1],['Atoms & Nuclei',2],['Semiconductors',2],['Experimental Skills',1]
  ],
  Chemistry: [
    ['Some Basic Concepts (Mole)',2],['Atomic Structure',2],['Chemical Bonding',3],['Thermodynamics (Chem)',2],
    ['Chemical Equilibrium',2],['Ionic Equilibrium',2],['Redox Reactions',1],['Solutions',2],
    ['Electrochemistry',2],['Chemical Kinetics',2],['Periodic Table & Properties',1],['p-Block Elements',3],
    ['d & f Block Elements',2],['Coordination Compounds',3],['Purification & Characterisation',1],['GOC',3],
    ['Hydrocarbons',3],['Haloalkanes & Haloarenes',2],['Alcohols, Phenols & Ethers',2],['Aldehydes, Ketones & Acids',3],
    ['Amines',2],['Biomolecules',1],['Practical Chemistry',1]
  ],
  Maths: [
    ['Sets, Relations & Functions',2],['Complex Numbers',2],['Quadratic Equations',2],['Matrices & Determinants',3],
    ['Permutations & Combinations',2],['Binomial Theorem',2],['Sequences & Series',2],['Trigonometry',2],
    ['Inverse Trigonometry',1],['Limits & Continuity',2],['Differentiability & Derivatives',2],['Application of Derivatives',2],
    ['Indefinite Integration',2],['Definite Integration',3],['Area Under Curves',1],['Differential Equations',2],
    ['Straight Lines',2],['Circles',2],['Conic Sections',3],['Vectors',2],
    ['3D Geometry',2],['Statistics',1],['Probability',2]
  ],
  Other: [['Full Mock Test',1],['Full Mock Test',1],['Full Mock Test',1],['Physics Revision',3],['Chemistry Revision',3],['Maths Revision',3]]
};

/* ---------- date helpers ---------- */
const pad = n => String(n).padStart(2,'0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parse = s => { const [y,m,d] = s.split('-').map(Number); return new Date(y,m-1,d); };
const addDays = (s,n) => { const d = parse(s); d.setDate(d.getDate()+n); return iso(d); };
const diff = (a,b) => Math.round((parse(b)-parse(a))/864e5);
const today = () => iso(new Date());
const TODAY = today();
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmt = s => { const d = parse(s); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const endOf = c => addDays(c.start, c.days - 1);

/* ---------- state ---------- */
function defaults(){
  const ch = []; let i = 0;
  for (const s of SUBJECTS) for (const [name,days] of SYLLABUS[s]) ch.push({id:'c'+(i++), name, subject:s, days, start:null, done:false});
  return {chapters:ch, nextId:i};
}
function loadState(){
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.chapters) return s; } catch(e) {}
  return defaults();
}
function saveState(s){ localStorage.setItem(KEY, JSON.stringify(s)); }

/* ---------- sync codes (copy between PC and phone) ---------- */
function exportCode(s){
  const compact = s.chapters.map(c => [c.name, SUBJECTS.indexOf(c.subject), c.days, c.start ? c.start.replace(/-/g,'') : 0, c.done ? 1 : 0]);
  return 'JEE1:' + btoa(unescape(encodeURIComponent(JSON.stringify(compact))));
}
function importCode(code){
  code = String(code).replace(/\s+/g,'');
  if (code.indexOf('JEE1:') !== 0) throw new Error('Not a JEE planner code');
  const arr = JSON.parse(decodeURIComponent(escape(atob(code.slice(5)))));
  if (!Array.isArray(arr)) throw new Error('Bad code');
  return {
    chapters: arr.map((a,i) => ({
      id: 'c'+i, name: String(a[0]), subject: SUBJECTS[a[1]] || 'Other',
      days: Math.max(1, Math.min(30, +a[2] || 1)),
      start: a[3] ? String(a[3]).replace(/^(\d{4})(\d{2})(\d{2})$/,'$1-$2-$3') : null,
      done: !!a[4]
    })),
    nextId: arr.length
  };
}

function openSync(getState, onImport){
  if (!document.getElementById('syncCss')){
    const st = document.createElement('style'); st.id = 'syncCss';
    st.textContent = `
      .sync-ov{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:1000;display:flex;align-items:center;justify-content:center;padding:14px}
      .sync-box{background:#161922;border:1px solid #262b3a;border-radius:16px;padding:18px;width:100%;max-width:460px;max-height:100%;overflow:auto;color:#e8eaf0;font-family:inherit;-webkit-user-select:text;user-select:text}
      .sync-box h3{font-size:16px;margin-bottom:6px}
      .sync-box p{font-size:12.5px;color:#8a90a3;line-height:1.5;margin-bottom:12px}
      .sync-box label{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#8a90a3;margin:10px 0 5px}
      .sync-box textarea{width:100%;height:64px;background:#0e1016;border:1px solid #262b3a;border-radius:9px;color:#e8eaf0;font:11px/1.4 ui-monospace,Menlo,monospace;padding:8px;resize:none;-webkit-user-select:text;user-select:text}
      .sync-row{display:flex;gap:8px;margin-top:8px}
      .sync-row button{flex:1;padding:9px;border-radius:9px;border:1px solid #262b3a;background:#1f2433;color:#e8eaf0;font-weight:600;font-size:13px;font-family:inherit}
      .sync-row button.pri{background:#6366f1;border-color:#6366f1}`;
    document.head.appendChild(st);
  }
  const ov = document.createElement('div'); ov.className = 'sync-ov';
  ov.innerHTML = `<div class="sync-box">
    <h3>⇄ Sync PC ↔ iPhone</h3>
    <p>1. On one device tap <b>Copy code</b> and send it to yourself (WhatsApp, Telegram, email…).<br>
       2. On the other device paste it below and tap <b>Import</b>.<br>Import <b>replaces</b> the plan & checklist on this device.</p>
    <label>This device's code</label>
    <textarea readonly id="syncOut"></textarea>
    <div class="sync-row"><button class="pri" id="syncCopy">Copy code</button></div>
    <label>Paste code from other device</label>
    <textarea id="syncIn" placeholder="JEE1:…"></textarea>
    <div class="sync-row"><button id="syncClose">Close</button><button class="pri" id="syncImp">Import</button></div>
  </div>`;
  document.body.appendChild(ov);
  const out = ov.querySelector('#syncOut');
  out.value = exportCode(getState());
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  ov.querySelector('#syncClose').onclick = () => ov.remove();
  ov.querySelector('#syncCopy').onclick = async e => {
    const btn = e.target;
    try { await navigator.clipboard.writeText(out.value); }
    catch(err){ out.removeAttribute('readonly'); out.focus(); out.setSelectionRange(0, out.value.length); document.execCommand('copy'); out.setAttribute('readonly',''); }
    btn.textContent = 'Copied ✓'; setTimeout(() => btn.textContent = 'Copy code', 1500);
  };
  ov.querySelector('#syncImp').onclick = () => {
    try {
      const s = importCode(ov.querySelector('#syncIn').value);
      if (!confirm(`Import ${s.chapters.length} chapters? This replaces the plan on this device.`)) return;
      onImport(s); ov.remove();
    } catch(err){ alert('That code didn\'t work: ' + err.message); }
  };
}
