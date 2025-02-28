import CardButton from "../components/card-button";
import { Page, usePageStore } from "../stores/page";
import { Sets, useTestStore } from "../stores/test";

export default function SelectionPage() {
  const { setSet } = useTestStore();
  const { setPage } = usePageStore();

  const setSets = (set: Sets) => {
    setSet(set);
    setPage(Page.Customize);
  };

  return (
    <div className="hero bg-base-200 min-h-screen cursor-default">
      <div className="hero-content text-center flex flex-col space-y-5">
        <div className="flex items-end space-x-4 w-full">
          <button
            className="btn btn-square"
            onClick={() => {
              setPage(Page.Home);
            }}
          >
            {"<"}
          </button>
          <h1 className="text-5xl font-bold">Choose a set</h1>
        </div>

        <div className="flex gap-4">
          <CardButton className="px-4" onClick={() => setSets(Sets.Hiragana)}>
            <figure className="px-10 py-6">
              <h2 className="font-bold text-5xl">あ</h2>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title text-3xl">Hiragana</h2>
            </div>
          </CardButton>

          <CardButton className="px-4" onClick={() => setSets(Sets.Katakana)}>
            <figure className="px-10 py-6">
              <h2 className="font-bold text-5xl">ア</h2>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title text-3xl">Katakana</h2>
            </div>
          </CardButton>
        </div>
      </div>
    </div>
  );
}
