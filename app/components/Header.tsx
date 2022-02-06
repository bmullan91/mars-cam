import { Link } from "remix";

export default function Header() {
  return (
    <Link to="/" style={{ all: "unset", cursor: "pointer" }}>
      <h1>🟠 Mars Cam</h1>
    </Link>
  );
}
