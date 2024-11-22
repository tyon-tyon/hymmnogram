export type TJsonWordData = {
  hymmnos: string; // 単語
  japanese: string[]; // 意味
  pronunciation?: string | null; // 発音
  gerunds?: string[]; // パスタリエ 名詞化した場合の意味
  part_of_speech: string; // 品詞
  dialect: string;
  origin?: string; // アルファ律の場合のオリジン
  notes?: string; // 備考
  explanation?: string; // 説明
};
export type TWordData = TJsonWordData & {
  // 以下useDictionaryでのみ使用
  subWords?: TWordData[]; // 下位の単語
  primaryMeaning?: string; // 主たる意味
  emotionVowels?: (TEmotionVowelMeaning | undefined)[]; // 想母音
  possessiveOwner?: TWordData | string; // 所有者
  voice?: string; // 態
};

export type TEmotionVowelMeaning = {
  target: string; // 誰を表すか
  primaryEmotion: string; // 主たる感情
  emotions: string[]; // どんな感情か
};

export type TJsonExampleData = {
  title: string,
  hymmnos: string,
  hymmnos_base: string,
  japanese: string,
  japanese_base: string,
};

export type TLyric = {
  title: string,
  lyric: string,
  lyricWords: string,
  japanese: string,
  japaneseWords: { basic: string; surface: string; }[],
  japaneseWordsStr: string,
};

export type TForelunaCharData = {
  char: string; // 文字
  meaning: string; // 意味
};

export type TForelunaWordData = {
  word: string; // 単語
  sections: TForelunaCharData[][]; // 文字
  type: 'modifier' | 'executor' | null;
};

export type TArcielaCharData = {
  input: string; // 入力文字
  char: string; // 文字
  caption: string | null; // 説明
  meanings: string[]; // 意味
  note?: string; // 備考
  session?: number; // セッション番号
  envelope?: 'quad' | 'dual' | 'single' | 'harf' | null; // エンベロープ
};

export type TArcielaWordData = {
  word: string; // 単語
  chars: TArcielaCharData[]; // 文字
};

export type TDialectData = {
  name: string;
  japanese: string;
  color: string;
};