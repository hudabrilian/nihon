import { ToastContainer } from "react-toastify";
import CustomizePage from "./pages/Customize";
import HomePage from "./pages/Home";
import NotFoundPage from "./pages/NotFound";
import ResultPage from "./pages/Result";
import SelectionPage from "./pages/Selection";
import TestPage from "./pages/Test";
import { Page, usePageStore } from "./stores/page";
import { useSettingsStore } from "./stores/settings";

function App() {
  const { theme } = useSettingsStore();

  return (
    <>
      <div data-theme={theme}>{displayPage()}</div>
      <ToastContainer stacked limit={3} />
    </>
  );
}

function displayPage() {
  const { page } = usePageStore();

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
    default:
      return <NotFoundPage />;
  }
}

export default App;
