"use client";
import React, { useEffect, useRef, useState, MouseEvent } from "react";
import useWindow from "./useWindow";
import Spline from "@splinetool/react-spline"; // Import Spline component

// Interface to define x and y position
interface Position {
  x: number;
  y: number;
}

export default function Scene() {
  // Get window dimensions from the custom hook
  const dimension = useWindow();

  // Ref to store the canvas element
  const canvas = useRef<HTMLCanvasElement | null>(null);

  // Ref to store the previous mouse position
  const prevPosition = useRef<Position | null>(null);

  // Ref to store the background image
  const backgroundImage = useRef<HTMLImageElement | null>(null);

  // State to control when dust effect is shown and its position
  const [showDustEffect, setShowDustEffect] = useState(false);
  const [dustPosition, setDustPosition] = useState<Position>({ x: 0, y: 0 });

  // Effect hook to load background image when the window dimensions change
  useEffect(() => {
    if (dimension.width > 0) {
      loadBackgroundImage(); // Load the image once the dimension is valid
    }
  }, [dimension]);

  // Function to load the background image
  const loadBackgroundImage = () => {
    const img = new Image(); // Create a new Image object
    img.src = "/comingSoonBackdrop.jpg"; // Set the source of the image (replace with actual URL)
    img.onload = () => {
      backgroundImage.current = img; // Set the loaded image to the ref
      init(); // Initialize canvas drawing once image is loaded
    };
  };

  // Function to initialize the canvas by drawing the background image
  const init = () => {
    // Ensure both canvas and image are loaded
    if (!canvas.current || !backgroundImage.current) return;

    // Get the canvas context for drawing
    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;

    // Set the background color to black to resemble a blackboard
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, dimension.width, dimension.height); // Fill the canvas with black

    // Draw the background image, scaling it to fit the window dimensions
    ctx.drawImage(
      backgroundImage.current,
      0,
      0,
      dimension.width,
      dimension.height
    );

    // Set the composite operation to 'destination-out' to create the scratch-off effect
    ctx.globalCompositeOperation = "destination-out";
  };

  // Linear interpolation function for smooth transitions between two points
  const lerp = (x: number, y: number, a: number): number => x * (1 - a) + y * a;

  // Function to handle mouse movement over the canvas
  const manageMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY, movementX, movementY } = e; // Get current mouse coordinates and movement

    // Trigger dust effect when user scrapes the canvas
    setShowDustEffect(true);
    setDustPosition({ x: clientX, y: clientY }); // Set dust effect position based on the cursor's position

    // Calculate the number of circles to draw based on movement distance
    const nbOfCircles = Math.max(Math.abs(movementX), Math.abs(movementY)) / 10;

    // If there was a previous mouse position, draw interpolated circles between previous and current positions
    if (prevPosition.current) {
      const { x, y } = prevPosition.current; // Previous mouse position
      for (let i = 0; i < nbOfCircles; i++) {
        // Interpolate between previous and current positions to get smooth drawing
        const targetX = lerp(x, clientX, (1 / nbOfCircles) * i);
        const targetY = lerp(y, clientY, (1 / nbOfCircles) * i);
        draw(targetX, targetY, 50); // Draw circle at interpolated position
      }
    }

    // Update previous mouse position for the next movement
    prevPosition.current = {
      x: clientX,
      y: clientY,
    };
  };

  // Function to draw a circle at the given position with a specified radius
  const draw = (x: number, y: number, radius: number) => {
    if (!canvas.current) return; // Ensure canvas exists
    const ctx = canvas.current.getContext("2d"); // Get the canvas 2D context
    if (!ctx) return;

    // Set transparency for a smoother "blackboard" feel
    ctx.globalAlpha = 0.01; // Set the opacity of the drawing to 50% for a chalk-like effect

    ctx.beginPath(); // Start drawing a new path (circle)
    ctx.arc(x, y, radius, 0, 2 * Math.PI); // Create the circle
    ctx.fill(); // Fill the circle to make it visible
  };

  return (
    <div className="relative w-full h-full">
      {dimension.width === 0 && (
        // Show a black background if the dimension is invalid
        <div className="absolute w-full h-full bg-black" />
      )}

      {/* The canvas element with mouse movement handler */}
      <canvas
        ref={canvas} // Reference to the canvas
        onMouseMove={manageMouseMove} // Mouse movement handler
        height={dimension.height} // Set canvas height based on window dimension
        width={dimension.width} // Set canvas width based on window dimension
      />

      {/* Conditionally render Spline dust effect when canvas is being scraped */}
      {showDustEffect && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: dustPosition.x - 50, // Position Spline near cursor (adjust based on the effect size)
            top: dustPosition.y - 50,
            width: 100,
            height: 100,
          }}
        >
          {/* Replace with your actual Spline 3D file URL */}
          <Spline scene="https://prod.spline.design/J90gc7lGh3JqI42j/scene.splinecode" />
        </div>
      )}
    </div>
  );
}
