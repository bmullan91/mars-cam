/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SlideshowImg from "../SlideshowImg";
import { mockRoverImg } from "../../api/__tests__";

const roverImg = mockRoverImg();

describe("SlideshowImg", () => {
  it("should render loading... when isLoading=true", () => {
    render(<SlideshowImg img={roverImg} isLoading />);

    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  it("should render the img src", () => {
    render(<SlideshowImg img={roverImg} isLoading={false} />);

    const img = screen.getByAltText(`image ${roverImg.index}`);

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", roverImg.images.base64);
  });

  it("should render the metadata", () => {
    render(<SlideshowImg img={roverImg} isLoading={false} />);

    const sol = screen.getByText(`Sol: ${roverImg.metadata.sol}`);

    expect(
      screen.getByText(`Sol: ${roverImg.metadata.sol}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Earth Date: ${roverImg.metadata.earth_date}`)
    ).toBeInTheDocument();
  });
});
