import _arciela from "~/assets/datas/arciela.json";
import type { TArcielaCharData } from "~/types";


export default function () {
  const arciela = _arciela as TArcielaCharData[];
  const emptyArcielaCharData: TArcielaCharData = { char: "", caption: "", meanings: [] };
  // アルシエラの単語を取得
  const getArcielaWord = (q: string): TArcielaCharData[] | undefined => {
    // コンパートメント記号に変換
    const text = compartmentToSymbol(q);
    // 文字ごとに意味を取得
    const chars = text.split("\r")
      .map(c => getArcielaChar(c))
      .filter(c => !!c) as TArcielaCharData[]; // 空の要素を削除

    return chars;
  };

  const getArcielaChar = (input: string): TArcielaCharData | undefined => {
    // 表記が正しいかチェック
    if (!input.match(/^[a-z]$/) && !input.match(/^(?!(a|i|u|e|o|n))[a-z](([\!\#\$\%\&\(\)])|\[s\-[0-4](\/(harf|single|dual|quad)\])?)/)) return emptyArcielaCharData;
    const c = compartmentToSymbol(input);
    const [fmcl] = c.match(/([\!\#\$\%])/gi) ?? [];
    const [amcl] = c.match(/([\&\(\)])/gi) ?? [];
    const [charStr] = c.match(/[a-z]/gi) ?? [];
    if (!charStr) return emptyArcielaCharData; // 英文字がない場合はスキップ
    if (charStr.match(/[aiueon]/i) && fmcl && amcl) return { ...emptyArcielaCharData, caption: "error" }; // 母音の場合はコンパートメント記号は不要
    const session = (() => {
      switch (fmcl) {
        case "!": return 1;
        case "#": return 2;
        case "$": return 3;
        case "%": return 4;
        default: return 0;
      }
    })();
    const envelope = (() => {
      switch (amcl) {
        case "&": return "quad";
        case "(": return "dual";
        case "\'": return "single";
        case ")": return "harf";
        default: return null;
      }
    })();
    const char = arciela.find(f => f.char.toLowerCase() === charStr.toLowerCase());// 各文字を取得(大文字小文字は問わない)
    if (!char) return emptyArcielaCharData;// 文字が見つからない場合はスキップ
    // セッション区域の意味を取得
    const sessionStart = session * 2 - 1 < 0 ? 0 : session * 2 - 1;
    const sessionEnd = session * 2 + 2 - 1 > char.meanings.length ? char.meanings.length : session * 2 + 2 - 1;
    const meanings = char.meanings.slice(sessionStart, sessionEnd).filter(s => s.length);
    return {
      char: input,
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

  const compartmentToSymbol = (char: string) => {
    return char.replace(/\[s\-0/g, "")
      .replace(/\[s\-1/g, "!")
      .replace(/\[s\-2/g, "#")
      .replace(/\[s\-3/g, "$")
      .replace(/\[s\-4/g, "%")
      .replace(/quad\]/g, "&")
      .replace(/dual\]/g, "(")
      .replace(/single\]/g, "")
      .replace(/harf\]/g, ")")
      .replace(/[\[\/\]]/g, "")
      .replace(/([\-\!\#\$\%\&\(\'\)])([a-z])/gi, "$1\r$2")
      .replace(/([a-z])([a-z])/gi, "$1\r$2")
      .replace(/([a-z])([a-z])/gi, "$1\r$2")
      .replace(/\r+/g, "\r");
  };

  return { getArcielaWord, arcielaChars: arciela, sessionToSymbol, getArcielaChar };
};
