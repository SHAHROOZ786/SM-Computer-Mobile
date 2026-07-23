// =========================================================================
// SM Computers & Mobile — Interactivity
// =========================================================================

// ---- Theme toggle ----
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', ()=>{
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
});

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', ()=>{
  const isOpen = navLinks.style.display === 'flex';
  navLinks.style.display = isOpen ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'fixed';
  navLinks.style.top = '76px';
  navLinks.style.left = '0';
  navLinks.style.right = '0';
  navLinks.style.background = 'var(--paper)';
  navLinks.style.padding = '20px 24px';
  navLinks.style.borderBottom = '1px solid var(--line)';
  navLinks.style.gap = '18px';
});
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
  if(window.innerWidth <= 980){ navLinks.style.display='none'; }
}));

// ---- Header scrolled shadow + scroll progress bar ----
const headerEl = document.querySelector('header');
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', ()=>{
  headerEl.classList.toggle('scrolled', window.scrollY > 12);
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  if(progressBar) progressBar.style.width = pct + '%';
});

// ---- Hero device stack parallax ----
const stack = document.getElementById('stack');
if(stack){
  stack.addEventListener('mousemove', (e)=>{
    const rect = stack.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    stack.querySelectorAll('.device-card').forEach((card, i)=>{
      const depth = (i+1) * 6;
      card.style.transform = `translate(${x*depth}px, ${y*depth}px) rotate(${x*3}deg)`;
    });
  });
  stack.addEventListener('mouseleave', ()=>{
    stack.querySelectorAll('.device-card').forEach(card=> card.style.transform = '');
  });
}

// ---- Scroll reveal (with stagger index per grid) ----
document.querySelectorAll('.service-grid, .why-grid, .pricing-grid').forEach(grid=>{
  Array.from(grid.children).forEach((child, i)=> child.style.setProperty('--stagger', i));
});
const revealEls = document.querySelectorAll('[data-aos]');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('aos-in'); }
  });
}, {threshold:0.15});
revealEls.forEach(el=>io.observe(el));

// ---- Service search + filter ----
const serviceCards = document.querySelectorAll('.service-card');
const searchInput = document.getElementById('serviceSearch');
const filterChips = document.querySelectorAll('.filter-chip');
const noResults = document.getElementById('noResults');
let activeFilter = 'all';

function applyFilters(){
  const term = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;
  serviceCards.forEach(card=>{
    const matchesFilter = activeFilter === 'all' || card.dataset.cat === activeFilter;
    const matchesSearch = !term || card.textContent.toLowerCase().includes(term);
    const show = matchesFilter && matchesSearch;
    card.style.display = show ? '' : 'none';
    if(show) visibleCount++;
  });
  noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}
searchInput.addEventListener('input', applyFilters);
filterChips.forEach(chip=>{
  chip.addEventListener('click', ()=>{
    filterChips.forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    applyFilters();
  });
});
// reveal cards on load
setTimeout(()=> serviceCards.forEach(c=>c.classList.add('show')), 100);

// ---- Testimonial slider ----
const slides = document.querySelectorAll('.testi-slide');
const dotsWrap = document.getElementById('testiDots');
let current = 0;
slides.forEach((_, i)=>{
  const dot = document.createElement('button');
  if(i===0) dot.classList.add('active');
  dot.addEventListener('click', ()=> showSlide(i));
  dotsWrap.appendChild(dot);
});
function showSlide(i){
  slides[current].classList.remove('active');
  dotsWrap.children[current].classList.remove('active');
  current = i;
  slides[current].classList.add('active');
  dotsWrap.children[current].classList.add('active');
}
setInterval(()=>{ showSlide((current+1) % slides.length); }, 5000);

// ---- FAQ accordion ----
document.querySelectorAll('.faq-item').forEach(item=>{
  item.querySelector('.faq-q').addEventListener('click', ()=>{
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});

// ---- Contact form validation ----
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  let valid = true;
  const fields = [
    {id:'fieldName', input:'cName', check: v=>v.trim().length>0},
    {id:'fieldPhone', input:'cPhone', check: v=>/^[0-9\-\+\s]{7,15}$/.test(v.trim())},
    {id:'fieldService', input:'cService', check: v=>v.trim().length>0},
    {id:'fieldMessage', input:'cMessage', check: v=>v.trim().length>3},
  ];
  fields.forEach(f=>{
    const el = document.getElementById(f.input);
    const wrap = document.getElementById(f.id);
    if(!f.check(el.value)){ wrap.classList.add('invalid'); valid = false; }
    else{ wrap.classList.remove('invalid'); }
  });
  if(valid){
    document.getElementById('formSuccess').style.display = 'block';
    form.reset();
  }
});

// ---- Newsletter mock submit ----
document.getElementById('newsletterForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  e.target.querySelector('input').value = '';
  alert('Subscribed! Thanks for joining our updates.');
});

// ---- Back to top ----
const fabTop = document.getElementById('fabTop');
window.addEventListener('scroll', ()=>{
  fabTop.classList.toggle('show', window.scrollY > 500);
});
fabTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
