import kuromoji from 'kuromoji';
import { TLyric } from '../../types';
import fs from 'fs';

const splitForeluna = (text: string) => text.split("\n").map((line) => line.split(/[\s,."'!]/));

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

// コマンドラインからタイトルを取得
const args = process.argv.slice(2);
const title = args[0];
// ファイル名はinの中のtxtファイル
const filename = `./in/${title}.txt`;
if (!filename) {
  console.error('ファイル名を指定してください');
  process.exit(1);
}

// ファイルを2行ずつ読み込む
const lines = fs.readFileSync
  (filename, 'utf-8')
  .split('\n\n')
  .map((line: any, index: any, lines: any) => {
    return line.split('\n');
  });
(async () => {
  // TLyricの配列に変換
  const lyrics: TLyric[] = await Promise.all(lines.map(async (line: any) => {
    const lyric = line[0].match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF\uF900-\uFAFF]/) ? line[1] : line[0];
    const japanese = lyric === line[0] ? line[1] : line[0];
    const lyricWords = splitForeluna(lyric)[0];
    const tokens = await tokenize(japanese) as any;
    const japaneseWords = tokens
      .map((token: any) => {
        const basic = token.basic_form === "*" ? token.surface_form : token.basic_form;
        const surface = token.surface_form;
        return basic + ":" + surface;
      })
      .filter((word: string) => !word.match(/^[\s、。！？\!\?,.（）「」"\(\)]/));
    return {
      title,
      lyric,
      lyricWords: ' ' + lyricWords.join(' ').toLocaleLowerCase().replace(/\s+/gi, ' ') + ' ',
      japanese,
      japaneseWords: ' ' + japaneseWords.join(' ').replace(/\s+/gi, ' ') + ' ',
    } as TLyric;
  }));

    // outフォルダにjsonファイルを出力
    fs.writeFileSync(`./out/${title}.json`, JSON.stringify(lyrics, null, 2));
})();


