import { useEffect, useState } from "react";

// Define an interface for the dimensions
interface Dimension {
  width: number;
  height: number;
}

export default function useWindow() {
  // Provide an initial type-safe state
  const [dimension, setDimension] = useState<Dimension>({
    width: 0,
    height: 0,
  });

  // Function to update the window dimensions
  const resize = () => {
    setDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    // Set initial dimensions
    resize();

    // Add event listener to handle window resize
    window.addEventListener("resize", resize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Return the dimension object
  return dimension;
}
