/* ✨ 7 Little Stars — main.js */
'use strict';

const KEY_STARS  = '7ls_v3_unlocked';
const KEY_HIDDEN = '7ls_v3_hidden';
const KEY_CODE   = '7ls_v3_code';

let starsData    = [];
let eggsData     = [];
let hiddenData   = [];
let unlocked     = new Set();
let foundHidden  = new Set();
let currentPage  = 'pg-landing';
let conInited    = false;
let wishesInited = false;
let musicPlaying = false;

/* Config now lives in config.js (was Flask app.py) */
const CFG = window.SITE_CONFIG;
const HIDE_NAME = !CFG.SHOW_NAME;
document.documentElement.classList.toggle('show-name', !HIDE_NAME);
if (!HIDE_NAME) document.title = '✨ 7 Little Stars — for Irham Saba';

/* Birthday is Oct 22 of the current year (was hard-coded to 2024) */
const BIRTHDAY = new Date(new Date().getFullYear(), CFG.BIRTHDAY_MONTH - 1, CFG.BIRTHDAY_DAY, 0, 0, 0);

/* ═══════════════════════════════════════
   LOADING SCREEN
═══════════════════════════════════════ */
const LOADER_MSGS = [
  { text: 'Loading stars... 🌟',                    sub: 'Setting up the night sky' },
  { text: 'Convincing the moon to cooperate... 🌙', sub: 'She said maybe' },
  { text: 'Arranging the petals... 🌸',             sub: 'One by one, carefully' },
  { text: 'Adding a little magic... ✨',             sub: 'Just a pinch' },
  { text: 'Polishing the stars... ⭐',              sub: 'They were dusty' },
  { text: 'Almost ready, promise! 🤞',              sub: 'This is taking longer than expected' },
  { text: 'Okay okay, for real this time... 🚀',    sub: 'Coming right up' },
];

/* Lock: site stays closed until CFG.LOCK_UNTIL */
function isLocked() {
  return CFG.LOCK_UNTIL && new Date() < new Date(CFG.LOCK_UNTIL);
}
function showLock() {
  const el = document.getElementById('lock-screen');
  el.classList.add('show');
  el.setAttribute('aria-hidden', 'false');
}

function runLoader() {
  const loader = document.getElementById('loader');
  const msgEl  = document.getElementById('loader-msg');
  const subEl  = document.getElementById('loader-sub');
  const barEl  = document.getElementById('loader-bar');
  let step = 0;
  const total = LOADER_MSGS.length;

  const tick = () => {
    if (step >= total) {
      if (isLocked()) showLock();
      loader.classList.add('hide');
      setTimeout(() => { loader.style.display = 'none'; }, 700);
      return;
    }
    msgEl.textContent = LOADER_MSGS[step].text;
    subEl.textContent = LOADER_MSGS[step].sub;
    barEl.style.width = ((step + 1) / total * 100) + '%';
    step++;
    setTimeout(tick, 1100); // slow — 1.1s per message
  };
  setTimeout(tick, 400);
}

/* ═══════════════════════════════════════
   MONTHLY WISHES — original English
═══════════════════════════════════════ */
const WISHES = [
  { month: 'October',   text: 'Birthday ha cake toh banta ha, meko be thora sa mil jata toh... '},
  { month: 'November',  text: 'Thandi shuru ho gayi....bimaar mat hona. '},
  { month: 'December',  text: 'Thora sa rest be karna ✨' },
  { month: 'January',   text: 'Naya saal ha...iss saal kuch toofani karte hain😅 '},
  { month: 'February',  text: 'Arey khud ke liye be thora sa time nikaal lena. '},
  { month: 'March',     text: 'Jo kaam kal karna tha... wo abb kar hi lo.  '},
  { month: 'April',     text: 'Mera fav month ha...acha hi jayega, so chill' },
  { month: 'May',       text: 'Garmi shuru ho gayi phir se...khub pani piya karo. '},
  { month: 'June',      text: 'Arey abb toh ziyada garmi hogyi... aap pani piyo bss  '},
  { month: 'July',      text: 'Bss barish ho jaye wohi kafi ha ooff '},
  { month: 'August',    text: 'Dekho yawr mera birthday be aagya...Happy birthday '},
  { month: 'September', text: 'Bass abb aapka birthday be aane hi wala ha. '},
];

/* ═══════════════════════════════════════
   EK AUR BAAT — wholesome + funny
═══════════════════════════════════════ */
const EAB_MSGS = [
  'Kabhi kabhi khud pe bhi trust kar liya karo',
  'Jo problem abhi itni badi lag rahi hai...shyd wo itni be badi nhi ha',
  'Kuch khaya? Nahi? Toh pehle kha lo. Birthday wish baad mein bhi padh sakte hain. 🍕',
  'Hasso mat yawr....mujhe pata ha aap hass rahe ho. 😄',
  'Agar kuch kaam pending ha toh wo kar lo phelay',
  'Har cheez ka answer turant milna zaroori nahi hai. Kabhi kabhi bas “dekhte hain” bolke aage badhna padta hai',
  'Achhi cheezein maangne mein sharmana nahi chahiye. Aapko jo chahiye, uske liye wish kar sakhte ho. 🌈',
  'Paani pee lo. Haan, ye boring advice hai. Lekin paani toh peena padega. ',
  'Kabhi kabhi phone side mein rakh diya karo',
  'Aaj ka din bekaar gaya? Koi nahi kl dekhte hain. ',
  'Kabhi koi random cheez dekh ke meri yaad aaye toh bata dena. Ab itna bhi kya sochna.',
  'Kabhi kuch aisa ho jo dekh ke lage “ye toh isko bhi funny lagega”, toh bhej dena',
];

let eabIndex = -1;
function getNextEab() {
  eabIndex = (eabIndex + 1) % EAB_MSGS.length;
  return EAB_MSGS[eabIndex];
}

/* ═══════════════════════════════════════
   MOON DIALOGUES
═══════════════════════════════════════ */
const MOON_DIALOGUES = [
  'Yes, I see you looking. 🌙',
  'I\'ve been doing this orbit thing for 4 billion years. Still not bored.',
  'The stars are my friends. Please tap them. 🌟',
  'It\'s late. Are you okay? Just checking. 💙',
  'I heard someone made this whole website for you. That\'s kind of sweet.',
  'Happy Birthday, by the way. From the moon. Officially. 🎂',
  'I\'m always here, even when you can\'t see me. Just so you know.',
];

/* ═══════════════════════════════════════
   FLOATING THOUGHTS
═══════════════════════════════════════ */
const FLOAT_THOUGHTS = [
  '...how long did this take to make? 🤔',
  '...the stars look really pretty tonight ✨',
  '...someone put a lot of effort into this',
  '...did you find the hidden stars? 👀',
  '...the moon is watching 🌙',
  '...birthdays only come once a year (obviously)',
  '...this music is kind of perfect 🎵',
  '...are you smiling? you should be 🌸',
];

/* ═══════════════════════════════════════
   BIRTHDAY FACTS — funny
═══════════════════════════════════════ */
const BIRTHDAY_FACTS = [
  'Fun fact: October babies are statistically more likely to live past 100. No pressure. 😄',
  'Did you know: People born in October tend to be night owls. So staying up is basically in your DNA. 🦉',
  'October 22nd is also the birthday of some very cool historical figures. You\'re in good company. 📚',
  'Fun fact: October babies are apparently more creative than average. Science said so. 🎨',
  'Did you know: The average person gets 80+ birthdays. This is one of them. Make it count. 🎂',
];

/* ═══════════════════════════════════════
   STAR DATA — original English
═══════════════════════════════════════ */
const STAR_MESSAGES = [
  {
    id: 1, symbol: '✦', color: '#d8b4fe',
    name: 'The Star of First Moments',
    message: 'Har constellation ka ek start hota hai. ye wohi ha. ✦',
  },
  {
    id: 2, symbol: '⋆', color: '#ffb3d1',
    name: 'The Star of Small Things',
    message: 'Chhoti chhoti cheezein bhi matter karti hain. Jaise extra fries mil jaana. Ya hidden star mil jaana. ⋆',
  },
  {
    id: 3, symbol: '✧', color: '#c084fc',
    name: 'The Star of Quiet Nights',
    message: 'Moon ka message hai: raat ko time pe soya karo. Haan, mujhe bhi pata hai aap nahi sunne wale. 😭.',
  },
  {
    id: 4, symbol: '★', color: '#ffd9a8',
    name: 'The Star of What\'s Coming',
    message: 'Prediction zyada kuch nahi hai. Bas hopefully aage thode aur achhe din aaye',
  },
  {
    id: 5, symbol: '✶', color: '#d8b4fe',
    name: 'The Star of Who You Are',
    message: 'Achievement unlocked: aapne apne saare bad days survive kar liye. Baaki bhi dekh lenge. ✶',
  },
  {
    id: 6, symbol: '⟡', color: '#ffb3d1',
    name: 'The Star of Honest Things',
    message: 'Okay, jokes aside I really hope aapko iss saal woh sab mile jo aap chahte ho. ⟡',
  },
  {
    id: 7, symbol: '✨', color: '#ffd9a8',
    name: 'The Last Star',
    message: 'Saari 7 stars mil gaye? Wah. Treasure hunt kar liya... Ab khush. ',
  },
];

/* ═══════════════════════════════════════
   EASTER EGGS
═══════════════════════════════════════ */
const EGGS_LOCAL = [
  'You caught a shooting star. ',
  'A secret: shooting stars don\'t really grant wishes. They just remind you to make them.',
  'Hidden things are everywhere. So is beauty. You found both tonight.',
  'You clicked a shooting star. Of course you did. That checks out completely.',
];

/* ═══════════════════════════════════════
   FETCH
═══════════════════════════════════════ */
async function fetchData() {
  try {
    const h = CFG.HIDDEN_STARS;
    const e = CFG.EASTER_EGGS;
    hiddenData = h;
    eggsData   = e.length ? e : EGGS_LOCAL;
  } catch {
    hiddenData = [];
    eggsData   = EGGS_LOCAL;
  }
  starsData = STAR_MESSAGES;
}

/* ═══════════════════════════════════════
   COUNTDOWN
═══════════════════════════════════════ */
function updateCountdown() {
  const diff = BIRTHDAY - new Date();
  if (diff <= 0) {
    document.getElementById('countdown-bar').innerHTML =
      `<span style="color:var(--gold);font-size:0.82rem;font-family:var(--dp);font-style:italic">✨ Happy Birthday${HIDE_NAME ? '!' : ', Irham Saba!'} ✨</span>`;
    ['cd-d','cd-h','cd-m','cd-s','cdb-d','cdb-h','cdb-m','cdb-s','lcd-d','lcd-h','lcd-m','lcd-s']
      .forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '00'; });
    return;
  }
  const fmt = n => String(Math.floor(n)).padStart(2, '0');
  const d = diff/86400000, h = (diff%86400000)/3600000,
        m = (diff%3600000)/60000, s = (diff%60000)/1000;
  [['cd-d',d],['cd-h',h],['cd-m',m],['cd-s',s],
   ['cdb-d',d],['cdb-h',h],['cdb-m',m],['cdb-s',s],
   ['lcd-d',d],['lcd-h',h],['lcd-m',m],['lcd-s',s]].forEach(([id,v]) => {
    const el = document.getElementById(id); if (el) el.textContent = fmt(v);
  });
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* ═══════════════════════════════════════
   SKY CANVAS
═══════════════════════════════════════ */
const skyC   = document.getElementById('sky');
const skyCtx = skyC.getContext('2d');
let skyStars = [], comets = [], eggHots = [], bokeh = [];
const BOKEH_COLS = ['255,150,200','216,150,255','255,190,150','255,120,180'];

function resizeSky() {
  skyC.width  = window.innerWidth;
  skyC.height = window.innerHeight;
  skyStars = [];
  const n = Math.floor((skyC.width * skyC.height) / 9000);
  makeBokeh();
  for (let i = 0; i < n; i++) {
    skyStars.push({
      x: Math.random()*skyC.width, y: Math.random()*skyC.height,
      r: Math.random()*1.3+0.15, a: Math.random()*0.55+0.2,
      speed: Math.random()*0.007+0.002, phase: Math.random()*Math.PI*2,
      hue: Math.random()<0.12 ? (Math.random()<0.5?'rose':'violet') : 'white',
    });
  }
  if (lite) buildBg();
}

function makeBokeh() {
  bokeh = Array.from({length: 6}, () => ({
    x: Math.random()*skyC.width, y: Math.random()*skyC.height, r: Math.random()*70+35,
    s: Math.random()*0.00025+0.00008, p: Math.random()*6.28,
    c: BOKEH_COLS[Math.floor(Math.random()*BOKEH_COLS.length)],
  }));
}

function spawnComet() {
  comets.push({
    x: -90, y: Math.random()*skyC.height*0.55,
    vx: Math.random()*4.5+5.5, vy: Math.random()*1.8+0.4,
    len: Math.random()*90+55, a: 0.9, egg: Math.random()<0.35,
  });
}

/* ── Lite mode (weak phones): background drawn once, no petals/glows ── */
let lite = false, bgDirty = true;
const bgCanvas = document.createElement('canvas');
function drawBackdrop(ctx, t) {
  const g1 = ctx.createRadialGradient(skyC.width*.28,skyC.height*.22,0,skyC.width*.28,skyC.height*.22,skyC.width*.5);
  g1.addColorStop(0,'rgba(190,80,200,0.38)'); g1.addColorStop(0.6,'rgba(120,40,140,0.14)'); g1.addColorStop(1,'transparent');
  ctx.fillStyle=g1; ctx.fillRect(0,0,skyC.width,skyC.height);
  const g2 = ctx.createRadialGradient(skyC.width*.78,skyC.height*.7,0,skyC.width*.78,skyC.height*.7,skyC.width*.38);
  g2.addColorStop(0,'rgba(255,150,170,0.2)'); g2.addColorStop(1,'transparent');
  ctx.fillStyle=g2; ctx.fillRect(0,0,skyC.width,skyC.height);

  const H = skyC.height + 160;
  for (const b of bokeh) {
    const yy = (((b.y - t*b.s*120) % H) + H) % H - 80, xx = b.x + Math.sin(t*b.s*3 + b.p)*30;
    const al = 0.10 + 0.07*Math.sin(t*0.0006 + b.p);
    const bg = ctx.createRadialGradient(xx,yy,0,xx,yy,b.r);
    bg.addColorStop(0,`rgba(${b.c},${al})`); bg.addColorStop(0.6,`rgba(${b.c},${al*0.4})`); bg.addColorStop(1,`rgba(${b.c},0)`);
    ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(xx,yy,b.r,0,Math.PI*2); ctx.fill();
  }
  for (const s of skyStars) {
    const p = s.a*(0.65+0.35*Math.sin(t*s.speed+s.phase));
    ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle = s.hue==='rose'?`rgba(255,179,209,${p})`:s.hue==='violet'?`rgba(216,180,254,${p})`:`rgba(255,240,246,${p})`;
    ctx.fill();
  }

}
function buildBg() {
  bgCanvas.width = skyC.width; bgCanvas.height = skyC.height;
  drawBackdrop(bgCanvas.getContext('2d'), 0);
  bgDirty = true;
}
const KEY_LITE = '7ls_v3_lite';
let liteChosen = false; /* true once the person toggles it themselves */
function syncLiteBtn() {
  const btn = document.getElementById('lite-btn'), ic = document.getElementById('lite-icon');
  if (!btn) return;
  btn.classList.toggle('playing', lite);
  ic.textContent = lite ? '⚡' : '✨';
  btn.title = lite ? 'Lite mode ON (tap for full effects)' : 'Lite mode OFF (tap for smoother)';
}
function enableLite() {
  if (lite) return;
  lite = true;
  document.documentElement.classList.add('lite');
  document.getElementById('petal-container').innerHTML = '';
  buildBg();
  syncLiteBtn();
}
function disableLite() {
  if (!lite) return;
  lite = false;
  document.documentElement.classList.remove('lite');
  bgDirty = true;
  syncLiteBtn();
}

function drawSky(t) {
  const ctx = skyCtx;
  ctx.clearRect(0,0,skyC.width,skyC.height);
  if (lite) ctx.drawImage(bgCanvas,0,0); else drawBackdrop(ctx,t);
  eggHots = [];
  for (let i=comets.length-1; i>=0; i--) {
    const c=comets[i]; c.x+=c.vx; c.y+=c.vy; c.a-=0.007;
    if (c.a<=0||c.x>skyC.width+120) { comets.splice(i,1); continue; }
    const cg=ctx.createLinearGradient(c.x-c.len,c.y,c.x,c.y);
    cg.addColorStop(0,'transparent'); cg.addColorStop(1,c.egg?'rgba(255,179,209,0.9)':'rgba(216,180,254,0.85)');
    ctx.save(); ctx.globalAlpha=c.a; ctx.strokeStyle=cg; ctx.lineWidth=c.egg?2.2:1.5;
    ctx.beginPath(); ctx.moveTo(c.x-c.len,c.y); ctx.lineTo(c.x,c.y); ctx.stroke();
    ctx.beginPath(); ctx.arc(c.x,c.y,c.egg?2.5:1.8,0,Math.PI*2);
    ctx.fillStyle=c.egg?'#ffb3d1':'#d8b4fe'; ctx.fill(); ctx.restore();
    if (c.egg&&c.a>0.4) eggHots.push({x:c.x,y:c.y,t:Date.now()});
  }
}

skyC.addEventListener('click', e => {
  const now = Date.now();
  for (let i=eggHots.length-1; i>=0; i--) {
    const h=eggHots[i];
    if (now-h.t>2400) { eggHots.splice(i,1); continue; }
    if (Math.abs(e.clientX-h.x)<60&&Math.abs(e.clientY-h.y)<20) { eggHots.splice(i,1); openEgg(); return; }
  }
});

setInterval(spawnComet, 3800);
setTimeout(spawnComet, 700);
setTimeout(spawnComet, 2000);
let lastFrame = 0;
function animateSky(t) {
  requestAnimationFrame(animateSky);
  if (t - lastFrame < 33) return; /* cap at ~30fps */
  if (lite && !comets.length && !bgDirty) return; /* nothing moving: skip */
  lastFrame = t; bgDirty = false;
  drawSky(t);
}

/* ═══════════════════════════════════════
   PETALS
═══════════════════════════════════════ */
const PETALS = ['🌸','🌷','💗','🩷','✿','❀','💮','✨'];
function spawnPetal() {
  if (lite) return;
  const c = document.getElementById('petal-container');
  const el = document.createElement('div'); el.className='petal';
  el.textContent = PETALS[Math.floor(Math.random()*PETALS.length)];
  const dur=Math.random()*8+9, delay=Math.random()*3;
  el.style.cssText=`left:${Math.random()*110-5}%;font-size:${Math.random()*8+10}px;animation-duration:${dur}s;animation-delay:${delay}s;--drift:${(Math.random()-0.5)*140}px;`;
  c.appendChild(el); setTimeout(()=>el.remove(),(dur+delay+1)*1000);
}
setInterval(spawnPetal,2800);
for (let i=0; i<6; i++) setTimeout(spawnPetal,i*400);

/* ═══════════════════════════════════════
   SPARKLE BURST
═══════════════════════════════════════ */
function burst(x, y) {
  const c = document.getElementById('sparkle-burst');
  const cols = ['#ffd9a8','#d8b4fe','#ffb3d1','#fff0f6','#ff8fc0'];
  for (let i=0; i<20; i++) {
    const el=document.createElement('div'); el.className='sparkle';
    const angle=(i/20)*Math.PI*2, dist=45+Math.random()*75;
    el.style.cssText=`left:${x}px;top:${y}px;background:${cols[i%cols.length]};--dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;`;
    c.appendChild(el); setTimeout(()=>el.remove(),1000);
  }
}

/* ═══════════════════════════════════════
   MOON DIALOGUES
═══════════════════════════════════════ */
let moonIdx = 0;
function showMoonDialogue() {
  const d = document.getElementById('moon-dialogue');
  if (!d) return;
  d.textContent = MOON_DIALOGUES[moonIdx % MOON_DIALOGUES.length];
  moonIdx++;
  d.classList.add('show');
  setTimeout(() => d.classList.remove('show'), 3800);
}
setTimeout(showMoonDialogue, 9000);
setInterval(showMoonDialogue, 28000);

/* ═══════════════════════════════════════
   FLOATING THOUGHTS
═══════════════════════════════════════ */
let thoughtIdx = 0;
function spawnThought() {
  if (currentPage === 'pg-landing') return;
  const el = document.createElement('div');
  el.className = 'float-thought';
  el.textContent = FLOAT_THOUGHTS[thoughtIdx % FLOAT_THOUGHTS.length];
  thoughtIdx++;
  el.style.left   = (20 + Math.random()*45) + '%';  /* center-ish zone */
  el.style.top    = (30 + Math.random()*30) + '%';  /* middle of screen */
  el.style.animationDuration = (5 + Math.random()*3) + 's';
  document.getElementById('float-thoughts').appendChild(el);
  setTimeout(() => el.remove(), 9000);
}
setTimeout(spawnThought, 18000);
setInterval(spawnThought, 14000);

/* ═══════════════════════════════════════
   MUSIC
═══════════════════════════════════════ */
const bgm       = document.getElementById('bgm');
const musicBtn  = document.getElementById('music-btn');
const musicIcon = document.getElementById('music-icon');
bgm.volume = 0.45;

musicBtn.addEventListener('click', () => {
  if (musicPlaying) {
    bgm.pause(); musicPlaying=false; musicIcon.textContent='♪'; musicBtn.classList.remove('playing');
  } else {
    bgm.play().catch(()=>{}); musicPlaying=true; musicIcon.textContent='♫'; musicBtn.classList.add('playing');
  }
});

const liteBtn = document.getElementById('lite-btn');
liteBtn.addEventListener('click', () => {
  liteChosen = true;
  if (lite) disableLite(); else enableLite();
  try { localStorage.setItem(KEY_LITE, lite ? 'on' : 'off'); } catch {}
});
syncLiteBtn();

/* ═══════════════════════════════════════
   PAGE NAVIGATION
═══════════════════════════════════════ */
function goTo(id) {
  const el = document.getElementById(id); if (!el) return;
  document.getElementById(currentPage)?.classList.remove('page--active');
  el.classList.add('page--active');
  currentPage = id;
  window.scrollTo(0,0);
  if (id==='pg-stars')    initConstellation();
  if (id==='pg-wishes')   initWishes();
  if (id==='pg-birthday') initBirthday();
  if (id==='pg-final')    initFinal();
}

/* ═══════════════════════════════════════
   CONSTELLATION
═══════════════════════════════════════ */
const DIPPER = [[82,18],[70,28],[58,35],[45,30],[32,30],[32,55],[45,55]];
const LINES  = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]];

function initConstellation() {
  if (conInited) { syncNodes(); return; }
  conInited = true;
  const wrap=document.getElementById('constellation');
  const linesC=document.getElementById('con-lines');
  const nodesW=document.getElementById('star-nodes');

  function resize() {
    linesC.width=wrap.offsetWidth; linesC.height=wrap.offsetHeight;
    const ctx=linesC.getContext('2d'), W=linesC.width, H=linesC.height;
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='rgba(255,190,225,0.38)'; ctx.lineWidth=1.3; ctx.shadowColor='rgba(255,150,210,0.8)'; ctx.shadowBlur=8; ctx.setLineDash([2,6]);
    for (const [a,b] of LINES) {
      ctx.beginPath(); ctx.moveTo(DIPPER[a][0]/100*W,DIPPER[a][1]/100*H);
      ctx.lineTo(DIPPER[b][0]/100*W,DIPPER[b][1]/100*H); ctx.stroke();
    }
    ctx.setLineDash([]); ctx.shadowBlur=0;
    document.querySelectorAll('.snode').forEach((n,i)=>{
      n.style.left=(DIPPER[i][0]/100*W)+'px'; n.style.top=(DIPPER[i][1]/100*H)+'px';
    });
  }

  nodesW.innerHTML='';
  starsData.forEach((s,i) => {
    const node=document.createElement('div');
    node.className='snode'+(unlocked.has(s.id)?' open':''); node.dataset.id=s.id;
    node.innerHTML=`<div class="snode-ring"><span class="snode-sym" style="color:${s.color}">${s.symbol}</span><div class="snode-dot"></div></div><span class="snode-num">${i+1}</span>`;
    node.style.opacity='0'; node.style.transition=`opacity 0.4s ${i*0.08}s`;
    node.addEventListener('click', evt=>openStar(s.id, evt.clientX, evt.clientY));
    nodesW.appendChild(node);
    setTimeout(()=>{ node.style.opacity='1'; },60);
  });

  resize(); window.addEventListener('resize', resize);
  syncNodes();
}

function syncNodes() {
  document.querySelectorAll('.snode').forEach(n=>{ if(unlocked.has(+n.dataset.id)) n.classList.add('open'); });
  const fill=document.getElementById('progress-fill'), label=document.getElementById('progress-text');
  if(fill)  fill.style.width=(unlocked.size/7*100)+'%';
  if(label) label.textContent=`${unlocked.size} of 7`;
}

/* ═══════════════════════════════════════
   STAR MODAL
═══════════════════════════════════════ */
const starModal = document.getElementById('star-modal');

function openStar(id, cx, cy) {
  const s=starsData.find(x=>x.id===id); if(!s) return;
  unlocked.add(id); syncNodes();
  if(cx!==undefined) burst(cx,cy);
  document.getElementById('modal-symbol').textContent=s.symbol;
  document.getElementById('modal-symbol').style.color=s.color;
  document.getElementById('modal-num').textContent=`Star ${s.id} of 7`;
  document.getElementById('modal-name').textContent=s.name;
  document.getElementById('modal-msg').textContent=s.message;
  const prev=document.getElementById('modal-prev'), next=document.getElementById('modal-next');
  prev.style.display=s.id>1?'inline-block':'none';
  next.style.display=s.id<7?'inline-block':'none';
  prev.onclick=()=>{closeStar(); setTimeout(()=>openStar(s.id-1),320);};
  next.onclick=()=>{closeStar(); setTimeout(()=>openStar(s.id+1),320);};
  openModal(starModal);
}
function closeStar() { closeModal(starModal); }
document.getElementById('modal-x').addEventListener('click', closeStar);
starModal.addEventListener('click', e=>{ if(e.target===starModal) closeStar(); });

/* ═══════════════════════════════════════
   HIDDEN STARS
═══════════════════════════════════════ */
const hstarModal = document.getElementById('hstar-modal');

function setupHiddenStars() {
  foundHidden.forEach(hid => {
    const el=document.querySelector(`[data-hid="${hid}"]`); if(el) el.classList.add('found');
    const dot=document.getElementById(`hd-${hid}`); if(dot) dot.classList.add('found');
  });
  updateHintText();
  document.querySelectorAll('.h-star').forEach(el => {
    el.addEventListener('click', () => {
      const hid=el.dataset.hid; if(foundHidden.has(hid)) return;
      foundHidden.add(hid);
      el.classList.add('found');
      const dot=document.getElementById(`hd-${hid}`); if(dot) dot.classList.add('found');
      const hData=hiddenData.find(h=>h.id===hid)||{hint:'You found a hidden star! Keep looking for the others. 👀'};
      document.getElementById('hstar-hint-text').textContent=hData.hint;
      document.getElementById('hstar-count').textContent=`${foundHidden.size} of 3 found 🌟`;
      burst(el.getBoundingClientRect().left+10, el.getBoundingClientRect().top+10);
      openModal(hstarModal); updateHintText();
    });
  });
}

function updateHintText() {
  const el=document.getElementById('hs-hint-text'); if(!el) return;
  if (foundHidden.size===3) {
    el.textContent='✦ All 3 found — enter your code →';
    el.classList.add('ready'); el.onclick=()=>goTo('pg-unlock');
  } else {
    el.textContent=`Find all 3 hidden stars to unlock something special. (${foundHidden.size}/3 found)`;
    el.classList.remove('ready'); el.onclick=null;
  }
}

document.getElementById('hstar-x').addEventListener('click',()=>closeModal(hstarModal));
hstarModal.addEventListener('click',e=>{ if(e.target===hstarModal) closeModal(hstarModal); });

/* ═══════════════════════════════════════
   EK AUR BAAT
═══════════════════════════════════════ */
const eabModal = document.getElementById('eab-modal');
document.getElementById('btn-eab').addEventListener('click', () => {
  document.getElementById('eab-msg').textContent = getNextEab();
  openModal(eabModal);
});
document.getElementById('eab-another').addEventListener('click', () => {
  document.getElementById('eab-msg').textContent = getNextEab();
});
document.getElementById('eab-x').addEventListener('click',()=>closeModal(eabModal));
eabModal.addEventListener('click',e=>{ if(e.target===eabModal) closeModal(eabModal); });

/* ═══════════════════════════════════════
   CODE UNLOCK
═══════════════════════════════════════ */
document.getElementById('btn-verify-code').addEventListener('click', verifyCode);
document.getElementById('code-input').addEventListener('keydown',e=>{ if(e.key==='Enter') verifyCode(); });

async function verifyCode() {
  const input=document.getElementById('code-input');
  const errEl=document.getElementById('code-error');
  const code=input.value.trim().toUpperCase();
  if (!code) { errEl.textContent='Please enter the code first.'; return; }
  try {
    const data={valid: code === CFG.SECRET_CODE.toUpperCase()};
    if (data.valid) {
      errEl.textContent='';
      localStorage.setItem(KEY_CODE,code);
      burst(window.innerWidth/2,window.innerHeight/2);
      setTimeout(()=>burst(window.innerWidth/2-80,window.innerHeight/2+40),200);
      setTimeout(()=>burst(window.innerWidth/2+80,window.innerHeight/2+40),350);
      setTimeout(()=>goTo('pg-message'),600);
    } else {
      errEl.textContent='That\'s not right. Look a little closer. 🔍';
      input.style.borderColor='rgba(255,179,209,0.5)';
      setTimeout(()=>{ input.style.borderColor=''; },1500);
    }
  } catch { errEl.textContent='Network error. Please try again.'; }
}

/* ═══════════════════════════════════════
   MESSAGE BOARD
═══════════════════════════════════════ */
const textarea=document.getElementById('msg-textarea');
const countEl=document.getElementById('msg-count');
textarea.addEventListener('input',()=>{ countEl.textContent=`${textarea.value.length} / 2000`; });

document.getElementById('btn-send-msg').addEventListener('click', async () => {
  const text=textarea.value.trim(); if(!text) return;
  const code=localStorage.getItem(KEY_CODE)||'';
  try {
    let data={ok:false};
    if (code.toUpperCase() !== CFG.SECRET_CODE.toUpperCase() || text.length > 2000) {
      data={ok:false};
    } else if (CFG.MESSAGE_ENDPOINT) {
      const res=await fetch(CFG.MESSAGE_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({message:text,time:new Date().toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true})})});
      data={ok:res.ok};
    } else {
      /* No endpoint configured yet: keep the message in this browser so the UI still works */
      try {
        const box=JSON.parse(localStorage.getItem('7ls_v3_outbox')||'[]');
        box.push({text,time:new Date().toISOString()});
        localStorage.setItem('7ls_v3_outbox',JSON.stringify(box));
      } catch {}
      data={ok:true};
    }
    if (data.ok) {
      textarea.style.display='none';
      document.querySelector('.msg-footer').style.display='none';
      document.getElementById('msg-sent').style.display='block';
      burst(window.innerWidth/2,window.innerHeight/2);
    } else { alert('Something went wrong. Please try again.'); }
  } catch { alert('Network error. Try again.'); }
});

/* ═══════════════════════════════════════
   BIRTHDAY PAGE
═══════════════════════════════════════ */
async function initBirthday() {
  const factEl=document.getElementById('bday-fun-fact');
  if (factEl) factEl.textContent=BIRTHDAY_FACTS[Math.floor(Math.random()*BIRTHDAY_FACTS.length)];
  try {
    const data={unlocked: new Date() >= BIRTHDAY, data: CFG.BIRTHDAY_MSG};
    if (data.unlocked) {
      document.getElementById('bday-locked').style.display='none';
      document.getElementById('bday-open').style.display='flex';
      document.getElementById('bday-title').textContent=data.data.title;
      document.getElementById('bday-msg').textContent=data.data.body;
      setupHiddenStars();
    }
  } catch {}
}

/* ═══════════════════════════════════════
   WISHES
═══════════════════════════════════════ */
function initWishes() {
  if(wishesInited) return; wishesInited=true;
  const grid=document.getElementById('wishes-grid');
  WISHES.forEach((w,i)=>{
    const card=document.createElement('div'); card.className='wish-card';
    card.innerHTML=`<p class="wish-month">${w.month}</p><p class="wish-text">${w.text}</p>`;
    grid.appendChild(card); setTimeout(()=>card.classList.add('vis'),i*80);
  });
}

/* ═══════════════════════════════════════
   FINAL PAGE
═══════════════════════════════════════ */
function initFinal() {
  updateHintText();
  foundHidden.forEach(hid=>{ const dot=document.getElementById(`hd-${hid}`); if(dot) dot.classList.add('found'); });
  setTimeout(()=>{
    burst(window.innerWidth/2,window.innerHeight/2-60);
    setTimeout(()=>burst(window.innerWidth/2-90,window.innerHeight/2+30),280);
    setTimeout(()=>burst(window.innerWidth/2+90,window.innerHeight/2+30),480);
  },700);
}

/* ═══════════════════════════════════════
   EASTER EGG
═══════════════════════════════════════ */
const eggModal=document.getElementById('egg-modal');
function openEgg() {
  document.getElementById('egg-msg').textContent=eggsData[Math.floor(Math.random()*eggsData.length)];
  openModal(eggModal);
}
document.getElementById('egg-x').addEventListener('click',()=>closeModal(eggModal));
eggModal.addEventListener('click',e=>{ if(e.target===eggModal) closeModal(eggModal); });

/* ═══════════════════════════════════════
   SHOOT HINT
═══════════════════════════════════════ */
let hintShown=false;
setInterval(()=>{
  if(hintShown||currentPage!=='pg-stars') return; hintShown=true;
  const h=document.getElementById('shoot-hint'); h.classList.add('show');
  setTimeout(()=>h.classList.remove('show'),4500);
},10000);

/* ═══════════════════════════════════════
   MODAL HELPERS
═══════════════════════════════════════ */
function openModal(m)  { m.setAttribute('aria-hidden','false'); m.classList.add('open'); }
function closeModal(m) { m.classList.remove('open'); m.setAttribute('aria-hidden','true'); }
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') [starModal,hstarModal,eabModal,eggModal].forEach(closeModal);
});

/* ═══════════════════════════════════════
   WIRE BUTTONS
═══════════════════════════════════════ */
function wire() {
  const on=(id,fn)=>{ const el=document.getElementById(id); if(el) el.addEventListener('click',fn); };
  on('btn-enter', ()=>{
    bgm.play().catch(()=>{}); musicPlaying=true;
    musicIcon.textContent='♫'; musicBtn.classList.add('playing');
    goTo('pg-note');
  });
  on('btn-to-stars',           ()=>goTo('pg-stars'));
  on('btn-to-wishes',          ()=>goTo('pg-wishes'));
  on('btn-to-birthday',        ()=>goTo('pg-birthday'));
  on('btn-to-final-from-bday', ()=>goTo('pg-final'));
  on('btn-to-final-from-open', ()=>goTo('pg-final'));
  on('btn-restart',            ()=>goTo('pg-landing'));
}

/* ═══════════════════════════════════════
   BOOT
═══════════════════════════════════════ */
function detectWeakDevice() {
  let saved = null;
  try { saved = localStorage.getItem(KEY_LITE); } catch {}
  if (saved === 'on')  { liteChosen = true; enableLite();  return; }
  if (saved === 'off') { liteChosen = true; return; }
  const q = new URLSearchParams(location.search);
  if (q.has('lite') || (navigator.deviceMemory && navigator.deviceMemory <= 4)) { enableLite(); return; }
  if (q.has('full')) return;
  /* measure real frame rate for 2.5s; if low, switch to lite */
  let frames = 0, start = 0;
  const loop = ts => {
    if (!start) start = ts;
    frames++;
    if (ts - start < 2500) requestAnimationFrame(loop);
    else if (!liteChosen && frames / ((ts - start) / 1000) < 45) enableLite();
  };
  requestAnimationFrame(loop);
}

async function init() {
  runLoader();
  resizeSky(); window.addEventListener('resize', resizeSky);
  requestAnimationFrame(animateSky);
  detectWeakDevice();
  try { await fetchData(); } catch { starsData=STAR_MESSAGES; eggsData=EGGS_LOCAL; }
  wire();
  setupHiddenStars();
}

init().catch(console.error);
