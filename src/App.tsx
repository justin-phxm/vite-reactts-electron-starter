import React from "react";

import CardCounter from "./components/CardCounter";

function App() {
  return (
    <div className="min-h-screen  flex flex-col ">
      <div className="flex flex-1 h-full flex-col items-center justify-center">
        <CardCounter />
      </div>
    </div>
  );
}

export default App;
