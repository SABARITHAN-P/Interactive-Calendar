import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "./components/Calendar";
import NotesPanel from "./components/NotesPanel";
import HeaderImage from "./components/HeaderImage";
import images from "./data/images";
import useImageRotation from "./hooks/useImageRotation";

function App() {
  const [selectedRange, setSelectedRange] = useState({
    startDate: null,
    endDate: null,
  });

  const [themeColor, setThemeColor] = useState({
    main: "#3b82f6",
    dark: "#1e40af",
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState(1);

  const [notesMap, setNotesMap] = useState({});

  const currentImage = useImageRotation(images, currentDate.getMonth());

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const loadNotes = () => {
    const allNotes = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith("note-")) {
        try {
          const raw = localStorage.getItem(key);
          if (!raw || raw === "undefined") continue;

          const data = JSON.parse(raw);
          allNotes[key] = data;
        } catch (err) {
          console.warn("Invalid JSON found, removing:", key);
          localStorage.removeItem(key);
        }
      }
    }

    setNotesMap(allNotes);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const refreshNotes = () => {
    loadNotes();
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-3 sm:px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 opacity-40"
        style={{
          backgroundImage: `url(${currentImage})`,
        }}
      />

      <div className="absolute inset-0 bg-black/10" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentDate.getMonth()}
          initial={{
            x: direction === 1 ? 300 : -300,
            opacity: 0,
            scale: 0.92,
          }}
          animate={{
            x: 0,
            opacity: 1,
            scale: 1,
          }}
          exit={{
            x: direction === 1 ? -300 : 300,
            opacity: 0,
            scale: 0.92,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
          }}
          className="w-full max-w-[460px] md:max-w-[520px] relative"
        >
          {/* BACK CARD */}
          <div className="absolute inset-0 scale-[0.95] translate-y-4 bg-black/10 blur-xl rounded-2xl" />

          {/* MAIN CARD */}
          <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.2)] bg-white">
            {/* HEADER IMAGE */}
            <HeaderImage
              currentDate={currentDate}
              image={currentImage}
              setThemeColor={setThemeColor}
            />

            {/* CONTENT */}
            <div className="px-3 sm:px-4 md:px-5 pb-4 sm:pb-5 pt-3 sm:pt-4 -mt-5 sm:-mt-6">
              {/* 🔥 RESPONSIVE LAYOUT */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-stretch">
                {/* NOTES */}
                <div className="w-full md:w-[42%]">
                  <NotesPanel
                    startDate={selectedRange.startDate}
                    endDate={selectedRange.endDate}
                    refreshNotes={refreshNotes}
                  />
                </div>

                {/* CALENDAR */}
                <div className="w-full md:w-[58%]">
                  <Calendar
                    setSelectedRange={setSelectedRange}
                    setCurrentDateGlobal={setCurrentDate}
                    themeColor={themeColor}
                    setDirection={setDirection}
                    currentDate={currentDate}
                    notesMap={notesMap}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
