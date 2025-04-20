import tokenize from './tokenize';
import useDictionary from './useDictionary';
import fs from 'fs';

// 楽曲データ
type TMusic = {
    id: number,
    title: string,
    description: string,
    feeling: string,
    album: string[],
    singer: string[],
    lyricist: string[],
    composer: string[],
    arranger: string[],
    releaseDate: string,
    characters: string[],
}

type TLyric = {
    id: number,
    // ヒュムノス語歌詞
    hymmnos?: string,
    hymmnosWords?: string,
    // 訂正版ヒュムノス語歌詞
    correctionHymmnos?: string,
    correctionForeluna?: string,
    // 律史前・星語歌詞
    foreluna?: string,
    forelunaWords?: string,
    // 日本語歌詞
    japanese?: string,
    japaneseRuby?: string,
    japaneseWords?: string,
    // 非公式フラグ
    unofficial?: {
        hymmnos: boolean,
        japanese: boolean,
    },
};


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
        // 行数が1行の場合は日本語歌詞
        if (line.length == 1) {
            const noRuby = line[0].replace(/\[(.+?)\]\(.+?\)/g, '$1');
            lyrics.push({
                id,
                japanese: noRuby,
                japaneseRuby: line[0],
                japaneseWords: await getJapaneseWords(noRuby),
            });
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
        id,
        hymmnos: lyric,
        hymmnosWords: ' ' + lyricWords.flat().join(' ').toLocaleLowerCase().replace(/\s+/gi, ' ') + ' ',
        japanese,
        japaneseWords,
        ...(unofficial.lyric || unofficial.japanese ? { unofficial } : {}),
        ...(correction ? { correction } : {}),
        ...(correctionWords ? { correctionWords: ' ' + correctionWords.flat().join(' ').toLocaleLowerCase().replace(/\s+/gi, ' ') + ' ' } : {}),
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