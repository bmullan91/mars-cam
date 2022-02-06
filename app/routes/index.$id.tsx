import { redirect, useParams, Link } from "remix";
import type { LoaderFunction } from "remix";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({ params, request }) => {
  invariant(params.id, "image id is required");

  return redirect(`/?index=${params.id}&paused=true`);
};

export default function SingleImage() {
  const params = useParams();
  return <Link to={`/?index=${params.id}&paused=true`}>Go here instead</Link>;
}
