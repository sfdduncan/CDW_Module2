// model-viewer.js
// Three.js scene to load and display a 3D model with OrbitControls

(function () {
  const canvasWidth = 800;
  const canvasHeight = 400;
  const container = document.getElementById('canvas-container-4');

  container.style.position = 'relative';
  container.style.width = `${canvasWidth}px`;
  container.style.height = `${canvasHeight}px`;
  container.style.zIndex = '1';
  container.style.overflow = 'hidden';

  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setClearColor(0xf0f0f0);
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 1000);
  camera.position.set(0, 8, 8);
  camera.lookAt(0, 0, 0);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.minDistance = 8;
  controls.maxDistance = 8;
  controls.target.set(0, 1, 0);
  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;

  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);
  const camLight = new THREE.PointLight(0xffffff, 1.2, 100);
  camera.add(camLight);
  scene.add(camera);

  // --- Bubbles (unchanged) ---
  const bubbles = [];
  const bubbleCount = 40;
  for (let i = 0; i < bubbleCount; i++) {
    const size = 0.5 + Math.random() * 1.2;
    const bubbleGeom = new THREE.SphereGeometry(size, 32, 32);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0x99ccff,
      transparent: true,
      opacity: 0.9,
      roughness: 0.02,
      metalness: 0.0,
      transmission: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      ior: 1.45,
      reflectivity: 1.0,
      thickness: 0.3,
      attenuationColor: 0x99ccff,
      attenuationDistance: 1.0
    });
    const bubble = new THREE.Mesh(bubbleGeom, bubbleMat);
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI;
    const radius = 3 + Math.random() * 2;
    bubble.position.set(
      Math.sin(phi) * Math.cos(theta) * radius,
      Math.cos(phi) * radius + 1.5,
      Math.sin(phi) * Math.sin(theta) * radius + 2.0
    );
    scene.add(bubble);
    bubbles.push({ mesh: bubble, theta, phi, radius, speed: 0.2 + Math.random() * 0.3 });
  }

  // --- Blue Floating Cubes ---
  const cubes = [];
  const cubeCount = 80;
  for (let i = 0; i < cubeCount; i++) {
    const size = 0.10 + Math.random() * 0.08;
    const cubeGeom = new THREE.BoxGeometry(size, size, size);
    const cubeMat = new THREE.MeshStandardMaterial({ color: 0x2266ff, roughness: 0.3, metalness: 0.1, transparent: true, opacity: 0.55 });
    const cube = new THREE.Mesh(cubeGeom, cubeMat);
    // Spherical coordinates for floating, but bias Z to be in front of model
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI;
    // Place most cubes in front (z > 0)
    const radius = 2.5 + Math.random() * 2.5;
    let x = Math.sin(phi) * Math.cos(theta) * radius;
    let y = Math.cos(phi) * radius + 2.5;
    let z = Math.abs(Math.sin(phi) * Math.sin(theta) * radius) + 1.5; // always z > 1.5 (in front)
    cube.position.set(x, y, z);
    // Random initial rotation
    cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    scene.add(cube);
    cubes.push({ mesh: cube, theta, phi, radius, speed: 0.3 + Math.random() * 0.3, thetaSpeed: 0.003 + Math.random() * 0.003, phiSpeed: 0.002 + Math.random() * 0.002, rotSpeed: { x: (Math.random()-0.5)*0.03, y: (Math.random()-0.5)*0.03, z: (Math.random()-0.5)*0.03 }, zBias: z });
  }

  if (typeof THREE.GLTFLoader !== 'undefined') {
    const loader = new THREE.GLTFLoader();
    loader.load(
      './vaporwave_tokyo_sketchfab_3d_editor_challenge.glb',
      function (gltf) {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.set(-center.x, -center.y, -6.5 - center.z);
        scene.add(model);
        controls.target.set(0, 0, 0);
        controls.update();
        window.modelBox = new THREE.Box3().setFromObject(model);
      },
      undefined,
      function (error) {
        console.error('An error occurred loading the model:', error);
      }
    );
  } else {
    console.error('GLTFLoader is not loaded.');
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    // Animate bubbles (unchanged)
    bubbles.forEach(b => {
      b.mesh.position.y += 0.01 * b.speed;
      b.mesh.position.x = Math.sin(b.phi) * Math.cos((b.theta += 0.002 * b.speed)) * b.radius;
      b.mesh.position.z = Math.sin(b.phi) * Math.sin(b.theta) * b.radius;
      if (b.mesh.position.y > 6) b.mesh.position.y = 1.5 + Math.random();
    });
    // Animate cubes (floating in orbits, rotating, biased in front)
    cubes.forEach(c => {
      c.theta += c.thetaSpeed * c.speed;
      c.phi += c.phiSpeed * c.speed;
      // Keep phi in [0, PI]
      if (c.phi > Math.PI) c.phi -= Math.PI;
      c.mesh.position.x = Math.sin(c.phi) * Math.cos(c.theta) * c.radius;
      c.mesh.position.y = Math.cos(c.phi) * c.radius + 2.5;
      // Keep cubes in front of model (z > 1.5)
      c.mesh.position.z = Math.abs(Math.sin(c.phi) * Math.sin(c.theta) * c.radius) + 1.5;
      // Rotate cube
      c.mesh.rotation.x += c.rotSpeed.x;
      c.mesh.rotation.y += c.rotSpeed.y;
      c.mesh.rotation.z += c.rotSpeed.z;
    });
    renderer.render(scene, camera);
  }

  animate();
})();