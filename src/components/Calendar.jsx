import { useState, useEffect, useRef } from "react";
import { addMonths, subMonths } from "date-fns";
import { getCalendarDays } from "../utils/calendarUtils";
import CalendarGrid from "./CalendarGrid";

export default function Calendar({
  setSelectedRange,
  setCurrentDateGlobal,
  themeColor,
  setDirection,
  currentDate,
  notesMap,
}) {
  const days = getCalendarDays(currentDate);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [isRangeMode, setIsRangeMode] = useState(false);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const diff = touchStartX.current - touchEndX.current;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  const handleDateClick = (date) => {
    if (!isRangeMode) {
      setStartDate(date);
      setEndDate(null);
      return;
    }

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      setIsRangeMode(false);
    }
  };

  const handleDateDoubleClick = (date) => {
    setIsRangeMode(true);
    setStartDate(date);
    setEndDate(null);
  };

  const handleNext = () => {
    setDirection?.(1);
    setCurrentDateGlobal(addMonths(currentDate, 1));
  };

  const handlePrev = () => {
    setDirection?.(-1);
    setCurrentDateGlobal(subMonths(currentDate, 1));
  };

  useEffect(() => {
    setSelectedRange?.({ startDate, endDate });
  }, [startDate, endDate]);

  return (
    <div
      className="w-full pt-1 sm:pt-2"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3 px-1">
        {/* LABEL */}
        <span className="text-[11px] sm:text-xs text-gray-400 hidden sm:block">
          Swipe or use arrows
        </span>

        {/* NAV BUTTONS */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-9 h-9 sm:w-auto sm:h-auto flex items-center justify-center rounded-lg transition active:scale-90"
            style={{ color: themeColor.dark }}
          >
            ←
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="w-9 h-9 sm:w-auto sm:h-auto flex items-center justify-center rounded-lg transition active:scale-90"
            style={{ color: themeColor.dark }}
          >
            →
          </button>
        </div>
      </div>

      {/* GRID */}
      <CalendarGrid
        days={days}
        currentDate={currentDate}
        startDate={startDate}
        endDate={endDate}
        hoverDate={hoverDate}
        setHoverDate={setHoverDate}
        onDateClick={handleDateClick}
        onDateDoubleClick={handleDateDoubleClick}
        isRangeMode={isRangeMode}
        themeColor={themeColor}
        notesMap={notesMap}
      />
    </div>
  );
}
