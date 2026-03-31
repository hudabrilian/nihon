import { useState, useEffect, useCallback } from "react";
import CardButton from "../components/card-button";
import { useTestStore } from "../stores/test";
import { Page, usePageStore } from "../stores/page";
import Sidebar from "../components/sidebar";
import Footer from "../components/footer";
import { useKanaData, toggleGroup } from "../hooks/useKanaData";

export default function CustomizePage() {
  const { setPage } = usePageStore();
  const { currentSet, randomize, setSelectedGroups, setRandomize } =
    useTestStore();

  const [selectedGroup, setSelectedGroup] = useState<string[]>([]);

  const handleToggleGroup = useCallback((group: string) => {
    setSelectedGroup((prev) => toggleGroup(group, prev));
  }, []);

  const { listGroup, listCategory, listKana, groupsByCategory } =
    useKanaData(currentSet);

  useEffect(() => {
    setSelectedGroup([]);
  }, [currentSet]);

  function startTest() {
    setSelectedGroups(selectedGroup);
    setPage(Page.Test);
  }

  return (
    <div className="flex flex-col items-center min-h-screen justify-between">
      <div className="flex-1 hero">
        <div className="hero-content text-center w-full">
          <div className="w-full">
            <div className="flex items-end space-x-4 w-full">
              <div className="flex items-end gap-4 w-full">
                <button
                  className="btn btn-square"
                  onClick={() => {
                    setPage(Page.Selection);
                  }}
                >
                  {"<"}
                </button>
                <h1 className="text-5xl font-bold">Customize</h1>
              </div>

              <div>
                <Sidebar />
              </div>
            </div>

            <p className="py-6">
              Select the kana you want to test yourself on. You can select all
              kana or by category.
            </p>

            <div className="space-y-4 w-full">
              <CardButton
                active={
                  selectedGroup.length === listGroup.length &&
                  listGroup.length !== 0
                }
                onClick={() => {
                  if (selectedGroup.length === listGroup.length) {
                    setSelectedGroup([]);
                  } else {
                    setSelectedGroup(listGroup);
                  }
                }}
              >
                <div className="card-body items-center text-center">
                  <h2 className="card-title text-lg">All kana</h2>
                </div>
              </CardButton>

              <div className="flex justify-center items-start gap-4 w-full flex-wrap md:flex-nowrap">
                {listCategory.map((category, i) => (
                  <div key={i} className="w-full">
                    <h1 className="font-bold text-xl uppercase pb-4">
                      {category}
                    </h1>
                    <CardButton
                      active={groupsByCategory(category).every((group) =>
                        selectedGroup.includes(group),
                      )}
                      onClick={() => {
                        const categoryGroups = groupsByCategory(category);
                        if (
                          categoryGroups.every((group) =>
                            selectedGroup.includes(group),
                          )
                        ) {
                          setSelectedGroup(
                            selectedGroup.filter(
                              (group) => !categoryGroups.includes(group),
                            ),
                          );
                        } else {
                          setSelectedGroup([
                            ...new Set([
                              ...selectedGroup,
                              ...categoryGroups.filter(
                                (group) => !selectedGroup.includes(group),
                              ),
                            ]),
                          ]);
                        }
                      }}
                      className="mb-4"
                    >
                      <div className="card-body items-center text-center">
                        <h2 className="card-title text-lg">All {category}</h2>
                      </div>
                    </CardButton>
                    <div className="grid grid-cols-2 gap-4">
                      {listKana
                        .filter((item) => item.categoryKey === category)
                        .map((item) => (
                          <CardButton
                            key={`${item.category}-${item.char}`}
                            active={selectedGroup.includes(item.group)}
                            onClick={() => handleToggleGroup(item.group)}
                          >
                            <div className="card-body items-center text-center">
                              <h2 className="card-title text-2xl">
                                {item.char}/{item.romaji}
                              </h2>
                            </div>
                          </CardButton>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="fieldset-label">
                <input
                  type="checkbox"
                  className="toggle"
                  checked={randomize}
                  onChange={() => {
                    setRandomize(!randomize);
                  }}
                />
                Random the kanas
              </label>
            </div>

            <div
              className="tooltip my-6 w-full"
              data-tip="Select at least one group"
            >
              <button
                className={
                  "btn btn-primary w-full " +
                  (selectedGroup.length === 0 ? "cursor-not-allowed" : "")
                }
                onClick={startTest}
                disabled={selectedGroup.length === 0}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
