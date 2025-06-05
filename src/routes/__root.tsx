import { useAuthActions } from "@convex-dev/auth/react";
import {
  createRootRoute,
  Link,
  Outlet,
  Scripts,
  useMatchRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import Footer from "../components/footer";
import UserNav from "../components/user-nav";
import "../index.css";
import { useSettingsStore } from "../stores/settings";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

interface RootDocumentProps {
  children: React.ReactNode;
}

function RootDocument({ children }: RootDocumentProps) {
  const { theme } = useSettingsStore();

  const { signIn } = useAuthActions();

  const matchRoute = useMatchRoute();

  const isTestRoute = matchRoute({
    to: "/test",
  });

  return (
    <div className="flex flex-col min-h-screen" data-theme={theme}>
      {!isTestRoute && (
        <header className="flex items-center justify-between px-8 py-6">
          <div>
            <Link to="/">
              <h1 className="text-2xl font-bold">Nihoon.</h1>
            </Link>
          </div>

          <div>
            <AuthLoading>
              <div>
                <span>Loading...</span>
              </div>
            </AuthLoading>
            <Unauthenticated>
              <button
                onClick={() => void signIn("google")}
                className="btn btn-sm"
              >
                Sign in with Google
                <span className="ml-2">🔑</span>
              </button>
            </Unauthenticated>

            <Authenticated>
              <UserNav />
            </Authenticated>
          </div>
        </header>
      )}

      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex">{children}</div>

        {!isTestRoute && <Footer />}
      </main>

      <TanStackRouterDevtools position="bottom-right" />
      <Scripts />
    </div>
  );
}
