import CardButton from "../components/card-button";
import Footer from "../components/footer";
import { Page, usePageStore } from "../stores/page";
import { Sets, useTestStore } from "../stores/test";

export default function SelectionPage() {
  const { setSet } = useTestStore();
  const { setPage } = usePageStore();

  const setSets = (set: Sets) => {
    setSet(set);
    setPage(Page.Customize);
  };

  const setPack = () => {};

  return (
    <div className="flex flex-col items-center min-h-screen justify-between">
      <div className="flex-1 hero cursor-default">
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

            <CardButton className="px-4" onClick={() => setPack()}>
              <figure className="px-10 py-6">
                <h2 className="font-bold text-5xl">✨</h2>
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title text-3xl">Packs</h2>
              </div>
            </CardButton>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
