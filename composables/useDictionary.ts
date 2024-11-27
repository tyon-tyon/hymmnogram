import _words from "@/assets/datas/words.json";
import type { TJsonWord, TWord, TEmotionVowel } from "~/types";

const emotionVowels = "(LY|Y)?[AIUEON]";

export default function () {
  // ローカルストレージから単語データを取得
  const words = useState<TWord[]>('words', () => _words as TWord[]);

  // 完全一致の単語を取得
  const getExactMatch = (q: string, dialect?: string): TWord | undefined => {
    if (!q.length) return undefined;
    // パスタリエの所有格
    const possessive = getWordPossessive(q);
    if (possessive) return possessive;

    // パスタリエの想音動詞
    const emotionVerb = getWordEmotionVerb(q);
    if (emotionVerb) return emotionVerb;

    // 通常の完全一致
    const exactMatch = getWordExactMatch(q, dialect);
    if (exactMatch) return exactMatch;
  };

  // 部分一致の単語を取得
  const getPartialMatch = (query: string): TWord[] => {
    const lowerCaseQuery = query.toLowerCase();
    return words.value.filter(w =>
      w.hymmnos.toLowerCase().includes(lowerCaseQuery) ||
      w.japanese.some(m => m.toLowerCase().includes(lowerCaseQuery)) ||
      w.gerunds?.some(g => g.toLowerCase().includes(lowerCaseQuery)) ||
      w.pronunciation?.toLowerCase().includes(lowerCaseQuery) ||
      w.part_of_speech.toLowerCase().includes(lowerCaseQuery)
    );
  };
  const emptyWordData: TWord = { hymmnos: "", japanese: [], part_of_speech: "", dialect: "", primaryMeaning: "" };

  // 単語データを更新
  const updateWords = (originalWords: TJsonWord[]) => {
    words.value = [..._words, ...originalWords];
  };

  /*
  ここから下は、関数内でのみ使用される関数
  */

  // 通常の完全一致
  function getWordExactMatch(q: string, dialect?: string): TWord | undefined {
    const lowerCaseWord = q.toLowerCase();
    const exactMatchFounds = words.value.filter(w => w.hymmnos.toLowerCase() === lowerCaseWord);
    const found =
      exactMatchFounds.length === 0 ? undefined : // 見つからなかった場合はundefined
        exactMatchFounds.length === 1 ? exactMatchFounds[0] : // 1つ見つかった場合はその単語を返す
          exactMatchFounds.find(w => w.dialect === dialect) ?? exactMatchFounds[0]; // 複数見つかった場合は流派が一致するものを返す
    // 完全一致の単語が見つかった場合
    if (found) {
      let primaryMeaning = "";
      if (found.part_of_speech === "動詞") {
        // パスタリエの動詞の場合は、主たる意味をgerunds[0]に設定
        primaryMeaning = found.gerunds?.[0] ?? found.japanese[0];
      } else {
        // それ以外の場合は主たる意味をjapanese[0]に設定
        primaryMeaning = found.japanese[0];
      }
      return {
        ...found,
        hymmnos: q,
        primaryMeaning,
      };
    }
    // 単語が見つからない場合は_,=で分割して検索
    const founds = q.split(/[_=]/g)
      .map(str => words.value.filter(w => w.hymmnos.toLowerCase() === str.toLowerCase())[0]);
    // 全ての単語がundefinedの場合は見つからなかったと判断
    if (founds.every(f => !f)) return;
    if (founds.length) {
      const subWords = q
        .split(/[_=]/g)
        .map(str =>
          words.value.filter(w => w.hymmnos.toLowerCase() === str.toLowerCase())[0] ??
          { ...emptyWordData, hymmnos: str, japanese: [str] }
        );
      // 単語が見つかった場合は複合語として返す
      return {
        hymmnos: q,
        primaryMeaning: subWords.map(f => f.japanese[0]).join("・"),
        japanese: [],
        pronunciation: "",
        part_of_speech: "複合語",
        dialect: "unknown",
        subWords: subWords
      };
    }
  }

  // パスタリエ想音動詞の単語を取得
  function getWordEmotionVerb(q: string): TWord | undefined {
    // 末尾がehの場合は受動態の可能性があるので、ehを抜いて再検索
    if (q.match(/eh$/)) {
      const emotionVerb = getWordEmotionVerb(q.replace(/eh$/, ""));
      if (emotionVerb) {
        return {
          ...emotionVerb,
          hymmnos: q,
          primaryMeaning: emotionVerb.japanese[0] + " 〜される",
          voice: "受動",
        };
      }
    }
    // 末尾がzaの場合は動名詞の可能性があるので、zaを抜いて再検索
    if (q.match(/za$/)) {
      const emotionVerb = getWordEmotionVerb(q.replace(/za$/, ""));
      if (emotionVerb) {
        return {
          ...emotionVerb,
          hymmnos: q,
          primaryMeaning: emotionVerb.japanese[0] + " 〜すること",
          voice: "動名詞",
        };
      }
    }

    // パスタリエの動詞を取得
    const pastalieVerbs = words.value
      // ピリオドのある動詞のうち
      .filter(w => w.hymmnos.match(/\./))
      // ピリオドを抜いた動詞と、想母音を抜いたqが一致するものを取得
      .filter(w => q.replace(new RegExp(emotionVowels, "g"), "") === w.hymmnos.replace(/\./g, ""));

    for (const pastalieVerb of pastalieVerbs) {
      // ピリオドを想母音に置き換える
      const reg = pastalieVerb.hymmnos.replace(/\./g, "(" + emotionVowels + ")?");
      // qと一致するか
      const match = q.match(new RegExp("^" + reg + "$"));
      if (match) {
        // 想母音を取得
        const emotionVowels = match.filter((m, i) => i % 2);
        // 全てundefinedの場合は想音動詞ではない
        if (emotionVowels.every(v => !v)) return;
        // 想母音から意味を取得
        const emotionVowelMeanings = emotionVowels.map((v) => v ? getEmotionVowel(v) : undefined);
        return {
          ...pastalieVerb,
          hymmnos: q,
          voice: "想音動詞",
          emotionVowels: emotionVowelMeanings,
          subWords: [pastalieVerb],
          primaryMeaning: pastalieVerb.japanese[0],
        };
      }
    }
  }


  // パスタリエ所有格の単語を取得
  function getWordPossessive(q: string): TWord | undefined {
    const possessive = q.match(new RegExp(`^(${emotionVowels})([a-zA-Z\.=_]+)$`));
    let possessiveOwner: TWord | undefined;
    let possessiveWord: TWord | undefined;
    const subWords: TWord[] = [];

    // 所有格の形式に合わない場合はパスタリエ所有格ではない
    if (!possessive) return;
    const emotionVowel = possessive[1]; // 想母音

    let [, wordSrt, ownerStr] = possessive[3].match(/([a-zA-Z\.=]+)_?([a-zA-Z\.=]+)?/) ?? [];// 単語, 所有者

    // 単語を取得
    possessiveWord = getWordExactMatch(wordSrt);
    // 単語が見つからない場合はパスタリエ所有格ではない
    if (!possessiveWord) return;
    // 単語が見つかった場合はsubWordsに追加
    subWords.push(possessiveWord);

    if (ownerStr) {
      // 所有者がいる場合は完全一致で単語を検索
      possessiveOwner = getWordExactMatch(ownerStr);
      if (possessiveOwner) {
        // 所有者の単語が見つかった場合はその意味を設定
        ownerStr = possessiveOwner.primaryMeaning ?? possessiveOwner.japanese[0];
      } else {
        // 所有者の単語が見つからない場合はEmpyWordDataを設定
        possessiveOwner = { ...emptyWordData, hymmnos: ownerStr };
      }
      // subWordsを設定
      if (possessiveOwner.subWords) {
        subWords.push(...possessiveOwner.subWords);
      } else {
        subWords.push(possessiveOwner);
      }
    } else {
      // 所有者がいない場合は想母音から推測
      ownerStr = getEmotionVowel(emotionVowel)?.target ?? "不明";
    }

    return {
      hymmnos: q,
      japanese: [],
      primaryMeaning: ownerStr + "の" + possessiveWord.japanese[0],
      part_of_speech: "所有格名詞",
      dialect: "pastalie",
      possessiveOwner: possessiveOwner ?? ownerStr,
      subWords,
      emotionVowels: [getEmotionVowel(emotionVowel)],
    };

  }

  function getEmotionVowel(emotionVowel: string): TEmotionVowel | undefined {
    // 誰を表すか
    let target = "";
    if (emotionVowel.match(/^LY/)) {
      target = "みんな";
    } else if (emotionVowel.match(/^Y/)) {
      target = "あなた";
    } else if (emotionVowel.match(/^[AIUEON]/)) {
      target = "私";
    }
    // どんな感情か
    if (emotionVowel.match(/A$/)) {
      return { vowel: emotionVowel, target, primaryEmotion: "力", emotions: ["力", "懸命", "集中"] };
    } else if (emotionVowel.match(/I$/)) {
      return { vowel: emotionVowel, target, primaryEmotion: "苦痛", emotions: ["苦痛", "逃げたい", "恐怖"] };
    } else if (emotionVowel.match(/U$/)) {
      return { vowel: emotionVowel, target, primaryEmotion: "悲しみ", emotions: ["悲しみ", "憂い", "心配"] };
    } else if (emotionVowel.match(/E$/)) {
      return { vowel: emotionVowel, target, primaryEmotion: "喜び", emotions: ["喜び", "幸せ", "快楽"] };
    } else if (emotionVowel.match(/O$/)) {
      return { vowel: emotionVowel, target, primaryEmotion: "怒り", emotions: ["怒り", "攻撃的", "呪い"] };
    } else if (emotionVowel.match(/N$/)) {
      return { vowel: emotionVowel, target, primaryEmotion: "無", emotions: ["無", "放心", "リラックス"] };
    }
    return;
  }

  return { getExactMatch, getPartialMatch, emptyWordData, updateWords };
}
