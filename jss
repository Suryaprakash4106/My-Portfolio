/* script.js
   Interactions:
   - rotating professions typing
   - custom cursor following pointer with hover zoom
   - dark mode toggle
   - simple scroll reveal
   - contact form basic handler
*/

// ---------- rotating professions ----------
const professions = [
  "Full-Stack Developer",
  "IoT & Automation Engineer",
  "Web Performance Enthusiast",
  "Software Tester"
];

let idx = 0;
const rotEl = document.getElementById('rotatingProf');

function typeWord(word, el, cb){
  el.textContent = '';
  let i = 0;
  const t = setInterval(()=>{
    el.textContent += word[i++];
    if(i >= word.length){ clearInterval(t); setTimeout(cb, 1000); }
  }, 70);
}
function deleteWord(el, cb){
  const text = el.textContent;
  let i = text.length;
  const t = setInterval(()=>{
    el.textContent = text.substring(0, --i);
    if(i <= 0){ clearInterval(t); cb(); }
  }, 30);
}
function rotateProfessions(){
  const word = professions[idx % professions.length];
  typeWord(word, rotEl, ()=>{
    setTimeout(()=> deleteWord(rotEl, ()=>{
      idx++; rotateProfessions();
    }), 900);
  });
}
rotateProfessions();

const hoverTargets = ['a', '.btn', '.project-card', 'input', 'textarea', '.framed-photo', '.framed-photo-lg', '.framed-thumb', '.skill', '.icon-btn'];
function applyHoverListeners(){
  hoverTargets.forEach(sel=>{
    document.querySelectorAll(sel).forEach(el=>{
      el.addEventListener('mouseenter', ()=> {
        cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
        cursor.style.width = '44px'; cursor.style.height = '44px';
      });
      el.addEventListener('mouseleave', ()=> {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        cursor.style.width = '28px'; cursor.style.height = '28px';
      });
    });
  });
}
applyHoverListeners();

// ---------- simple scroll reveal ----------
const revealItems = document.querySelectorAll('.section, .project-card, .skill, .contact-card, .about-content');
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      obs.unobserve(entry.target);
    }
  });
},{threshold:0.12});
revealItems.forEach(it=>{
  it.style.opacity = 0;
  it.style.transform = 'translateY(18px)';
  it.style.transition = 'all .7s cubic-bezier(.2,.9,.3,1)';
  obs.observe(it);
});

// ---------- theme toggle ----------
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
});

// set default to light explicitly (optional)
document.body.classList.add('light');

// ---------- contact form handler (basic) ----------
const form = document.getElementById('contactForm');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    // basic visual feedback - in real use, integrate with email API
    const btn = form.querySelector('button[type="submit"]');
    const old = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(()=>{
      btn.textContent = 'Sent ✓';
      form.reset();
      setTimeout(()=>{ btn.textContent = old; btn.disabled = false; }, 1400);
    }, 1000);
  });
}

// ---------- footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// === 3D Technology Background ===
const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r152/three.min.js";
script.onload = init3DBackground;
document.head.appendChild(script);

function init3DBackground() {
    const canvas = document.getElementById("bg3d");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const ambientLight = new THREE.AmbientLight(0x00bfff, 1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00bfff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 30;
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.07,
        color: 0x00bfff
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const gridHelper = new THREE.GridHelper(40, 40, 0x00bfff, 0x008ecc);
    scene.add(gridHelper);

    camera.position.z = 20;

    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.001;
        gridHelper.rotation.y += 0.0005;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
