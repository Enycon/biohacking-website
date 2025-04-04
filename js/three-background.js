import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
// Optional: OrbitControls für Debugging/Interaktion
// import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, particles, particleMaterial;
let mouseX = 0, mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function init() {
    // Szene
    scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2(0x000000, 0.0008); // Optional: Nebel

    // Kamera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 1000;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl-canvas'), alpha: true, antialias: true }); // alpha:true für transparenten Hintergrund
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimierung für High-DPI Displays

    // Partikel
    const particleCount = 5000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 2000; // Zufällige Positionen in einem Würfel
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Partikel Material (Punkte)
    particleMaterial = new THREE.PointsMaterial({
        color: 0x4CAF50, // Hauptfarbe Grün
        size: 3,
        map: createCircleTexture(), // Runde Textur für weichere Punkte
        blending: THREE.AdditiveBlending, // Heller, wenn sie überlappen
        transparent: true,
        depthWrite: false // Verhindert Artefakte bei Überlappung
    });

    particles = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particles);

    // Optional: OrbitControls
    // const controls = new OrbitControls(camera, renderer.domElement);

    // Event Listener
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.arc(32, 32, 30, 0, Math.PI * 2);
    context.fillStyle = '#ffffff'; // Weißer Kreis
    context.fill();
    return new THREE.CanvasTexture(canvas);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 2; // Reduzierter Einfluss der Maus
    mouseY = (event.clientY - windowHalfY) / 2;
}

function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.00005; // Langsamere Animation

    // Kamera leicht bewegen basierend auf Mausposition
    camera.position.x += (mouseX - camera.position.x) * 0.03;
    camera.position.y += (-mouseY - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    // Partikel leicht rotieren lassen
    particles.rotation.x = time * 0.2;
    particles.rotation.y = time * 0.4;

    renderer.render(scene, camera);
}

// Initialisierung starten, wenn das DOM bereit ist
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
