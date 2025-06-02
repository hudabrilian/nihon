import { Sets } from "../stores/test";

import hiragana from "./hiragana.json";
import katakana from "./katakana.json";

type Kana = {
  char: string;
  romaji: string;
  group: string;
  category: string;
};

function getKana(set: Sets, selectedGroups: string[], randomize: boolean) {
  let kana: Kana[] = [];
  switch (set) {
    case Sets.Hiragana:
      kana = hiragana.filter((item) => selectedGroups.includes(item.group));
      break;
    case Sets.Katakana:
      kana = katakana.filter((item) => selectedGroups.includes(item.group));
      break;
    default:
      return [];
  }
  if (randomize) {
    kana = kana.sort(() => Math.random() - 0.5);
  }
  return kana;
}

export { hiragana, katakana, getKana };
