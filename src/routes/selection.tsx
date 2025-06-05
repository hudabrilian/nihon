import { createFileRoute } from "@tanstack/react-router";
import SelectionPage from "../pages/Selection";

export const Route = createFileRoute("/selection")({
  component: SelectionPage,
});
