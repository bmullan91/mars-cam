import {
  useLoaderData,
  json,
  redirect,
  HeadersFunction,
  ShouldReloadFunction,
} from "remix";
import type { LoaderFunction } from "remix";

// API
import { useRoverAPI } from "~/api";
import type { RoverImage } from "~/api";

// Components
import Header from "~/components/Header";
import Slideshow from "~/components/Slideshow";

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
    "Cache-Control": loaderHeaders.get("Cache-Control") || "s-maxage=60",
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const api = useRoverAPI();
  const url = new URL(request.url);
  const index = url.searchParams.get("index");

  if (!index) {
    url.searchParams.set("index", "0");
    return redirect(`/?${url.searchParams.toString()}`);
  }

  const slideIndex = parseInt(index);
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
          "Cache-Control": "s-maxage=60",
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
  const loaderResp = useLoaderData<LoaderResponse>();

  return (
    <div className="page-wrapper">
      <Header />
      {loaderResp.type === "ERROR" ? (
        <pre>{JSON.stringify(loaderResp.error, null, 2)}</pre>
      ) : (
        <Slideshow img={loaderResp.img} imgCount={loaderResp.imgCount} />
      )}
    </div>
  );
}
