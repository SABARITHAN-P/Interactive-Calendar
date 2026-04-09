import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";

export default function NotesPanel({ startDate, endDate, refreshNotes }) {
  const [note, setNote] = useState("");
  const [pinned, setPinned] = useState(false);
  const [mode, setMode] = useState("date");

  const debounceRef = useRef(null);

  const isRange = startDate && endDate;
  const isSingle = startDate && !endDate;

  const displayDate =
    mode === "month"
      ? format(new Date(), "MMMM yyyy")
      : isRange
        ? `${format(startDate, "do MMM")} - ${format(endDate, "do MMM")}`
        : isSingle
          ? format(startDate, "do MMMM")
          : "No date selected";

  const getKey = () => {
    if (mode === "month") {
      return `note-month-${format(new Date(), "yyyy-MM")}`;
    }

    if (isRange) {
      return `note-${format(startDate, "yyyy-MM-dd")}_to_${format(
        endDate,
        "yyyy-MM-dd",
      )}`;
    }

    if (isSingle) {
      return `note-${format(startDate, "yyyy-MM-dd")}`;
    }

    return "note-empty";
  };

  useEffect(() => {
    const key = getKey();
    const saved = localStorage.getItem(key);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNote(parsed?.text || "");
        setPinned(parsed?.pinned || false);
      } catch {
        console.warn("Corrupted note removed:", key);
        localStorage.removeItem(key);
        setNote("");
        setPinned(false);
      }
    } else {
      setNote("");
      setPinned(false);
    }
  }, [startDate, endDate, mode]);

  const saveNote = (text, pinState = pinned) => {
    try {
      const data = JSON.stringify({
        text: text || "",
        pinned: !!pinState,
      });
      localStorage.setItem(getKey(), data);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleChange = (value) => {
    const safeValue = value ?? "";
    setNote(safeValue);

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      saveNote(safeValue);
      refreshNotes();
    }, 300);
  };

  const togglePin = () => {
    const newPin = !pinned;
    setPinned(newPin);
    saveNote(note, newPin);
    refreshNotes();
  };

  const clearNote = () => {
    const key = getKey();
    localStorage.removeItem(key);
    setNote("");
    setPinned(false);
    refreshNotes();
  };

  return (
    <div className="w-full pt-1 sm:pt-2 bg-white/80">
      {/* 🔀 MODE TOGGLE */}
      <div className="flex justify-center mb-3 sm:mb-4">
        <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 p-1 rounded-xl w-fit shadow-sm">
          <button
            onClick={() => setMode("date")}
            className={`
              px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-medium rounded-lg transition-all
              ${
                mode === "date"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            Date
          </button>

          <button
            onClick={() => setMode("month")}
            className={`
              px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-medium rounded-lg transition-all
              ${
                mode === "month"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            Month
          </button>
        </div>
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <h3 className="text-[13px] sm:text-sm font-semibold text-gray-700 tracking-tight">
          {mode === "month"
            ? "Monthly Notes"
            : isRange
              ? "Range Notes"
              : "Date Notes"}
        </h3>

        <div className="flex items-center gap-2">
          {/* PIN */}
          <button
            type="button"
            onClick={togglePin}
            className={`
              w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg transition-all
              ${
                pinned
                  ? "bg-gray-300 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }
            `}
          >
            📌
          </button>

          {/* CLEAR */}
          <button
            onClick={clearNote}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-red-400 text-white hover:bg-red-500 shadow-sm transition-all"
          >
            ✕
          </button>
        </div>
      </div>

      {/* DATE DISPLAY */}
      <p className="text-[11px] sm:text-xs text-gray-400 mb-2 sm:mb-3">
        {displayDate}
      </p>

      {/* TEXTAREA */}
      <div className="relative">
        <textarea
          value={note}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Write your notes..."
          className="
            w-full bg-transparent 
            text-[13px] sm:text-sm
            leading-[22px] sm:leading-[24px]
            resize-none outline-none px-1 sm:px-0 z-10 relative
          "
          rows="6"
        />

        {/* LINES */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-gray-300"
              style={{ height: "22px" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
