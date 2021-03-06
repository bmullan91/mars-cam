import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useTransition } from "remix";

import { RoverImage } from "~/api";
import SlideshowImg from "./SlideshowImg";
import SlideshowControls from "./SlideshowControls";

function useSlideShow(initialOptions: {
  speed: number;
  slideIndex: number;
  imgCount: number;
  isPaused: boolean;
}) {
  const transition = useTransition();
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

    if (transition.state === "loading") {
      // if the timeout is shorter than the time it takes to fetch the image
      // we don't want to move on.. we want to show the image for the $speed delay
      return;
    }

    const interval = setInterval(nextSlide, speed);
    return () => clearInterval(interval);
  }, [isPaused, speed, nextSlide, transition.state]);

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
}

const DEFAULT_SPEED = 5000;

export default function Slideshow({ img, imgCount }: Props) {
  const transition = useTransition();
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
      <SlideshowImg img={img} isLoading={transition.state === "loading"} />
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
      </div>
    </div>
  );
}
