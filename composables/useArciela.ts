import _arciela from "~/assets/datas/arciela.json";
import type { TArcielaCharData } from "~/types";


export default function () {
  const arciela = _arciela as TArcielaCharData[];
  const emptyArcielaCharData: TArcielaCharData = { input: null, char: "", caption: null, meanings: [] };
  // アルシエラの単語を取得
  const getArcielaWord = (q: string): TArcielaCharData[] => {
    // コンパートメント記号に変換
    const text = q
      .replace(/([\!\#\$\%\&\(\)])([a-z])/gi, "$1|$2")
      .replace(/(\[s\-[0-4](\/(harf|single|dual|quad))?\])([a-z])/gi, "$1|$4")
      .replace(/([a-z])([a-z])/gi, "$1|$2")
      .replace(/([a-z])([a-z])/gi, "$1|$2");
    // 文字ごとに意味を取得
    const chars = text.split("|")
      .map(c => ({ ...getArcielaChar(c), input: c }));

    return chars;
  };

  const getArcielaChar = (input: string): TArcielaCharData => {
    // 表記が正しいかチェック
    if (
      !input.match(/^[a-z]$/) // 英文字のみでなく
      && !input.match(/^(?!(a|i|u|e|o|n))[a-z](([\!\#\$\%\&\(\)]{1,2})|\[s\-[0-4](\/(harf|single|dual|quad))?\])$/) // コンパートメント記号が正しくない
    ) return { ...emptyArcielaCharData, input };
    const [charStr] = input.replace(/s-1/, '').match(/[a-z]/gi) ?? [];
    if (!charStr) return emptyArcielaCharData; // 英文字がない場合はスキップ
    const session = (() => {
      if (input.match(/(s-1|\!)/)) return 1;
      if (input.match(/(s-2|\#)/)) return 2;
      if (input.match(/(s-3|\$)/)) return 3;
      if (input.match(/(s-4|\%)/)) return 4;
      return 0;
    })();
    const envelope = (() => {
      if (input.match(/(quad|\&)/)) return "quad";
      if (input.match(/(dual|\()/)) return "dual";
      if (input.match(/(harf|\))/)) return "harf";
      return "single";
    })();
    const char = arciela.find(f => f.char?.toLowerCase() === charStr.toLowerCase());// 各文字を取得(大文字小文字は問わない)
    if (!char) return emptyArcielaCharData;// 文字が見つからない場合はスキップ
    // セッション区域の意味を取得
    const sessionStart = session * 2 - 1 < 0 ? 0 : session * 2 - 1;
    const sessionEnd = session * 2 + 2 - 1 > char.meanings.length ? char.meanings.length : session * 2 + 2 - 1;
    const meanings = char.meanings.slice(sessionStart, sessionEnd).filter(s => s.length);
    return {
      input,
      char: charStr,
      // セッション区域に意味がない場合はキャプションを仮表示
      caption: meanings.length ? meanings.join("/") : `(${char.caption})`,
      meanings: char.meanings,
      note: char.note,
      session,
      envelope,
    };
  };

  const sessionToSymbol = (session: number) => {
    switch (session) {
      case 0: return '';
      case 1: return "!";
      case 2: return "#";
      case 3: return "$";
      case 4: return "%";
      default: return '';
    }
  };

  return { getArcielaWord, arcielaChars: arciela, sessionToSymbol, getArcielaChar };
};
