# OpenWorm Spatial Explorer

A small experimental WebXR / Three.js viewer for exploring OpenWorm-style neural activity and worm body motion in 3D space.

## Features

- 3D connectome-style node graph
- animated neuron activity over time
- simple worm body motion layer
- timeline controls
- WebXR / VR button support through Three.js

## Repo structure

```text
openworm-spatial-explorer/
├── src/
│   ├── data/
│   │   └── sample_neuron_activity.json
│   ├── components/
│   │   ├── ConnectomeGraph.js
│   │   ├── WormBody.js
│   │   └── TimelineSlider.js
│   ├── xr/
│   │   └── WebXRScene.js
│   └── App.js
├── public/
├── README.md
└── demo.gif
