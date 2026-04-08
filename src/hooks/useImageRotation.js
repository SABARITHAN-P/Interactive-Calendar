import { useState, useEffect, useRef } from "react";
import { shuffleArray } from "../utils/shuffle";

export default function useImageRotation(images, trigger) {
  const [queue, setQueue] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);

  const lastImageRef = useRef(null); // ✅ track last image

  useEffect(() => {
    let newQueue = [...queue];

    // 🔁 If queue empty → reshuffle
    if (newQueue.length === 0) {
      newQueue = shuffleArray(images);

      // 🚫 prevent same image as last cycle
      if (lastImageRef.current && newQueue[0] === lastImageRef.current) {
        // swap first and last
        [newQueue[0], newQueue[newQueue.length - 1]] = [
          newQueue[newQueue.length - 1],
          newQueue[0],
        ];
      }
    }

    const nextImage = newQueue[0];

    setCurrentImage(nextImage);
    lastImageRef.current = nextImage; // ✅ update last used

    setQueue(newQueue.slice(1));
  }, [trigger]);

  return currentImage;
}
