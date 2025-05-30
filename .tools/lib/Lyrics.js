"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kuromoji_1 = __importDefault(require("kuromoji"));
const fs_1 = __importDefault(require("fs"));
const useTextProcessor_js_1 = __importDefault(require("./useTextProcessor.js"));
const useDictionary_js_1 = __importDefault(require("./useDictionary.js"));
const { getExactMatch } = (0, useDictionary_js_1.default)();
const { splitHymmnos, splitForeluna } = (0, useTextProcessor_js_1.default)();
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
const lyricsForeluna = [];
const lyricsHymmnos = [];
main();
async function main() {
    await readLyrics('./lyrics');
    console.log(lyricsForeluna.length, lyricsHymmnos.length);
    fs_1.default.writeFileSync('./out/lyrics_foreluna.json', JSON.stringify(lyricsForeluna, null, 2));
    fs_1.default.writeFileSync('./out/lyrics_hymmnos.json', JSON.stringify(lyricsHymmnos, null, 2));
}
// ./in/lyrics/ 配下の.hymファイルを名前順で再起的に読み込む
async function readLyrics(dir) {
    const files = fs_1.default.readdirSync(dir);
    for (const file of files) {
        const path = dir + '/' + file;
        if (fs_1.default.statSync(path).isDirectory()) {
            await readLyrics(path);
        }
        else if (file.match(/\.hym$/)) {
            // ここで処理を行う
            await addLyrics(path);
        }
    }
}
;
// ファイルから lyricsHymmnos に追加する関数
async function addLyrics(filename) {
    // タイトルはファイル名から取得
    // ファイルを空白行で分割
    const lines = fs_1.default.readFileSync(filename, 'utf-8')
        .split('\n\n')
        .map((line) => {
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
        console.log(title, lyric.hymmnos, lyric.japanese);
    }
}
;
async function getLyric(title, line) {
    // 日本語と歌詞を取得
    const lyric = line[0].match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF\uF900-\uFAFF]/) ? line[1] : line[0];
    const japanese = lyric === line[0] ? line[1] : line[0];
    // 歌詞と日本語から単語を取得
    const { words, isHymmnos, isForeluna } = getLyricWords(lyric);
    const japaneseWords = await getJapaneseWords(japanese);
    return {
        lyric: {
            title,
            hymmnos: lyric,
            hymmnosWords: ' ' + words.join(' ').toLocaleLowerCase().replace(/\s+/gi, ' ') + ' ',
            japanese,
            japaneseWords: ' ' + japaneseWords.join(' ').replace(/\s+/gi, ' ') + ' ',
        },
        isHymmnos,
        isForeluna
    };
}
async function getJapaneseWords(text) {
    const tokens = await tokenize(text);
    const japaneseWords = tokens
        .map((token) => {
        const basic = token.basic_form === "*" ? token.surface_form : token.basic_form;
        const surface = token.surface_form;
        return basic + ":" + surface;
    })
        .filter((word) => !word.match(/^[\s、。！？\!\?,.（）「」"\(\)]/));
    return japaneseWords;
}
function getLyricWords(lyric) {
    // ヒュムノスかどうか判定
    const lyricWords = splitHymmnos(lyric)[0].filter(w => w.match(/^[a-z=>\-]+$/i));
    const words = lyricWords.map((word) => {
        var _a, _b, _c;
        const wordData = getExactMatch(word);
        return !wordData ? `*` + word : // 単語が見つからない場合は*をつけて返す
            !((_a = wordData.subWords) === null || _a === void 0 ? void 0 : _a.length) ? wordData.hymmnos : // サブワードがない場合は結果を返す
                ((_b = wordData.primaryMeaning) === null || _b === void 0 ? void 0 : _b.match(/〜すること$/)) ? [...wordData.subWords.map(w => w.hymmnos), 'za'] : // 「〜すること」の場合はzaを追加
                    ((_c = wordData.primaryMeaning) === null || _c === void 0 ? void 0 : _c.match(/〜される$/)) ? [...wordData.subWords.map(w => w.hymmnos), 'eh'] : // 「〜される」の場合はehを追加
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
//# sourceMappingURL=Lyrics.js.map