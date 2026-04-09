import DayCell from "./DayCell";
import { DAYS } from "../constants/days";
import { memo } from "react";

function CalendarGrid({
  days,
  currentDate,
  startDate,
  endDate,
  hoverDate,
  setHoverDate,
  onDateClick,
  onDateDoubleClick,
  isRangeMode,
  themeColor,
  notesMap,
}) {
  return (
    <div className="w-full">
      {/*  WEEKDAYS */}
      <div className="grid grid-cols-7 text-center mb-2 sm:mb-1">
        {DAYS.map((day, index) => (
          <div
            key={index}
            className="text-[12px] sm:text-[10px] font-medium tracking-[0.05em] sm:tracking-[0.06em]"
            style={
              index >= 5 ? { color: themeColor.dark } : { color: "#6b7280" }
            }
          >
            {day}
          </div>
        ))}
      </div>

      {/* DAYS GRID */}
      <div className="grid grid-cols-7 gap-y-2 sm:gap-y-[2px] text-center">
        {days.map((day) => (
          <div key={day.toISOString()} className="flex justify-center">
            <DayCell
              day={day}
              currentDate={currentDate}
              startDate={startDate}
              endDate={endDate}
              hoverDate={hoverDate}
              setHoverDate={setHoverDate}
              onClick={onDateClick}
              onDoubleClick={onDateDoubleClick}
              isRangeMode={isRangeMode}
              themeColor={themeColor}
              notesMap={notesMap}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(CalendarGrid);
