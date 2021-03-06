// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  pixelsPerInch: 72
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("black", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -7);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  //Setup a loader
  const loader = new THREE.TextureLoader();

  //Load the textures
  const earthTexture = loader.load("earth.jpg")
  const moonTexture = loader.load("moon.jpg")

  // Setup an earth material
  const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 1,
    metalness: 0,
  });

  //Setup a moon material
  const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexture,
    roughness: 1,
    metalness: 0
  });

  // Create earth mesh
  const earthMesh = new THREE.Mesh(geometry, earthMaterial);
  scene.add(earthMesh);

  // Create moon group
  const moonGroup = new THREE.Group();

  // Create moon mesh
  const moonMesh = new THREE.Mesh(geometry, moonMaterial);
  moonMesh.position.set(1.5, 1, 0)
  moonMesh.scale.setScalar(0.25)
  moonGroup.add(moonMesh);
  scene.add(moonGroup)

  // Lights
  const light = new THREE.PointLight("white", 1)
  light.position.set(2,2,2)
  scene.add(light)

  // Helpers
  scene.add(new THREE.AxesHelper(3))
  scene.add(new THREE.GridHelper(5, 15))
  scene.add(new THREE.PointLightHelper(light))

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      earthMesh.rotation.y = time * 0.25;
      moonMesh.rotation.y = time * 0.15;
      moonGroup.rotation.y = time * 0.5;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
