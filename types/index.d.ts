export type TJsonWord = {
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
export type TWord = TJsonWord & {
  // 以下useDictionaryでのみ使用
  subWords?: TWord[]; // 下位の単語
  primaryMeaning?: string; // 主たる意味
  emotionVowels?: (TEmotionVowel | undefined)[]; // 想母音
  possessiveOwner?: TWord | string; // 所有者
  voice?: string; // 態
};

export type TEmotionVowel = {
  vowel: string; // 母音,
  target: string; // 誰を表すか
  primaryEmotion: string; // 主たる感情
  emotions: string[]; // どんな感情か
};

export type TIdiom = {
  idiom: string[]; // 慣用句
  japanese: string[]; // 意味
  emotionVowelString?: string; // 想母音
  dialect: string;
};

export type TForelunaChar = {
  char: string; // 文字
  meaning: string; // 意味
};

export type TForelunaWord = {
  word: string; // 単語
  sections: TForelunaChar[][]; // 文字
  type: 'modifier' | 'executor' | null;
};

export type TArCielaChar = {
  input: string; // 入力文字
  char: string; // 文字
  caption: string | null; // 説明
  meanings: string[]; // 意味
  note?: string; // 備考
  session?: number; // セッション番号
  envelope?: 'quad' | 'dual' | 'single' | 'harf' | null; // エンベロープ
};

export type TArCielaWord = {
  word: string; // 単語
  chars: TArCielaChar[]; // 文字
};

export type TDialect = {
  name: string;
  japanese: string;
  color: string;
};

export type TLyric = {
  id?: number,
  musicId?: number,
  title?: string,
  language?: 'hymmnos' | 'foreluna',
  // ヒュムノス語歌詞
  lyric?: string,
  lyricWords?: string,
  // 訂正版ヒュムノス語歌詞
  correctionLyric?: string,
  // 日本語歌詞
  japanese?: string,
  japaneseRuby?: string,
  japaneseWords?: string,
  // 非公式フラグ
  unofficial?: {
    lyric?: boolean,
    japanese?: boolean,
  },
};

export type TMusic = {
  id: number;
  key: string;
  title: string;
  singer: string[];
  lyricist: string[];
  composer: string[];
  arranger: string[];
  releaseDate: string;
  tags: string[];
  explanation: string;
  feeling: string;
}; 