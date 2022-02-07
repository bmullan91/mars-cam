import { useEffect } from "react";
import Emoji from "a11y-react-emoji";

interface Props {
  jumpToStart: () => void;
  prevSlide: () => void;
  togglePause: () => void;
  nextSlide: () => void;
  jumpToEnd: () => void;
  setSpeed: (speed: number) => void;
  speed: number;
  isPaused: boolean;
}

export default function SlideshowControls(props: Props) {
  const {
    jumpToStart,
    prevSlide,
    togglePause,
    nextSlide,
    jumpToEnd,
    setSpeed,
    speed,
    isPaused,
  } = props;

  useEffect(() => {
    function arrowKeyListener(this: Document, event: KeyboardEvent) {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }

      switch (event.key) {
        case "ArrowLeft":
          prevSlide();
          break;
        case "ArrowRight":
          nextSlide();
          break;
        default:
          break;
      }
    }

    document.addEventListener("keydown", arrowKeyListener);

    return () => document.removeEventListener("keydown", arrowKeyListener);
  }, [prevSlide, nextSlide]);

  return (
    <div className="slideshow-btns">
      <button
        className="slideshow-btn"
        onClick={jumpToStart}
        arial-label="First slide"
      >
        <Emoji symbol="⏮" label="First slide" />
      </button>
      <button
        className="slideshow-btn"
        onClick={prevSlide}
        title="Previous slide"
      >
        <Emoji symbol="⬅️" label="Previous slide" />
      </button>

      <button
        onClick={togglePause}
        className="slideshow-btn"
        title={isPaused ? "Resume" : "Pause"}
      >
        {isPaused ? (
          <Emoji symbol="▶️" label="Play" />
        ) : (
          <Emoji symbol="⏸️" label="Pause" />
        )}
      </button>

      <button className="slideshow-btn" onClick={nextSlide} title="Next slide">
        <Emoji symbol="➡️" label="Next slide" />
      </button>
      <button className="slideshow-btn" onClick={jumpToEnd} title="Last slide">
        <Emoji symbol="⏭" label="Last slide" />
      </button>
      <label className="speed-slider">
        {speed / 1000} sec
        <input
          title="Slideshow speed"
          type="range"
          min="1000"
          max="10000"
          step="1000"
          value={speed}
          onChange={(e) => setSpeed(parseInt(e.target.value))}
        />
      </label>
    </div>
  );
}
