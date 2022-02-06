import Emoji from "a11y-react-emoji";
import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "remix";
import { RoverImage } from "~/api";
import SlideshowImg from "./SlideshowImg";
import SlideshowControls from "./SlideshowControls";

function useSlideShow(initialOptions: {
  speed: number;
  slideIndex: number;
  imgCount: number;
  isPaused: boolean;
}) {
  const [speed, setSpeed] = useState(initialOptions.speed);
  const [slideIndex, setSlideIndex] = useState(initialOptions.slideIndex);
  const [isPaused, setIsPaused] = useState(initialOptions.isPaused);

  const jumpToStart = () => setSlideIndex(0);
  const jumpToEnd = () => setSlideIndex(initialOptions.imgCount - 1);

  const prevSlide = useCallback(() => {
    if (slideIndex === 0) {
      return;
    }

    setSlideIndex(slideIndex - 1);
  }, [slideIndex, setSlideIndex]);

  const nextSlide = useCallback(() => {
    // TODO check what's the deal with the last image, it's a 1x1 pixel...
    if (slideIndex + 1 >= initialOptions.imgCount) {
      return;
    }

    setSlideIndex(slideIndex + 1);
  }, [slideIndex, setSlideIndex]);

  // flip through images at $speed
  useEffect(() => {
    if (isPaused) {
      return;
    }

    const interval = setInterval(nextSlide, speed);

    return () => clearInterval(interval);
  }, [isPaused, speed, nextSlide]);

  const togglePause = useCallback(
    () => setIsPaused(!isPaused),
    [isPaused, setIsPaused]
  );

  return {
    prevSlide,
    nextSlide,
    togglePause,
    setSpeed,
    jumpToStart,
    jumpToEnd,
    slideIndex,
    speed,
    isPaused,
  };
}

interface Props {
  img: RoverImage;
  imgCount: number;
  isLoading: boolean;
  // onSlideChange: (slideIndex: number) => void;
  // onPauseToggle: (isPaused: boolean) => void;
}

const DEFAULT_SPEED = 3000;

export default function Slideshow({ img, imgCount, isLoading }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    slideIndex,
    speed,
    isPaused,
    prevSlide,
    nextSlide,
    togglePause,
    setSpeed,
    jumpToStart,
    jumpToEnd,
  } = useSlideShow({
    imgCount,
    isPaused: searchParams.get("paused") === "true",
    slideIndex: parseInt(searchParams.get("index") || "0"),
    speed: searchParams.get("speed")
      ? parseInt(searchParams.get("speed") as string)
      : DEFAULT_SPEED,
  });

  useEffect(() => {
    if (searchParams.get("index") !== slideIndex.toString()) {
      searchParams.set("index", slideIndex.toString());
      setSearchParams(searchParams);
    }
  }, [slideIndex, searchParams, setSearchParams]);

  useEffect(() => {
    const speedParam = searchParams.get("speed");

    if (speed) {
      if (!speedParam || (speedParam && parseInt(speedParam) !== speed)) {
        searchParams.set("speed", speed.toString());
        setSearchParams(searchParams);
      }
    } else if (speedParam) {
      searchParams.delete("speed");
      setSearchParams(searchParams);
    }
  }, [speed, searchParams, setSearchParams]);

  useEffect(() => {
    const pausedParam = searchParams.get("paused");
    if (isPaused && pausedParam !== "true") {
      searchParams.set("paused", isPaused.toString());
      setSearchParams(searchParams);
    } else if (!isPaused && pausedParam !== null) {
      searchParams.delete("paused");
      setSearchParams(searchParams);
    }
  }, [isPaused, searchParams, setSearchParams]);

  return (
    <div>
      <SlideshowImg img={img} isLoading={isLoading} />
      <div className="slideshow-footer">
        <div className="slideshow-slidecount">
          #{slideIndex + 1} of {imgCount}
        </div>
        <SlideshowControls
          jumpToStart={jumpToStart}
          prevSlide={prevSlide}
          togglePause={togglePause}
          nextSlide={nextSlide}
          jumpToEnd={jumpToEnd}
          isPaused={isPaused}
          setSpeed={setSpeed}
          speed={speed}
        />
        {/* <div className="slideshow-btns">
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

          <button
            className="slideshow-btn"
            onClick={nextSlide}
            title="Next slide"
          >
            <Emoji symbol="➡️" label="Next slide" />
          </button>
          <button
            className="slideshow-btn"
            onClick={jumpToEnd}
            title="Last slide"
          >
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
              onMouseUp={(e) =>
                setSpeed(parseInt((e.target as HTMLInputElement).value))
              }
            />
          </label>
        </div> */}
      </div>
    </div>
  );
}
