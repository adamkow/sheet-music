"use client";

import { useMemo, useState } from "react";

function midiToNote(midi) {
  const NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const name = NAMES[(midi - 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return { name, octave, isSharp: name.includes("#") };
}

function buildKeyboard() {
  const whites = [];
  const blacks = [];
  let whiteIndex = 0;
  for (let midi = 21; midi <= 108; midi++) {
    const k = { midi, ...midiToNote(midi) };
    if (k.isSharp) {
      // place between previous white and next white
      blacks.push({ ...k, leftSlot: Math.max(0, whiteIndex - 1) });
    } else {
      whites.push({ ...k, whiteIndex });
      whiteIndex++;
    }
  }
  return { whites, blacks, whiteCount: whites.length };
}

export default function Piano({ onKey }) {
  const { whites, blacks, whiteCount } = useMemo(() => buildKeyboard(), []);
  const [pressed, setPressed] = useState(null);

  const onWhiteClick = (k) => {
    setPressed(k);
    onKey?.(k);
  };
  const onBlackClick = (k) => {
    setPressed(k);
    onKey?.(k);
  };

  return (
    <div className="relative h-[25vh] w-[90vw] mx-auto select-none">
      <div className="mb-2 text-xs text-zinc-600">Piano (A0–C8)</div>

      <div className="relative h-[calc(100%-0.75rem)] w-full">
        {/* Whites */}
        <div className="relative flex h-full w-full">
          {whites.map((k) => {
            const isPressed = pressed?.midi === k.midi;
            return (
              <button
                key={k.midi}
                type="button"
                aria-label={`${k.name}${k.octave}`}
                onClick={() => onWhiteClick(k)}
                className={
                  "relative flex-1 border border-zinc-300 bg-white transition-colors focus:outline-none " +
                  (isPressed ? "bg-blue-50" : "hover:bg-zinc-50")
                }
              >
                <span className="pointer-events-none absolute bottom-1 right-1 text-[10px] text-zinc-400">
                  {k.name}
                  {k.octave}
                </span>
              </button>
            );
          })}
        </div>

        {/* Blacks overlay */}
        <div className="pointer-events-none absolute inset-0">
          {blacks.map((k) => {
            // Position black key centered between its surrounding white keys
            const leftPercent = ((k.leftSlot + 0.5) / whiteCount) * 100;
            const isPressed = pressed?.midi === k.midi;
            const widthPercent = (0.6 / whiteCount) * 100; // 60% of a white key width
            return (
              <button
                key={k.midi}
                type="button"
                aria-label={`${k.name}${k.octave}`}
                onClick={() => onBlackClick(k)}
                className={
                  "pointer-events-auto absolute -translate-x-1/2 rounded-b-md border border-zinc-800 transition-colors focus:outline-none " +
                  (isPressed ? "bg-zinc-700" : "bg-black hover:bg-zinc-800")
                }
                style={{
                  left: `${leftPercent}%`,
                  top: 0,
                  width: `${widthPercent}%`,
                  height: "60%",
                  zIndex: 10,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
