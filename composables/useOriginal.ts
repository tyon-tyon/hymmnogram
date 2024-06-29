
import type { TJsonWordData, TWordData, TDialectData } from "~/types";


export default function () {
  const originalWords = useState<TJsonWordData[]>('originalWords', () => []);
  const originalDialects = useState<TDialectData[]>('originalDialects', () => []);
  const originalWordsStr  = useState<string>('originalWordsStr', () => '');
  const originalDelimiter  = useState<string>('originalDelimiter', () => '');

  // テキストから単語データを取得する
  function getWordFromText(text: string, delimiter: string): TWordData[] {
    const wordlines = text.split("\n");
    const delimiterStr = delimiter.length ? delimiter : "、";
    if (wordlines.length === 0) [];
    // 一行目にヘッダーがあるのでそれを取得
    const header = wordlines.shift()?.split("\t") ?? [];
    // 単語データをパース
    return wordlines.map((line) => {
      const lineData = line.split("\t");
      const hymmnos = lineData[header.indexOf("単語")];
      const japanese = lineData[header.indexOf("意味")];
      const pronunciation = lineData[header.indexOf("発音")];
      const part_of_speech = lineData[header.indexOf("品詞")];
      const dialect = lineData[header.indexOf("流派")];
      const explanation = lineData[header.indexOf("備考")];
      return {
        hymmnos: hymmnos ?? "error!",
        japanese: (japanese && japanese.length ? japanese : "").split(
          delimiterStr
        ),
        pronunciation: pronunciation ?? "error!",
        part_of_speech: part_of_speech ?? "error!",
        dialect: dialect ?? "error!",
        explanation: explanation ?? "",
      };
    });
  };

  // オリジナル単語を更新
  const updateOriginalWords = (words: string, delimiter: string): TJsonWordData[] => {
    originalWordsStr.value = words;
    originalDelimiter.value = delimiter;
    // 単語データを更新
    originalWords.value = getWordFromText(words, delimiter);
    return originalWords.value;
  };

  // オリジナル流派をoriginalStorageに保存
  const updateOriginalDialects = (dialects: TDialectData[]) => {
    // 流派データを更新
    originalDialects.value = dialects;
    return originalDialects.value;
  };

  return { originalWords, originalDialects,originalDelimiter, originalWordsStr, getWordFromText, updateOriginalWords, updateOriginalDialects };
}

