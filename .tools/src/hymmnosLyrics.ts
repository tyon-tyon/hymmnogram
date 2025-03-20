import tokenize from './tokenize';
import useDictionary from './useDictionary';
import fs from 'fs';

const { getExactMatch, splitHymmnos } = useDictionary();

const filename = process.argv[2];
// ファイルを2行ずつ読み込む
const lines = fs.readFileSync
    (filename, 'utf-8')
    .split('\n\n')
    .map((line: any, index: any, lines: any) => {
        return line.split('\n');
    });

// 1行目はタイトル
const title = lines[0][0];

// TLyricの配列に変換
const lyrics = [];
(async () => {
    for (const i in lines) {
        const line = lines[i];
        if (line.length < 2) {
            continue;
        }

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
                    wordData.primaryMeaning?.match(/〜すること$/) ? [...wordData.subWords.map(w => w.hymmnos), 'za'] : // 「〜すること」の場合はzaを追加
                        wordData.primaryMeaning?.match(/〜される$/) ? [...wordData.subWords.map(w => w.hymmnos), 'eh'] : // 「〜される」の場合はehを追加
                            wordData.subWords.map(w => w.hymmnos); // それ以外の場合はサブワードを返す
        });
        const correctionWords = correction ? splitHymmnos(correction).map((word) => {
            const wordData = getExactMatch(word);
            return !wordData ? word : // 単語が見つからない場合はそのまま返す
                !wordData.subWords?.length ? wordData.hymmnos : // サブワードがない場合は結果を返す
                    wordData.primaryMeaning?.match(/〜すること$/) ? [...wordData.subWords.map(w => w.hymmnos), 'za'] : // 「〜すること」の場合はzaを追加
                        wordData.primaryMeaning?.match(/〜される$/) ? [...wordData.subWords.map(w => w.hymmnos), 'eh'] : // 「〜される」の場合はehを追加
                            wordData.subWords.map(w => w.hymmnos); // それ以外の場合はサブワードを返す
        }) : null;
        // 
        const tokens = await tokenize(japanese) as any;
        const japaneseWords = tokens
            .map((token: any) => {
                const basic = token.basic_form === "*" ? token.surface_form : token.basic_form;
                const surface = token.surface_form;
                return basic + ":" + surface;
            })
            .filter((word: string) => !word.match(/^[\s、。！？\!\?,.（）「」"\(\)]/));
        lyrics.push({
            title,
            lyric,
            lyricWords: ' ' + lyricWords.flat().join(' ').toLocaleLowerCase().replace(/\s+/gi, ' ') + ' ',
            japanese,
            japaneseWords: ' ' + japaneseWords.join(' ').replace(/\s+/gi, ' ') + ' ',
            ...(unofficial.lyric || unofficial.japanese ? { unofficial } : {}),
            ...(correction ? { correction } : {}),
            ...(correctionWords ? { correctionWords: ' ' + correctionWords.flat().join(' ').toLocaleLowerCase().replace(/\s+/gi, ' ') + ' ' } : {}),
        });
        console.log(title, lyric, japanese);
    }

    // outフォルダにjsonファイルを出力
    fs.writeFileSync(`./out/${title.replace(/\/.+/gi, '')}.json`, JSON.stringify(lyrics, null, 2));
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


