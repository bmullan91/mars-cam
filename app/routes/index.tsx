import {
  Link,
  useLoaderData,
  useTransition,
  json,
  HeadersFunction,
  ShouldReloadFunction,
} from "remix";
import type { LoaderFunction } from "remix";

// API
import { useRoverAPI } from "~/api";
import type { RoverImage } from "~/api";

// Components
import Header from "~/components/Header";
import Slideshow from "~/components/SlideShow";

interface LoaderData {
  imgCount: number;
  img: RoverImage;
  type: "DATA";
}

interface LoaderError {
  error: Error;
  type: "ERROR";
}

type LoaderResponse = LoaderData | LoaderError;

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") || "max-age=604800",
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const api = useRoverAPI();
  let url = new URL(request.url);
  let slideIndex = parseInt(url.searchParams.get("index") || "0");

  try {
    const [imgCount, img] = await Promise.all([
      api.getImageCount(),
      api.getImageAtIndex(slideIndex),
    ]);

    return json(
      {
        imgCount,
        img,
        type: "DATA",
      },
      {
        headers: {
          "Cache-Control": "max-age=604800",
        },
      }
    );
  } catch (error) {
    return { type: "ERROR", error: error as Error };
  }
};

export const unstable_shouldReload: ShouldReloadFunction = ({
  url,
  prevUrl,
}) => {
  return url.searchParams.get("index") !== prevUrl.searchParams.get("index");
};

export default function Index() {
  const transition = useTransition();
  const loaderResp = useLoaderData<LoaderResponse>();

  return (
    <div className="page-wrapper">
      <Header />
      {loaderResp.type === "ERROR" ? (
        <pre>{JSON.stringify(loaderResp.error, null, 2)}</pre>
      ) : (
        <Slideshow
          img={loaderResp.img}
          imgCount={loaderResp.imgCount}
          isLoading={transition.state === "loading"}
        />
      )}
    </div>
  );
}