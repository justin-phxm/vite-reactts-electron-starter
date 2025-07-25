import React from "react";

export default function useInteractive() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const interactive = ref.current;

    const enableClicks = () => window.electronAPI.setMouseIgnore(false);
    const disableClicks = () => window.electronAPI.setMouseIgnore(true);

    interactive.addEventListener("mouseenter", enableClicks);
    interactive.addEventListener("mouseleave", disableClicks);

    return () => {
      interactive.removeEventListener("mouseenter", enableClicks);
      interactive.removeEventListener("mouseleave", disableClicks);
    };
  }, []);

  return ref;
}
