"use client";

import { useState } from "react";
import Sheet from "./components/Sheet";
import Piano from "./components/Piano";

export default function Home() {
  const [sheetHighlights, setSheetHighlights] = useState({});
  const [clickHighlights, setClickHighlights] = useState({});
  const [highlights, setHighlights] = useState({});
  const [activeClef, setActiveClef] = useState("treble");

  const handleSheetHighlights = (map) => {
    setSheetHighlights(map);
    setHighlights({ ...map, ...clickHighlights });
  };

  const handlePianoKey = (k) => {
    const color = activeClef === "bass" ? "red" : "blue";
    const next = { ...clickHighlights, [k.midi]: color };
    setClickHighlights(next);
    setHighlights({ ...sheetHighlights, ...next });
  };
  return (
    <div className="min-h-screen w-full bg-white font-sans">
      <main className="min-h-screen w-full bg-white">
        <section className="w-full h-[50vh] overflow-hidden">
          <div className="mx-auto h-full w-full max-w-5xl px-4">
            <Sheet onHighlightsChange={handleSheetHighlights} onActiveClefChange={setActiveClef} />
          </div>
        </section>
        <section className="w-full h-[50vh] flex justify-center items-center">
          <Piano highlights={highlights} onKey={handlePianoKey} />
        </section>
      </main>
    </div>
  );
}
