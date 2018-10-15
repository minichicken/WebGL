import { PerspectiveCamera, Scene, WebGLRenderer, Mesh, TextureLoader, BoxBufferGeometry, MeshBasicMaterial } from 'three';

let camera: PerspectiveCamera | any, scene: Scene, renderer: WebGLRenderer;
let mesh: Mesh;

function init() {
    camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;
    scene = new Scene();
    var texture = new TextureLoader().load('crate.gif');
    var geometry = new BoxBufferGeometry(200, 200, 200);
    var material = new MeshBasicMaterial({ map: texture });
    mesh = new Mesh(geometry, material);
    scene.add(mesh);
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    //
    window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}

init();
animate();
