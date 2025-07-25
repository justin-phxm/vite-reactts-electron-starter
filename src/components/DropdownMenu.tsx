import { Button } from "@/components/ui/button";
import React, { useRef } from "react";

export default function DropdownMenuDemo() {
  const ref = useRef<HTMLDetailsElement>(null);
  const handleClick = () => ref.current?.click();
  const handleQuit = () => window.Main.Close();
  return (
    <>
      <Button variant="outline" onClick={handleClick}>
        ⚙️
      </Button>
      <details>
        <summary className="list-none" ref={ref}></summary>
        <Button onClick={handleQuit}>Quit ❌</Button>
      </details>
    </>
  );
}
