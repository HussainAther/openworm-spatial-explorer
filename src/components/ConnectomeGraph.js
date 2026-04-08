import * as THREE from "three";

function activityToColor(activity) {
  const color = new THREE.Color();
  color.setHSL(0.65 - activity * 0.65, 1.0, 0.5);
  return color;
}

export default class ConnectomeGraph {
  constructor(scene, data) {
    this.scene = scene;
    this.data = data;
    this.nodeMeshes = new Map();
    this.edgeLines = [];
    this.labelSprites = [];
    this.group = new THREE.Group();

    this.scene.add(this.group);

    this.createNodes();
    this.createEdges();
  }

  createNodes() {
    const firstFrame = this.data.timesteps[0];
    if (!firstFrame) return;

    const geometry = new THREE.SphereGeometry(0.08, 24, 24);

    firstFrame.neurons.forEach((neuron) => {
      const material = new THREE.MeshStandardMaterial({
        color: activityToColor(neuron.activity),
        emissive: activityToColor(neuron.activity),
        emissiveIntensity: 0.4
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(neuron.x, neuron.y, neuron.z);
      mesh.userData = { id: neuron.id };

      this.nodeMeshes.set(neuron.id, mesh);
      this.group.add(mesh);

      const label = this.createTextSprite(neuron.id);
      label.position.set(neuron.x, neuron.y + 0.14, neuron.z);
      this.labelSprites.push(label);
      this.group.add(label);
    });
  }

  createEdges() {
    const firstFrame = this.data.timesteps[0];
    if (!firstFrame) return;

    const neuronMap = new Map(firstFrame.neurons.map((n) => [n.id, n]));

    this.data.edges.forEach(([sourceId, targetId]) => {
      const source = neuronMap.get(sourceId);
      const target = neuronMap.get(targetId);
      if (!source || !target) return;

      const points = [
        new THREE.Vector3(source.x, source.y, source.z),
        new THREE.Vector3(target.x, target.y, target.z)
      ];

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.45 });
      const line = new THREE.Line(geometry, material);

      this.edgeLines.push({ line, sourceId, targetId });
      this.group.add(line);
    });
  }

  createTextSprite(text) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 256;
    canvas.height = 64;

    context.fillStyle = "rgba(0,0,0,0)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "24px Arial";
    context.fillStyle = "white";
    context.fillText(text, 10, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.45, 0.12, 1);

    return sprite;
  }

  update(frameIndex) {
    const frame = this.data.timesteps[frameIndex];
    if (!frame) return;

    const neuronMap = new Map(frame.neurons.map((n) => [n.id, n]));

    frame.neurons.forEach((neuron) => {
      const mesh = this.nodeMeshes.get(neuron.id);
      if (!mesh) return;

      const color = activityToColor(neuron.activity);
      mesh.material.color.copy(color);
      mesh.material.emissive.copy(color);
      mesh.material.emissiveIntensity = 0.25 + neuron.activity * 0.9;

      const scale = 1 + neuron.activity * 0.6;
      mesh.scale.set(scale, scale, scale);
      mesh.position.set(neuron.x, neuron.y, neuron.z);
    });

    this.labelSprites.forEach((label, i) => {
      const neuron = frame.neurons[i];
      if (neuron) {
        label.position.set(neuron.x, neuron.y + 0.14, neuron.z);
      }
    });

    this.edgeLines.forEach(({ line, sourceId, targetId }) => {
      const source = neuronMap.get(sourceId);
      const target = neuronMap.get(targetId);
      if (!source || !target) return;

      const points = [
        new THREE.Vector3(source.x, source.y, source.z),
        new THREE.Vector3(target.x, target.y, target.z)
      ];

      line.geometry.dispose();
      line.geometry = new THREE.BufferGeometry().setFromPoints(points);
    });
  }

  dispose() {
    this.scene.remove(this.group);
  }
}
