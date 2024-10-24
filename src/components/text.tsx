import React, { useState, useEffect } from "react";

const Text: React.FC = () => {
  // State to control visibility
  const [visible, setVisible] = useState(false);

  // useEffect to change visibility after a delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(true); // Show text after 2 seconds
    }, 800);

    return () => clearTimeout(timeout); // Cleanup timeout on unmount
  }, []);

  return (
    <div
      // Apply class to hide the text if not visible
      className={`absolute flex flex-col text-[7vw] uppercase w-[80vw] font-custom text-slate-100 items-center leading-tight transition-opacity duration-1000 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <p className="font-bold">Chalk N Slate</p>
      <p className="text-center text-[3vw]">Coming Soon...</p>
    </div>
  );
};

export default Text;
