
import _examples from "@/assets/datas/examples.json";
import type { TJsonExampleData } from "~/types";

// meaningをmeaningsに変更
const examples = _examples as TJsonExampleData[];

export default function useExample() {

  const getExactMatch = (q: string) => {
    // 完全一致の例文を取得
    const hymmnosexactMatch = examples.filter((example) =>
      example.hymmnos_base.toLocaleLowerCase().match(" " + q.toLocaleLowerCase() + " ")
    );
    return hymmnosexactMatch;
  };

  const getPartialMatch = (q: string) => {
    q = q.replace(/([\-\.])/, "\\$1");
    const reg = new RegExp(q, 'gi');
    // 完全一致の例文を取得
    const hymmnosExactMatch = examples.filter((example) =>
      example.hymmnos_base.toLocaleLowerCase().match(" " + q.toLocaleLowerCase() + " ")
    );
    // 部分一致の例文を取得
    const hymmnosMatch = examples.filter(
      (example) =>
        example.hymmnos.match(reg) &&
        !hymmnosExactMatch.includes(example)
    );
    // 日本語の例文を取得
    const japaneseMatch = examples.filter(
      (example) =>
        (example.japanese_base.match(reg) ||
          example.japanese.match(reg)) &&
        !hymmnosExactMatch.includes(example) &&
        !hymmnosMatch.includes(example)
    );
    return [...hymmnosExactMatch, ...hymmnosMatch, ...japaneseMatch];
  };
  return { getExactMatch, getPartialMatch };
}