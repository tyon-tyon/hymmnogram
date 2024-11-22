import _foreluna from "~/assets/datas/foreluna.json";
import type { TForelunaCharData, TForelunaWordData } from "~/types";

export default function () {
  const foreluna = _foreluna as TForelunaCharData[];
  const emptyForelunaWordData: TForelunaWordData = { word: "", sections: [], type: null };

  // 律史前月詠の単語を取得
  const getForelunaWord = (q: string): TForelunaWordData => {
    // 英文字だけ処理
    if (!q.match(/^[a-zA-Z]+$/)) return { ...emptyForelunaWordData, word: q };
    // 母音でセクションを分割
    const sections = q.replace(/([aiueon]+)/i, " $1 ").replace(/(^ +| +$)/i, "").split(" ");
    // 母音子音セクションごとに意味を取得
    const sectionChars = sections.map((section, i) => {
      const chars = section.split(""); // 文字ごとに分割
      return chars.map(c => {
        const char = foreluna.find(f => f.char.toLowerCase() === c.toLowerCase());// 各文字を取得(大文字小文字は問わない)
        if (!char) return; // 文字が見つからない場合はスキップ
        return {
          char: c,
          meaning: char.meaning,
        };
      }).
        filter(c => !!c) as TForelunaCharData[]; // 空の要素を削除
    });

    return {
      word: q,
      sections: sectionChars,
      type: q.match(/([aiueon])/i) ? "executor" : "modifier", // 母音が含まれているかで判定
    };
  };

  return { getForelunaWord, forelunaChars: foreluna, emptyForelunaWordData };
}
