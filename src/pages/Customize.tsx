import { useMemo, useState, useEffect, JSX, useCallback } from "react";
import CardButton from "../components/card-button";
import { hiragana, katakana } from "../data/data";
import { Sets, useTestStore } from "../stores/test";
import { Page, usePageStore } from "../stores/page";
import Sidebar from "../components/sidebar";

export default function CustomizePage() {
  const { setPage } = usePageStore();
  const { currentSet, randomize, setSelectedGroups, setRandomize } =
    useTestStore();

  const [selectedGroup, setSelectedGroup] = useState<string[]>([]);

  useEffect(() => {
    setSelectedGroup([]);
  }, [currentSet]);

  const listGroup = useMemo(() => {
    let groups: string[] = [];
    switch (currentSet) {
      case Sets.Hiragana:
        groups = hiragana
          .filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.group === item.group)
          )
          .map((item) => item.group);
        break;
      case Sets.Katakana:
        groups = katakana
          .filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.group === item.group)
          )
          .map((item) => item.group);
        break;
      default:
        return [];
    }
    return groups;
  }, [currentSet]);

  const listCategory = useMemo(() => {
    let categories: string[] = [];
    switch (currentSet) {
      case Sets.Hiragana:
        categories = hiragana
          .filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.category === item.category)
          )
          .map((item) => item.category);
        break;
      case Sets.Katakana:
        categories = katakana
          .filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.category === item.category)
          )
          .map((item) => item.category);
        break;
      default:
        return [];
    }
    return categories;
  }, [currentSet]);

  const listKana = useMemo(() => {
    let kana: JSX.Element[] = [];
    switch (currentSet) {
      case Sets.Hiragana:
        kana = hiragana
          .filter(
            (item, index, self) =>
              index ===
              self.findIndex(
                (t) => t.group === item.group && t.category === item.category
              )
          )
          .map((item) => (
            <CardButton
              key={`${item.category}-${item.char}`}
              active={selectedGroup.includes(item.group)}
              onClick={() => {
                if (selectedGroup.includes(item.group)) {
                  setSelectedGroup(
                    selectedGroup.filter((group) => group !== item.group)
                  );
                } else {
                  setSelectedGroup([...selectedGroup, item.group]);
                }
              }}
            >
              <div className="card-body items-center text-center">
                <h2 className="card-title text-2xl">
                  {item.char}/{item.romaji}
                </h2>
              </div>
            </CardButton>
          ));
        break;
      case Sets.Katakana:
        kana = katakana
          .filter(
            (item, index, self) =>
              index ===
              self.findIndex(
                (t) => t.group === item.group && t.category === item.category
              )
          )
          .map((item) => (
            <CardButton
              key={`${item.category}-${item.char}`}
              active={selectedGroup.includes(item.group)}
              onClick={() => {
                if (selectedGroup.includes(item.group)) {
                  setSelectedGroup(
                    selectedGroup.filter((group) => group !== item.group)
                  );
                } else {
                  setSelectedGroup([...selectedGroup, item.group]);
                }
              }}
            >
              <div className="card-body items-center text-center">
                <h2 className="card-title text-2xl">
                  {item.char}/{item.romaji}
                </h2>
              </div>
            </CardButton>
          ));
        break;
      default:
        return [];
    }
    return kana;
  }, [currentSet, selectedGroup]);

  const groupsByCategory = useCallback(
    (category: string) => {
      let groups: string[] = [];
      switch (currentSet) {
        case Sets.Hiragana:
          groups = hiragana
            .filter((item) => item.category === category && item.group)
            .map((item) => item.group);
          break;
        case Sets.Katakana:
          groups = katakana
            .filter((item) => item.category === category && item.group)
            .map((item) => item.group);
          break;
        default:
          return [];
      }
      return groups;
    },
    [currentSet]
  );

  function startTest() {
    setSelectedGroups(selectedGroup);
    setPage(Page.Test);
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
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
                      selectedGroup.includes(group)
                    )}
                    onClick={() => {
                      const categoryGroups = groupsByCategory(category);
                      if (
                        categoryGroups.every((group) =>
                          selectedGroup.includes(group)
                        )
                      ) {
                        setSelectedGroup(
                          selectedGroup.filter(
                            (group) => !categoryGroups.includes(group)
                          )
                        );
                      } else {
                        setSelectedGroup([
                          ...new Set([
                            ...selectedGroup,
                            ...categoryGroups.filter(
                              (group) => !selectedGroup.includes(group)
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
                      .filter((item) => item.key?.startsWith(category))
                      .map((item) => item)}
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
  );
}
