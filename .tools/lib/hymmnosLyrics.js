"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenize_1 = __importDefault(require("./tokenize"));
const useDictionary_1 = __importDefault(require("./useDictionary"));
const fs_1 = __importDefault(require("fs"));
/*
各フラグ

未歌唱フラグ _
メインの歌唱ではないフラグ -
パートフラグ [1], [2], [3], ...
非公式フラグ *
訂正フラグ !
律史前フラグ @
*/
const { getExactMatch, splitHymmnos } = (0, useDictionary_1.default)();
const filename = process.argv[2];
// ファイルを2行ずつ読み込む
const lines = fs_1.default.readFileSync(filename, 'utf-8')
    .split('\n\n')
    .map((line, index, lines) => {
    return line.split('\n');
});
// 1行目は楽曲データ
const music = lines.shift().join('');
const musicData = JSON.parse(music);
const id = musicData.id;
// TLyricの配列に変換
const lyrics = [];
(async () => {
    for (const i in lines) {
        const line = lines[i];
        console.log(line[0]);
        // 1行目に日本語があれば日本語歌詞
        if (isJapanese(line[0])) {
            // 日本語の場合は日本語歌詞を追加
            lyrics.push(await convertJapanese(line));
        }
        else if (line[0].match(/[a-zA-Z0-9]/)) {
            // ヒュムノス歌詞
            lyrics.push(await convertHymmnos(line));
        }
        else {
            // 空行の場合はスキップ
            if (line[0].match(/^[\s\n]*$/gi)) {
                lyrics.push({
                    musicId: id
                });
            }
        }
    }
    // outフォルダにjsonファイルを出力
    fs_1.default.writeFileSync(`./out/${id}_lyrics.json`, JSON.stringify(lyrics, null, 2));
})();
async function convertJapanese(line) {
    var _a;
    // 全角スペースを半角スペースに変換
    for (let i in line) {
        line[i] = line[i].replace(/[^\S]/g, ' ');
    }
    // 訂正
    let correction = null;
    // 非公式
    let unofficial = null;
    // 未歌唱フラグ
    const unperformed = !!line[0].match(/^_/);
    line[0] = line[0].replace(/^_/, '');
    // メインの歌唱ではないフラグ
    const sub = !!line[0].match(/^-/);
    line[0] = line[0].replace(/^-/, '');
    // パートフラグ
    const part = (_a = line[0].match(/^\[[1-9]\]/)) === null || _a === void 0 ? void 0 : _a[0].replace(/[\[\]]/gi, '');
    line[0] = line[0].replace(/^\[[1-9]\]/, '');
    let japaneseRuby = line[0];
    for (let l of line) {
        if (l.match(/^!/)) {
            correction = correction !== null && correction !== void 0 ? correction : {};
            l = l.replace(/^!/, '');
            correction.japanese = getNoRuby(l);
            correction.japaneseRuby = l;
        }
        else {
            if (l.match(/^\*/)) {
                unofficial = unofficial !== null && unofficial !== void 0 ? unofficial : {};
                unofficial.japanese = true;
                japaneseRuby = l.replace(/^\*/, '');
            }
            else {
                japaneseRuby = l;
            }
        }
    }
    const noRuby = getNoRuby(japaneseRuby);
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ musicId: id, language: 'japanese', japanese: noRuby, japaneseRuby: japaneseRuby, japaneseWords: await getJapaneseWords(noRuby) }, (correction ? { correction } : {})), (unofficial ? { unofficial } : {})), (unperformed ? { unperformed } : {})), (part ? { part: Number(part) } : {})), (sub ? { sub } : {}));
}
async function convertHymmnos(line) {
    var _a;
    // 全角スペースを半角スペースに変換
    for (let i in line) {
        line[i] = line[i].replace(/[^\S]/g, ' ');
    }
    // 未歌唱フラグ
    const unperformed = !!line[0].match(/^_/);
    line[0] = line[0].replace(/^_/, '');
    // メインの歌唱ではないフラグ
    const sub = !!line[0].match(/^-/);
    line[0] = line[0].replace(/^-/, '');
    // パートフラグ
    const part = (_a = line[0].match(/^\[[1-9]\]/)) === null || _a === void 0 ? void 0 : _a[0].replace(/[\[\]]/gi, '');
    line[0] = line[0].replace(/^\[[1-9]\]/, '');
    // 言語
    const language = line[0].match(/^@/) ? 'foreluna' : 'hymmnos';
    let lyric = '';
    let japanese = '';
    let correction = null;
    let unofficial = null;
    for (const l of line) {
        // 日本語がマッチしたら日本語歌詞または訳
        if (isJapanese(l)) {
            if (l.match(/^!/)) {
                // 訂正フラグがある場合は訂正フラグを削除して訂正歌詞を追加
                correction = correction !== null && correction !== void 0 ? correction : {};
                correction.japanese = l.replace(/^!/, '');
            }
            else {
                if (l.match(/^\*/)) {
                    // 非公式フラグがある場合は非公式フラグを削除して非公式歌詞を追加
                    unofficial = unofficial !== null && unofficial !== void 0 ? unofficial : {};
                    unofficial.japanese = true;
                    japanese = l.replace(/^\*/, '');
                }
                else {
                    // 非公式フラグがない場合は日本語歌詞を追加
                    japanese = l;
                }
            }
        }
        else {
            // ヒュムノス歌詞
            if (l.match(/^!/)) {
                // 訂正フラグがある場合は訂正フラグを削除して訂正歌詞を追加
                correction = correction !== null && correction !== void 0 ? correction : {};
                correction.lyric = l.replace(/^!/, '');
            }
            else {
                if (l.match(/^\*/)) {
                    // 非公式フラグがある場合は非公式フラグを削除して非公式歌詞を追加
                    unofficial = unofficial !== null && unofficial !== void 0 ? unofficial : {};
                    unofficial.lyric = true;
                    lyric = l.replace(/^\*/, '');
                }
                else {
                    // 非公式フラグがない場合はヒュムノス歌詞を追加
                    lyric = l;
                }
            }
        }
    }
    // ヒュムノス歌詞を分割
    const lyricWords = getLyricWords(lyric);
    // ヒュムノス訂正歌詞を分割  
    if (correction === null || correction === void 0 ? void 0 : correction.lyric) {
        correction.lyricWords = getLyricWords(correction.lyric);
    }
    // 日本語を分割
    const japaneseWords = await getJapaneseWords(japanese);
    // 日本語訂正を分割
    if (correction === null || correction === void 0 ? void 0 : correction.japanese) {
        const correctionJapaneseWords = await getJapaneseWords(correction.japanese);
        correction.japaneseWords = correctionJapaneseWords;
    }
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ musicId: id, language,
        lyric,
        lyricWords,
        japanese,
        japaneseWords }, (correction ? { correction } : {})), (unofficial ? { unofficial } : {})), (unperformed ? { unperformed } : {})), (part ? { part: Number(part) } : {})), (sub ? { sub } : {}));
}
// 日本語の単語一覧を返す
async function getJapaneseWords(japanese) {
    const noRuby = japanese.replace(/\[(.+?)\]\(.+?\)/g, '$1');
    const tokens = await (0, tokenize_1.default)(noRuby);
    const japaneseWords = tokens
        .map((token) => {
        const basic = token.basic_form === "*" ? token.surface_form : token.basic_form;
        const surface = token.surface_form;
        return basic + ":" + surface;
    })
        .filter((word) => !word.match(/^[\s、。！？\!\?,.（）「」"\(\)]/))
        .join(' ');
    return " " + japaneseWords + " ";
}
// ヒュムノス歌詞を単語で分割する
function getLyricWords(lyric) {
    const words = splitHymmnos(lyric).map((word) => {
        var _a, _b, _c;
        const wordData = getExactMatch(word);
        return !wordData ? word : // 単語が見つからない場合はそのまま返す
            !((_a = wordData.subWords) === null || _a === void 0 ? void 0 : _a.length) ? wordData.hymmnos : // サブワードがない場合は結果を返す
                ((_b = wordData.primaryMeaning) === null || _b === void 0 ? void 0 : _b.match(/〜すること$/)) ? [...wordData.subWords.map((w) => w.hymmnos), 'za'] : // 「〜すること」の場合はzaを追加
                    ((_c = wordData.primaryMeaning) === null || _c === void 0 ? void 0 : _c.match(/〜される$/)) ? [...wordData.subWords.map((w) => w.hymmnos), 'eh'] : // 「〜される」の場合はehを追加
                        wordData.subWords.map((w) => w.hymmnos); // それ以外の場合はサブワードを返す
    });
    return " " + words.flat().join(' ').toLocaleLowerCase().replace(/\s+/gi, ' ') + " ";
}
function isJapanese(line) {
    return line.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\u3400-\u4DBF]/);
}
function getNoRuby(japanese) {
    return japanese.replace(/\[(.+?)\]\(.+?\)/g, '$1');
}
//# sourceMappingURL=hymmnosLyrics.js.map