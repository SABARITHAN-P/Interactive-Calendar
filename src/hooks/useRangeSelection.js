// hooks/useRangeSelection.js

import { useState } from "react";

export default function useRangeSelection() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null); // for preview

  const selectDate = (date) => {
    // First click OR reset after full selection
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      // Second click → define range
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  return {
    startDate,
    endDate,
    hoverDate,
    setHoverDate,
    selectDate,
  };
}
