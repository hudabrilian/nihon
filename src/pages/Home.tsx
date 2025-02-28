import { Page, usePageStore } from "../stores/page";

export default function HomePage() {
  const { setPage } = usePageStore();

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-5xl font-bold">Welcome to Nihoon</h1>
          <p className="py-6">
            Here, you can improve your skills in remembering hiragana and
            katakana, the fundamental components of the Japanese writing system.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setPage(Page.Selection);
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
