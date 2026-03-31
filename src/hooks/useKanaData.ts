import { useMemo } from "react";
import { hiragana, katakana } from "../data/data";
import { Sets } from "../stores/test";

type Kana = {
  char: string;
  romaji: string;
  group: string;
  category: string;
};

export function useKanaData(currentSet: Sets) {
  const kanaData = currentSet === Sets.Hiragana ? hiragana : katakana;

  const listGroup = useMemo(() => {
    return [...new Set(kanaData.map((item) => item.group))];
  }, [kanaData]);

  const listCategory = useMemo(() => {
    return [...new Set(kanaData.map((item) => item.category))];
  }, [kanaData]);

  const listKana = useMemo(() => {
    const grouped = new Map<string, Kana>();

    kanaData.forEach((item) => {
      const key = `${item.group}-${item.category}`;
      if (!grouped.has(key)) {
        grouped.set(key, item);
      }
    });

    return Array.from(grouped.values()).map((item) => ({
      ...item,
      categoryKey: item.category,
    }));
  }, [kanaData]);

  const groupsByCategory = (category: string): string[] => {
    return [
      ...new Set(
        kanaData
          .filter((item) => item.category === category)
          .map((item) => item.group),
      ),
    ];
  };

  return { listGroup, listCategory, listKana, groupsByCategory };
}

export function toggleGroup(group: string, selectedGroup: string[]): string[] {
  return selectedGroup.includes(group)
    ? selectedGroup.filter((g) => g !== group)
    : [...selectedGroup, group];
}

export function toggleCategory(
  category: string,
  selectedCategory: string[],
): string[] {
  return selectedCategory.includes(category)
    ? selectedCategory.filter((c) => c !== category)
    : [...selectedCategory, category];
}
