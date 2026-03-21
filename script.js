// --- Custom Cursor ---
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    // Immediate cursor update
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
    });
    // Delayed follower update
    gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power2.out"
    });
});

// Hover states for links and buttons
const interactables = document.querySelectorAll('a, .btn, .project-card, .skills span');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
});

// --- GSAP Animations ---
gsap.registerPlugin(ScrollTrigger);

// Initial Hero animation
const tl = gsap.timeline();
tl.from('.logo', { y: -20, opacity: 0, duration: 1, ease: 'power3.out' })
  .from('.menu a', { y: -20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=0.8')
  .from('.hero .reveal-text', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power4.out',
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' // Start cropped
  }, '-=0.5');

// Scroll Animations for sections
gsap.utils.toArray('.section').forEach((section, i) => {
    if(i === 0) return; // skip hero since it has initial anim
    
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Parallax effect on cards
gsap.utils.toArray('.glass-card').forEach(card => {
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        },
        y: -30,
        ease: "none"
    });
});

// --- Three.js Background Animation ---
const canvasContainer = document.getElementById('canvas-container');

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
canvasContainer.appendChild(renderer.domElement);

// Particles Setup
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    // Distribute particles in a wide area
    posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x5e17eb,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

// Mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Add a glowing central sphere/torus for extra cool factor
const geometry = new THREE.TorusKnotGeometry( 1.5, 0.4, 128, 32 );
const material = new THREE.MeshBasicMaterial( { 
    color: 0x5e17eb, 
    wireframe: true,
    transparent: true,
    opacity: 0.15
} );
const torusKnot = new THREE.Mesh( geometry, material );
scene.add( torusKnot );

// Camera Position
camera.position.z = 5;

// Variables for interactivity
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate particles slowly
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.05;

    // Rotate TorusKnot
    torusKnot.rotation.y = elapsedTime * 0.2;
    torusKnot.rotation.x = elapsedTime * 0.1;

    // Interactive Camera movement based on mouse
    gsap.to(camera.position, {
        x: mouseX * 2,
        y: -mouseY * 2,
        duration: 2,
        ease: "power2.out"
    });
    
    // Slight parallax on the particles based on mouse
    gsap.to(particlesMesh.position, {
        x: mouseX * 0.5,
        y: -mouseY * 0.5,
        duration: 1.5,
        ease: "power2.out"
    });

    renderer.render(scene, camera);
}

animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
