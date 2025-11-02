"use client";

import { useMemo, useState, useRef, useEffect } from "react";

function midiToNote(midi) {
  const NAMES = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const name = NAMES[(midi - 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return { name, octave, isSharp: name.includes("#") };
}

function generateRange(startMidi, endMidi) {
  const out = [];
  for (let midi = startMidi; midi <= endMidi; midi++) {
    const { name, octave, isSharp } = midiToNote(midi);
    out.push({ midi, name, octave, isSharp });
  }
  return out;
}

function Staff({ label, start, end, focus, onSelect }) {
  const keys = useMemo(() => generateRange(start, end), [start, end]);
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const focusInRange = Math.max(start, Math.min(end, focus));
    const row = containerRef.current.querySelector(
      `[data-row="${focusInRange}"]`
    );
    if (row) {
      containerRef.current.scrollTo({
        top:
          row.offsetTop -
          containerRef.current.clientHeight / 2 +
          row.clientHeight / 2,
        behavior: "auto",
      });
    }
  }, [start, end, focus]);

  const handleClick = (k) => {
    setSelected(k);
    if (onSelect) onSelect(k);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs text-zinc-500">{label}</div>
        <div className="text-xs text-zinc-600 dark:text-zinc-400">
          {selected ? `${selected.name}${selected.octave}` : "Tap a line"}
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 w-full overflow-y-auto rounded-md border border-zinc-200 bg-white dark:border-zinc-800"
      >
        <div className="relative">
          {keys.map((k) => {
            const isSelected = selected?.midi === k.midi;
            const isOctaveStart = k.name === "C";
            return (
              <button
                key={k.midi}
                type="button"
                data-row={k.midi}
                aria-label={`${k.name}${k.octave}`}
                onClick={() => handleClick(k)}
                className={
                  "group relative block w-full select-none text-left " +
                  "h-8 focus:outline-none"
                }
              >
                <div
                  className={
                    "absolute inset-0 left-16 rounded-sm transition-colors " +
                    (isSelected
                      ? "bg-blue-50/80 dark:bg-blue-950/40"
                      : "group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900")
                  }
                />

                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                  <div
                    className={
                      "border-t " +
                      (isSelected
                        ? "border-blue-500"
                        : isOctaveStart
                        ? "border-zinc-400 dark:border-zinc-600"
                        : "border-zinc-200 dark:border-zinc-800")
                    }
                  />
                </div>

                <div className="absolute left-0 top-0 flex h-full w-16 items-center justify-end pr-2">
                  <span
                    className={
                      "text-[10px] tabular-nums " +
                      (isSelected
                        ? "font-semibold text-blue-600 dark:text-blue-400"
                        : k.isSharp
                        ? "text-zinc-500"
                        : "text-zinc-700 dark:text-zinc-300")
                    }
                  >
                    {k.name}
                    {k.octave}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Sheet({ onSelect }) {
  return (
    <div className="w-full h-full">
      <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-2">
        <Staff
          label="Bass (A0–B3)"
          start={21}
          end={59}
          focus={36}
          onSelect={onSelect}
        />
        <Staff
          label="Treble (C4–C8)"
          start={60}
          end={108}
          focus={72}
          onSelect={onSelect}
        />
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
        <div className="h-2 w-4 border-t-2 border-zinc-400 dark:border-zinc-600" />
        <span>Octave start (C)</span>
        <div className="h-2 w-4 border-t-2 border-blue-500" />
        <span>Selected</span>
      </div>
    </div>
  );
}
