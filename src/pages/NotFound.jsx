import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-x py-32 text-center">
      <p className="eyebrow text-clay">Error 404</p>
      <h1 className="display mt-4 text-7xl md:text-9xl">Out of <em className="font-normal italic">stock</em></h1>
      <p className="mt-5 text-mute">The page you're looking for isn't here.</p>
      <Link to="/" className="mt-9 inline-block bg-ink px-9 py-4 text-sm font-semibold text-paper hover:bg-clay transition-colors">Back to home</Link>
    </div>
  );
}
