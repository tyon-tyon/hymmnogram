import _arciela from "~/assets/datas/arciela.json";
import type { TArcielaChar, TArcielaWord } from "~/types";


export default function () {
  const arciela = _arciela as TArcielaChar[];
  const emptyArcielaCharData: TArcielaChar = { input: "", char: "", caption: null, meanings: [] };
  const emptyArcielaWordData: TArcielaWord = { word: "", chars: [] };
  const envelopes = ["harf", "single", "dual", "quad"];
  // アルシエラの単語を取得
  const getArcielaWord = (q: string, noCompartment?: boolean): TArcielaWord => {
    // コンパートメント表記で分割
    const strChars = [];
    const compartmentStrs = q.replace(/(\[s\-[0-4](\/(harf|single|dual|quad))?\])([a-z])/gi, "$1|$4").split("|");
    for (const c of compartmentStrs) {
      // コンパートメント表記を退避
      const [alphabet, compartment] = c.replace(/([a-z])(\[s\-[0-4](\/(harf|single|dual|quad))?\])/gi, "$1|$2").split("|");
      // alphabet部分を分割
      const alphabetChars = alphabet
        .replace(/([a-z])([\!\#\$\%\&\(\)])/gi, "$1|$2")
        .replace(/([a-z])([a-z])/gi, "$1|$2")
        .replace(/([a-z])([a-z])/gi, "$1|$2").split("|");
      // strCharsを更新
      for (let i = 0; i < alphabetChars.length; i++) {
        // 末尾の文字にはコンパートメントを追加
        if (i === alphabetChars.length - 1 && compartment) {
          strChars.push(alphabetChars[i] + compartment);
        } else {
          strChars.push(alphabetChars[i]);
        }
      }
    }
    // 文字ごとに意味を取得
    const chars = strChars.map(c => ({ ...getArcielaChar(c, noCompartment), input: c }));
    return {
      word: q,
      chars,
    };
  };

  const getArcielaChar = (input: string, noCompartment?: boolean): TArcielaChar => {
    // 表記が正しいかチェック
    if (
      input.match(/^[a-zA-Z]$/) // 英文字のみ
      || input.match(/^[\!\#\$\%\&\(\)]{1,2}[a-zA-Z]$/) // 記号表記
      || input.match(/^[a-zA-Z]\[s\-[0-4](\/(harf|single|dual|quad))?\]$/) // コンパートメント記号が正しい
    ) {
      // 正
    } else {
      return { ...emptyArcielaCharData, input };
    }
    const [charStr] = input.replace(/s-[0-4]/, '').match(/[a-z]/gi) ?? [];
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
    // コンパートメントを考慮しない場合はそのまま返す
    if (noCompartment) return {
      ...char,
      input,
      char: charStr,
    };

    // セッション区域の意味を取得
    const sessions = getSessions(char.meanings);
    const meanings = sessions[session].filter(s => s.length);
    return {
      input,
      char: charStr,
      // セッション区域に意味がない場合はキャプションを仮表示
      caption: charStr.match(/^[aiueon]$/i) ? char.caption :
        meanings.length ? meanings.join("/") : `(${char.caption})`,
      meanings: char.meanings,
      note: char.note,
      session: charStr.match(/^[aiueon]$/i) ? undefined : session,
      envelope: charStr.match(/^[aiueon]$/i) ? undefined : envelope,
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

  const envelopeToSymbol = (envelope: TArcielaChar['envelope']) => {
    switch (envelope) {
      case "harf": return ")";
      case "single": return "";
      case "dual": return "(";
      case "quad": return "&";
      default: return "";
    }
  };

  const getSessions = (meanings: string[]) => {
    return [
      meanings.slice(0, 1),
      meanings.slice(1, 3),
      meanings.slice(3, 5),
      meanings.slice(5, 7),
      meanings.slice(7, 9),
    ];
  };

  const getCompartmentStr = (char: string, session?: number, envelope?: TArcielaChar['envelope']) => {
    char = char.toLowerCase();
    if (char.match(/^[aiueon]$/i)) return char;
    if (session === undefined) return char;
    if (envelope) return `${char}[s-${session}/${envelope}]`;
    return `${char}[s-${session}]`;
  };

  const geFontStr = (char: string, session?: number, envelope?: TArcielaChar['envelope']) => {
    char = char.toLowerCase();
    if (char.match(/[aiueon]/i)) return char;
    const sessionSimbol = sessionToSymbol(session ?? 0);
    const envelopeSimbol = envelopeToSymbol(envelope ?? 'single');
    return `${sessionSimbol}${envelopeSimbol}${char}`;
  };

  return { getArcielaWord, arcielaChars: arciela, getArcielaChar, getSessions, envelopes, getCompartmentStr, geFontStr, emptyArcielaWordData, emptyArcielaCharData };
};
