import { createFileRoute } from "@tanstack/react-router";
import TestPage from "../pages/Test";

export const Route = createFileRoute("/test")({
  component: TestPage,
});
