import React, { useState, useEffect, useRef } from "react";

const WINDOW_WIDTH = 380; /* w-80 */
const WINDOW_HEIGHT = 800; /* h-96 */
const buttons = [-1.0, -0.5, 0.0, 0.5, 1.0, 1.5] as const;

const formattedLabel = (value: number): string =>
  value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1);

export default function CardCounter() {
  const [total, setTotal] = useState(0);
  const [cards, setCards] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [historyStack, setHistoryStack] = useState<number[]>([]);

  useEffect(() => {
    window.navigator.vibrate?.(1);
  }, []);

  const handleClick = (value: number) => {
    window.navigator.vibrate?.(10);
    setTotal((prev) => prev + value);
    setCards((prev) => prev + 1);
    setHistory((prev) => {
      const updated = [...prev, value];
      return updated.length > 4 ? updated.slice(-4) : updated;
    });
    setHistoryStack((prev) => [...prev, value]);
  };

  const handleUndo = () => {
    const last = historyStack[historyStack.length - 1];
    if (last !== undefined) {
      window.navigator.vibrate?.(10);
      setTotal((prev) => prev - last);
      setCards((prev) => prev - 1);
      setHistory((prev) => prev.slice(0, -1));
      setHistoryStack((prev) => prev.slice(0, -1));
    }
  };

  const handleReset = () => {
    setTotal(0.0);
    setCards(0);
    setHistory([]);
    setHistoryStack([]);
  };

  const trueCount = (() => {
    const cardDecks = cards / 52;
    const denominator = 8.0 - cardDecks;
    if (denominator <= 0) return "∞";
    return (total / denominator).toFixed(2);
  })();
  const [x, setX] = useState(0); // initial horizontal position
  const [y, setY] = useState(0);
  const widthIncrements = window.innerWidth;
  const heightIncrements = window.innerHeight;
  const moveLeft = () => {
    setX((prev) => Math.max(prev - widthIncrements, 0)); // prevent going off-screen left
  };

  const moveRight = () =>
    setX((prev) =>
      Math.min(prev + widthIncrements, window.innerWidth - WINDOW_WIDTH)
    ); // prevent going off-screen right

  const moveUp = () => setY((prev) => Math.max(prev - heightIncrements, 0));
  const moveDown = () =>
    setY((prev) =>
      Math.min(prev + heightIncrements, window.innerHeight - WINDOW_HEIGHT)
    );
  return (
    <div
      id="interactive-zone"
      className="absolute w-80 h-96 text-black flex flex-col gap-2 top-10 left-5"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        transition: "transform 0.3s ease",
      }}>
      <div className="flex w-full gap-2 text-sm">
        <div className="  bg-white/40 w-full px-4 py-2 rounded items-center flex-col justify-center flex text-center">
          <button onClick={moveUp}>⬆️</button>
          <div className="flex">
            <button onClick={moveLeft}>⬅️</button>
            <button onClick={moveRight}>➡️</button>
          </div>
          <button onClick={moveDown}> ⬇️</button>
        </div>

        <div className=" bg-white/40 w-full flex flex-col justify-center items-center px-4 py-2 rounded text-center">
          <div>Cards/Decks</div>
          <div className="font-bold">{(cards / 52).toFixed(2)}</div>
        </div>
      </div>
      <div className="flex bg-white/40 rounded-lg flex-col p-6 ">
        <div className="text-center mb-6 space-y-2">
          <h1 className="text-4xl font-bold">Total: {total.toFixed(1)}</h1>
          <h2 className="text-2xl font-bold">Cards: {cards}</h2>
          <h3 className="text-lg font-bold">True Count: {trueCount}</h3>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 px-4">
          {buttons.map((value) => (
            <button
              key={value}
              onClick={() => handleClick(value)}
              className="bg-[#C1CCCA] font-bold text-lg py-2 px-4 rounded">
              {formattedLabel(value)}
            </button>
          ))}
        </div>

        <div className="space-y-4 px-4">
          <button
            onClick={handleReset}
            className="w-full bg-[#D3CBC7] font-bold py-2 rounded">
            Reset
          </button>
          <button
            onClick={handleUndo}
            className="w-full bg-[#E76219] font-bold py-2 rounded">
            Undo
          </button>
        </div>
      </div>
      <div
        className={`text-sm ${history.length && "bg-white/40"} px-4 py-2 rounded space-y-1`}>
        {history.length > 0 && <div className="font-bold">Last 4:</div>}
        {history
          .slice()
          .reverse()
          .map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`size-2 rounded-full ${!index && "bg-[#E76219]"}`}
              />
              <span className={!index ? "font-bold" : ""}>
                {formattedLabel(entry)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
