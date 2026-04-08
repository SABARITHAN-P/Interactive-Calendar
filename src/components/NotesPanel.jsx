import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";

export default function NotesPanel({ startDate, endDate, refreshNotes }) {
  const [note, setNote] = useState("");
  const [pinned, setPinned] = useState(false);

  const debounceRef = useRef(null);

  const isRange = startDate && endDate;
  const isSingle = startDate && !endDate;

  const displayDate = isRange
    ? `${format(startDate, "do MMM")} - ${format(endDate, "do MMM")}`
    : isSingle
      ? format(startDate, "do MMMM")
      : format(new Date(), "MMMM yyyy");

  const getKey = () => {
    if (isRange) {
      return `note-${format(startDate, "yyyy-MM-dd")}_to_${format(endDate, "yyyy-MM-dd")}`;
    }
    if (isSingle) {
      return `note-${format(startDate, "yyyy-MM-dd")}`;
    }
    return `note-month-${format(new Date(), "yyyy-MM")}`;
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
  }, [startDate, endDate]);

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

  return (
    <div className="w-full pt-2">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm md:text-xs font-medium text-gray-600">Notes</h3>

        <button
          type="button"
          onClick={togglePin}
          className={`text-sm md:text-xs px-3 py-1 rounded-md transition active:scale-95 ${
            pinned ? "bg-yellow-400 text-white" : "bg-gray-200"
          }`}
        >
          📌
        </button>
      </div>

      {/* DATE */}
      <p className="text-xs md:text-[10px] text-gray-400 mb-3">{displayDate}</p>

      {/* TEXTAREA */}
      <div className="relative">
        <textarea
          value={note}
          onChange={(e) => handleChange(e.target.value)}
          className="
            w-full bg-transparent 
            text-sm md:text-xs 
            leading-[24px] md:leading-[22px]
            resize-none outline-none px-0 z-10 relative
          "
          rows="6"
        />

        {/* LINES */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-gray-300"
              style={{ height: "24px" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
