import { Link } from "@tanstack/react-router";
import CardButton from "../components/card-button";
import { Sets } from "../stores/test";

export default function SelectionPage() {
  return (
    <div className="flex flex-1 justify-center mt-10 cursor-default">
      <div className="flex flex-col space-y-5 w-full max-w-5xl">
        <div className="flex items-end space-x-4 w-full">
          <Link to="/">
            <button className="btn btn-square">{"<"}</button>
          </Link>
          <h1 className="text-5xl font-bold text-center">Choose a set</h1>
        </div>

        <div>
          <p className="text-md">
            Select a set to start practicing. You can choose between Hiragana,
            Katakana, or custom packs.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link to="/customize-kana/$set" params={{ set: Sets.Hiragana }}>
            <CardButton className="px-4">
              <figure className="px-10 py-6">
                <h2 className="font-bold text-5xl">あ</h2>
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title text-3xl">Hiragana</h2>
              </div>
            </CardButton>
          </Link>

          <Link to="/customize-kana/$set" params={{ set: Sets.Katakana }}>
            <CardButton className="px-4">
              <figure className="px-10 py-6">
                <h2 className="font-bold text-5xl">ア</h2>
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title text-3xl">Katakana</h2>
              </div>
            </CardButton>
          </Link>

          <CardButton className="px-4">
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
  );
}
