import React, { useEffect, useRef } from 'react';
import './CatClawAnimation.css';

export default function CatClawAnimation({ visible, soundName }) {
  const audioRef = useRef(null);
  useEffect(() => {
    if (visible) {
      let audioPath = '/cat-meow.mp3';
      if (soundName) {
        audioPath = `/asset/${soundName}`;
      }
      const audio = new Audio(audioPath);
      audioRef.current = audio;
      audio.play();
      // Arrêter le son après 4000ms (durée du toast)
      const stopTimeout = setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 4000);
      return () => {
        clearTimeout(stopTimeout);
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [visible, soundName]);

  if (!visible) return null;

  return (
    <div className="cat-claw-overlay">
      <div className="cat-claw"></div>
    </div>
  );
}
