
import _lyricsHymmnos from "@/assets/datas/lyrics_hymmnos.json";
import type { TLyric } from "~/types";

// meaningをmeaningsに変更
const lyricsHymmnos = _lyricsHymmnos as TLyric[];

export default function useExample() {

  const getMatchHymmnos = (q: string) => {
    q = q.replace(/([\-\.])/, "\\$1");
    const reg = new RegExp(q, 'gi');
    // 完全一致の例文を取得
    const hymmnosExactMatch = lyricsHymmnos.filter((lyric) =>
      lyric.lyricWords.match(" " + q.toLocaleLowerCase() + " ")
    );
    // 部分一致の例文を取得
    const hymmnosMatch = lyricsHymmnos.filter(
      (lyric) =>
        lyric.lyric.match(reg) &&
        !hymmnosExactMatch.includes(lyric)
    );
    // 日本語の例文を取得
    const japaneseReg = new RegExp(q.replace(/:/, "\\$1"), 'gi');
    const japaneseMatch = lyricsHymmnos.filter(
      (lyric) =>
        (lyric.japaneseWords.match(japaneseReg) || lyric.japanese.match(japaneseReg)) &&
        !hymmnosExactMatch.includes(lyric) &&
        !hymmnosMatch.includes(lyric)
    );
    return [...hymmnosExactMatch, ...hymmnosMatch, ...japaneseMatch];
  };
  return { getMatchHymmnos };
}