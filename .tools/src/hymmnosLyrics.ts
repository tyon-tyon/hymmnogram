import { TLyric } from '../../types';
import tokenize from './tokenize.js';
import useDictionary from './useDictionary.js';
import fs from 'fs';

const { getExactMatch } = useDictionary();

const examples = JSON.parse(fs.readFileSync(`./in/examples.json`, 'utf-8'));

const splitHymmnos = (text: string): string[][] => {
    const lines = text.split("\n");
    const linesAndWords = lines.map((line) => {
        const cleanedLine = line
            .replace(/([a-z\.])([\!\?,\s\"\(\)『』「」（）])/gi, "$1\r$2") // , と " の前に改行を入れる
            .replace(/([\!\?,\s\"\(\)『』「」（）])/g, "$1\r") // ! ? , " の前に改行を入れる
            .replace(/(:\/|\/:)/g, "\r$1\r") // :/ と /: の前後に改行を入れる
            .replace(/Xc= */g, "\rXc=\r") // Xc= の前後に改行を入れる
            .replace(/([\<\-\>]{2,})/g, "\r$1\r") // コマンドで使われる文字列の前後に改行を入れる
            .replace(/\/\./g, "\r/.\r") // /. の前後に改行を入れる
            .replace(/\r+/g, "\r") // 連続する改行を1つにする
            .replace(/(^\r|\r$)/, ""); // 先頭と末尾の改行を削除

        // 現段階で`x.`が1つの単語として認識される。
        const words = cleanedLine.split("\r").map((word) => {
            if (word.match(/^[a-z\.]+$/i)) {// ドットと小文字のアルファベットの組み合わせの場合
                // まずはexactly matchを試みる
                const exactMatch = getExactMatch(word);
                // exactMatchがないならドットを分割する
                if (!exactMatch) {
                    return word.replace(/\./g, "\r.\r") // ドットの前後に改行を入れる
                        .replace(/(^\r|\r$)/, "") // 先頭と末尾の改行を削除
                        .split("\r");
                }
            }
            return word;
        });
        return words.flat();
    });
    return linesAndWords;
};


// TLyricの配列に変換
const lyrics = [];
for (const i in examples) {
    const example = examples[i];
    const { title, lyric, japanese } = example;
    const lyricWords = splitHymmnos(lyric)[0];
    const words = lyricWords.map((word) => {
        const wordData = getExactMatch(word);
        return !wordData ? word : // 単語が見つからない場合はそのまま返す
            !wordData.subWords?.length ? wordData.hymmnos : // サブワードがない場合は結果を返す
                wordData.primaryMeaning?.match(/〜すること$/) ? [...wordData.subWords.map(w => w.hymmnos), 'za'] : // 「〜すること」の場合はzaを追加
                    wordData.primaryMeaning?.match(/〜される$/) ? [...wordData.subWords.map(w => w.hymmnos), 'eh'] : // 「〜される」の場合はehを追加
                        wordData.subWords.map(w => w.hymmnos); // それ以外の場合はサブワードを返す
    });
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
        lyricWords: ' ' + words.flat().join(' ').toLocaleLowerCase().replace(/\s+/gi, ' ') + ' ',
        japanese,
        japaneseWords: ' ' + japaneseWords.join(' ').replace(/\s+/gi, ' ') + ' ',
    });
    console.log(title, lyric, japanese);
}

// outフォルダにjsonファイルを出力
fs.writeFileSync(`./out/examples.json`, JSON.stringify(lyrics, null, 2));
fs.writeFileSync(`./out/examples_1.json`, JSON.stringify(lyrics.map(l => (
    {
        "title": l.title,
        "hymmnos": l.lyric,
        "hymmnos_base": l.lyricWords,
        "japanese": l.japanese,
        "japanese_base": l.japaneseWords.replace(/:[^\s]+/gi, ''),
    })), null, 2));


