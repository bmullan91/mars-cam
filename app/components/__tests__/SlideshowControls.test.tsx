/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import SlideshowControls from "../SlideshowControls";

const mockJumpToStart = jest.fn();
const mockPrevSlide = jest.fn();
const mockTogglePause = jest.fn();
const mockNextSlide = jest.fn();
const mockJumpToEnd = jest.fn();
const mockSetSpeed = jest.fn();

const props = {
  jumpToStart: mockJumpToStart,
  prevSlide: mockPrevSlide,
  togglePause: mockTogglePause,
  nextSlide: mockNextSlide,
  jumpToEnd: mockJumpToEnd,
  setSpeed: mockSetSpeed,
  speed: 3000,
  isPaused: false,
};

describe("SlideshowControls", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the jump to start button ", () => {
    render(<SlideshowControls {...props} />);
    const firstSlideBtn = screen.getByLabelText("First slide");
    expect(firstSlideBtn).toBeInTheDocument();
    firstSlideBtn.click();
    expect(mockJumpToStart).toHaveBeenCalledTimes(1);
  });

  it("should render the previous slide button ", () => {
    render(<SlideshowControls {...props} />);
    const prevSlideBtn = screen.getByLabelText("Previous slide");
    expect(prevSlideBtn).toBeInTheDocument();
    prevSlideBtn.click();
    expect(mockPrevSlide).toHaveBeenCalledTimes(1);
  });

  it("should render the pause button when isPaused=false", () => {
    render(<SlideshowControls {...props} isPaused={false} />);
    const pauseBtn = screen.getByLabelText("Pause");
    expect(pauseBtn).toBeInTheDocument();
    pauseBtn.click();
    expect(mockTogglePause).toHaveBeenCalledTimes(1);
  });

  it("should render the play button when isPaused=true", () => {
    render(<SlideshowControls {...props} isPaused />);
    const playBtn = screen.getByLabelText("Play");
    expect(playBtn).toBeInTheDocument();
    playBtn.click();
    expect(mockTogglePause).toHaveBeenCalledTimes(1);
  });

  it("should render the next slide button ", () => {
    render(<SlideshowControls {...props} />);
    const nextSlideBtn = screen.getByLabelText("Next slide");
    expect(nextSlideBtn).toBeInTheDocument();
    nextSlideBtn.click();
    expect(mockNextSlide).toHaveBeenCalledTimes(1);
  });

  it("should render the jump to end button ", () => {
    render(<SlideshowControls {...props} />);
    const lastSlideBtn = screen.getByLabelText("Last slide");
    expect(lastSlideBtn).toBeInTheDocument();
    lastSlideBtn.click();
    expect(mockJumpToEnd).toHaveBeenCalledTimes(1);
  });

  it("should render the speed slider with the given speed in ms", () => {
    render(<SlideshowControls {...props} speed={5000} />);

    expect(screen.getByText("5 sec")).toBeInTheDocument();

    const speedSlider = screen.getByTitle("Slideshow speed");
    expect(speedSlider).toBeInTheDocument();
    fireEvent.change(speedSlider, { target: { value: 1000 } });
    expect(mockSetSpeed).toHaveBeenNthCalledWith(1, 1000);
  });

  describe("arrowkey support", () => {
    it("should call prevSlide on left arrowkey", () => {
      render(<SlideshowControls {...props} />);

      fireEvent.keyDown(document, {
        key: "ArrowLeft",
        code: "ArrowLeft",
        charCode: 37,
      });

      expect(mockPrevSlide).toHaveBeenCalledTimes(1);
    });

    it("should call nextSlide on right arrowkey", () => {
      render(<SlideshowControls {...props} />);

      fireEvent.keyDown(document, {
        key: "ArrowRight",
        code: "ArrowRight",
        charCode: 39,
      });

      expect(mockNextSlide).toHaveBeenCalledTimes(1);
    });

    it("should ignore other keypresses", () => {
      render(<SlideshowControls {...props} />);

      fireEvent.keyDown(document, {
        key: "ArrowUp",
        code: "ArrowUp",
        charCode: 38,
      });

      expect(mockNextSlide).toHaveBeenCalledTimes(0);
      expect(mockPrevSlide).toHaveBeenCalledTimes(0);
    });
  });
});
