
import _lyricsHymmnos from "@/assets/datas/lyrics_hymmnos.json";
import _lyricsForeluna from "@/assets/datas/lyrics_foreluna.json";
import type { TLyric } from "~/types";

// meaningをmeaningsに変更
const lyricsHymmnos = _lyricsHymmnos as TLyric[];
const lyricsForeluna = _lyricsForeluna as TLyric[];

export default function useLyrics() {
  const getMatch = (lyrics: TLyric[], q: string) => {
    // 正規表現のエスケープ
    q = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const reg = new RegExp(q, 'gi');
    // 完全一致の例文を取得
    const exactLyricMatch = lyrics.filter((lyric) =>
      lyric.lyricWords.match(" " + q.toLocaleLowerCase() + " ") ||
      lyric.correctionWords?.match(" " + q.toLocaleLowerCase() + " ")
    );
    // 部分一致の例文を取得
    const lyricMatch = lyrics.filter(
      (lyric) =>
        (lyric.lyric.match(reg) || lyric.correction?.match(reg)) &&
        !exactLyricMatch.includes(lyric)
    );
    // 日本語の例文を取得
    const japaneseReg = new RegExp(q.replace(/:/, "\\$1"), 'gi');
    const japaneseMatch = lyrics.filter(
      (lyric) =>
        (lyric.japaneseWords.match(japaneseReg) || lyric.japanese.match(japaneseReg)) &&
        !exactLyricMatch.includes(lyric) &&
        !lyricMatch.includes(lyric)
    );
    return [...exactLyricMatch, ...lyricMatch, ...japaneseMatch];
  };

  const getMatchHymmnos = (q: string) => {
    return getMatch(lyricsHymmnos, q);
  };


  const getMatchForeluna = (q: string) => {
    return getMatch(lyricsForeluna, q);
  };

  return { getMatchHymmnos, getMatchForeluna };
}