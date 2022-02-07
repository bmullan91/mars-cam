import type { RoverImage } from "~/api";

interface Props {
  img: RoverImage;
  isLoading: boolean;
}

export default function SlideshowImg({ img, isLoading }: Props) {
  return (
    <div className="slideshow-img">
      {isLoading ? <div className="img-loading">loading...</div> : null}
      <div
        className={isLoading ? "img-wrapper fade-out" : "img-wrapper fade-in"}
      >
        <img src={img.images.base64} alt={`image ${img.index}`} />
        <div className="img-meta-data">
          <p>Sol: {img.metadata.sol}</p>
          <p>Earth Date: {img.metadata.earth_date}</p>
        </div>
      </div>
    </div>
  );
}
