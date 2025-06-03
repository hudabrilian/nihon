import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
  component: Test,
});

function Test() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to the App!</h1>
    </div>
  );
}
