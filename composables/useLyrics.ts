import _lyrics from "@/assets/datas/lyrics.json";
import _musics from "@/assets/datas/musics.json";
import _music_tags from "@/assets/datas/music_tags.json";
import type { TLyric, TMusic, TMusicTag } from "~/types";

// meaningをmeaningsに変更
export const allLyrics = _lyrics.map((lyric, id) => ({
  ...lyric,
  id,
})) as TLyric[]; // ヒュムノス語歌詞があるもの
export const musics = _musics as TMusic[];
export default function useLyrics() {
  const getMatch = (lyrics: TLyric[], q: string) => {
    // 正規表現のエスケープ
    q = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const reg = new RegExp(q, 'gi');
    // 完全一致の例文を取得
    const exactLyricMatch = lyrics.filter((lyric) =>
      lyric.lyricWords?.match(" " + q.toLocaleLowerCase() + " ") ||
      lyric.correction?.lyricWords?.match(" " + q.toLocaleLowerCase() + " ")
    );
    // 部分一致の例文を取得
    const lyricMatch = lyrics.filter(
      (lyric) =>
        (
          lyric.lyricWords?.match(reg) ||
          lyric.correction?.lyricWords?.match(reg)
        ) &&
        !exactLyricMatch.includes(lyric)
    );
    // 日本語の用例はOR検索をする
    const japaneseWords = q.replace(/　/g, " ").split(" ");
    // 日本語の例文を取得
    const japaneseReg = new RegExp(japaneseWords.join("|"), 'gi'); 
    const japaneseMatch = japaneseWords.map(word => lyrics.filter(lyric =>
      lyric.japaneseWords?.match(japaneseReg) ||
      lyric.correction?.japaneseWords?.match(japaneseReg) ||
      lyric.japanese?.match(japaneseReg) ||
      lyric.correction?.japanese?.match(japaneseReg)
    )).flat();
    // 重複削除
    const matches = [...new Set([...exactLyricMatch, ...lyricMatch, ...japaneseMatch])];
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

  const getMusicTags = (): TMusicTag[] => {
    const tags = musics.map(music =>
      [...music.tags, ...music.arranger, ...music.composer, ...music.lyricist]
    ).flat().filter((tag, index, self) => self.indexOf(tag) === index);
    const musicTags = _music_tags;
    musicTags.push({
      category: 'その他',
      tags: tags.filter(tag => !musicTags.some(t => t.tags.includes(tag)))
    });
    return musicTags;
  };

  const getMusicByTag = (tag?: string) => {
    if (!tag) return musics;
    return musics.filter(music =>
      music.tags.includes(tag) ||
      music.arranger.includes(tag) ||
      music.composer.includes(tag) ||
      music.lyricist.includes(tag) ||
      music.singer.includes(tag)
    );
  };

  return { getMatchHymmnos, getMatchForeluna, getMusicTags, getMusicByTag };
}