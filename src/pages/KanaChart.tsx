import { useState } from "react";
import { Page, usePageStore } from "../stores/page";
import { hiragana, katakana } from "../data/data";
import Footer from "../components/footer";

type Kana = {
  char: string;
  romaji: string;
  group: string;
  category: string;
};

export default function KanaChartPage() {
  const { setPage } = usePageStore();
  const [selectedSet, setSelectedSet] = useState<"hiragana" | "katakana">(
    "hiragana",
  );

  const kanaData = selectedSet === "hiragana" ? hiragana : katakana;

  // Group order from left to right: a, k, s, t, n, h, m, y, r, w, n
  // Last "n" is only for ん/ン character
  const groupOrder = ["a", "k", "s", "t", "n", "h", "m", "y", "r", "w", "n"];
  const vowelOrder = ["a", "i", "u", "e", "o"];

  // Get unique groups while maintaining order (but don't deduplicate "n" - we need both)
  const uniqueGroups = groupOrder.filter((group) =>
    kanaData.some((k) => k.group === group && k.category === "main"),
  );

  // Create chart organized by group and vowel
  const chartData: Record<string, Record<string, Kana | null>> = {};

  uniqueGroups.forEach((group, index) => {
    const groupKey = `${group}-${index}`;
    chartData[groupKey] = {};

    const isLastNGroup = group === "n" && index === uniqueGroups.length - 1;

    vowelOrder.forEach((vowel) => {
      let kana = null;

      if (isLastNGroup) {
        // For last "n" group, find the standalone ん/ン character (romaji: "n")
        if (vowel === "a") {
          kana =
            kanaData.find((k) => k.romaji === "n" && k.category === "main") ||
            null;
        }
      } else {
        kana =
          kanaData.find(
            (k) =>
              k.group === group &&
              k.romaji.endsWith(vowel) &&
              k.category === "main",
          ) || null;
      }

      chartData[groupKey][vowel] = kana;
    });
  });

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Japanese Kana Chart</h1>
            <p className="text-base-content/70">
              Complete reference for Hiragana and Katakana
            </p>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setPage(Page.Home)}
          >
            ← Back to Home
          </button>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            className={`btn ${
              selectedSet === "hiragana"
                ? "btn-primary"
                : "btn-outline btn-primary"
            }`}
            onClick={() => setSelectedSet("hiragana")}
          >
            Hiragana
          </button>
          <button
            className={`btn ${
              selectedSet === "katakana"
                ? "btn-primary"
                : "btn-outline btn-primary"
            }`}
            onClick={() => setSelectedSet("katakana")}
          >
            Katakana
          </button>
        </div>

        {/* Chart */}
        <div className="overflow-x-auto bg-base-200 rounded-lg p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-base-300 p-3 bg-base-300 font-bold w-12"></th>
                {uniqueGroups.map((group, index) => {
                  const isLastN =
                    group === "n" && index === uniqueGroups.length - 1;
                  return (
                    <th
                      key={`${group}-${index}`}
                      className="border border-base-300 p-3 bg-base-300 font-bold text-center"
                    >
                      {isLastN
                        ? selectedSet === "hiragana"
                          ? "ん"
                          : "ン"
                        : `${group}-`}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {vowelOrder.map((vowel) => (
                <tr key={vowel}>
                  {/* Vowel Label */}
                  <td className="border border-base-300 p-3 bg-base-300 font-bold text-center text-sm">
                    -{vowel}
                  </td>

                  {/* Kana Cells */}
                  {uniqueGroups.map((group, index) => {
                    const isLastNGroup =
                      group === "n" && index === uniqueGroups.length - 1;
                    const groupKey = `${group}-${index}`;

                    // For last n group, only show kana on -a row
                    let kana = null;
                    if (isLastNGroup) {
                      kana =
                        vowel === "a"
                          ? chartData[groupKey]?.[vowel] || null
                          : null;
                    } else {
                      kana = chartData[groupKey]?.[vowel] || null;
                    }

                    return (
                      <td
                        key={`${groupKey}-${vowel}`}
                        className={`border border-base-300 p-4 transition-colors ${
                          kana ? "hover:bg-base-300 cursor-pointer" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          {kana ? (
                            <>
                              <span className="text-4xl font-bold">
                                {kana.char}
                              </span>
                              <span className="text-xs text-base-content/60">
                                {kana.romaji}
                              </span>
                            </>
                          ) : (
                            !isLastNGroup && (
                              <span className="text-base-content/20">—</span>
                            )
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend/Info */}
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="card bg-base-200 p-6">
            <h3 className="font-bold text-lg mb-3">
              About Hiragana & Katakana
            </h3>
            <p className="text-sm text-base-content/70">
              Hiragana (ひらがな) is used for native Japanese words and
              grammatical elements. Katakana (カタカナ) is primarily used for
              foreign words and technical terms. Both have 46 basic characters
              representing the same sounds.
            </p>
          </div>
          <div className="card bg-base-200 p-6">
            <h3 className="font-bold text-lg mb-3">How to Use</h3>
            <p className="text-sm text-base-content/70">
              Each cell shows a character and its Romaji (Latin alphabet)
              equivalent. The rows represent vowel sounds (a, i, u, e, o), while
              the columns represent consonant sounds.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
