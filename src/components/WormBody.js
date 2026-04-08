import * as THREE from "three";

export default class WormBody {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.segments = [];

    this.scene.add(this.group);
    this.createBody();
  }

  createBody() {
    const segmentGeometry = new THREE.SphereGeometry(0.12, 20, 20);

    for (let i = 0; i < 12; i++) {
      const radius = 0.18 - i * 0.008;
      const material = new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 0.8
      });

      const segment = new THREE.Mesh(segmentGeometry, material);
      segment.scale.set(radius / 0.12, radius / 0.12, 1);
      segment.position.set(Math.sin(i * 0.25) * 0.1, 0.2 - i * 0.18, -0.8);

      this.group.add(segment);
      this.segments.push(segment);
    }
  }

  update(frameIndex) {
    this.segments.forEach((segment, i) => {
      const wave = Math.sin(frameIndex * 0.7 + i * 0.45);
      segment.position.x = wave * 0.12;
      segment.position.y = 0.2 - i * 0.18;
      segment.rotation.z = wave * 0.25;
      const scaleBoost = 1 + Math.max(0, wave) * 0.15;
      segment.scale.z = scaleBoost;
      segment.material.opacity = 0.55 + (wave + 1) * 0.12;
    });
  }

  dispose() {
    this.scene.remove(this.group);
  }
}
