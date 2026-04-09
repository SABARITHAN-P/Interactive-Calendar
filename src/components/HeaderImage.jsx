import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

const colorCache = {};

function enhanceColor([r, g, b]) {
  const factor = 1.4;
  return [
    Math.min(255, r * factor),
    Math.min(255, g * factor),
    Math.min(255, b * factor),
  ];
}

function darkenColor([r, g, b]) {
  const factor = 0.6;
  return [
    Math.floor(r * factor),
    Math.floor(g * factor),
    Math.floor(b * factor),
  ];
}

function getBrightness([r, g, b]) {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

export default function HeaderImage({ currentDate, image, setThemeColor }) {
  const imgRef = useRef();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if (colorCache[image]) {
      setThemeColor(colorCache[image]);
      return;
    }

    const handleLoad = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.drawImage(img, 0, 0);

        const data = ctx.getImageData(
          canvas.width * 0.3,
          canvas.height * 0.3,
          canvas.width * 0.4,
          canvas.height * 0.4,
        ).data;

        let r = 0,
          g = 0,
          b = 0,
          count = 0;

        for (let i = 0; i < data.length; i += 40) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        let color = enhanceColor([r, g, b]);
        const brightness = getBrightness(color);

        if (brightness > 170) color = color.map((c) => c * 0.6);
        if (brightness < 80) color = color.map((c) => Math.min(255, c * 1.3));

        const dark = darkenColor(color);

        const theme = {
          main: `rgb(${Math.floor(color[0])}, ${Math.floor(color[1])}, ${Math.floor(color[2])})`,
          dark: `rgb(${dark[0]}, ${dark[1]}, ${dark[2]})`,
        };

        colorCache[image] = theme;
        setThemeColor(theme);
      } catch {
        const fallback = {
          main: "#3b82f6",
          dark: "#1e40af",
        };
        colorCache[image] = fallback;
        setThemeColor(fallback);
      }
    };

    if (img.complete && img.naturalWidth !== 0) {
      handleLoad();
    } else {
      img.addEventListener("load", handleLoad);
      return () => img.removeEventListener("load", handleLoad);
    }
  }, [image, setThemeColor]);

  if (!image) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-t-2xl">
      {/* IMAGE */}
      <div className="relative w-full h-[140px] sm:h-[200px] md:h-[280px] overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        <img
  ref={imgRef}
  src={image}
  alt="calendar"
  onLoad={() => setLoaded(true)}
  className={`w-full h-full object-cover ${
    loaded ? "opacity-100" : "opacity-0"
  }`}
  style={{ objectPosition: "50% 20%", willChange: "auto" }}
  draggable={false}
/>
      </div>

      {/* CURVE */}
      <svg viewBox="0 0 1440 100" className="absolute bottom-0 left-0 w-full">
        <path
          fill="#ffffff"
          d="M0,60 C250,110 450,30 700,60 C950,90 1150,40 1440,60 L1440,120 L0,120 Z"
        />
      </svg>

      {/* TEXT */}
      <div className="absolute right-[6%] bottom-[18%] text-white text-right">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-none">
          {format(currentDate, "yyyy")}
        </h2>

        <p className="text-xs sm:text-sm tracking-[0.2em] font-medium mt-1">
          {format(currentDate, "MMMM").toUpperCase()}
        </p>
      </div>
    </div>
  );
}
