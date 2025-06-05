import { Link } from "@tanstack/react-router";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full items-center justify-between">
      <div className="hero flex-1">
        <div className="hero-content text-center">
          <div className="max-w-lg mx-auto">
            <h1 className="text-5xl font-bold">Welcome to Nihoon</h1>
            <p className="py-6">
              Here, you can improve your skills in remembering hiragana and
              katakana, the fundamental components of the Japanese writing
              system.
            </p>
            <Link to="/selection">
              <button className="btn btn-primary">Get Started</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
