import kuromoji from 'kuromoji';
import { TLyric } from '../../types';
import fs from 'fs';
import useTextProcessor from './useTextProcessor.js';
import useDictionary from './useDictionary.js';

const { getExactMatch } = useDictionary();
const { splitHymmnos, splitForeluna } = useTextProcessor();

const builder = kuromoji.builder({
  dicPath: 'node_modules/kuromoji/dict'
});

const tokenize = (text: string) => {
  return new Promise((resolve, reject) => {
    builder.build((err, tokenizer) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        var tokens = tokenizer.tokenize(text);
        resolve(tokens);
      } catch (err) {
        resolve([{ basic_form: text }]);
      }
    });
  });
};

const lyricsForeluna: TLyric[] = [];
const lyricsHymmnos: TLyric[] = [];
main();
async function main() {
  await readLyrics('./in/lyrics');
  console.log(lyricsForeluna.length, lyricsHymmnos.length);
  fs.writeFileSync('./out/lyrics_foreluna.json', JSON.stringify(lyricsForeluna, null, 2));
  fs.writeFileSync('./out/lyrics_hymmnos.json', JSON.stringify(lyricsHymmnos, null, 2));
}

// ./in/lyrics/ 配下の.hymファイルを名前順で再起的に読み込む
async function readLyrics(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const path = dir + '/' + file;
    if (fs.statSync(path).isDirectory()) {
      await readLyrics(path);
    } else if (file.match(/\.hym$/)) {
      // ここで処理を行う
      await addLyrics(path);
    }
  }
};

// ファイルから lyricsHymmnos に追加する関数
async function addLyrics(filename: string) {
  // タイトルはファイル名から取得
  // ファイルを空白行で分割
  const lines = fs.readFileSync(filename, 'utf-8')
    .split('\n\n')
    .map((line: any) => {
      return line.split('\n');
    });
  // index 0は長さ1のタイトルなので取得して削除
  const title = lines.shift()[0];

  // 各行を処理
  for (const line of lines) {
    const { lyric, isHymmnos, isForeluna } = await getLyric(title, line);
    if (isHymmnos) {
      lyricsHymmnos.push(lyric);
    }
    if (isForeluna) {
      lyricsForeluna.push(lyric);
    }
    console.log(title, lyric.lyric, lyric.japanese);
  }
};

async function getLyric(title: string, line: string[]): Promise<{ lyric: TLyric, isHymmnos: boolean, isForeluna: boolean; }> {
  // 日本語と歌詞を取得
  const lyric = line[0].match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF\uF900-\uFAFF]/) ? line[1] : line[0];
  const japanese = lyric === line[0] ? line[1] : line[0];

  // 歌詞と日本語から単語を取得
  const { words, isHymmnos, isForeluna } = getLyricWords(lyric);
  const japaneseWords = await getJapaneseWords(japanese);

  return {
    lyric: {
      title,
      lyric,
      lyricWords: ' ' + words.join(' ').toLocaleLowerCase().replace(/\s+/gi, ' ') + ' ',
      japanese,
      japaneseWords: ' ' + japaneseWords.join(' ').replace(/\s+/gi, ' ') + ' ',
    },
    isHymmnos,
    isForeluna
  };
}

async function getJapaneseWords(text: string): Promise<string[]> {
  const tokens = await tokenize(text) as any;
  const japaneseWords = tokens
    .map((token: any) => {
      const basic = token.basic_form === "*" ? token.surface_form : token.basic_form;
      const surface = token.surface_form;
      return basic + ":" + surface;
    })
    .filter((word: string) => !word.match(/^[\s、。！？\!\?,.（）「」"\(\)]/));
  return japaneseWords;
}

function getLyricWords(lyric: string): { isHymmnos: boolean, words: string[], isForeluna: boolean; } {
  // ヒュムノスかどうか判定
  const lyricWords = splitHymmnos(lyric)[0].filter(w => w.match(/^[a-z=>\-]+$/i));
  const words = lyricWords.map((word) => {
    const wordData = getExactMatch(word);
    return !wordData ? `*` + word : // 単語が見つからない場合は*をつけて返す
      !wordData.subWords?.length ? wordData.hymmnos : // サブワードがない場合は結果を返す
        wordData.primaryMeaning?.match(/〜すること$/) ? [...wordData.subWords.map(w => w.hymmnos), 'za'] : // 「〜すること」の場合はzaを追加
          wordData.primaryMeaning?.match(/〜される$/) ? [...wordData.subWords.map(w => w.hymmnos), 'eh'] : // 「〜される」の場合はehを追加
            wordData.subWords.map(w => w.hymmnos); // それ以外の場合はサブワードを返す
  }).flat();
  // wordsのundefinedが50%以下の場合はヒュムノスとしてwordsを返す
  const hymmnosRate = words.filter(w => !w.match(/\*/)).length / words.length;
  if (words.filter(w => !w.match(/\*/)).length / words.length >= 0.5) {
    return {
      isHymmnos: true,
      isForeluna: hymmnosRate <= 0.5,
      // *を削除
      words: words.map(w => w.replace(/\*/g, ''))
    };
  }
  // フォレルナとして分割
  return {
    isHymmnos: false,
    isForeluna: true,
    words: splitForeluna(lyric)[0].map((word) => word.toLocaleLowerCase())
  };
}