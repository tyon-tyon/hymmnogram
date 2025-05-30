"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kuromoji_1 = __importDefault(require("kuromoji"));
const fs_1 = __importDefault(require("fs"));
const splitForeluna = (text) => text.split("\n").map((line) => line.split(/[\s,."'!]/));
const builder = kuromoji_1.default.builder({
    dicPath: 'node_modules/kuromoji/dict'
});
const tokenize = (text) => {
    return new Promise((resolve, reject) => {
        builder.build((err, tokenizer) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                var tokens = tokenizer.tokenize(text);
                resolve(tokens);
            }
            catch (err) {
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
const lines = fs_1.default.readFileSync(filename, 'utf-8')
    .split('\n\n')
    .map((line, index, lines) => {
    return line.split('\n');
});
(async () => {
    // TLyricの配列に変換
    const lyrics = await Promise.all(lines.map(async (line) => {
        const lyric = line[0].match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF\uF900-\uFAFF]/) ? line[1] : line[0];
        const japanese = lyric === line[0] ? line[1] : line[0];
        const lyricWords = splitForeluna(lyric)[0];
        const tokens = await tokenize(japanese);
        const japaneseWords = tokens
            .map((token) => {
            const basic = token.basic_form === "*" ? token.surface_form : token.basic_form;
            const surface = token.surface_form;
            return basic + ":" + surface;
        })
            .filter((word) => !word.match(/^[\s、。！？\!\?,.（）「」"\(\)]/));
        return {
            title,
            lyric,
            lyricWords: ' ' + lyricWords.join(' ').toLocaleLowerCase().replace(/\s+/gi, ' ') + ' ',
            japanese,
            japaneseWords: ' ' + japaneseWords.join(' ').replace(/\s+/gi, ' ') + ' ',
        };
    }));
    // outフォルダにjsonファイルを出力
    fs_1.default.writeFileSync(`./out/${title}.json`, JSON.stringify(lyrics, null, 2));
})();
//# sourceMappingURL=forelunaLyrics.js.map