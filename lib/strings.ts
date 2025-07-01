// ローマ字からかなに変換するマップ
const kanaMap = {
  q: ["くぁ", "くぃ", "く", "くぇ", "くぉ"],
  qy: ["きゃ", "き", "きゅ", "きぇ", "きょ"],
  w: ["わ", "うぃ", "う", "うぇ", "うぉ"],
  r: ["ら", "り", "る", "れ", "ろ"],
  ry: ["りゃ", "り", "りゅ", "りぇ", "りょ"],
  t: ["た", "てぃ", "とぅ", "て", "と"],
  ts: ["つぁ", "つぃ", "つぅ", "つぇ", "つぉ"],
  ty: ["てゃ", "てぃ", "てゅ", "てぃぇ", "てょ"],
  th: ["ざ", "じ", "ず", "ぜ", "ぞ"],
  tw: ["とぁ", "とぃ", "とぅ", "とぇ", "とぉ"],
  y: ["や", "い", "ゆ", "いぇ", "よ"],
  p: ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],
  py: ["ぴゃ", "ぴ", "ぴゅ", "ぴぇ", "ぴょ"],
  ph: ["ふぁ", "ふぃ", "ふ", "ふぇ", "ふぉ"],
  s: ["さ", "し", "す", "せ", "そ"],
  sy: ["しゃ", "し", "しゅ", "しぇ", "しょ"],
  sh: ["しゃ", "し", "しゅ", "しぇ", "しょ"],
  sw: ["すぁ", "すぃ", "す", "すぇ", "すぉ"],
  d: ["だ", "ぢ", "づ", "で", "ど"],
  dy: ["でゃ", "で", "でゅ", "でぇ", "でょ"],
  dh: ["だ", "ぢ", "づ", "で", "ど"],
  dw: ["づぁ", "づぃ", "づ", "づぇ", "づぉ"],
  f: ["ふぁ", "ふぃ", "ふ", "ふぇ", "ふぉ"],
  fy: ["ふゃ", "ふ", "ふゅ", "ふぇ", "ふょ"],
  fh: ["ふぁ", "ふぃ", "ふ", "ふぇ", "ふぉ"],
  g: ["が", "ぎ", "ぐ", "げ", "ご"],
  gy: ["ぎゃ", "ぎ", "ぎゅ", "ぎぇ", "ぎょ"],
  gw: ["ぐぁ", "ぐぃ", "ぐ", "ぐぇ", "ぐぉ"],
  h: ["は", "ひ", "ふ", "へ", "ほ"],
  hy: ["ひゃ", "ひ", "ひゅ", "ひぇ", "ひょ"],
  hw: ["ふぁ", "ふぃ", "ふ", "ふぇ", "ふぉ"],
  j: ["じゃ", "じ", "じゅ", "じぇ", "じょ"],
  jy: ["じゃ", "じ", "じゅ", "じぇ", "じょ"],
  k: ["か", "き", "く", "け", "こ"],
  ky: ["きゃ", "き", "きゅ", "きぇ", "きょ"],
  kh: ["くぁ", "くぃ", "く", "くぇ", "くぉ"],
  kw: ["くぁ", "くぃ", "く", "くぇ", "くぉ"],
  l: ["ら", "り", "る", "れ", "ろ"],
  ly: ["りゃ", "り", "りゅ", "りぇ", "りょ"],
  z: ["ざ", "じ", "ず", "ぜ", "ぞ"],
  zy: ["じゃ", "じ", "じゅ", "じぇ", "じょ"],
  zh: ["ざ", "じ", "ず", "ぜ", "ぞ"],
  x: ["ざ", "じ", "ず", "ぜ", "ぞ"],
  c: ["か", "し", "く", "せ", "こ"],
  cy: ["ちゃ", "ち", "ちゅ", "ちぇ", "ちょ"],
  ch: ["ちゃ", "ち", "ちゅ", "ちぇ", "ちょ"],
  v: ["ゔぁ", "ゔぃ", "ゔ", "ゔぇ", "ゔぉ"],
  vy: ["ゔゃ", "ゔぃ", "ゔゅ", "ゔぇ", "ゔょ"],
  b: ["ば", "び", "ぶ", "べ", "ぼ"],
  by: ["びゃ", "び", "びゅ", "びぇ", "びょ"],
  n: ["な", "に", "ぬ", "ね", "の"],
  ny: ["にゃ", "に", "にゅ", "にぇ", "にょ"],
  nh: ["にぁ", "に", "にぅ", "にぇ", "にぉ"],
  m: ["ま", "み", "む", "め", "も"],
  my: ["みゃ", "み", "みゅ", "みぇ", "みょ"],
};
// 子音だけの音を変換するマップ
const consonantMap = {
  q: "く",
  qy: "きぃ",
  w: "う",
  r: "る",
  ry: "り",
  t: "と",
  ty: "てぃ",
  th: "てぃ",
  tw: "とぅ",
  y: "い",
  p: "ぷ",
  py: "ぴ",
  ph: "ふ",
  s: "す",
  sy: "し",
  sh: "し",
  sw: "す",
  d: "ど",
  dy: "でぃ",
  dh: "ど",
  dw: "ど",
  f: "ふ",
  fy: "ふぃ",
  fh: "ふぅ",
  g: "ぐ",
  gy: "ぎ",
  gw: "ぐ",
  h: "ふ",
  hy: "ひ",
  hw: "ふ",
  j: "じ",
  jy: "じ",
  k: "く",
  ky: "き",
  kh: "く",
  kw: "く",
  l: "る",
  ly: "り",
  z: "ず",
  zy: "じ",
  zh: "ず",
  x: "ず",
  c: "く",
  cy: "ち",
  ch: "ち",
  v: "ゔ",
  vy: "ゔぃ",
  b: "ぶ",
  by: "び",
  n: "ん",
  ny: "に",
  nh: "に",
  m: "む",
  my: "み",
  a: "あ",
  i: "い",
  u: "う",
  e: "え",
  o: "お",
  "0": " ネル ",
  "1": " ノイ ",
  "2": " ジ ",
  "3": " ドリ ",
  "4": " フェフ ",
  "5": " ヴィラ ",
  "6": " イクサ ",
  "7": " へプト ",
  "8": " オクタ ",
  "9": " ネイ ",
};
// 母音
const vowelMap = {
  a: "あ",
  i: "い",
  u: "う",
  e: "え",
  o: "お",
};
// キーの文字数が多い順に並べ替える関数
const sortByLength = (map: Record<string, any>) => {
  return Object.entries(map).sort((a, b) => b[0].length - a[0].length);
};

// バイナリの読み専門
const convertBinaryToKana = (binary: string) => {
  const binaryMap = {
    "0": " オ ",
    "1": " イ ",
    x: " グ "
  };
  return binary.split("").map((char) => binaryMap[char as keyof typeof binaryMap]).join("").replace(/ +/g, " ");
};

// ローマ字からかなに変換する関数
export const convertKana = (roman: string) => {
  roman = roman.toLowerCase();
  if(roman.match(/^[01x ]+$/)){
    return convertBinaryToKana(roman);
  }
  const sortedKanaMap = sortByLength(kanaMap);
  const sortedConsonantMap = sortByLength(consonantMap);

  const parts:string[] = [];
  let currentPart = "";
  for (const char of roman) {
    // 母音ごとに処理をする
    if (vowelMap[char as keyof typeof vowelMap]) {
      let kana = "";
      // 母音のインデックス
      const vowelIndex = Object.keys(vowelMap).indexOf(char);
      // currentPartの末尾がマッチするkanaMapのキーを探す
      const index = sortedKanaMap.findIndex(([key]) => currentPart.endsWith(key));
      if (index !== -1) {
        const key = sortedKanaMap[index][0];
        kana = kanaMap[key as keyof typeof kanaMap][vowelIndex];
        // currentPartからマッチしたやつを削除
        currentPart = currentPart.slice(0, -key.length);
      }else{
        // マッチしない場合は、currentPartに母音を追加
        currentPart += char;
      }
      let consonant = "";
      while (currentPart.length > 0) {
        const index = sortedConsonantMap.findIndex(([key]) => currentPart.startsWith(key));
        if (index !== -1) {
          const key = sortedConsonantMap[index][0];
          consonant += consonantMap[key as keyof typeof consonantMap];
          currentPart = currentPart.slice(key.length); 
        } else {
          // マッチしない場合は無限ループを避けるため処理を終了
          break;
        }
      }
      parts.push(consonant + kana);
    }else{
      currentPart += char;
    }
  }
  if(currentPart.length > 0){
    let consonant = "";
    while (currentPart.length > 0) {
      const index = sortedConsonantMap.findIndex(([key]) => currentPart.startsWith(key));
      if (index !== -1) {
        const key = sortedConsonantMap[index][0];
        consonant += consonantMap[key as keyof typeof consonantMap];
        currentPart = currentPart.slice(key.length); 
      } else {
        // マッチしない場合は無限ループを避けるため処理を終了
        break;
      }
    }
    parts.push(consonant);
  }
  return parts.join("").replace(/ +/g, " ");
};
