"use client";
import React, { useEffect, useRef, MouseEvent } from "react";
import useWindow from "./useWindow";

// interface Dimension {
//   width: number;
//   height: number;
// }

interface Position {
  x: number;
  y: number;
}

export default function Scene() {
  // The `dimension` object is already type-safe if `useWindow` returns a Dimension object
  const dimension = useWindow();
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const prevPosition = useRef<Position | null>(null);

  useEffect(() => {
    if (dimension.width > 0) {
      init();
    }
  }, [dimension]);

  const init = () => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, dimension.width, dimension.height);
    ctx.globalCompositeOperation = "destination-out";
  };

  const lerp = (x: number, y: number, a: number): number => x * (1 - a) + y * a;

  const manageMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY, movementX, movementY } = e;

    // Ensure number of circles is safely calculated
    const nbOfCircles = Math.max(Math.abs(movementX), Math.abs(movementY)) / 10;

    if (prevPosition.current) {
      const { x, y } = prevPosition.current;
      for (let i = 0; i < nbOfCircles; i++) {
        const targetX = lerp(x, clientX, (1 / nbOfCircles) * i);
        const targetY = lerp(y, clientY, (1 / nbOfCircles) * i);
        draw(targetX, targetY, 50);
      }
    }

    prevPosition.current = {
      x: clientX,
      y: clientY,
    };
  };

  const draw = (x: number, y: number, radius: number) => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  };

  return (
    <div className="relative w-full h-full">
      {dimension.width === 0 && (
        <div className="absolute w-full h-full bg-black" />
      )}
      <canvas
        ref={canvas}
        onMouseMove={manageMouseMove}
        height={dimension.height}
        width={dimension.width}
      />
    </div>
  );
}
