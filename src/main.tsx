import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter } from "./router";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ToastContainer } from "react-toastify";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const router = createRouter();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <RouterProvider router={router} />
      <ToastContainer stacked limit={3} />
    </ConvexAuthProvider>
  </StrictMode>
);
