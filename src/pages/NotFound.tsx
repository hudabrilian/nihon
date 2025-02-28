import { Page, usePageStore } from "../stores/page";

export default function NotFoundPage() {
  const { setPage } = usePageStore();

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">404 Not Found</h1>
          <p className="py-6">
            The page you are looking for does not exist. Please check the URL in
            the address bar and try again.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setPage(Page.Home);
            }}
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
