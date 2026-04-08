import { format, isSameDay, isToday, isWithinInterval } from "date-fns";
import { useRef } from "react";

function lightenColor(rgbString, factor = 0.4) {
  const values = rgbString.match(/\d+/g).map(Number);
  const lighter = values.map((c) =>
    Math.min(255, Math.floor(c + (255 - c) * factor)),
  );
  return `rgb(${lighter[0]}, ${lighter[1]}, ${lighter[2]})`;
}

export default function DayCell({
  day,
  currentDate,
  startDate,
  endDate,
  hoverDate,
  setHoverDate,
  onClick,
  onDoubleClick,
  isRangeMode,
  themeColor,
  notesMap,
}) {
  const pressTimer = useRef(null);

  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
  const isWeekend = day.getDay() === 0 || day.getDay() === 6;

  const isStart = startDate && isSameDay(day, startDate);
  const isEnd = endDate && isSameDay(day, endDate);

  const isInRange =
    startDate &&
    endDate &&
    isWithinInterval(day, { start: startDate, end: endDate });

  const isPreview =
    isRangeMode &&
    startDate &&
    !endDate &&
    hoverDate &&
    isWithinInterval(day, {
      start: startDate < hoverDate ? startDate : hoverDate,
      end: startDate < hoverDate ? hoverDate : startDate,
    });

  const isTodayDate = isToday(day);

  const key = `note-${format(day, "yyyy-MM-dd")}`;
  const noteData = notesMap?.[key];

  const hasNote = noteData && noteData.text;
  const isPinned = noteData && noteData.pinned;

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(day);
  };

  // DESKTOP DOUBLE CLICK
  const handleDoubleClick = (e) => {
    e.stopPropagation();
    onDoubleClick(day);
  };

  // MOBILE LONG PRESS (replaces double click)
  const handleTouchStart = () => {
    pressTimer.current = setTimeout(() => {
      onDoubleClick(day); 
    }, 400); 
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer.current);
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`
        relative flex items-center justify-center
        text-base min-h-[48px]   /* ✅ bigger touch area */
        cursor-pointer select-none
        transition-all duration-200 ease-out
        ${!isCurrentMonth ? "text-gray-200" : "text-gray-900"}
      `}
      style={
        isWeekend
          ? {
              color: lightenColor(themeColor.main, 0.3),
              fontWeight: 500,
            }
          : {}
      }
    >
      {/* RANGE */}
      {(isInRange || isPreview) && (
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 h-[70%] z-0
            ${isStart ? "left-1/2 right-0 rounded-r-full" : ""}
            ${isEnd ? "left-0 right-1/2 rounded-l-full" : ""}
            ${!isStart && !isEnd ? "left-0 right-0" : ""}
          `}
          style={{
            backgroundColor: themeColor.main,
            opacity: 0.3,
          }}
        />
      )}

      {/* START / END */}
      {(isStart || isEnd) && (
        <div
          className="absolute w-10 h-10 rounded-full z-20" // ✅ slightly bigger
          style={{ backgroundColor: themeColor.main }}
        />
      )}

      {/* TODAY */}
      {isTodayDate && !isStart && !isEnd && (
        <div
          className="absolute w-10 h-10 rounded-full border-2"
          style={{ borderColor: themeColor.dark }}
        />
      )}

      {/* DAY */}
      <span
        className={`relative z-20 ${
          isStart || isEnd ? "text-white font-semibold scale-105" : ""
        }`}
      >
        {format(day, "d")}
      </span>

      {/*NOTE DOT */}
      {hasNote && (
        <div
          className="absolute bottom-1.5 w-2 h-2 rounded-full z-30"
          style={{
            backgroundColor: isPinned ? "#f9a82e" : "#d1d5db",
          }}
        />
      )}
    </div>
  );
}
