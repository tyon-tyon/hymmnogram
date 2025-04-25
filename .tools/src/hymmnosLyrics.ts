import tokenize from './tokenize';
import useDictionary from './useDictionary';
import fs from 'fs';
import { TLyric, TMusic } from '@/types/index';

/*
各フラグ

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
        // 行数が1行の場合で
        if (line.length == 1) {
            // 空行の場合はスキップ
            if (line[0].match(/^[\s\n]*$/gi)) {
                lyrics.push({
                    musicId: id
                });
            } else {
                // 日本語の場合は日本語歌詞を追加
                // 非公式フラグ
                const unofficial = {
                    japanese: !!line[0].match(/^\*/),
                };
                // 非公式フラグを削除
                const japanese = line[0].replace(/^\*/g, '');
                const noRuby = japanese.replace(/\[(.+?)\]\(.+?\)/g, '$1');
                lyrics.push({
                    musicId: id,
                    language: 'japanese',
                    japanese: noRuby,
                    japaneseRuby: japanese,
                    japaneseWords: await getJapaneseWords(noRuby),
                    ...(unofficial.japanese ? { unofficial } : {}),
                });
            }
        } else {
            lyrics.push(await convertHymmnos(line));
        }
    }

    // outフォルダにjsonファイルを出力
    fs.writeFileSync(`./out/${id}_lyrics.json`, JSON.stringify(lyrics, null, 2));
    fs.writeFileSync(`./out/${id}_music.json`, JSON.stringify(musicData, null, 2));

    /*
    fs.writeFileSync(`./out/examples_1.json`, JSON.stringify(lyrics.map(l => (
        {
            "title": l.title,
            "hymmnos": l.lyric,
            "hymmnos_base": l.lyricWords,
            "japanese": l.japanese,
            "japanese_base": l.japaneseWords.replace(/:[^\s]+/gi, ''),
        })), null, 2));
    */
})();

async function convertHymmnos(line: string[]): Promise<TLyric> {
    let lyric = line[0];
    let japanese = line[1];
    // 非公式フラグ
    const unofficial = {
        lyric: !!lyric.match(/^\*/),
        japanese: !!japanese.match(/^\*/),
    };
    const language = !!lyric.match(/^\@/) ? 'foreluna' : 'hymmnos';
    lyric = lyric.replace(/^\*/g, '');
    japanese = japanese.replace(/^\*/g, '');
    // 誤字修正版
    const correction = !!lyric.match(/^!/) ? lyric.replace(/^!/, '') : null;
    if (correction) {
        lyric = line[1];
        japanese = line[2];
    }
    // 歌詞を分割
    const lyricWords = splitHymmnos(lyric).map((word) => {
        const wordData = getExactMatch(word);
        return !wordData ? word : // 単語が見つからない場合はそのまま返す
            !wordData.subWords?.length ? wordData.hymmnos : // サブワードがない場合は結果を返す
                wordData.primaryMeaning?.match(/〜すること$/) ? [...wordData.subWords.map((w: any) => w.hymmnos), 'za'] : // 「〜すること」の場合はzaを追加
                    wordData.primaryMeaning?.match(/〜される$/) ? [...wordData.subWords.map((w: any) => w.hymmnos), 'eh'] : // 「〜される」の場合はehを追加
                        wordData.subWords.map((w: any) => w.hymmnos); // それ以外の場合はサブワードを返す
    });
    const correctionWords = correction ? splitHymmnos(correction).map((word) => {
        const wordData = getExactMatch(word);
        return !wordData ? word : // 単語が見つからない場合はそのまま返す
            !wordData.subWords?.length ? wordData.hymmnos : // サブワードがない場合は結果を返す
                wordData.primaryMeaning?.match(/〜すること$/) ? [...wordData.subWords.map((w: any) => w.hymmnos), 'za'] : // 「〜すること」の場合はzaを追加
                    wordData.primaryMeaning?.match(/〜される$/) ? [...wordData.subWords.map((w: any) => w.hymmnos), 'eh'] : // 「〜される」の場合はehを追加
                        wordData.subWords.map((w: any) => w.hymmnos); // それ以外の場合はサブワードを返す
    }) : null;
    const japaneseWords = await getJapaneseWords(japanese);
    return {
        musicId: id,
        lyric,
        lyricWords: ' ' + lyricWords.flat().join(' ').toLocaleLowerCase().replace(/\s+/gi, ' ') + ' ',
        japanese,
        japaneseWords,
        ...(unofficial.lyric || unofficial.japanese ? { unofficial } : {}),
        ...(correction ? { correctionLyric: correction } : {}),
        ...(correctionWords ? { correctionLyricWords: ' ' + correctionWords.flat().join(' ').toLocaleLowerCase().replace(/\s+/gi, ' ') + ' ' } : {}),
        language,
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