
import _lyrics from "@/assets/datas/lyrics.json";
import _musics from "@/assets/datas/musics.json";
import type { TLyric, TMusic } from "~/types";

// meaningをmeaningsに変更
const allLyrics = _lyrics.map((lyric, id) => ({
  ...lyric,
  id,
})) as TLyric[]; // ヒュムノス語歌詞があるもの
const musics = _musics as TMusic[];
export default function useLyrics() {
  const getMatch = (lyrics: TLyric[], q: string) => {
    // 正規表現のエスケープ
    q = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const reg = new RegExp(q, 'gi');
    // 完全一致の例文を取得
    const exactLyricMatch = lyrics.filter((lyric) =>
      lyric.lyricWords?.match(" " + q.toLocaleLowerCase() + " ") ||
      lyric.correctionLyric?.match(" " + q.toLocaleLowerCase() + " ")
    );
    // 部分一致の例文を取得
    const lyricMatch = lyrics.filter(
      (lyric) =>
        (lyric.lyricWords?.match(reg) || lyric.correctionLyric?.match(reg)) &&
        !exactLyricMatch.includes(lyric)
    );
    // 日本語の例文を取得
    const japaneseReg = new RegExp(q.replace(/:/, "\\$1"), 'gi');
    const japaneseMatch = lyrics.filter(
      (lyric) =>
        (lyric.japaneseWords?.match(japaneseReg) || lyric.japanese?.match(japaneseReg)) &&
        !exactLyricMatch.includes(lyric) &&
        !lyricMatch.includes(lyric)
    );
    // 重複削除
    const matches = [...exactLyricMatch, ...lyricMatch, ...japaneseMatch].filter((match, index, self) =>
      index === self.findIndex((t) => t.id === match.id)
    );
    return matches.map((match) => {
      const music = musics.find((music) => music.id === match.musicId);
      return {
        ...match,
        ...(music ? { musicKey: music.key, title: music.title } : {}),
      };
    });
  };

  const getMatchHymmnos = (q: string) => {
    return getMatch(allLyrics.filter(lyric => lyric.language === 'hymmnos'), q);
  };


  const getMatchForeluna = (q: string) => {
    return getMatch(allLyrics.filter(lyric => lyric.language === 'foreluna'), q);
  };

  const getFromMusicKey = (key: string): { lyrics: TLyric[], music: TMusic | null; } => {
    const music = musics.find((music) => music.key === key);
    if (!music) return { lyrics: [], music: null };
    return {
      lyrics: allLyrics.filter(lyric => lyric.musicId === music?.id),
      music,
    };
  };

  return { getMatchHymmnos, getMatchForeluna, getFromMusicKey };
}