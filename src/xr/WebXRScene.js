import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import ConnectomeGraph from "../components/ConnectomeGraph";
import WormBody from "../components/WormBody";

export default class WebXRScene {
  constructor(container, data, getFrameIndex) {
    this.container = container;
    this.data = data;
    this.getFrameIndex = getFrameIndex;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050816);

    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.01,
      100
    );
    this.camera.position.set(0, 0.3, 3.5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.xr.enabled = true;

    this.container.appendChild(this.renderer.domElement);
    this.container.appendChild(VRButton.createButton(this.renderer));

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.addLights();
    this.addHelpers();

    this.connectomeGraph = new ConnectomeGraph(this.scene, this.data);
    this.wormBody = new WormBody(this.scene);

    this.onResize = this.onResize.bind(this);
    window.addEventListener("resize", this.onResize);

    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  addLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 1.2);
    directional.position.set(2, 3, 4);
    this.scene.add(directional);

    const fill = new THREE.PointLight(0xffffff, 0.7, 20);
    fill.position.set(-2, -1, 3);
    this.scene.add(fill);
  }

  addHelpers() {
    const grid = new THREE.GridHelper(8, 16, 0x334455, 0x1b2233);
    grid.position.y = -2.2;
    this.scene.add(grid);

    const axes = new THREE.AxesHelper(0.8);
    axes.position.set(-2.2, -1.8, 0);
    this.scene.add(axes);
  }

  animate() {
    const frameIndex = this.getFrameIndex();

    this.connectomeGraph.update(frameIndex);
    this.wormBody.update(frameIndex);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const { clientWidth, clientHeight } = this.container;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);
  }

  dispose() {
    window.removeEventListener("resize", this.onResize);
    this.renderer.setAnimationLoop(null);
    this.connectomeGraph.dispose();
    this.wormBody.dispose();
    this.controls.dispose();
    this.renderer.dispose();

    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
