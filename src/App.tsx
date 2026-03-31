import { Analytics } from "@vercel/analytics/react";
import { ToastContainer } from "react-toastify";
import CustomizePage from "./pages/Customize";
import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import ResultPage from "./pages/Result";
import SelectionPage from "./pages/Selection";
import TestPage from "./pages/Test";
import KanaChartPage from "./pages/KanaChart";
import { Page, usePageStore } from "./stores/page";
import { useSettingsStore } from "./stores/settings";
import { useMemo } from "react";

function App() {
  const { theme } = useSettingsStore();
  const { page } = usePageStore();

  const pageComponent = useMemo(() => displayPage(page), [page]);

  return (
    <>
      <div data-theme={theme}>{pageComponent}</div>
      <ToastContainer stacked limit={3} />
      <Analytics />
    </>
  );
}

function displayPage(page: Page) {
  switch (page) {
    case Page.Home:
      return <HomePage />;
    case Page.Selection:
      return <SelectionPage />;
    case Page.Customize:
      return <CustomizePage />;
    case Page.Test:
      return <TestPage />;
    case Page.Result:
      return <ResultPage />;
    case Page.KanaChart:
      return <KanaChartPage />;
    default:
      return <NotFoundPage />;
  }
}

export default App;
