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
  return (
    <div className="slideshow-btns">
      <button
        className="slideshow-btn"
        onClick={jumpToStart}
        arial-label="Jump to start"
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
        arial-label={isPaused ? "Resume" : "Pause"}
        title={isPaused ? "Resume" : "Pause"}
      >
        {isPaused ? (
          <Emoji symbol="▶️" label="play" />
        ) : (
          <Emoji symbol="⏸️" label="pause" />
        )}
      </button>

      <button className="slideshow-btn" onClick={nextSlide} title="Next slide">
        <Emoji symbol="➡️" label="Next slide" />
      </button>
      <button className="slideshow-btn" onClick={jumpToEnd} title="Last slide">
        <Emoji symbol="⏭" label="Last slide" />
      </button>
      <label className="speed-slider" style={{ fontSize: 16 }}>
        {speed / 1000} sec
        <input
          title="speed"
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
