import type { TWordData } from "~/types";


export default function () {
  const { splitTextIntoLinesAndWords } = useTextProcessor();
  const { getExactMatch, emptyWordData } = useDictionary();
  const { getDialectTextClass } = useStyles();
  const editorWords = useState<TWordData[][]>('editorWords', () => []);
  const selectedLineIndex = useState<number>('selectedLineIndex', () => 0);
  const cursorPosition = useState<number>('cursorPosition', () => 0);
  const textareaText = useState<string>('textareaText', () => "");
  const lineHtmls = useState<string[]>('lineHtmls', () => ["\n"]);

  const changeTextarea = (text: string) => {
    textareaText.value = text;
    const lines = splitTextIntoLinesAndWords(text);
    editorWords.value = lines
      .map((words) =>
        words
          .map((word) => {
            const found = getExactMatch(word);
            return found ? { ...found, hymmnos: word } : { ...emptyWordData, hymmnos: word };
          })
      );

    // htmlを生成
    lineHtmls.value = editorWords.value.map((words, lineIndex) => {
      return words
        .map((word) => {
          // 日本語の場合は何もしない
          if (
            word.hymmnos.match(
              /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/
            )
          ) {
            return `<span class="text-black">` + word.hymmnos + `</span>`;
          }
          const dialectClass = getDialectTextClass(word?.dialect ?? null);

          // 単語が存在する場合はその言語で表示
          if (word.dialect)
            return `<span class="${dialectClass}">` + word.hymmnos + `</span>`;

          // 英字が含まれている場合は誤字として表示
          if (word.hymmnos.match(/^[A-Za-z\=\-\>]+$/))
            return (
              `<span class="text-black bg-cool-300 ">` + word.hymmnos + `</span>`
            );

          // それ以外は黒文字で表示
          return `<span class="text-black">` + word.hymmnos + `</span>`;
        })
        .join("");
    });
  };

  const changeCursorPosition = (_cursorPosition: number) => {
    cursorPosition.value = _cursorPosition;
    selectedLineIndex.value =
      textareaText.value.slice(0, _cursorPosition).split("\n").length - 1;
  };

  const addText = (text: string) => {
    // テキストエリアを取得
    const textarea = document.querySelector("textarea");
    if (!textarea) return;
    // フォーカスする
    textarea.focus();
    // カーソル位置に挿入
    document.execCommand("insertText", false, text);
    // フォーカスを解除
    textarea.blur();
  };

  const addWord = (word: TWordData) => {
    addText(
      (
        cursorPosition.value < 1 || textareaText.value.slice(0, cursorPosition.value + 1).match(/^[\s\n]$/)
          ? "" : " "
      )// 空白の場合はスペースを追加
      + word.hymmnos
    );
  };

  const deleteText = () => {
    // テキストエリアを取得
    const textarea = document.querySelector("textarea");
    if (!textarea) return;
    // フォーカスする
    textarea.focus();
    // カーソル位置から1文字削除
    document.execCommand("delete", false);
    // カーソル位置を更新
    changeCursorPosition(cursorPosition.value - 1);
    // フォーカスを解除
    textarea.blur();
  };

  return { changeTextarea, changeCursorPosition, editorWords, selectedLineIndex, textareaText, lineHtmls, addWord, addText, deleteText };
}