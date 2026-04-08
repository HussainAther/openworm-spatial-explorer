import React from "react";

export default function TimelineSlider({
  frameIndex,
  maxFrame,
  isPlaying,
  onFrameChange,
  onTogglePlay
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: "24px",
        transform: "translateX(-50%)",
        width: "min(700px, 92vw)",
        padding: "14px 16px",
        borderRadius: "14px",
        background: "rgba(15, 18, 28, 0.82)",
        color: "white",
        backdropFilter: "blur(8px)",
        fontFamily: "Arial, sans-serif",
        zIndex: 10
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <strong>OpenWorm Spatial Explorer</strong>
        <span>Frame {frameIndex + 1} / {maxFrame + 1}</span>
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button
          onClick={onTogglePlay}
          style={{
            padding: "8px 14px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer"
          }}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <input
          type="range"
          min={0}
          max={maxFrame}
          step={1}
          value={frameIndex}
          onChange={(e) => onFrameChange(Number(e.target.value))}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  );
}
