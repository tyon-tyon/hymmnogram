"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const useDictionary_js_1 = __importDefault(require("./useDictionary.js"));
function default_1() {
    const { getExactMatch } = (0, useDictionary_js_1.default)();
    const splitHymmnos = (text) => {
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
                if (word.match(/^[a-z\.]+$/i)) { // ドットと小文字のアルファベットの組み合わせの場合
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
    const splitForeluna = (text) => {
        return text.split("\n").map((line) => line.split(/[\s,."'!?]/));
    };
    return {
        splitHymmnos,
        splitForeluna,
    };
}
exports.default = default_1;
//# sourceMappingURL=useTextProcessor.js.map