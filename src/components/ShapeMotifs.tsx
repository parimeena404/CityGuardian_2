"use client";

import React from "react";

/** Floating ○ △ □ shape motifs scattered across the background */
export default function ShapeMotifs() {
  const shapes = [
    // Circles
    { type: "circle", top: "8%", left: "5%", size: 80, delay: 0 },
    { type: "circle", top: "45%", left: "85%", size: 60, delay: 2 },
    { type: "circle", top: "78%", left: "15%", size: 100, delay: 4 },
    { type: "circle", top: "20%", left: "70%", size: 45, delay: 1 },
    { type: "circle", top: "65%", left: "55%", size: 70, delay: 3 },
    // Triangles
    { type: "triangle", top: "15%", left: "45%", size: 75, delay: 1.5 },
    { type: "triangle", top: "55%", left: "25%", size: 90, delay: 3.5 },
    { type: "triangle", top: "35%", left: "90%", size: 55, delay: 0.5 },
    { type: "triangle", top: "85%", left: "65%", size: 65, delay: 2.5 },
    // Squares
    { type: "square", top: "25%", left: "30%", size: 70, delay: 2 },
    { type: "square", top: "70%", left: "80%", size: 50, delay: 0 },
    { type: "square", top: "10%", left: "60%", size: 85, delay: 4.5 },
    { type: "square", top: "50%", left: "10%", size: 60, delay: 1 },
  ];

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {shapes.map((shape, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: shape.top,
            left: shape.left,
            width: shape.size,
            height: shape.size,
            animation: `${
              i % 2 === 0 ? "float-shape" : "float-shape-reverse"
            } ${6 + (i % 4)}s ease-in-out ${shape.delay}s infinite`,
          }}
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-full h-full"
            style={{ color: "var(--sq-accent)", opacity: 0.04 }}
          >
            {shape.type === "circle" && (
              <circle cx="50" cy="50" r="45" />
            )}
            {shape.type === "triangle" && (
              <polygon points="50,5 95,90 5,90" />
            )}
            {shape.type === "square" && (
              <rect x="10" y="10" width="80" height="80" />
            )}
          </svg>
        </div>
      ))}
    </div>
  );
}
