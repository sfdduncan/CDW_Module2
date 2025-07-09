(function () {
  const canvasWidth = 800;
  const canvasHeight = 400;
  const container = document.getElementById('canvas-container-3');

  container.style.position = 'relative';
  container.style.width = `${canvasWidth}px`;
  container.style.height = `${canvasHeight}px`;
  container.style.zIndex = '1';
  container.style.overflow = 'hidden';

  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setClearColor(0xf8f0e3);
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 1000);
  camera.position.set(0, 5, 8);
  camera.lookAt(0, 1.5, 0);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.minDistance = 8;
  controls.maxDistance = 8;
  controls.target.set(0, 1.5, 0);
  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;

  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  
  // Load sleeping cat model
  let catModel = null;
  const loader = new THREE.GLTFLoader();
  loader.load('scene.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(obj => {
      if (obj.isMesh) obj.castShadow = true;
    });

    // Make the model larger and move it further back in the scene
    model.scale.set(4, 4, 4); // Increase size
    model.position.set(0, -2, -4); // Move further back along Z axis

    scene.add(model);
    catModel = model;
  }, undefined, function (error) {
    console.error('Error loading sleeping cat model:', error);
  });

  function animate() {
    requestAnimationFrame(animate);
    if (catModel) {
      catModel.rotation.y += 0.01; // Rotate counterclockwise
    }
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
})();
