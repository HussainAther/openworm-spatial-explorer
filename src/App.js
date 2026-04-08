import React, { useEffect, useRef, useState } from "react";
import WebXRScene from "./xr/WebXRScene";
import TimelineSlider from "./components/TimelineSlider";
import neuronData from "./data/sample_neuron_activity.json";

export default function App() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const maxFrame = neuronData.timesteps.length - 1;

  useEffect(() => {
    if (!containerRef.current) return;

    sceneRef.current = new WebXRScene(
      containerRef.current,
      neuronData,
      () => frameIndex
    );

    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev >= maxFrame ? 0 : prev + 1));
    }, 900);

    return () => clearInterval(interval);
  }, [isPlaying, maxFrame]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#050816" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      <TimelineSlider
        frameIndex={frameIndex}
        maxFrame={maxFrame}
        isPlaying={isPlaying}
        onFrameChange={setFrameIndex}
        onTogglePlay={() => setIsPlaying((prev) => !prev)}
      />
    </div>
  );
}
