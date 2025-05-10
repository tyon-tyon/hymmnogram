import tokenize from './tokenize';
import useDictionary from './useDictionary';
import fs from 'fs';
import { TLyric, TMusic } from '@/types/index';

/*
各フラグ

未歌唱フラグ _
メインの歌唱ではないフラグ -
パートフラグ [1], [2], [3], ...
非公式フラグ *
訂正フラグ !
律史前フラグ @
*/


const { getExactMatch, splitHymmnos } = useDictionary();

const filename = process.argv[2];
// ファイルを2行ずつ読み込む
const lines = fs.readFileSync
    (filename, 'utf-8')
    .split('\n\n')
    .map((line: any, index: any, lines: any) => {
        return line.split('\n');
    });

// 1行目は楽曲データ
const music = lines.shift().join('');
const musicData = JSON.parse(music) as TMusic;
const id = musicData.id;

// TLyricの配列に変換
const lyrics: TLyric[] = [];
(async () => {
    for (const i in lines) {
        const line = lines[i];
        console.log(line[0]);
        // 1行目に日本語があれば日本語歌詞
        if (isJapanese(line[0])) {
            // 日本語の場合は日本語歌詞を追加
            lyrics.push(await convertJapanese(line));
        } else if (line[0].match(/[a-zA-Z0-9]/)) {
            // ヒュムノス歌詞
            lyrics.push(await convertHymmnos(line));
        } else {
            // 空行の場合はスキップ
            if (line[0].match(/^[\s\n]*$/gi)) {
                lyrics.push({
                    musicId: id
                });
            }
        }
    }
    // outフォルダにjsonファイルを出力
    fs.writeFileSync(`./out/${id}_lyrics.json`, JSON.stringify(lyrics, null, 2));
})();

async function convertJapanese(line: string[]): Promise<TLyric> {
    // 全角スペースを半角スペースに変換
    for (let i in line) {
        line[i] = line[i].replace(/[^\S]/g, ' ');
    }
    // 訂正
    let correction: TLyric['correction'] | null = null;
    // 非公式
    let unofficial: TLyric['unofficial'] | null = null;
    // 未歌唱フラグ
    const unperformed = !!line[0].match(/^_/);
    line[0] = line[0].replace(/^_/, '');
    // メインの歌唱ではないフラグ
    const sub = !!line[0].match(/^-/);
    line[0] = line[0].replace(/^-/, '');
    // パートフラグ
    const part = line[0].match(/^\[[1-9]\]/)?.[0].replace(/[\[\]]/gi, '');
    line[0] = line[0].replace(/^\[[1-9]\]/, '');

    let japaneseRuby = line[0];
    for (let l of line) {
        if (l.match(/^!/)) {
            correction = correction ?? {};
            l = l.replace(/^!/, '');
            correction.japanese = getNoRuby(l);
            correction.japaneseRuby = l;
        } else {
            if (l.match(/^\*/)) {
                unofficial = unofficial ?? {};
                unofficial.japanese = true;
                japaneseRuby = l.replace(/^\*/, '');
            } else {
                japaneseRuby = l;
            }
        }
    }
    const noRuby = getNoRuby(japaneseRuby);
    return {
        musicId: id,
        language: 'japanese',
        japanese: noRuby,
        japaneseRuby: japaneseRuby,
        japaneseWords: await getJapaneseWords(noRuby),
        ...(correction ? { correction } : {}),
        ...(unofficial ? { unofficial } : {}),
        ...(unperformed ? { unperformed } : {}),
        ...(part ? { part: Number(part) } : {}),
        ...(sub ? { sub } : {}),
    };
}

async function convertHymmnos(line: string[]): Promise<TLyric> {
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
    const part = line[0].match(/^\[[1-9]\]/)?.[0].replace(/[\[\]]/gi, '');
    line[0] = line[0].replace(/^\[[1-9]\]/, '');

    // 言語
    const language = line[0].match(/^@/) ? 'foreluna' : 'hymmnos';

    let lyric: string = '';
    let japanese: string = '';
    let correction: TLyric['correction'] | null = null;
    let unofficial: { lyric?: boolean, japanese?: boolean; } | null = null;
    for (const l of line) {
        // 日本語がマッチしたら日本語歌詞または訳
        if (isJapanese(l)) {
            if (l.match(/^!/)) {
                // 訂正フラグがある場合は訂正フラグを削除して訂正歌詞を追加
                correction = correction ?? {};
                correction.japanese = l.replace(/^!/, '');
            } else {
                if (l.match(/^\*/)) {
                    // 非公式フラグがある場合は非公式フラグを削除して非公式歌詞を追加
                    unofficial = unofficial ?? {};
                    unofficial.japanese = true;
                    japanese = l.replace(/^\*/, '');
                } else {
                    // 非公式フラグがない場合は日本語歌詞を追加
                    japanese = l;
                }
            }
        } else {
            // ヒュムノス歌詞
            if (l.match(/^!/)) {
                // 訂正フラグがある場合は訂正フラグを削除して訂正歌詞を追加
                correction = correction ?? {};
                correction.lyric = l.replace(/^!/, '');
            } else {
                if (l.match(/^\*/)) {
                    // 非公式フラグがある場合は非公式フラグを削除して非公式歌詞を追加
                    unofficial = unofficial ?? {};
                    unofficial.lyric = true;
                    lyric = l.replace(/^\*/, '');
                } else {
                    // 非公式フラグがない場合はヒュムノス歌詞を追加
                    lyric = l;
                }
            }
        }
    }

    // ヒュムノス歌詞を分割
    const lyricWords = getLyricWords(lyric);
    // ヒュムノス訂正歌詞を分割  
    if (correction?.lyric) {
        correction.lyricWords = getLyricWords(correction.lyric);
    }
    // 日本語を分割
    const japaneseWords = await getJapaneseWords(japanese);
    // 日本語訂正を分割
    if (correction?.japanese) {
        const correctionJapaneseWords = await getJapaneseWords(correction.japanese);
        correction.japaneseWords = correctionJapaneseWords;
    }
    return {
        musicId: id,
        language,
        lyric,
        lyricWords,
        japanese,
        japaneseWords,
        ...(correction ? { correction } : {}),
        ...(unofficial ? { unofficial } : {}),
        ...(unperformed ? { unperformed } : {}),
        ...(part ? { part: Number(part) } : {}),
        ...(sub ? { sub } : {}),
    } as TLyric;
}

// 日本語の単語一覧を返す
async function getJapaneseWords(japanese: string) {
    const noRuby = japanese.replace(/\[(.+?)\]\(.+?\)/g, '$1');
    const tokens = await tokenize(noRuby) as any;
    const japaneseWords = tokens
        .map((token: any) => {
            const basic = token.basic_form === "*" ? token.surface_form : token.basic_form;
            const surface = token.surface_form;
            return basic + ":" + surface;
        })
        .filter((word: string) => !word.match(/^[\s、。！？\!\?,.（）「」"\(\)]/))
        .join(' ');
    return " " + japaneseWords + " ";
}

// ヒュムノス歌詞を単語で分割する
function getLyricWords(lyric: string) {
    const words = splitHymmnos(lyric).map((word) => {
        const wordData = getExactMatch(word);
        return !wordData ? word : // 単語が見つからない場合はそのまま返す
            !wordData.subWords?.length ? wordData.hymmnos : // サブワードがない場合は結果を返す
                wordData.primaryMeaning?.match(/〜すること$/) ? [...wordData.subWords.map((w: any) => w.hymmnos), 'za'] : // 「〜すること」の場合はzaを追加
                    wordData.primaryMeaning?.match(/〜される$/) ? [...wordData.subWords.map((w: any) => w.hymmnos), 'eh'] : // 「〜される」の場合はehを追加
                        wordData.subWords.map((w: any) => w.hymmnos); // それ以外の場合はサブワードを返す
    });
    return " " + words.flat().join(' ').toLocaleLowerCase().replace(/\s+/gi, ' ') + " ";
}

function isJapanese(line: string) {
    return line.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\u3400-\u4DBF]/);
}

function getNoRuby(japanese: string) {
    return japanese.replace(/\[(.+?)\]\(.+?\)/g, '$1');
} 