import { createFileRoute } from "@tanstack/react-router";
import CustomizePage from "../pages/Customize";

export const Route = createFileRoute("/customize-kana/$set")({
  component: CustomizePage,
});
