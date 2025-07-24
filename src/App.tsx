import React, { useEffect } from "react";

import CardCounter from "./components/CardCounter";

function App() {
  useEffect(() => {
    window.Main.removeLoading();
    const interactive = document.getElementById("interactive-zone");
    interactive?.addEventListener("mouseenter", () => {
      window.electronAPI.setMouseIgnore(false); // enable clicks
    });

    interactive?.addEventListener("mouseleave", () => {
      window.electronAPI.setMouseIgnore(true); // disable clicks again
    });
  }, []);

  return (
    <div className="min-h-screen  flex flex-col ">
      <div className="flex flex-1 h-full flex-col items-center justify-center">
        <CardCounter />
      </div>
    </div>
  );
}

export default App;
