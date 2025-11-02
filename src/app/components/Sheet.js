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

function Staff({ label, start, end, focus, pickedNotes, onNoteToggle, onClear, clef }) {
  const keys = useMemo(() => generateRange(start, end), [start, end]);
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


  return (
    <div className="w-full h-full min-h-0 flex flex-col">
            <div className="mb-3 flex items-center justify-between">
        <div className="text-xs text-zinc-500">{label}</div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-600 dark:text-zinc-400">
            {pickedNotes.length > 0 ? `${pickedNotes.length} notes` : "Tap a line"}
          </span>
          {pickedNotes.length > 0 && (
            <button
              onClick={onClear}
              className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 min-h-0 w-full overflow-y-auto rounded-md border border-zinc-200 bg-white dark:border-zinc-800"
      >
        <div className="relative">
          {[...keys].reverse().map((k) => {
            const isPicked = pickedNotes.find((p) => p.midi === k.midi);
            const isStaffLine = (
              clef === "treble"
                ? ["E4", "G4", "B4", "D5", "F5"]
                : ["G2", "B2", "D3", "F3", "A3"]
            ).includes(`${k.name}${k.octave}`);
            return (
              <button
                key={k.midi}
                type="button"
                data-row={k.midi}
                aria-label={`${k.name}${k.octave}`}
                onClick={() => onNoteToggle(k)}
                className="group relative block h-[0.8rem] w-full select-none text-left focus:outline-none"
              >
                <div className="absolute inset-0 left-16 rounded-sm transition-colors group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900" />

                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                  <div
                    className={
                      (isStaffLine ? "border-t-2 " : "border-t ") +
                      (isStaffLine
                        ? "border-zinc-400 dark:border-zinc-600"
                        : "border-zinc-200 dark:border-zinc-800")
                    }
                  />
                </div>

                {isPicked && (
                  <div className="absolute inset-y-0 left-16 flex items-center justify-center w-[calc(100%-4rem)]">
                    <div
                      className={
                        `rounded-full ${clef === "bass" ? "bg-red-500" : "bg-blue-500"} h-[1.5rem] w-[1.5rem]`
                      }
                    />
                  </div>
                )}

                <div className="absolute left-0 top-0 flex h-full w-16 items-center justify-end pr-2">
                  <span
                    className={
                      "text-[10px] tabular-nums " +
                      (isPicked
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

export default function Sheet({ onHighlightsChange, onActiveClefChange }) {
  const [bassNotes, setBassNotes] = useState([]);
  const [trebleNotes, setTrebleNotes] = useState([]);

  const handleNoteToggle = (note, staff) => {
    const [notes, setNotes] = staff === "bass" ? [bassNotes, setBassNotes] : [trebleNotes, setTrebleNotes];
    if (notes.find((p) => p.midi === note.midi)) {
      setNotes(notes.filter((p) => p.midi !== note.midi));
    } else {
      setNotes([...notes, note]);
    }
    onActiveClefChange?.(staff);
  };

  useEffect(() => {
    const highlights = {};
    for (const n of bassNotes) highlights[n.midi] = "red";
    for (const n of trebleNotes) highlights[n.midi] = "blue";
    onHighlightsChange?.(highlights);
  }, [bassNotes, trebleNotes, onHighlightsChange]);

  return (
    <div className="w-full h-full min-h-0">
      <div className="grid h-full min-h-0 grid-cols-1 grid-rows-2 auto-rows-fr gap-6 md:grid-cols-2 md:grid-rows-1">
        <Staff
          label="Bass (A0–B3)"
          clef="bass"
          start={21}
          end={59}
          focus={36}
          pickedNotes={bassNotes}
          onNoteToggle={(note) => handleNoteToggle(note, "bass")}
          onClear={() => setBassNotes([])}
        />
        <Staff
          label="Treble (C4–C8)"
          clef="treble"
          start={60}
          end={108}
          focus={72}
          pickedNotes={trebleNotes}
          onNoteToggle={(note) => handleNoteToggle(note, "treble")}
          onClear={() => setTrebleNotes([])}
        />
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
        <div className="h-2 w-4 border-t-2 border-zinc-400 dark:border-zinc-600" />
        <span>Octave start (C)</span>
      </div>
    </div>
  );
}
